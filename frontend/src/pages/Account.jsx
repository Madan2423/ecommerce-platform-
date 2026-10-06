import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Account() {
  const { user } = useAuth();

  const [activeSection, setActiveSection] =
    useState("profile");

  if (!user) {
    return null;
  }

  return (
    <div className="container py-5">

      {/* HEADER */}

      <div className="mb-5">
        <h1 className="fw-bold">
          My Account
        </h1>

        <p className="text-muted">
          Manage your profile and account information.
        </p>
      </div>


      <div className="row g-4">

        {/* SIDEBAR */}

        <div className="col-lg-3">

          <div className="card shadow-sm">

            <div className="card-body p-0">

              <div className="p-4 text-center border-bottom">

                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  {user.name
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>

                <h5 className="fw-bold mb-1">
                  {user.name}
                </h5>

                <small className="text-muted">
                  {user.email}
                </small>

              </div>


              <div className="list-group list-group-flush">

                <button
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    activeSection ===
                    "profile"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSection(
                      "profile"
                    )
                  }
                >
                  👤 Profile
                </button>

                <button
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    activeSection ===
                    "account"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSection(
                      "account"
                    )
                  }
                >
                  ℹ️ Account Information
                </button>

                <Link
                  to="/orders"
                  className="list-group-item list-group-item-action"
                >
                  📦 My Orders
                </Link>

                <Link
                  to="/wishlist"
                  className="list-group-item list-group-item-action"
                >
                  ❤️ Wishlist
                </Link>

                <Link
                  to="/cart"
                  className="list-group-item list-group-item-action"
                >
                  🛒 Cart
                </Link>

              </div>

            </div>

          </div>

        </div>


        {/* CONTENT */}

        <div className="col-lg-9">

          {/* PROFILE */}

          {activeSection ===
            "profile" && (
            <div className="card shadow-sm">

              <div className="card-body p-4">

                <h3 className="fw-bold mb-4">
                  Profile
                </h3>

                <div className="row g-4">

                  <div className="col-md-6">

                    <label className="form-label text-muted">
                      Full Name
                    </label>

                    <div className="form-control bg-light">
                      {user.name}
                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label text-muted">
                      Email Address
                    </label>

                    <div className="form-control bg-light">
                      {user.email}
                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label text-muted">
                      Account Type
                    </label>

                    <div className="form-control bg-light text-capitalize">
                      {user.role ||
                        "customer"}
                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label text-muted">
                      User ID
                    </label>

                    <div className="form-control bg-light">
                      #{user.id}
                    </div>

                  </div>

                </div>


                <div className="alert alert-info mt-4 mb-0">

                  <strong>
                    Profile editing will be added next.
                  </strong>

                  <br />

                  Your current account information is displayed from
                  your authenticated user session.

                </div>

              </div>

            </div>
          )}


          {/* ACCOUNT INFORMATION */}

          {activeSection ===
            "account" && (
            <div className="card shadow-sm">

              <div className="card-body p-4">

                <h3 className="fw-bold mb-4">
                  Account Information
                </h3>


                <div className="row g-4">

                  <div className="col-md-6">

                    <div className="border rounded p-4 h-100">

                      <div className="text-muted mb-2">
                        User ID
                      </div>

                      <h4 className="fw-bold">
                        #{user.id}
                      </h4>

                    </div>

                  </div>


                  <div className="col-md-6">

                    <div className="border rounded p-4 h-100">

                      <div className="text-muted mb-2">
                        Account Role
                      </div>

                      <h4 className="fw-bold text-capitalize">
                        {user.role ||
                          "customer"}
                      </h4>

                    </div>

                  </div>


                  <div className="col-12">

                    <div className="border rounded p-4">

                      <div className="text-muted mb-2">
                        Email
                      </div>

                      <h5 className="fw-semibold">
                        {user.email}
                      </h5>

                      <small className="text-muted">
                        This email is associated with your
                        authenticated account.
                      </small>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Account;