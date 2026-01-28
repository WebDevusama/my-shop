import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCartAPI,
} from "./api/cartApi";

/* =======================
   TYPES
======================= */

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

interface CartProviderProps {
  children: ReactNode;
}

/* =======================
   CONTEXT
======================= */

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};

/* =======================
   PROVIDER
======================= */

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from database on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Load cart from API
  const loadCart = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCart();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ADD TO CART
  const addToCart = async (product: CartItem) => {
    try {
      setIsLoading(true);
      const updatedCart = await addItemToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: product.qty || 1,
      });
      setCartItems(updatedCart.items || []);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      // Fallback to local state if API fails
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, qty: item.qty + (product.qty || 1) }
              : item
          );
        }
        return [...prev, { ...product, qty: product.qty || 1 }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REMOVE ITEM
  const removeFromCart = async (id: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await removeItemFromCart(id);
      setCartItems(updatedCart.items || []);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      // Fallback to local state if API fails
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATE QUANTITY
  const updateQuantity = async (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    try {
      setIsLoading(true);
      const updatedCart = await updateItemQuantity(id, qty);
      setCartItems(updatedCart.items || []);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      // Fallback to local state if API fails
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty } : item))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ CLEAR CART
  const clearCart = async () => {
    try {
      setIsLoading(true);
      await clearCartAPI();
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      // Fallback to local state if API fails
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ TOTALS
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};