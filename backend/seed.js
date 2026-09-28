const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./model/User');
const Product = require('./model/Product');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Remove old data
    await User.deleteMany();
    await Product.deleteMany();

    // Hash admin password
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    // Dummy products
   const products = [
  // ==================================================
  // AUDIO - 5
  // ==================================================

  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Immersive sound experience with advanced active noise cancellation.',
    price: 299.99,
    category: 'Audio',
    stock: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    ratings: 4.8,
    numReviews: 24
  },
  {
    name: 'True Wireless Earbuds',
    description:
      'Compact wireless earbuds with clear sound and long battery life.',
    price: 59.99,
    category: 'Audio',
    stock: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1',
    ratings: 4.5,
    numReviews: 31
  },
  {
    name: 'Bluetooth Speaker',
    description:
      'Portable Bluetooth speaker delivering powerful sound wherever you go.',
    price: 49.99,
    category: 'Audio',
    stock: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    ratings: 4.4,
    numReviews: 28
  },
  {
    name: 'Premium Soundbar',
    description:
      'High-quality soundbar designed for immersive home entertainment.',
    price: 179.99,
    category: 'Audio',
    stock: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d',
    ratings: 4.6,
    numReviews: 19
  },
  {
    name: 'Studio Over-Ear Headphones',
    description:
      'Professional over-ear headphones designed for studio-quality audio.',
    price: 129.99,
    category: 'Audio',
    stock: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1484704849700-f032a568e944',
    ratings: 4.7,
    numReviews: 42
  },

  // ==================================================
  // COMPUTERS - 5
  // ==================================================

  {
    name: 'Business Laptop',
    description:
      'Slim and reliable laptop designed for work and productivity.',
    price: 699.99,
    category: 'Computers',
    stock: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    ratings: 4.5,
    numReviews: 40
  },
  {
    name: 'Gaming Laptop',
    description:
      'High-performance gaming laptop with powerful graphics and processing.',
    price: 1299.99,
    category: 'Computers',
    stock: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6',
    ratings: 4.8,
    numReviews: 55
  },
  {
    name: 'Full HD Monitor',
    description:
      'Crystal-clear Full HD monitor suitable for work and entertainment.',
    price: 199.99,
    category: 'Computers',
    stock: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
    ratings: 4.4,
    numReviews: 33
  },
  {
    name: 'Mechanical Keyboard',
    description:
      'Durable mechanical keyboard with responsive and tactile keys.',
    price: 69.99,
    category: 'Computers',
    stock: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    ratings: 4.6,
    numReviews: 48
  },
  {
    name: 'Wireless Mouse',
    description:
      'Ergonomic wireless mouse with precise tracking and comfortable grip.',
    price: 29.99,
    category: 'Computers',
    stock: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1527814050087-3793815479db',
    ratings: 4.3,
    numReviews: 29
  },

  // ==================================================
  // MOBILES - 5
  // ==================================================

  {
    name: 'Android Smartphone',
    description:
      'Modern smartphone with a vibrant display and powerful processor.',
    price: 399.99,
    category: 'Mobiles',
    stock: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    ratings: 4.5,
    numReviews: 52
  },
  {
    name: 'Premium Smartphone',
    description:
      'Premium smartphone with advanced camera and high-performance hardware.',
    price: 899.99,
    category: 'Mobiles',
    stock: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',
    ratings: 4.8,
    numReviews: 76
  },
  {
    name: 'Smartwatch',
    description:
      'Smartwatch with fitness tracking and notification support.',
    price: 149.99,
    category: 'Mobiles',
    stock: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    ratings: 4.4,
    numReviews: 35
  },
  {
    name: 'Android Tablet',
    description:
      'Large-screen tablet suitable for entertainment and productivity.',
    price: 299.99,
    category: 'Mobiles',
    stock: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    ratings: 4.5,
    numReviews: 31
  },
  {
    name: 'Fast Charging Power Bank',
    description:
      'High-capacity power bank with fast charging support.',
    price: 39.99,
    category: 'Mobiles',
    stock: 45,
    imageUrl:
      'https://rukminim3.flixcart.com/image/1114/972/xif0q/power-bank/o/2/a/-enriched-transparent-original-imahdthbvkfxrdnf.png?q=60&crop=false',
    ratings: 4.3,
    numReviews: 29
  },

  // ==================================================
  // CAMERAS - 5
  // ==================================================

  {
    name: 'Professional DSLR Camera',
    description:
      'Professional DSLR camera for high-quality photography.',
    price: 1199.99,
    category: 'Cameras',
    stock: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    ratings: 4.9,
    numReviews: 50
  },
  {
    name: 'Mirrorless Camera',
    description:
      'Compact mirrorless camera with excellent image quality.',
    price: 999.99,
    category: 'Cameras',
    stock: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd',
    ratings: 4.8,
    numReviews: 42
  },
  {
    name: 'Action Camera',
    description:
      'Rugged action camera designed for adventure and outdoor recording.',
    price: 299.99,
    category: 'Cameras',
    stock: 20,
    imageUrl:
      'https://m.media-amazon.com/images/I/41eCn3+dlaL._SY300_SX300_QL70_FMwebp_.jpg',
    ratings: 4.6,
    numReviews: 38
  },
  {
    name: 'Camera Tripod',
    description:
      'Stable and adjustable tripod designed to provide steady support for cameras and video recording.',
    price: 79.99,
    category: 'Cameras',
    stock: 25,
    imageUrl:
      'https://img.kentfaith.com/cache/catalog/products/us/KF09.170S1/KF09.170S1-4-518x518.jpg',
    ratings: 4.4,
    numReviews: 20
  },
  {
    name: 'Vlogging Camera',
    description:
      'Compact camera designed for content creators and vloggers.',
    price: 649.99,
    category: 'Cameras',
    stock: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c',
    ratings: 4.7,
    numReviews: 32
  },

  // ==================================================
  // FASHION - 5
  // ==================================================

  {
    name: 'Classic White Sneakers',
    description:
      'Versatile and comfortable white sneakers for everyday outfits.',
    price: 85,
    category: 'Fashion',
    stock: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    ratings: 4.5,
    numReviews: 89
  },
  {
    name: 'Classic T-Shirt',
    description:
      'Comfortable cotton t-shirt suitable for everyday wear.',
    price: 24.99,
    category: 'Fashion',
    stock: 70,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    ratings: 4.3,
    numReviews: 55
  },
  {
    name: 'Premium Hoodie',
    description:
      'Warm and comfortable hoodie made with premium fabric.',
    price: 49.99,
    category: 'Fashion',
    stock: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    ratings: 4.6,
    numReviews: 47
  },
  {
    name: 'Denim Jacket',
    description:
      'Classic denim jacket with a modern casual fit.',
    price: 79.99,
    category: 'Fashion',
    stock: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    ratings: 4.5,
    numReviews: 33
  },
  {
    name: 'Classic Wrist Watch',
    description:
      'Elegant wrist watch suitable for formal and casual occasions.',
    price: 129.99,
    category: 'Fashion',
    stock: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
    ratings: 4.7,
    numReviews: 40
  },

  // ==================================================
  // FURNITURE - 5
  // ==================================================

  {
    name: 'Ergonomic Office Chair',
    description:
      'Comfortable ergonomic chair designed for long working hours.',
    price: 199.99,
    category: 'Furniture',
    stock: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
    ratings: 4.5,
    numReviews: 44
  },
  {
    name: 'Gaming Chair',
    description:
      'Comfortable gaming chair with adjustable back support.',
    price: 249.99,
    category: 'Furniture',
    stock: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6',
    ratings: 4.6,
    numReviews: 38
  },
  {
    name: 'Study Table',
    description:
      'Modern study table with spacious working surface.',
    price: 149.99,
    category: 'Furniture',
    stock: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    ratings: 4.4,
    numReviews: 25
  },
  {
    name: 'Wooden Bookshelf',
    description:
      'Stylish wooden bookshelf for books and home decoration.',
    price: 179.99,
    category: 'Furniture',
    stock: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1594620302200-9a762244a156',
    ratings: 4.5,
    numReviews: 20
  },
  {
    name: 'Modern Sofa',
    description:
      'Comfortable modern sofa designed for contemporary living rooms.',
    price: 599.99,
    category: 'Furniture',
    stock: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    ratings: 4.7,
    numReviews: 32
  },

  // ==================================================
  // HOME & KITCHEN - 5
  // ==================================================

  {
    name: 'Automatic Coffee Maker',
    description:
      'Automatic coffee maker for fresh coffee at home.',
    price: 129.99,
    category: 'Home & Kitchen',
    stock: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    ratings: 4.6,
    numReviews: 35
  },
  {
    name: 'Digital Air Fryer',
    description:
      'Digital air fryer for healthier and convenient cooking.',
    price: 99.99,
    category: 'Home & Kitchen',
    stock: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1585515320310-259814833e62',
    ratings: 4.5,
    numReviews: 41
  },
  {
    name: 'Kitchen Blender',
    description:
      'Powerful kitchen blender for smoothies and food preparation.',
    price: 69.99,
    category: 'Home & Kitchen',
    stock: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b',
    ratings: 4.4,
    numReviews: 29
  },
  {
    name: 'Electric Kettle',
    description:
      'Fast boiling electric kettle with automatic shutoff.',
    price: 34.99,
    category: 'Home & Kitchen',
    stock: 35,
    imageUrl:
      'https://www.milton.in/cdn/shop/files/Go_Electro_Kettle_1.2_Litre_5.jpg?v=1760420644&width=1240',
    ratings: 4.5,
    numReviews: 33
  },
  {
    name: 'Microwave Oven',
    description:
      'Compact microwave oven for quick and convenient cooking.',
    price: 149.99,
    category: 'Home & Kitchen',
    stock: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078',
    ratings: 4.4,
    numReviews: 26
  },

  // ==================================================
  // GAMING - 5
  // ==================================================

  {
    name: 'Gaming Console',
    description:
      'Next-generation gaming console for immersive entertainment.',
    price: 499.99,
    category: 'Gaming',
    stock: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1605901309584-818e25960a8f',
    ratings: 4.8,
    numReviews: 65
  },
  {
    name: 'Wireless Gaming Controller',
    description:
      'Wireless controller with responsive buttons and ergonomic design.',
    price: 69.99,
    category: 'Gaming',
    stock: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48',
    ratings: 4.6,
    numReviews: 45
  },
  {
    name: 'Gaming Headset',
    description:
      'Gaming headset with immersive audio and a clear microphone.',
    price: 89.99,
    category: 'Gaming',
    stock: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1599669454699-248893623440',
    ratings: 4.7,
    numReviews: 39
  },
  {
    name: 'Gaming Mouse',
    description:
      'High-precision gaming mouse with customizable buttons.',
    price: 59.99,
    category: 'Gaming',
    stock: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7',
    ratings: 4.6,
    numReviews: 42
  },
  {
    name: 'Gaming Keyboard',
    description:
      'RGB mechanical gaming keyboard with responsive switches.',
    price: 99.99,
    category: 'Gaming',
    stock: 28,
    imageUrl:
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a',
    ratings: 4.8,
    numReviews: 51
  },

  // ==================================================
  // ACCESSORIES - 5
  // ==================================================

  {
    name: 'Travel Backpack',
    description:
      'Spacious backpack suitable for travel and everyday use.',
    price: 59.99,
    category: 'Accessories',
    stock: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    ratings: 4.5,
    numReviews: 38
  },
  {
    name: 'Leather Wallet',
    description:
      'Premium leather wallet with multiple card slots.',
    price: 39.99,
    category: 'Accessories',
    stock: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1627123424574-724758594e93',
    ratings: 4.4,
    numReviews: 31
  },
  {
    name: 'Classic Sunglasses',
    description:
      'Stylish sunglasses with UV protection.',
    price: 49.99,
    category: 'Accessories',
    stock: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
    ratings: 4.3,
    numReviews: 27
  },
  {
    name: 'Laptop Bag',
    description:
      'Protective laptop bag with multiple storage compartments.',
    price: 54.99,
    category: 'Accessories',
    stock: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1556306535-38febf6782e7',
    ratings: 4.5,
    numReviews: 24
  },
  {
    name: 'Travel Duffel Bag',
    description:
      'Large duffel bag designed for travel and weekend trips.',
    price: 69.99,
    category: 'Accessories',
    stock: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1553531384-cc64ac80f931',
    ratings: 4.4,
    numReviews: 20
  },

  // ==================================================
  // SPORTS - 5
  // ==================================================

  {
    name: 'Professional Cricket Bat',
    description:
      'High-quality cricket bat designed for competitive players.',
    price: 149.99,
    category: 'Sports',
    stock: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
    ratings: 4.7,
    numReviews: 35
  },
  {
    name: 'Football',
    description:
      'Durable football suitable for training and matches.',
    price: 39.99,
    category: 'Sports',
    stock: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
    ratings: 4.5,
    numReviews: 42
  },
  {
    name: 'Sports Running Shoes',
    description:
      'Comfortable sports shoes designed for running and training.',
    price: 79.99,
    category: 'Sports',
    stock: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3',
    ratings: 4.6,
    numReviews: 48
  },
  {
    name: 'Cricket Helmet',
    description:
      'Protective cricket helmet designed for player safety.',
    price: 69.99,
    category: 'Sports',
    stock: 18,
    imageUrl:
      'https://m.media-amazon.com/images/I/81vxE7ZzHtL._SX679_.jpg',
    ratings: 4.6,
    numReviews: 22
  },
  {
    name: 'Yoga Mat',
    description:
      'Non-slip yoga mat suitable for yoga and home workouts.',
    price: 29.99,
    category: 'Sports',
    stock: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2',
    ratings: 4.4,
    numReviews: 29
  }
];
    // Insert products
    await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!');
    console.log(`Admin Email: ${process.env.ADMIN_EMAIL}`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();