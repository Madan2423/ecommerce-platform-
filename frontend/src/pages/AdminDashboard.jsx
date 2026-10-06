import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAdminDashboard,
  getAdminOrders,
} from "../services/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, ordersData] =
        await Promise.all([
          getAdminDashboard(),
          getAdminOrders(),
        ]);

      setDashboard(dashboardData);

      const orderList =
        ordersData.orders || ordersData || [];

      setOrders(
        Array.isArray(orderList)
          ? orderList
          : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          Loading admin dashboard...
        </p>

      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error}
        </div>

      </div>
    );
  }

  const statistics =
    dashboard?.statistics ||
    dashboard?.stats ||
    {};

  const totalProducts =
    statistics.totalProducts ||
    statistics.total_products ||
    0;

  const totalUsers =
    statistics.totalUsers ||
    statistics.total_users ||
    0;

  const totalOrders =
    statistics.totalOrders ||
    statistics.total_orders ||
    orders.length ||
    0;

  const totalRevenue =
    statistics.totalRevenue ||
    statistics.total_revenue ||
    0;

  return (
    <div className="container py-5">

      {/* HEADER */}

      <div className="mb-5">

        <h1 className="fw-bold">
          Admin Dashboard
        </h1>

        <p className="text-muted">
          Manage your e-commerce platform.
        </p>

      </div>

      {/* STATISTICS */}

      <div className="row g-4 mb-5">

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <p className="text-muted mb-1">
                Products
              </p>

              <h2 className="fw-bold mb-0">
                {totalProducts}
              </h2>

            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <p className="text-muted mb-1">
                Users
              </p>

              <h2 className="fw-bold mb-0">
                {totalUsers}
              </h2>

            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <p className="text-muted mb-1">
                Orders
              </p>

              <h2 className="fw-bold mb-0">
                {totalOrders}
              </h2>

            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <p className="text-muted mb-1">
                Revenue
              </p>

              <h2 className="fw-bold mb-0">
                ₹{Number(totalRevenue).toFixed(2)}
              </h2>

            </div>
          </div>
        </div>

      </div>

      {/* MANAGEMENT */}

      <h3 className="fw-bold mb-4">
        Management
      </h3>

      <div className="row g-4 mb-5">

        {/* PRODUCTS */}

        <div className="col-md-4">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <h4 className="fw-bold">
                Products
              </h4>

              <p className="text-muted">
                Create, edit and delete products.
              </p>

              <Link
                to="/admin/products"
                className="btn btn-primary"
              >
                Manage Products
              </Link>

            </div>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="col-md-4">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <h4 className="fw-bold">
                Categories
              </h4>

              <p className="text-muted">
                Manage product categories.
              </p>

              <Link
                to="/admin/categories"
                className="btn btn-primary"
              >
                Manage Categories
              </Link>

            </div>

          </div>

        </div>

        {/* ORDERS */}

        <div className="col-md-4">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <h4 className="fw-bold">
                Orders
              </h4>

              <p className="text-muted">
                View and manage customer orders.
              </p>

              <Link
                to="/admin/orders"
                className="btn btn-primary"
              >
                Manage Orders
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* RECENT ORDERS */}

      <div className="card shadow-sm">

        <div className="card-body p-0">

          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">

            <h4 className="fw-bold mb-0">
              Recent Orders
            </h4>

            <Link
              to="/admin/orders"
              className="btn btn-sm btn-outline-primary"
            >
              View All
            </Link>

          </div>

          {orders.length === 0 ? (
            <div className="text-center py-5">

              <p className="text-muted mb-0">
                No orders found.
              </p>

            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover mb-0">

                <thead className="table-dark">

                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>

                </thead>

                <tbody>

                  {orders
                    .slice(0, 5)
                    .map((order) => (

                      <tr key={order.id}>

                        <td>
                          #{order.id}
                        </td>

                        <td>
                          {order.customer_name ||
                            order.user_name ||
                            order.name ||
                            "N/A"}
                        </td>

                        <td>
                          ₹
                          {Number(
                            order.total_amount || 0
                          ).toFixed(2)}
                        </td>

                        <td>
                          <span className="badge bg-secondary">
                            {order.status}
                          </span>
                        </td>

                        <td>
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleString()
                            : "N/A"}
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

export default AdminDashboard;