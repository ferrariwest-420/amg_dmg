import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cart.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Все маршруты корзины требуют аутентификации
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/:itemId')
  .put(updateCartItem)
  .delete(removeFromCart);

export default router; 