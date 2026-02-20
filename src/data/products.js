// Mock Product Data
export const products = [
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

export const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Accessories",
  "Sports",
  "Home"
];

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

