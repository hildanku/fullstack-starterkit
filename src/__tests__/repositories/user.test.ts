import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { db } from '../../config/db/index.js'
import { userTable } from '../../config/db/schema/postgres.js'
import { eq } from 'drizzle-orm'
import { UserRepository } from '../../modules/user/user.repository.js'

vi.mock('../../config/db/index.js', () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    }
}))

vi.mock('drizzle-orm', () => ({
    eq: vi.fn()
}))

describe('UserRepository', () => {
    let userRepository: UserRepository
    let mockUser: any
    let mockUsers: any[]

    beforeEach(() => {
        userRepository = new UserRepository()
        mockUser = {
            id: 1,
            username: 'testuser',
            name: 'Test User',
            email: 'test@example.com',
            role: 'operator',
            created_at: Date.now(),
            updated_at: Date.now(),
            avatar: null
        }
        mockUsers = [
            mockUser,
            {
                id: 2,
                username: 'manager',
                name: 'Manager User',
                email: 'manager@example.com',
                role: 'production_manager',
                created_at: Date.now(),
                updated_at: Date.now(),
                avatar: null
            }
        ]

        vi.resetAllMocks()

        vi.mocked(eq).mockReturnValue({ sqlSegment: 'id = ?', params: [1] } as any)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('findById', () => {
        it('should return a user when found', async () => {
            const mockSelectChain = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue([mockUser])
            }

            vi.mocked(db.select).mockReturnValue(mockSelectChain as any)

            const result = await userRepository.findById({ id: 1 })

            expect(db.select).toHaveBeenCalledTimes(1)
            expect(mockSelectChain.from).toHaveBeenCalledWith(userTable)
            expect(mockSelectChain.where).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockUser)
        })

        it('should return null when user is not found', async () => {
            const mockSelectChain = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue([])
            }

            vi.mocked(db.select).mockReturnValue(mockSelectChain as any)

            const result = await userRepository.findById({ id: 999 })

            expect(db.select).toHaveBeenCalledTimes(1)
            expect(result).toBeNull()
        })
    })

    describe('create', () => {
        it('should create and return a new user', async () => {
            const newUserData = {
                username: 'newuser',
                name: 'New User',
                email: 'new@example.com',
                // role: 'member'
            }

            const mockInsertChain = {
                values: vi.fn().mockReturnThis(),
                $returningId: vi.fn().mockResolvedValue([{ id: 1 }])
            }

            vi.mocked(db.insert).mockReturnValue(mockInsertChain as any)

            userRepository.findById = vi.fn().mockResolvedValue(mockUser)

            const result = await userRepository.create(newUserData)

            expect(db.insert).toHaveBeenCalledTimes(1)
            expect(mockInsertChain.values).toHaveBeenCalledWith(newUserData)
            expect(userRepository.findById).toHaveBeenCalledWith({ id: 1 })
            expect(result).toEqual(mockUser)
            expect(userRepository.user).toEqual([mockUser])
        })

        it('should throw an error if user creation fails', async () => {
            const newUserData = {
                username: 'newuser',
                name: 'New User',
                email: 'new@example.com'
            }

            const mockInsertChain = {
                values: vi.fn().mockReturnThis(),
                $returningId: vi.fn().mockResolvedValue([{ id: 1 }])
            }

            vi.mocked(db.insert).mockReturnValue(mockInsertChain as any)

            userRepository.findById = vi.fn().mockResolvedValue(null)

            await expect(userRepository.create(newUserData)).rejects.toThrow('Failed to create user')
        })
    })

    describe('read', () => {
        it('should call findById and return the result', async () => {
            userRepository.findById = vi.fn().mockResolvedValue(mockUser)

            const result = await userRepository.read(1)

            expect(userRepository.findById).toHaveBeenCalledWith({ id: 1 })
            expect(result).toEqual(mockUser)
        })
    })

    describe('update', () => {
        it('should update and return the updated user', async () => {
            const updateData = {
                name: 'Updated Name',
                email: 'updated@example.com'
            }

            const mockUpdateChain = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue(undefined)
            }

            vi.mocked(db.update).mockReturnValue(mockUpdateChain as any)

            const updatedUser = { ...mockUser, ...updateData }
            userRepository.findById = vi.fn().mockResolvedValue(updatedUser)

            const result = await userRepository.update(1, updateData)

            expect(db.update).toHaveBeenCalledTimes(1)
            expect(mockUpdateChain.set).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Updated Name',
                email: 'updated@example.com',
                updated_at: expect.any(Number)
            }))
            expect(userRepository.findById).toHaveBeenCalledWith({ id: 1 })
            expect(result).toEqual(updatedUser)
            expect(userRepository.user).toEqual([updatedUser])
        })

        it('should throw an error if user is not found after update', async () => {
            const updateData = {
                name: 'Updated Name'
            }

            const mockUpdateChain = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue(undefined)
            }

            vi.mocked(db.update).mockReturnValue(mockUpdateChain as any)

            userRepository.findById = vi.fn().mockResolvedValue(null)

            await expect(userRepository.update(1, updateData)).rejects.toThrow('User with id 1 not found')
        })
    })

    describe('delete', () => {
        it('should delete a user and return true on success', async () => {
            const mockDeleteChain = {
                where: vi.fn().mockResolvedValue(undefined)
            }

            vi.mocked(db.delete).mockReturnValue(mockDeleteChain as any)

            const result = await userRepository.delete(1)

            expect(db.delete).toHaveBeenCalledWith(userTable)
            expect(mockDeleteChain.where).toHaveBeenCalledTimes(1)
            expect(result).toBe(true)
            expect(userRepository.user).toEqual([])
        })

        it('should return false on delete error', async () => {

            const mockDeleteChain = {
                where: vi.fn().mockRejectedValue(new Error('Delete error'))
            }

            vi.mocked(db.delete).mockReturnValue(mockDeleteChain as any)

            console.error = vi.fn()

            const result = await userRepository.delete(1)

            expect(db.delete).toHaveBeenCalledWith(userTable)
            expect(mockDeleteChain.where).toHaveBeenCalledTimes(1)
            expect(console.error).toHaveBeenCalledWith(expect.any(Error))
            expect(result).toBe(false)
        })
    })

    describe('list', () => {
        it('should return all users', async () => {
            const mockSelectChain = {
                from: vi.fn().mockResolvedValue(mockUsers)
            }

            vi.mocked(db.select).mockReturnValue(mockSelectChain as any)

            const result = await userRepository.list()

            expect(db.select).toHaveBeenCalledTimes(1)
            expect(mockSelectChain.from).toHaveBeenCalledWith(userTable)
            expect(result).toEqual(mockUsers)
        })
    })
})
