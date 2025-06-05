import { query } from '../db/index.js';
import asyncHandler from 'express-async-handler';
import { pool } from '../db/index.js';

// Получить все заказы пользователя
export const getUserOrders = asyncHandler(async (req, res) => {
  try {
    console.log('Getting orders for user:', req.user.id);
    
    const result = await query(
      `SELECT 
        o.*,
        COALESCE(json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price_each', oi.price_each,
            'product', (SELECT json_build_object(
              'name', p.name,
              'image_url', p.cart_image_url
            ) FROM products p WHERE p.id = oi.product_id)
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    console.log('Query executed successfully');
    console.log('Found orders:', JSON.stringify(result.rows, null, 2));

    // Преобразуем даты в ISO формат для корректной передачи на фронтенд
    const ordersWithFormattedDates = result.rows.map(order => ({
      ...order,
      created_at: order.created_at ? order.created_at.toISOString() : null,
      updated_at: order.updated_at ? order.updated_at.toISOString() : null
    }));

    res.json(ordersWithFormattedDates);
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Ошибка при получении заказов',
      details: error.message,
      stack: error.stack
    });
  }
});

// Создать новый заказ из корзины
export const createOrder = asyncHandler(async (req, res) => {
  const { delivery_address, payment_method } = req.body;
  console.log('Creating order for user:', req.user.id);
  console.log('Delivery address:', delivery_address);
  console.log('Payment method:', payment_method);

  // Начинаем транзакцию
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Transaction started');

    // Сначала получаем id корзины пользователя
    const cartResult = await client.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [req.user.id]
    );
    
    if (cartResult.rows.length === 0) {
      throw new Error('Корзина не найдена');
    }
    
    const cartId = cartResult.rows[0].id;
    console.log('Found cart ID:', cartId);

    // Получаем товары из корзины
    const cartItems = await client.query(
      `SELECT ci.*, p.price, p.name
       FROM carts c
       JOIN cart_items ci ON c.id = ci.cart_id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    console.log('Cart items found:', cartItems.rows);

    if (cartItems.rows.length === 0) {
      throw new Error('Корзина пуста');
    }

    // Вычисляем общую сумму
    const totalAmount = cartItems.rows.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    console.log('Total amount calculated:', totalAmount);

    // Создаем заказ
    const order = await client.query(
      `INSERT INTO orders (user_id, total_amount, delivery_address, payment_method, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [req.user.id, totalAmount, delivery_address, payment_method]
    );
    console.log('Order created:', order.rows[0]);

    // Добавляем позиции заказа
    for (const item of cartItems.rows) {
      const orderItem = await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_each, size)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [order.rows[0].id, item.product_id, item.quantity, item.price, item.size]
      );
      console.log('Order item added:', orderItem.rows[0]);
    }

    // Очищаем корзину
    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    console.log('Cart cleared');

    await client.query('COMMIT');
    console.log('Transaction committed successfully');
    
    res.status(201).json({
      message: 'Заказ успешно создан',
      order: {
        ...order.rows[0],
        items: cartItems.rows.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_each: item.price,
          size: item.size,
          product_name: item.name
        }))
      }
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    console.error('Error stack:', error.stack);
    await client.query('ROLLBACK');
    console.log('Transaction rolled back due to error');
    
    res.status(500).json({ 
      message: 'Ошибка при создании заказа',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    client.release();
    console.log('Database client released');
  }
});

// Получить детали заказа
export const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  
  const result = await query(
    `SELECT o.*,
            json_agg(json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price_each', oi.price_each,
              'size', oi.size,
              'product', (SELECT json_build_object(
                'name', p.name,
                'image_url', p.cart_image_url,
                'has_size_selection', p.has_size_selection
              ) FROM products p WHERE p.id = oi.product_id)
            )) as items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     WHERE o.id = $1 AND o.user_id = $2
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [orderId, req.user.id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ message: 'Заказ не найден' });
    return;
  }

  // Форматируем даты в ISO формат
  const order = {
    ...result.rows[0],
    created_at: result.rows[0].created_at ? result.rows[0].created_at.toISOString() : null,
    updated_at: result.rows[0].updated_at ? result.rows[0].updated_at.toISOString() : null
  };

  res.json(order);
}); 