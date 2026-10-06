import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-lg-6 mb-4 mb-lg-0">

              <span className="badge bg-primary mb-3">
                Welcome to our store
              </span>

              <h1 className="display-4 fw-bold mb-3">
                Everything You Need,
                <br />
                All in One Place
              </h1>

              <p className="lead text-muted mb-4">
                Discover quality products at great prices.
                Shop easily, securely, and conveniently.
              </p>

              <div className="d-flex gap-3">

                <Link
                  to="/products"
                  className="btn btn-primary btn-lg"
                >
                  Shop Now
                </Link>

                <Link
                  to="/products"
                  className="btn btn-outline-dark btn-lg"
                >
                  View Products
                </Link>

              </div>

            </div>

            <div className="col-lg-6">

              <div className="bg-primary text-white rounded-4 p-5 text-center">

                <div className="display-1 mb-3">
                  🛒
                </div>

                <h2 className="fw-bold">
                  Shop Smart
                </h2>

                <p className="mb-0">
                  Find the products you love at the
                  best prices.
                </p>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-5">

        <div className="container">

          <div className="row g-4">

            <div className="col-md-4">

              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    🚚
                  </div>

                  <h5 className="fw-bold">
                    Fast Delivery
                  </h5>

                  <p className="text-muted mb-0">
                    Get your products delivered quickly
                    and safely.
                  </p>

                </div>
              </div>

            </div>


            <div className="col-md-4">

              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    🔒
                  </div>

                  <h5 className="fw-bold">
                    Secure Payment
                  </h5>

                  <p className="text-muted mb-0">
                    Your payments and personal information
                    are protected.
                  </p>

                </div>
              </div>

            </div>


            <div className="col-md-4">

              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    ⭐
                  </div>

                  <h5 className="fw-bold">
                    Quality Products
                  </h5>

                  <p className="text-muted mb-0">
                    Shop from a collection of quality
                    products.
                  </p>

                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Categories Section */}
      <section className="bg-light py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              Shop by Category
            </h2>

            <p className="text-muted">
              Explore our popular categories
            </p>

          </div>


          <div className="row g-4">

            <div className="col-6 col-md-3">

              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    💻
                  </div>

                  <h5 className="fw-bold">
                    Electronics
                  </h5>

                  <p className="text-muted mb-0">
                    Devices & gadgets
                  </p>

                </div>
              </div>

            </div>


            <div className="col-6 col-md-3">

              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    👕
                  </div>

                  <h5 className="fw-bold">
                    Fashion
                  </h5>

                  <p className="text-muted mb-0">
                    Clothes & accessories
                  </p>

                </div>
              </div>

            </div>


            <div className="col-6 col-md-3">

              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    🏠
                  </div>

                  <h5 className="fw-bold">
                    Home
                  </h5>

                  <p className="text-muted mb-0">
                    Home essentials
                  </p>

                </div>
              </div>

            </div>


            <div className="col-6 col-md-3">

              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">

                  <div className="display-5 mb-3">
                    🎮
                  </div>

                  <h5 className="fw-bold">
                    Gaming
                  </h5>

                  <p className="text-muted mb-0">
                    Gaming products
                  </p>

                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Featured Products */}
      <section className="py-5">

        <div className="container">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h2 className="fw-bold mb-1">
                Featured Products
              </h2>

              <p className="text-muted mb-0">
                Check out some of our popular products
              </p>
            </div>

            <Link
              to="/products"
              className="btn btn-outline-primary"
            >
              View All
            </Link>

          </div>


          <div className="row g-4">

            <div className="col-md-6 col-lg-3">

              <div className="card h-100 shadow-sm">

                <div className="bg-light text-center p-5">
                  <span className="display-3">
                    🎧
                  </span>
                </div>

                <div className="card-body">

                  <h5 className="fw-bold">
                    Wireless Headphones
                  </h5>

                  <p className="text-muted">
                    High-quality wireless audio.
                  </p>

                  <h5 className="fw-bold">
                    ₹2,499
                  </h5>

                </div>

                <div className="card-footer bg-white border-0">

                  <Link
                    to="/products"
                    className="btn btn-primary w-100"
                  >
                    View Product
                  </Link>

                </div>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="card h-100 shadow-sm">

                <div className="bg-light text-center p-5">
                  <span className="display-3">
                    ⌨️
                  </span>
                </div>

                <div className="card-body">

                  <h5 className="fw-bold">
                    Mechanical Keyboard
                  </h5>

                  <p className="text-muted">
                    Comfortable mechanical keyboard.
                  </p>

                  <h5 className="fw-bold">
                    ₹3,499
                  </h5>

                </div>

                <div className="card-footer bg-white border-0">

                  <Link
                    to="/products"
                    className="btn btn-primary w-100"
                  >
                    View Product
                  </Link>

                </div>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="card h-100 shadow-sm">

                <div className="bg-light text-center p-5">
                  <span className="display-3">
                    🖱️
                  </span>
                </div>

                <div className="card-body">

                  <h5 className="fw-bold">
                    Wireless Mouse
                  </h5>

                  <p className="text-muted">
                    Smooth and responsive wireless mouse.
                  </p>

                  <h5 className="fw-bold">
                    ₹1,499
                  </h5>

                </div>

                <div className="card-footer bg-white border-0">

                  <Link
                    to="/products"
                    className="btn btn-primary w-100"
                  >
                    View Product
                  </Link>

                </div>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="card h-100 shadow-sm">

                <div className="bg-light text-center p-5">
                  <span className="display-3">
                    🎒
                  </span>
                </div>

                <div className="card-body">

                  <h5 className="fw-bold">
                    Laptop Backpack
                  </h5>

                  <p className="text-muted">
                    Durable backpack for everyday use.
                  </p>

                  <h5 className="fw-bold">
                    ₹1,999
                  </h5>

                </div>

                <div className="card-footer bg-white border-0">

                  <Link
                    to="/products"
                    className="btn btn-primary w-100"
                  >
                    View Product
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Call To Action */}
      <section className="bg-dark text-white py-5">

        <div className="container text-center">

          <h2 className="fw-bold mb-3">
            Ready to Start Shopping?
          </h2>

          <p className="text-light mb-4">
            Explore our products and find something
            you love.
          </p>

          <Link
            to="/products"
            className="btn btn-primary btn-lg"
          >
            Start Shopping
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;