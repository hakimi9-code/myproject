# Mini E-Commerce Store

A modern, responsive e-commerce store built with React. This is a frontend-only application with mock data and local state management.

## Features

- **Product Listings**: Browse a collection of 12 products across different categories
- **Search Functionality**: Real-time search through product names and descriptions
- **Category Filtering**: Filter products by Electronics, Clothing, Accessories, Sports, and Home categories
- **Shopping Cart**: 
  - Add products to cart
  - Adjust quantities
  - Remove items
  - Persistent cart (saved to localStorage)
- **Checkout Simulation**: Simulated checkout process with order confirmation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - Modern React with Hooks and Context API
- **React Router v6** - Client-side routing
- **CSS3** - Custom responsive styles
- **Local Storage** - Cart persistence

## Project Structure

```
mini-ecommerce-store/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js/.css
│   │   ├── ProductCard.js/.css
│   │   ├── ProductList.js/.css
│   │   ├── Cart.js/.css
│   │   └── Checkout.js/.css
│   ├── context/
│   │   └── StoreContext.js
│   ├── data/
│   │   └── products.js
│   ├── pages/
│   │   └── Home.js/.css
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

## Installation

1. Clone or navigate to the project directory:
   ```bash
   cd mini-ecommerce-store
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Browsing Products
- The homepage displays all products
- Use the category buttons to filter products
- Use the search bar to find products by name or description

### Shopping Cart
- Click "Add to Cart" on any product to add it to your cart
- Visit the cart page to view and manage items
- Adjust quantities using the + and - buttons
- Remove items with the × button
- Cart contents are saved automatically

### Checkout
- Click "Proceed to Checkout" on the cart page
- The checkout is simulated - no real payment is processed
- After checkout, you'll see a confirmation with order details

## Available Products

The store includes 12 products across 6 categories:
- **Electronics**: Bluetooth Headphones, Smart Watch, Wireless Charger, Bluetooth Speaker
- **Clothing**: Organic Cotton T-Shirt, Denim Jacket
- **Accessories**: Leather Messenger Bag, Sunglasses
- **Sports**: Running Shoes, Yoga Mat
- **Home**: Water Bottle, Coffee Mug Set

## Customization

### Adding More Products
Edit `src/data/products.js` to add or modify products:

```javascript
{
  id: 13,
  name: "Your Product Name",
  price: 99.99,
  category: "Category",
  image: "image-url",
  description: "Product description",
  rating: 4.5,
  reviews: 100
}
```

### Adding Categories
Edit `src/data/products.js` to add new categories:

```javascript
export const categories = [
  "All",
  "Electronics",
  "Clothing",
  // Add your category here
];
```

## Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Client-Side Routing & URL Handling

This application uses **React Router v6** for client-side routing, which means:

### Same URLs in Local & Production

The app works with **identical URLs** in both environments:

| Route | Local Development | Production |
|-------|------------------|------------|
| Home | `http://localhost:3000/` | `https://yourdomain.com/` |
| Cart | `http://localhost:3000/cart` | `https://yourdomain.com/cart` |
| Checkout | `http://localhost:3000/checkout-success` | `https://yourdomain.com/checkout-success` |

### How It Works

1. **Single Page Application (SPA)**: The entire app loads once, and React dynamically updates content based on the URL without page reloads
2. **Client-Side Routing**: React Router handles navigation in the browser, not on the server
3. **No Server Configuration Needed**: Works automatically in local development

### Route Permissions

All routes are **public and accessible** to all users:
- ✅ `/` - Home page (public)
- ✅ `/cart` - Shopping cart (public)
- ✅ `/checkout-success` - Order confirmation (public)
- ❌ No protected routes (no authentication required)

### Deployment Configuration

For the app to work correctly in production with client-side routing, deployment platforms need configuration to serve `index.html` for all routes:

#### **Option 1: Netlify** ✅
- File: `public/_redirects` (already included)
- Rule: `/* /index.html 200`

#### **Option 2: Vercel** ✅
- File: `vercel.json` (already included)
- Rewrites all paths to `/index.html`

#### **Option 3: GitHub Pages**
Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/repo-name"
}
```

#### **Option 4: Apache**
Create `.htaccess` in `public/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### **Option 5: Nginx**
Configure `nginx.conf`:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Quick Deployment Commands

```bash
# Local Development
npm start                  # Runs on http://localhost:3000

# Production Build
npm run build              # Creates optimized build in /build folder

# Deploy to Netlify
npx netlify deploy --prod --dir=build

# Deploy to Vercel
vercel --prod

# Deploy to GitHub Pages
npm run deploy
```

### Benefits of This Approach

- 🔥 **Consistent URLs** across all environments
- 🚀 **Fast navigation** without page reloads
- 📱 **Better UX** with smooth transitions
- 🔧 **Easy deployment** to any static hosting service
- 🎯 **SEO friendly** when properly configured

## License

MIT License - feel free to use this project for learning or as a starting point for your own e-commerce application.

