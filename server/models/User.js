const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  namecompany: { type: String, required: true },
  date: { type: String, required: true },
  adresse: { type: String, required: true },
  fondateur: { type: String, required: true },
  produit: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Make sure this line is present and correct
const User = mongoose.model('User', userSchema);

// And this export
module.exports = User;