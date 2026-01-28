import instance from "./axiox";

const BASE_URL = "/api/cart";

// Generate a session ID for guest users
export const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

// Get user ID from localStorage or token
export const getUserId = () => {
  return localStorage.getItem("userId");
};

// Get cart
export const fetchCart = async () => {
  try {
    const userId = getUserId();
    const sessionId = getOrCreateSessionId();

    const response = await instance.get(BASE_URL, {
      params: {
        userId: userId || undefined,
        sessionId: sessionId || undefined,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error fetching cart:", err);
    return { items: [], totalPrice: 0, totalItems: 0 };
  }
};

// Add item to cart
export const addItemToCart = async (product) => {
  try {
    const userId = getUserId();
    const sessionId = getOrCreateSessionId();

    const response = await instance.post(`${BASE_URL}/add`, {
      userId: userId || undefined,
      sessionId,
      product,
    });

    return response.data;
  } catch (err) {
    console.error("Error adding to cart:", err);
    throw err;
  }
};

// Remove item from cart
export const removeItemFromCart = async (productId) => {
  try {
    const userId = getUserId();
    const sessionId = getOrCreateSessionId();

    const response = await instance.post(`${BASE_URL}/remove`, {
      userId: userId || undefined,
      sessionId,
      productId,
    });

    return response.data;
  } catch (err) {
    console.error("Error removing from cart:", err);
    throw err;
  }
};

// Update item quantity
export const updateItemQuantity = async (productId, qty) => {
  try {
    const userId = getUserId();
    const sessionId = getOrCreateSessionId();

    const response = await instance.post(`${BASE_URL}/update-quantity`, {
      userId: userId || undefined,
      sessionId,
      productId,
      qty,
    });

    return response.data;
  } catch (err) {
    console.error("Error updating quantity:", err);
    throw err;
  }
};

// Clear cart
export const clearCartAPI = async () => {
  try {
    const userId = getUserId();
    const sessionId = getOrCreateSessionId();

    const response = await instance.post(`${BASE_URL}/clear`, {
      userId: userId || undefined,
      sessionId,
    });

    return response.data;
  } catch (err) {
    console.error("Error clearing cart:", err);
    throw err;
  }
};
