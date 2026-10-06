const db = require("../database/database");


/* =========================
   CREATE PRODUCT
========================= */

const createProduct = (req, res) => {
  const {
    name,
    brand,
    description,
    price,
    original_price,
    discount_percentage,
    stock,
    image_url,
    category_id,
  } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      message: "Product name is required",
    });
  }

  const productPrice = Number(price);
  const originalPrice =
    original_price !== undefined &&
    original_price !== null &&
    original_price !== ""
      ? Number(original_price)
      : productPrice;

  const productStock = Number(stock);

  let discount =
    discount_percentage !== undefined &&
    discount_percentage !== null &&
    discount_percentage !== ""
      ? Number(discount_percentage)
      : 0;

  if (
    Number.isNaN(productPrice) ||
    productPrice < 0
  ) {
    return res.status(400).json({
      message: "Price must be a valid non-negative number",
    });
  }

  if (
    Number.isNaN(originalPrice) ||
    originalPrice < 0
  ) {
    return res.status(400).json({
      message:
        "Original price must be a valid non-negative number",
    });
  }

  if (
    Number.isNaN(productStock) ||
    productStock < 0 ||
    !Number.isInteger(productStock)
  ) {
    return res.status(400).json({
      message:
        "Stock must be a valid non-negative integer",
    });
  }

  if (
    Number.isNaN(discount) ||
    discount < 0 ||
    discount > 100
  ) {
    return res.status(400).json({
      message:
        "Discount must be between 0 and 100",
    });
  }

  // Automatically calculate discount if original price
  // is greater than selling price and discount was not supplied.
  if (
    (!discount_percentage ||
      Number(discount_percentage) === 0) &&
    originalPrice > productPrice
  ) {
    discount =
      ((originalPrice - productPrice) /
        originalPrice) *
      100;
  }

  db.run(
    `
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name.trim(),
      brand?.trim() || null,
      description?.trim() || null,
      productPrice,
      originalPrice,
      Number(discount.toFixed(2)),
      productStock,
      image_url?.trim() || null,
      category_id || null,
      0,
      0,
    ],
    function (err) {
      if (err) {
        console.error(
          "Create product error:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to create product",
        });
      }

      db.get(
        `
          SELECT
            p.*,
            c.name AS category_name
          FROM products p
          LEFT JOIN categories c
            ON p.category_id = c.id
          WHERE p.id = ?
        `,
        [this.lastID],
        (err, product) => {
          if (err) {
            return res.status(500).json({
              message:
                "Product created but failed to fetch product",
            });
          }

          res.status(201).json({
            message:
              "Product created successfully",
            product,
          });
        }
      );
    }
  );
};


/* =========================
   GET ALL PRODUCTS
========================= */

const getAllProducts = (req, res) => {
  const {
    search,
    category_id,
    brand,
    min_price,
    max_price,
    min_rating,
    min_discount,
    sort = "newest",
    page = 1,
    limit = 12,
  } = req.query;

  const currentPage =
    Math.max(Number(page) || 1, 1);

  const productsPerPage =
    Math.min(
      Math.max(Number(limit) || 12, 1),
      50
    );

  const offset =
    (currentPage - 1) *
    productsPerPage;

  const conditions = [];
  const params = [];

  /* SEARCH */

  if (
    search &&
    search.trim() !== ""
  ) {
    conditions.push(`
      (
        p.name LIKE ?
        OR p.description LIKE ?
        OR p.brand LIKE ?
      )
    `);

    const searchValue =
      `%${search.trim()}%`;

    params.push(
      searchValue,
      searchValue,
      searchValue
    );
  }

  /* CATEGORY */

  if (category_id) {
    conditions.push(
      "p.category_id = ?"
    );

    params.push(category_id);
  }

  /* BRAND */

  if (
    brand &&
    brand.trim() !== ""
  ) {
    conditions.push(
      "p.brand = ?"
    );

    params.push(brand.trim());
  }

  /* MIN PRICE */

  if (
    min_price !== undefined &&
    min_price !== ""
  ) {
    conditions.push(
      "p.price >= ?"
    );

    params.push(
      Number(min_price)
    );
  }

  /* MAX PRICE */

  if (
    max_price !== undefined &&
    max_price !== ""
  ) {
    conditions.push(
      "p.price <= ?"
    );

    params.push(
      Number(max_price)
    );
  }

  /* MIN RATING */

  if (
    min_rating !== undefined &&
    min_rating !== ""
  ) {
    conditions.push(
      "p.rating >= ?"
    );

    params.push(
      Number(min_rating)
    );
  }

  /* MIN DISCOUNT */

  if (
    min_discount !== undefined &&
    min_discount !== ""
  ) {
    conditions.push(
      "p.discount_percentage >= ?"
    );

    params.push(
      Number(min_discount)
    );
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(
          " AND "
        )}`
      : "";

  /* SORTING */

  let orderBy =
    "p.created_at DESC";

  switch (sort) {
    case "price_asc":
      orderBy =
        "p.price ASC";
      break;

    case "price_desc":
      orderBy =
        "p.price DESC";
      break;

    case "name_asc":
      orderBy =
        "p.name ASC";
      break;

    case "name_desc":
      orderBy =
        "p.name DESC";
      break;

    case "rating_desc":
      orderBy =
        "p.rating DESC";
      break;

    case "discount_desc":
      orderBy =
        "p.discount_percentage DESC";
      break;

    case "oldest":
      orderBy =
        "p.created_at ASC";
      break;

    case "newest":
    default:
      orderBy =
        "p.created_at DESC";
      break;
  }

  /* TOTAL COUNT */

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM products p
    ${whereClause}
  `;

  db.get(
    countQuery,
    params,
    (err, countResult) => {
      if (err) {
        console.error(
          "Count products error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to count products",
        });
      }

      const totalProducts =
        countResult.total;

      const totalPages =
        Math.ceil(
          totalProducts /
            productsPerPage
        );

      /* PRODUCTS */

      const productsQuery = `
        SELECT
          p.*,
          c.name AS category_name
        FROM products p
        LEFT JOIN categories c
          ON p.category_id = c.id
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `;

      const productParams = [
        ...params,
        productsPerPage,
        offset,
      ];

      db.all(
        productsQuery,
        productParams,
        (err, products) => {
          if (err) {
            console.error(
              "Get products error:",
              err.message
            );

            return res.status(500).json({
              message:
                "Failed to fetch products",
            });
          }

          res.json({
            page: currentPage,
            limit: productsPerPage,
            totalProducts,
            totalPages,
            products,
          });
        }
      );
    }
  );
};


/* =========================
   GET PRODUCT BY ID
========================= */

const getProductById = (
  req,
  res
) => {
  const productId =
    req.params.id;

  db.get(
    `
      SELECT
        p.*,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      WHERE p.id = ?
    `,
    [productId],
    (err, product) => {
      if (err) {
        console.error(
          "Get product error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to fetch product",
        });
      }

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        product,
      });
    }
  );
};


/* =========================
   UPDATE PRODUCT
========================= */

const updateProduct = (
  req,
  res
) => {
  const productId =
    req.params.id;

  const {
    name,
    brand,
    description,
    price,
    original_price,
    discount_percentage,
    stock,
    image_url,
    category_id,
  } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      message: "Product name is required",
    });
  }

  const productPrice = Number(price);

  const originalPrice =
    original_price !== undefined &&
    original_price !== null &&
    original_price !== ""
      ? Number(original_price)
      : productPrice;

  const productStock =
    Number(stock);

  let discount =
    discount_percentage !== undefined &&
    discount_percentage !== null &&
    discount_percentage !== ""
      ? Number(discount_percentage)
      : 0;

  if (
    Number.isNaN(productPrice) ||
    productPrice < 0
  ) {
    return res.status(400).json({
      message: "Invalid price",
    });
  }

  if (
    Number.isNaN(originalPrice) ||
    originalPrice < 0
  ) {
    return res.status(400).json({
      message:
        "Invalid original price",
    });
  }

  if (
    Number.isNaN(productStock) ||
    productStock < 0 ||
    !Number.isInteger(productStock)
  ) {
    return res.status(400).json({
      message: "Invalid stock",
    });
  }

  if (
    Number.isNaN(discount) ||
    discount < 0 ||
    discount > 100
  ) {
    return res.status(400).json({
      message:
        "Discount must be between 0 and 100",
    });
  }

  if (
    (!discount_percentage ||
      Number(discount_percentage) === 0) &&
    originalPrice > productPrice
  ) {
    discount =
      ((originalPrice - productPrice) /
        originalPrice) *
      100;
  }

  db.run(
    `
      UPDATE products
      SET
        name = ?,
        brand = ?,
        description = ?,
        price = ?,
        original_price = ?,
        discount_percentage = ?,
        stock = ?,
        image_url = ?,
        category_id = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      name.trim(),
      brand?.trim() || null,
      description?.trim() || null,
      productPrice,
      originalPrice,
      Number(discount.toFixed(2)),
      productStock,
      image_url?.trim() || null,
      category_id || null,
      productId,
    ],
    function (err) {
      if (err) {
        console.error(
          "Update product error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to update product",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      db.get(
        `
          SELECT
            p.*,
            c.name AS category_name
          FROM products p
          LEFT JOIN categories c
            ON p.category_id = c.id
          WHERE p.id = ?
        `,
        [productId],
        (err, product) => {
          if (err) {
            return res.status(500).json({
              message:
                "Product updated but failed to fetch product",
            });
          }

          res.json({
            message:
              "Product updated successfully",
            product,
          });
        }
      );
    }
  );
};


/* =========================
   DELETE PRODUCT
========================= */

const deleteProduct = (
  req,
  res
) => {
  const productId =
    req.params.id;

  db.run(
    `
      DELETE FROM products
      WHERE id = ?
    `,
    [productId],
    function (err) {
      if (err) {
        console.error(
          "Delete product error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to delete product",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message:
          "Product deleted successfully",
      });
    }
  );
};


/* =========================
   GET BRANDS
========================= */

const getBrands = (
  req,
  res
) => {
  db.all(
    `
      SELECT DISTINCT brand
      FROM products
      WHERE brand IS NOT NULL
        AND TRIM(brand) != ''
      ORDER BY brand ASC
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error(
          "Get brands error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to fetch brands",
        });
      }

      res.json({
        brands: rows.map(
          (row) => row.brand
        ),
      });
    }
  );
};


/* =========================
   EXPORTS
========================= */

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getBrands,
};