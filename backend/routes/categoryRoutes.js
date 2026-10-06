const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin routes
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createCategory
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  updateCategory
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteCategory
);

module.exports = router;