const db = require("../database/database");

const getAdminDashboard = (req, res) => {
  return res.status(200).json({
    message: "Welcome to the admin dashboard",
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

const getAllOrders = (req, res) => {
  db.all(
    `
    SELECT
      orders.id,
      orders.user_id,
      users.name AS customer_name,
      users.email AS customer_email,
      orders.total_amount,
      orders.status,
      orders.created_at,
      orders.updated_at
    FROM orders
    INNER JOIN users
      ON orders.user_id = users.id
    ORDER BY orders.created_at DESC
    `,
    [],
    (err, orders) => {
      if (err) {
        console.error("Admin orders fetch error:", err.message);

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

const getAdminOrderById = (req, res) => {
  const { id } = req.params;

  db.get(
    `
    SELECT
      orders.id,
      orders.user_id,
      users.name AS customer_name,
      users.email AS customer_email,
      orders.total_amount,
      orders.status,
      orders.created_at,
      orders.updated_at
    FROM orders
    INNER JOIN users
      ON orders.user_id = users.id
    WHERE orders.id = ?
    `,
    [id],
    (err, order) => {
      if (err) {
        console.error("Admin order fetch error:", err.message);

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
              "Admin order items fetch error:",
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

const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "placed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!status) {
    return res.status(400).json({
      message: "Order status is required",
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status",
      allowed_statuses: allowedStatuses,
    });
  }

  db.get(
    `
    SELECT
      id,
      user_id,
      total_amount,
      status
    FROM orders
    WHERE id = ?
    `,
    [id],
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

      if (order.status === "delivered") {
        return res.status(400).json({
          message: "Delivered orders cannot be changed",
        });
      }

      if (order.status === "cancelled") {
        return res.status(400).json({
          message: "Cancelled orders cannot be changed",
        });
      }

      db.run(
        `
        UPDATE orders
        SET
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [status, id],
        function (err) {
          if (err) {
            console.error(
              "Order status update error:",
              err.message
            );

            return res.status(500).json({
              message: "Failed to update order status",
            });
          }

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
            `,
            [id],
            (err, updatedOrder) => {
              if (err) {
                console.error(
                  "Updated order fetch error:",
                  err.message
                );

                return res.status(500).json({
                  message:
                    "Order status updated but could not be retrieved",
                });
              }

              return res.status(200).json({
                message: "Order status updated successfully",
                order: updatedOrder,
              });
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getAdminDashboard,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
};