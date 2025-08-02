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
  Visibility as VisibilityOutlinedIcon
} from '@mui/icons-material';

const EditBarriere = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [barrieres, setBarrieres] = useState([]);
  const [filteredBarrieres, setFilteredBarrieres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
const [selectedBarriere, setSelectedBarriere] = useState({
  imageFile: null,
  imagePreview: null
});  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [barriereToDelete, setBarriereToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
    const [isSaving, setIsSaving] = useState(false);

  const handleImageLoad = (barriereId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [barriereId]: 'loaded'
    }));
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedBarriere(prev => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file)
    }));
  }
};

  const handleImageError = (barriereId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [barriereId]: 'error'
    }));
  };

  const handleImageLoadStart = (barriereId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [barriereId]: 'loading'
    }));
  };

  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    
    return imageUrl;
  };

  useEffect(() => {
    const fetchBarrieres = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/barriere/getallbarrieres');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBarrieres(data);
        setFilteredBarrieres(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching barrieres:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load barrieres: ' + error.message,
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchBarrieres();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBarrieres(barrieres);
    } else {
      const filtered = barrieres.filter(barriere => 
        barriere.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (barriere.reference && barriere.reference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBarrieres(filtered);
    }
  }, [searchTerm, barrieres]);

  const handleView = (barriere) => {
    setSelectedBarriere(barriere);
    setViewMode(true);
  };

const handleEdit = (barriere) => {
  setSelectedBarriere({ 
    ...barriere,
    imageFile: null,
    imagePreview: null
  });
  setEditMode(true);
};

  const handleDeleteClick = (barriere) => {
    setBarriereToDelete(barriere);
    setDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/barriere/deletebarriere/${barriereToDelete.reference}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedBarrieres = barrieres.filter(b => b._id !== barriereToDelete._id);
        setBarrieres(updatedBarrieres);
        setFilteredBarrieres(updatedBarrieres);
        setSnackbar({
          open: true,
          message: 'Barrière supprimée avec succès',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to delete barrière');
      }
    } catch (error) {
      console.error('Error deleting barrière:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression de la barrière',
        severity: 'error'
      });
    } finally {
      setDeleteConfirm(false);
      setBarriereToDelete(null);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedBarriere(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'width' ? parseFloat(value) : value
    }));
  };

const saveChanges = async () => {

  setIsSaving(true); 

  try {
    const formData = new FormData();
    
    Object.keys(selectedBarriere).forEach(key => {
      if (key !== 'imageFile' && key !== 'imagePreview' && selectedBarriere[key] !== null) {
        formData.append(key, selectedBarriere[key]);
      }
    });
    
    if (selectedBarriere.imageFile) {
      formData.append('image', selectedBarriere.imageFile);
    }

    const response = await fetch(
      `http://localhost:5000/api/barriere/updatebarriere/${selectedBarriere.reference}`,
      {
        method: 'PUT',
        body: formData, 
      }
    );

    if (response.ok) {
      const updatedBarriere = await response.json();
            const updatedBarrieres = barrieres.map(b => 
        b._id === updatedBarriere._id ? updatedBarriere : b
      );
      
      setBarrieres(updatedBarrieres);
      setFilteredBarrieres(updatedBarrieres);
      
      setSnackbar({
        open: true,
        message: 'Barrière mise à jour avec succès',
        severity: 'success'
      });
      window.location.reload();
      
      // Close edit dialog
      setEditMode(false);
    } else {
      // Handle API errors
      const errorData = await response.json();
      throw new Error(errorData.message || 'Échec de la mise à jour de la barrière');
    }
  } catch (error) {
    console.error('Error updating barrière:', error);
    
    // Show error notification
    setSnackbar({
      open: true,
      message: error.message || 'Erreur lors de la mise à jour de la barrière',
      severity: 'error'
    });
  } finally {
    setIsSaving(false);
  }
};

  const closeDialog = () => {
    setViewMode(false);
    setEditMode(false);
    setSelectedBarriere(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const renderBarriereImage = (barriere) => {
    const imageUrl = getValidImageUrl(barriere.imageURL);
    const loadState = imageLoadStates[barriere._id];

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
          alt={barriere.name}
          onLoad={() => handleImageLoad(barriere._id)}
          onError={() => handleImageError(barriere._id)}
          onLoadStart={() => handleImageLoadStart(barriere._id)}
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
       Barrières Management – Solutions Intelligentes de Gestion et de Suivi
      </Typography>

      <Box mb={isMobile ? 2 : 4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher parmi les barrières par nom ou référence..."
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
          {filteredBarrieres.length > 0 ? (
            filteredBarrieres.map((barriere) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={barriere._id} sx={{
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
                  <Box sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: isMobile ? 120 : 180,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}>
                    {renderBarriereImage(barriere)}
                  </Box>

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
                      {barriere.name}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      flexWrap: 'wrap'
                    }}>
                      <Chip 
                        label={`Réf: ${barriere.reference}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: isMobile ? '0.7rem' : '0.8rem'
                        }}
                      />
                      <Chip 
                        label={`${barriere.price?.toFixed(2) || '0.00'}€`} 
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
                      {barriere.description}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mt: 'auto'
                    }}>
                      <Tooltip title="Voir détails">
                        <IconButton 
                          onClick={() => handleView(barriere)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <ViewIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          onClick={() => handleEdit(barriere)}
                          sx={{ color: 'white' }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          onClick={() => handleDeleteClick(barriere)}
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
                  {searchTerm ? 'Aucune barrière ne correspond à votre recherche' : 'Aucune barrière disponible'}
                </Typography>
                <Typography variant="body2" sx={{ 
                  mt: 1, 
                  color: '#38598b',
                  fontSize: isMobile ? '0.8rem' : '0.9rem'
                }}>
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Ajoutez des barrières pour commencer'}
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
              {selectedBarriere?.name || 'Détails de la Barrière'}
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
          {selectedBarriere && (
            <Box>
              <Box sx={{
                width: '100%',
                height: isMobile ? '200px' : isTablet ? '300px' : '400px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                boxShadow: 'inset 0 -10px 20px -10px rgba(0,0,0,0.1)'
              }}>
                {getValidImageUrl(selectedBarriere.imageURL) ? (
                  <CardMedia
                    component="img"
                    image={getValidImageUrl(selectedBarriere.imageURL)}
                    alt={selectedBarriere.name}
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

              <Box sx={{ 
                p: isMobile ? 2 : isTablet ? 3 : 4,
                backgroundColor: '#fff'
              }}>
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
                        Description de la Barrière
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7,
                        color: '#4a5568',
                        whiteSpace: 'pre-line',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {selectedBarriere.description || 'Aucune description disponible pour cette barrière.'}
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
                            {selectedBarriere.reference}
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
                            {selectedBarriere.price?.toFixed(2) || '0.00'}€
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Largeur:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedBarriere.width || 'N/A'} cm
                          </Typography>
                        </Box>
                        
                        <Box display="flex">
                          <Typography variant="body1" sx={{ 
                            minWidth: isMobile ? '80px' : '120px', 
                            fontWeight: 500, 
                            color: '#4a5568',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}>
                            Nom:
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                            {selectedBarriere.name || 'N/A'}
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
                Modifier la Barrière
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

        <DialogContent dividers sx={{ 
          px: isMobile ? 1 : 3, 
          py: isMobile ? 2 : 3,
          backgroundColor: '#f9fafc'
        }}>
          {selectedBarriere && (
            <Grid container spacing={isMobile ? 1 : 3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="name"
                  value={selectedBarriere.name || ''}
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
                  value={selectedBarriere.reference || ''}
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
                  value={selectedBarriere.price || ''}
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Largeur (cm)"
                  name="width"
                  type="number"
                  value={selectedBarriere.width || ''}
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
  <Box sx={{ 
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row', 
    gap: 3,
    alignItems: 'center'
  }}>
    {selectedBarriere.imageURL && (
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
          src={selectedBarriere.imagePreview || getValidImageUrl(selectedBarriere.imageURL)} 
          alt="Barrière preview" 
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
          onClick={() => window.open(
            selectedBarriere.imagePreview || getValidImageUrl(selectedBarriere.imageURL), 
            '_blank'
          )}
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
        {selectedBarriere.imageURL ? "Changer l'image" : "Ajouter une image"}
        <input
          type="file"
          hidden
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Button>
      {selectedBarriere.imageURL && (
        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{
            textTransform: 'none',
            py: 1.5
          }}
          onClick={() => {
            setSelectedBarriere(prev => ({
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


              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={selectedBarriere.description || ''}
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
            Annuler
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
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={deleteConfirm} 
        onClose={() => setDeleteConfirm(false)}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Êtes-vous sûr de vouloir supprimer "{barriereToDelete?.name}"?
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
            Annuler
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
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

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

export default EditBarriere;