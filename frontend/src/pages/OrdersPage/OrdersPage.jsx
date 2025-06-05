import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import FolderIcon from '../../components/ui/FolderIcon/FolderIcon';
import loading1 from '../../assets/loading1.gif';
import documentIcon from '../../assets/icons/document.svg';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders...');
        const token = localStorage.getItem('token');
        console.log('Using token:', token);
        
        const response = await fetch('http://localhost:3001/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        console.log('Received orders:', data);
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <OSWindow>
      <WindowTab title="Orders">
        <div className="orders-page">
          {isLoading ? (
            <div className="orders-page__empty">
              <img 
                src={loading1} 
                alt="Loading orders" 
                className="orders-page__empty-image" 
              />
              <div className="orders-page__empty-text">
                Loading...
              </div>
            </div>
          ) : error ? (
            <div className="orders-page__empty">
              <div className="orders-page__error">
                {error}
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-page__empty">
              <img 
                src={loading1} 
                alt="No orders" 
                className="orders-page__empty-image" 
              />
              <div className="orders-page__empty-text">
                There's nothing
              </div>
            </div>
          ) : (
            <div className="orders-page__content">
              <div className="orders-page__grid">
                {orders.slice(0, 18).map((order) => (
                  <FolderIcon
                    key={order.id}
                    icon={<img src={documentIcon} alt="Order" />}
                    label={formatDate(order.created_at)}
                    to={`/profile/orders/${order.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default OrdersPage; 