const express = require("express");
const cors = require("cors");
require("dotenv").config();

const createTables = require("./database/initDatabase");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      /*
       * Allow requests without an Origin header.
       *
       * This is useful for direct browser requests,
       * Postman, server-to-server requests, etc.
       */
      if (!origin) {
        return callback(null, true);
      }

      /*
       * Allow localhost frontend.
       */
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      /*
       * Development fallback:
       * allow localhost / 127.0.0.1 origins.
       */
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(
        new Error("CORS policy: Origin not allowed")
      );
    },

    credentials: true,
  })
);


/*
|--------------------------------------------------------------------------
| BODY PARSER
|--------------------------------------------------------------------------
*/

app.use(express.json());


/*
|--------------------------------------------------------------------------
| DATABASE
|--------------------------------------------------------------------------
*/

createTables();


/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/reviews", reviewRoutes);


/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce API is running",
    status: "healthy",
  });
});


/*
|--------------------------------------------------------------------------
| 404 HANDLER
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});


/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (
    err.message &&
    err.message.includes("CORS policy")
  ) {
    return res.status(403).json({
      message: "CORS policy blocked this request",
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
});


/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});