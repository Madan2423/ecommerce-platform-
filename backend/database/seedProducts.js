const db = require("./database");

const catalog = [
  {
    category: "Mobiles",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Galaxy S25 5G", "Samsung", 69999],
      ["Galaxy S24 FE", "Samsung", 44999],
      ["iPhone 16", "Apple", 69999],
      ["iPhone 15", "Apple", 59999],
      ["Nord CE 4 5G", "OnePlus", 24999],
      ["Nord 4 5G", "OnePlus", 29999],
      ["Redmi Note 14 5G", "Redmi", 17999],
      ["Redmi Note 14 Pro", "Redmi", 24999],
      ["Moto G85 5G", "Motorola", 18999],
      ["Nothing Phone 3a", "Nothing", 29999],
    ],
  },

  {
    category: "Laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    products: [
      ["MacBook Air M3", "Apple", 99999],
      ["MacBook Air M2", "Apple", 84999],
      ["Inspiron 15", "Dell", 58999],
      ["Inspiron 14", "Dell", 62999],
      ["IdeaPad Slim 3", "Lenovo", 47999],
      ["ThinkPad E14", "Lenovo", 64999],
      ["Vivobook 15", "ASUS", 54999],
      ["TUF Gaming F15", "ASUS", 69999],
      ["Pavilion 15", "HP", 57999],
      ["Victus Gaming Laptop", "HP", 74999],
    ],
  },

  {
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Wireless Headphones", "boAt", 2499],
      ["AirPods Pro", "Apple", 22999],
      ["Wireless Earbuds", "boAt", 1299],
      ["Bluetooth Speaker", "JBL", 3499],
      ["Portable Speaker", "Sony", 4999],
      ["Noise Cancelling Headphones", "Sony", 8999],
      ["Soundbar 2.1", "JBL", 9999],
      ["Home Theatre System", "Sony", 18999],
      ["4K Action Camera", "GoPro", 29999],
      ["Mirrorless Camera", "Canon", 64999],
    ],
  },

  {
    category: "Smart Devices",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e93?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Galaxy Watch 7", "Samsung", 29999],
      ["Galaxy Watch FE", "Samsung", 14999],
      ["Apple Watch Series 10", "Apple", 42999],
      ["Apple Watch SE", "Apple", 24999],
      ["Fitness Smartwatch", "Noise", 2999],
      ["Smart Watch Pro", "boAt", 3999],
      ["Fitness Band", "Xiaomi", 2499],
      ["Smart Bulb", "Philips", 899],
      ["Smart Plug", "TP-Link", 1299],
      ["Smart Speaker", "Amazon", 4499],
    ],
  },

  {
    category: "Men's Fashion",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Regular Fit Cotton T-Shirt", "Roadster", 599],
      ["Slim Fit Casual Shirt", "Levis", 1299],
      ["Classic Denim Jeans", "Levis", 1999],
      ["Men's Polo T-Shirt", "Puma", 999],
      ["Men's Hoodie", "H&M", 1499],
      ["Men's Denim Jacket", "Levis", 2499],
      ["Men's Formal Shirt", "Van Heusen", 1599],
      ["Men's Chinos", "Peter England", 1399],
      ["Men's Kurta", "Manyavar", 1999],
      ["Men's Sweatshirt", "Adidas", 1799],
    ],
  },

  {
    category: "Women's Fashion",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Women's Summer Dress", "Tokyo Talkies", 1199],
      ["Women's Casual Top", "ONLY", 899],
      ["Women's Skinny Jeans", "Levis", 1799],
      ["Women's Kurti", "Biba", 1299],
      ["Women's Saree", "Libas", 1999],
      ["Women's Ethnic Dress", "W", 1799],
      ["Women's Handbag", "Lavie", 1499],
      ["Women's Denim Jacket", "ONLY", 2299],
      ["Women's Palazzo", "Biba", 999],
      ["Women's Party Dress", "DressBerry", 1899],
    ],
  },

  {
    category: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Men's Running Shoes", "Puma", 2299],
      ["Men's Sneakers", "Nike", 4999],
      ["Men's Sports Shoes", "Adidas", 3299],
      ["Men's Casual Shoes", "Sparx", 1299],
      ["Women's Sneakers", "Adidas", 3299],
      ["Women's Running Shoes", "Puma", 2799],
      ["Women's Sandals", "Bata", 999],
      ["Women's Casual Shoes", "Skechers", 3999],
      ["Sports Shoes", "Campus", 1299],
      ["Walking Shoes", "Skechers", 4499],
    ],
  },

  {
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Vitamin C Face Serum", "Minimalist", 599],
      ["Face Moisturizer", "Mamaearth", 449],
      ["Face Wash", "Cetaphil", 399],
      ["Sunscreen SPF 50", "Minimalist", 499],
      ["Lipstick", "Maybelline", 599],
      ["Foundation", "Lakme", 799],
      ["Perfume for Men", "Fogg", 499],
      ["Perfume for Women", "Engage", 699],
      ["Hair Dryer", "Philips", 1299],
      ["Hair Straightener", "Remington", 1999],
    ],
  },

  {
    category: "Home & Furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Modern Sofa", "Wakefit", 24999],
      ["Office Study Chair", "Green Soul", 5999],
      ["Computer Table", "Wakefit", 4999],
      ["Wooden Coffee Table", "Home Centre", 6999],
      ["Bookshelf", "IKEA", 5999],
      ["Bedside Table", "IKEA", 2999],
      ["Memory Foam Pillow", "SleepyCat", 999],
      ["Cotton Bedsheet", "Wakefit", 799],
      ["Modern Table Lamp", "Philips", 899],
      ["Floor Lamp", "IKEA", 2499],
    ],
  },

  {
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Air Fryer 4L", "Philips", 4999],
      ["Electric Kettle", "Prestige", 999],
      ["Mixer Grinder", "Bajaj", 2499],
      ["Coffee Maker", "AGARO", 1899],
      ["Induction Cooktop", "Prestige", 2299],
      ["Pressure Cooker", "Hawkins", 1899],
      ["Non Stick Cookware Set", "Pigeon", 2499],
      ["Microwave Oven", "IFB", 8999],
      ["Toaster", "Philips", 1599],
      ["Hand Blender", "Bajaj", 999],
    ],
  },

  {
    category: "Home Appliances",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Double Door Refrigerator", "Samsung", 34999],
      ["Single Door Refrigerator", "LG", 22999],
      ["Fully Automatic Washing Machine", "LG", 29999],
      ["Front Load Washing Machine", "Samsung", 38999],
      ["Robot Vacuum Cleaner", "Eureka", 24999],
      ["Vacuum Cleaner", "Philips", 5999],
      ["Steam Iron", "Philips", 1799],
      ["Room Heater", "Bajaj", 2299],
      ["Air Cooler", "Symphony", 8999],
      ["Ceiling Fan", "Crompton", 2499],
    ],
  },

  {
    category: "TVs",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
    products: [
      ["43 inch 4K Smart TV", "Samsung", 34999],
      ["55 inch 4K Smart TV", "Samsung", 49999],
      ["50 inch 4K Android TV", "Sony", 54999],
      ["43 inch LED Smart TV", "LG", 32999],
      ["55 inch OLED TV", "LG", 89999],
      ["65 inch 4K Smart TV", "Sony", 109999],
      ["32 inch Smart TV", "TCL", 16999],
      ["43 inch Google TV", "Hisense", 26999],
      ["50 inch QLED TV", "TCL", 39999],
      ["75 inch 4K TV", "Samsung", 129999],
    ],
  },

  {
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    products: [
      ["English Willow Cricket Bat", "SG", 3999],
      ["Cricket Tennis Ball Set", "Cosco", 499],
      ["Football", "Nivia", 699],
      ["Basketball", "Spalding", 1499],
      ["Volleyball", "Cosco", 799],
      ["Yoga Mat", "Boldfit", 699],
      ["Adjustable Dumbbells", "Lifelong", 2499],
      ["Resistance Bands", "Boldfit", 599],
      ["Skipping Rope", "Strauss", 299],
      ["Gym Gloves", "Aurion", 399],
    ],
  },

  {
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Gaming Keyboard", "Redragon", 2499],
      ["Gaming Mouse", "Logitech", 1799],
      ["Gaming Headset", "HyperX", 3999],
      ["Gaming Controller", "Sony", 5999],
      ["Mechanical Keyboard", "Logitech", 4999],
      ["RGB Gaming Mouse", "Razer", 2999],
      ["Gaming Chair", "Green Soul", 11999],
      ["Gaming Monitor 24 inch", "Acer", 12999],
      ["Gaming Monitor 27 inch", "MSI", 19999],
      ["Console Gaming Controller", "Microsoft", 5499],
    ],
  },

  {
    category: "Toys & Baby",
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Remote Control Car", "Hot Wheels", 999],
      ["Building Blocks Set", "LEGO", 2499],
      ["Educational Puzzle", "Funskool", 499],
      ["Soft Teddy Bear", "Hamleys", 899],
      ["Baby Walker", "R for Rabbit", 2499],
      ["Baby Stroller", "R for Rabbit", 6999],
      ["Baby Feeding Bottle", "Philips Avent", 699],
      ["Kids School Bag", "Wildcraft", 999],
      ["Kids Bicycle", "Hero", 4999],
      ["Board Game", "Hasbro", 1299],
    ],
  },

  {
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Atomic Habits", "Penguin", 499],
      ["The Psychology of Money", "Jaico", 399],
      ["Rich Dad Poor Dad", "Penguin", 399],
      ["Clean Code", "Pearson", 899],
      ["JavaScript Guide", "O'Reilly", 1199],
      ["Python Programming", "McGraw Hill", 799],
      ["Data Structures & Algorithms", "McGraw Hill", 699],
      ["System Design Interview", "Educative", 999],
      ["English Grammar Book", "Wren & Martin", 399],
      ["General Knowledge", "Arihant", 299],
    ],
  },

  {
    category: "Bags & Luggage",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Laptop Backpack", "American Tourister", 1499],
      ["College Backpack", "Wildcraft", 1299],
      ["Travel Backpack", "Safari", 1999],
      ["Cabin Suitcase", "American Tourister", 3499],
      ["Large Suitcase", "Safari", 4499],
      ["Travel Duffle Bag", "Skybags", 1799],
      ["Leather Wallet", "Fastrack", 999],
      ["Laptop Sleeve", "Targus", 1299],
      ["Travel Organizer", "Mokobara", 999],
      ["Handbag", "Lavie", 1499],
    ],
  },

  {
    category: "Jewellery",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Gold Plated Necklace", "Sukkhi", 1499],
      ["Artificial Earrings", "Mia", 799],
      ["Fashion Bracelet", "Fastrack", 599],
      ["Women's Ring", "Voylla", 699],
      ["Pearl Necklace", "Rubans", 1299],
      ["Fashion Pendant", "Sukkhi", 899],
      ["Silver Plated Earrings", "Voylla", 999],
      ["Fashion Anklet", "Rubans", 699],
      ["Men's Bracelet", "Fastrack", 799],
      ["Classic Analog Watch", "Titan", 2999],
    ],
  },

  {
    category: "Grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Basmati Rice 5kg", "India Gate", 699],
      ["Wheat Flour 5kg", "Aashirvaad", 299],
      ["Toor Dal 1kg", "Tata Sampann", 179],
      ["Sunflower Oil 1L", "Fortune", 149],
      ["Green Tea", "Tata", 299],
      ["Instant Coffee", "Nescafe", 399],
      ["Corn Flakes", "Kelloggs", 249],
      ["Peanut Butter", "Pintola", 299],
      ["Dark Chocolate", "Cadbury", 199],
      ["Mixed Nuts", "Happilo", 499],
    ],
  },

  {
    category: "Automotive",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Car Phone Holder", "Portronics", 599],
      ["Car Vacuum Cleaner", "AGARO", 1999],
      ["Car Cleaning Kit", "3M", 799],
      ["Car Air Freshener", "Godrej", 199],
      ["Bike Phone Mount", "BOBO", 499],
      ["Car Seat Cushion", "Dr Trust", 999],
      ["Car LED Headlight", "Philips", 2499],
      ["Car Emergency Kit", "Auto Hub", 1299],
      ["Tyre Inflator", "Qubo", 2499],
      ["Car Dash Camera", "70mai", 5999],
    ],
  },

  {
    category: "Travel",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Travel Neck Pillow", "Mokobara", 699],
      ["Travel Water Bottle", "Milton", 599],
      ["Passport Holder", "WildHorn", 499],
      ["Travel Adapter", "Portronics", 999],
      ["Luggage Scale", "Dr Trust", 699],
      ["Travel Toiletry Bag", "American Tourister", 899],
      ["Eye Mask", "Mackly", 299],
      ["Travel Blanket", "Clazkit", 799],
      ["Foldable Travel Bag", "Safari", 999],
      ["Travel Organizer Set", "Mokobara", 1499],
    ],
  },

  {
    category: "Pet Supplies",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    products: [
      ["Dog Dry Food", "Pedigree", 799],
      ["Cat Dry Food", "Whiskas", 699],
      ["Dog Chew Toy", "Trixie", 399],
      ["Cat Scratching Post", "PetSafe", 1299],
      ["Pet Grooming Brush", "Himalaya", 299],
      ["Dog Collar", "HUFT", 499],
      ["Pet Feeding Bowl", "HUFT", 399],
      ["Dog Leash", "Trixie", 599],
      ["Pet Shampoo", "Himalaya", 399],
      ["Pet Bed", "Heads Up For Tails", 1499],
    ],
  },
];

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function getCategoryId(categoryName) {
  const existing = await getRow(
    `SELECT id FROM categories WHERE name = ?`,
    [categoryName]
  );

  if (existing) {
    return existing.id;
  }

  const result = await runQuery(
    `INSERT INTO categories (name) VALUES (?)`,
    [categoryName]
  );

  return result.lastID;
}

function generateProductData(product, category) {
  const [name, brand, price] = product;

  const originalPrice =
    Math.round(
      (price * (1.15 + (name.length % 5) * 0.1)) / 100
    ) * 100;

  const discountPercentage =
    originalPrice > price
      ? Number(
          (
            ((originalPrice - price) / originalPrice) *
            100
          ).toFixed(2)
        )
      : 0;

  const rating = Number(
    (4 + (name.length % 10) / 10).toFixed(1)
  );

  const reviewCount =
    100 + ((name.length * 47) % 2500);

  const stock =
    10 + ((name.length * 7) % 90);

  return {
    name,
    brand,

    description: `${name} from ${brand}. A quality ${category.category.toLowerCase()} product suitable for everyday use.`,

    price,
    originalPrice,
    discountPercentage,
    stock,

    rating,
    reviewCount,

    image: category.image,

    categoryId: null,
  };
}

async function seedProducts() {
  try {
    console.log("");
    console.log("========================================");
    console.log("STARTING MARKETPLACE PRODUCT SEED");
    console.log("========================================");

    let inserted = 0;
    let updated = 0;

    for (const category of catalog) {
      const categoryId = await getCategoryId(
        category.category
      );

      for (const rawProduct of category.products) {
        const product = generateProductData(
          rawProduct,
          category
        );

        product.categoryId = categoryId;

        /*
         * Check whether the product already exists.
         *
         * This prevents duplicate products when
         * you run this script multiple times.
         */
        const existing = await getRow(
          `
            SELECT id
            FROM products
            WHERE name = ?
          `,
          [product.name]
        );

        if (existing) {
          await runQuery(
            `
              UPDATE products
              SET
                brand = ?,
                description = ?,
                price = ?,
                original_price = ?,
                discount_percentage = ?,
                stock = ?,
                image_url = ?,
                category_id = ?,
                rating = ?,
                review_count = ?,
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `,
            [
              product.brand,
              product.description,
              product.price,
              product.originalPrice,
              product.discountPercentage,
              product.stock,
              product.image,
              product.categoryId,
              product.rating,
              product.reviewCount,
              existing.id,
            ]
          );

          updated++;
        } else {
          await runQuery(
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
              product.name,
              product.brand,
              product.description,
              product.price,
              product.originalPrice,
              product.discountPercentage,
              product.stock,
              product.image,
              product.categoryId,
              product.rating,
              product.reviewCount,
            ]
          );

          inserted++;
        }
      }
    }

    const totalCatalogProducts =
      catalog.reduce(
        (total, category) =>
          total + category.products.length,
        0
      );

    const result = await getRow(
      `SELECT COUNT(*) AS total FROM products`
    );

    console.log("");
    console.log("========================================");
    console.log("MARKETPLACE SEED COMPLETED");
    console.log("========================================");
    console.log(
      `Catalog products : ${totalCatalogProducts}`
    );
    console.log(`Inserted         : ${inserted}`);
    console.log(`Updated          : ${updated}`);
    console.log(
      `Database total   : ${result.total}`
    );
    console.log("========================================");
    console.log("");

    db.close();
  } catch (error) {
    console.error("");
    console.error("PRODUCT SEED FAILED");
    console.error(error.message);
    console.error("");

    db.close();
  }
}

seedProducts();