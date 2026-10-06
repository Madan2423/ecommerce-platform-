const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/

function getToken() {
  return localStorage.getItem("token");
}

/*
|--------------------------------------------------------------------------
| GENERIC REQUEST
|--------------------------------------------------------------------------
*/

async function request(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

export async function registerUser(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(userData) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

export async function getCurrentUser() {
  return request("/users/me");
}

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

export async function getAdminDashboard() {
  return request("/admin/dashboard");
}

export async function getAdminOrders() {
  return request("/admin/orders");
}

export async function updateAdminOrderStatus(
  orderId,
  status
) {
  return request(
    `/admin/orders/${orderId}/status`,
    {
      method: "PUT",
      body: JSON.stringify({
        status,
      }),
    }
  );
}

/*
|--------------------------------------------------------------------------
| PRODUCTS
|--------------------------------------------------------------------------
*/

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.append(key, value);
      }
    }
  );

  const queryString = params.toString();

  const url = queryString
    ? `/products?${queryString}`
    : "/products";

  return request(url);
}

export async function getProductById(productId) {
  return request(`/products/${productId}`);
}

export async function getBrands() {
  return request("/products/brands");
}

/*
|--------------------------------------------------------------------------
| ADMIN PRODUCTS
|--------------------------------------------------------------------------
*/

export async function createProduct(productData) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(
  productId,
  productData
) {
  return request(`/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(productId) {
  return request(`/products/${productId}`, {
    method: "DELETE",
  });
}

/*
|--------------------------------------------------------------------------
| CATEGORIES
|--------------------------------------------------------------------------
*/

export async function getCategories() {
  return request("/categories");
}

export async function createCategory(categoryData) {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
}

export async function updateCategory(
  categoryId,
  categoryData
) {
  return request(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
}

export async function deleteCategory(categoryId) {
  return request(`/categories/${categoryId}`, {
    method: "DELETE",
  });
}

/*
|--------------------------------------------------------------------------
| CART
|--------------------------------------------------------------------------
*/

export async function getCart() {
  return request("/cart");
}

export async function addToCart(
  productId,
  quantity = 1
) {
  return request("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });
}

export async function updateCartItem(
  itemId,
  quantity
) {
  return request(`/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({
      quantity,
    }),
  });
}

export async function removeFromCart(itemId) {
  return request(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function clearCart() {
  return request("/cart", {
    method: "DELETE",
  });
}

/*
|--------------------------------------------------------------------------
| WISHLIST
|--------------------------------------------------------------------------
*/

export async function getWishlist() {
  return request("/wishlist");
}

export async function addToWishlist(productId) {
  return request("/wishlist", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
    }),
  });
}

export async function removeFromWishlist(
  productId
) {
  return request(`/wishlist/${productId}`, {
    method: "DELETE",
  });
}

export async function clearWishlist() {
  return request("/wishlist", {
    method: "DELETE",
  });
}

/*
|--------------------------------------------------------------------------
| ORDERS
|--------------------------------------------------------------------------
*/

export async function checkout() {
  return request("/orders/checkout", {
    method: "POST",
  });
}

export async function getOrders() {
  return request("/orders");
}

export async function getOrderById(orderId) {
  return request(`/orders/${orderId}`);
}

export async function cancelOrder(orderId) {
  return request(
    `/orders/${orderId}/cancel`,
    {
      method: "PUT",
    }
  );
}

/*
|--------------------------------------------------------------------------
| PAYMENTS
|--------------------------------------------------------------------------
*/

/*
 * Supports both:
 *
 * processPayment(orderId, paymentMethod)
 *
 * AND
 *
 * processPayment({
 *   order_id,
 *   payment_method
 * })
 */

export async function processPayment(
  orderIdOrData,
  paymentMethod
) {
  let orderId;
  let method;

  if (
    typeof orderIdOrData === "object" &&
    orderIdOrData !== null
  ) {
    orderId =
      orderIdOrData.order_id;

    method =
      orderIdOrData.payment_method;
  } else {
    orderId = orderIdOrData;
    method = paymentMethod;
  }

  return request(
    `/payments/${orderId}/pay`,
    {
      method: "POST",
      body: JSON.stringify({
        payment_method: method,
      }),
    }
  );
}

/*
 * Backend:
 *
 * GET /api/payments/:orderId
 */

export async function getPayment(orderId) {
  return request(
    `/payments/${orderId}`
  );
}

/*
 * Alias for getPayment()
 */

export async function getPaymentByOrderId(
  orderId
) {
  return request(
    `/payments/${orderId}`
  );
}

/*
|--------------------------------------------------------------------------
| REVIEWS
|--------------------------------------------------------------------------
*/

export async function getProductReviews(
  productId
) {
  return request(
    `/reviews/product/${productId}`
  );
}

export async function getProductRating(
  productId
) {
  return request(
    `/reviews/product/${productId}/rating`
  );
}

/*
 * Supports:
 *
 * createReview(productId, rating, comment)
 *
 * OR
 *
 * createReview({
 *   product_id,
 *   rating,
 *   comment
 * })
 */

export async function createReview(
  productIdOrData,
  rating,
  comment
) {
  let reviewData;

  if (
    typeof productIdOrData === "object" &&
    productIdOrData !== null
  ) {
    reviewData = productIdOrData;
  } else {
    reviewData = {
      product_id: productIdOrData,
      rating,
      comment,
    };
  }

  return request("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

/*
 * Supports:
 *
 * updateReview(reviewId, rating, comment)
 *
 * OR
 *
 * updateReview(reviewId, {
 *   rating,
 *   comment
 * })
 */

export async function updateReview(
  reviewId,
  ratingOrData,
  comment
) {
  let reviewData;

  if (
    typeof ratingOrData === "object" &&
    ratingOrData !== null
  ) {
    reviewData = ratingOrData;
  } else {
    reviewData = {
      rating: ratingOrData,
      comment,
    };
  }

  return request(`/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  });
}

export async function deleteReview(reviewId) {
  return request(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

export default API_URL;