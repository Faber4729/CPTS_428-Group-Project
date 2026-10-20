import Database from "better-sqlite3";
import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url))

export const DB_PATH = path.resolve(here, '../../data/app.db');
export const SCHEMA_PATH = path.join(here, 'schema.sql');

export function openDb() {
    fs.mkdirSync(path.dirname(DB_PATH), {recursive: true});
    const db = new Database(DB_PATH);
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
    return db;
}