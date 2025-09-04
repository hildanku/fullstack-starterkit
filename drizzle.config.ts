import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const DRIVER = process.env.DATABASE_DRIVER
let schemaPath = ''
let dialect: 'mysql' | 'postgresql'

if (DRIVER === 'mysql') {
    schemaPath = './src/config/db/schema/mysql.ts'
    dialect = 'mysql'
} else if (DRIVER === 'postgresql') {
    schemaPath = './src/config/db/schema/postgres.ts'
    dialect = 'postgresql'
} else {
    throw new Error(`Unsupported DATABASE_DRIVER: ${DRIVER}`)
}

export default defineConfig({
    out: 'drizzle',
    schema: schemaPath,
    dialect,
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
})
