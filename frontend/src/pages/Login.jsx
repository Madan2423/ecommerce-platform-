import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginUser({
        email,
        password,
      });

      login(data);

      const destination =
        location.state?.from || "/";

      navigate(destination);
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-12 col-md-8 col-lg-5">

          <div className="card shadow-sm">

            <div className="card-body p-4 p-md-5">

              <div className="text-center mb-4">

                <h2 className="fw-bold">
                  Welcome Back
                </h2>

                <p className="text-muted">
                  Login to your account
                </p>

              </div>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <label
                    htmlFor="email"
                    className="form-label fw-bold"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                  />

                </div>

                <div className="mb-4">

                  <label
                    htmlFor="password"
                    className="form-label fw-bold"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}
                </button>

              </form>

              <div className="text-center mt-4">

                <span className="text-muted">
                  Don't have an account?{" "}
                </span>

                <Link to="/register">
                  Create Account
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;