"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // Unique cart item ID (productId or `${productId}-wholesale`)
  productId: string; // Database product ID
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  isWholesale?: boolean;
  moq?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
      stock: number;
      isWholesale?: boolean;
      moq?: number;
    },
    quantity?: number
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addToCart = (
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
      stock: number;
      isWholesale?: boolean;
      moq?: number;
    },
    quantity = 1
  ) => {
    setCart((prev) => {
      const cartItemId = product.isWholesale ? `${product.id}-wholesale` : product.id;
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        // Limit to stock
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images.length > 0 ? product.images[0] : "",
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
          isWholesale: product.isWholesale || false,
          moq: product.moq || 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;

      if (quantity <= 0) {
        return prev.filter((i) => i.id !== productId);
      }

      // Enforce MOQ for wholesale items
      if (item.isWholesale && item.moq && quantity < item.moq) {
        return prev.map((i) =>
          i.id === productId ? { ...i, quantity: item.moq! } : i
        );
      }

      return prev.map((i) =>
        i.id === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
