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

function getProducts() {
    const db = openDb();
    try {
        return db
        .prepare("SELECT * FROM products") // Get ALL of them
        .all();
    } finally {
        db.close();
    }
}

function getProduct(pid) {
    const db = openDb();
    try {
        return db
        .prepare("SELECT * FROM products where product_id = ?")
        .get(pid) ?? null; // Either finds product or has null
    } finally {
        db.close();
    }
}

function deleteProduct(pid) {
    const db = openDb();
    try {
        return db
        .prepare("DELETE FROM products where product_id = ?")
        .run(pid);
    } finally {
        db.close();
    }
}

export default { createProduct, getProducts, getProduct, deleteProduct, }; 