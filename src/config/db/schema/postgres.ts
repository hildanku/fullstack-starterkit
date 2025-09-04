import { sql } from "drizzle-orm"
import { char, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core"

export const roleEnum = pgEnum('role', [
    'admin',
    'member',
])


export const userTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    created_at: integer('created_at')
        .notNull()
        .default(sql`extract(epoch from now())`),
    updated_at: integer('updated_at')
        .notNull()
        .default(sql`extract(epoch from now())`),
    username: char('username', { length: 100 }).notNull().unique(),
    email: char('email', { length: 100 }).notNull().unique(),
    name: text('name').notNull(),
    role: roleEnum('role')
        .default('member')
        .notNull(),
    avatar: text('avatar'),
})

export type User = typeof userTable.$inferSelect

export const authenticationTable = pgTable('authentications', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    created_at: integer('created_at')
        .notNull()
        .default(sql`extract(epoch from now())`),
    updated_at: integer('updated_at')
        .notNull()
        .default(sql`extract(epoch from now())`),
    user: integer('user').references(() => userTable.id, { onDelete: 'cascade' }),
    hash_password: text('hash_password').notNull(),
    refresh_token: text('refresh_token'),
})

export type Authentication = typeof authenticationTable.$inferSelect