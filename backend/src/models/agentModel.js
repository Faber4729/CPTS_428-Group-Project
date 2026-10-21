/**
 * agentModel.js
 * 
 * tool to allow the robot to give a customer a discount on a product
 * note: this is going to change the price of the item in the db permanently 
 */
import { openDb } from "../db/connection.js";

function discountProduct(pid, pct){
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

export default { discountProduct }
