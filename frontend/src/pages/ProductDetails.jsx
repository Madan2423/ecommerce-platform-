import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getProductById,
  addToCart,
  addToWishlist,
  getProductReviews,
  getProductRating,
  createReview,
  updateReview,
  deleteReview,
} from "../services/api";

import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [product, setProduct] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [ratingSummary, setRatingSummary] =
    useState({
      averageRating: 0,
      totalReviews: 0,
    });

  const [quantity, setQuantity] =
    useState(1);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [editingReviewId, setEditingReviewId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  const [submittingReview, setSubmittingReview] =
    useState(false);

  const [error, setError] =
    useState("");

  const [reviewError, setReviewError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getProductById(id);

      setProduct(
        data.product || data
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews() {
    try {
      setReviewsLoading(true);

      const [
        reviewsData,
        ratingData,
      ] = await Promise.all([
        getProductReviews(id),
        getProductRating(id),
      ]);

      setReviews(
        reviewsData.reviews || []
      );

      setRatingSummary({
        averageRating:
          Number(
            ratingData.averageRating
          ) || 0,

        totalReviews:
          Number(
            ratingData.totalReviews
          ) || 0,
      });
    } catch (err) {
      console.error(
        "Failed to load reviews:",
        err.message
      );
    } finally {
      setReviewsLoading(false);
    }
  }

  function increaseQuantity() {
    if (
      product &&
      quantity < product.stock
    ) {
      setQuantity(
        (previous) =>
          previous + 1
      );
    }
  }

  function decreaseQuantity() {
    setQuantity(
      (previous) =>
        Math.max(1, previous - 1)
    );
  }

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setMessage("");
      setError("");

      await addToCart(
        product.id,
        quantity
      );

      setMessage(
        "Product added to cart successfully."
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddToWishlist() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setMessage("");
      setError("");

      await addToWishlist(
        product.id
      );

      setMessage(
        "Product added to wishlist successfully."
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function renderStars(value) {
    const rounded =
      Math.round(value);

    return (
      <span
        className="text-warning"
        style={{
          letterSpacing: "2px",
        }}
      >
        {Array.from(
          { length: 5 },
          (_, index) =>
            index < rounded
              ? "★"
              : "☆"
        ).join("")}
      </span>
    );
  }

  function startEditingReview(
    review
  ) {
    setEditingReviewId(
      review.id
    );

    setRating(
      Number(review.rating)
    );

    setComment(
      review.comment
    );

    setReviewError("");

    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingReviewId(null);
    setRating(5);
    setComment("");
    setReviewError("");
  }

  async function handleReviewSubmit(
    event
  ) {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
      setReviewError(
        "Please write a review."
      );
      return;
    }

    if (
      rating < 1 ||
      rating > 5
    ) {
      setReviewError(
        "Please select a rating between 1 and 5."
      );
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");

      if (editingReviewId) {
        await updateReview(
          editingReviewId,
          rating,
          comment
        );

        setMessage(
          "Review updated successfully."
        );
      } else {
        await createReview(
          product.id,
          rating,
          comment
        );

        setMessage(
          "Review submitted successfully."
        );
      }

      cancelEditing();

      await loadReviews();
    } catch (err) {
      setReviewError(
        err.message
      );
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleDeleteReview(
    reviewId
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setReviewError("");

      await deleteReview(
        reviewId
      );

      setMessage(
        "Review deleted successfully."
      );

      await loadReviews();
    } catch (err) {
      setReviewError(
        err.message
      );
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
          Loading product...
        </p>

      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error ||
            "Product not found."}
        </div>

        <Link
          to="/products"
          className="btn btn-primary"
        >
          Back to Products
        </Link>

      </div>
    );
  }

  const imageUrl =
    product.image_url;

  const stock =
    Number(product.stock) || 0;

  const price =
    Number(product.price) || 0;

  return (
    <div className="container py-5">

      {/* BREADCRUMB */}

      <div className="mb-4">

        <Link to="/">
          Home
        </Link>

        <span className="mx-2">
          /
        </span>

        <Link to="/products">
          Products
        </Link>

        <span className="mx-2">
          /
        </span>

        <span className="text-muted">
          {product.name}
        </span>

      </div>


      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}


      {/* PRODUCT */}

      <div className="row g-5">

        {/* IMAGE */}

        <div className="col-lg-6">

          <div
            className="bg-light rounded shadow-sm d-flex align-items-center justify-content-center"
            style={{
              minHeight: "500px",
            }}
          >

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="img-fluid rounded"
                style={{
                  maxHeight:
                    "500px",
                  width: "100%",
                  objectFit:
                    "contain",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize:
                    "120px",
                }}
              >
                🛍️
              </div>
            )}

          </div>

        </div>


        {/* PRODUCT INFORMATION */}

        <div className="col-lg-6">

          <span className="badge bg-secondary mb-3">
            {product.category_name ||
              "Product"}
          </span>

          <h1 className="fw-bold">
            {product.name}
          </h1>

          {/* RATING */}

          <div className="d-flex align-items-center gap-2 mb-3">

            {renderStars(
              ratingSummary.averageRating
            )}

            <span className="fw-semibold">
              {ratingSummary.averageRating.toFixed(
                1
              )}
            </span>

            <span className="text-muted">
              (
              {
                ratingSummary.totalReviews
              }{" "}
              reviews)
            </span>

          </div>

          <h2 className="text-primary fw-bold mb-4">
            ₹{price.toFixed(2)}
          </h2>

          <p className="text-muted fs-5">
            {product.description ||
              "No description available for this product."}
          </p>


          {/* STOCK */}

          <div className="mb-4">

            {stock > 0 ? (
              <span className="text-success fw-semibold">
                ✓ In Stock ({stock} available)
              </span>
            ) : (
              <span className="text-danger fw-semibold">
                ✕ Out of Stock
              </span>
            )}

          </div>


          {/* QUANTITY */}

          {stock > 0 && (
            <div className="mb-4">

              <label className="form-label fw-semibold">
                Quantity
              </label>

              <div
                className="input-group"
                style={{
                  maxWidth: "180px",
                }}
              >

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <= 1
                  }
                >
                  −
                </button>

                <input
                  type="text"
                  className="form-control text-center"
                  value={quantity}
                  readOnly
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    quantity >= stock
                  }
                >
                  +
                </button>

              </div>

            </div>
          )}


          {/* ERROR */}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}


          {/* ACTIONS */}

          <div className="d-flex gap-2 flex-wrap">

            <button
              className="btn btn-primary btn-lg"
              onClick={
                handleAddToCart
              }
              disabled={
                stock <= 0
              }
            >
              🛒 Add to Cart
            </button>

            <button
              className="btn btn-outline-danger btn-lg"
              onClick={
                handleAddToWishlist
              }
            >
              ♡ Wishlist
            </button>

          </div>

        </div>

      </div>


      {/* REVIEWS */}

      <div className="row mt-5">

        <div className="col-lg-8">

          <div className="card shadow-sm">

            <div className="card-body p-4">

              <h2 className="fw-bold mb-4">
                Customer Reviews
              </h2>


              {/* RATING SUMMARY */}

              <div className="bg-light rounded p-4 mb-4">

                <div className="row align-items-center">

                  <div className="col-md-4 text-center">

                    <div
                      className="display-4 fw-bold"
                    >
                      {ratingSummary.averageRating.toFixed(
                        1
                      )}
                    </div>

                    <div>
                      {renderStars(
                        ratingSummary.averageRating
                      )}
                    </div>

                    <div className="text-muted mt-1">
                      {
                        ratingSummary.totalReviews
                      }{" "}
                      reviews
                    </div>

                  </div>

                  <div className="col-md-8">

                    <p className="text-muted mb-0">
                      Customer ratings and reviews
                      help other shoppers make
                      better purchasing decisions.
                    </p>

                  </div>

                </div>

              </div>


              {/* REVIEW FORM */}

              {isAuthenticated ? (
                <div className="border rounded p-4 mb-4">

                  <h5 className="fw-bold mb-3">

                    {editingReviewId
                      ? "Edit Your Review"
                      : "Write a Review"}

                  </h5>


                  {/* RATING SELECTOR */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Your Rating
                    </label>

                    <div>

                      {[
                        1,
                        2,
                        3,
                        4,
                        5,
                      ].map(
                        (star) => (
                          <button
                            key={star}
                            type="button"
                            className="btn p-0 me-1"
                            onClick={() =>
                              setRating(
                                star
                              )
                            }
                            style={{
                              fontSize:
                                "32px",
                              color:
                                star <=
                                rating
                                  ? "#ffc107"
                                  : "#ced4da",
                            }}
                          >
                            ★
                          </button>
                        )
                      )}

                    </div>

                  </div>


                  {/* COMMENT */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Your Review
                    </label>

                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Share your experience with this product..."
                      value={comment}
                      onChange={(event) =>
                        setComment(
                          event.target
                            .value
                        )
                      }
                    ></textarea>

                  </div>


                  {reviewError && (
                    <div className="alert alert-danger">
                      {reviewError}
                    </div>
                  )}


                  <div className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={
                        handleReviewSubmit
                      }
                      disabled={
                        submittingReview
                      }
                    >
                      {submittingReview
                        ? "Saving..."
                        : editingReviewId
                        ? "Update Review"
                        : "Submit Review"}
                    </button>

                    {editingReviewId && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={
                          cancelEditing
                        }
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </div>
              ) : (
                <div className="alert alert-info">

                  <Link to="/login">
                    Login
                  </Link>{" "}
                  to write a review.

                </div>
              )}


              {/* REVIEWS LIST */}

              {reviewsLoading ? (
                <div className="text-center py-4">

                  <div
                    className="spinner-border"
                    role="status"
                  ></div>

                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-5">

                  <div
                    style={{
                      fontSize:
                        "50px",
                    }}
                  >
                    ⭐
                  </div>

                  <h5 className="fw-bold">
                    No reviews yet
                  </h5>

                  <p className="text-muted">
                    Be the first customer to
                    review this product.
                  </p>

                </div>
              ) : (
                reviews.map(
                  (review) => (
                    <div
                      key={
                        review.id
                      }
                      className="border-bottom py-4"
                    >

                      <div className="d-flex justify-content-between align-items-start">

                        <div>

                          <h6 className="fw-bold mb-1">
                            {review.user_name ||
                              "Customer"}
                          </h6>

                          <div className="mb-2">
                            {renderStars(
                              review.rating
                            )}
                          </div>

                        </div>


                        {/* OWNER ACTIONS */}

                        {user?.id ===
                          review.user_id && (
                          <div className="d-flex gap-2">

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                startEditingReview(
                                  review
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteReview(
                                  review.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>
                        )}

                      </div>


                      <p className="mb-2">
                        {review.comment}
                      </p>

                      <small className="text-muted">
                        {review.created_at}
                      </small>

                    </div>
                  )
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;