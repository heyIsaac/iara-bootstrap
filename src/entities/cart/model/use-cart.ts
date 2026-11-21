'use client';

import { useState, useEffect, useCallback } from 'react';
import { CartItem } from './types';

const CART_STORAGE_KEY = 'iara_cart';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  const loadStoredCart = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredCart();

    const handleCartSync = () => {
      loadStoredCart();
    };

    window.addEventListener('cartUpdated', handleCartSync);
    window.addEventListener('storage', handleCartSync);

    return () => {
      window.removeEventListener('cartUpdated', handleCartSync);
      window.removeEventListener('storage', handleCartSync);
    };
  }, [loadStoredCart]);

  // Persist items & dispatch event
  const persistItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, []);

  const isInCart = useCallback(
    (id: number): boolean => {
      return items.some((item) => item.id === id);
    },
    [items]
  );

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.id === item.id)) return prev;
        const next = [...prev, item];
        if (typeof window !== 'undefined') {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new Event('cartUpdated'));
        }
        return next;
      });
    },
    []
  );

  const removeItem = useCallback((id: number) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('cartUpdated'));
      }
      return next;
    });
  }, []);

  const toggleItem = useCallback(
    (item: CartItem): boolean => {
      const exists = items.some((i) => i.id === item.id);
      if (exists) {
        removeItem(item.id);
        return false;
      } else {
        addItem(item);
        return true;
      }
    },
    [items, addItem, removeItem]
  );

  const clearCart = useCallback(() => {
    persistItems([]);
  }, [persistItems]);

  const totalItems = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal;

  return {
    items,
    loading,
    addItem,
    removeItem,
    toggleItem,
    isInCart,
    clearCart,
    totalItems,
    subtotal,
    total,
  };
};
