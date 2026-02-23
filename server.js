const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Create pool with DATABASE_URL support
let pool;
if (process.env.DATABASE_URL) {
  // Use DATABASE_URL for cloud services like Neon, Railway, etc.
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Use individual environment variables for local development
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    ssl: false
  });
}

// Test Database Connection (fire and forget - continues even if fails)
pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Database connected');
    console.log('Current time:', res.rows[0]);
  })
  .catch(() => {
    // Intentionally empty - demo mode will handle unavailability
  });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Product Data (same as in src/data/products.js)
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    rating: 4.5,
    reviews: 234
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    description: "Comfortable 100% organic cotton t-shirt available in multiple colors.",
    rating: 4.2,
    reviews: 89
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop",
    description: "Advanced smartwatch with health monitoring, GPS, and waterproof design.",
    rating: 4.8,
    reviews: 567
  },
  {
    id: 4,
    name: "Leather Messenger Bag",
    price: 149.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop",
    description: "Genuine leather messenger bag with laptop compartment and multiple pockets.",
    rating: 4.6,
    reviews: 123
  },
  {
    id: 5,
    name: "Running Shoes Ultra",
    price: 129.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    description: "Lightweight running shoes with superior cushioning and breathable mesh.",
    rating: 4.7,
    reviews: 345
  },
  {
    id: 6,
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
    description: "Double-walled insulated water bottle that keeps drinks cold for 24 hours.",
    rating: 4.4,
    reviews: 78
  },
  {
    id: 7,
    name: "Wireless Charging Pad",
    price: 39.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=300&h=300&fit=crop",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    rating: 4.3,
    reviews: 156
  },
  {
    id: 8,
    name: "Yoga Mat Premium",
    price: 49.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop",
    description: "Non-slip yoga mat with extra cushioning for comfortable practice.",
    rating: 4.6,
    reviews: 234
  },
  {
    id: 9,
    name: "Sunglasses Classic",
    price: 89.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
    description: "Classic polarized sunglasses with UV400 protection.",
    rating: 4.5,
    reviews: 67
  },
  {
    id: 10,
    name: "Ceramic Coffee Mug Set",
    price: 34.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop",
    description: "Set of 4 handmade ceramic mugs with elegant design.",
    rating: 4.2,
    reviews: 45
  },
  {
    id: 11,
    name: "Denim Jacket Classic",
    price: 79.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=300&fit=crop",
    description: "Timeless denim jacket with modern fit and authentic wash.",
    rating: 4.4,
    reviews: 189
  },
  {
    id: 12,
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    description: "Waterproof portable speaker with 360-degree sound and 12-hour battery.",
    rating: 4.6,
    reviews: 278
  }
];

const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Accessories",
  "Sports",
  "Home"
];

// API Routes
// Root API route for testing
app.get('/api', (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number.parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Get all categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  if (category === 'All') {
    return res.json(products);
  }
  const filteredProducts = products.filter(p => p.category === category);
  res.json(filteredProducts);
});

// Create an order (checkout) - with separate order_items table
app.post('/api/orders', async (req, res) => {
  const { items, customer, total, paymentMethod } = req.body;
  
  if (!items?.length) {
    return res.status(400).json({ message: 'No items in order' });
  }
  
  if (!customer?.name || !customer?.email || !customer?.address) {
    return res.status(400).json({ message: 'Invalid customer information' });
  }
  
  // Check if database is available
  let dbAvailable = false;
  try {
    await pool.query('SELECT 1');
    dbAvailable = true;
  } catch (err) {
    dbAvailable = false;
  }
  
  // If database is not available, return mock success (for demo purposes)
  if (!dbAvailable) {
    console.log('⚠️ Database not available - returning mock order response');
    const mockOrder = {
      id: Math.floor(Math.random() * 10000) + 1000,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_address: customer.address,
      total: total,
      status: 'pending',
      payment_status: paymentMethod === 'cod' ? 'pending' : 'completed',
      payment_method: paymentMethod || 'card',
      created_at: new Date().toISOString(),
      items: items.map(item => ({
        id: Math.floor(Math.random() * 10000),
        order_id: Math.floor(Math.random() * 10000) + 1000,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }))
    };
    
    return res.status(201).json({
      message: 'Order placed successfully (demo mode - no database)',
      order: mockOrder,
      demo: true
    });
  }
  
  // Original database code
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Simulate payment
    const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'completed';
    
    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_address, total, status, payment_status, payment_method) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [customer.name, customer.email, customer.address, total, 'pending', paymentStatus, paymentMethod || 'card']
    );
    
    const order = orderResult.rows[0];
    
// Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.id, item.name, item.price, item.quantity, item.price * item.quantity]
      );
    }
    
    // Fetch order with items
    const orderItemsResult = await client.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [order.id]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        ...order,
        items: orderItemsResult.rows
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving order:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error.stack);
    res.status(500).json({ message: 'Failed to save order: ' + error.message });
  } finally {
    client.release();
  }
});

// Get all orders (with items) - Optimized with JOIN
app.get('/api/orders', async (req, res) => {
  try {
    // Check if database is available
    let dbAvailable = false;
    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
    } catch (err) {
      dbAvailable = false;
    }
    
    // If database is not available, return empty array
    if (!dbAvailable) {
      console.log('⚠️ Database not available - returning empty orders');
      return res.json([]);
    }
    
    // Use LEFT JOIN to get orders with their items in a single query
    const result = await pool.query(`
      SELECT 
        o.id, o.customer_name, o.customer_email, o.customer_address,
        o.total, o.status, o.payment_status, o.payment_method,
        o.created_at,
        oi.id as item_id, oi.product_id, oi.product_name, 
        oi.price, oi.quantity, oi.subtotal
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ORDER BY o.created_at DESC, oi.id ASC
    `);
    
    // Group items by order
    const ordersMap = new Map();
    
    for (const row of result.rows) {
      const orderId = row.id;
      
      if (!ordersMap.has(orderId)) {
        // Create order entry (without item fields)
        ordersMap.set(orderId, {
          id: orderId,
          customer_name: row.customer_name,
          customer_email: row.customer_email,
          customer_address: row.customer_address,
          total: row.total,
          status: row.status,
          payment_status: row.payment_status,
          payment_method: row.payment_method,
          created_at: row.created_at,
          items: []
        });
      }
      
// Add item to order if it exists
      if (row.item_id) {
        ordersMap.get(orderId).items.push({
          id: row.item_id,
          order_id: orderId,
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.price,
          quantity: row.quantity,
          subtotal: row.subtotal
        });
      }
    }
    
    // Convert Map to array
    const orders = Array.from(ordersMap.values());
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get order by ID (with items)
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = result.rows[0];
    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );
    
    res.json({
      ...order,
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Update order status (for admin)
app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      message: 'Order status updated',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Update payment status
app.patch('/api/orders/:id/payment', async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  
  const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({ message: 'Invalid payment status' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE orders SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [paymentStatus, id]
    );
    
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      message: 'Payment status updated',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
});

// Simulate payment
app.post('/api/orders/:id/pay', async (req, res) => {
  const { id } = req.params;
  const { paymentMethod } = req.body;
  
  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (!orderResult.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    if (order.payment_status === 'completed') {
      return res.status(400).json({ message: 'Order already paid' });
    }
    
    // Simulate payment processing (random success/failure for demo)
    const paymentSuccess = Math.random() > 0.1; // 90% success rate
    
    const newPaymentStatus = paymentSuccess ? 'completed' : 'failed';
    
    const result = await pool.query(
      `UPDATE orders SET payment_status = $1, payment_method = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [newPaymentStatus, paymentMethod || 'card', id]
    );
    
    if (paymentSuccess) {
      res.json({
        message: 'Payment successful',
        order: result.rows[0]
      });
    } else {
      res.status(400).json({
        message: 'Payment failed. Please try again.',
        order: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Failed to process payment' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: 'connected',
      time: result.rows[0]
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: 'disconnected'
    });
  }
});

// Initialize database tables (run once to set up the database)
app.post('/api/init-db', async (req, res) => {
  try {
    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_address TEXT NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL
      )
    `);
    
    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`);
    
    res.json({ 
      message: 'Database initialized successfully!',
      tables: ['orders', 'order_items', 'messages']
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Failed to initialize database: ' + error.message });
  }
});

// Contact Form - Save message to database
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Check if database is available
  let dbAvailable = false;
  try {
    await pool.query('SELECT 1');
    dbAvailable = true;
  } catch (err) {
    dbAvailable = false;
  }
  
  // If database is not available, return mock success
  if (!dbAvailable) {
    console.log('⚠️ Database not available - returning mock message response');
    const mockMessage = {
      id: Math.floor(Math.random() * 10000) + 1000,
      name: name,
      email: email,
      message: message,
      created_at: new Date().toISOString()
    };
    
    return res.status(201).json({
      message: 'Message sent successfully (demo mode - no database)',
      data: mockMessage,
      demo: true
    });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

// Get all messages (for admin - optional)
app.get('/api/messages', async (req, res) => {
  try {
    // Check if database is available
    let dbAvailable = false;
    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
    } catch (err) {
      dbAvailable = false;
    }
    
    // If database is not available, return empty array
    if (!dbAvailable) {
      console.log('⚠️ Database not available - returning empty messages');
      return res.json([]);
    }
    
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;

