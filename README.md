# Gent X — Full-Stack MERN E-Commerce

> Premium fashion e-commerce for the modern gentleman. Built with MongoDB, Express.js, React.js, Node.js.

---

## 🗂 Project Structure

```
gentx/
├── server/                    # Node.js + Express backend
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Auth, error, upload
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API endpoints
│   ├── utils/                 # Token generator, seeder
│   ├── uploads/               # Local image storage (auto-created)
│   ├── server.js              # Entry point
│   └── .env.example           # Environment variables template
│
└── client/                    # React frontend
    ├── public/                # Static assets
    └── src/
        ├── components/
        │   ├── common/        # Shared UI (Spinner, Pagination, etc.)
        │   ├── layout/        # Navbar, Footer, AdminLayout
        │   └── shop/          # ProductCard
        ├── pages/
        │   ├── admin/         # Dashboard, Products, Orders, Users
        │   └── user/          # Dashboard, Orders, Profile
        ├── store/
        │   └── slices/        # Redux Toolkit slices
        ├── styles/            # Global CSS + Tailwind
        └── utils/             # Axios instance
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone & install dependencies

```bash
# Backend
cd gentx/server
npm install

# Frontend
cd ../client
npm install
```

---

### 2. Configure environment variables

```bash
cd gentx/server
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gentx     # or MongoDB Atlas URI
JWT_SECRET=gentx_super_secret_key_change_me
JWT_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional – Cloudinary (for cloud image hosting)
USE_CLOUDINARY=false
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

### 3. Seed the database

```bash
cd gentx/server
node utils/seeder.js
```

Output:
```
✅ Gent X database seeded!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 Admin  → admin@gentx.com  / admin123
👤 User 1 → alex@example.com / user123
👤 User 2 → james@example.com / user123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 4. Start the servers

**Terminal 1 – Backend:**
```bash
cd gentx/server
npm run dev      # starts on http://localhost:5000
```

**Terminal 2 – Frontend:**
```bash
cd gentx/client
npm start        # starts on http://localhost:3000
```

---

## 🔐 Test Credentials

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@gentx.com      | admin123   |
| User  | alex@example.com     | user123    |
| User  | james@example.com    | user123    |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint        | Auth | Description       |
|--------|-----------------|------|-------------------|
| POST   | /auth/register  | —    | Register user     |
| POST   | /auth/login     | —    | Login             |
| GET    | /auth/me        | ✓    | Get profile       |
| PUT    | /auth/profile   | ✓    | Update profile    |

### Products
| Method | Endpoint                  | Auth    | Description         |
|--------|---------------------------|---------|---------------------|
| GET    | /products                 | —       | List (filters/sort) |
| GET    | /products/:id             | —       | Single product      |
| GET    | /products/admin/all       | Admin   | Admin product list  |
| POST   | /products                 | Admin   | Create product      |
| PUT    | /products/:id             | Admin   | Update product      |
| DELETE | /products/:id             | Admin   | Delete product      |
| POST   | /products/:id/reviews     | User    | Add review          |
| PATCH  | /products/:id/toggle      | Admin   | Toggle visibility   |

### Orders
| Method | Endpoint            | Auth  | Description       |
|--------|---------------------|-------|-------------------|
| POST   | /orders             | User  | Create order      |
| GET    | /orders/myorders    | User  | My orders         |
| GET    | /orders/:id         | User  | Order detail      |
| PUT    | /orders/:id/pay     | User  | Simulate payment  |
| GET    | /orders             | Admin | All orders        |
| PUT    | /orders/:id/status  | Admin | Update status     |
| DELETE | /orders/:id         | Admin | Delete order      |
| GET    | /orders/stats       | Admin | Dashboard stats   |

### Users (Admin)
| Method | Endpoint            | Auth  | Description       |
|--------|---------------------|-------|-------------------|
| GET    | /users              | Admin | All users         |
| GET    | /users/:id          | Admin | User detail       |
| DELETE | /users/:id          | Admin | Delete user       |
| PATCH  | /users/:id/block    | Admin | Toggle block      |
| GET    | /users/stats        | Admin | User stats        |

### Query Parameters – GET /products
| Param    | Example              | Description          |
|----------|----------------------|----------------------|
| search   | `?search=shirt`      | Full-text search     |
| category | `?category=jackets`  | Filter by category   |
| color    | `?color=Black`       | Filter by color      |
| size     | `?size=M`            | Filter by size       |
| minPrice | `?minPrice=50`       | Min price            |
| maxPrice | `?maxPrice=200`      | Max price            |
| sort     | `?sort=price_asc`    | Sort order           |
| featured | `?featured=true`     | Featured only        |
| isNew    | `?isNew=true`        | New arrivals         |
| page     | `?page=2`            | Pagination           |
| limit    | `?limit=12`          | Per page (default 12)|

Sort values: `newest`, `popular`, `rating`, `price_asc`, `price_desc`

---

## 🎨 Frontend Pages

| Route                   | Page                  | Access    |
|-------------------------|-----------------------|-----------|
| /                       | Home (Hero + Featured)| Public    |
| /shop                   | Product listing       | Public    |
| /product/:id            | Product detail        | Public    |
| /cart                   | Cart                  | Public    |
| /checkout               | Checkout (3-step)     | User      |
| /order-success/:id      | Order confirmation    | User      |
| /login                  | Sign in               | Guest     |
| /register               | Register              | Guest     |
| /dashboard              | User dashboard        | User      |
| /orders                 | Order history         | User      |
| /orders/:id             | Order detail          | User      |
| /profile                | Edit profile          | User      |
| /admin                  | Admin dashboard       | Admin     |
| /admin/products         | Product management    | Admin     |
| /admin/products/new     | Add product           | Admin     |
| /admin/products/edit/:id| Edit product          | Admin     |
| /admin/orders           | Order management      | Admin     |
| /admin/orders/:id       | Order detail/update   | Admin     |
| /admin/users            | User management       | Admin     |

---

## ☁️ Cloudinary Setup (optional)

For cloud image storage instead of local `/uploads`:

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Update `.env`:
   ```env
   USE_CLOUDINARY=true
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

---

## 🚀 Deployment

### Backend → Render.com
1. Push `server/` to GitHub repo
2. Create new Web Service on Render
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add all environment variables from `.env`

### Frontend → Vercel / Netlify
1. Push `client/` to GitHub repo
2. Create new project on Vercel
3. Set `REACT_APP_API_URL=https://your-render-url.com/api`
4. Deploy

### MongoDB → Atlas
1. Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user
3. Whitelist `0.0.0.0/0` for Render
4. Copy connection string → update `MONGO_URI` in Render env vars

---

## 🔧 Customization

### Add a new category
1. `server/models/Product.js` → add to `enum` array
2. `client/src/pages/ShopPage.js` → add to `CATEGORIES` array

### Change brand colors
Edit `client/src/styles/index.css` and `client/tailwind.config.js`:
```js
accent: '#c9a96e',        // gold accent – change to your brand color
'accent-dark': '#a07c45',
```

### Add payment gateway (Stripe)
1. Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
2. Replace the dummy `payOrder` endpoint with Stripe webhook handler
3. Update `CheckoutPage.js` to use `<CardElement />`

---

## 📦 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Redux Toolkit, React Router 6 |
| Styling   | Tailwind CSS, Playfair Display font     |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB, Mongoose                       |
| Auth      | JWT, bcryptjs                           |
| Images    | Multer (local) / Cloudinary (cloud)     |
| Toast     | react-hot-toast                         |

---

*Built for Gent X — Premium Fashion for the Modern Gentleman*
