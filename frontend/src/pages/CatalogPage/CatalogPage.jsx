import React, { useState, useEffect } from 'react';
import OSWindow from '../../components/layout/OSWindow/OSWindow';
import WindowTab from '../../components/layout/WindowTab/WindowTab';
import ProductCard from '../../components/ui/ProductCard/ProductCard';
import './CatalogPage.css';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const sortedProducts = data.sort((a, b) => a.id - b.id);
        setProducts(sortedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <OSWindow>
      <WindowTab title="Catalog">
        <div className="catalog-page">
          {loading && (
            <div className="catalog-page__loading">Loading...</div>
          )}
          
          {error && (
            <div className="catalog-page__error">{error}</div>
          )}
          
          {!loading && !error && (
            <div className="catalog-page__grid">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </WindowTab>
    </OSWindow>
  );
};

export default CatalogPage;
