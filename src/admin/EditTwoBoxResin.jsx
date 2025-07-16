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

const EditTwoBoxResin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [twoBoxResins, setTwoBoxResins] = useState([]);
  const [filteredTwoBoxResins, setFilteredTwoBoxResins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTwoBoxResin, setSelectedTwoBoxResin] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [twoBoxResinToDelete, setTwoBoxResinToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle image load states
  const handleImageLoad = (twoBoxResinId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [twoBoxResinId]: 'loaded'
    }));
  };

  const handleImageError = (twoBoxResinId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [twoBoxResinId]: 'error'
    }));
  };

  const handleImageLoadStart = (twoBoxResinId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [twoBoxResinId]: 'loading'
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

  // Fetch all twoBoxResins
  useEffect(() => {
    const fetchTwoBoxResins = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/twoboxresin/getalltwoboxresins');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTwoBoxResins(data);
        setFilteredTwoBoxResins(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching twoBoxResins:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load twoBoxResins: ' + error.message,
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchTwoBoxResins();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTwoBoxResins(twoBoxResins);
    } else {
      const filtered = twoBoxResins.filter(twoBoxResin => 
        twoBoxResin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (twoBoxResin.reference && twoBoxResin.reference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTwoBoxResins(filtered);
    }
  }, [searchTerm, twoBoxResins]);

  // Handle view twoBoxResin details
  const handleView = (twoBoxResin) => {
    setSelectedTwoBoxResin(twoBoxResin);
    setViewMode(true);
  };

  // Handle edit twoBoxResin
  const handleEdit = (twoBoxResin) => {
    setSelectedTwoBoxResin({ ...twoBoxResin });
    setEditMode(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (twoBoxResin) => {
    setTwoBoxResinToDelete(twoBoxResin);
    setDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/twoboxresin/deletetwoboxresin/${twoBoxResinToDelete.reference}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedTwoBoxResins = twoBoxResins.filter(b => b._id !== twoBoxResinToDelete._id);
        setTwoBoxResins(updatedTwoBoxResins);
        setFilteredTwoBoxResins(updatedTwoBoxResins);
        setSnackbar({
          open: true,
          message: 'TwoBoxResin supprimée avec succès',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to delete twoBoxResin');
      }
    } catch (error) {
      console.error('Error deleting twoBoxResin:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression de la twoBoxResin',
        severity: 'error'
      });
    } finally {
      setDeleteConfirm(false);
      setTwoBoxResinToDelete(null);
    }
  };

  // Handle form field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedTwoBoxResin(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  // Save updated twoBoxResin
  const saveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/twoboxresin/updatetwoboxresin/${selectedTwoBoxResin.reference}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTwoBoxResin)
      });

      if (response.ok) {
        const updatedTwoBoxResin = await response.json();
        const updatedTwoBoxResins = twoBoxResins.map(b => b._id === updatedTwoBoxResin._id ? updatedTwoBoxResin : b);
        setTwoBoxResins(updatedTwoBoxResins);
        setFilteredTwoBoxResins(updatedTwoBoxResins);
        setSnackbar({
          open: true,
          message: 'TwoBoxResin mise à jour avec succès',
          severity: 'success'
        });
        setEditMode(false);
      } else {
        throw new Error('Failed to update twoBoxResin');
      }
    } catch (error) {
      console.error('Error updating twoBoxResin:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour de la twoBoxResin',
        severity: 'error'
      });
    }
  };

  // Close all dialogs
  const closeDialog = () => {
    setViewMode(false);
    setEditMode(false);
    setSelectedTwoBoxResin(null);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Render image with loading states
  const renderTwoBoxResinImage = (twoBoxResin) => {
    const imageUrl = getValidImageUrl(twoBoxResin.imageURL);
    const loadState = imageLoadStates[twoBoxResin._id];

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
          alt={twoBoxResin.name}
          onLoad={() => handleImageLoad(twoBoxResin._id)}
          onError={() => handleImageError(twoBoxResin._id)}
          onLoadStart={() => handleImageLoadStart(twoBoxResin._id)}
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
        Gestion des TwoBoxResin
      </Typography>

      {/* Search Bar */}
      <Box mb={isMobile ? 2 : 4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher parmi les twoBoxResins par nom ou référence..."
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

      {/* TwoBoxResins Grid */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: isMobile ? 1 : 3,
      }}>
        <Grid container spacing={isMobile ? 2 : 4} sx={{ 
          maxWidth: 'lg',
          justifyContent: 'center'
        }}>
          {filteredTwoBoxResins.length > 0 ? (
            filteredTwoBoxResins.map((twoBoxResin) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={twoBoxResin._id} sx={{
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
                  {/* TwoBoxResin Image */}
                  <Box sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: isMobile ? 120 : 180,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}>
                    {renderTwoBoxResinImage(twoBoxResin)}
                  </Box>

                  {/* TwoBoxResin Information */}
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
                      {twoBoxResin.name}
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
                        label={`Réf: ${twoBoxResin.reference}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: isMobile ? '0.7rem' : '0.8rem'
                        }}
                      />
                      <Chip 
                        label={`${twoBoxResin.price?.toFixed(2) || '0.00'}€`} 
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
                      {twoBoxResin.description}
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mt: 'auto'
                    }}>
                      <Tooltip title="Voir détails">
                        <IconButton 
                          onClick={() => handleView(twoBoxResin)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <ViewIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          onClick={() => handleEdit(twoBoxResin)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          onClick={() => handleDeleteClick(twoBoxResin)}
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
                  {searchTerm ? 'Aucune twoBoxResin ne correspond à votre recherche' : 'Aucune twoBoxResin disponible'}
                </Typography>
                <Typography variant="body2" sx={{ 
                  mt: 1, 
                  color: '#38598b',
                  fontSize: isMobile ? '0.8rem' : '0.9rem'
                }}>
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Ajoutez des twoBoxResins pour commencer'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* View TwoBoxResin Dialog */}
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
              {selectedTwoBoxResin?.name || 'Détails de la TwoBoxResin'}
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
          {selectedTwoBoxResin && (
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
                {getValidImageUrl(selectedTwoBoxResin.imageURL) ? (
                  <CardMedia
                    component="img"
                    image={getValidImageUrl(selectedTwoBoxResin.imageURL)}
                    alt={selectedTwoBoxResin.name}
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

              {/* TwoBoxResin details section with modern card layout */}
              <Box sx={{ 
                p: isMobile ? 2 : isTablet ? 3 : 4,
                backgroundColor: '#fff'
              }}>
                <Grid container spacing={isMobile ? 2 : 4}>
                  {/* TwoBoxResin Description Section */}
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
                        Description de la TwoBoxResin
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7,
                        color: '#4a5568',
                        whiteSpace: 'pre-line',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {selectedTwoBoxResin.description || 'Aucune description disponible pour cette twoBoxResin.'}
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
                            {selectedTwoBoxResin.reference}
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
                            {selectedTwoBoxResin.price?.toFixed(2) || '0.00'}€
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
                            {selectedTwoBoxResin.type || 'N/A'}
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
                            {selectedTwoBoxResin.conception || 'N/A'}
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
                            {selectedTwoBoxResin.epaisseur || 'N/A'}
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
                            {selectedTwoBoxResin.hauteurPartieBasse || 'N/A'}
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
                            {selectedTwoBoxResin.hauteurPartieHaute || 'N/A'}
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
                            {selectedTwoBoxResin.avancee || 'N/A'}
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
                            {selectedTwoBoxResin.poteaux || 'N/A'}
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
                            {selectedTwoBoxResin.tole || 'N/A'}
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
                            {selectedTwoBoxResin.option || 'N/A'}
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
                            {selectedTwoBoxResin.couleur || 'N/A'}
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
                            {selectedTwoBoxResin.ouverture || 'N/A'}
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

      {/* Edit TwoBoxResin Dialog */}
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
                Modifier la TwoBoxResine
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
          {selectedTwoBoxResin && (
            <Grid container spacing={isMobile ? 1 : 3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="name"
                  value={selectedTwoBoxResin.name || ''}
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
                  value={selectedTwoBoxResin.reference || ''}
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
                  value={selectedTwoBoxResin.price || ''}
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
                  value={selectedTwoBoxResin.type || ''}
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
                  value={selectedTwoBoxResin.conception || ''}
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
                  value={selectedTwoBoxResin.epaisseur || ''}
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
                  value={selectedTwoBoxResin.hauteurPartieBasse || ''}
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
                  value={selectedTwoBoxResin.hauteurPartieHaute || ''}
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
                  value={selectedTwoBoxResin.avancee || ''}
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
                  value={selectedTwoBoxResin.poteaux || ''}
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
                  value={selectedTwoBoxResin.tole || ''}
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
                  value={selectedTwoBoxResin.option || ''}
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
                  value={selectedTwoBoxResin.couleur || ''}
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
                  value={selectedTwoBoxResin.ouverture || ''}
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
                  value={selectedTwoBoxResin.description || ''}
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
                  value={selectedTwoBoxResin.imageURL || ''}
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
            Êtes-vous sûr de vouloir supprimer la twoBoxResin "{twoBoxResinToDelete?.name}" ?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#6b7280', fontSize: '0.875rem' }}>
            Cette action est irréversible et supprimera définitivement la twoBoxResin.
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

export default EditTwoBoxResin;