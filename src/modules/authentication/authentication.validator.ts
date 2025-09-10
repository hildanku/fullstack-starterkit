import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string().min(3),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'member']).optional(),
})

export const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
})

export const refreshJWTSchema = z.object({
    refresh_token: z.string().min(10),
})