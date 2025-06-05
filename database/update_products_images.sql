-- Обновляем расширения файлов с png на svg и убираем описания
UPDATE products 
SET 
  description = NULL,
  catalog_image_url = REPLACE(catalog_image_url, '.png', '.svg'),
  detail_image_url_1 = REPLACE(detail_image_url_1, '.png', '.svg'),
  detail_image_url_2 = REPLACE(detail_image_url_2, '.png', '.svg'),
  cart_image_url = REPLACE(cart_image_url, '.png', '.svg'),
  pixel_bg_url = REPLACE(pixel_bg_url, '.png', '.svg')
WHERE id != 8; -- Не обновляем placeholder продукт 