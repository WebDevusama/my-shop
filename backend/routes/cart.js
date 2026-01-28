const express = require("express");
const cartControllers = require("../controllers/cartControllers");

const router = express.Router();

// Get cart
router.get("/", cartControllers.getCart);

// Add to cart
router.post("/add", cartControllers.addToCart);

// Remove from cart
router.post("/remove", cartControllers.removeFromCart);

// Update quantity
router.post("/update-quantity", cartControllers.updateQuantity);

// Clear cart
router.post("/clear", cartControllers.clearCart);

module.exports = router;
