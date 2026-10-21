import { Router } from "express";
import { fileURLToPath } from "node:url";
import { productModel } from "../models/productModelModel.js";

const router = Router();
const frontendIndex = fileURLToPath(
  new URL("../../../frontend/index.html", import.meta.url),
);

router.get("/", (_req, res) => {
    try {
      const products = productModel.getProducts();
      res.render("products", {products});
  } catch(err) {
      console.error(err);
      res.status(500).json({error: "failed to fetch products"});
  }
  res.sendFile(frontendIndex);
});

export default router;