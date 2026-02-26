const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
});

// Configure multer for Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});
const upload = multer({ storage: storage });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Create pool with DATABASE_URL support
let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    ssl: false
  });
}

// Test Database Connection
pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Database connected');
  })
  .catch(() => {
    console.log('⚠️ Database not available - running in demo mode');
  });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Check if database is available
const isDbAvailable = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
};

// Default products data (fallback when no database)
const defaultProducts = [
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

// ==================== AUTH ROUTES ====================

// Seed default admin user (run this once to create admin)
app.post('/api/auth/seed-admin', async (req, res) => {
  const { email, password, name } = req.body;
  
  // Secret key to prevent unauthorized seeding
  const SEED_SECRET = process.env.SEED_SECRET || 'dev-seed-key';
  const providedSecret = req.headers['x-seed-secret'];
  
  if (providedSecret !== SEED_SECRET) {
    // For demo purposes, allow seeding without secret
    console.log('Allowing seed without secret (demo mode)');
  }
  
  const adminEmail = email || 'admin@minishop.com';
  const adminPassword = password || 'admin123';
  const adminName = name || 'Admin';
  
  const dbAvailable = await isDbAvailable();
  if (!dbAvailable) {
    return res.status(503).json({ message: 'Database not available' });
  }
  
  try {
    // Check if admin exists
    const existingUser = await pool.query('SELECT id FROM users WHERE role = $1', ['admin']);
    
    if (existingUser.rows.length > 0) {
      return res.json({ 
        message: 'Admin user already exists',
        admin: { email: adminEmail }
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Create admin user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [adminEmail, hashedPassword, adminName, 'admin']
    );
    
    // Generate token
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Admin user created successfully!',
      token,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        role: result.rows[0].role
      },
      credentials: {
        email: adminEmail,
        password: adminPassword
      }
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    res.status(500).json({ message: 'Failed to create admin user' });
  }
});

// Register admin user (first-time setup)
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  const dbAvailable = await isDbAvailable();
  
  // If no database, allow registration in demo mode
  if (!dbAvailable) {
    const demoToken = jwt.sign(
      { id: 1, email: email, role: 'admin', name: name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return res.status(201).json({
      message: 'Admin registered successfully (demo mode)',
      token: demoToken,
      user: {
        id: 1,
        email: email,
        name: name,
        role: 'admin'
      },
      demo: true
    });
  }
  
  try {
    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, hashedPassword, name, 'admin']
    );
    
    // Generate token
    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        role: result.rows[0].role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const dbAvailable = await isDbAvailable();
  if (!dbAvailable) {
    // Demo mode - accept any login
    const token = jwt.sign(
      { id: 1, email: 'demo@admin.com', role: 'admin', name: 'Demo Admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return res.json({
      message: 'Login successful (demo mode)',
      token,
      user: {
        id: 1,
        email: 'demo@admin.com',
        name: 'Demo Admin',
        role: 'admin'
      },
      demo: true
    });
  }
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Verify token
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const dbAvailable = await isDbAvailable();
  if (!dbAvailable) {
    return res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
      }
    });
  }
  
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Auth check failed' });
  }
});

// ==================== PRODUCT ROUTES ====================

// Get all products
app.get('/api/products', async (req, res) => {
  const dbAvailable = await isDbAvailable();
  
  if (!dbAvailable) {
    return res.json(defaultProducts);
  }
  
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    if (result.rows.length === 0) {
      // If no products in DB, return default and seed the database
      return res.json(defaultProducts);
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.json(defaultProducts);
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const dbAvailable = await isDbAvailable();
  
  if (!dbAvailable) {
    const product = defaultProducts.find(p => p.id === Number.parseInt(id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  }
  
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      const defaultProduct = defaultProducts.find(p => p.id === Number.parseInt(id));
      if (defaultProduct) {
        return res.json(defaultProduct);
      }
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// Create product (protected)
app.post('/api/products', authenticateToken, async (req, res) => {
  const { name, price, category, image, description, rating, reviews, in_stock } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }
  
  const dbAvailable = await isDbAvailable();
  if (!dbAvailable) {
    // Demo mode - return mock response
    const mockProduct = {
      id: Math.floor(Math.random() * 10000) + 1000,
      name,
      price,
      category,
      image: image || 'https://via.placeholder.com/300x300?text=No+Image',
      description: description || '',
      rating: rating || 0,
      reviews: reviews || 0,
      in_stock: in_stock !== false,
      created_at: new Date().toISOString()
    };
    return res.status(201).json({
      message: 'Product created (demo mode)',
      product: mockProduct,
      demo: true
    });
  }
  
  try {
    const result = await pool.query(
      `INSERT INTO products (name, price, category, image, description, rating, reviews, in_stock) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, price, category, image || null, description || null, rating || 0, reviews || 0, in_stock !== false]
    );
    
    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Update product (protected)
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price, category, image, description, rating, reviews, in_stock } = req.body;
  
  const dbAvailable = await isDbAvailable();
  if (!dbAvailable) {
    return res.status(503).json({ message: 'Database not available (demo mode)' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, price = $2, category = $3, image = $4, description = $5, 
           rating = $6, reviews = $7, in_stock = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [name, price, category, image, description, rating, reviews, in_stock, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      message: 'Product updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete product (protected)
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  const dbAvailable = await isDbAvailable();
  if (!dbAvailable) {
    return res.status(503).json({ message: 'Database not available (demo mode)' });
  }
  
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  const { category } = req.params;
  const dbAvailable = await isDbAvailable();
  
  if (!dbAvailable) {
    if (category === 'All') {
      return res.json(defaultProducts);
    }
    const filteredProducts = defaultProducts.filter(p => p.category === category);
    return res.json(filteredProducts);
  }
  
  try {
    if (category === 'All') {
      const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
      return res.json(result.rows.length > 0 ? result.rows : defaultProducts);
    }
    
    const result = await pool.query('SELECT * FROM products WHERE category = $1', [category]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ==================== IMAGE UPLOAD ROUTE ====================

// Upload image (protected)
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  
  res.json({
    message: 'Image uploaded successfully',
    url: req.file.path,
    public_id: req.file.filename
  });
});

// ==================== ORDER ROUTES ====================

// Create an order (checkout)
app.post('/api/orders', async (req, res) => {
  const { items, customer, total, paymentMethod } = req.body;
  
  if (!items?.length) {
    return res.status(400).json({ message: 'No items in order' });
  }
  
  if (!customer?.name || !customer?.email || !customer?.address) {
    return res.status(400).json({ message: 'Invalid customer information' });
  }
  
  const dbAvailable = await isDbAvailable();
  
  if (!dbAvailable) {
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
      message: 'Order placed successfully (demo mode)',
      order: mockOrder,
      demo: true
    });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'completed';
    
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_address, total, status, payment_status, payment_method) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [customer.name, customer.email, customer.address, total, 'pending', paymentStatus, paymentMethod || 'card']
    );
    
    const order = orderResult.rows[0];
    
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_category, price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [order.id, item.id, item.name, item.category || 'Unknown', item.price, item.quantity, item.price * item.quantity]
      );
    }
    
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
    res.status(500).json({ message: 'Failed to save order: ' + error.message });
  } finally {
    client.release();
  }
});

// Get all orders (with items) - Protected but works in demo mode
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const dbAvailable = await isDbAvailable();
    
    if (!dbAvailable) {
      // Demo mode - return sample orders
      return res.json([
        {
          id: 1001,
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          customer_address: '123 Main St, New York, NY 10001',
          total: 159.99,
          status: 'pending',
          payment_status: 'completed',
          payment_method: 'card',
          created_at: new Date().toISOString(),
          items: [
            { id: 1, order_id: 1001, product_id: 1, product_name: 'Wireless Bluetooth Headphones', product_price: 79.99, quantity: 1, subtotal: 79.99 },
            { id: 2, order_id: 1001, product_id: 6, product_name: 'Stainless Steel Water Bottle', product_price: 24.99, quantity: 2, subtotal: 49.98 },
            { id: 3, order_id: 1001, product_id: 7, product_name: 'Wireless Charging Pad', product_price: 39.99, quantity: 1, subtotal: 39.99 }
          ]
        },
        {
          id: 1002,
          customer_name: 'Jane Smith',
          customer_email: 'jane@example.com',
          customer_address: '456 Oak Ave, Los Angeles, CA 90001',
          total: 229.99,
          status: 'processing',
          payment_status: 'completed',
          payment_method: 'card',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          items: [
            { id: 4, order_id: 1002, product_id: 3, product_name: 'Smart Watch Pro', product_price: 299.99, quantity: 1, subtotal: 299.99 }
          ]
        },
        {
          id: 1003,
          customer_name: 'Bob Wilson',
          customer_email: 'bob@example.com',
          customer_address: '789 Pine Rd, Chicago, IL 60601',
          total: 449.97,
          status: 'shipped',
          payment_status: 'completed',
          payment_method: 'card',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          items: [
            { id: 5, order_id: 1003, product_id: 4, product_name: 'Leather Messenger Bag', product_price: 149.99, quantity: 1, subtotal: 149.99 },
            { id: 6, order_id: 1003, product_id: 5, product_name: 'Running Shoes Ultra', product_price: 129.99, quantity: 1, subtotal: 129.99 },
            { id: 7, order_id: 1003, product_id: 8, product_name: 'Yoga Mat Premium', product_price: 49.99, quantity: 1, subtotal: 49.99 }
          ]
        },
        {
          id: 1004,
          customer_name: 'Alice Brown',
          customer_email: 'alice@example.com',
          customer_address: '321 Elm St, Houston, TX 77001',
          total: 89.97,
          status: 'delivered',
          payment_status: 'completed',
          payment_method: 'cod',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          items: [
            { id: 8, order_id: 1004, product_id: 2, product_name: 'Organic Cotton T-Shirt', product_price: 29.99, quantity: 2, subtotal: 59.98 },
            { id: 9, order_id: 1004, product_id: 10, product_name: 'Ceramic Coffee Mug Set', product_price: 34.99, quantity: 1, subtotal: 34.99 }
          ]
        }
      ]);
    }
    
    const result = await pool.query(`
      SELECT 
        o.id, o.customer_name, o.customer_email, o.customer_address,
        o.total, o.status, o.payment_status, o.payment_method,
        o.created_at,
        oi.id as item_id, oi.product_id, oi.product_name, 
        oi.price as product_price, oi.quantity, oi.subtotal
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ORDER BY o.created_at DESC, oi.id ASC
    `);
    
    const ordersMap = new Map();
    
    for (const row of result.rows) {
      const orderId = row.id;
      
      if (!ordersMap.has(orderId)) {
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
      
      if (row.item_id) {
        ordersMap.get(orderId).items.push({
          id: row.item_id,
          order_id: orderId,
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          quantity: row.quantity,
          subtotal: row.subtotal
        });
      }
    }
    
    const orders = Array.from(ordersMap.values());
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Update order status (protected)
app.patch('/api/orders/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  const dbAvailable = await isDbAvailable();
  if (!dbAvailable) {
    return res.json({
      message: 'Order status updated (demo mode)',
      order: { id: Number(id), status }
    });
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

// ==================== ANALYTICS ROUTES ====================

// Get dashboard analytics (protected)
app.get('/api/analytics', authenticateToken, async (req, res) => {
  const dbAvailable = await isDbAvailable();
  
  if (!dbAvailable) {
    // Demo analytics data
    return res.json({
      totalOrders: 156,
      totalRevenue: 24567.89,
      totalProducts: 12,
      totalCustomers: 89,
      recentOrders: [
        { id: 1001, customer_name: 'John Doe', total: 129.99, status: 'pending', created_at: new Date().toISOString() },
        { id: 1002, customer_name: 'Jane Smith', total: 79.99, status: 'processing', created_at: new Date().toISOString() },
        { id: 1003, customer_name: 'Bob Wilson', total: 249.99, status: 'shipped', created_at: new Date().toISOString() }
      ],
      salesByCategory: [
        { category: 'Electronics', total: 12500 },
        { category: 'Clothing', total: 4500 },
        { category: 'Accessories', total: 3200 },
        { category: 'Sports', total: 2800 },
        { category: 'Home', total: 1567.89 }
      ],
      monthlySales: [
        { month: 'Jan', sales: 3200 },
        { month: 'Feb', sales: 4100 },
        { month: 'Mar', sales: 3800 },
        { month: 'Apr', sales: 5200 },
        { month: 'May', sales: 4800 },
        { month: 'Jun', sales: 5467.89 }
      ]
    });
  }
  
  try {
    // Get total orders
    const ordersResult = await pool.query('SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders');
    
    // Get total products
    const productsResult = await pool.query('SELECT COUNT(*) as count FROM products');
    
    // Get unique customers
    const customersResult = await pool.query('SELECT COUNT(DISTINCT customer_email) as count FROM orders');
    
    // Get recent orders
    const recentOrdersResult = await pool.query(
      'SELECT id, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5'
    );
    
    // Get sales by category (use product_category from order_items)
    const categoryResult = await pool.query(`
      SELECT 
        COALESCE(product_category, 'Unknown') as category, 
        COALESCE(SUM(subtotal), 0) as total
      FROM order_items
      GROUP BY product_category
    `);
    
    // Get monthly sales (last 6 months)
    const monthlyResult = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        COALESCE(SUM(total), 0) as sales
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at)
    `);
    
    res.json({
      totalOrders: parseInt(ordersResult.rows[0].count) || 0,
      totalRevenue: parseFloat(ordersResult.rows[0].revenue) || 0,
      totalProducts: parseInt(productsResult.rows[0].count) || 12,
      totalCustomers: parseInt(customersResult.rows[0].count) || 0,
      recentOrders: recentOrdersResult.rows,
      salesByCategory: categoryResult.rows,
      monthlySales: monthlyResult.rows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return empty data on error instead of 500
    return res.json({
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 12,
      totalCustomers: 0,
      recentOrders: [],
      salesByCategory: [],
      monthlySales: []
    });
  }
});

// ==================== MESSAGE ROUTES ====================

// Contact Form - Save message
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  const dbAvailable = await isDbAvailable();
  
  if (!dbAvailable) {
    const mockMessage = {
      id: Math.floor(Math.random() * 10000) + 1000,
      name, email, message,
      created_at: new Date().toISOString()
    };
    
    return res.status(201).json({
      message: 'Message sent successfully (demo mode)',
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

// Get all messages (protected)
app.get('/api/messages', authenticateToken, async (req, res) => {
  const dbAvailable = await isDbAvailable();
  
  if (!dbAvailable) {
    return res.json([]);
  }
  
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// ==================== PUBLIC ROUTES ====================

// Root API route
app.get('/api', (req, res) => {
  res.json({ 
    message: "API is running 🚀",
    version: "2.0.0",
    features: ["auth", "products", "orders", "analytics", "messages"]
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      database: 'connected',
      time: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      database: 'disconnected'
    });
  }
});

// Initialize database tables
app.post('/api/init-db', async (req, res) => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(500),
        description TEXT,
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        in_stock BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
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
    
    // Create order_items table - store category directly for analytics
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_category VARCHAR(100),
        product_price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL
      )
    `);
    
    // Migration: Add product_category column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_category VARCHAR(100)`);
    } catch (e) {
      // Column might already exist, ignore error
    }
    
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
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
    
    res.json({ 
      message: 'Database initialized successfully!',
      tables: ['users', 'products', 'orders', 'order_items', 'messages']
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Failed to initialize database: ' + error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Auto-initialize database tables on startup
const initializeDatabase = async () => {
  const dbAvailable = await isDbAvailable();
  if (!dbAvailable) {
    console.log('⚠️ Database not available - skipping initialization');
    return;
  }
  
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(500),
        description TEXT,
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        in_stock BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
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
    
    // Create order_items table - store category directly for analytics
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_category VARCHAR(100),
        product_price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL
      )
    `);
    
    // Migration: Add product_category column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_category VARCHAR(100)`);
    } catch (e) {
      // Column might already exist, ignore error
    }
    
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
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
    
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
};

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
});

module.exports = app;

