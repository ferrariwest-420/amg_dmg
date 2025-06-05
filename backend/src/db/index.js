import pg from 'pg';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const { Pool } = pg;

// Логируем конфигурацию без пароля
console.log('Database configuration:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // Не показываем пароль
  hasPassword: !!process.env.DB_PASSWORD
});

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Проверяем подключение при старте
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client:', err.stack);
    return;
  }
  console.log('Successfully connected to database');
  release();
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, params, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, params, error: error.message, stack: error.stack });
    throw error;
  }
}; 