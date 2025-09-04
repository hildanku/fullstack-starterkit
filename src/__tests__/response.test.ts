import type { Context } from 'hono'
import { appResponse } from '../lib/response.js'
import { describe, it, expect, vi } from 'vitest'

describe('appResponse', () => {
    it('should return JSON response with correct structure and status', () => {

        // Mock
        const jsonMock = vi.fn()
        const c = {
            json: jsonMock,
        } as unknown as Context

        const status = 200
        const message = 'Success'
        const result = { data: 'Hello' }

        appResponse(c, status, message, result)

        expect(jsonMock).toHaveBeenCalledWith(
            {
                message,
                result,
            },
            status
        )
    })
})

