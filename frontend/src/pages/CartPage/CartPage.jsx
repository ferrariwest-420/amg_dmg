import React, { useRef, useEffect } from 'react';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import CartItem from '../../components/ui/CartItem/CartItem';
import Scrollbar from '../../components/ui/Scrollbar/Scrollbar';
import { useCart } from '../../context/CartContext';
import loading1 from '../../assets/loading1.gif';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    updateSize, 
    calculateTotal,
    error,
    isLoading 
  } = useCart();
  
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentRef.current) {
      setViewportHeight(394);
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [cartItems]);

  const handleScroll = (scrollTop) => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollTop;
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    await updateQuantity(itemId, quantity);
  };

  const handleSizeChange = async (itemId, size) => {
    await updateSize(itemId, size);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const total = calculateTotal();

  return (
    <OSWindow>
      <WindowTab title="Cart">
        <div className="cart-page">
          {isLoading ? (
            <div className="cart-page__empty">
              <img 
                src={loading1} 
                alt="Loading cart" 
                className="cart-page__empty-image" 
                draggable="false"
              />
              <div className="cart-page__empty-text">
                Loading...
              </div>
            </div>
          ) : error ? (
            <div className="cart-page__empty">
              <div className="cart-page__error">
                {error}
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-page__empty">
              <img 
                src={loading1} 
                alt="Empty cart" 
                className="cart-page__empty-image"
                draggable="false"
              />
              <div className="cart-page__empty-text">
                Cart is empty
              </div>
            </div>
          ) : (
            <>
              <div 
                className="cart-page__content"
                ref={contentRef}
              >
                <div className="cart-page__columns">
                  <div className="cart-page__column cart-page__column--image">
                    <span>Image</span>
                  </div>
                  <div className="cart-page__column cart-page__column--name">
                    <span>Name</span>
                  </div>
                  <div className="cart-page__column cart-page__column--quantity">
                    <span>Quantity</span>
                  </div>
                  <div className="cart-page__column cart-page__column--price">
                    <span>Price</span>
                  </div>
                  <div className="cart-page__column cart-page__column--size">
                    <span>Size</span>
                  </div>
                </div>

                <div className="cart-page__items">
                  {cartItems.map((item, index) => (
                    <CartItem
                      key={item.cart_item_id || `temp-${index}`}
                      product={item}
                      onQuantityChange={handleQuantityChange}
                      onSizeChange={handleSizeChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>

                <div className="cart-page__summary">
                  <div className="cart-page__total-label">
                    Total:
                  </div>
                  <div className="cart-page__total-price">
                    ${total}
                  </div>
                  <button 
                    className="cart-page__checkout-button"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              </div>

              {contentHeight > viewportHeight && (
                <Scrollbar
                  containerRef={contentRef}
                  contentHeight={contentHeight}
                  viewportHeight={viewportHeight}
                  onScroll={handleScroll}
                />
              )}
            </>
          )}
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default CartPage; 