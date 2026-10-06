const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
  processPayment,
  getPaymentByOrderId,
} = require("../controllers/paymentController");

const router = express.Router();

// Process mock payment
router.post("/:orderId/pay", authenticateToken, processPayment);

// Get payment details
router.get("/:orderId", authenticateToken, getPaymentByOrderId);

module.exports = router;