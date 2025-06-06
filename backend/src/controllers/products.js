import { query } from '../db/database.js';
import asyncHandler from 'express-async-handler';

// Получение всех товаров
export const getProducts = asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT p.*, ARRAY_AGG(ps.size) as sizes FROM products p ' +
    'LEFT JOIN product_sizes ps ON p.id = ps.product_id ' +
    'GROUP BY p.id'
  );
  res.json(result.rows);
});

// Получение товара по ID
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await query(
    'SELECT p.*, ARRAY_AGG(ps.size) as sizes FROM products p ' +
    'LEFT JOIN product_sizes ps ON p.id = ps.product_id ' +
    'WHERE p.id = $1 ' +
    'GROUP BY p.id',
    [id]
  );
  
  if (result.rows.length === 0) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  
  res.json(result.rows[0]);
}); 