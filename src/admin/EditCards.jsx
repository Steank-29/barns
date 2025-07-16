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
  CircularProgress,
  useMediaQuery,
  useTheme
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
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
    
    if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    
    return imageUrl;
  };

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/facade/getallfacades');
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
      const response = await fetch(`http://localhost:5000/api/facade/deletefacade/${productToDelete.reference}`, {
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
        message: 'Error deleting product',
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
      [name]: name === 'price' || name === 'width' || name === 'height' || name === 'thickness' ? 
        parseFloat(value) : value
    }));
  };

  // Save updated product
  const saveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/facade/updatefacade/${selectedProduct.reference}`, {
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
        message: 'Error updating product',
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
          color: 'rgba(0,0,0,0.5)'
        }}>
          <ImageNotSupportedIcon sx={{ fontSize: isMobile ? 32 : 48 }} />
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
        <CircularProgress size={isMobile ? 40 : 60} sx={{ color: '#38598b' }} />
      </Box>
    );
  }

  return (
    <div style={{ padding: isMobile ? '10px' : '20px' }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom sx={{ 
        textAlign: 'center', 
        color: '#38598b',
        fontWeight: 'bold',
        mb: isMobile ? 2 : 4,
        mt: isMobile ? 1 : 0
      }}>
        Module de Gestion des Façades
      </Typography>

      {/* Search Bar */}
      <Box mb={isMobile ? 2 : 4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products by name or reference..."
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
            backgroundColor: 'white', 
            borderRadius: 2,
          }}
          size={isMobile ? 'small' : 'medium'}
        />
      </Box>

      {/* Products Grid */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: isMobile ? 1 : 3,
      }}>
        <Grid container spacing={isMobile ? 2 : 4} sx={{ 
          maxWidth: 'lg',
          justifyContent: 'center'
        }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id} sx={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Card sx={{
                  width: '100%',
                  maxWidth: isMobile ? 'none' : 350,
                  height: isMobile ? 320 : 400,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  },
                  backgroundColor: '#38598b',
                  color: 'white',
                  borderRadius: 2
                }}>
                  {/* Product Image */}
                  <Box sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: isMobile ? 120 : 180,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}>
                    {renderProductImage(product)}
                  </Box>

                  {/* Product Information */}
                  <CardContent sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: isMobile ? 1.5 : 2
                  }}>
                    <Typography gutterBottom variant={isMobile ? 'subtitle1' : 'h6'} component="div" sx={{ 
                      fontWeight: 600,
                      color: 'white',
                      fontSize: isMobile ? '0.9rem' : '1.1rem'
                    }}>
                      {product.productName}
                    </Typography>

                    {/* Reference and Price */}
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      flexWrap: 'wrap'
                    }}>
                      <Chip 
                        label={`Ref: ${product.reference}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: isMobile ? '0.7rem' : '0.8rem'
                        }}
                      />
                      <Chip 
                        label={`${product.price?.toFixed(2) || '0.00'}€`} 
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          backgroundColor: 'white',
                          color: '#38598b',
                          fontWeight: 'bold',
                          fontSize: isMobile ? '0.8rem' : '0.9rem',
                          height: isMobile ? 24 : 32
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
                        mb: isMobile ? 1 : 2,
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: isMobile ? '0.8rem' : '0.9rem'
                      }}
                    >
                      {product.description}
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mt: 'auto'
                    }}>
                      <Tooltip title="View details">
                        <IconButton 
                          onClick={() => handleView(product)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <ViewIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEdit(product)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDeleteClick(product)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
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
                p: isMobile ? 2 : 4,
                border: '1px dashed',
                borderColor: '#38598b',
                borderRadius: 2,
                backgroundColor: 'rgba(44, 62, 80, 0.1)'
              }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ color: '#38598b' }}>
                  {searchTerm ? 'No products match your search' : 'No products available'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#38598b', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  {searchTerm ? 'Try a different search term' : 'Add products to get started'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* View Product Dialog */}
      <Dialog 
        open={viewMode} 
        onClose={closeDialog} 
        maxWidth="lg" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }
        }}
      >
        {/* Dialog Header with gradient background */}
        <DialogTitle sx={{ 
          p: 0,
          background: 'linear-gradient(135deg, #38598b 0%, #2a4365 100%)',
          color: '#fff'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" px={isMobile ? 2 : 4} py={isMobile ? 1.5 : 2}>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} color="#fff">
              {selectedProduct?.productName || 'Product Details'}
            </Typography>
            <IconButton 
              onClick={closeDialog} 
              sx={{ 
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {selectedProduct && (
            <Box>
              {/* Full-width image section with shadow */}
              <Box sx={{
                width: '100%',
                height: isMobile ? '200px' : isTablet ? '300px' : '400px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                boxShadow: 'inset 0 -10px 20px -10px rgba(0,0,0,0.1)'
              }}>
                {getValidImageUrl(selectedProduct.imageUrl) ? (
                  <CardMedia
                    component="img"
                    image={getValidImageUrl(selectedProduct.imageUrl)}
                    alt={selectedProduct.productName}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.03)'
                      }
                    }}
                  />
                ) : (
                  <Box sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e2e8f0',
                    color: 'rgba(0,0,0,0.5)'
                  }}>
                    <ImageNotSupportedIcon sx={{ fontSize: isMobile ? 48 : 64, mb: 2 }} />
                    <Typography variant="body1">No image available</Typography>
                  </Box>
                )}
              </Box>

              {/* Product details section with modern card layout */}
              <Box sx={{ 
                p: isMobile ? 2 : isTablet ? 3 : 4,
                backgroundColor: '#fff'
              }}>
                <Grid container spacing={isMobile ? 2 : 4}>
                  {/* Product Description Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: isMobile ? 1.5 : 3,
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      <Typography variant={isMobile ? 'subtitle1' : 'h6'} gutterBottom sx={{ 
                        fontWeight: 600,
                        color: '#2d3748',
                        borderBottom: '2px solid #e2e8f0',
                        pb: 1,
                        mb: 2
                      }}>
                        Description De Façade
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7,
                        color: '#4a5568',
                        whiteSpace: 'pre-line',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {selectedProduct.description || 'No description available for this product.'}
                      </Typography>

                      <Typography variant={isMobile ? 'subtitle1' : 'h6'} gutterBottom sx={{ 
                        fontWeight: 600,
                        color: '#2d3748',
                        borderBottom: '2px solid #e2e8f0',
                        pb: 1,
                        mb: 2,
                        mt: isMobile ? 1.5 : 3
                      }}>
                        Specifications
                      </Typography>
                      
                      <Box sx={{ '& > *': { mb: 1.5 } }}>
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Reference:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedProduct.reference}
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Prix:
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 600, 
                            color: '#2c5282',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            {selectedProduct.price?.toFixed(2) || '0.00'}€
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Dimensions:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedProduct.width || 'N/A'}cm (H) × {selectedProduct.height || 'N/A'}cm (L) × {selectedProduct.thickness || 'N/A'}cm (E)
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Type:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedProduct.productName || 'N/A'}
                          </Typography>
                        </Box>


                      </Box>
                      <Box sx={{ '& > *': { mb: 1.5 } }}>
                      <Typography variant={isMobile ? 'subtitle1' : 'h6'} gutterBottom sx={{ 
                        fontWeight: 600,
                        color: '#2d3748',
                        borderBottom: '2px solid #e2e8f0',
                        pb: 1,
                        mb: 2,
                        mt: isMobile ? 1.5 : 3
                      }}>
                        Information 
                      </Typography>
                                              <Box display="flex" sx={{ mt: 2 }}>
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Information:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {new Date().toLocaleString('fr-FR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} - Développé par <strong>Jelassi Sami</strong> - <strong>Golden Box Horse</strong>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog 
        open={editMode} 
        onClose={closeDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        TransitionProps={{
          timeout: { enter: 300, exit: 200 },
          easing: { enter: 'cubic-bezier(0.17, 0.67, 0.24, 1.09)', exit: 'ease-in' }
        }}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '12px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        {/* Enhanced Dialog Header with gradient */}
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #38598b 0%, #2a4365 100%)',
          color: '#fff',
          px: isMobile ? 2 : 3,
          py: isMobile ? 1.5 : 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <EditIcon sx={{ mr: 1.5, fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
              <Typography variant={isMobile ? 'h6' : 'h6'} fontWeight={600} sx={{ letterSpacing: '0.5px' }}>
                Edit Product Details
              </Typography>
            </Box>
            <IconButton 
              onClick={closeDialog} 
              sx={{ 
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                transition: 'all 0.2s ease'
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Dialog Content with improved spacing and styling */}
        <DialogContent dividers sx={{ 
          px: isMobile ? 1 : 3, 
          py: isMobile ? 2 : 3,
          backgroundColor: '#f9fafc'
        }}>
          {selectedProduct && (
            <Grid container spacing={isMobile ? 1 : 3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="productName"
                  value={selectedProduct.productName || ''}
                  onChange={handleFieldChange}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reference"
                  name="reference"
                  value={selectedProduct.reference || ''}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#f0f4f8'
                    }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Type"
                  name="type"
                  value={selectedProduct.type || ''}
                  onChange={handleFieldChange}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (€)"
                  name="price"
                  type="number"
                  value={selectedProduct.price || ''}
                  onChange={handleFieldChange}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    inputProps: { step: "0.01", min: "0" }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Width (cm)"
                  name="width"
                  type="number"
                  value={selectedProduct.width || ''}
                  onChange={handleFieldChange}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    inputProps: { min: "0" }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={selectedProduct.height || ''}
                  onChange={handleFieldChange}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    inputProps: { min: "0" }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Thickness (cm)"
                  name="thickness"
                  type="number"
                  value={selectedProduct.thickness || ''}
                  onChange={handleFieldChange}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    inputProps: { min: "0" }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={selectedProduct.description || ''}
                  onChange={handleFieldChange}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  multiline
                  rows={isMobile ? 3 : 4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        {/* Enhanced Dialog Actions with better button styling */}
        <DialogActions sx={{ 
          px: isMobile ? 1 : 3, 
          py: isMobile ? 1.5 : 2,
          backgroundColor: '#f5f7fa',
          borderTop: '1px solid #e1e5eb'
        }}>
          <Button
            startIcon={<CancelIcon fontSize={isMobile ? 'small' : 'medium'} />}
            onClick={closeDialog}
            color="error"
            variant="outlined"
            sx={{
              px: isMobile ? 1 : 2,
              py: isMobile ? 0.5 : 0.7,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              letterSpacing: '0.5px',
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px'
              },
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}
          >
            Cancel
          </Button>
          <Button
            startIcon={<SaveIcon fontSize={isMobile ? 'small' : 'medium'} />}
            onClick={saveChanges}
            variant="contained"
            sx={{
              px: isMobile ? 2 : 3,
              py: isMobile ? 0.7 : 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              letterSpacing: '0.5px',
              background: 'linear-gradient(135deg, #38598b 0%, #2a4365 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2a4365 0%, #1e365d 100%)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              },
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirm} 
        onClose={() => setDeleteConfirm(false)}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Are you sure you want to delete "{productToDelete?.productName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirm(false)} 
            sx={{
              color: '#38598b', 
              variant: "outlined",
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            sx={{
              backgroundColor: '#d32f2f', 
              color: '#fff', 
              variant: "contained",
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{
            width: '100%',
            fontSize: isMobile ? '0.8rem' : '0.9rem'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditCards;