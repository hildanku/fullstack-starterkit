import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { loginSchema, refreshJWTSchema, registerSchema } from './authentication.validator.js'
import { UserRepository } from '../user/user.repository.js'
import { AuthenticationRepository } from './authentication.repository.js'
import { appResponse } from '../../lib/response.js'
import { hash, verify } from '@node-rs/argon2'
import { env } from 'hono/adapter'
import type { ENV } from '../../lib/types.js'
import { JWTService } from '../../lib/middleware/jwt.js'
import { jwtMiddleware } from '../../lib/middleware/middleware.js'
import { logger } from '../../config/logging.js'
import { SOMETHING_WHEN_WRONG } from '../../lib/constant.js'


export const authController = new Hono()
    .post('/register', zValidator('form', registerSchema), async (c) => {
        const form = c.req.valid('form')
        const userRepo = new UserRepository()
        const authRepo = new AuthenticationRepository()

        try {
            const existingUser = await userRepo.findByUsername({ username: form.username })
            if (existingUser.length > 0 || existingUser) {
                logger.info('Username already taken')
                return appResponse(c, 400, 'username already taken', null)
            }

            const user = await userRepo.create({
                role: form.role || 'member',
                username: form.username,
                email: form.email,
                name: form.name,
                avatar: null,
            })

            const hashed = await hash(form.password)
            await authRepo.create({
                user: user.id,
                refresh_token: null,
                hash_password: hashed,
            })
            logger.info(user)
            return appResponse(c, 201, 'register success', user)
        } catch (error) {
            logger.error(error)
            return appResponse(c, 500, SOMETHING_WHEN_WRONG, null)
        }
    })
    .post('/login', zValidator('form', loginSchema), async (c) => {
        const valid = c.req.valid('form')
        const userRepo = new UserRepository()
        const authRepo = new AuthenticationRepository()

        try {
            const [user] = await userRepo.findByUsername({ username: valid.username })
            if (!user) {
                logger.error(`Someone has failed to log in with the username: ${valid.username}`)
                return appResponse(c, 400, 'username/password is wrong', null)
            }

            const [auth] = await authRepo.findByUser({ user: user.id })
            const validPassword = await verify(auth.hash_password, valid.password)
            if (!validPassword) {
                logger.error(`Someone has failed to log in with the username: ${valid.username}`)
                return appResponse(c, 400, 'username/password is wrong', null)
            }
            const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env<ENV>(c)
            const jwt = new JWTService(JWT_ACCESS_SECRET, JWT_REFRESH_SECRET)

            const accessToken = await jwt.createAccess(user.id)
            const refreshToken = await jwt.createRefresh(user.id)

            await authRepo.update(auth.id, { refresh_token: refreshToken })
            logger.info(`Someone has successfully logged in with the username ${valid.username}`)
            return appResponse(c, 200, 'login success', {
                access_token: accessToken,
                refresh_token: refreshToken,
            })
        } catch (error) {
            logger.error(error)
            return appResponse(c, 500, SOMETHING_WHEN_WRONG, null)
        }
    })
    .post('/refresh', zValidator('form', refreshJWTSchema), async (c) => {
        const valid = c.req.valid('form')
        const authRepo = new AuthenticationRepository()
        try {
            const decoded = JWTService.decode(valid.refresh_token)
            if (!decoded || !decoded.sub) {
                return appResponse(c, 401, 'invalid refresh token', null)
            }

            const [auth] = await authRepo.findByUser({ user: Number(decoded.sub) })

            if (!auth || auth.refresh_token !== valid.refresh_token) {
                return appResponse(c, 400, 'invalid refresh token', null)
            }

            const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env<ENV>(c)
            const jwt = new JWTService(JWT_ACCESS_SECRET, JWT_REFRESH_SECRET)

            const newAccess = await jwt.createAccess(Number(decoded.sub))
            const newRefresh = await jwt.createRefresh(Number(decoded.sub))

            await authRepo.update(auth.id, { refresh_token: newRefresh })
            return appResponse(c, 200, 'refresh success', {
                access_token: newAccess,
                refresh_token: newRefresh,
            })
        } catch (error) {
            logger.error(error)
            return appResponse(c, 500, SOMETHING_WHEN_WRONG, null)
        }
    })
    .get('/current_user', jwtMiddleware, async (c) => {
        const token = c.req.header('Authorization')!
        const userRepo = new UserRepository()
        try {
            const user = await userRepo.findByToken({ token })

            if (!user) return appResponse(c, 404, 'user not found', null)
            return appResponse(c, 200, 'success', user)
        } catch (error) {
            logger.error(error)
            return appResponse(c, 500, SOMETHING_WHEN_WRONG, null)
        }
    })
    .delete('/logout', jwtMiddleware, async (c) => {
        const token = c.req.header('Authorization')!
        const authRepo = new AuthenticationRepository()

        try {
            const claims = JWTService.decode(token)

            if (!claims?.sub) return appResponse(c, 401, 'unauthorized', null)

            const [auth] = await authRepo.findByUser({ user: Number(claims.sub) })
            await authRepo.update(auth.id, { refresh_token: null })

            return appResponse(c, 200, 'logout success', null)
        } catch (error) {
            logger.error(error)
            return appResponse(c, 500, SOMETHING_WHEN_WRONG, null)
        }

    })
