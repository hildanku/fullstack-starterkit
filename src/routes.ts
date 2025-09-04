import { Hono } from 'hono'
import { userController } from './modules/user/user.controller.js'

export const v1Routes = new Hono()
    .route('/users', userController)
