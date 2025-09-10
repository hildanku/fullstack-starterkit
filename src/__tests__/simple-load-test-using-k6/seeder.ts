
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import { db } from "../../config/db/index.js";
import { userTable, type User } from "../../config/db/schema/postgres.js";

// ESM fix untuk __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedUsersFromFile() {
    const filePath = path.join(__dirname, "./dummy_users.txt");

    const users: User[] = [];

    // Baca file pakai stream
    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: "\t" })) // file dummy_users.txt pakai TAB
            .on("data", (row) => {
                users.push({
                    //id: Number(row.id),
                    created_at: Number(row.created_at),
                    updated_at: Number(row.updated_at),
                    username: row.username,
                    email: row.email,
                    name: row.name,
                    role: row.role,
                    avatar: row.avatar,
                } as User);
            })
            .on("end", () => {
                console.log(`📄 Parsed ${users.length} users from file`);
                resolve();
            })
            .on("error", (err) => reject(err));
    });

    // Insert batch
    await db.insert(userTable).values(users).onConflictDoNothing();

    console.log(`✅ Inserted ${users.length} users into database`);
}

seedUsersFromFile()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Error seeding users:", err);
        process.exit(1);
    });

