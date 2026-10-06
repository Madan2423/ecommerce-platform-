import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await registerUser({
        name,
        email,
        password,
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Registration failed."
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
                  Create Account
                </h2>

                <p className="text-muted">
                  Join our E-Commerce Platform
                </p>

              </div>

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

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <label
                    htmlFor="name"
                    className="form-label fw-bold"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                  />

                </div>

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
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    minLength="6"
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Creating Account..."
                    : "Register"}
                </button>

              </form>

              <div className="text-center mt-4">

                <span className="text-muted">
                  Already have an account?{" "}
                </span>

                <Link to="/login">
                  Login
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;