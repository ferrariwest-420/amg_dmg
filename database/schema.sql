-- Удаление существующих таблиц
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS posters CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Пользователи
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)    NOT NULL UNIQUE,
  email         VARCHAR(255)   NOT NULL UNIQUE,
  password_hash VARCHAR(255)   NOT NULL,
  country       VARCHAR(100)   NOT NULL,
  full_address  TEXT          NOT NULL
);

-- 2. Товары каталога
CREATE TABLE IF NOT EXISTS products (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(100)   NOT NULL,
  price               INTEGER        NOT NULL,
  catalog_image_url   VARCHAR(500),  -- Изображение для каталога
  detail_image_url_1  VARCHAR(500),  -- Первое изображение для страницы товара
  detail_image_url_2  VARCHAR(500),  -- Второе изображение для страницы товара
  cart_image_url      VARCHAR(500),  -- Изображение для корзины и заказов
  pixel_bg_url        VARCHAR(500),  -- Пиксельное название для фона страницы товара
  has_size_selection  BOOLEAN        NOT NULL DEFAULT true
);

-- 2.1. Размеры товара
CREATE TABLE IF NOT EXISTS product_sizes (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       VARCHAR(20) NOT NULL
);

-- 3. Галерея — постеры
CREATE TABLE IF NOT EXISTS posters (
  id          SERIAL PRIMARY KEY,
  image_url   VARCHAR(500) NOT NULL
);

-- 4. Корзины
CREATE TABLE IF NOT EXISTS carts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- 4.1 Товары в корзине
CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL PRIMARY KEY,
  cart_id    INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL,
  size       VARCHAR(2) NOT NULL,
  CONSTRAINT cart_items_cart_id_product_id_size_key UNIQUE (cart_id, product_id, size),
  CONSTRAINT cart_items_quantity_check CHECK (quantity >= 1 AND quantity <= 9)
);

-- 5. Заказы
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  status           VARCHAR(20)   NOT NULL DEFAULT 'pending',
  total_amount     NUMERIC(10,2) NOT NULL,
  delivery_address TEXT          NOT NULL,
  payment_method   VARCHAR(20)   NOT NULL DEFAULT 'paypal',
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5.1. Позиции заказа
CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  price_each NUMERIC(10,2) NOT NULL
);

