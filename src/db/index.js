import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

const client = createClient({
  url: "file:local.db",
});

export const db = drizzle(client, { schema });
export const sql = client;

// Create tables on startup
await client.execute(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL DEFAULT 'password123',
    saint_quartz INTEGER NOT NULL DEFAULT 330,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

await client.execute(`
  CREATE TABLE IF NOT EXISTS servants (
    servant_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    rarity INTEGER NOT NULL,
    noble_phantasm TEXT NOT NULL
  )
`);

await client.execute(`
  CREATE TABLE IF NOT EXISTS user_servants (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    servant_id TEXT NOT NULL REFERENCES servants(servant_id),
    summoned_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

await client.execute(`
  CREATE TABLE IF NOT EXISTS missions (
    mission_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    user_servant_id TEXT NOT NULL,
    servant_id TEXT NOT NULL,
    mission_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    reward_quartz INTEGER NOT NULL DEFAULT 0,
    reward_servant TEXT,
    started_at TEXT DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT
  )
`);

console.log("Database tables ready.");