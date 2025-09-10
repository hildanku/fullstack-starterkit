import { Hono } from 'hono'
import { UserRepository } from './user.repository.js'
import { appResponse } from '../../lib/response.js'
import { FOUND, NOT_FOUND, SOMETHING_WHEN_WRONG } from '../../lib/constant.js'
import { roleMiddleware } from '../../lib/middleware/middleware.js'
import { logger } from '../../config/logging.js'

export const userController = new Hono()
    .use(
        '*',
        roleMiddleware({
            get: ['admin'],
            update: ['admin'],
            create: ['admin'],
            delete: ['admin'],
        }),
    )
    .get('/', async (c) => {
        const userRepo = new UserRepository()
        try {
            const users = await userRepo.list()
            if (!users || users.length === 0) {
                return appResponse(c, 404, `User ${NOT_FOUND}`, null)
            }
            return appResponse(c, 200, `User ${FOUND}`, users)
        } catch (error) {
            logger.error(error)
            return appResponse(c, 500, SOMETHING_WHEN_WRONG, null)
        }
    })
    .get('/:id', async (c) => {
        const userRepo = new UserRepository()
        try {
            const params = c.req.param()
            const id = Number(params.id)
            if (!Number.isFinite(id)) {
                return appResponse(c, 400, 'Invalid user id', null)
            }

            const user = await userRepo.read(id)
            if (!user) {
                return appResponse(c, 404, `User ${NOT_FOUND}`, null)
            }
            return appResponse(c, 200, `User ${FOUND}`, user)
        } catch (error) {
            logger.error(error)
            return appResponse(c, 500, SOMETHING_WHEN_WRONG, null)
        }
    })
