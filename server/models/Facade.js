const mongoose = require('mongoose');

const FacadeSchema = new mongoose.Schema({
  reference: { type: String, required: true , unique: true },
  productName: { type: String, required: true },
  type: { type: String }, 
  price: { type: Number, required: true },
  height: String,
  width: String,
  thickness: String,
  description: String,
  imageUrl: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Facade', FacadeSchema);
