import express from 'express';
import { getPosters, getPosterById } from '../controllers/posters.js';
import { query } from '../db/database.js';

const router = express.Router();

router.get('/', getPosters);
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Преобразуем строковый ID в число
    const numericId = parseInt(id.replace('img', ''));
    const result = await query('SELECT image_url FROM posters WHERE id = $1', [numericId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Poster not found' });
    }

    res.json({ imageUrl: result.rows[0].image_url });
  } catch (error) {
    console.error('Error fetching poster:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 