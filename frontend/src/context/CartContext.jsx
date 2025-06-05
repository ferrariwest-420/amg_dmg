import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const baseUrl = 'http://localhost:3001';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      // Если получили 401, значит токен невалидный
      localStorage.removeItem('token');
      window.location.reload(); // Перезагружаем страницу для обновления состояния авторизации
    }
    throw new Error(error.message || 'Failed to fetch cart');
  }
  return response.json();
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // Загружаем корзину при монтировании компонента
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      setCartItems([]); // Очищаем корзину если пользователь не авторизован
    }
  }, [token, isAuthenticated]);

  const fetchCart = async () => {
    if (!token) {
      console.error('No token available');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await handleResponse(response);
      console.log('Raw cart data:', data);
      console.log('Cart data structure check:', data.map(item => ({
        hasCartItemId: 'cart_item_id' in item,
        hasProductId: 'product_id' in item,
        cartItemId: item.cart_item_id,
        productId: item.product_id
      })));
      setCartItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Failed to fetch cart');
      setCartItems([]); // Очищаем корзину в случае ошибки
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product, selectedSize) => {
    if (!token) {
      console.error('No token available');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.product_id || product.id,
          quantity: 1,
          size: product.has_size_selection ? selectedSize : 'OS'
        })
      });

      await handleResponse(response);
      await fetchCart(); // Обновляем состояние корзины после успешного добавления
      setError(null);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.message || 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) {
      console.error('No token available');
      return;
    }

    try {
      // Оптимистичное обновление UI
      setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== itemId));

      const response = await fetch(`${baseUrl}/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await handleResponse(response);
      setError(null);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err.message || 'Failed to remove item from cart');
      // Откатываем изменения в случае ошибки
      await fetchCart();
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!token) {
      console.error('No token available');
      return;
    }

    if (quantity < 1 || quantity > 9) return;

    try {
      // Оптимистичное обновление UI
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.cart_item_id === itemId 
            ? { ...item, quantity } 
            : item
        )
      );

      const response = await fetch(`${baseUrl}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      await handleResponse(response);
      setError(null);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.message || 'Failed to update quantity');
      // Откатываем изменения в случае ошибки
      await fetchCart();
    }
  };

  const updateSize = async (itemId, newSize) => {
    if (!token) {
      console.error('No token available');
      return;
    }

    try {
      // Оптимистичное обновление UI
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.cart_item_id === itemId 
            ? { ...item, size: newSize } 
            : item
        )
      );

      const response = await fetch(`${baseUrl}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ size: newSize })
      });

      await handleResponse(response);
      setError(null);
    } catch (err) {
      console.error('Error updating size:', err);
      setError(err.message || 'Failed to update size');
      // Откатываем изменения в случае ошибки
      await fetchCart();
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateSize,
      calculateTotal,
      error,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}; 