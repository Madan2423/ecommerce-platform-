import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getOrders,
  getOrderById,
  cancelOrder,
  processPayment,
  getPayment,
} from "../services/api";

function Orders() {
  const { id } = useParams();

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] =
    useState(false);
  const [paying, setPaying] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      loadOrder();
    } else {
      loadOrders();
    }
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | LOAD ALL ORDERS
  |--------------------------------------------------------------------------
  */

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(data.orders || data || []);
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LOAD SINGLE ORDER
  |--------------------------------------------------------------------------
  */

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrderById(id);

      setOrder(data.order || data);

      /*
       * Payment is optional.
       * If no payment exists yet, we simply keep
       * payment as null.
       */

      try {
        const paymentData = await getPayment(id);

        setPayment(
          paymentData.payment ||
            paymentData
        );
      } catch (paymentError) {
        console.log(
          "No payment found for this order."
        );

        setPayment(null);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to load order."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CANCEL ORDER
  |--------------------------------------------------------------------------
  */

  async function handleCancelOrder() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      await cancelOrder(id);

      setSuccess(
        "Order cancelled successfully."
      );

      await loadOrder();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | PROCESS PAYMENT
  |--------------------------------------------------------------------------
  */

  async function handlePayment() {
    try {
      setPaying(true);
      setError("");
      setSuccess("");

      /*
       * IMPORTANT:
       *
       * processPayment() expects ONE object.
       *
       * Before:
       *
       * processPayment(id, paymentMethod)
       *
       * Now:
       *
       * processPayment({
       *   order_id: id,
       *   payment_method: paymentMethod
       * })
       */

      const data = await processPayment({
        order_id: id,
        payment_method: paymentMethod,
      });

      setPayment(
        data.payment || data
      );

      setSuccess(
        "Payment completed successfully."
      );

      await loadOrder();
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Payment failed."
      );
    } finally {
      setPaying(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | STATUS CLASS
  |--------------------------------------------------------------------------
  */

  function getStatusClass(status) {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-warning text-dark";

      case "processing":
        return "bg-primary";

      case "shipped":
        return "bg-info text-dark";

      case "delivered":
        return "bg-success";

      case "cancelled":
        return "bg-danger";

      case "placed":
        return "bg-secondary";

      default:
        return "bg-secondary";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="mt-3">
          Loading...
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ORDER DETAILS
  |--------------------------------------------------------------------------
  */

  if (id) {
    if (!order) {
      return (
        <div className="container py-5">
          <div className="alert alert-warning">
            Order not found.
          </div>

          <Link
            to="/orders"
            className="btn btn-primary"
          >
            Back to Orders
          </Link>
        </div>
      );
    }

    const items = order.items || [];

    const isCancelled =
      order.status?.toLowerCase() ===
      "cancelled";

    const isDelivered =
      order.status?.toLowerCase() ===
      "delivered";

    const isPaid =
      payment?.status?.toLowerCase() ===
      "successful";

    return (
      <div className="container py-5">

        {/* ORDER HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <Link
              to="/orders"
              className="text-decoration-none"
            >
              ← Back to Orders
            </Link>

            <h1 className="fw-bold mt-2 mb-1">
              Order #{order.id}
            </h1>

            <p className="text-muted mb-0">
              Placed on {order.created_at}
            </p>

          </div>

          <span
            className={`badge ${getStatusClass(
              order.status
            )} fs-6`}
          >
            {order.status}
          </span>

        </div>

        {/* ERROR */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <div className="row g-4">

          {/* =====================================================
              ORDER ITEMS
          ====================================================== */}

          <div className="col-lg-8">

            <div className="card shadow-sm">

              <div className="card-header bg-white">

                <h5 className="mb-0">
                  Order Items
                </h5>

              </div>

              <div className="card-body">

                {items.length === 0 ? (
                  <p className="text-muted mb-0">
                    No items found for this order.
                  </p>
                ) : (
                  items.map((item) => (

                    <div
                      key={item.id}
                      className="d-flex align-items-center border-bottom py-3"
                    >

                      {/* PRODUCT IMAGE */}

                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "70px",
                          height: "70px",
                          flexShrink: 0,
                        }}
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={
                              item.product_name ||
                              item.name ||
                              "Product"
                            }
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <span className="fs-2">
                            🛍️
                          </span>
                        )}
                      </div>

                      {/* PRODUCT INFORMATION */}

                      <div className="flex-grow-1">

                        <h6 className="fw-bold mb-1">
                          {item.product_name ||
                            item.name ||
                            "Product"}
                        </h6>

                        <p className="text-muted mb-0">
                          ₹
                          {Number(
                            item.price || 0
                          ).toFixed(2)}
                          {" × "}
                          {item.quantity}
                        </p>

                      </div>

                      {/* SUBTOTAL */}

                      <strong>
                        ₹
                        {(
                          Number(
                            item.subtotal
                          ) ||
                          Number(item.price || 0) *
                            Number(
                              item.quantity || 0
                            )
                        ).toFixed(2)}
                      </strong>

                    </div>

                  ))
                )}

              </div>

            </div>

          </div>

          {/* =====================================================
              ORDER SUMMARY
          ====================================================== */}

          <div className="col-lg-4">

            <div className="card shadow-sm">

              <div className="card-header bg-white">

                <h5 className="mb-0">
                  Order Summary
                </h5>

              </div>

              <div className="card-body">

                {/* ITEMS */}

                <div className="d-flex justify-content-between mb-3">

                  <span>
                    Items
                  </span>

                  <span>
                    {items.length}
                  </span>

                </div>

                {/* DELIVERY */}

                <div className="d-flex justify-content-between mb-3">

                  <span>
                    Delivery
                  </span>

                  <span className="text-success">
                    FREE
                  </span>

                </div>

                <hr />

                {/* TOTAL */}

                <div className="d-flex justify-content-between mb-4">

                  <strong className="fs-5">
                    Total
                  </strong>

                  <strong className="fs-5 text-primary">
                    ₹
                    {Number(
                      order.total_amount
                    ).toFixed(2)}
                  </strong>

                </div>

                {/* =================================================
                    PAYMENT METHODS
                ================================================== */}

                {!isPaid &&
                  !isCancelled &&
                  !isDelivered && (

                    <div className="border rounded p-3 mb-3">

                      <h6 className="fw-bold mb-3">
                        Payment Method
                      </h6>

                      {/* UPI */}

                      <div className="form-check mb-2">

                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="upi"
                          value="upi"
                          checked={
                            paymentMethod ===
                            "upi"
                          }
                          onChange={(event) =>
                            setPaymentMethod(
                              event.target.value
                            )
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="upi"
                        >
                          UPI
                        </label>

                      </div>

                      {/* CARD */}

                      <div className="form-check mb-2">

                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="card"
                          value="card"
                          checked={
                            paymentMethod ===
                            "card"
                          }
                          onChange={(event) =>
                            setPaymentMethod(
                              event.target.value
                            )
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="card"
                        >
                          Card
                        </label>

                      </div>

                      {/* NET BANKING */}

                      <div className="form-check mb-2">

                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="netbanking"
                          value="netbanking"
                          checked={
                            paymentMethod ===
                            "netbanking"
                          }
                          onChange={(event) =>
                            setPaymentMethod(
                              event.target.value
                            )
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="netbanking"
                        >
                          Net Banking
                        </label>

                      </div>

                      {/* CASH ON DELIVERY */}

                      <div className="form-check">

                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="cash"
                          value="cash_on_delivery"
                          checked={
                            paymentMethod ===
                            "cash_on_delivery"
                          }
                          onChange={(event) =>
                            setPaymentMethod(
                              event.target.value
                            )
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="cash"
                        >
                          Cash on Delivery
                        </label>

                      </div>

                    </div>

                  )}

                {/* =================================================
                    PAY BUTTON
                ================================================== */}

                {!isPaid &&
                  !isCancelled &&
                  !isDelivered && (

                    <button
                      className="btn btn-success w-100 mb-2"
                      onClick={
                        handlePayment
                      }
                      disabled={paying}
                    >
                      {paying
                        ? "Processing Payment..."
                        : `Pay ₹${Number(
                            order.total_amount
                          ).toFixed(2)}`}
                    </button>

                  )}

                {/* =================================================
                    PAYMENT SUCCESS
                ================================================== */}

                {isPaid && payment && (

                  <div className="alert alert-success">

                    <strong>
                      Payment Successful
                    </strong>

                    <hr />

                    <div className="small">
                      Method:{" "}
                      {payment.payment_method}
                    </div>

                    <div className="small">
                      Transaction ID:{" "}
                      {payment.transaction_id}
                    </div>

                  </div>

                )}

                {/* =================================================
                    CANCEL ORDER
                ================================================== */}

                {!isCancelled &&
                  !isDelivered &&
                  !isPaid && (

                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={
                        handleCancelOrder
                      }
                      disabled={cancelling}
                    >
                      {cancelling
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>

                  )}

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ORDER HISTORY
  |--------------------------------------------------------------------------
  */

  return (
    <div className="container py-5">

      {/* HEADER */}

      <div className="mb-4">

        <h1 className="fw-bold">
          My Orders
        </h1>

        <p className="text-muted">
          View and manage your orders.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* NO ORDERS */}

      {orders.length === 0 ? (

        <div className="text-center py-5">

          <div className="display-1 mb-4">
            📦
          </div>

          <h2 className="fw-bold">
            No Orders Yet
          </h2>

          <p className="text-muted mb-4">
            Your orders will appear here.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Start Shopping
          </Link>

        </div>

      ) : (

        <div className="row g-4">

          {orders.map((item) => (

            <div
              className="col-12"
              key={item.id}
            >

              <div className="card shadow-sm">

                <div className="card-body">

                  <div className="row align-items-center g-3">

                    {/* ORDER ID */}

                    <div className="col-md-3">

                      <h5 className="fw-bold mb-1">
                        Order #{item.id}
                      </h5>

                      <p className="text-muted mb-0">
                        {item.created_at}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div className="col-md-3">

                      <span
                        className={`badge ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </div>

                    {/* TOTAL */}

                    <div className="col-md-3">

                      <strong className="fs-5">
                        ₹
                        {Number(
                          item.total_amount
                        ).toFixed(2)}
                      </strong>

                    </div>

                    {/* VIEW ORDER */}

                    <div className="col-md-3 text-md-end">

                      <Link
                        to={`/orders/${item.id}`}
                        className="btn btn-outline-primary"
                      >
                        View Order
                      </Link>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Orders;