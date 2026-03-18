const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: [true, 'Name required'], trim: true },
  email:     { type: String, required: [true, 'Email required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password:  { type: String, required: [true, 'Password required'], minlength: 6, select: false },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:    { type: String, default: '' },
  phone:     { type: String, default: '' },
  address: {
    street: String, city: String,
    state: String, zipCode: String, country: String,
  },
  isBlocked: { type: Boolean, default: false },
  wishlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
