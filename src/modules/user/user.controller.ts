import { Hono } from 'hono'
import { UserRepository } from './user.repository.js'
import { appResponse } from '../../lib/response.js'
import { FOUND, NOT_FOUND, SOMETHING_WHEN_WRONG } from '../../lib/constant.js'

export const userController = new Hono()
    .get('/', async (c) => {
        const userRepo = new UserRepository()

        try {
            const users = await userRepo.list()
            if (!users || users.length === 0) {
                return appResponse(c, 404, `User ${NOT_FOUND}`, null)
            }
            return appResponse(c, 200, `User ${FOUND}`, users)
        } catch (error) {
            console.error(error)
            return appResponse(c, 500, SOMETHING_WHEN_WRONG, null)
        }
    })
