import { eq } from "drizzle-orm"
import { authenticationTable, type Authentication } from "../../config/db/schema/postgres.js"
import type { BaseRepository } from "../../lib/repository.js"
import { db } from "../../config/db/index.js"

type FindByUser = {
    user: number // <- user id
}

type FindByUsername = {
    username: string
}

export interface AuthEntity extends Authentication { }

export class AuthenticationRepository implements Omit<BaseRepository<AuthEntity | null>, 'list' | 'findByUser'> {
    private auth: AuthEntity[] = []

    async create(data: Partial<AuthEntity | null>): Promise<AuthEntity | null> {
        const now = Math.floor(Date.now() / 1000)

        if (!data || !data.hash_password) {
            throw new Error("hash_password is required");
        }

        const result = await db
            .insert(authenticationTable)
            .values({
                hash_password: data.hash_password,
                user: data.user,
                refresh_token: data.refresh_token,
                created_at: now,
                updated_at: now
            })
            .returning();

        return result.length > 0 ? result[0] : null
    }

    async read(id: number): Promise<AuthEntity | null> {
        const auth = await db
            .select()
            .from(authenticationTable)
            .where(eq(authenticationTable.id, id))
            .limit(1)

        this.auth = auth
        return auth.length > 0 ? auth[0] : null
    }

    async update(id: number, data: Partial<AuthEntity | null>): Promise<AuthEntity | null> {
        const now = Math.floor(Date.now() / 1000)

        if (!data) {
            throw new Error("No data provided for update");
        }

        const updated = await db
            .update(authenticationTable)
            .set({
                ...data,
                updated_at: now
            })
            .where(eq(authenticationTable.id, id))
            .returning()

        this.auth = updated
        return updated.length > 0 ? updated[0] : null
    }

    async delete(id: number): Promise<boolean> {
        try {
            await db.delete(authenticationTable).where(eq(authenticationTable.id, id))
            this.auth = []
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async findByUser(data: FindByUser): Promise<AuthEntity[]> {
        const auth = await db
            .select()
            .from(authenticationTable)
            .where(eq(authenticationTable.user, data.user))
            .limit(1)

        this.auth = auth
        return auth
    }
}
