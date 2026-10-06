const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
  checkout,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const router = express.Router();

// Checkout
router.post("/checkout", authenticateToken, checkout);

// Customer order history
router.get("/", authenticateToken, getMyOrders);

// Cancel an order
router.put("/:id/cancel", authenticateToken, cancelOrder);

// Get single order
router.get("/:id", authenticateToken, getOrderById);

module.exports = router;