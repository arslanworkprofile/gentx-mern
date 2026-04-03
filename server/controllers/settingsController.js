const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const SiteSettings = require('../models/SiteSettings');
const { bufferToBase64 } = require('../middleware/uploadMiddleware');

// Helper: get or create the singleton settings doc
const getSettings = async () => {
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) {
    settings = await SiteSettings.create({
      key: 'main',
      heroSlides: [
        {
          id: uuidv4(),
          imageUrl: 'https://images.unsplash.com/photo-1490551902236-7231eb14e87c?w=1600&h=1000&fit=crop&q=80',
          heading: 'Dress With Intent.',
          subheading: "Premium menswear for those who understand that style is not what you wear — it's how you carry it.",
          badge: 'New Collection — 2024',
          ctaLabel: 'Shop Collection',
          ctaLink: '/shop',
          ctaLabel2: 'New Arrivals',
          ctaLink2: '/shop?isNewArrival=true',
          active: true,
          order: 0,
        },
      ],
      categories: [
        { id: uuidv4(), label: 'Shirts',      value: 'shirts',      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop', active: true, order: 0 },
        { id: uuidv4(), label: 'Pants',       value: 'pants',       imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop', active: true, order: 1 },
        { id: uuidv4(), label: 'Jackets',     value: 'jackets',     imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop', active: true, order: 2 },
        { id: uuidv4(), label: 'Shoes',       value: 'shoes',       imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=750&fit=crop', active: true, order: 3 },
        { id: uuidv4(), label: 'Accessories', value: 'accessories', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=750&fit=crop', active: true, order: 4 },
        { id: uuidv4(), label: 'Hoodies',     value: 'hoodies',     imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=750&fit=crop', active: true, order: 5 },
        { id: uuidv4(), label: 'Suits',       value: 'suits',       imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=750&fit=crop', active: true, order: 6 },
        { id: uuidv4(), label: 'Casual',      value: 'casual',      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop', active: true, order: 7 },
        { id: uuidv4(), label: 'Formal',      value: 'formal',      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=750&fit=crop', active: true, order: 8 },
      ],
    });
  }
  return settings;
};

// GET /api/settings  (public)
exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  res.json({ success: true, settings });
});

// PUT /api/settings/general  (admin)
exports.updateGeneral = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const { storeName, storeTagline, contactEmail, contactPhone, announcementBar } = req.body;
  if (storeName)    settings.storeName    = storeName;
  if (storeTagline) settings.storeTagline = storeTagline;
  if (contactEmail) settings.contactEmail = contactEmail;
  if (contactPhone) settings.contactPhone = contactPhone;
  if (announcementBar) settings.announcementBar = { ...settings.announcementBar, ...announcementBar };
  await settings.save();
  res.json({ success: true, settings });
});

// ── HERO SLIDES ──────────────────────────────────────────────────────────────

exports.addHeroSlide = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  let imageUrl = req.body.imageUrl || '';

  if (req.file) {
    imageUrl = await bufferToBase64(req.file.buffer, req.file.mimetype);
  }

  if (!imageUrl) { res.status(400); throw new Error('Image is required for a hero slide'); }

  const slide = {
    id:         uuidv4(),
    imageUrl,
    publicId:   '',
    heading:    req.body.heading    || 'Dress With Intent.',
    subheading: req.body.subheading || '',
    badge:      req.body.badge      || '',
    ctaLabel:   req.body.ctaLabel   || 'Shop Collection',
    ctaLink:    req.body.ctaLink    || '/shop',
    ctaLabel2:  req.body.ctaLabel2  || '',
    ctaLink2:   req.body.ctaLink2   || '',
    active:     true,
    order:      settings.heroSlides.length,
  };

  settings.heroSlides.push(slide);
  await settings.save();
  res.status(201).json({ success: true, settings });
});

exports.updateHeroSlide = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const slide = settings.heroSlides.find(s => s.id === req.params.slideId);
  if (!slide) { res.status(404); throw new Error('Slide not found'); }

  const fields = ['heading','subheading','badge','ctaLabel','ctaLink','ctaLabel2','ctaLink2','active','order'];
  fields.forEach(f => { if (req.body[f] !== undefined) slide[f] = req.body[f]; });

  if (req.file) {
    slide.imageUrl = await bufferToBase64(req.file.buffer, req.file.mimetype);
  } else if (req.body.imageUrl) {
    slide.imageUrl = req.body.imageUrl;
  }

  await settings.save();
  res.json({ success: true, settings });
});

exports.deleteHeroSlide = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  settings.heroSlides = settings.heroSlides.filter(s => s.id !== req.params.slideId);
  await settings.save();
  res.json({ success: true, settings });
});

// ── CATEGORIES ───────────────────────────────────────────────────────────────

exports.addCategory = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const { label, value } = req.body;
  if (!label || !value) { res.status(400); throw new Error('Label and value are required'); }

  if (settings.categories.find(c => c.value === value.toLowerCase().trim())) {
    res.status(400); throw new Error(`Category "${value}" already exists`);
  }

  let imageUrl = req.body.imageUrl || '';
  if (req.file) {
    imageUrl = await bufferToBase64(req.file.buffer, req.file.mimetype);
  }

  settings.categories.push({
    id: uuidv4(), label: label.trim(),
    value: value.toLowerCase().trim(),
    imageUrl, publicId: '', active: true,
    order: settings.categories.length,
  });
  await settings.save();
  res.status(201).json({ success: true, settings });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const cat = settings.categories.find(c => c.id === req.params.catId);
  if (!cat) { res.status(404); throw new Error('Category not found'); }

  if (req.body.label)  cat.label  = req.body.label.trim();
  if (req.body.value)  cat.value  = req.body.value.toLowerCase().trim();
  if (req.body.active !== undefined) cat.active = req.body.active === 'true' || req.body.active === true;
  if (req.body.order  !== undefined) cat.order  = Number(req.body.order);

  if (req.file) {
    cat.imageUrl = await bufferToBase64(req.file.buffer, req.file.mimetype);
  } else if (req.body.imageUrl) {
    cat.imageUrl = req.body.imageUrl;
  }

  await settings.save();
  res.json({ success: true, settings });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  settings.categories = settings.categories.filter(c => c.id !== req.params.catId);
  await settings.save();
  res.json({ success: true, settings });
});
