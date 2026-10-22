/**
 * db-reset.js
 * 
 * Drops and re-creates tables outlined in the schema 
*/

import fs from 'node:fs';
import { openDb, SCHEMA_PATH } from '../connection.js';

const force = process.argv.includes('--force'); // bool for force flag

if (!force) {
    console.log("Did you mean to reset the database? If so, run `npm run db:reset -- --force`");
    process.exit(1); 
}
const db = openDb();

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