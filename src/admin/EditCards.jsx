import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Box,
  Tooltip,
  InputAdornment,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Check as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  ImageNotSupported as ImageNotSupportedIcon
} from '@mui/icons-material';

const EditCards = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

    const apiUrl = process.env.RENDER_API_URL || 'https://barns.onrender.com';

  // Handle image load states
  const handleImageLoad = (productId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [productId]: 'loaded'
    }));
  };

  const handleImageError = (productId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [productId]: 'error'
    }));
  };

  const handleImageLoadStart = (productId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [productId]: 'loading'
    }));
  };

  // Function to validate and fix image URLs
  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's a relative path, prepend the base URL
    if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return `${apiUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    
    return imageUrl;
  };

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/products/getallfacades`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load products: ' + error.message,
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.reference && product.reference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Handle view product details
  const handleView = (product) => {
    setSelectedProduct(product);
    setViewMode(true);
  };

  // Handle edit product
  const handleEdit = (product) => {
    setSelectedProduct({ ...product });
    setEditMode(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/products/deletefacade/${productToDelete.reference}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedProducts = products.filter(p => p._id !== productToDelete._id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setSnackbar({
          open: true,
          message: 'Product deleted successfully',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete product',
        severity: 'error'
      });
    } finally {
      setDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  // Handle form field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  // Save updated product
  const saveChanges = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/products/updatefacade/${selectedProduct.reference}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedProduct)
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        const updatedProducts = products.map(p => p._id === updatedProduct._id ? updatedProduct : p);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setSnackbar({
          open: true,
          message: 'Product updated successfully',
          severity: 'success'
        });
        setEditMode(false);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update product',
        severity: 'error'
      });
    }
  };

  // Close all dialogs
  const closeDialog = () => {
    setViewMode(false);
    setEditMode(false);
    setSelectedProduct(null);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Render image with loading states
  const renderProductImage = (product) => {
    const imageUrl = getValidImageUrl(product.imageUrl);
    const loadState = imageLoadStates[product._id];

    if (!imageUrl) {
      return (
        <Box sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.1)',
          color: 'rgba(242, 237, 215, 0.5)'
        }}>
          <ImageNotSupportedIcon sx={{ fontSize: 48 }} />
        </Box>
      );
    }

    return (
      <>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={product.productName}
            onLoad={() => handleImageLoad(product._id)}
            onError={() => handleImageError(product._id)}
            onLoadStart={() => handleImageLoadStart(product._id)}
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s',
              '&:hover': {
                transform: 'scale(1.05)'
              },
              opacity: loadState === 'loading' ? 0.5 : 1
            }}
          />
        
      </>
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress size={60} sx={{ color: '#755139' }} />
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ 
        textAlign: 'center', textTransform: 'uppercase', 
        color: '#755139',
      }}>
        Gestion des Façades
      </Typography>

      {/* Search Bar */}
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher parmi les façades par nom ou référence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            backgroundColor: '#F2EDD7', 
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Products Grid */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: 3,
      }}>
        <Grid container spacing={4} sx={{ 
          maxWidth: 'lg',
          justifyContent: 'center'
        }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id} sx={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Card sx={{
                  width: '100%',
                  maxWidth: 350,
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  },
                  backgroundColor: '#755139',
                  color: '#F2EDD7',
                  borderRadius: 2
                }}>
                  {/* Image du produit */}
                  <Box sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: 180,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}>
                    {renderProductImage(product)}
                  </Box>

                  {/* Informations du produit */}
                  <CardContent sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ 
                      fontWeight: 600,
                      color: '#F2EDD7'
                    }}>
                      {product.productName}
                    </Typography>

                    {/* Référence et Prix sur la même ligne */}
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      flexWrap: 'wrap'
                    }}>
                      <Chip 
                        label={`Réf: ${product.reference}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(242, 237, 215, 0.2)',
                          color: '#F2EDD7'
                        }}
                      />
                      <Chip 
                        label={`${product.price?.toFixed(2) || '0.00'}€`} 
                        size="medium"
                        sx={{
                          backgroundColor: '#F2EDD7',
                          color: '#755139',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          height: 32
                        }}
                      />
                    </Box>

                    <Typography 
                      variant="body2"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flexGrow: 1,
                        mb: 2,
                        color: 'rgba(242, 237, 215, 0.8)'
                      }}
                    >
                      {product.description}
                    </Typography>

                    {/* Boutons d'action */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mt: 'auto'
                    }}>
                      <Tooltip title="Voir détails">
                        <IconButton 
                          onClick={() => handleView(product)}
                          sx={{ color: '#F2EDD7' }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          onClick={() => handleEdit(product)}
                          sx={{ color: '#F2EDD7' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          onClick={() => handleDeleteClick(product)}
                          sx={{ color: '#F2EDD7' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ 
                textAlign: 'center',
                p: 4,
                border: '1px dashed',
                borderColor: '#755139',
                borderRadius: 2,
                backgroundColor: 'rgba(117, 81, 57, 0.1)'
              }}>
                <Typography variant="h6" sx={{ color: '#755139' }}>
                  {searchTerm ? 'Aucun produit ne correspond à votre recherche' : 'Aucun produit disponible'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#755139' }}>
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Ajoutez des produits pour commencer'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* View Product Dialog */}
      <Dialog open={viewMode} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Product Details</Typography>
            <IconButton onClick={closeDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {getValidImageUrl(selectedProduct.imageUrl) ? (
                  <CardMedia
                    component="img"
                    height="300"
                    image={getValidImageUrl(selectedProduct.imageUrl)}
                    alt={selectedProduct.productName}
                    style={{ objectFit: 'contain', alignItems: 'center', justifyContent: 'center' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <Box sx={{
                  height: 300,
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  border: '1px dashed #ccc'
                }}>
                  <Typography variant="body2" color="textSecondary">
                    No image available
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  {selectedProduct.productName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Reference: {selectedProduct.reference}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Price: {selectedProduct.price?.toFixed(2) || '0.00'}€
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Dimensions: {selectedProduct.height || 'N/A'}cm (H) × {selectedProduct.width || 'N/A'}cm (W) × {selectedProduct.thickness || 'N/A'}cm (D)
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Description: {selectedProduct.description || 'No description available'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Options: {selectedProduct.options?.join(', ') || 'No options available'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editMode} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Product</Typography>
            <IconButton onClick={closeDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="productName"
                  value={selectedProduct.productName || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reference"
                  name="reference"
                  value={selectedProduct.reference || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={selectedProduct.price || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={selectedProduct.height || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Width (cm)"
                  name="width"
                  type="number"
                  value={selectedProduct.width || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Thickness (cm)"
                  name="thickness"
                  type="number"
                  value={selectedProduct.thickness || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={selectedProduct.imageUrl || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={selectedProduct.description || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Options (comma separated)"
                  name="options"
                  value={selectedProduct.options?.join(', ') || ''}
                  onChange={(e) => {
                    const options = e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt);
                    setSelectedProduct(prev => ({ ...prev, options }));
                  }}
                  margin="normal"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CancelIcon />} onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button startIcon={<SaveIcon />} onClick={saveChanges} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{productToDelete?.productName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditCards;