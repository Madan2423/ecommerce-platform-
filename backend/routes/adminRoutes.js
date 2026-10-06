const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const {
  getAdminDashboard,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} = require("../controllers/adminController");

const router = express.Router();

// Admin dashboard
router.get(
  "/dashboard",
  authenticateToken,
  requireAdmin,
  getAdminDashboard
);

// Get all orders
router.get(
  "/orders",
  authenticateToken,
  requireAdmin,
  getAllOrders
);

// Get one order
router.get(
  "/orders/:id",
  authenticateToken,
  requireAdmin,
  getAdminOrderById
);

// Update order status
router.put(
  "/orders/:id/status",
  authenticateToken,
  requireAdmin,
  updateOrderStatus
);

module.exports = router;