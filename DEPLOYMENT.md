# Deployment Guide

## Railway (Backend)
Root Directory: server
Start Command: node server.js

Environment Variables:
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
FRONTEND_URL=https://your-vercel-app.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=production

## Vercel (Frontend)
Root Directory: gentx/client
Build Command: react-scripts build
Install Command: npm install
Output Directory: build

Environment Variables:
REACT_APP_API_URL=https://your-railway-app.up.railway.app/api
