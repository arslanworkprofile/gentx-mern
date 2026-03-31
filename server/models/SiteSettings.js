const mongoose = require('mongoose');

// Singleton settings document — only one record exists (key: 'main')
const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },

  // Hero slides
  heroSlides: [
    {
      id:          { type: String },
      imageUrl:    { type: String, required: true },
      publicId:    { type: String, default: '' },
      heading:     { type: String, default: 'Dress With Intent.' },
      subheading:  { type: String, default: '' },
      badge:       { type: String, default: 'New Collection — 2024' },
      ctaLabel:    { type: String, default: 'Shop Collection' },
      ctaLink:     { type: String, default: '/shop' },
      ctaLabel2:   { type: String, default: 'New Arrivals' },
      ctaLink2:    { type: String, default: '/shop?isNewArrival=true' },
      active:      { type: Boolean, default: true },
      order:       { type: Number, default: 0 },
    },
  ],

  // Categories (used in shop filters + homepage grid)
  categories: [
    {
      id:       { type: String },
      label:    { type: String, required: true },   // display name e.g. "Shirts"
      value:    { type: String, required: true },   // slug e.g. "shirts"
      imageUrl: { type: String, default: '' },
      publicId: { type: String, default: '' },
      active:   { type: Boolean, default: true },
      order:    { type: Number, default: 0 },
    },
  ],

  // Announcement bar
  announcementBar: {
    text:    { type: String, default: 'Free Shipping on Orders Over $150 · Est. Delivery 3–5 Days' },
    active:  { type: Boolean, default: true },
    bgColor: { type: String, default: '#000000' },
    textColor:{ type: String, default: '#ffffff' },
  },

  // Contact info
  contactEmail: { type: String, default: 'arslan.workprofile@gmail.com' },
  contactPhone: { type: String, default: '+923348544492' },

  // Store info
  storeName:    { type: String, default: 'Gent X' },
  storeTagline: { type: String, default: 'Premium Fashion for the Modern Gentleman' },

}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
