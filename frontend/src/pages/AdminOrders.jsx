import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders();

      const orderList = data.orders || data || [];

      setOrders(
        Array.isArray(orderList) ? orderList : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      setError("");
      setSuccess("");
      setUpdatingId(orderId);

      await updateAdminOrderStatus(
        orderId,
        status
      );

      setSuccess(
        `Order #${orderId} status updated to ${status}.`
      );

      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";

      case "processing":
        return "bg-info text-dark";

      case "shipped":
        return "bg-primary";

      case "delivered":
        return "bg-success";

      case "cancelled":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  }

  function formatDate(date) {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
  }

  return (
    <div className="container py-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h1 className="fw-bold mb-1">
            Order Management
          </h1>

          <p className="text-muted mb-0">
            Manage customer orders and update order status.
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

      {/* ORDERS */}

      <div className="card shadow-sm">

        <div className="card-body p-0">

          <div className="p-4 border-bottom">
            <h4 className="fw-bold mb-0">
              All Customer Orders
            </h4>
          </div>

          {loading ? (
            <div className="text-center py-5">

              <div
                className="spinner-border"
                role="status"
              ></div>

              <p className="mt-3 mb-0">
                Loading orders...
              </p>

            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">

              <h5>
                No orders found
              </h5>

              <p className="text-muted mb-0">
                Customer orders will appear here.
              </p>

            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-dark">

                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Update Status</th>
                  </tr>

                </thead>

                <tbody>

                  {orders.map((order) => (

                    <tr key={order.id}>

                      {/* ORDER ID */}

                      <td>
                        <strong>
                          #{order.id}
                        </strong>
                      </td>

                      {/* CUSTOMER */}

                      <td>
                        {order.customer_name ||
                          order.user_name ||
                          order.name ||
                          "N/A"}
                      </td>

                      {/* EMAIL */}

                      <td>
                        {order.email ||
                          order.customer_email ||
                          "N/A"}
                      </td>

                      {/* AMOUNT */}

                      <td>
                        <strong>
                          ₹
                          {Number(
                            order.total_amount || 0
                          ).toFixed(2)}
                        </strong>
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`badge ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </td>

                      {/* DATE */}

                      <td>
                        <small>
                          {formatDate(
                            order.created_at
                          )}
                        </small>
                      </td>

                      {/* STATUS UPDATE */}

                      <td>

                        <select
                          className="form-select form-select-sm"
                          value={
                            order.status || "pending"
                          }
                          disabled={
                            updatingId === order.id ||
                            order.status === "cancelled" ||
                            order.status === "delivered"
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              order.id,
                              event.target.value
                            )
                          }
                        >

                          <option value="pending">
                            Pending
                          </option>

                          <option value="processing">
                            Processing
                          </option>

                          <option value="shipped">
                            Shipped
                          </option>

                          <option value="delivered">
                            Delivered
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>

                        </select>

                        {updatingId === order.id && (
                          <small className="text-muted">
                            Updating...
                          </small>
                        )}

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

export default AdminOrders;