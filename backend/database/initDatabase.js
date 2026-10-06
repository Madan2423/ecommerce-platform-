const db = require("./database");

const createTables = () => {
  db.serialize(() => {
    
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

   
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

   
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

    // Add new product columns if they don't already exist
    db.run(
      `ALTER TABLE products ADD COLUMN brand TEXT`,
      (err) => {
        if (err && !err.message.includes("duplicate column")) {
          console.error("Brand column error:", err.message);
        }
      }
    );

    db.run(
      `ALTER TABLE products ADD COLUMN original_price REAL`,
      (err) => {
        if (err && !err.message.includes("duplicate column")) {
          console.error("Original price column error:", err.message);
        }
      }
    );

    db.run(
      `ALTER TABLE products ADD COLUMN discount_percentage REAL DEFAULT 0`,
      (err) => {
        if (err && !err.message.includes("duplicate column")) {
          console.error("Discount column error:", err.message);
        }
      }
    );

    db.run(
      `ALTER TABLE products ADD COLUMN rating REAL DEFAULT 0`,
      (err) => {
        if (err && !err.message.includes("duplicate column")) {
          console.error("Rating column error:", err.message);
        }
      }
    );

    db.run(
      `ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0`,
      (err) => {
        if (err && !err.message.includes("duplicate column")) {
          console.error("Review count column error:", err.message);
        }
      }
    )

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
    `)

   
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
    `)

  
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

   
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        rating INTEGER NOT NULL
          CHECK (rating >= 1 AND rating <= 5),
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

    console.log("Database tables created successfully");

    // =========================
    // SEED CATEGORIES
    // =========================
    db.run(`
      INSERT OR IGNORE INTO categories (name)
      VALUES
        ('Electronics'),
        ('Mobiles'),
        ('Laptops'),
        ('Audio'),
        ('Fashion')
    `);

    // =========================
    // SEED PRODUCTS
    // =========================
    db.get(
      `SELECT COUNT(*) AS count FROM products`,
      (err, row) => {
        if (err) {
          console.error("Product count error:", err.message);
          return;
        }

        // Only insert sample products when database is empty
        if (row.count === 0) {
          const products = [
            {
              name: "iPhone 15",
              brand: "Apple",
              description:
                "Apple iPhone 15 with advanced camera system and powerful performance.",
              price: 69999,
              original_price: 79999,
              discount_percentage: 12.5,
              stock: 25,
              image_url:
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
              category: "Mobiles",
              rating: 4.6,
              review_count: 128
            },
            {
              name: "Samsung Galaxy S24",
              brand: "Samsung",
              description:
                "Samsung Galaxy S24 with powerful performance and premium display.",
              price: 64999,
              original_price: 74999,
              discount_percentage: 13.33,
              stock: 30,
              image_url:
                "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
              category: "Mobiles",
              rating: 4.5,
              review_count: 96
            },
            {
              name: "MacBook Air M3",
              brand: "Apple",
              description:
                "MacBook Air powered by Apple M3 chip with excellent battery life.",
              price: 99999,
              original_price: 114999,
              discount_percentage: 13.04,
              stock: 15,
              image_url:
                "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
              category: "Laptops",
              rating: 4.8,
              review_count: 214
            },
            {
              name: "Sony WH-1000XM5",
              brand: "Sony",
              description:
                "Premium wireless headphones with industry-leading noise cancellation.",
              price: 29999,
              original_price: 34999,
              discount_percentage: 14.29,
              stock: 40,
              image_url:
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
              category: "Audio",
              rating: 4.7,
              review_count: 187
            },
            {
              name: "Nike Air Max",
              brand: "Nike",
              description:
                "Comfortable Nike Air Max running shoes for everyday use.",
              price: 8999,
              original_price: 10999,
              discount_percentage: 18.18,
              stock: 50,
              image_url:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
              category: "Fashion",
              rating: 4.4,
              review_count: 73
            },
            {
              name: "Dell Inspiron 15",
              brand: "Dell",
              description:
                "Dell Inspiron laptop suitable for work, study and everyday computing.",
              price: 57999,
              original_price: 64999,
              discount_percentage: 10.77,
              stock: 20,
              image_url:
                "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
              category: "Laptops",
              rating: 4.3,
              review_count: 84
            }
          ];

          const stmt = db.prepare(`
            INSERT INTO products (
              name,
              brand,
              description,
              price,
              original_price,
              discount_percentage,
              stock,
              image_url,
              category_id,
              rating,
              review_count
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 
              (SELECT id FROM categories WHERE name = ?),
              ?, ?
            )
          `);

          products.forEach((product) => {
            stmt.run(
              product.name,
              product.brand,
              product.description,
              product.price,
              product.original_price,
              product.discount_percentage,
              product.stock,
              product.image_url,
              product.category,
              product.rating,
              product.review_count
            );
          });

          stmt.finalize((finalizeErr) => {
            if (finalizeErr) {
              console.error(
                "Product seed error:",
                finalizeErr.message
              );
            } else {
              console.log("Sample products inserted successfully");
            }
          });
        } else {
          console.log(
            `Products already exist. Total products: ${row.count}`
          );
        }
      }
    );
  });
};

module.exports = createTables;