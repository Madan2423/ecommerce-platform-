const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", authenticateToken, getCart);

router.post(
  "/items",
  authenticateToken,
  addToCart
);

router.put(
  "/items/:itemId",
  authenticateToken,
  updateCartItem
);

router.delete(
  "/items/:itemId",
  authenticateToken,
  removeFromCart
);

router.delete(
  "/",
  authenticateToken,
  clearCart
);

module.exports = router;