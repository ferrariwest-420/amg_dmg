import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import Scrollbar from '../../components/ui/Scrollbar/Scrollbar';
import loading1 from '../../assets/loading1.gif';
import './OrderPage.css';

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (contentRef.current) {
      setViewportHeight(394);
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [order]);

  const handleScroll = (scrollTop) => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollTop;
    }
  };

  const handleClose = () => {
    navigate('/profile/orders');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <OSWindow>
      <WindowTab title={`Order #${id}`} onClose={handleClose}>
        <div className="order-page">
          {isLoading ? (
            <div className="order-page__loading">
              <img 
                src={loading1} 
                alt="Loading order" 
                className="order-page__loading-image" 
              />
              <div className="order-page__loading-text">
                Loading...
              </div>
            </div>
          ) : error ? (
            <div className="order-page__error">
              {error}
            </div>
          ) : order ? (
            <>
              <div 
                className="order-page__content"
                ref={contentRef}
              >
                <div className="order-page__header">
                  <div className="order-page__info-group">
                    <div className="order-page__info-item">
                      <span className="order-page__info-label">Order Date:</span>
                      <span className="order-page__info-value">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="order-page__info-item">
                      <span className="order-page__info-label">Status:</span>
                      <span className="order-page__info-value order-page__status">{order.status}</span>
                    </div>
                    <div className="order-page__info-item">
                      <span className="order-page__info-label">Payment Method:</span>
                      <span className="order-page__info-value">{order.payment_method || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="order-page__info-group">
                    <div className="order-page__info-item">
                      <span className="order-page__info-label">Delivery Address:</span>
                      <span className="order-page__info-value">{order.delivery_address}</span>
                    </div>
                    <div className="order-page__info-item">
                      <span className="order-page__info-label">Total Amount:</span>
                      <span className="order-page__info-value order-page__total">${order.total_amount}</span>
                    </div>
                  </div>
                </div>

                <div className="order-page__items">
                  <div className="order-page__items-header">
                    <div className="order-page__items-header-cell">Image</div>
                    <div className="order-page__items-header-cell">Product</div>
                    <div className="order-page__items-header-cell">Size</div>
                    <div className="order-page__items-header-cell">Quantity</div>
                    <div className="order-page__items-header-cell">Price</div>
                    <div className="order-page__items-header-cell">Total</div>
                  </div>
                  {order.items.map((item) => (
                    <div key={item.id} className="order-page__item">
                      <div className="order-page__item-cell">
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name} 
                          className="order-page__item-image" 
                        />
                      </div>
                      <div className="order-page__item-cell">{item.product.name}</div>
                      <div className="order-page__item-cell">
                        {item.product.has_size_selection ? item.size : 'OS'}
                      </div>
                      <div className="order-page__item-cell">{item.quantity}</div>
                      <div className="order-page__item-cell">${item.price_each}</div>
                      <div className="order-page__item-cell">${(item.price_each * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
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
          ) : (
            <div className="order-page__error">
              Order not found
            </div>
          )}
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default OrderPage; 