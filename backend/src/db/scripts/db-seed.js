/**
 * db-seed.js
 * 
 * seeds db with dummy products and reviews 
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from '../connection.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(
  fs.readFileSync(path.join(here, '../../seed-data.json'), 'utf8')
);

export function seedDb(db) {
    const insertProduct = db.prepare(
        'INSERT INTO products (product_id, title, description, quantity, price) VALUES (?, ?, ?, ?, ?)'
    );
    const insertReview = db.prepare(
        'INSERT INTO reviews (review_id, associated_product_id, review_name, review_body) VALUES (?, ?, ?, ?)'
    );

    db.transaction(() => {
        for (const p of seed.products){
            insertProduct.run(p.product_id, p.title, p.description, p.quantity, p.price);
        }
        for (const r of seed.reviews){
            insertReview.run(r.review_id, r.associated_product_id, r.review_name, r.review_body);
        }
    })();
}
const db = openDb();

try {
    seedDb(db);
    console.log("Data seeded");
} catch (err) {
    console.error(err);
    process.exitCode = 1;
} finally {
    db.close();
}