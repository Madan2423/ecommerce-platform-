import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    const product = getProduct(item);

    return (
      item.product_name ||
      product.name ||
      "Product"
    );
  }

  function getProductImage(item) {
    const product = getProduct(item);

    return (
      item.image_url ||
      product.image_url ||
      ""
    );
  }

  function getProductPrice(item) {
    const product = getProduct(item);

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

  function getItemId(item) {
    return item.id;
  }

  function getSubtotal(item) {
    const price =
      getProductPrice(item);

    const quantity =
      getQuantity(item);

    return price * quantity;
  }

  const subtotal = items.reduce(
    (total, item) =>
      total + getSubtotal(item),
    0
  );

  /*
   * Free shipping when subtotal
   * is ₹2,000 or more.
   */
  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= 2000
      ? 0
      : 100;

  /*
   * 18% GST for display.
   */
  const tax = subtotal * 0.18;

  const grandTotal =
    subtotal +
    shipping +
    tax;

  async function handleIncrease(item) {
    const itemId =
      getItemId(item);

    const quantity =
      getQuantity(item);

    const product = getProduct(item);

    const stock = Number(
      item.stock ??
        product.stock ??
        999999
    );

    if (quantity >= stock) {
      setError(
        "You cannot add more than the available stock."
      );

      return;
    }

    await changeQuantity(
      itemId,
      quantity + 1
    );
  }

  async function handleDecrease(item) {
    const itemId =
      getItemId(item);

    const quantity =
      getQuantity(item);

    if (quantity <= 1) {
      return;
    }

    await changeQuantity(
      itemId,
      quantity - 1
    );
  }

  async function changeQuantity(
    itemId,
    quantity
  ) {
    try {
      setUpdatingId(itemId);
      setError("");
      setSuccess("");

      await updateCartItem(
        itemId,
        quantity
      );

      await loadCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(itemId) {
    try {
      setRemovingId(itemId);
      setError("");
      setSuccess("");

      await removeFromCart(
        itemId
      );

      setSuccess(
        "Product removed from cart."
      );

      await loadCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  }

  async function handleClearCart() {
    const confirmed =
      window.confirm(
        "Are you sure you want to clear your entire cart?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await clearCart();

      setSuccess(
        "Cart cleared successfully."
      );

      await loadCart();
    } catch (err) {
      setError(err.message);
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
          Loading your cart...
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

        <button
          className="btn btn-primary"
          onClick={loadCart}
        >
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h1 className="fw-bold mb-1">
            Shopping Cart
          </h1>

          <p className="text-muted mb-0">
            Review your items before checkout.
          </p>
        </div>

        <Link
          to="/products"
          className="btn btn-outline-primary"
        >
          Continue Shopping
        </Link>

      </div>

      {/* ALERTS */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* EMPTY CART */}

      {items.length === 0 ? (
        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <div
              style={{
                fontSize: "80px",
              }}
            >
              🛒
            </div>

            <h2 className="fw-bold mt-3">
              Your cart is empty
            </h2>

            <p className="text-muted">
              You haven't added any products yet.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              Start Shopping
            </Link>

          </div>

        </div>
      ) : (
        <div className="row g-4">

          {/* CART ITEMS */}

          <div className="col-lg-8">

            <div className="card shadow-sm">

              <div className="card-body p-0">

                {/* CART HEADER */}

                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">

                  <h4 className="fw-bold mb-0">
                    Cart Items ({items.length})
                  </h4>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={
                      handleClearCart
                    }
                  >
                    Clear Cart
                  </button>

                </div>

                {/* ITEMS */}

                {items.map(
                  (item, index) => {
                    const itemId =
                      getItemId(item);

                    const productId =
                      item.product_id ||
                      item.productId ||
                      item.product?.id;

                    const productName =
                      getProductName(item);

                    const imageUrl =
                      getProductImage(item);

                    const price =
                      getProductPrice(item);

                    const quantity =
                      getQuantity(item);

                    const itemSubtotal =
                      getSubtotal(item);

                    const product =
                      getProduct(item);

                    const stock = Number(
                      item.stock ??
                        product.stock ??
                        999999
                    );

                    return (
                      <div
                        key={
                          itemId ||
                          `${productId}-${index}`
                        }
                        className="p-4 border-bottom"
                      >

                        <div className="row align-items-center g-3">

                          {/* IMAGE */}

                          <div className="col-4 col-md-2">

                            <div
                              className="bg-light rounded overflow-hidden"
                              style={{
                                height: "100px",
                              }}
                            >

                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={productName}
                                  className="w-100 h-100"
                                  style={{
                                    objectFit:
                                      "cover",
                                  }}
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.style.display =
                                      "none";

                                    event.currentTarget.parentElement.innerHTML =
                                      '<div class="d-flex align-items-center justify-content-center h-100" style="font-size:40px;">🛍️</div>';
                                  }}
                                />
                              ) : (
                                <div
                                  className="d-flex align-items-center justify-content-center h-100"
                                  style={{
                                    fontSize:
                                      "40px",
                                  }}
                                >
                                  🛍️
                                </div>
                              )}

                            </div>

                          </div>

                          {/* PRODUCT */}

                          <div className="col-8 col-md-4">

                            <h5 className="fw-bold mb-1">
                              {productName}
                            </h5>

                            {item.category_name && (
                              <small className="text-primary">
                                {
                                  item.category_name
                                }
                              </small>
                            )}

                            <p className="text-muted mb-0 mt-1">
                              ₹
                              {price.toFixed(
                                2
                              )}{" "}
                              each
                            </p>

                          </div>

                          {/* QUANTITY */}

                          <div className="col-6 col-md-3">

                            <label className="form-label small text-muted">
                              Quantity
                            </label>

                            <div className="input-group">

                              <button
                                className="btn btn-outline-secondary"
                                disabled={
                                  quantity <=
                                    1 ||
                                  updatingId ===
                                    itemId
                                }
                                onClick={() =>
                                  handleDecrease(
                                    item
                                  )
                                }
                              >
                                −
                              </button>

                              <input
                                type="text"
                                className="form-control text-center"
                                value={
                                  quantity
                                }
                                readOnly
                              />

                              <button
                                className="btn btn-outline-secondary"
                                disabled={
                                  quantity >=
                                    stock ||
                                  updatingId ===
                                    itemId
                                }
                                onClick={() =>
                                  handleIncrease(
                                    item
                                  )
                                }
                              >
                                +
                              </button>

                            </div>

                          </div>

                          {/* SUBTOTAL */}

                          <div className="col-6 col-md-2 text-md-end">

                            <div className="fw-bold">
                              ₹
                              {itemSubtotal.toFixed(
                                2
                              )}
                            </div>

                            <button
                              className="btn btn-sm btn-link text-danger p-0 mt-2"
                              disabled={
                                removingId ===
                                itemId
                              }
                              onClick={() =>
                                handleRemove(
                                  itemId
                                )
                              }
                            >
                              {removingId ===
                              itemId
                                ? "Removing..."
                                : "Remove"}
                            </button>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </div>

          {/* ORDER SUMMARY */}

          <div className="col-lg-4">

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
                    Tax (18%)
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
                    {grandTotal.toFixed(
                      2
                    )}
                  </span>

                </div>

                {/* FREE SHIPPING MESSAGE */}

                {subtotal > 0 &&
                  subtotal < 2000 && (
                    <div className="alert alert-info small">
                      Add ₹
                      {(
                        2000 -
                        subtotal
                      ).toFixed(
                        2
                      )}{" "}
                      more to get free shipping.
                    </div>
                  )}

                {subtotal >= 2000 && (
                  <div className="alert alert-success small">
                    🎉 You qualify for free shipping!
                  </div>
                )}

                {/* CHECKOUT */}

                <Link
                  to="/checkout"
                  className="btn btn-primary btn-lg w-100"
                >
                  Proceed to Checkout
                </Link>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;