import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from '../config/logging.js'

// Mock Winston Console Transport
const logSpy = vi.spyOn((console as any)._stdout, 'write')

describe('Logger', () => {
    beforeEach(() => {
        logSpy.mockClear()
    })

    it('should log an info message', () => {
        logger.info('This is an info message')
        expect(logSpy).toHaveBeenCalled()
        expect(logSpy.mock.calls[0][0]).toContain('info')
        expect(logSpy.mock.calls[0][0]).toContain('This is an info message')
    })

    it('should log an error message', () => {
        logger.error('This is an error message')
        expect(logSpy).toHaveBeenCalled()
        expect(logSpy.mock.calls[0][0]).toContain('error')
        expect(logSpy.mock.calls[0][0]).toContain('This is an error message')
    })

    it('should log with timestamp', () => {
        logger.info('Check timestamp')
        expect(logSpy).toHaveBeenCalled()
        expect(logSpy.mock.calls[0][0]).toMatch(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/)
    })
})
