# Deployment Guide

## Railway (Backend)
Set these environment variables in Railway dashboard:
- MONGO_URI=your_mongodb_atlas_uri
- JWT_SECRET=your_secret_key
- FRONTEND_URL=https://your-vercel-app.vercel.app
- CLOUDINARY_CLOUD_NAME=...
- CLOUDINARY_API_KEY=...
- CLOUDINARY_API_SECRET=...
- NODE_ENV=production

## Vercel (Frontend)
Set these environment variables in Vercel dashboard:
- REACT_APP_API_URL=https://your-railway-app.up.railway.app/api
