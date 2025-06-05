-- Меняем расширения обратно на png для всех изображений, кроме detail-2
BEGIN;

UPDATE products 
SET 
    catalog_image_url = REPLACE(catalog_image_url, '.svg', '.png'),
    detail_image_url_1 = REPLACE(detail_image_url_1, '.svg', '.png'),
    cart_image_url = REPLACE(cart_image_url, '.svg', '.png'),
    pixel_bg_url = REPLACE(pixel_bg_url, '.svg', '.png')
WHERE id != 8; -- Не обновляем placeholder продукт

COMMIT; 