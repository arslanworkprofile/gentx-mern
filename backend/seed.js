const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Classic Oxford Shirt',
    description: 'A timeless Oxford shirt crafted from premium 100% cotton. Perfect for both formal and casual occasions.',
    price: 4500,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Light Blue', hex: '#ADD8E6' }],
    stock: 50,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.5,
    numReviews: 12,
    tags: ['formal', 'cotton', 'oxford'],
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Modern slim-fit chinos in premium stretch cotton. Versatile enough for office or weekend wear.',
    price: 5500,
    salePrice: 4200,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#000080' }, { name: 'Olive', hex: '#808000' }],
    stock: 35,
    isBestSeller: true,
    rating: 4.7,
    numReviews: 24,
    tags: ['chinos', 'slim-fit', 'versatile'],
  },
  {
    name: 'Premium Wool Blazer',
    description: 'Expertly tailored wool blazer for the modern gentleman. Features a single-breasted design with notched lapels.',
    price: 18000,
    category: 'suits',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Navy', hex: '#000080' }],
    stock: 20,
    isFeatured: true,
    rating: 4.9,
    numReviews: 8,
    tags: ['blazer', 'wool', 'formal', 'premium'],
  },
  {
    name: 'Leather Derby Shoes',
    description: 'Hand-crafted full-grain leather Derby shoes with a classic cap-toe design. Built to last a lifetime.',
    price: 12000,
    category: 'shoes',
    images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Tan', hex: '#D2B48C' }, { name: 'Black', hex: '#000000' }],
    stock: 15,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    numReviews: 19,
    tags: ['leather', 'formal', 'derby', 'handcrafted'],
  },
  {
    name: 'Automatic Chronograph Watch',
    description: 'Swiss-inspired automatic movement with a sapphire crystal glass and genuine leather strap.',
    price: 35000,
    category: 'watches',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'],
    sizes: [],
    colors: [{ name: 'Silver/Black', hex: '#C0C0C0' }, { name: 'Gold/Brown', hex: '#FFD700' }],
    stock: 10,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 6,
    tags: ['watch', 'automatic', 'luxury', 'swiss'],
  },
  {
    name: 'Merino Wool Crew Neck',
    description: 'Luxuriously soft merino wool sweater. Temperature-regulating and wrinkle-resistant for all-day comfort.',
    price: 7500,
    salePrice: 6000,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Camel', hex: '#C19A6B' }, { name: 'Burgundy', hex: '#800020' }, { name: 'Forest Green', hex: '#228B22' }],
    stock: 30,
    isNewArrival: true,
    rating: 4.6,
    numReviews: 15,
    tags: ['merino', 'wool', 'sweater', 'casual'],
  },
  {
    name: 'Genuine Leather Belt',
    description: 'Full-grain leather belt with a solid brass buckle. Classic and understated, perfect for any occasion.',
    price: 3200,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#000000' }, { name: 'Brown', hex: '#8B4513' }],
    stock: 60,
    isBestSeller: true,
    rating: 4.4,
    numReviews: 31,
    tags: ['belt', 'leather', 'accessories'],
  },
  {
    name: 'Bomber Jacket',
    description: 'Classic bomber jacket in premium nylon with a ribbed collar, cuffs and hem. A wardrobe essential.',
    price: 11000,
    salePrice: 8500,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Olive', hex: '#808000' }, { name: 'Black', hex: '#000000' }],
    stock: 25,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.7,
    numReviews: 14,
    tags: ['bomber', 'jacket', 'casual', 'outerwear'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    await Product.deleteMany();
    await User.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'GentX Admin',
      email: 'admin@gentx.com',
      password: 'admin123',
      isAdmin: true,
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create sample user
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    // Seed products
    await Product.insertMany(sampleProducts);
    console.log(`📦 ${sampleProducts.length} products seeded`);

    console.log('\n✅ Seed complete!');
    console.log('Admin: admin@gentx.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
