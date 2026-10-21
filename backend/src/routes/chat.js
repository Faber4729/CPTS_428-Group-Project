import { Router } from "express";
import { fileURLToPath } from "node:url";
import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";
import { GoogleGenAI } from "@google/genai";

const router = Router();
const frontendIndex = fileURLToPath(
  new URL("../../../frontend/index.html", import.meta.url),
);

const ai = new GoogleGenAI({});

// For Posting Messages
router.post("/", async (req, res) => {
    try {
        const message = req.body.message;

        // Get Model All Database Information
        const products = productModel.getProducts();
        const reviews = reviewModel.getAllReviews();

    const productInfo = products.map(product => ({
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
    }));

    const reviewInfo = reviews.map(review => ({
        associated_product_id: review.associated_product_id,
        review_name: review.review_name,
        review_body: review.review_body,
    }));

    const stream = await ai.interactions.create({
        model: "gemini-3.8-flash",
        instructions: `
            You are a shopping assistant.
            Answer questions using only the provided product data.
            Do not invent prices, quantities, or product details.
            If you cannot answer from the data, say so.

            Product catalog:
            ${JSON.stringify(productInfo)}

            Review catalog:
            ${JSON.stringify(reviewInfo)}
        `,
        input: "Explain how AI works",
        stream: true,
      });
    
      let reply = "";

    for await (const event of stream) {
        if(event.type == "content.delta"){
            reply += event.delta;
        }
    }

    res.json({
        reply
    });

} catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message.");
}
    
});

export default router;