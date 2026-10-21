import { Router } from "express";
import { fileURLToPath } from "node:url";
import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";
import OpenAI from "openai";

const router = Router();
const frontendIndex = fileURLToPath(
  new URL("../../../frontend/index.html", import.meta.url),
);

const client = new OpenAI();

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

    const response = await client.responses.create({
        model: 'gpt-5.5', // What are we using? TODO
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
        input: message.trim()
    });

    res.json({
        reply: response.output_text
    });

} catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message.");
}
    
});

export default router;