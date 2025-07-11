const TwoBoxResin = require('../models/TwoBoxResin');

exports.createTwoBoxResin = async (req, res) => {
  try {
    const {
      reference, name, price, type, conception, epaisseur,
      hauteurPartieBasse, hauteurPartieHaute, avancee,
      poteaux, tole, option, couleur, ouverture, description,
      longueur, profondeur, pannes, ossatureM
    } = req.body;

    const imageURL = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageURL) {
      return res.status(400).json({ error: 'Image manquante' });
    }

    const newBox = new TwoBoxResin({
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
      description,
      longueur,
      profondeur,
      pannes,
      ossatureM
    });

    await newBox.save();
    res.status(201).json(newBox);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du produit' });
  }
};

exports.getAllTwoBoxResins = async (req, res) => {
  try {
    const boxes = await TwoBoxResin.find();
    res.status(200).json(boxes);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits' });
  }
};

exports.getTwoBoxResinByRef = async (req, res) => {
  try {
    const box = await TwoBoxResin.findOne({ reference: req.params.ref });
    if (!box) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json(box);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du produit' });
  }
};

exports.updateTwoBoxResin = async (req, res) => {
  try {
    const { ref } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.imageURL = `/uploads/${req.file.filename}`;
    }

    const updatedBox = await TwoBoxResin.findOneAndUpdate(
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

exports.deleteTwoBoxResin = async (req, res) => {
  try {
    const { ref } = req.params;
    const deletedBox = await TwoBoxResin.findOneAndDelete({ reference: ref });
    if (!deletedBox) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du produit' });
  }
};

exports.deleteAllTwoBoxResins = async (req, res) => {
  try {
    await TwoBoxResin.deleteMany({});
    res.status(200).json({ message: 'Tous les produits ont été supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression des produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression des produits' });
  }
};