import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCart,
  checkout,
} from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      setError("");

      const data = await getCart();

      setCart(data.cart || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setShippingInfo((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function getItems() {
    if (!cart) {
      return [];
    }

    return (
      cart.items ||
      cart.cart_items ||
      []
    );
  }

  const items = getItems();

  function getProduct(item) {
    return (
      item.product ||
      item
    );
  }

  function getProductName(item) {
    const product =
      getProduct(item);

    return (
      item.product_name ||
      product.name ||
      "Product"
    );
  }

  function getProductImage(item) {
    const product =
      getProduct(item);

    return (
      item.image_url ||
      product.image_url ||
      ""
    );
  }

  function getPrice(item) {
    const product =
      getProduct(item);

    return Number(
      item.price ??
        product.price ??
        0
    );
  }

  function getQuantity(item) {
    return Number(
      item.quantity || 1
    );
  }

  function getSubtotal(item) {
    return (
      getPrice(item) *
      getQuantity(item)
    );
  }

  const subtotal = items.reduce(
    (total, item) =>
      total + getSubtotal(item),
    0
  );

  const shipping =
    subtotal >= 2000
      ? 0
      : subtotal > 0
      ? 100
      : 0;

  const tax =
    subtotal * 0.18;

  const total =
    subtotal +
    shipping +
    tax;

  function validateShipping() {
    if (
      !shippingInfo.fullName.trim()
    ) {
      setError(
        "Please enter your full name."
      );
      return false;
    }

    if (
      !shippingInfo.phone.trim()
    ) {
      setError(
        "Please enter your phone number."
      );
      return false;
    }

    if (
      shippingInfo.phone.trim().length <
      10
    ) {
      setError(
        "Please enter a valid phone number."
      );
      return false;
    }

    if (
      !shippingInfo.address.trim()
    ) {
      setError(
        "Please enter your address."
      );
      return false;
    }

    if (
      !shippingInfo.city.trim()
    ) {
      setError(
        "Please enter your city."
      );
      return false;
    }

    if (
      !shippingInfo.state.trim()
    ) {
      setError(
        "Please enter your state."
      );
      return false;
    }

    if (
      !shippingInfo.pincode.trim()
    ) {
      setError(
        "Please enter your pincode."
      );
      return false;
    }

    if (
      shippingInfo.pincode.trim().length !==
      6
    ) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return false;
    }

    return true;
  }

  async function handlePlaceOrder(event) {
    event.preventDefault();

    setError("");

    if (!validateShipping()) {
      return;
    }

    if (items.length === 0) {
      setError(
        "Your cart is empty."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const data =
        await checkout();

      const orderId =
        data.order?.id ||
        data.orderId ||
        data.id;

      if (orderId) {
        navigate(
          `/orders/${orderId}`
        );
      } else {
        navigate("/orders");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border"
          role="status"
        ></div>

        <p className="mt-3">
          Loading checkout...
        </p>

      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/cart"
          className="btn btn-primary"
        >
          Back to Cart
        </Link>

      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5">

        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <div
              style={{
                fontSize: "70px",
              }}
            >
              🛒
            </div>

            <h2 className="fw-bold mt-3">
              Your cart is empty
            </h2>

            <p className="text-muted">
              Add some products before checking out.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              Browse Products
            </Link>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* HEADER */}

      <div className="mb-5">

        <h1 className="fw-bold">
          Checkout
        </h1>

        <p className="text-muted">
          Enter your shipping details and review your order.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form
        onSubmit={handlePlaceOrder}
      >

        <div className="row g-4">

          {/* LEFT SIDE */}

          <div className="col-lg-7">

            {/* SHIPPING INFORMATION */}

            <div className="card shadow-sm mb-4">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Shipping Information
                </h4>

                <div className="row g-3">

                  {/* NAME */}

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={
                        shippingInfo.fullName
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  {/* PHONE */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="Enter phone number"
                      value={
                        shippingInfo.phone
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  {/* PINCODE */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      className="form-control"
                      placeholder="6-digit pincode"
                      maxLength="6"
                      value={
                        shippingInfo.pincode
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  {/* ADDRESS */}

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Address
                    </label>

                    <textarea
                      name="address"
                      className="form-control"
                      rows="3"
                      placeholder="House number, street, area..."
                      value={
                        shippingInfo.address
                      }
                      onChange={
                        handleChange
                      }
                    ></textarea>

                  </div>

                  {/* CITY */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="Enter city"
                      value={
                        shippingInfo.city
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  {/* STATE */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      placeholder="Enter state"
                      value={
                        shippingInfo.state
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* PAYMENT INFORMATION */}

            <div className="card shadow-sm">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-3">
                  Payment
                </h4>

                <div className="alert alert-info mb-0">

                  <strong>
                    Payment will be handled after the order is created.
                  </strong>

                  <br />

                  You can choose UPI, Card,
                  Net Banking or Cash on Delivery
                  from the order page.

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="col-lg-5">

            <div
              className="card shadow-sm"
              style={{
                position: "sticky",
                top: "20px",
              }}
            >

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Order Summary
                </h4>

                {/* ITEMS */}

                <div className="mb-4">

                  {items.map(
                    (item, index) => {

                      const imageUrl =
                        getProductImage(
                          item
                        );

                      const productName =
                        getProductName(
                          item
                        );

                      const quantity =
                        getQuantity(
                          item
                        );

                      const itemSubtotal =
                        getSubtotal(
                          item
                        );

                      return (
                        <div
                          key={
                            item.id ||
                            index
                          }
                          className="d-flex align-items-center gap-3 mb-3"
                        >

                          {/* IMAGE */}

                          <div
                            className="bg-light rounded"
                            style={{
                              width: "65px",
                              height: "65px",
                              flexShrink: 0,
                            }}
                          >

                            {imageUrl ? (
                              <img
                                src={
                                  imageUrl
                                }
                                alt={
                                  productName
                                }
                                className="w-100 h-100 rounded"
                                style={{
                                  objectFit:
                                    "cover",
                                }}
                              />
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center h-100"
                                style={{
                                  fontSize:
                                    "28px",
                                }}
                              >
                                🛍️
                              </div>
                            )}

                          </div>

                          {/* DETAILS */}

                          <div className="flex-grow-1">

                            <div className="fw-semibold">
                              {
                                productName
                              }
                            </div>

                            <small className="text-muted">
                              Qty:{" "}
                              {
                                quantity
                              }
                            </small>

                          </div>

                          <div className="fw-semibold">
                            ₹
                            {itemSubtotal.toFixed(
                              2
                            )}
                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                <hr />

                {/* SUBTOTAL */}

                <div className="d-flex justify-content-between mb-3">

                  <span className="text-muted">
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {subtotal.toFixed(
                      2
                    )}
                  </span>

                </div>

                {/* SHIPPING */}

                <div className="d-flex justify-content-between mb-3">

                  <span className="text-muted">
                    Shipping
                  </span>

                  <span>
                    {shipping === 0 ? (
                      <span className="text-success fw-semibold">
                        FREE
                      </span>
                    ) : (
                      `₹${shipping.toFixed(
                        2
                      )}`
                    )}
                  </span>

                </div>

                {/* TAX */}

                <div className="d-flex justify-content-between mb-3">

                  <span className="text-muted">
                    Tax
                  </span>

                  <span>
                    ₹
                    {tax.toFixed(
                      2
                    )}
                  </span>

                </div>

                <hr />

                {/* TOTAL */}

                <div className="d-flex justify-content-between mb-4">

                  <span className="fw-bold fs-5">
                    Total
                  </span>

                  <span className="fw-bold fs-5 text-primary">
                    ₹
                    {total.toFixed(
                      2
                    )}
                  </span>

                </div>

                {/* PLACE ORDER */}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={
                    placingOrder
                  }
                >
                  {placingOrder
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

                <Link
                  to="/cart"
                  className="btn btn-outline-secondary w-100 mt-2"
                >
                  Back to Cart
                </Link>

              </div>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
}

export default Checkout;