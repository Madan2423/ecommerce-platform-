import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [productData, categoryData] =
        await Promise.all([
          getProducts(),
          getCategories(),
        ]);

      const productList =
        productData.products || productData || [];

      const categoryList =
        categoryData.categories || categoryData || [];

      setProducts(
        Array.isArray(productList)
          ? productList
          : []
      );

      setCategories(
        Array.isArray(categoryList)
          ? categoryList
          : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      image_url: "",
      category_id: "",
    });

    setEditingId(null);
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      image_url: product.image_url || "",
      category_id:
        product.category_id ||
        product.categoryId ||
        product.category?.id ||
        "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setError("Enter a valid product price.");
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      setError("Enter a valid stock quantity.");
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      image_url: formData.image_url.trim() || null,
      category_id: formData.category_id
        ? Number(formData.category_id)
        : null,
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateProduct(
          editingId,
          productData
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        await createProduct(productData);

        setSuccess(
          "Product created successfully."
        );
      }

      resetForm();

      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteProduct(productId);

      setSuccess(
        "Product deleted successfully."
      );

      if (editingId === productId) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function getCategoryName(product) {
    if (product.category_name) {
      return product.category_name;
    }

    if (product.categoryName) {
      return product.categoryName;
    }

    if (product.category?.name) {
      return product.category.name;
    }

    const categoryId =
      product.category_id ||
      product.categoryId;

    const category = categories.find(
      (item) =>
        String(item.id) === String(categoryId)
    );

    return category?.name || "Uncategorized";
  }

  return (
    <div className="container py-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">
            Product Management
          </h1>

          <p className="text-muted mb-0">
            Create, update and manage your products.
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-outline-dark"
        >
          ← Admin Dashboard
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

      {/* FORM */}

      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">

          <h4 className="fw-bold mb-4">
            {editingId
              ? "Edit Product"
              : "Add New Product"}
          </h4>

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              {/* PRODUCT NAME */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>

              {/* CATEGORY */}

              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Category
                </label>

                <select
                  name="category_id"
                  className="form-select"
                  value={formData.category_id}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* PRICE */}

              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />

              </div>

              {/* STOCK */}

              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  placeholder="0"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                />

              </div>

              {/* IMAGE URL */}

              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image_url"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={handleChange}
                />

              </div>

              {/* IMAGE PREVIEW */}

              {formData.image_url && (
                <div className="col-12">

                  <label className="form-label fw-semibold">
                    Image Preview
                  </label>

                  <div>
                    <img
                      src={formData.image_url}
                      alt="Product preview"
                      style={{
                        width: "180px",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #dee2e6",
                      }}
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>

                </div>
              )}

              {/* DESCRIPTION */}

              <div className="col-12">

                <label className="form-label fw-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>

              </div>

              {/* BUTTONS */}

              <div className="col-12 d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Create Product"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}

              </div>

            </div>

          </form>

        </div>
      </div>

      {/* PRODUCTS TABLE */}

      <div className="card shadow-sm">

        <div className="card-body p-0">

          <div className="p-4 border-bottom">

            <h4 className="fw-bold mb-0">
              All Products
            </h4>

          </div>

          {loading ? (
            <div className="text-center py-5">

              <div
                className="spinner-border"
                role="status"
              ></div>

              <p className="mt-3 mb-0">
                Loading products...
              </p>

            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">

              <h5>
                No products found
              </h5>

              <p className="text-muted">
                Create your first product above.
              </p>

            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-dark">

                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => (

                      <tr key={product.id}>

                        <td>
                          {product.id}
                        </td>

                        {/* IMAGE */}

                        <td>

                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              style={{
                                width: "70px",
                                height: "55px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <span className="text-muted">
                              No image
                            </span>
                          )}

                        </td>

                        <td>
                          <strong>
                            {product.name}
                          </strong>
                        </td>

                        <td>
                          <span className="badge bg-secondary">
                            {getCategoryName(
                              product
                            )}
                          </span>
                        </td>

                        <td>
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </td>

                        <td>

                          <span
                            className={`badge ${
                              Number(
                                product.stock
                              ) > 0
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {product.stock}
                          </span>

                        </td>

                        <td>

                          <div className="d-flex gap-2">

                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default AdminProducts;