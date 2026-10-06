const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
  createReview,
  getProductReviews,
  getProductRating,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

/*
  GET PRODUCT REVIEWS

  Public endpoint.
  Anyone can see reviews.
*/
router.get(
  "/product/:productId",
  getProductReviews
);


/*
  GET PRODUCT RATING

  Public endpoint.
  Returns average rating and total reviews.
*/
router.get(
  "/product/:productId/rating",
  getProductRating
);


/*
  CREATE REVIEW

  Protected endpoint.
  User must be logged in.
*/
router.post(
  "/",
  authenticateToken,
  createReview
);


/*
  UPDATE OWN REVIEW

  Protected endpoint.
*/
router.put(
  "/:reviewId",
  authenticateToken,
  updateReview
);


/*
  DELETE OWN REVIEW

  Protected endpoint.
*/
router.delete(
  "/:reviewId",
  authenticateToken,
  deleteReview
);


module.exports = router;