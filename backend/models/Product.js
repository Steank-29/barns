const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  reference: { type: String, required: true , unique: true },
  productName: { type: String, required: true },
  type: { type: String }, // Added to match your frontend
  price: { type: Number, required: true },
  height: String,
  width: String,
  thickness: String,
  description: String,
  imageUrl: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
