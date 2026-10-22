import { Router } from "express";
import { fileURLToPath } from "node:url";
import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";

const router = Router();

router.get("/", (_req, res) => {
    try {
      const products = productModel.getProducts();
      res.render("index", {products});
  } catch(err) {
      console.error(err);
      res.status(500).json({error: "failed to fetch products"});
  }
});

router.get("/admin", (_req, res) => {
  try {
    const products = productModel.getProducts();
    const reviews = reviewModel.getAllReviews();
    res.render("admin", {products, reviews});
} catch(err) {
    console.error(err);
    res.status(500).json({error: "failed to fetch products or reviews"});
}
});

// For creating products
router.post("/admin", (req, res) => {
  const title = req.body.title?.trim();
  const description = req.body.description?.trim();
  const price = parseFloat(req.body.price);
  const quantity = parseInt(req.body.quantity, 10);

  if (!title || Number.isNaN(price) || price < 0 || Number.isNaN(quantity) || quantity < 0) {
    return res.status(400).send("A title, a valid price, and a valid quantity are required.");
  }

  productModel.createProduct(
    title,
    description,
    quantity,
    price,
  );
  res.redirect("/admin");
});

// For deleting products
router.get("/admin/delete/:pid", (req, res) => {
  try {
    productModel.deleteProduct(req.params.pid);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete product.");
  }
});

// For deleting reviews
router.get("/admin/delete/review/:rid", (req, res) => {
  try {
    reviewModel.deleteReview(req.params.rid);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete review.");
  }
});

export default router;