const express = require("express");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
} = require("../controllers/productController");

const authenticateToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

/*
 * Get brands
 *
 * IMPORTANT:
 * This route must come before /:id
 * otherwise "brands" could be treated as a product ID.
 */
router.get("/brands", getBrands);

/*
 * Get products
 *
 * Supports:
 * search
 * category_id
 * brand
 * min_price
 * max_price
 * min_rating
 * min_discount
 * sort
 * page
 * limit
 */
router.get("/", getAllProducts);

/*
 * Get single product
 */
router.get("/:id", getProductById);


/*
|--------------------------------------------------------------------------
| ADMIN PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

/*
 * Create product
 */
router.post(
  "/",
  authenticateToken,
  adminMiddleware,
  createProduct
);

/*
 * Update product
 */
router.put(
  "/:id",
  authenticateToken,
  adminMiddleware,
  updateProduct
);

/*
 * Delete product
 */
router.delete(
  "/:id",
  authenticateToken,
  adminMiddleware,
  deleteProduct
);

module.exports = router;