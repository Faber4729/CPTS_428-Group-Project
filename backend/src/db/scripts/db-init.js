/**
 * db-init.js
 * 
 * Creates tables outlined in the schema 
*/

import fs from 'node:fs';
import { openDb, SCHEMA_PATH } from '../connection.js';

const db = openDb();
const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');


try {
    db.transaction(() => db.exec(schema))();
    console.log('Db schema applied, tables created');

} catch (err) {
    console.error(err);
    process.exitCode = 1;

} finally {
    db.close();
}