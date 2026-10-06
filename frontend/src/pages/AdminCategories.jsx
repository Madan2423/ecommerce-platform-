import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      const categoryList = data.categories || data || [];

      setCategories(
        Array.isArray(categoryList) ? categoryList : []
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
    });

    setEditingId(null);
  }

  function handleEdit(category) {
    setEditingId(category.id);

    setFormData({
      name: category.name || "",
      description: category.description || "",
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
      setError("Category name is required.");
      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateCategory(editingId, categoryData);

        setSuccess("Category updated successfully.");
      } else {
        await createCategory(categoryData);

        setSuccess("Category created successfully.");
      }

      resetForm();

      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(categoryId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCategory(categoryId);

      setSuccess("Category deleted successfully.");

      if (editingId === categoryId) {
        resetForm();
      }

      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">
            Category Management
          </h1>

          <p className="text-muted mb-0">
            Create, update and manage product categories.
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

      {/* CATEGORY FORM */}
      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4">
            {editingId
              ? "Edit Category"
              : "Add New Category"}
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* NAME */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Enter category description"
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
                    ? "Update Category"
                    : "Create Category"}
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

      {/* CATEGORY TABLE */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="p-4 border-bottom">
            <h4 className="fw-bold mb-0">
              All Categories
            </h4>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                role="status"
              ></div>

              <p className="mt-3 mb-0">
                Loading categories...
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5">
              <h5>No categories found</h5>

              <p className="text-muted">
                Create your first category above.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>

                      <td>
                        <strong>
                          {category.name}
                        </strong>
                      </td>

                      <td>
                        <span className="text-muted">
                          {category.description
                            ? category.description.length > 60
                              ? `${category.description.substring(
                                  0,
                                  60
                                )}...`
                              : category.description
                            : "No description"}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              handleEdit(category)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleDelete(
                                category.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;