const mongoose = require('mongoose');

const barriereSchema = new mongoose.Schema({
  reference: { type: String, required: true , unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  width: { type: String, required: true },
  description: { type: String, required: true },
  imageURL: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Barriere', barriereSchema);
