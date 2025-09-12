import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { v1Routes } from './routes.js'
import { logger } from 'hono/logger'
import { appResponse } from './lib/response.js'
import { cors } from 'hono/cors'

const app = new Hono()
    .use('*', logger())
    .use('*', cors())
    .route('/api/v1', v1Routes)
    .get('/api/v1/healthcheck', async (c) => {
        return appResponse(c, 200, 'OK', null)
    })

serve({
    fetch: app.fetch,
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})

export type AppType = typeof app
export { app }
