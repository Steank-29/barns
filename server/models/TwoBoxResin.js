const mongoose = require('mongoose');

const twoBoxResinSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  imageURL: { type: String, required: true },
  price: { type: Number, required: true },
  type: String,
  conception: String,
  epaisseur: String,
  hauteurPartieBasse: String,
  hauteurPartieHaute: String,
  avancee: String,
  poteaux: String,
  tole: String,
  option: String,
  couleur: String,
  ouverture: String,
  description: String,
  longueur: String,
  profondeur: String,
  pannes: String,
  ossatureM: String
}, {
  timestamps: true
});

module.exports = mongoose.model('TwoBoxResin', twoBoxResinSchema);