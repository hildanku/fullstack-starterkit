import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import 'dotenv/config'
import mysql from 'mysql2/promise'
import { drizzleLogger } from '../logging.js'
import postgres from 'postgres'

const DRIVER = process.env.DATABASE_DRIVER
const URL = process.env.DATABASE_URL!

let db: unknown

if (DRIVER === 'mysql') {
    const connection = await mysql.createConnection({ uri: URL })
    db = drizzleMysql(connection, { logger: drizzleLogger })
} else if (DRIVER === 'postgres') {
    const client = postgres(URL)
    db = drizzlePostgres(client, { logger: drizzleLogger })
} else {
    throw new Error(`Unsupported DB_DRIVER: ${DRIVER}`)
}

export { db }