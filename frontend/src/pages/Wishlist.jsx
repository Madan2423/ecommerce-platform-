import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
  addToCart,
  clearWishlist,
} from "../services/api";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      setLoading(true);
      setError("");

      const data = await getWishlist();

      setWishlist(
        data.wishlist ||
        data.products ||
        data ||
        []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId) {
    try {
      setProcessingId(productId);

      await removeFromWishlist(productId);

      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (item) =>
            item.product_id !== productId &&
            item.id !== productId
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to remove product."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleAddToCart(product) {
    try {
      setProcessingId(product.id);

      await addToCart(product.id, 1);

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to add product to cart."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleClearWishlist() {
    try {
      setLoading(true);

      await clearWishlist();

      setWishlist([]);
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Unable to clear wishlist."
      );

      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="mt-3">
          Loading wishlist...
        </p>

      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h1 className="fw-bold mb-1">
            My Wishlist
          </h1>

          <p className="text-muted mb-0">
            Products you want to save for later.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            className="btn btn-outline-danger"
            onClick={handleClearWishlist}
          >
            Clear Wishlist
          </button>
        )}

      </div>


      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      {wishlist.length === 0 ? (
        <div className="text-center py-5">

          <div className="display-1 mb-4">
            ♡
          </div>

          <h2 className="fw-bold">
            Your Wishlist is Empty
          </h2>

          <p className="text-muted mb-4">
            Save products you like and find them here
            later.
          </p>

          <Link
            to="/products"
            className="btn btn-primary btn-lg"
          >
            Explore Products
          </Link>

        </div>
      ) : (
        <div className="row g-4">

          {wishlist.map((item) => {

            const productId =
              item.product_id || item.id;

            const productName =
              item.product_name ||
              item.name ||
              "Product";

            const price =
              item.price || 0;

            return (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                key={productId}
              >

                <div className="card h-100 shadow-sm">

                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "220px" }}
                  >
                    <span className="display-3">
                      🛍️
                    </span>
                  </div>

                  <div className="card-body">

                    <h5 className="fw-bold">
                      {productName}
                    </h5>

                    <h5 className="text-primary fw-bold">
                      ₹{price}
                    </h5>

                  </div>

                  <div className="card-footer bg-white border-0">

                    <div className="d-grid gap-2">

                      <Link
                        to={`/products/${productId}`}
                        className="btn btn-outline-primary"
                      >
                        View Product
                      </Link>

                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleAddToCart({
                            id: productId,
                          })
                        }
                        disabled={
                          processingId === productId
                        }
                      >
                        {processingId === productId
                          ? "Adding..."
                          : "🛒 Add to Cart"}
                      </button>

                      <button
                        className="btn btn-outline-danger"
                        onClick={() =>
                          handleRemove(productId)
                        }
                        disabled={
                          processingId === productId
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Wishlist;