const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gentx';

const products = [
  {
    name: 'Obsidian Slim-Fit Shirt',
    description: 'Crafted from premium Egyptian cotton, this slim-fit shirt delivers an effortless blend of comfort and refinement. The subtle texture adds depth while maintaining the clean silhouette Gent X is known for.',
    price: 89.99, discountPrice: 74.99, category: 'shirts', brand: 'Gent X',
    images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600', public_id: 'p1a' }, { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600', public_id: 'p1b' }],
    colors: ['Black', 'White', 'Charcoal'], sizes: ['S','M','L','XL','XXL'],
    stock: 80, featured: true, isNewArrival: true, rating: 4.8, numReviews: 34, sold: 120,
    tags: ['shirt', 'slim-fit', 'cotton', 'premium'],
  },
  {
    name: 'Midnight Tailored Trousers',
    description: 'Sharp, structured, and supremely comfortable. These tailored trousers feature a mid-rise cut with a tapered leg, perfect for the modern gentleman navigating both boardroom and bar.',
    price: 129.99, discountPrice: 0, category: 'pants', brand: 'Gent X',
    images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', public_id: 'p2a' }],
    colors: ['Black', 'Navy', 'Charcoal', 'Stone'], sizes: ['28','30','32','34','36'],
    stock: 55, featured: true, isNewArrival: false, rating: 4.6, numReviews: 21, sold: 88,
    tags: ['pants', 'trousers', 'formal', 'tailored'],
  },
  {
    name: 'Phantom Leather Jacket',
    description: 'Full-grain Italian leather meets minimalist design in this statement piece. Unlined for a clean drape with a matte finish. An investment in effortless cool that only improves with age.',
    price: 349.99, discountPrice: 299.99, category: 'jackets', brand: 'Gent X',
    images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', public_id: 'p3a' }, { url: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600', public_id: 'p3b' }],
    colors: ['Black', 'Dark Brown'], sizes: ['S','M','L','XL'],
    stock: 20, featured: true, isNewArrival: false, rating: 4.9, numReviews: 47, sold: 65,
    tags: ['jacket', 'leather', 'premium', 'luxury'],
  },
  {
    name: 'Shadow Oxford Shoes',
    description: 'Hand-stitched Goodyear welted construction on a sleek cap-toe Oxford. Vegetable-tanned leather upper with a lightweight rubber sole for all-day wear without compromise.',
    price: 219.99, discountPrice: 179.99, category: 'shoes', brand: 'Gent X',
    images: [{ url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600', public_id: 'p4a' }],
    colors: ['Black', 'Tan', 'Burgundy'], sizes: ['40','41','42','43','44','45'],
    stock: 35, featured: true, isNewArrival: true, rating: 4.7, numReviews: 28, sold: 74,
    tags: ['shoes', 'oxford', 'leather', 'formal'],
  },
  {
    name: 'Monolith Crew-Neck Hoodie',
    description: 'Heavyweight 400gsm French terry cotton gives this hoodie its distinctive structure. Dropped shoulders, ribbed cuffs, and a kangaroo pocket — built for the days when comfort means everything.',
    price: 109.99, discountPrice: 89.99, category: 'hoodies', brand: 'Gent X',
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', public_id: 'p5a' }, { url: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600', public_id: 'p5b' }],
    colors: ['Charcoal', 'Black', 'Off-White', 'Slate'], sizes: ['S','M','L','XL','XXL'],
    stock: 100, featured: false, isNewArrival: true, rating: 4.5, numReviews: 52, sold: 210,
    tags: ['hoodie', 'casual', 'cotton', 'streetwear'],
  },
  {
    name: 'Eclipse Two-Piece Suit',
    description: 'A modern cut in a super 120s wool-silk blend. Half-canvas construction for natural drape. Notch lapels with a single-button closure and flat-front trousers — authority without arrogance.',
    price: 599.99, discountPrice: 499.99, category: 'suits', brand: 'Gent X',
    images: [{ url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600', public_id: 'p6a' }],
    colors: ['Charcoal', 'Navy', 'Black'], sizes: ['S','M','L','XL'],
    stock: 15, featured: true, isNewArrival: false, rating: 4.9, numReviews: 18, sold: 32,
    tags: ['suit', 'formal', 'wool', 'luxury', 'office'],
  },
  {
    name: 'Stealth Slim Chinos',
    description: 'The perfect bridge between casual and smart. A refined cotton-stretch blend with a slim taper and clean finish — styled up with a blazer, or down with clean sneakers.',
    price: 79.99, discountPrice: 0, category: 'casual', brand: 'Gent X',
    images: [{ url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', public_id: 'p7a' }],
    colors: ['Beige', 'Navy', 'Olive', 'Black'], sizes: ['28','30','32','34','36'],
    stock: 70, featured: false, isNewArrival: true, rating: 4.4, numReviews: 31, sold: 145,
    tags: ['chinos', 'casual', 'slim', 'stretch'],
  },
  {
    name: 'Cipher Matte Watch',
    description: 'Swiss quartz movement in a 40mm brushed-steel case. Matte black dial with applied hour markers. Sapphire crystal, 100m water resistance. The quietest statement in the room.',
    price: 249.99, discountPrice: 199.99, category: 'accessories', brand: 'Gent X',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', public_id: 'p8a' }, { url: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=600', public_id: 'p8b' }],
    colors: ['Black', 'Silver'], sizes: ['One Size'],
    stock: 25, featured: false, isNewArrival: false, rating: 4.8, numReviews: 39, sold: 56,
    tags: ['watch', 'accessories', 'luxury', 'minimalist'],
  },
];

async function seed() {
  try {
    await mongoose.connect(URI);
    console.log('Connected to MongoDB');
    await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);
    console.log('Collections cleared');

    const adminPass = await bcrypt.hash('admin123', 12);
    const userPass  = await bcrypt.hash('user123', 12);

    const admin = await User.create({ name: 'Gent X Admin', email: 'admin@gentx.com', password: adminPass, role: 'admin' });
    const user1 = await User.create({ name: 'Alex Carter', email: 'alex@example.com', password: userPass, role: 'user', phone: '+1 555 0101', address: { street: '88 Fashion Ave', city: 'New York', state: 'NY', zipCode: '10018', country: 'USA' } });
    const user2 = await User.create({ name: 'James Chen', email: 'james@example.com', password: userPass, role: 'user' });
    console.log('Users created');

    const docs = await Product.insertMany(products);
    console.log(`${docs.length} products created`);

    await Order.create({
      user: user1._id,
      orderItems: [
        { product: docs[0]._id, name: docs[0].name, image: docs[0].images[0].url, price: 74.99, quantity: 2, color: 'Black', size: 'M' },
        { product: docs[3]._id, name: docs[3].name, image: docs[3].images[0].url, price: 179.99, quantity: 1, color: 'Black', size: '42' },
      ],
      shippingAddress: { fullName: 'Alex Carter', street: '88 Fashion Ave', city: 'New York', state: 'NY', zipCode: '10018', country: 'USA', phone: '+1 555 0101' },
      paymentMethod: 'card',
      paymentResult: { id: 'PAY-GX001', status: 'COMPLETED', update_time: new Date().toISOString(), email_address: 'alex@example.com' },
      itemsPrice: 329.97, shippingPrice: 0, taxPrice: 29.70, totalPrice: 359.67,
      isPaid: true, paidAt: new Date(), orderStatus: 'delivered', deliveredAt: new Date(),
    });
    await Order.create({
      user: user2._id,
      orderItems: [{ product: docs[2]._id, name: docs[2].name, image: docs[2].images[0].url, price: 299.99, quantity: 1, color: 'Black', size: 'L' }],
      shippingAddress: { fullName: 'James Chen', street: '12 Park Lane', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA', phone: '+1 555 0202' },
      paymentMethod: 'card',
      itemsPrice: 299.99, shippingPrice: 9.99, taxPrice: 27.00, totalPrice: 336.98,
      isPaid: false, orderStatus: 'pending',
    });
    console.log('Sample orders created');

    console.log('\n✅ Gent X database seeded!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin  → admin@gentx.com  / admin123');
    console.log('👤 User 1 → alex@example.com / user123');
    console.log('👤 User 2 → james@example.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
}

seed();
