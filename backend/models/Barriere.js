const mongoose = require('mongoose');

const barriereSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  width: String,
  description: String,
  imageUrl: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Barriere', barriereSchema);