const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  getWishlist
);

router.post(
  "/",
  authenticateToken,
  addToWishlist
);

router.delete(
  "/:productId",
  authenticateToken,
  removeFromWishlist
);

router.delete(
  "/",
  authenticateToken,
  clearWishlist
);

module.exports = router;