const db = require("./database");

const createTables = () => {
  db.serialize(() => {
    // =========================
    // USERS
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);


    // =========================
    // CATEGORIES
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);


    // =========================
    // PRODUCTS
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        category_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id)
          REFERENCES categories(id)
      )
    `);


    // =========================
    // PRODUCT CATALOG FIELDS
    // =========================

    db.run(
      `
      ALTER TABLE products
      ADD COLUMN brand TEXT
      `,
      (err) => {
        if (
          err &&
          !err.message.includes(
            "duplicate column name"
          )
        ) {
          console.error(
            "Brand column error:",
            err.message
          );
        }
      }
    );

    db.run(
      `
      ALTER TABLE products
      ADD COLUMN original_price REAL
      `,
      (err) => {
        if (
          err &&
          !err.message.includes(
            "duplicate column name"
          )
        ) {
          console.error(
            "Original price column error:",
            err.message
          );
        }
      }
    );

    db.run(
      `
      ALTER TABLE products
      ADD COLUMN discount_percentage REAL DEFAULT 0
      `,
      (err) => {
        if (
          err &&
          !err.message.includes(
            "duplicate column name"
          )
        ) {
          console.error(
            "Discount column error:",
            err.message
          );
        }
      }
    );

    db.run(
      `
      ALTER TABLE products
      ADD COLUMN rating REAL DEFAULT 0
      `,
      (err) => {
        if (
          err &&
          !err.message.includes(
            "duplicate column name"
          )
        ) {
          console.error(
            "Rating column error:",
            err.message
          );
        }
      }
    );

    db.run(
      `
      ALTER TABLE products
      ADD COLUMN review_count INTEGER DEFAULT 0
      `,
      (err) => {
        if (
          err &&
          !err.message.includes(
            "duplicate column name"
          )
        ) {
          console.error(
            "Review count column error:",
            err.message
          );
        }
      }
    );


    // =========================
    // CART
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
          REFERENCES users(id)
      )
    `);


    // =========================
    // CART ITEMS
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cart_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id)
          REFERENCES cart(id),
        FOREIGN KEY (product_id)
          REFERENCES products(id),
        UNIQUE(cart_id, product_id)
      )
    `);


    // =========================
    // WISHLIST
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
          REFERENCES users(id),
        FOREIGN KEY (product_id)
          REFERENCES products(id),
        UNIQUE(user_id, product_id)
      )
    `);


    // =========================
    // ORDERS
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'placed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
          REFERENCES users(id)
      )
    `);


    // =========================
    // ORDER ITEMS
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (order_id)
          REFERENCES orders(id),
        FOREIGN KEY (product_id)
          REFERENCES products(id)
      )
    `);


    // =========================
    // PAYMENTS
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL UNIQUE,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_method TEXT NOT NULL,
        transaction_id TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id)
          REFERENCES orders(id),
        FOREIGN KEY (user_id)
          REFERENCES users(id)
      )
    `);


    // =========================
    // REVIEWS
    // =========================

    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        rating INTEGER NOT NULL
          CHECK (
            rating >= 1
            AND rating <= 5
          ),
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
          REFERENCES users(id),
        FOREIGN KEY (product_id)
          REFERENCES products(id),
        UNIQUE(user_id, product_id)
      )
    `);


    console.log(
      "Database tables created successfully"
    );
  });
};

module.exports = createTables;