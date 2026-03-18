const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/upload',   uploadRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', brand: 'Gent X API' }));

// ── Error Handling ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Database & Listen ───────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gentx')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Gent X server running on port ${PORT}`));
  })
  .catch((err) => { console.error('❌ DB Error:', err.message); process.exit(1); });

module.exports = app;
