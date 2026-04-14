import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const CartContext = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

export function CartProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API}/cart`);
     setCart({
  items: Array.isArray(res.data?.items) ? res.data.items : [],
  total: typeof res.data?.total === 'number' ? res.data.total : 0,
});
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, token]);

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      await axios.post(`${API}/cart/add`, item);
      await fetchCart();
      toast.success('Added to cart');
      return true;
    } catch (err) {
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const updateCart = async (items) => {
    try {
      await axios.put(`${API}/cart`, { items });
      await fetchCart();
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId, size) => {
    try {
      await axios.delete(`${API}/cart/item/${productId}?size=${encodeURIComponent(size)}`);
      await fetchCart();
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API}/cart`);
      setCart({ items: [], total: 0 });
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

const cartCount = (Array.isArray(cart?.items) ? cart.items : []).reduce(
  (acc, item) => acc + item.quantity,
  0
);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateCart, removeItem, clearCart, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
