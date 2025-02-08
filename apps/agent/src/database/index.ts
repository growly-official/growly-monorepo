import { SupabaseDatabaseAdapter } from '@elizaos/adapter-supabase';
import { SqliteDatabaseAdapter } from '@elizaos/adapter-sqlite';
import Database from 'better-sqlite3';
import path from 'path';
import { elizaLogger } from '@elizaos/core';

export function initializeDatabase(dataDir: string) {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const db = new SupabaseDatabaseAdapter(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    elizaLogger.info(`Using Supabase for database adapter!`);
    return db;
  } else {
    const filePath = process.env.SQLITE_FILE ?? path.resolve(dataDir, 'db.sqlite');
    // ":memory:";
    const db = new SqliteDatabaseAdapter(new Database(filePath));
    elizaLogger.info(`Using local SQLite for database adapter!`);
    return db;
  }
}
