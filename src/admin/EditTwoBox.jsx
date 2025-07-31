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

const EditTwoBox = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [threeBoxes, setThreeBoxes] = useState([]);
  const [filteredThreeBoxes, setFilteredThreeBoxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThreeBox, setSelectedThreeBox] = useState(null);
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
      return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    
    return imageUrl;
  };

  // Fetch all threeBoxes
  useEffect(() => {
    const fetchTwoBoxes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/twobox/getalltwoboxes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setThreeBoxes(data);
        setFilteredThreeBoxes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching threeBoxes:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load threeBoxes: ' + error.message,
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchTwoBoxes();
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
    setSelectedThreeBox({ ...threeBox });
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
      const response = await fetch(`http://localhost:5000/api/twobox/deletetwobox/${threeBoxToDelete.reference}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedThreeBoxes = threeBoxes.filter(b => b._id !== threeBoxToDelete._id);
        setThreeBoxes(updatedThreeBoxes);
        setFilteredThreeBoxes(updatedThreeBoxes);
        setSnackbar({
          open: true,
          message: 'ThreeBox supprimée avec succès',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to delete threeBox');
      }
    } catch (error) {
      console.error('Error deleting threeBox:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression de la threeBox',
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
  const saveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/twobox/updatetwobox/${selectedThreeBox.reference}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedThreeBox)
      });

      if (response.ok) {
        const updatedThreeBox = await response.json();
        const updatedThreeBoxes = threeBoxes.map(b => b._id === updatedThreeBox._id ? updatedThreeBox : b);
        setThreeBoxes(updatedThreeBoxes);
        setFilteredThreeBoxes(updatedThreeBoxes);
        setSnackbar({
          open: true,
          message: 'ThreeBox mise à jour avec succès',
          severity: 'success'
        });
        setEditMode(false);
      } else {
        throw new Error('Failed to update threeBox');
      }
    } catch (error) {
      console.error('Error updating threeBox:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour de la threeBox',
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
        2 Box Management – Solutions Intelligentes de Gestion et de Suivi
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
        <Grid container spacing={isMobile ? 2 : 1} sx={{ 
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
                        Description de la ThreeBox
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7,
                        color: '#4a5568',
                        whiteSpace: 'pre-line',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {selectedThreeBox.description || 'Aucune description disponible pour cette threeBox.'}
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
          background: 'linear-gradient(135deg, #38598b 0%,rgb(63, 122, 204) 100%)',
          color: '#fff',
          px: isMobile ? 2 : 3,
          py: isMobile ? 1.5 : 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <EditIcon sx={{ mr: 1.5, fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
              <Typography variant={isMobile ? 'h6' : 'h6'} fontWeight={600} sx={{ letterSpacing: '0.5px' }}>
                Modifier la ThreeBox
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
          {selectedThreeBox && (
            <Grid container spacing={isMobile ? 1 : 3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="name"
                  value={selectedThreeBox.name || ''}
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
                  label="Référence"
                  name="reference"
                  value={selectedThreeBox.reference || ''}
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
                  label="Prix (€)"
                  name="price"
                  type="number"
                  value={selectedThreeBox.price || ''}
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
                  label="Type"
                  name="type"
                  value={selectedThreeBox.type || ''}
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
                  label="Conception"
                  name="conception"
                  value={selectedThreeBox.conception || ''}
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
                  label="Épaisseur"
                  name="epaisseur"
                  value={selectedThreeBox.epaisseur || ''}
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
                  label="Hauteur Partie Basse"
                  name="hauteurPartieBasse"
                  value={selectedThreeBox.hauteurPartieBasse || ''}
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
                  label="Hauteur Partie Haute"
                  name="hauteurPartieHaute"
                  value={selectedThreeBox.hauteurPartieHaute || ''}
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
                  label="Avancée"
                  name="avancee"
                  value={selectedThreeBox.avancee || ''}
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
                  label="Poteaux"
                  name="poteaux"
                  value={selectedThreeBox.poteaux || ''}
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
                  label="Tôle"
                  name="tole"
                  value={selectedThreeBox.tole || ''}
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
                  label="Option"
                  name="option"
                  value={selectedThreeBox.option || ''}
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
                  label="Couleur"
                  name="couleur"
                  value={selectedThreeBox.couleur || ''}
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
                  label="Ouverture"
                  name="ouverture"
                  value={selectedThreeBox.ouverture || ''}
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={selectedThreeBox.description || ''}
                  onChange={handleFieldChange}
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  multiline
                  rows={4}
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL de l'image"
                  name="imageURL"
                  value={selectedThreeBox.imageURL || ''}
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
            </Grid>
          )}
        </DialogContent>

        {/* Dialog Actions with improved styling */}
        <DialogActions sx={{ 
          px: isMobile ? 2 : 3, 
          py: 2,
          backgroundColor: '#f9fafc',
          borderTop: '1px solid #e2e8f0'
        }}>
          <Button
            onClick={closeDialog}
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(220, 38, 38, 0.04)'
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
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              backgroundColor: '#38598b',
              '&:hover': {
                backgroundColor: '#2c5282'
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

export default EditTwoBox;