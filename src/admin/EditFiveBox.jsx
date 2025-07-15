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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const EditFiveBox = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [threeBoxes, setThreeBoxes] = useState([]);
  const [filteredThreeBoxes, setFilteredThreeBoxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
const [selectedThreeBox, setSelectedThreeBox] = useState({
  
  imageFile: null,
  imagePreview: null
});
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [threeBoxToDelete, setThreeBoxToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle image load states
  const handleImageLoad = (threeBoxId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [threeBoxId]: 'loaded'
    }));
  };


  const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: '#fff',
  },
};

const buttonStyles = (variant) => ({
  borderRadius: 2,
  textTransform: 'none',
  fontWeight: 600,
  px: 3,
  py: 1,
  ...(variant === 'contained' && {
    backgroundColor: '#38598b',
    '&:hover': { backgroundColor: '#2c5282' },
  }),
  ...(variant === 'outlined' && {
    '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.04)' },
  }),
});


  const handleImageError = (threeBoxId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [threeBoxId]: 'error'
    }));
  };

  const handleImageLoadStart = (threeBoxId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [threeBoxId]: 'loading'
    }));
  };

  // Function to validate and fix image URLs
  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return `https://barns-backend.onrender.com${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    
    return imageUrl;
  };

  // Fetch all threeBoxes
  useEffect(() => {
    const fetchThreeBoxes = async () => {
      try {
        const response = await fetch('https://barns-backend.onrender.com/api/fivebox/getallfiveboxes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setThreeBoxes(data);
        setFilteredThreeBoxes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fiveBoxes:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load fiveBoxes: ' + error.message,
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchThreeBoxes();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredThreeBoxes(threeBoxes);
    } else {
      const filtered = threeBoxes.filter(threeBox => 
        threeBox.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (threeBox.reference && threeBox.reference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredThreeBoxes(filtered);
    }
  }, [searchTerm, threeBoxes]);

  // Handle view threeBox details
  const handleView = (threeBox) => {
    setSelectedThreeBox(threeBox);
    setViewMode(true);
  };

  // Handle edit threeBox
const handleEdit = (threeBox) => {
  setSelectedThreeBox({ 
    ...threeBox,
    imageFile: null,
    imagePreview: null
  });
  setEditMode(true);
};

  // Handle delete confirmation
  const handleDeleteClick = (threeBox) => {
    setThreeBoxToDelete(threeBox);
    setDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const response = await fetch(`https://barns-backend.onrender.com/api/fivebox/deletefivebox/${threeBoxToDelete.reference}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedThreeBoxes = threeBoxes.filter(b => b._id !== threeBoxToDelete._id);
        setThreeBoxes(updatedThreeBoxes);
        setFilteredThreeBoxes(updatedThreeBoxes);
        setSnackbar({
          open: true,
          message: 'FiveBox supprimée avec succès',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to delete FiveBox');
      }
    } catch (error) {
      console.error('Error deleting FiveBox:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression de la FiveBox',
        severity: 'error'
      });
    } finally {
      setDeleteConfirm(false);
      setThreeBoxToDelete(null);
    }
  };

  // Handle form field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedThreeBox(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };


  // Save updated threeBox
// Replace the existing saveChanges function with this:
const saveChanges = async () => {
  try {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.keys(selectedThreeBox).forEach(key => {
      if (key !== 'imageFile' && key !== 'imagePreview' && selectedThreeBox[key] !== null) {
        formData.append(key, selectedThreeBox[key]);
      }
    });
    
    // Append the image file if it exists
    if (selectedThreeBox.imageFile) {
      formData.append('image', selectedThreeBox.imageFile);
    }
    
    const response = await fetch(`https://barns-backend.onrender.com/api/fivebox/updatefivebox/${selectedThreeBox.reference}`, {
      method: 'PUT',
      body: formData,
      // Don't set Content-Type header - the browser will set it automatically with the correct boundary
    });

    if (response.ok) {
      const updatedThreeBox = await response.json();
      const updatedThreeBoxes = threeBoxes.map(b => b._id === updatedThreeBox._id ? updatedThreeBox : b);
      setThreeBoxes(updatedThreeBoxes);
      setFilteredThreeBoxes(updatedThreeBoxes);
      setSnackbar({
        open: true,
        message: 'FiveBox mise à jour avec succès',
        severity: 'success'
      });
      setEditMode(false);
    } else {
      throw new Error('Failed to update FiveBox');
    }
  } catch (error) {
    console.error('Error updating FiveBox:', error);
    setSnackbar({
      open: true,
      message: 'Erreur lors de la mise à jour de la FiveBox',
      severity: 'error'
    });
  }
};

  // Close all dialogs
  const closeDialog = () => {
    setViewMode(false);
    setEditMode(false);
    setSelectedThreeBox(null);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Render image with loading states
  const renderThreeBoxImage = (threeBox) => {
    const imageUrl = getValidImageUrl(threeBox.imageURL);
    const loadState = imageLoadStates[threeBox._id];

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
          alt={threeBox.name}
          onLoad={() => handleImageLoad(threeBox._id)}
          onError={() => handleImageError(threeBox._id)}
          onLoadStart={() => handleImageLoadStart(threeBox._id)}
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
        FiveBox Management – Solutions Intelligentes de Gestion et de Suivi
      </Typography>

      {/* Search Bar */}
      <Box mb={isMobile ? 2 : 4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher parmi les threeBoxes par nom ou référence..."
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

      {/* ThreeBoxes Grid */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: isMobile ? 1 : 3,
      }}>
        <Grid container spacing={isMobile ? 2 : 4} sx={{ 
          maxWidth: 'lg',
          justifyContent: 'center'
        }}>
          {filteredThreeBoxes.length > 0 ? (
            filteredThreeBoxes.map((threeBox) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={threeBox._id} sx={{
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
                  {/* ThreeBox Image */}
                  <Box sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: isMobile ? 120 : 180,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}>
                    {renderThreeBoxImage(threeBox)}
                  </Box>

                  {/* ThreeBox Information */}
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
                      {threeBox.name}
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
                        label={`Réf: ${threeBox.reference}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: isMobile ? '0.7rem' : '0.8rem'
                        }}
                      />
                      <Chip 
                        label={`${threeBox.price?.toFixed(2) || '0.00'}€`} 
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
                      {threeBox.description}
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mt: 'auto'
                    }}>
                      <Tooltip title="Voir détails">
                        <IconButton 
                          onClick={() => handleView(threeBox)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <ViewIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          onClick={() => handleEdit(threeBox)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          onClick={() => handleDeleteClick(threeBox)}
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
                backgroundColor: 'rgba(56, 89, 139, 0.1)'
              }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ color: '#38598b' }}>
                  {searchTerm ? 'Aucune threeBox ne correspond à votre recherche' : 'Aucune threeBox disponible'}
                </Typography>
                <Typography variant="body2" sx={{ 
                  mt: 1, 
                  color: '#38598b',
                  fontSize: isMobile ? '0.8rem' : '0.9rem'
                }}>
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Ajoutez des threeBoxes pour commencer'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* View ThreeBox Dialog */}
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
              {selectedThreeBox?.name || 'Détails de la ThreeBox'}
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
          {selectedThreeBox && (
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
                {getValidImageUrl(selectedThreeBox.imageURL) ? (
                  <CardMedia
                    component="img"
                    image={getValidImageUrl(selectedThreeBox.imageURL)}
                    alt={selectedThreeBox.name}
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
                    <Typography variant="body1">Pas d'image disponible</Typography>
                  </Box>
                )}
              </Box>

              {/* ThreeBox details section with modern card layout */}
              <Box sx={{ 
                p: isMobile ? 2 : isTablet ? 3 : 4,
                backgroundColor: '#fff'
              }}>
                <Grid container spacing={isMobile ? 2 : 4}>
                  {/* ThreeBox Description Section */}
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
                        Description de la fiveBox
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7,
                        color: '#4a5568',
                        whiteSpace: 'pre-line',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {selectedThreeBox.description || 'Aucune description disponible pour cette fiveBox.'}
                      </Typography>

                      <Typography variant={isMobile ? 'subtitle1' : 'h6'} gutterBottom sx={{ 
                        fontWeight: 600,
                        color: '#2d3748',
                        borderBottom: '2px solid #e2e8f0',
                        pb: 1,
                        mb: 2
                      }}>
                        Spécifications
                      </Typography>
                      
                      <Box sx={{ '& > *': { mb: 1.5 } }}>
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Référence:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.reference}
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
                            {selectedThreeBox.price?.toFixed(2) || '0.00'}€
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
                            {selectedThreeBox.type || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Conception:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.conception || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Additional Specifications Section */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: isMobile ? 1.5 : 3,
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      height: '100%'
                    }}>
                      <Typography variant={isMobile ? 'subtitle1' : 'h6'} gutterBottom sx={{ 
                        fontWeight: 600,
                        color: '#2d3748',
                        borderBottom: '2px solid #e2e8f0',
                        pb: 1,
                        mb: 2
                      }}>
                        Détails Techniques
                      </Typography>
                      
                      <Box sx={{ '& > *': { mb: 1.5 } }}>
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Épaisseur:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.epaisseur || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Hauteur Basse:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.hauteurPartieBasse || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Hauteur Haute:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.hauteurPartieHaute || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Avancée:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.avancee || 'N/A'}
                          </Typography>
                        </Box>

                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Poteaux:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.poteaux || 'N/A'}
                          </Typography>
                        </Box>

                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Tôle:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.tole || 'N/A'}
                          </Typography>
                        </Box>

                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Option:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.option || 'N/A'}
                          </Typography>
                        </Box>

                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Couleur:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.couleur || 'N/A'}
                          </Typography>
                        </Box>

                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Ouverture:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedThreeBox.ouverture || 'N/A'}
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

      {/* Edit ThreeBox Dialog */}
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
  {/* Header with gradient and subtle pattern */}
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
          Modifier les 5 Box
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

  {/* Content with consistent card-like fields */}
  <DialogContent
    dividers
    sx={{
      px: isMobile ? 3 : 4,
      py: isMobile ? 3 : 4,
      backgroundColor: '#f5f7fa',
    }}
  >
    {selectedThreeBox && (
      <Grid container spacing={isMobile ? 3 : 4}>
        {/* Field Grid - All fields now have consistent height */}
        {[
          ['Nom', 'name'],
          ['Référence', 'reference', true],
          ['Prix (€)', 'price', false, 'number'],
          ['Type', 'type'],
          ['Conception', 'conception'],
          ['Épaisseur', 'epaisseur'],
          ['Hauteur Partie Basse', 'hauteurPartieBasse'],
          ['Hauteur Partie Haute', 'hauteurPartieHaute'],
          ['Avancée', 'avancee'],
          ['Poteaux', 'poteaux'],
          ['Tôle', 'tole'],
          ['Option', 'option'],
          ['Couleur', 'couleur'],
          ['Ouverture', 'ouverture'],
        ].map(([label, name, disabled = false, type = 'text'], idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <TextField
              fullWidth
              label={label}
              name={name}
              type={type}
              value={selectedThreeBox[name] || ''}
              onChange={handleFieldChange}
              variant="filled"
              size={isMobile ? 'small' : 'medium'}
              disabled={disabled}
              InputProps={{
                disableUnderline: true,
                ...(name === 'price' ? {
                  startAdornment: (
                    <InputAdornment position="start">€</InputAdornment>
                  ),
                  inputProps: { step: '0.01', min: '0' },
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

        {/* Image URL Field with Preview */}
<Grid item xs={12}>
  <Box sx={{ 
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row', 
    gap: 3,
    alignItems: 'center'
  }}>
    {selectedThreeBox.imageURL && (
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
          src={getValidImageUrl(selectedThreeBox.imageURL)} 
          alt="Box preview" 
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
          onClick={() => window.open(getValidImageUrl(selectedThreeBox.imageURL), '_blank')}
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
        {selectedThreeBox.imageURL ? 'Changer l\'image' : 'Ajouter une image'}
        <input
          type="file"
          hidden
          name="image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedThreeBox(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
              }));
            }
          }}
        />
      </Button>
      {selectedThreeBox.imageURL && (
        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{
            textTransform: 'none',
            py: 1.5
          }}
          onClick={() => {
            setSelectedThreeBox(prev => ({
              ...prev,
              imageURL: null,
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

        {/* Description Field - Full Width with matching style */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={isMobile ? 4 : 6}
            value={selectedThreeBox.description || ''}
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

  {/* Actions with matching width and creative buttons */}
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
      startIcon={<SaveIcon />}
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
        }
      }}
    >
      Enregistrer
    </Button>
  </DialogActions>
</Dialog>


      {/* Delete Confirmation Dialog */}
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
            Êtes-vous sûr de vouloir supprimer la threeBox "{threeBoxToDelete?.name}" ?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#6b7280', fontSize: '0.875rem' }}>
            Cette action est irréversible et supprimera définitivement la threeBox.
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

      {/* Snackbar for notifications */}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditFiveBox;