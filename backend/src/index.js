import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';
import productsRouter from './routes/products.js';
import postersRouter from './routes/posters.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Получаем путь к корню проекта
const projectRoot = resolve(process.cwd(), '..');

// Путь к директории с ассетами
const assetsPath = join(projectRoot, 'frontend', 'public', 'assets');
console.log('Project root:', projectRoot);
console.log('Assets directory path:', assetsPath);

// Проверяем существование директории и файлов
try {
  const exists = fs.existsSync(assetsPath);
  console.log('Assets directory exists:', exists);
  if (!exists) {
    // Создаем директорию, если она не существует
    fs.mkdirSync(assetsPath, { recursive: true });
    console.log('Created assets directory');
  }
  
  const productsPath = join(assetsPath, 'products');
  if (!fs.existsSync(productsPath)) {
    fs.mkdirSync(productsPath, { recursive: true });
    console.log('Created products directory');
  }
  
  // Проверяем содержимое директории
  const files = fs.readdirSync(assetsPath);
  console.log('Assets directory contents:', files);
  
  if (fs.existsSync(productsPath)) {
    const productFiles = fs.readdirSync(productsPath);
    console.log('Products directory contents:', productFiles);
  }
} catch (error) {
  console.error('Error checking/creating assets directory:', error);
}

// Проверяем критически важные переменные окружения
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  // Не выводим пароль в логи!
  HAS_DB_PASSWORD: !!process.env.DB_PASSWORD,
});

const app = express();
const port = process.env.PORT || 3001;

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000', // URL фронтенда
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Логгер для запросов к статическим файлам
app.use('/assets', (req, res, next) => {
  // Убираем дублирование 'products' из URL
  if (req.url.startsWith('/products/products/')) {
    req.url = req.url.replace('/products/products/', '/products/');
  }
  
  const fullPath = join(assetsPath, req.url);
  console.log('Static file request:', {
    originalUrl: req.originalUrl,
    modifiedUrl: req.url,
    fullPath,
    exists: fs.existsSync(fullPath)
  });
  next();
});

// Настраиваем статическую раздачу файлов
app.use('/assets', express.static(assetsPath));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/posters', postersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    detail: err.detail
  });

  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    details: process.env.NODE_ENV === 'development' ? err.detail : undefined
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 