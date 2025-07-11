const ThreeBox = require('../models/ThreeBox');

exports.createThreeBox = async (req, res) => {
  try {
    const {
      reference, name, price, type, conception, epaisseur,
      hauteurPartieBasse, hauteurPartieHaute, avancee,
      poteaux, tole, option, couleur, ouverture, description
    } = req.body;

    const imageURL = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageURL) {
      return res.status(400).json({ error: 'Image manquante' });
    }

    const newBox = new ThreeBox({
      reference,
      name,
      price,
      imageURL,
      type,
      conception,
      epaisseur,
      hauteurPartieBasse,
      hauteurPartieHaute,
      avancee,
      poteaux,
      tole,
      option,
      couleur,
      ouverture,
      description
    });

    await newBox.save();
    res.status(201).json(newBox);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du produit' });
  }
};
exports.getAllThreeBoxes = async (req, res) => {
  try {
    const boxes = await ThreeBox.find();
    res.status(200).json(boxes);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits' });
  }
};
exports.getThreeBoxByRef = async (req, res) => {
  try {
    const box = await ThreeBox.findOne({ reference: req.params.ref });
    if (!box) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json(box);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du produit' });
  }
};
exports.updateThreeBox = async (req, res) => {
  try {
    const { ref } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.imageURL = `/uploads/${req.file.filename}`;
    }

    const updatedBox = await ThreeBox.findOneAndUpdate(
      { reference: ref },
      updateData,
      { new: true }
    );

    if (!updatedBox) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.status(200).json(updatedBox);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du produit' });
  }
};
exports.deleteThreeBox = async (req, res) => {
  try {
    const { ref } = req.params;
    const deletedBox = await ThreeBox.findOneAndDelete({ reference: ref });
    if (!deletedBox) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du produit' });
  }
};
exports.deleteAllThreeBoxes = async (req, res) => {
  try {
    await ThreeBox.deleteMany({});
    res.status(200).json({ message: 'Tous les produits ont été supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression des produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression des produits' });
  }
};
