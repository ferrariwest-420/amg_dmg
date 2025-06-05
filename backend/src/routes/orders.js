import express from 'express';
import { getUserOrders, createOrder, getOrderDetails } from '../controllers/orders.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Все маршруты заказов требуют аутентификации
router.use(protect);

router.get('/', getUserOrders);
router.post('/', createOrder);
router.get('/:orderId', getOrderDetails);

export default router; 