/**
 * reviewModel.js
 * 
 * contains functions to insert to/query db for data related to reviews
 */
import { openDb } from "../db/connection.js";


function postReview(productId, reviewName, reviewBody){
   const db = openDb();
   try {
    const result = db
        .prepare("INSERT INTO reviews (associated_product_id, review_name, review_body) VALUES (?, ?, ?)")
        .run(productId, reviewName, reviewBody); 
    return result.lastInsertRowid;
   } finally{
    db.close();
   }
}

function getReviews(productId) {
    const db = openDb();
    try {
        return db
        .prepare("SELECT * FROM reviews WHERE associated_product_id = ?")
        .all(productId);
    } finally {
        db.close();
    }
}

// Get All Reviews for Admin Page
function getAllReviews() { 
    const db = openDb();
    try {
        return db
        .prepare("SELECT * FROM reviews") // Get ALL of them
        .all();
    } finally {
        db.close();
    }
}

function deleteReview(rid) {
    const db = openDb();
    try {
        return db
        .prepare("DELETE FROM reviews where review_id = ?")
        .run(rid);
    } finally {
        db.close();
    }
}

export default { getReviews, postReview, getAllReviews, deleteReview }; 