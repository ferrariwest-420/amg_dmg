import React, { useState } from 'react';
import ProductCard from '../../components/ui/ProductCard/ProductCard';
import './CatalogPage.css';

// Временные данные для тестирования
const mockProducts = [
  {
    id: 1,
    name: '"Doll Life" Black Boxers (v.1)',
    description: '1+ Supima® cotton / 5 % Elastane blend for next-to-skin comfort\n1+ Branded elastic waistband with soft-touch silicone "Doll Life" script',
    image: '/products/black-boxers.png',
    price: '29$',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: '"Doll Life" White Boxers (v.1)',
    description: '1+ Supima® cotton / 5 % Elastane blend for next-to-skin comfort\n1+ Branded elastic waistband with soft-touch silicone "Doll Life" script',
    image: '/products/white-boxers.png',
    price: '29$',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 3,
    name: '"God Made Me Your Toy" Tee',
    description: '1+ Crew-neck tee, 100 % organic cotton\n1+ Soft-touch silicone printed phrase\n1+ Central 3D-embossed torso patch in tactile nylon',
    image: '/products/toy-tee.png',
    price: '79$',
    sizes: ['S', 'M', 'L', 'XL']
  }
];

const CatalogPage = () => {
  const [products] = useState(mockProducts);

  return (
    <div className="catalog">
      <div className="catalog__header">
        <h1 className="catalog__title">Catalog</h1>
      </div>
      
      <div className="catalog__grid">
        {products.map(product => (
          <div key={product.id} className="catalog__grid-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage; 