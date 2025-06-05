import { query } from '../db/index.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

// Регистрация нового пользователя
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, country, full_address } = req.body;
  
  console.log('Registration attempt:', { username, email, country, full_address });

  try {
    // Проверяем, существует ли пользователь
    const userExists = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      console.log('User already exists');
      res.status(400).json({
        message: 'Пользователь с таким именем или email уже существует'
      });
      return;
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем пользователя
    const result = await query(
      `INSERT INTO users (username, email, password_hash, country, full_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, country, full_address`,
      [username, email, hashedPassword, country, full_address]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    console.log('User registered successfully:', { userId: user.id });

    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
});

// Вход пользователя
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Находим пользователя
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    res.status(401).json({ message: 'Неверный email или пароль' });
    return;
  }

  const user = result.rows[0];

  // Проверяем пароль
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    res.status(401).json({ message: 'Неверный email или пароль' });
    return;
  }

  // Создаем токен
  const token = generateToken(user.id);

  // Отправляем ответ без пароля
  const { password_hash, ...userWithoutPassword } = user;
  res.json({
    user: userWithoutPassword,
    token
  });
});

// Получить профиль пользователя
export const getProfile = asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT id, username, email, country, full_address FROM users WHERE id = $1',
    [req.user.id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: 'Пользователь не найден' });
    return;
  }

  res.json(result.rows[0]);
});

// Обновить профиль пользователя
export const updateProfile = asyncHandler(async (req, res) => {
  const { country, full_address, old_password, new_password } = req.body;
  
  console.log('Update profile request:', { 
    userId: req.user.id,
    hasOldPassword: !!old_password,
    hasNewPassword: !!new_password,
    country,
    full_address
  });

  try {
    // Если передан старый и новый пароль, проверяем и обновляем пароль
    if (old_password && new_password) {
      console.log('Password update requested');
      
      // Получаем текущий хеш пароля пользователя
      const userResult = await query(
        'SELECT password_hash FROM users WHERE id = $1',
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Проверяем старый пароль
      const isMatch = await bcrypt.compare(old_password, userResult.rows[0].password_hash);
      console.log('Old password check:', { isMatch });
      
      if (!isMatch) {
        console.log('Invalid old password');
        return res.status(400).json({ message: 'Неверный текущий пароль' });
      }

      // Хешируем новый пароль
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);

      // Обновляем данные пользователя включая пароль
      const result = await query(
        `UPDATE users 
         SET country = $1, full_address = $2, password_hash = $3
         WHERE id = $4
         RETURNING id, username, email, country, full_address`,
        [country, full_address, hashedPassword, req.user.id]
      );

      console.log('Profile updated with new password');
      return res.json(result.rows[0]);
    }

    // Если пароль не меняется, обновляем только остальные поля
    console.log('Updating profile without password change');
    const result = await query(
      `UPDATE users 
       SET country = $1, full_address = $2
       WHERE id = $3
       RETURNING id, username, email, country, full_address`,
      [country, full_address, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
});

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}; 