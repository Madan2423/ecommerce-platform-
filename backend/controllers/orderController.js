const db = require("../database/database");

const checkout = (req, res) => {
  const userId = req.user.id;

  db.get(
    `
    SELECT id
    FROM cart
    WHERE user_id = ?
    `,
    [userId],
    (err, cart) => {
      if (err) {
        console.error("Cart lookup error:", err.message);

        return res.status(500).json({
          message: "Failed to find cart",
        });
      }

      if (!cart) {
        return res.status(400).json({
          message: "Cart is empty",
        });
      }

      db.all(
        `
        SELECT
          cart_items.id AS cart_item_id,
          cart_items.product_id,
          cart_items.quantity,
          products.name,
          products.price,
          products.stock
        FROM cart_items
        INNER JOIN products
          ON cart_items.product_id = products.id
        WHERE cart_items.cart_id = ?
        `,
        [cart.id],
        (err, cartItems) => {
          if (err) {
            console.error("Cart items lookup error:", err.message);

            return res.status(500).json({
              message: "Failed to fetch cart items",
            });
          }

          if (cartItems.length === 0) {
            return res.status(400).json({
              message: "Cart is empty",
            });
          }

          for (const item of cartItems) {
            if (item.quantity > item.stock) {
              return res.status(400).json({
                message: `Insufficient stock for ${item.name}`,
                product_id: item.product_id,
                available_stock: item.stock,
                requested_quantity: item.quantity,
              });
            }
          }

          let totalAmount = 0;

          for (const item of cartItems) {
            totalAmount += item.price * item.quantity;
          }

          db.serialize(() => {
            db.run("BEGIN TRANSACTION", (transactionError) => {
              if (transactionError) {
                console.error(
                  "Transaction start error:",
                  transactionError.message
                );

                return res.status(500).json({
                  message: "Failed to start checkout",
                });
              }

              db.run(
                `
                INSERT INTO orders
                (user_id, total_amount, status)
                VALUES (?, ?, ?)
                `,
                [userId, totalAmount, "placed"],
                function (orderError) {
                  if (orderError) {
                    console.error(
                      "Order creation error:",
                      orderError.message
                    );

                    return db.run("ROLLBACK", () => {
                      return res.status(500).json({
                        message: "Failed to create order",
                      });
                    });
                  }

                  const orderId = this.lastID;

                  let completedItems = 0;
                  let itemErrorOccurred = false;

                  const updateStockAndFinish = () => {
                    let completedUpdates = 0;
                    let stockErrorOccurred = false;

                    for (const item of cartItems) {
                      db.run(
                        `
                        UPDATE products
                        SET
                          stock = stock - ?,
                          updated_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                        AND stock >= ?
                        `,
                        [
                          item.quantity,
                          item.product_id,
                          item.quantity,
                        ],
                        function (error) {
                          if (stockErrorOccurred) {
                            return;
                          }

                          if (error) {
                            stockErrorOccurred = true;

                            console.error(
                              "Stock update error:",
                              error.message
                            );

                            return db.run("ROLLBACK", () => {
                              return res.status(500).json({
                                message:
                                  "Failed to update product stock",
                              });
                            });
                          }

                          if (this.changes === 0) {
                            stockErrorOccurred = true;

                            return db.run("ROLLBACK", () => {
                              return res.status(400).json({
                                message:
                                  "Stock changed while processing checkout",
                              });
                            });
                          }

                          completedUpdates++;

                          if (
                            completedUpdates === cartItems.length
                          ) {
                            clearCartAndFinish();
                          }
                        }
                      );
                    }
                  };

                  const clearCartAndFinish = () => {
                    db.run(
                      `
                      DELETE FROM cart_items
                      WHERE cart_id = ?
                      `,
                      [cart.id],
                      function (error) {
                        if (error) {
                          console.error(
                            "Cart clearing error:",
                            error.message
                          );

                          return db.run("ROLLBACK", () => {
                            return res.status(500).json({
                              message:
                                "Order created but failed to clear cart",
                            });
                          });
                        }

                        db.run("COMMIT", (commitError) => {
                          if (commitError) {
                            console.error(
                              "Transaction commit error:",
                              commitError.message
                            );

                            return db.run("ROLLBACK", () => {
                              return res.status(500).json({
                                message: "Checkout failed",
                              });
                            });
                          }

                          return res.status(201).json({
                            message: "Order placed successfully",
                            order: {
                              id: orderId,
                              user_id: userId,
                              total_amount: totalAmount,
                              status: "placed",
                              items: cartItems.map((item) => ({
                                product_id: item.product_id,
                                product_name: item.name,
                                price: item.price,
                                quantity: item.quantity,
                                subtotal:
                                  item.price * item.quantity,
                              })),
                            },
                          });
                        });
                      }
                    );
                  };

                  for (const item of cartItems) {
                    const subtotal = item.price * item.quantity;

                    db.run(
                      `
                      INSERT INTO order_items
                      (
                        order_id,
                        product_id,
                        product_name,
                        price,
                        quantity,
                        subtotal
                      )
                      VALUES (?, ?, ?, ?, ?, ?)
                      `,
                      [
                        orderId,
                        item.product_id,
                        item.name,
                        item.price,
                        item.quantity,
                        subtotal,
                      ],
                      function (error) {
                        if (itemErrorOccurred) {
                          return;
                        }

                        if (error) {
                          itemErrorOccurred = true;

                          console.error(
                            "Order item creation error:",
                            error.message
                          );

                          return db.run("ROLLBACK", () => {
                            return res.status(500).json({
                              message:
                                "Failed to create order items",
                            });
                          });
                        }

                        completedItems++;

                        if (
                          completedItems === cartItems.length
                        ) {
                          updateStockAndFinish();
                        }
                      }
                    );
                  }
                }
              );
            });
          });
        }
      );
    }
  );
};

const getMyOrders = (req, res) => {
  const userId = req.user.id;

  db.all(
    `
    SELECT
      id,
      total_amount,
      status,
      created_at,
      updated_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId],
    (err, orders) => {
      if (err) {
        console.error("Orders fetch error:", err.message);

        return res.status(500).json({
          message: "Failed to fetch orders",
        });
      }

      return res.status(200).json({
        count: orders.length,
        orders,
      });
    }
  );
};

const getOrderById = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  db.get(
    `
    SELECT
      id,
      user_id,
      total_amount,
      status,
      created_at,
      updated_at
    FROM orders
    WHERE id = ?
    AND user_id = ?
    `,
    [id, userId],
    (err, order) => {
      if (err) {
        console.error("Order fetch error:", err.message);

        return res.status(500).json({
          message: "Failed to fetch order",
        });
      }

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      db.all(
        `
        SELECT
          id,
          product_id,
          product_name,
          price,
          quantity,
          subtotal
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC
        `,
        [id],
        (err, items) => {
          if (err) {
            console.error(
              "Order items fetch error:",
              err.message
            );

            return res.status(500).json({
              message: "Failed to fetch order items",
            });
          }

          return res.status(200).json({
            order: {
              ...order,
              items,
            },
          });
        }
      );
    }
  );
};

const cancelOrder = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  db.get(
    `
    SELECT
      id,
      user_id,
      status
    FROM orders
    WHERE id = ?
    AND user_id = ?
    `,
    [id, userId],
    (err, order) => {
      if (err) {
        console.error("Order lookup error:", err.message);

        return res.status(500).json({
          message: "Failed to find order",
        });
      }

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      if (
        order.status !== "placed" &&
        order.status !== "processing"
      ) {
        return res.status(400).json({
          message:
            "Only placed or processing orders can be cancelled",
        });
      }

      db.all(
        `
        SELECT
          product_id,
          quantity
        FROM order_items
        WHERE order_id = ?
        `,
        [id],
        (err, orderItems) => {
          if (err) {
            console.error(
              "Order items lookup error:",
              err.message
            );

            return res.status(500).json({
              message: "Failed to fetch order items",
            });
          }

          if (orderItems.length === 0) {
            return res.status(400).json({
              message: "Order has no items",
            });
          }

          db.serialize(() => {
            db.run("BEGIN TRANSACTION", (transactionError) => {
              if (transactionError) {
                console.error(
                  "Cancellation transaction error:",
                  transactionError.message
                );

                return res.status(500).json({
                  message: "Failed to start cancellation",
                });
              }

              let completedUpdates = 0;
              let stockErrorOccurred = false;

              for (const item of orderItems) {
                db.run(
                  `
                  UPDATE products
                  SET
                    stock = stock + ?,
                    updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?
                  `,
                  [item.quantity, item.product_id],
                  function (error) {
                    if (stockErrorOccurred) {
                      return;
                    }

                    if (error) {
                      stockErrorOccurred = true;

                      console.error(
                        "Stock restoration error:",
                        error.message
                      );

                      return db.run("ROLLBACK", () => {
                        return res.status(500).json({
                          message:
                            "Failed to restore product stock",
                        });
                      });
                    }

                    completedUpdates++;

                    if (
                      completedUpdates === orderItems.length
                    ) {
                      db.run(
                        `
                        UPDATE orders
                        SET
                          status = 'cancelled',
                          updated_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                        AND user_id = ?
                        `,
                        [id, userId],
                        function (updateError) {
                          if (updateError) {
                            console.error(
                              "Order cancellation error:",
                              updateError.message
                            );

                            return db.run("ROLLBACK", () => {
                              return res.status(500).json({
                                message:
                                  "Failed to cancel order",
                              });
                            });
                          }

                          db.run("COMMIT", (commitError) => {
                            if (commitError) {
                              console.error(
                                "Cancellation commit error:",
                                commitError.message
                              );

                              return db.run(
                                "ROLLBACK",
                                () => {
                                  return res.status(500).json({
                                    message:
                                      "Failed to complete cancellation",
                                  });
                                }
                              );
                            }

                            return res.status(200).json({
                              message:
                                "Order cancelled successfully",
                              order: {
                                id,
                                status: "cancelled",
                              },
                            });
                          });
                        }
                      );
                    }
                  }
                );
              }
            });
          });
        }
      );
    }
  );
};

module.exports = {
  checkout,
  getMyOrders,
  getOrderById,
  cancelOrder,
};