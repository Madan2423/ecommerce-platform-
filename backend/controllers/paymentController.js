const crypto = require("crypto");

const db = require("../database/database");

const processPayment = (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const { payment_method } = req.body;

  const allowedPaymentMethods = [
    "card",
    "upi",
    "netbanking",
    "cash_on_delivery",
  ];

  if (!payment_method) {
    return res.status(400).json({
      message: "Payment method is required",
    });
  }

  if (!allowedPaymentMethods.includes(payment_method)) {
    return res.status(400).json({
      message: "Invalid payment method",
      allowed_payment_methods: allowedPaymentMethods,
    });
  }

  // Find the order belonging to the logged-in user
  db.get(
    `
    SELECT
      id,
      user_id,
      total_amount,
      status
    FROM orders
    WHERE id = ?
    AND user_id = ?
    `,
    [orderId, userId],
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

      if (order.status === "cancelled") {
        return res.status(400).json({
          message: "Cannot pay for a cancelled order",
        });
      }

      // Check whether payment already exists
      db.get(
        `
        SELECT *
        FROM payments
        WHERE order_id = ?
        `,
        [orderId],
        (err, existingPayment) => {
          if (err) {
            console.error(
              "Payment lookup error:",
              err.message
            );

            return res.status(500).json({
              message: "Failed to check payment",
            });
          }

          if (existingPayment) {
            return res.status(409).json({
              message: "Payment already exists for this order",
              payment: existingPayment,
            });
          }

          // Generate mock transaction ID
          const transactionId = `TXN_${Date.now()}_${crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase()}`;

          // Create successful mock payment
          db.run(
            `
            INSERT INTO payments
            (
              order_id,
              user_id,
              amount,
              status,
              payment_method,
              transaction_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
              order.id,
              userId,
              order.total_amount,
              "successful",
              payment_method,
              transactionId,
            ],
            function (paymentError) {
              if (paymentError) {
                console.error(
                  "Payment creation error:",
                  paymentError.message
                );

                return res.status(500).json({
                  message: "Failed to process payment",
                });
              }

              const paymentId = this.lastID;

              // Update order status after successful payment
              db.run(
                `
                UPDATE orders
                SET
                  status = 'processing',
                  updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [order.id],
                function (orderUpdateError) {
                  if (orderUpdateError) {
                    console.error(
                      "Order status update error:",
                      orderUpdateError.message
                    );

                    return res.status(500).json({
                      message:
                        "Payment successful but order status could not be updated",
                    });
                  }

                  return res.status(201).json({
                    message: "Payment successful",
                    payment: {
                      id: paymentId,
                      order_id: order.id,
                      amount: order.total_amount,
                      status: "successful",
                      payment_method,
                      transaction_id: transactionId,
                    },
                    order: {
                      id: order.id,
                      status: "processing",
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

const getPaymentByOrderId = (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  db.get(
    `
    SELECT
      id,
      order_id,
      amount,
      status,
      payment_method,
      transaction_id,
      created_at,
      updated_at
    FROM payments
    WHERE order_id = ?
    AND user_id = ?
    `,
    [orderId, userId],
    (err, payment) => {
      if (err) {
        console.error("Payment fetch error:", err.message);

        return res.status(500).json({
          message: "Failed to fetch payment",
        });
      }

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      return res.status(200).json({
        payment,
      });
    }
  );
};

module.exports = {
  processPayment,
  getPaymentByOrderId,
};