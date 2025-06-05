import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { query } from '../db/index.js';

// Защита маршрутов - проверка JWT токена
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получаем пользователя из базы данных
      const result = await query(
        'SELECT id, email FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // Добавляем информацию о пользователе в request
      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error('Error in auth middleware:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
}); 