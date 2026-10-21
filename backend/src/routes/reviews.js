import { Router } from "express";
import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";

const router = Router();

router.get("/:pid", (req, res) => {
    try {
        const pid = req.params.pid;
        const product = productModel.getProduct(pid);
        const reviews = reviewModel.getReviews(pid);
        res.render("reviews", {product, reviews});
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "failed to fetch reviews"});
    }
});

// For creating reviews
router.post("/create/:pid", (req, res) => {
  const productID = req.params.pid;
  const reviewName = req.body.reviewName?.trim();
  const reviewBody = req.body.reviewBody?.trim();

  reviewModel.postReview(
    productID,
    reviewName,
    reviewBody,
  );
  res.redirect("/review/" + productID);
});

export default router; 