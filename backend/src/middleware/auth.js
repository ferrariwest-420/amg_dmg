import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { query } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const protect = asyncHandler(async (req, res, next) => {
  try {
    // Проверяем наличие заголовка авторизации
    if (!req.headers.authorization?.startsWith('Bearer')) {
      return res.status(401).json({ 
        message: 'Не авторизован, токен отсутствует',
        details: 'No Bearer token found in Authorization header'
      });
    }

    // Получаем токен из заголовка
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'Не авторизован, токен отсутствует',
        details: 'Token is empty'
      });
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, JWT_SECRET);

    // Получаем данные пользователя без пароля
    const result = await query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Не авторизован',
        details: 'User not found'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Error in auth middleware:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Не авторизован',
        details: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Не авторизован',
        details: 'Token expired'
      });
    }

    res.status(500).json({ 
      message: 'Ошибка сервера при проверке авторизации',
      details: error.message
    });
  }
}); 