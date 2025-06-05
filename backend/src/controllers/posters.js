import { query } from '../db/index.js';
import asyncHandler from 'express-async-handler';

// Получить все постеры
export const getPosters = asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM posters ORDER BY created_at DESC');
  res.json(result.rows);
});

// Получить постер по ID
export const getPosterById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await query('SELECT * FROM posters WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    res.status(404).json({ message: 'Постер не найден' });
    return;
  }
  
  res.json(result.rows[0]);
}); 