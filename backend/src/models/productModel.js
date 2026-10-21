/**
 * productModel.js
 * 
 * Ripoff of Ingrid's model to pull products instead of reviews
 */
import { openDb } from "../db/connection.js";

function createProduct(title, description, quantity, price){
   const db = openDb();
   try {
    const result = db
        .prepare("INSERT INTO products (title, description, quantity, price) VALUES (?, ?, ?, ?)")
        .run(title, description, quantity, price); 
    return result.lastInsertRowid; // Returns product ID
   } finally{
    db.close();
   }
}

function getProduct(productId) {
    const db = openDb();
    try {
        return db
        .prepare("SELECT * FROM products WHERE associated_product_id = ?") // We're just hoping no two have the same id (they shouldn't)
        .all(productId);
    } finally {
        db.close();
    }
}

export default { createProduct, getProduct }; 