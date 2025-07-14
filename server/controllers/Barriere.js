const Barriere = require('../models/Barriere');

const addBarriere = async (req, res) => {
  try {
    const {
      reference,
      name,
      price,
      width,
      description
    } = req.body;

    const imageURL = req.file ? `/uploads/${req.file.filename}` : '';    

    const newBarriere = new Barriere({
      reference,
      name,
      price,
      width,
      description,
      imageURL
    });

    await newBarriere.save();

    res.status(201).json({ message: 'Barrière créée avec succès', barriere: newBarriere });

  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.keyPattern?.reference) {
      return res.status(400).json({
        message: 'La référence existe déjà. Veuillez en choisir une autre.'
      });
    }
    res.status(500).json({ message: 'Erreur lors de la création de la barrière' });
  }
};

const getAllBarrieres = async (req, res) => {
  try {
    const barrieres = await Barriere.find();
    res.status(200).json(barrieres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des barrières' });
  }
};

const getBarriereByRef = async (req, res) => {
  try {
    const barriere = await Barriere.findOne({ reference: req.params.ref });
    if (!barriere) {
      return res.status(404).json({ message: 'Barrière non trouvée' });
    }
    res.status(200).json(barriere);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération de la barrière' });
  }
};

const updateBarriereByRef = async (req, res) => {
  try {
    const updatedBarriere = await Barriere.findOneAndUpdate(
      { reference: req.params.ref },
      req.body,
      { new: true }
    );
    if (!updatedBarriere) {
      return res.status(404).json({ message: 'Barrière non trouvée' });
    }
    res.status(200).json({ message: 'Barrière mise à jour', barriere: updatedBarriere });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la barrière' });
  }
};

const deleteBarriereByRef = async (req, res) => {
  try {
    const deletedBarriere = await Barriere.findOneAndDelete({ reference: req.params.ref });
    if (!deletedBarriere) {
      return res.status(404).json({ message: 'Barrière non trouvée' });
    }
    res.status(200).json({ message: 'Barrière supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression de la barrière' });
  }
};

const deleteAllBarrieres = async (req, res) => {
  try {
    await Barriere.deleteMany();
    res.status(200).json({ message: 'Toutes les barrières ont été supprimées' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression des barrières' });
  }
};

module.exports = {
  addBarriere,
  getAllBarrieres,
  getBarriereByRef,
  updateBarriereByRef,
  deleteBarriereByRef,
  deleteAllBarrieres
};
