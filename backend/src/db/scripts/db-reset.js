/**
 * db-reset.js
 * 
 * Drops and re-creates tables outlined in the schema 
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb, SCHEMA_PATH } from '../connection.js';

export function resetDb(db) {
    db.transaction(() => {
        db.exec('DROP TABLE IF EXISTS reviews;');
        db.exec('DROP TABLE IF EXISTS products;');

        db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    })();
}

export function main(argv = process.argv.slice(2)) {
    if (!argv.includes('--force')) {
        console.error("Did you mean to reset the database? If so, run `npm run db:reset -- --force`");
        process.exitCode = 1;
        return;
    }

    const db = openDb();
    try {
        resetDb(db);
        console.log('Db reset');
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        db.close();
    }
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
    main();
}