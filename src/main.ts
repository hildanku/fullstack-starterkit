import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { v1Routes } from './routes.js'
import { logger } from 'hono/logger'
import { appResponse } from './lib/response.js'

const app = new Hono()
    .use('*', logger())
    .route('/api/v1', v1Routes)
    .get('/api/v1/healthcheck', async (c) => {
        return appResponse(c, 200, 'OK', null)
    })

serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})
