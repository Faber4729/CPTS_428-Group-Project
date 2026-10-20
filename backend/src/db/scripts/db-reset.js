/**
 * db-reset.js
 * 
 * Drops and re-creates tables outlined in the schema 
*/

import fs from 'node:fs';
import { openDb, SCHEMA_PATH } from '../connection.js';

const db = openDb();

// TODO: Add flag to safeguard from accidentally resetting our entire db
try {
    db.transaction(() => {
        db.exec('DROP TABLE IF EXISTS reviews;');
        db.exec('DROP TABLE IF EXISTS products;');

        // re-create tables
        db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    })();
    console.log('Db reset');

} catch (err) {
    console.error(err);
    process.exitCode = 1;
} finally {
    db.close();
}