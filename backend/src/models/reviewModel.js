/**
 * reviewModel.js
 * 
 * contains functions to insert to/query db for data related to reviews
 */
import { openDb } from "../db/connection.js";


function postReview(productId, reviewBody){
   const db = openDb();
   try {
    const result = db
        .prepare("INSERT INTO reviews (product_id, body) VALUES (?, ?)")
        .run(productId, reviewBody); 
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

export default { getReviews, postReview }; 