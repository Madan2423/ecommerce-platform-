const db = require("../database/database");

const createCategory = (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  db.run(
    `
    INSERT INTO categories (name)
    VALUES (?)
    `,
    [name.trim()],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({
            message: "Category already exists",
          });
        }

        console.error("Category creation error:", err.message);

        return res.status(500).json({
          message: "Failed to create category",
        });
      }

      db.get(
        `
        SELECT *
        FROM categories
        WHERE id = ?
        `,
        [this.lastID],
        (err, category) => {
          if (err) {
            console.error("Category fetch error:", err.message);

            return res.status(500).json({
              message: "Category created but could not be retrieved",
            });
          }

          return res.status(201).json({
            message: "Category created successfully",
            category,
          });
        }
      );
    }
  );
};

const getAllCategories = (req, res) => {
  db.all(
    `
    SELECT *
    FROM categories
    ORDER BY name ASC
    `,
    [],
    (err, categories) => {
      if (err) {
        console.error("Categories fetch error:", err.message);

        return res.status(500).json({
          message: "Failed to fetch categories",
        });
      }

      return res.status(200).json({
        count: categories.length,
        categories,
      });
    }
  );
};

const getCategoryById = (req, res) => {
  const { id } = req.params;

  db.get(
    `
    SELECT *
    FROM categories
    WHERE id = ?
    `,
    [id],
    (err, category) => {
      if (err) {
        console.error("Category fetch error:", err.message);

        return res.status(500).json({
          message: "Failed to fetch category",
        });
      }

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      return res.status(200).json({
        category,
      });
    }
  );
};

const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  db.run(
    `
    UPDATE categories
    SET name = ?
    WHERE id = ?
    `,
    [name.trim(), id],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({
            message: "Category already exists",
          });
        }

        console.error("Category update error:", err.message);

        return res.status(500).json({
          message: "Failed to update category",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      db.get(
        `
        SELECT *
        FROM categories
        WHERE id = ?
        `,
        [id],
        (err, category) => {
          if (err) {
            console.error("Category fetch error:", err.message);

            return res.status(500).json({
              message: "Category updated but could not be retrieved",
            });
          }

          return res.status(200).json({
            message: "Category updated successfully",
            category,
          });
        }
      );
    }
  );
};

const deleteCategory = (req, res) => {
  const { id } = req.params;

  db.get(
    `
    SELECT COUNT(*) AS product_count
    FROM products
    WHERE category_id = ?
    `,
    [id],
    (err, result) => {
      if (err) {
        console.error("Category product check error:", err.message);

        return res.status(500).json({
          message: "Failed to check category products",
        });
      }

      if (result.product_count > 0) {
        return res.status(409).json({
          message:
            "Cannot delete category because products are assigned to it",
        });
      }

      db.run(
        `
        DELETE FROM categories
        WHERE id = ?
        `,
        [id],
        function (err) {
          if (err) {
            console.error("Category deletion error:", err.message);

            return res.status(500).json({
              message: "Failed to delete category",
            });
          }

          if (this.changes === 0) {
            return res.status(404).json({
              message: "Category not found",
            });
          }

          return res.status(200).json({
            message: "Category deleted successfully",
          });
        }
      );
    }
  );
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};