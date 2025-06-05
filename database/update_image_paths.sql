-- Обновляем расширения файлов с png на svg и меняем пути к файлам
BEGIN;

UPDATE products 
SET 
    catalog_image_url = REPLACE(REPLACE(catalog_image_url, '/src/assets/', '/assets/'), '.png', '.svg'),
    detail_image_url_1 = REPLACE(REPLACE(detail_image_url_1, '/src/assets/', '/assets/'), '.png', '.svg'),
    detail_image_url_2 = REPLACE(REPLACE(detail_image_url_2, '/src/assets/', '/assets/'), '.png', '.svg'),
    cart_image_url = REPLACE(REPLACE(cart_image_url, '/src/assets/', '/assets/'), '.png', '.svg'),
    pixel_bg_url = REPLACE(REPLACE(pixel_bg_url, '/src/assets/', '/assets/'), '.png', '.svg')
WHERE id != 8; -- Не обновляем placeholder продукт

COMMIT; 