import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse cart items', error);
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart with quantity handling
const addToCart = (product, quantity = 1) => {
  setCartItems((prev) => {
    // Find if this exact product with the same lot already exists in cart
    const existingItem = prev.find(item => 
      item._id === product._id && 
      item.lotLabel === product.lotLabel
    );
    
    if (existingItem) {
      // If exists, just increase the quantity
      return prev.map(item =>
        item._id === product._id && item.lotLabel === product.lotLabel
          ? { 
              ...item, 
              quantity: (item.quantity || 1) + quantity,
              // Keep all other product details including price
              price: product.price,
              originalPrice: product.originalPrice
            }
          : item
      );
    }
    
    // If not exists, add as new item with all lot information
    return [...prev, { 
      ...product, 
      quantity,
      // Ensure these fields are included
      price: product.price,
      originalPrice: product.originalPrice,
      lotLabel: product.lotLabel || 'Lot de 4' // Default if not specified
    }];
  });
};

  // Remove item completely
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter(p => p._id !== productId));
  };

  // Update specific item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems((prev) =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => setCartItems([]);

  // Calculate total items count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // Calculate total price
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    ).toFixed(2);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};