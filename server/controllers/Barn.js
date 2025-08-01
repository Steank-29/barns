const Product = require('../models/Barn');

const addProduct = async (req, res) => {
  try {
    const {
      reference,
      productName,
      price,
      height,
      width,
      description,
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      reference,
      productName,
      price,
      height,
      width,
      description,
      imageUrl
    });

    await newProduct.save();

    res.status(201).json({ message: 'Produit créé avec succès', product: newProduct });

  } catch (err) {
    console.error(err);

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

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
};

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

const updateProductByRef = async (req, res) => {
  try {
    const updateData = req.body;
    
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const updatedBarn = await Product.findOneAndUpdate(
      { reference: req.params.ref },
      updateData,
      { new: true }
    );

    if (!updatedBarn) {
      return res.status(404).json({ message: 'Barn non trouvée' });
    }

    res.status(200).json({ 
      message: 'Barn mise à jour', 
      barn: updatedBarn 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la barn' });
  }
};

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