# 🛒 MiniStore - E-Commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

A modern, full-featured e-commerce platform built with React, Node.js, and PostgreSQL. Perfect for job portfolios and learning modern web development.

![MiniStore Preview](https://via.placeholder.com/1200x600/667eea/ffffff?text=MiniStore+E-Commerce)

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog** - Browse products with search and category filtering
- 🔍 **Smart Search** - Real-time product search
- 🛒 **Shopping Cart** - Persistent cart with quantity management
- 💳 **Checkout** - Simulated checkout flow with order confirmation
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop

### Admin Features (Protected)
- 🔐 **Secure Admin Login** - JWT authentication
- 📊 **Dashboard Analytics** - Sales stats, revenue, orders overview
- 📦 **Order Management** - View and update order statuses
- 🖼️ **Product Management** - Add, edit, delete products
- ☁️ **Image Upload** - Cloudinary integration for product images

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens) |
| **Image Storage** | Cloudinary |
| **Styling** | CSS3, Modern Flexbox/Grid |
| **Deployment** | Vercel, Netlify |

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+ (optional - works without database)
- Cloudinary account (optional - for image uploads)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ministore.git
cd ministore
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup (Optional)
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start the development server
```bash
# Start both React and Express server
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api

## 📁 Project Structure

```
ministore/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Cart.js         # Shopping cart
│   │   ├── Checkout.js    # Checkout success
│   │   ├── Navbar.js      # Navigation
│   │   ├── ProductCard.js  # Product display
│   │   ├── ProductList.js  # Product grid
│   │   ├── DashboardStats.js  # Admin analytics
│   │   ├── ProductForm.js # Product CRUD form
│   │   └── ProtectedRoute.js   # Auth guard
│   ├── context/
│   │   └── StoreContext.js    # State management
│   ├── pages/
│   │   ├── Home.js        # Home page
│   │   ├── Admin.js       # Admin dashboard
│   │   └── AdminLogin.js  # Admin login
│   ├── data/
│   │   └── products.js    # Default products
│   ├── App.js             # Main app
│   ├── index.js           # Entry point
│   └── styles.css         # Global styles
├── server.js              # Express API server
├── config/
│   └── schema.sql        # Database schema
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register admin user |
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Verify token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (protected) |
| PUT | `/api/products/:id` | Update product (protected) |
| DELETE | `/api/products/:id` | Delete product (protected) |
| GET | `/api/categories` | Get all categories |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders (protected) |
| POST | `/api/orders` | Create new order |
| PATCH | `/api/orders/:id/status` | Update order status |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Dashboard stats (protected) |

### Utilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload image (protected) |
| POST | `/api/messages` | Submit contact form |
| GET | `/api/messages` | Get messages (protected) |

## 🔐 Admin Access

### Demo Mode (No Database)
When running without a database, use these credentials:
- **Email**: demo@admin.com
- **Password**: (any password works)

### Production Mode
1. Set up PostgreSQL database
2. Configure `.env` with database credentials
3. Visit `/admin/login`
4. Click "Register" to create your admin account

## ☁️ Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
npm run build
npx netlify deploy --prod --dir=build
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

## 🎯 Key Implementation Details

### Authentication Flow
```
User Login → JWT Token Generated → Stored in localStorage
                                     ↓
                            Protected Routes Check Token
                                     ↓
                            Valid → Allow Access
                            Invalid → Redirect to Login
```

### Database Schema
The app works without a database using mock data. When connected to PostgreSQL:
- Users table for admin accounts
- Products table for inventory
- Orders & OrderItems for transactions
- Messages for contact form submissions

### Image Upload
- Uses Multer for file handling
- Cloudinary for cloud storage
- Falls back to URL input if upload fails

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for product images
- [React Hot Toast](https://react-hot-toast.com) for notifications
- [Cloudinary](https://cloudinary.com) for image management

---

<p align="center">
  Made with ❤️ for learning and portfolio building
</p>

