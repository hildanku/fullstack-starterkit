import { env } from 'hono/adapter'
import type { Context } from 'hono'
import type { BlankEnv, Next } from 'hono/types'
import type { ENV, Role, roleMiddlewareArgs } from '../types.js'
import { appResponse } from '../response.js'
import { JWTService } from './jwt.js'
import { UserRepository } from '../../modules/user/user.repository.js'

export const jwtMiddleware = async (c: Context<BlankEnv, '*', {}>, next: Next) => {
    const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env<ENV>(c)
    const jwtService = new JWTService(JWT_ACCESS_SECRET, JWT_REFRESH_SECRET)

    const accessToken = c.req.header('Authorization') || ''
    const validAccess = jwtService.validateAccess(accessToken)

    if (validAccess) {
        await next()
    } else {
        c.res = appResponse(c, 401, 'Unauthorize', null)
    }
}

export const roleMiddleware = (args: roleMiddlewareArgs) => {
    return async (c: Context<BlankEnv, '*', {}>, next: Next) => {
        const accessToken = c.req.header('Authorization') || ''
        const userRepo = new UserRepository()

        try {
            const methodRoles: Record<string, Role[]> = {
                get: args.get,
                post: args.create,
                patch: args.update,
                put: args.update,
                delete: args.delete,
            }

            const role = methodRoles[c.req.method.toLowerCase()]
            if (!role) throw new Error('Invalid request method')

            const user = await userRepo.findByToken({ token: accessToken })
            if (!user || user.id === null) throw new Error('Invalid user')

            if (role.includes(user.role as Role)) {
                await next()
            } else {
                throw new Error('Unauthorized role')
            }
        } catch {
            c.res = appResponse(c, 401, 'Unauthorize', null)
        }
    }
}