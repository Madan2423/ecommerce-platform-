const db = require("../database/database");

const getCurrentUser = (req, res) => {
  const userId = req.user.id;

  db.get(
    `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE id = ?
    `,
    [userId],
    (err, user) => {
      if (err) {
        console.error("Database error:", err.message);

        return res.status(500).json({
          message: "Internal server error",
        });
      }

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        user,
      });
    }
  );
};

module.exports = {
  getCurrentUser,
};