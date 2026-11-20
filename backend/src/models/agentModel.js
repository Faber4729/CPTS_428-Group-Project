/**
 * agentModel.js
 * 
 * tool to allow the robot to give a customer a discount on a product
 * note: this is going to change the price of the item in the db permanently 
 */
import { openDb } from "../db/connection.js";

function discountProduct(pid, pct){
   // D3 mitigation - enforce the cap at the data layer too
   const percent = Number(pct);
   if (!Number.isFinite(percent) || percent <= 0 || percent > 10) {
     throw new Error("Discount must be more than 0 and at most 10%.");
   }
   const db = openDb();
   try {
        db   
        .prepare("UPDATE products SET price = ROUND(price * (1 - ? / 100.0), 2) WHERE product_id = ?")
        .run(pct, pid); 
    return db
        .prepare("SELECT product_id, price FROM products WHERE product_id = ?")
        .get(pid);
   } finally {
    db.close();
   }
}

// Added Read Only for Getting Shipping Information
function getShippingInfo(pid){
    const db = openDb();
   try {
        db   
        .prepare("SELECT product_id, supplier_note FROM products WHERE product_id = ?")
        .get(pid);
   } finally {
    db.close();
   }
}

export default { discountProduct }
