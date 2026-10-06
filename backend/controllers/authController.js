const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../database/database");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check whether email already exists
    db.get(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          console.error("Database error:", err.message);

          return res.status(500).json({
            message: "Internal server error",
          });
        }

        if (user) {
          return res.status(409).json({
            message: "Email is already registered",
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        db.run(
          `
          INSERT INTO users (name, email, password)
          VALUES (?, ?, ?)
          `,
          [name, email, hashedPassword],
          function (err) {
            if (err) {
              console.error("User creation error:", err.message);

              return res.status(500).json({
                message: "Failed to create user",
              });
            }

            return res.status(201).json({
              message: "User registered successfully",
              user: {
                id: this.lastID,
                name,
                email,
                role: "customer",
              },
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          console.error("Database error:", err.message);

          return res.status(500).json({
            message: "Internal server error",
          });
        }

        if (!user) {
          return res.status(401).json({
            message: "Invalid email or password",
          });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatch) {
          return res.status(401).json({
            message: "Invalid email or password",
          });
        }

        // Create JWT
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
};