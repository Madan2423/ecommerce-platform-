const db = require("../database/database");

/*
  CREATE REVIEW

  A customer can review a product only if:
  1. The product exists
  2. The customer has purchased the product
  3. The customer has not already reviewed the product
*/
const createReview = (req, res) => {
  const userId = req.user.id;

  const {
    product_id,
    rating,
    comment,
  } = req.body;

  if (!product_id || !rating || !comment) {
    return res.status(400).json({
      message:
        "Product, rating and comment are required",
    });
  }

  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return res.status(400).json({
      message:
        "Rating must be an integer between 1 and 5",
    });
  }

  if (
    typeof comment !== "string" ||
    comment.trim().length === 0
  ) {
    return res.status(400).json({
      message: "Comment cannot be empty",
    });
  }

  // Check whether product exists
  db.get(
    `
      SELECT id, name
      FROM products
      WHERE id = ?
    `,
    [product_id],
    (err, product) => {
      if (err) {
        console.error(
          "Product lookup error:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to verify product",
        });
      }

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      /*
        Check whether the user has purchased
        this product.

        We look at completed/processed orders
        through order_items.
      */
      db.get(
        `
          SELECT oi.id
          FROM order_items oi
          INNER JOIN orders o
            ON oi.order_id = o.id
          WHERE o.user_id = ?
            AND oi.product_id = ?
            AND o.status IN (
              'placed',
              'processing',
              'shipped',
              'delivered'
            )
          LIMIT 1
        `,
        [userId, product_id],
        (err, purchase) => {
          if (err) {
            console.error(
              "Purchase lookup error:",
              err.message
            );

            return res.status(500).json({
              message:
                "Failed to verify purchase",
            });
          }

          if (!purchase) {
            return res.status(403).json({
              message:
                "You can review only products you have purchased",
            });
          }

          // Check duplicate review
          db.get(
            `
              SELECT id
              FROM reviews
              WHERE user_id = ?
                AND product_id = ?
            `,
            [userId, product_id],
            (err, existingReview) => {
              if (err) {
                console.error(
                  "Review lookup error:",
                  err.message
                );

                return res.status(500).json({
                  message:
                    "Failed to check existing review",
                });
              }

              if (existingReview) {
                return res.status(409).json({
                  message:
                    "You have already reviewed this product",
                });
              }

              // Create review
              db.run(
                `
                  INSERT INTO reviews (
                    user_id,
                    product_id,
                    rating,
                    comment
                  )
                  VALUES (?, ?, ?, ?)
                `,
                [
                  userId,
                  product_id,
                  numericRating,
                  comment.trim(),
                ],
                function (err) {
                  if (err) {
                    console.error(
                      "Create review error:",
                      err.message
                    );

                    return res.status(500).json({
                      message:
                        "Failed to create review",
                    });
                  }

                  res.status(201).json({
                    message:
                      "Review created successfully",
                    review: {
                      id: this.lastID,
                      user_id: userId,
                      product_id:
                        Number(product_id),
                      rating:
                        numericRating,
                      comment:
                        comment.trim(),
                    },
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};


/*
  GET PRODUCT REVIEWS
*/
const getProductReviews = (
  req,
  res
) => {
  const productId =
    req.params.productId;

  db.all(
    `
      SELECT
        r.id,
        r.user_id,
        r.product_id,
        r.rating,
        r.comment,
        r.created_at,
        r.updated_at,
        u.name AS user_name
      FROM reviews r
      INNER JOIN users u
        ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `,
    [productId],
    (err, reviews) => {
      if (err) {
        console.error(
          "Get reviews error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to fetch reviews",
        });
      }

      res.json({
        reviews,
      });
    }
  );
};


/*
  GET PRODUCT RATING SUMMARY

  Example response:

  {
    averageRating: 4.5,
    totalReviews: 10
  }
*/
const getProductRating = (
  req,
  res
) => {
  const productId =
    req.params.productId;

  db.get(
    `
      SELECT
        ROUND(
          AVG(rating),
          1
        ) AS average_rating,
        COUNT(*) AS total_reviews
      FROM reviews
      WHERE product_id = ?
    `,
    [productId],
    (err, result) => {
      if (err) {
        console.error(
          "Get rating error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to fetch rating",
        });
      }

      res.json({
        averageRating:
          result.average_rating || 0,

        totalReviews:
          result.total_reviews || 0,
      });
    }
  );
};


/*
  UPDATE OWN REVIEW
*/
const updateReview = (
  req,
  res
) => {
  const userId = req.user.id;
  const reviewId =
    req.params.reviewId;

  const {
    rating,
    comment,
  } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({
      message:
        "Rating and comment are required",
    });
  }

  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return res.status(400).json({
      message:
        "Rating must be an integer between 1 and 5",
    });
  }

  if (
    typeof comment !== "string" ||
    comment.trim().length === 0
  ) {
    return res.status(400).json({
      message: "Comment cannot be empty",
    });
  }

  db.get(
    `
      SELECT id
      FROM reviews
      WHERE id = ?
        AND user_id = ?
    `,
    [reviewId, userId],
    (err, review) => {
      if (err) {
        console.error(
          "Review ownership error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to verify review",
        });
      }

      if (!review) {
        return res.status(404).json({
          message:
            "Review not found or you do not own this review",
        });
      }

      db.run(
        `
          UPDATE reviews
          SET
            rating = ?,
            comment = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
            AND user_id = ?
        `,
        [
          numericRating,
          comment.trim(),
          reviewId,
          userId,
        ],
        function (err) {
          if (err) {
            console.error(
              "Update review error:",
              err.message
            );

            return res.status(500).json({
              message:
                "Failed to update review",
            });
          }

          res.json({
            message:
              "Review updated successfully",
          });
        }
      );
    }
  );
};


/*
  DELETE OWN REVIEW
*/
const deleteReview = (
  req,
  res
) => {
  const userId = req.user.id;
  const reviewId =
    req.params.reviewId;

  db.run(
    `
      DELETE FROM reviews
      WHERE id = ?
        AND user_id = ?
    `,
    [reviewId, userId],
    function (err) {
      if (err) {
        console.error(
          "Delete review error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to delete review",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message:
            "Review not found or you do not own this review",
        });
      }

      res.json({
        message:
          "Review deleted successfully",
      });
    }
  );
};


module.exports = {
  createReview,
  getProductReviews,
  getProductRating,
  updateReview,
  deleteReview,
};