const Product = require('../models/Facade');

const addProduct = async (req, res) => {
  try {
    const {
      reference,
      productName,
      price,
      height,
      width,
      thickness,
      description,
      type
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      reference,
      productName,
      price,
      height,
      width,
      thickness,
      description,
      type,
      imageUrl
    });

    await newProduct.save();

    res.status(201).json({ message: 'Produit créé avec succès', product: newProduct });

  } catch (err) {
    console.error(err);

    // Handle duplicate key error (MongoDB code 11000)
    if (err.code === 11000 && err.keyPattern?.reference) {
      return res.status(400).json({
        message: 'La référence existe déjà. Veuillez en choisir une autre.'
      });
    }

    res.status(500).json({
      message: 'Erreur lors de la création du produit'
    });
  }
};


// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
};

// Get one product by reference
const getProductByRef = async (req, res) => {
  try {
    const product = await Product.findOne({ reference: req.params.ref });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
  }
};

// Update a product by reference
const updateProductByRef = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { reference: req.params.ref },
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit mis à jour', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
  }
};

// Delete one product by reference
const deleteProductByRef = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ reference: req.params.ref });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
};

// Delete all products
const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    res.status(200).json({ message: 'Tous les produits ont été supprimés' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression des produits' });
  }
};

module.exports = {
  addProduct,
  addProduct,
  getAllProducts,
  getProductByRef,
  updateProductByRef,
  deleteProductByRef,
  deleteAllProducts
};