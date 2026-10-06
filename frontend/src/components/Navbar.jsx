import {
  Link,
  NavLink,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container">

        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          E-Commerce
        </Link>


        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">

              <NavLink
                className="nav-link"
                to="/"
              >
                Home
              </NavLink>

            </li>


            <li className="nav-item">

              <NavLink
                className="nav-link"
                to="/products"
              >
                Products
              </NavLink>

            </li>


            {isAuthenticated && (
              <>

                <li className="nav-item">

                  <NavLink
                    className="nav-link"
                    to="/wishlist"
                  >
                    Wishlist
                  </NavLink>

                </li>


                <li className="nav-item">

                  <NavLink
                    className="nav-link"
                    to="/cart"
                  >
                    Cart
                  </NavLink>

                </li>


                <li className="nav-item">

                  <NavLink
                    className="nav-link"
                    to="/orders"
                  >
                    Orders
                  </NavLink>

                </li>

              </>
            )}

          </ul>


          <div className="d-flex align-items-center gap-2">

            {isAuthenticated ? (
              <>

                <span className="text-white">
                  Hi, {user?.name}
                </span>


                <Link
                  to="/account"
                  className="btn btn-outline-light"
                >
                  Account
                </Link>


                {user?.role ===
                  "admin" && (
                  <Link
                    to="/admin"
                    className="btn btn-warning"
                  >
                    Admin
                  </Link>
                )}


                <button
                  className="btn btn-outline-light"
                  onClick={logout}
                >
                  Logout
                </button>

              </>
            ) : (
              <>

                <Link
                  to="/login"
                  className="btn btn-outline-light"
                >
                  Login
                </Link>


                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Register
                </Link>

              </>
            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;