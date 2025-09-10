import { Hono } from 'hono'
import { userController } from './modules/user/user.controller.js'
import { authController } from './modules/authentication/authentication.controller.js'

export const v1Routes = new Hono()
    .route('/users', userController)
    .route('/auth', authController)
