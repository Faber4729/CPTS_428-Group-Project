import { Router } from "express";
import reviewModel from "../models/reviewModel.js";

const router = Router();

router.get("/", (req, res) => {
    try {
        const pid = req.query.productId;
        const reviews = reviewModel.getReviews(pid);
        res.render("reviews", {reviews});
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "failed to fetch reviews"});
    }
});

export default router; 