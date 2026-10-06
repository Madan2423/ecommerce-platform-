const db = require("./database");

const email = "madan@example.com";

db.run(
  `
  UPDATE users
  SET role = 'admin'
  WHERE email = ?
  `,
  [email],
  function (err) {
    if (err) {
      console.error("Failed to update user role:", err.message);
      return;
    }

    if (this.changes === 0) {
      console.log("User not found");
    } else {
      console.log(`${email} is now an admin`);
    }

    db.close();
  }
);