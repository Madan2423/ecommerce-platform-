const db = require("./database");

console.log("Checking products...");

db.all(
  `
    SELECT id, name, brand, price, image_url
    FROM products
    ORDER BY id ASC
  `,
  [],
  (err, products) => {
    if (err) {
      console.error("Failed to fetch products:", err.message);
      return;
    }

    console.table(products);

    const seen = new Set();
    const duplicateIds = [];

    products.forEach((product) => {
      const key = `${product.name.trim().toLowerCase()}|${product.brand || ""}`;

      if (seen.has(key)) {
        duplicateIds.push(product.id);
      } else {
        seen.add(key);
      }
    });

    if (duplicateIds.length === 0) {
      console.log("No duplicate products found.");
      db.close();
      return;
    }

    console.log("Duplicate product IDs:", duplicateIds);

    const placeholders = duplicateIds.map(() => "?").join(",");

    db.run(
      `
        DELETE FROM products
        WHERE id IN (${placeholders})
      `,
      duplicateIds,
      function (err) {
        if (err) {
          console.error("Failed to delete duplicates:", err.message);
          db.close();
          return;
        }

        console.log(`Deleted ${this.changes} duplicate product(s).`);
        db.close();
      }
    );
  }
);