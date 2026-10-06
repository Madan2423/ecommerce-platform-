import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getProducts,
  getCategories,
  getBrands,
  addToCart,
  addToWishlist,
} from "../services/api";

import { useAuth } from "../context/AuthContext";


function Products() {
  /*
  |--------------------------------------------------------------------------
  | AUTH
  |--------------------------------------------------------------------------
  */

  const { isAuthenticated } = useAuth();


  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);


  /*
  |--------------------------------------------------------------------------
  | FILTERS
  |--------------------------------------------------------------------------
  */

  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    brand: "",
    min_price: "",
    max_price: "",
    min_rating: "",
    min_discount: "",
    sort: "newest",
  });


  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const PRODUCTS_PER_PAGE = 12;


  /*
  |--------------------------------------------------------------------------
  | UI STATE
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cartLoading, setCartLoading] = useState(null);

  const [wishlistLoading, setWishlistLoading] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | LOAD CATEGORIES + BRANDS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadCategories();

    loadBrands();
  }, []);


  async function loadCategories() {
    try {
      const data = await getCategories();

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }


  async function loadBrands() {
    try {
      const data = await getBrands();

      setBrands(data.brands || []);
    } catch (error) {
      console.error("Failed to load brands:", error);
    }
  }


  /*
  |--------------------------------------------------------------------------
  | LOAD PRODUCTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadProducts();
  }, [filters, page]);


  async function loadProducts() {
    try {
      setLoading(true);

      setError("");

      const data = await getProducts({
        ...filters,
        page,
        limit: PRODUCTS_PER_PAGE,
      });

      setProducts(data.products || []);

      setTotalProducts(data.totalProducts || 0);

      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(
        error.message || "Failed to fetch products"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  function handleSearch(event) {
    event.preventDefault();

    setFilters((previous) => ({
      ...previous,
      search: searchInput.trim(),
    }));

    setPage(1);
  }


  /*
  |--------------------------------------------------------------------------
  | FILTER CHANGE
  |--------------------------------------------------------------------------
  */

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPage(1);
  }


  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  function handleReset() {
    setSearchInput("");

    setFilters({
      search: "",
      category_id: "",
      brand: "",
      min_price: "",
      max_price: "",
      min_rating: "",
      min_discount: "",
      sort: "newest",
    });

    setPage(1);
  }


  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  async function handleAddToCart(productId) {
    if (!isAuthenticated) {
      alert("Please login to add products to cart.");

      return;
    }

    try {
      setCartLoading(productId);

      await addToCart(productId, 1);

      alert("Product added to cart successfully.");
    } catch (error) {
      alert(error.message || "Failed to add product to cart.");
    } finally {
      setCartLoading(null);
    }
  }


  /*
  |--------------------------------------------------------------------------
  | ADD TO WISHLIST
  |--------------------------------------------------------------------------
  */

  async function handleAddToWishlist(productId) {
    if (!isAuthenticated) {
      alert("Please login to add products to wishlist.");

      return;
    }

    try {
      setWishlistLoading(productId);

      await addToWishlist(productId);

      alert("Product added to wishlist.");
    } catch (error) {
      alert(error.message || "Failed to add product to wishlist.");
    } finally {
      setWishlistLoading(null);
    }
  }


  /*
  |--------------------------------------------------------------------------
  | FORMAT PRICE
  |--------------------------------------------------------------------------
  */

  function formatPrice(price) {
    return Number(price).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  }


  /*
  |--------------------------------------------------------------------------
  | STAR DISPLAY
  |--------------------------------------------------------------------------
  */

  function renderStars(rating) {
    const roundedRating = Math.round(Number(rating) || 0);

    return (
      <span className="text-warning">
        {"★".repeat(roundedRating)}
        <span className="text-secondary">
          {"★".repeat(5 - roundedRating)}
        </span>
      </span>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading && products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3 text-muted">
          Loading products...
        </p>
      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div className="container">

        <div className="mb-4">

          <h1 className="fw-bold mb-1">
            Our Products
          </h1>

          <p className="text-muted mb-0">
            Discover products across multiple categories
          </p>

        </div>


        {/* ==============================================================
            SEARCH BAR
        =============================================================== */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body">

            <form onSubmit={handleSearch}>

              <div className="input-group input-group-lg">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products, brands and categories..."
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                />

                <button
                  className="btn btn-primary px-4"
                  type="submit"
                >
                  🔍 Search
                </button>

              </div>

            </form>

          </div>

        </div>


        {/* ==============================================================
            FILTERS
        =============================================================== */}

        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body">

            <div className="row g-3">

              {/* CATEGORY */}

              <div className="col-md-6 col-lg-3">

                <label className="form-label fw-semibold">
                  Category
                </label>

                <select
                  name="category_id"
                  value={filters.category_id}
                  onChange={handleFilterChange}
                  className="form-select"
                >

                  <option value="">
                    All Categories
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}

                </select>

              </div>


              {/* BRAND */}

              <div className="col-md-6 col-lg-3">

                <label className="form-label fw-semibold">
                  Brand
                </label>

                <select
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="form-select"
                >

                  <option value="">
                    All Brands
                  </option>

                  {brands.map((brand) => (
                    <option
                      key={brand}
                      value={brand}
                    >
                      {brand}
                    </option>
                  ))}

                </select>

              </div>


              {/* MIN PRICE */}

              <div className="col-md-6 col-lg-3">

                <label className="form-label fw-semibold">
                  Minimum Price
                </label>

                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="₹0"
                  min="0"
                />

              </div>


              {/* MAX PRICE */}

              <div className="col-md-6 col-lg-3">

                <label className="form-label fw-semibold">
                  Maximum Price
                </label>

                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="₹100000"
                  min="0"
                />

              </div>


              {/* RATING */}

              <div className="col-md-6 col-lg-3">

                <label className="form-label fw-semibold">
                  Rating
                </label>

                <select
                  name="min_rating"
                  value={filters.min_rating}
                  onChange={handleFilterChange}
                  className="form-select"
                >

                  <option value="">
                    Any Rating
                  </option>

                  <option value="4">
                    ⭐ 4+ Rating
                  </option>

                  <option value="3">
                    ⭐ 3+ Rating
                  </option>

                  <option value="2">
                    ⭐ 2+ Rating
                  </option>

                </select>

              </div>


              {/* DISCOUNT */}

              <div className="col-md-6 col-lg-3">

                <label className="form-label fw-semibold">
                  Minimum Discount
                </label>

                <select
                  name="min_discount"
                  value={filters.min_discount}
                  onChange={handleFilterChange}
                  className="form-select"
                >

                  <option value="">
                    Any Discount
                  </option>

                  <option value="10">
                    10% or more
                  </option>

                  <option value="20">
                    20% or more
                  </option>

                  <option value="30">
                    30% or more
                  </option>

                  <option value="40">
                    40% or more
                  </option>

                  <option value="50">
                    50% or more
                  </option>

                </select>

              </div>


              {/* SORT */}

              <div className="col-md-6 col-lg-3">

                <label className="form-label fw-semibold">
                  Sort By
                </label>

                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="form-select"
                >

                  <option value="newest">
                    Newest
                  </option>

                  <option value="price_asc">
                    Price: Low to High
                  </option>

                  <option value="price_desc">
                    Price: High to Low
                  </option>

                  <option value="rating_desc">
                    Highest Rated
                  </option>

                  <option value="discount_desc">
                    Highest Discount
                  </option>

                  <option value="name_asc">
                    Name: A to Z
                  </option>

                  <option value="name_desc">
                    Name: Z to A
                  </option>

                </select>

              </div>


              {/* RESET */}

              <div className="col-md-6 col-lg-3 d-flex align-items-end">

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={handleReset}
                >
                  Reset Filters
                </button>

              </div>

            </div>

          </div>

        </div>


        {/* ==============================================================
            RESULTS HEADER
        =============================================================== */}

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>

            <h5 className="mb-1 fw-bold">
              {totalProducts} Products
            </h5>

            <small className="text-muted">
              Page {page} of {totalPages || 1}
            </small>

          </div>

          {loading && (
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            />
          )}

        </div>


        {/* ==============================================================
            ERROR
        =============================================================== */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}


        {/* ==============================================================
            EMPTY
        =============================================================== */}

        {!loading && products.length === 0 && !error && (
          <div className="card border-0 shadow-sm">

            <div className="card-body text-center py-5">

              <div className="display-4 mb-3">
                🔍
              </div>

              <h4>
                No products found
              </h4>

              <p className="text-muted">
                Try changing your search or filters.
              </p>

              <button
                className="btn btn-primary"
                onClick={handleReset}
              >
                Clear Filters
              </button>

            </div>

          </div>
        )}


        {/* ==============================================================
            PRODUCT GRID
        =============================================================== */}

        <div className="row g-4">

          {products.map((product) => (

            <div
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
              key={product.id}
            >

              <div className="card h-100 border-0 shadow-sm product-card">

                {/* PRODUCT IMAGE */}

                <div
                  className="position-relative bg-white"
                  style={{ height: "250px" }}
                >

                  {product.image_url ? (

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-100 h-100"
                      style={{
                        objectFit: "contain",
                        padding: "15px",
                      }}
                    />

                  ) : (

                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">

                      <span className="display-1">
                        🛍️
                      </span>

                    </div>

                  )}


                  {/* DISCOUNT */}

                  {Number(product.discount_percentage) > 0 && (

                    <span className="position-absolute top-0 start-0 m-2 badge bg-danger">

                      {Number(product.discount_percentage).toFixed(0)}% OFF

                    </span>

                  )}


                  {/* WISHLIST */}

                  <button
                    type="button"
                    className="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-2"
                    onClick={() =>
                      handleAddToWishlist(product.id)
                    }
                    disabled={
                      wishlistLoading === product.id
                    }
                    title="Add to Wishlist"
                  >

                    {wishlistLoading === product.id
                      ? "..."
                      : "♡"}

                  </button>

                </div>


                {/* PRODUCT BODY */}

                <div className="card-body d-flex flex-column">

                  {/* BRAND */}

                  {product.brand && (

                    <small className="text-primary fw-semibold">
                      {product.brand}
                    </small>

                  )}


                  {/* NAME */}

                  <Link
                    to={`/products/${product.id}`}
                    className="text-dark"
                  >

                    <h5
                      className="card-title mt-1 mb-2"
                      style={{
                        minHeight: "48px",
                      }}
                    >
                      {product.name}
                    </h5>

                  </Link>


                  {/* RATING */}

                  <div className="mb-2">

                    <span className="badge bg-success me-2">

                      {Number(product.rating || 0).toFixed(1)} ★

                    </span>

                    <small className="text-muted">

                      {product.review_count || 0} reviews

                    </small>

                  </div>


                  {/* PRICE */}

                  <div className="mb-2">

                    <span className="fs-5 fw-bold me-2">

                      {formatPrice(product.price)}

                    </span>

                    {Number(product.original_price) >
                      Number(product.price) && (

                      <span className="text-muted text-decoration-line-through">

                        {formatPrice(product.original_price)}

                      </span>

                    )}

                  </div>


                  {/* STARS */}

                  <div className="small mb-2">

                    {renderStars(product.rating)}

                  </div>


                  {/* STOCK */}

                  <div className="small mb-3">

                    {Number(product.stock) > 0 ? (

                      <span className="text-success">
                        ✓ In Stock
                      </span>

                    ) : (

                      <span className="text-danger">
                        Out of Stock
                      </span>

                    )}

                  </div>


                  {/* BUTTONS */}

                  <div className="mt-auto">

                    <div className="d-grid gap-2">

                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={
                          product.stock <= 0 ||
                          cartLoading === product.id
                        }
                        onClick={() =>
                          handleAddToCart(product.id)
                        }
                      >

                        {cartLoading === product.id
                          ? "Adding..."
                          : "🛒 Add to Cart"}

                      </button>


                      <Link
                        to={`/products/${product.id}`}
                        className="btn btn-outline-primary"
                      >
                        View Product
                      </Link>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* ==============================================================
            PAGINATION
        =============================================================== */}

        {totalPages > 1 && (

          <div className="d-flex justify-content-center mt-5">

            <nav>

              <ul className="pagination">

                {/* PREVIOUS */}

                <li
                  className={`page-item ${
                    page === 1
                      ? "disabled"
                      : ""
                  }`}
                >

                  <button
                    className="page-link"
                    onClick={() =>
                      setPage((previous) =>
                        Math.max(previous - 1, 1)
                      )
                    }
                    disabled={page === 1}
                  >
                    Previous
                  </button>

                </li>


                {/* PAGE NUMBERS */}

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                )
                  .filter((pageNumber) => {

                    if (totalPages <= 7) {
                      return true;
                    }

                    if (pageNumber === 1) {
                      return true;
                    }

                    if (pageNumber === totalPages) {
                      return true;
                    }

                    return (
                      pageNumber >= page - 2 &&
                      pageNumber <= page + 2
                    );
                  })
                  .map((pageNumber) => (

                    <li
                      key={pageNumber}
                      className={`page-item ${
                        pageNumber === page
                          ? "active"
                          : ""
                      }`}
                    >

                      <button
                        className="page-link"
                        onClick={() =>
                          setPage(pageNumber)
                        }
                      >
                        {pageNumber}
                      </button>

                    </li>

                  ))}


                {/* NEXT */}

                <li
                  className={`page-item ${
                    page === totalPages
                      ? "disabled"
                      : ""
                  }`}
                >

                  <button
                    className="page-link"
                    onClick={() =>
                      setPage((previous) =>
                        Math.min(
                          previous + 1,
                          totalPages
                        )
                      )
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </button>

                </li>

              </ul>

            </nav>

          </div>

        )}

      </div>

    </div>
  );
}

export default Products;