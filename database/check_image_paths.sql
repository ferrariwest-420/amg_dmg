-- Проверка текущих путей к изображениям
SELECT 
    id,
    name,
    catalog_image_url,
    detail_image_url_1,
    detail_image_url_2,
    pixel_bg_url
FROM 
    products
WHERE 
    catalog_image_url LIKE '%/products/products/%'
    OR detail_image_url_1 LIKE '%/products/products/%'
    OR detail_image_url_2 LIKE '%/products/products/%'
    OR pixel_bg_url LIKE '%/products/products/%'; 