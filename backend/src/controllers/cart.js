import { query } from '../db/database.js';
import asyncHandler from 'express-async-handler';

// Получение или создание корзины пользователя
const getOrCreateCart = async (userId) => {
  try {
    let cartResult = await query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      cartResult = await query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
    }

    return cartResult.rows[0].id;
  } catch (err) {
    console.error('Error in getOrCreateCart:', err);
    throw new Error('Failed to get or create cart');
  }
};

// Получение корзины пользователя
export const getCart = asyncHandler(async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);
    console.log('Cart ID:', cartId);

  const result = await query(
      `SELECT 
        ci.id as cart_item_id, 
        ci.quantity, 
        ci.size,
        p.id as product_id,
        p.name,
        p.price,
        p.catalog_image_url,
        p.cart_image_url,
        p.detail_image_url_1,
        p.detail_image_url_2,
        p.pixel_bg_url,
        p.has_size_selection,
        CASE 
          WHEN p.has_size_selection THEN ARRAY_AGG(ps.size ORDER BY 
            CASE ps.size 
              WHEN 'S' THEN 1 
              WHEN 'M' THEN 2 
              WHEN 'L' THEN 3 
              WHEN 'XL' THEN 4 
            END ASC NULLS LAST) FILTER (WHERE ps.size IS NOT NULL)
          ELSE ARRAY['OS']
        END as available_sizes
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_sizes ps ON p.id = ps.product_id AND p.has_size_selection = true
       WHERE ci.cart_id = $1
       GROUP BY ci.id, p.id, p.name, p.price, p.catalog_image_url, p.cart_image_url, 
                p.detail_image_url_1, p.detail_image_url_2, p.pixel_bg_url, p.has_size_selection`,
      [cartId]
    );

    // Проверяем и форматируем данные перед отправкой
    const formattedData = result.rows.map(item => {
      if (!item.cart_item_id) {
        console.error('Missing cart_item_id for item:', item);
      }
      if (!item.product_id) {
        console.error('Missing product_id for item:', item);
      }
      
      return {
        ...item,
        cart_item_id: item.cart_item_id || null,
        product_id: item.product_id || null,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        has_size_selection: !!item.has_size_selection,
        available_sizes: Array.isArray(item.available_sizes) ? item.available_sizes : ['OS']
      };
    });

    console.log('Formatted cart data:', formattedData);
    res.json(formattedData);
  } catch (err) {
    console.error('Error in getCart:', err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// Добавление товара в корзину
export const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity = 1, size = 'OS' } = req.body;
    const cartId = await getOrCreateCart(req.user.id);

    // Проверяем существование продукта
    const productResult = await query(
      'SELECT id, has_size_selection FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Проверяем, есть ли уже такой товар в корзине с тем же размером
  const existingItem = await query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2 AND size = $3',
      [cartId, productId, size]
  );

    let result;
  if (existingItem.rows.length > 0) {
      // Обновляем количество для существующего товара
      result = await query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 AND size = $4 RETURNING *',
        [quantity, cartId, productId, size]
    );
  } else {
    // Добавляем новый товар
      result = await query(
        'INSERT INTO cart_items (cart_id, product_id, quantity, size) VALUES ($1, $2, $3, $4) RETURNING *',
        [cartId, productId, quantity, size]
      );
    }

    // Получаем полную информацию о добавленном товаре
    const cartItem = await query(
      `SELECT 
        ci.id as cart_item_id, 
        ci.quantity, 
        ci.size,
        p.id as product_id,
        p.name,
        p.price,
        p.catalog_image_url,
        p.cart_image_url,
        p.detail_image_url_1,
        p.detail_image_url_2,
        p.pixel_bg_url,
        p.has_size_selection,
        ARRAY_AGG(ps.size) FILTER (WHERE ps.size IS NOT NULL) as available_sizes
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_sizes ps ON p.id = ps.product_id
       WHERE ci.id = $1
       GROUP BY ci.id, p.id, p.name, p.price, p.catalog_image_url, p.cart_image_url,
                p.detail_image_url_1, p.detail_image_url_2, p.pixel_bg_url, p.has_size_selection`,
      [result.rows[0].id]
    );

    res.json(cartItem.rows[0]);
  } catch (err) {
    console.error('Error in addToCart:', err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// Обновление количества товара в корзине
export const updateCartItem = asyncHandler(async (req, res) => {
  try {
  const { itemId } = req.params;
    const { quantity, size } = req.body;
    const cartId = await getOrCreateCart(req.user.id);

    console.log('Update cart item params:', { itemId, quantity, size, cartId });

    // Валидация itemId
    const parsedItemId = parseInt(itemId);
    if (isNaN(parsedItemId)) {
      console.error('Invalid itemId:', itemId);
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    // Проверяем существование товара в корзине
    const checkItem = await query(
      'SELECT id FROM cart_items WHERE id = $1 AND cart_id = $2',
      [parsedItemId, cartId]
    );

    if (checkItem.rows.length === 0) {
      console.error('Cart item not found:', { itemId: parsedItemId, cartId });
      return res.status(404).json({ message: 'Cart item not found' });
    }

    let updateFields = [];
    let updateValues = [];
    let paramIndex = 1;

    if (quantity !== undefined) {
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 9) {
        console.error('Invalid quantity:', quantity);
        return res.status(400).json({ message: 'Invalid quantity value' });
      }
      updateFields.push(`quantity = $${paramIndex}`);
      updateValues.push(parsedQuantity);
      paramIndex++;
    }

    if (size !== undefined) {
      if (typeof size !== 'string' || !['S', 'M', 'L', 'XL', 'OS'].includes(size)) {
        console.error('Invalid size:', size);
        return res.status(400).json({ message: 'Invalid size value' });
      }
      updateFields.push(`size = $${paramIndex}`);
      updateValues.push(size);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(parsedItemId, cartId);
    const query_text = `UPDATE cart_items SET ${updateFields.join(', ')} 
       WHERE id = $${paramIndex} AND cart_id = $${paramIndex + 1}
       RETURNING *`;
    
    console.log('Update query:', { query_text, values: updateValues });

    const result = await query(query_text, updateValues);

  if (result.rows.length === 0) {
      console.error('Failed to update cart item:', { itemId: parsedItemId, cartId });
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Получаем полную информацию о товаре
    const cartItem = await query(
      `SELECT 
        ci.id as cart_item_id, 
        ci.quantity, 
        ci.size,
        p.id as product_id,
        p.name,
        p.price,
        p.catalog_image_url,
        p.cart_image_url,
        p.detail_image_url_1,
        p.detail_image_url_2,
        p.pixel_bg_url,
        p.has_size_selection,
        ARRAY_AGG(ps.size) FILTER (WHERE ps.size IS NOT NULL) as available_sizes
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_sizes ps ON p.id = ps.product_id
       WHERE ci.id = $1
       GROUP BY ci.id, p.id, p.name, p.price, p.catalog_image_url, p.cart_image_url,
                p.detail_image_url_1, p.detail_image_url_2, p.pixel_bg_url, p.has_size_selection`,
      [result.rows[0].id]
    );

    console.log('Updated cart item:', cartItem.rows[0]);
    res.json(cartItem.rows[0]);
  } catch (err) {
    console.error('Error in updateCartItem:', err);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
});

// Удаление товара из корзины
export const removeFromCart = asyncHandler(async (req, res) => {
  try {
  const { itemId } = req.params;
    const cartId = await getOrCreateCart(req.user.id);

    const result = await query(
      'DELETE FROM cart_items WHERE id = $1 AND cart_id = $2 RETURNING *',
      [itemId, cartId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error in removeFromCart:', err);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
}); 