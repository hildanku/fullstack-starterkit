import z from 'zod'

export const loginSchema = z.object({
    username: z.string({ message: 'Username tidak valid' }),
    password: z
        .string({ message: 'Password tidak valid' })
        .min(8, { message: 'Password minimal 8 karakter' })
        .max(255, { message: 'Password terlalu panjang' }),
})
