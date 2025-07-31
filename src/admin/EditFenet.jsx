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
  ImageNotSupported as ImageNotSupportedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon
} from '@mui/icons-material';

const EditFenet = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState({
    imageFile: null,
    imagePreview: null
  });
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const productFields = [
    ['Nom du Produit', 'productName'],
    ['Référence', 'reference', true],
    ['Prix (€)', 'price', false, 'number'],
    ['Largeur (cm)', 'width', false, 'number'],
    ['Hauteur (cm)', 'height', false, 'number'],
  ];

  const handleImageLoad = (productId) => {
    setImageLoadStates(prev => ({ ...prev, [productId]: 'loaded' }));
  };

  const handleImageError = (productId) => {
    setImageLoadStates(prev => ({ ...prev, [productId]: 'error' }));
  };

  const handleImageLoadStart = (productId) => {
    setImageLoadStates(prev => ({ ...prev, [productId]: 'loading' }));
  };

  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    return imageUrl;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProduct(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedProduct.productName?.trim()) newErrors.productName = 'Required';
    if (!selectedProduct.price || isNaN(selectedProduct.price)) newErrors.price = 'Invalid price';
    if (!selectedProduct.width || isNaN(selectedProduct.width)) newErrors.width = 'Invalid width';
    if (!selectedProduct.height || isNaN(selectedProduct.height)) newErrors.height = 'Invalid height';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fenet/getallfenets');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewMode(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct({ 
      ...product,
      imageFile: null,
      imagePreview: null
    });
    setEditMode(true);
    setErrors({});
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/fenet/deletefenet/${productToDelete.reference}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedProducts = products.filter(p => p._id !== productToDelete._id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setSnackbar({
          open: true,
          message: 'Produit supprimé avec succès',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du produit',
        severity: 'error'
      });
    } finally {
      setDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'width' || name === 'height' || name === 'thickness' ? 
        parseFloat(value) || 0 : value
    }));
  };

  const saveChanges = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      Object.keys(selectedProduct).forEach(key => {
        if (key !== 'imageFile' && key !== 'imagePreview' && selectedProduct[key] !== null) {
          formData.append(key, selectedProduct[key]);
        }
      });
      
      if (selectedProduct.imageFile) {
        formData.append('image', selectedProduct.imageFile);
      }

      const response = await fetch(`http://localhost:5000/api/fenet/updatefenet/${selectedProduct.reference}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        const updatedProducts = products.map(p => p._id === updatedProduct._id ? updatedProduct : p);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setSnackbar({
          open: true,
          message: 'Produit mis à jour avec succès',
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
        message: 'Erreur lors de la mise à jour du produit',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const closeDialog = () => {
    setViewMode(false);
    setEditMode(false);
    setSelectedProduct(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
          '&:hover': { transform: 'scale(1.05)' },
          opacity: loadState === 'loading' ? 0.5 : 1
        }}
      />
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
        Gestion des Fenêtres – Solutions Intelligentes
      </Typography>

      <Box mb={isMobile ? 2 : 4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher des fenêtres par nom ou référence..."
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

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: isMobile ? 1 : 3,
      }}>
        <Grid container spacing={isMobile ? 2 : 1} sx={{ 
          maxWidth: 'lg',
          justifyContent: 'center'
        }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
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
                  <Box sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: isMobile ? 120 : 180,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}>
                    {renderProductImage(product)}
                  </Box>

                  <CardContent sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: isMobile ? 1.5 : 2
                  }}>
                    <Typography gutterBottom variant={isMobile ? 'subtitle1' : 'h6'} sx={{ 
                      fontWeight: 600,
                      color: 'white',
                      fontSize: isMobile ? '0.9rem' : '1.1rem'
                    }}>
                      {product.productName}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
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

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                      <Tooltip title="Voir détails">
                        <IconButton onClick={() => handleView(product)} sx={{ color: 'white' }}>
                          <ViewIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton onClick={() => handleEdit(product)} sx={{ color: 'white' }}>
                          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton onClick={() => handleDeleteClick(product)} sx={{ color: 'white' }}>
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
                backgroundColor: 'rgba(56, 89, 139, 0.1)'
              }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ color: '#38598b' }}>
                  {searchTerm ? 'Aucune fenêtre ne correspond à votre recherche' : 'Aucune fenêtre disponible'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#38598b' }}>
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Ajoutez des fenêtres pour commencer'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

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
        <DialogTitle sx={{ 
          p: 0,
          background: 'linear-gradient(135deg, #38598b 0%, #2a4365 100%)',
          color: '#fff'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" px={isMobile ? 2 : 4} py={isMobile ? 1.5 : 2}>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} color="#fff">
              {selectedProduct?.productName || 'Détails de la Fenêtre'}
            </Typography>
            <IconButton onClick={closeDialog} sx={{ color: '#fff' }}>
              <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {selectedProduct && (
            <Box>
              <Box sx={{
                width: '100%',
                height: isMobile ? '200px' : isTablet ? '300px' : '400px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#f8fafc'
              }}>
                {getValidImageUrl(selectedProduct.imageUrl) ? (
                  <CardMedia
                    component="img"
                    image={getValidImageUrl(selectedProduct.imageUrl)}
                    alt={selectedProduct.productName}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
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
                    <Typography variant="body1">Pas d'image disponible</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ p: isMobile ? 2 : isTablet ? 3 : 4, backgroundColor: '#fff' }}>
                <Grid container spacing={isMobile ? 2 : 4}>
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
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7,
                        color: '#4a5568',
                        whiteSpace: 'pre-line'
                      }}>
                        {selectedProduct.description || 'Aucune description disponible.'}
                      </Typography>
                    </Box>
                  </Grid>

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
                        Spécifications Techniques
                      </Typography>
                      
                      <Box sx={{ '& > *': { mb: 1.5 } }}>
                        {productFields.map(([label, name]) => (
                          <Box key={name} display="flex">
                            <Typography variant="body1" sx={{ 
                              minWidth: isMobile ? '80px' : '120px', 
                              fontWeight: 500, 
                              color: '#4a5568'
                            }}>
                              {label}:
                            </Typography>
                            <Typography variant="body1">
                              {name === 'price' ? 
                                `${selectedProduct[name]?.toFixed(2) || '0.00'}€` : 
                                selectedProduct[name] || 'N/A'
                              }
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={editMode}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        TransitionProps={{
          timeout: { enter: 300, exit: 200 },
          easing: { 
            enter: 'cubic-bezier(0.17, 0.67, 0.24, 1.09)', 
            exit: 'ease-in' 
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            background: '#f5f7fa',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `
              linear-gradient(135deg, #38598b 0%, #3f7acc 100%),
              repeating-linear-gradient(
                45deg,
                rgba(255,255,255,0.05) 0px,
                rgba(255,255,255,0.05) 2px,
                transparent 2px,
                transparent 4px
              )
            `,
            color: '#fff',
            px: isMobile ? 2 : 3,
            py: isMobile ? 1.5 : 2,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3f7acc, #5fdde5)',
            }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <EditIcon sx={{ 
                mr: 1.5, 
                fontSize: isMobile ? 20 : 26,
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))'
              }} />
              <Typography
                variant={isMobile ? 'h6' : 'h6'}
                fontWeight={600}
                sx={{ 
                  letterSpacing: 0.5,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                Modifier la Fenêtre
              </Typography>
            </Box>
            <IconButton
              onClick={closeDialog}
              sx={{
                color: '#fff',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transform: 'rotate(90deg)'
                },
              }}
              size={isMobile ? 'small' : 'medium'}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: isMobile ? 3 : 4,
            py: isMobile ? 3 : 4,
            backgroundColor: '#f5f7fa',
          }}
        >
          {selectedProduct && (
            <Grid container spacing={isMobile ? 3 : 4}>
              {productFields.map(([label, name, disabled = false, type = 'text'], idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    type={type}
                    value={selectedProduct[name] || ''}
                    onChange={handleFieldChange}
                    variant="filled"
                    size={isMobile ? 'small' : 'medium'}
                    disabled={disabled}
                    error={!!errors[name]}
                    helperText={errors[name]}
                    InputProps={{
                      disableUnderline: true,
                      ...(name === 'price' ? {
                        startAdornment: (
                          <InputAdornment position="start">€</InputAdornment>
                        ),
                        inputProps: { step: '0.01', min: '0' },
                      } : {}),
                      ...(['width', 'height', 'thickness'].includes(name) ? {
                        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        inputProps: { min: '0' }
                      } : {}),
                      sx: {
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 2px #3f7acc'
                        }
                      }
                    }}
                    InputLabelProps={{ 
                      shrink: true,
                      sx: {
                        fontWeight: 500,
                        color: '#64748b',
                        transform: 'translate(12px, 10px) scale(0.9)'
                      }
                    }}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row', 
                  gap: 3,
                  alignItems: 'center'
                }}>
                  {selectedProduct.imageUrl && (
                    <Box sx={{
                      width: 220,
                      height: 180,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      <img 
                        src={getValidImageUrl(selectedProduct.imageUrl)} 
                        alt="Window preview" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)'
                          }
                        }}
                        size="small"
                        onClick={() => window.open(getValidImageUrl(selectedProduct.imageUrl), '_blank')}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  <Box sx={{ width: '100%' }}>
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      sx={{
                        backgroundColor: '#3f7acc',
                        color: 'white',
                        textTransform: 'none',
                        py: 1.5,
                        mb: 2,
                        '&:hover': {
                          backgroundColor: '#38598b'
                        }
                      }}
                    >
                      {selectedProduct.imageUrl ? "Changer l'image" : "Ajouter une image"}
                      <input
                        type="file"
                        hidden
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    {selectedProduct.imageUrl && (
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        sx={{
                          textTransform: 'none',
                          py: 1.5
                        }}
                        onClick={() => {
                          setSelectedProduct(prev => ({
                            ...prev,
                            imageUrl: null,
                            imageFile: null,
                            imagePreview: null
                          }));
                        }}
                      >
                        Supprimer l'image
                      </Button>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={isMobile ? 4 : 6}
                  value={selectedProduct.description || ''}
                  onChange={handleFieldChange}
                  variant="filled"
                  size={isMobile ? 'small' : 'medium'}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      padding: '16px',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px #3f7acc'
                      }
                    }
                  }}
                  InputLabelProps={{ 
                    shrink: true,
                    sx: {
                      fontWeight: 500,
                      color: '#64748b',
                      transform: 'translate(12px, 10px) scale(0.9)'
                    }
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: isMobile ? 2 : 3,
            py: 2,
            backgroundColor: '#f5f7fa',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Button
            onClick={closeDialog}
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '8px',
              borderWidth: '2px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              color: '#ef4444',
              borderColor: '#ef4444',
              '&:hover': {
                borderWidth: '2px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)'
              }
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={saveChanges}
            variant="contained"
            color="primary"
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={isSaving}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '8px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              background: 'linear-gradient(135deg, #3f7acc 0%, #5fdde5 100%)',
              boxShadow: '0 2px 4px rgba(63, 122, 204, 0.3)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(63, 122, 204, 0.4)',
                background: 'linear-gradient(135deg, #3a6fb7 0%, #4fc8d1 100%)'
              },
              '&.Mui-disabled': {
                background: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          fontWeight: 600,
          borderBottom: '1px solid #fee2e2',
          py: 2,
          px: 3
        }}>
          <Box display="flex" alignItems="center">
            <DeleteIcon sx={{ mr: 1.5, color: '#dc2626' }} />
            Confirmer la suppression
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Typography variant="body1" sx={{ color: '#4b5563' }}>
            Êtes-vous sûr de vouloir supprimer la fenêtre "{productToDelete?.productName}" ?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#6b7280', fontSize: '0.875rem' }}>
            Cette action est irréversible et supprimera définitivement le produit.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          backgroundColor: '#f9fafc',
          borderTop: '1px solid #e2e8f0'
        }}>
          <Button
            onClick={() => setDeleteConfirm(false)}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              color: '#4b5563',
              borderColor: '#d1d5db',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                borderColor: '#9ca3af'
              }
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#b91c1c'
              }
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            alignItems: 'center'
          }}
        >{snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditFenet;