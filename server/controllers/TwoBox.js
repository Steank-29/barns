const TwoBox = require('../models/TwoBox'); 

exports.createTwoBox = async (req, res) => {
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

    const newBox = new TwoBox({
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
exports.getAllTwoBoxes = async (req, res) => {
  try {
    const boxes = await TwoBox.find();
    res.status(200).json(boxes);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits' });
  }
};
exports.getTwoBoxByRef = async (req, res) => {
  try {
    const box = await TwoBox.findOne({ reference: req.params.ref });
    if (!box) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json(box);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du produit' });
  }
};
exports.updateTwoBox = async (req, res) => {
  try {
    const { ref } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.imageURL = `/uploads/${req.file.filename}`;
    }

    const updatedBox = await TwoBox.findOneAndUpdate(
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
exports.deleteTwoBox = async (req, res) => {
  try {
    const { ref } = req.params;
    const deletedBox = await TwoBox.findOneAndDelete({ reference: ref });
    if (!deletedBox) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du produit' });
  }
};
exports.deleteAllTwoBoxes = async (req, res) => {
  try {
    await TwoBox.deleteMany({});
    res.status(200).json({ message: 'Tous les produits ont été supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression des produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression des produits' });
  }
};
