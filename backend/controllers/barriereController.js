const Barriere = require('../models/Barriere');

// Create a new Barriere
exports.create = async (req, res) => {
  try {
    const { reference, name, price, width, description, imageUrl } = req.body;

    // Vérifier si la référence existe déjà
    const existingBarriere = await Barriere.findOne({ reference });
    if (existingBarriere) {
      return res.status(409).json({ message: "Une barrière avec cette référence existe déjà." });
    }

    const newBarriere = new Barriere({
      reference,
      name,
      price,
      width,
      description,
      imageUrl,
    });

    const savedBarriere = await newBarriere.save();
    res.status(201).json(savedBarriere);
  } catch (error) {
    console.error('Erreur lors de la création de la barrière :', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all Barrieres
exports.getAll = async (req, res) => {
  try {
    const barrieres = await Barriere.find().sort({ createdAt: -1 });
    res.status(200).json(barrieres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Barriere by ID
exports.getById = async (req, res) => {
  try {
    const barriere = await Barriere.findById(req.params.id);
    if (!barriere) {
      return res.status(404).json({ message: 'Barriere not found' });
    }
    res.status(200).json(barriere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Barriere by ID
exports.update = async (req, res) => {
  try {
    const { reference, name, price, height, width, description, imageUrl } = req.body;
    
    const updatedBarriere = await Barriere.findByIdAndUpdate(
      req.params.id,
      {
        reference,
        name,
        price,
        height,
        width,
        description,
        imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBarriere) {
      return res.status(404).json({ message: 'Barriere not found' });
    }
    res.status(200).json(updatedBarriere);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Barriere by ID
exports.delete = async (req, res) => {
  try {
    const deletedBarriere = await Barriere.findByIdAndDelete(req.params.id);
    if (!deletedBarriere) {
      return res.status(404).json({ message: 'Barriere not found' });
    }
    res.status(200).json({ message: 'Barriere deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};