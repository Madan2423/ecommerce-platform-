const db = require("../database/database");

const getOrCreateCart = (userId, callback) => {
  db.get(
    `
    SELECT *
    FROM cart
    WHERE user_id = ?
    `,
    [userId],
    (err, cart) => {
      if (err) {
        return callback(err);
      }

      if (cart) {
        return callback(null, cart);
      }

      db.run(
        `
        INSERT INTO cart (user_id)
        VALUES (?)
        `,
        [userId],
        function (err) {
          if (err) {
            return callback(err);
          }

          db.get(
            `
            SELECT *
            FROM cart
            WHERE id = ?
            `,
            [this.lastID],
            (err, newCart) => {
              callback(err, newCart);
            }
          );
        }
      );
    }
  );
};

const getCart = (req, res) => {
  const userId = req.user.id;

  getOrCreateCart(userId, (err, cart) => {
    if (err) {
      console.error("Cart error:", err.message);

      return res.status(500).json({
        message: "Failed to get cart",
      });
    }

    const query = `
      SELECT
        cart_items.id,
        cart_items.product_id,
        cart_items.quantity,
        products.name,
        products.price,
        products.image_url,
        products.stock,
        (products.price * cart_items.quantity) AS subtotal
      FROM cart_items
      INNER JOIN products
        ON cart_items.product_id = products.id
      WHERE cart_items.cart_id = ?
      ORDER BY cart_items.created_at DESC
    `;

    db.all(
      query,
      [cart.id],
      (err, items) => {
        if (err) {
          console.error("Cart items error:", err.message);

          return res.status(500).json({
            message: "Failed to get cart items",
          });
        }

        const total = items.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );

        return res.status(200).json({
          cart: {
            id: cart.id,
            user_id: cart.user_id,
            items,
            total,
          },
        });
      }
    );
  });
};

const addToCart = (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity = 1 } = req.body;

  const requestedQuantity = Number(quantity);

  if (!product_id) {
    return res.status(400).json({
      message: "Product ID is required",
    });
  }

  if (
    !Number.isInteger(requestedQuantity) ||
    requestedQuantity <= 0
  ) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  db.get(
    `
    SELECT *
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

      if (product.stock <= 0) {
        return res.status(400).json({
          message: "Product is out of stock",
        });
      }

      getOrCreateCart(userId, (err, cart) => {
        if (err) {
          console.error("Cart creation error:", err.message);

          return res.status(500).json({
            message: "Failed to get cart",
          });
        }

        db.get(
          `
          SELECT *
          FROM cart_items
          WHERE cart_id = ?
          AND product_id = ?
          `,
          [cart.id, product_id],
          (err, existingItem) => {
            if (err) {
              console.error(
                "Cart item lookup error:",
                err.message
              );

              return res.status(500).json({
                message: "Failed to check cart item",
              });
            }

            if (existingItem) {
              const newQuantity =
                existingItem.quantity + requestedQuantity;

              if (newQuantity > product.stock) {
                return res.status(400).json({
                  message: `Only ${product.stock} items are available`,
                });
              }

              db.run(
                `
                UPDATE cart_items
                SET
                  quantity = ?,
                  updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [newQuantity, existingItem.id],
                (err) => {
                  if (err) {
                    console.error(
                      "Cart update error:",
                      err.message
                    );

                    return res.status(500).json({
                      message: "Failed to update cart",
                    });
                  }

                  return res.status(200).json({
                    message: "Cart quantity updated",
                    quantity: newQuantity,
                  });
                }
              );
            } else {
              if (requestedQuantity > product.stock) {
                return res.status(400).json({
                  message: `Only ${product.stock} items are available`,
                });
              }

              db.run(
                `
                INSERT INTO cart_items
                (cart_id, product_id, quantity)
                VALUES (?, ?, ?)
                `,
                [cart.id, product_id, requestedQuantity],
                function (err) {
                  if (err) {
                    console.error(
                      "Cart item creation error:",
                      err.message
                    );

                    return res.status(500).json({
                      message: "Failed to add product to cart",
                    });
                  }

                  return res.status(201).json({
                    message: "Product added to cart",
                    cart_item_id: this.lastID,
                  });
                }
              );
            }
          }
        );
      });
    }
  );
};

const updateCartItem = (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  const requestedQuantity = Number(quantity);

  if (
    !Number.isInteger(requestedQuantity) ||
    requestedQuantity <= 0
  ) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  const query = `
    SELECT
      cart_items.id,
      cart_items.quantity,
      products.stock
    FROM cart_items
    INNER JOIN cart
      ON cart_items.cart_id = cart.id
    INNER JOIN products
      ON cart_items.product_id = products.id
    WHERE cart_items.id = ?
    AND cart.user_id = ?
  `;

  db.get(
    query,
    [itemId, userId],
    (err, item) => {
      if (err) {
        console.error(
          "Cart item lookup error:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to find cart item",
        });
      }

      if (!item) {
        return res.status(404).json({
          message: "Cart item not found",
        });
      }

      if (requestedQuantity > item.stock) {
        return res.status(400).json({
          message: `Only ${item.stock} items are available`,
        });
      }

      db.run(
        `
        UPDATE cart_items
        SET
          quantity = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [requestedQuantity, itemId],
        function (err) {
          if (err) {
            console.error(
              "Cart item update error:",
              err.message
            );

            return res.status(500).json({
              message: "Failed to update cart item",
            });
          }

          return res.status(200).json({
            message: "Cart item updated",
            quantity: requestedQuantity,
          });
        }
      );
    }
  );
};

const removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  const query = `
    DELETE FROM cart_items
    WHERE id = ?
    AND cart_id = (
      SELECT id
      FROM cart
      WHERE user_id = ?
    )
  `;

  db.run(
    query,
    [itemId, userId],
    function (err) {
      if (err) {
        console.error(
          "Cart item deletion error:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to remove cart item",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Cart item not found",
        });
      }

      return res.status(200).json({
        message: "Product removed from cart",
      });
    }
  );
};

const clearCart = (req, res) => {
  const userId = req.user.id;

  const query = `
    DELETE FROM cart_items
    WHERE cart_id = (
      SELECT id
      FROM cart
      WHERE user_id = ?
    )
  `;

  db.run(
    query,
    [userId],
    function (err) {
      if (err) {
        console.error(
          "Cart clearing error:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to clear cart",
        });
      }

      return res.status(200).json({
        message: "Cart cleared successfully",
      });
    }
  );
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};