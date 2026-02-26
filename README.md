# 🛒 MiniStore - Professional E-Commerce Store

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Express-4.18-green?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Cloudinary-Cloud-blue?style=for-the-badge&logo=cloudinary" alt="Cloudinary">
</p>

A modern, full-stack e-commerce application built with React and Node.js. This project demonstrates professional-grade implementation of an online store with admin dashboard, product management, order tracking, and analytics.

## ✨ Features

### Customer Features
- 🛍️ **Product Browsing** - Browse products with category filtering
- 🔍 **Search** - Real-time product search
- 🛒 **Shopping Cart** - Persistent cart with quantity management
- 📝 **Checkout** - Complete checkout flow with order confirmation
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### Admin Features
- 🔐 **Admin Authentication** - JWT-based secure login
- 📊 **Dashboard Analytics** - Real-time sales and order statistics
- 📦 **Order Management** - View and update order status
- 🖼️ **Product Upload** - Add/edit products with image upload
- ☁️ **Cloudinary Integration** - Cloud-based image storage

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Image Storage** | Cloudinary |
| **Authentication** | JWT (JSON Web Tokens) |
| **Styling** | CSS3, Responsive Design |

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL (optional - works in demo mode without DB)
- Cloudinary account (optional - works without for basic images)

## 🛠️ Installation

### 1. Clone the Repository
```
bash
git clone <repository-url>
cd portpolio
```

### 2. Install Dependencies
```
bash
npm install
```

### 3. Environment Variables (Optional)

Create a `.env` file in the root directory:

```
env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (optional - demo mode works without)
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# React App API URL
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the Application

**Development Mode (both frontend and backend):**
```
bash
npm run dev
```

**Frontend Only:**
```
bash
npm start
```

**Backend Only:**
```
bash
npm run server
```

### 5. Access the Application

- **Store Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api
- **Admin Panel:** http://localhost:3000/admin
- **Admin Login:** http://localhost:3000/admin/login

### 6. Initialize Database (Optional)

If using PostgreSQL, initialize the tables:
```
bash
curl -X POST http://localhost:5000/api/init-db
```

## 📁 Project Structure

```
portpolio/
├── public/                 # Static files
│   └── index.html         # HTML template
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   │   ├── Cart.js       # Shopping cart
│   │   ├── Navbar.js    # Navigation
│   │   ├── ProductCard.js
│   │   ├── ProductList.js
│   │   ├── DashboardStats.js   # Analytics dashboard
│   │   ├── ProductForm.js      # Product CRUD form
│   │   ├── ProtectedRoute.js    # Auth protection
│   │   └── ...
│   ├── context/          # React Context
│   │   └── StoreContext.js    # Global state
│   ├── pages/            # Page components
│   │   ├── Home.js      # Main store page
│   │   ├── Admin.js     # Admin dashboard
│   │   ├── AdminLogin.js
│   │   └── ...
│   ├── data/            # Static data
│   │   └── products.js
│   ├── App.js           # Root component
│   ├── index.js         # Entry point
│   └── styles.css       # Global styles
├── config/
│   ├── db.js           # Database configuration
│   └── schema.sql      # SQL schema
├── server.js           # Express server
├── package.json
└── README.md
```

## 🔌 API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Admin login |
| `/api/auth/register` | POST | Register admin |
| `/api/auth/me` | GET | Verify token |

### Products

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | Get single product |
| `/api/products` | POST | Create product (protected) |
| `/api/products/:id` | PUT | Update product (protected) |
| `/api/products/:id` | DELETE | Delete product (protected) |
| `/api/categories` | GET | Get categories |

### Orders

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | GET | Get all orders (protected) |
| `/api/orders` | POST | Create new order |
| `/api/orders/:id/status` | PATCH | Update order status |

### Analytics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics` | GET | Get dashboard stats (protected) |

### Upload

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload image (protected) |

## 📝 Admin Credentials

After first registration, you can log in with:
- **Email:** Your registered email
- **Password:** Your chosen password

In demo mode (without database), any credentials will work.

## 🔧 Deployment

### Building for Production

```
bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Deploy to Render
1. Create a new Web Service
2. Set build command: `npm run build`
3. Set start command: `npm run prod`
4. Add environment variables

## 🎯 Key Implementation Details

### Authentication Flow
1. User submits login credentials
2. Server validates and returns JWT token
3. Token stored in localStorage
4. Protected routes check for valid token
5. API requests include token in Authorization header

### Product Management
1. Admin can add products with name, price, category, image
2. Images can be uploaded via Cloudinary or URL
3. Products stored in PostgreSQL database
4. Frontend fetches products from API

### Order Processing
1. Customer completes checkout
2. Order saved to database with items
3. Admin can view and update order status
4. Status options: pending → processing → shipped → delivered

## 🧪 Demo Mode

The application works in demo mode without a database:
- Products use default mock data
- Orders return sample data
- Any login credentials work

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or as a portfolio piece.

## 👏 Acknowledgments

- [Unsplash](https://unsplash.com) for product images
- [Cloudinary](https://cloudinary.com) for image hosting
- [React](https://react.dev) for the frontend framework

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/hakimi">Hakimi</a>
</p>
