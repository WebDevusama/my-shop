const Cart = require("../Users-module/cart");

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.query;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(400).json({ message: "userId or sessionId required" });
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found", cart: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, sessionId, product } = req.body;

    if (!product) {
      return res.status(400).json({ message: "Product data required" });
    }

    let cart;

    // Find cart by userId or sessionId
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(400).json({ message: "userId or sessionId required" });
    }

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: userId || undefined,
        sessionId: sessionId || undefined,
        items: [product],
        totalPrice: product.price * product.qty,
        totalItems: product.qty,
      });
    } else {
      // Check if product already exists in cart
      const existingItem = cart.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity
        existingItem.qty += product.qty || 1;
      } else {
        // Add new product
        cart.items.push(product);
      }

      // Recalculate totals
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
      cart.totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, sessionId, productId } = req.body;

    let cart;

    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(400).json({ message: "userId or sessionId required" });
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove item
    cart.items = cart.items.filter((item) => item.id !== productId);

    // Recalculate totals
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { userId, sessionId, productId, qty } = req.body;

    if (qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    let cart;

    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(400).json({ message: "userId or sessionId required" });
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find and update item quantity
    const item = cart.items.find((item) => item.id === productId);

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.qty = qty;

    // Recalculate totals
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    let cart;

    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(400).json({ message: "userId or sessionId required" });
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;
    cart.totalItems = 0;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
