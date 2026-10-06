const db = require("../database/database");

const getWishlist = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT
      wishlist.id,
      wishlist.product_id,
      wishlist.created_at,
      products.name,
      products.description,
      products.price,
      products.stock,
      products.image_url,
      categories.name AS category_name
    FROM wishlist
    INNER JOIN products
      ON wishlist.product_id = products.id
    LEFT JOIN categories
      ON products.category_id = categories.id
    WHERE wishlist.user_id = ?
    ORDER BY wishlist.created_at DESC
  `;

  db.all(query, [userId], (err, products) => {
    if (err) {
      console.error("Wishlist fetch error:", err.message);

      return res.status(500).json({
        message: "Failed to fetch wishlist",
      });
    }

    return res.status(200).json({
      count: products.length,
      products,
    });
  });
};

const addToWishlist = (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({
      message: "Product ID is required",
    });
  }

  db.get(
    `
    SELECT id
    FROM products
    WHERE id = ?
    `,
    [product_id],
    (err, product) => {
      if (err) {
        console.error("Product lookup error:", err.message);

        return res.status(500).json({
          message: "Failed to find product",
        });
      }

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      db.run(
        `
        INSERT INTO wishlist (user_id, product_id)
        VALUES (?, ?)
        `,
        [userId, product_id],
        function (err) {
          if (err) {
            if (
              err.message.includes(
                "UNIQUE constraint failed"
              )
            ) {
              return res.status(409).json({
                message: "Product is already in wishlist",
              });
            }

            console.error(
              "Wishlist insertion error:",
              err.message
            );

            return res.status(500).json({
              message: "Failed to add product to wishlist",
            });
          }

          return res.status(201).json({
            message: "Product added to wishlist",
            wishlist_id: this.lastID,
          });
        }
      );
    }
  );
};

const removeFromWishlist = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  db.run(
    `
    DELETE FROM wishlist
    WHERE user_id = ?
    AND product_id = ?
    `,
    [userId, productId],
    function (err) {
      if (err) {
        console.error(
          "Wishlist deletion error:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to remove product from wishlist",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Product is not in wishlist",
        });
      }

      return res.status(200).json({
        message: "Product removed from wishlist",
      });
    }
  );
};

const clearWishlist = (req, res) => {
  const userId = req.user.id;

  db.run(
    `
    DELETE FROM wishlist
    WHERE user_id = ?
    `,
    [userId],
    function (err) {
      if (err) {
        console.error(
          "Wishlist clearing error:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to clear wishlist",
        });
      }

      return res.status(200).json({
        message: "Wishlist cleared successfully",
      });
    }
  );
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};