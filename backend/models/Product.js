const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: String,
  priceIncrease: Number
}, { _id: false });

const productSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  height: String,
  width: String,
  thickness: String,
  description: String,
  imageUrl: String, // path local de l'image
  options: [optionSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
