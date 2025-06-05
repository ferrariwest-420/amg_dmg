-- Обновляем второе изображение для перчаток на test.svg
UPDATE products 
SET detail_image_url_2 = '/src/assets/images/test.svg'
WHERE id = 1; 