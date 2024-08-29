import { useState, useEffect, useMemo } from 'react';
import { db } from '../data/db';
import type { CartItem, Guitar } from '../types/index';

export const useCart = () => {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? [...JSON.parse(localStorageCart)] : [];
  };
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  const addToCart = (item: Guitar) => {
    const itemsExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemsExists >= 0) {
      if (cart[itemsExists].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemsExists].quantity++;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  };

  function removeFromCart(id: Guitar['id']) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );
  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
};
