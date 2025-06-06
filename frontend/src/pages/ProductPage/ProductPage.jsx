import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import SizeSelector from '../../components/ui/SizeSelector/SizeSelector';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductPage.css';

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = 'http://localhost:3001';
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        console.log('Product data:', data);
        setProduct(data);
        // Если у товара нет размеров, устанавливаем 'OS' по умолчанию
        if (!data.has_size_selection) {
          setSelectedSize('OS');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setAddToCartError('Please log in to add items to cart');
      return;
    }

    if (product?.has_size_selection && !selectedSize) {
      setAddToCartError('Please select a size');
      return;
    }

    setAddToCartError(null);
    try {
      await addToCart(product, selectedSize);
    setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000); // Сброс через 2 секунды
    } catch (err) {
      setAddToCartError(err.message || 'Failed to add item to cart');
      setIsAddedToCart(false);
    }
  };

  if (loading) {
    return (
      <OSWindow>
        <WindowTab title="Product" onClose={() => navigate('/catalog')}>
          <div className="product-page">
            <div className="product-page__loading">Loading...</div>
          </div>
        </WindowTab>
      </OSWindow>
    );
  }

  if (error || !product) {
    return (
      <OSWindow>
        <WindowTab title="Product" onClose={() => navigate('/catalog')}>
          <div className="product-page">
            <div className="product-page__error">
              {error || 'Product not found'}
            </div>
          </div>
        </WindowTab>
      </OSWindow>
    );
  }

  const {
    name,
    detail_image_url_1,
    detail_image_url_2,
    pixel_bg_url,
    has_size_selection,
    sizes
  } = product;

  return (
    <OSWindow>
      <WindowTab title="Product" onClose={() => navigate('/catalog')}>
        <div className="product-page">
          <div className="product-page__pattern"></div>
          
          <img 
            src={`${baseUrl}${pixel_bg_url}`}
            alt={`${name} pixel background`}
            className="product-page__image product-page__image--pixel-bg"
            draggable="false"
          />
          <img 
            src={`${baseUrl}${detail_image_url_1}`}
            alt={`${name} detail 1`}
            className="product-page__image product-page__image--detail-1"
            draggable="false"
          />
          <img 
            src={`${baseUrl}${detail_image_url_2}`}
            alt={`${name} detail 2`}
            className="product-page__image product-page__image--detail-2"
            draggable="false"
          />

          {has_size_selection && Array.isArray(sizes) && sizes.length > 0 && !sizes.includes(null) && (
            <div className="product-page__size-selector">
              <SizeSelector 
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                sizes={sizes}
              />
            </div>
          )}

          {addToCartError && (
            <div className="product-page__error-message">
              {addToCartError}
            </div>
          )}

          <button 
            className={`product-page__add-to-cart ${has_size_selection && !selectedSize ? 'product-page__add-to-cart--disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={has_size_selection && !selectedSize}
          >
            {isAddedToCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default ProductPage; 