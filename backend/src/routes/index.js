import { Router } from "express";
import { fileURLToPath } from "node:url";
import productModel from "../models/productModel.js";

const router = Router();
const frontendIndex = fileURLToPath(
  new URL("../../../frontend/index.html", import.meta.url),
);

router.get("/", (_req, res) => {
    try {
      const products = productModel.getProducts();
      res.render("index", {products});
  } catch(err) {
      console.error(err);
      res.status(500).json({error: "failed to fetch products"});
  }
  res.sendFile(frontendIndex);
});

router.get("/admin", (_req, res) => {
  try {
    const products = productModel.getProducts();
    res.render("admin", {products});
} catch(err) {
    console.error(err);
    res.status(500).json({error: "failed to fetch products"});
}
res.sendFile(frontendIndex);
});

// For creating products
router.post("/admin", (req, res) => {
  const title = req.body.title?.trim();
  const price = parseFloat(req.body.price);
  const quantity = parseInt(req.body.quantity, 10);

  if (!title || Number.isNaN(price) || price < 0 || Number.isNaN(quantity) || quantity < 0) {
    return res.status(400).send("A title, a valid price, and a valid quantity are required.");
  }

  productModel.createProduct({
    title,
    price,
    quantity,
    description: req.body.description?.trim(),
  });
  res.redirect("/admin");
});

export default router;