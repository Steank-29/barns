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

const EditBarriere = () => {
  const [barrieres, setBarrieres] = useState([]);
  const [filteredBarrieres, setFilteredBarrieres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarriere, setSelectedBarriere] = useState(null);
  const [viewMode, setViewMode] = useState(false);
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

  // Handle image load states
  const handleImageLoad = (barriereId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [barriereId]: 'loaded'
    }));
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

  // Function to validate and fix image URLs
  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's a relative path, prepend the base URL
    if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    }
    
    return imageUrl;
  };

  // Fetch all barrieres
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

  // Search functionality
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

  // Handle view barriere details
  const handleView = (barriere) => {
    setSelectedBarriere(barriere);
    setViewMode(true);
  };

  // Handle edit barriere
  const handleEdit = (barriere) => {
    setSelectedBarriere({ ...barriere });
    setEditMode(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (barriere) => {
    setBarriereToDelete(barriere);
    setDeleteConfirm(true);
  };

  // Confirm delete
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

  // Handle form field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedBarriere(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'width' ? parseFloat(value) : value
    }));
  };

  // Save updated barriere
  const saveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/barriere/updatebarriere/${selectedBarriere.reference}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBarriere)
      });

      if (response.ok) {
        const updatedBarriere = await response.json();
        const updatedBarrieres = barrieres.map(b => b._id === updatedBarriere._id ? updatedBarriere : b);
        setBarrieres(updatedBarrieres);
        setFilteredBarrieres(updatedBarrieres);
        setSnackbar({
          open: true,
          message: 'Barrière mise à jour avec succès',
          severity: 'success'
        });
        setEditMode(false);
      } else {
        throw new Error('Failed to update barrière');
      }
    } catch (error) {
      console.error('Error updating barrière:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour de la barrière',
        severity: 'error'
      });
    }
  };

  // Close all dialogs
  const closeDialog = () => {
    setViewMode(false);
    setEditMode(false);
    setSelectedBarriere(null);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Render image with loading states
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
          <ImageNotSupportedIcon sx={{ fontSize: 48 }} />
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
        <CircularProgress size={60} sx={{ color: '#38598b' }} />
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ 
        textAlign: 'center', 
        color: '#38598b',
        fontWeight: 'bold',
        mb: 4
      }}>
        Gestion des Barrières
      </Typography>

      {/* Search Bar */}
      <Box mb={4}>
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
        />
      </Box>

      {/* Barrieres Grid */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: 3,
      }}>
        <Grid container spacing={4} sx={{ 
          maxWidth: 'lg',
          justifyContent: 'center'
        }}>
          {filteredBarrieres.length > 0 ? (
            filteredBarrieres.map((barriere) => (
              <Grid item xs={12} sm={6} md={4} key={barriere._id} sx={{
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
                  backgroundColor: '#38598b',
                  color: 'white',
                  borderRadius: 2
                }}>
                  {/* Barriere Image */}
                  <Box sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: 180,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}>
                    {renderBarriereImage(barriere)}
                  </Box>

                  {/* Barriere Information */}
                  <CardContent sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ 
                      fontWeight: 600,
                      color: 'white'
                    }}>
                      {barriere.name}
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
                        label={`Réf: ${barriere.reference}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white'
                        }}
                      />
                      <Chip 
                        label={`${barriere.price?.toFixed(2) || '0.00'}€`} 
                        size="medium"
                        sx={{
                          backgroundColor: 'white',
                          color: '#38598b',
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
                        color: 'rgba(255,255,255,0.8)'
                      }}
                    >
                      {barriere.description}
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mt: 'auto'
                    }}>
                      <Tooltip title="Voir détails">
                        <IconButton 
                          onClick={() => handleView(barriere)}
                          sx={{ color: 'white' }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          onClick={() => handleEdit(barriere)}
                          sx={{ color: 'white' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          onClick={() => handleDeleteClick(barriere)}
                          sx={{ color: 'white' }}
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
                borderColor: '#38598b',
                borderRadius: 2,
                backgroundColor: 'rgba(56, 89, 139, 0.1)'
              }}>
                <Typography variant="h6" sx={{ color: '#38598b' }}>
                  {searchTerm ? 'Aucune barrière ne correspond à votre recherche' : 'Aucune barrière disponible'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: '#38598b' }}>
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Ajoutez des barrières pour commencer'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* View Barriere Dialog */}
      <Dialog open={viewMode} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ px: 4, py: 2, backgroundColor: '#38598b', color: '#fff' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600} color="#fff">
              Détails de la Barrière
            </Typography>
            <IconButton onClick={closeDialog} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 4, py: 3 }}>
          {selectedBarriere && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}>
                  {getValidImageUrl(selectedBarriere.imageURL) ? (
                    <CardMedia
                      component="img"
                      image={getValidImageUrl(selectedBarriere.imageURL)}
                      alt={selectedBarriere.name}
                      style={{
                        maxHeight: '300px',
                        width: 'auto',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                    />
                  ) : (
                    <Box sx={{
                      height: '300px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px'
                    }}>
                      <ImageNotSupportedIcon sx={{ fontSize: 48, color: 'rgba(0,0,0,0.5)' }} />
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  {selectedBarriere.name}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Référence:</strong> {selectedBarriere.reference}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Prix:</strong> {selectedBarriere.price?.toFixed(2) || '0.00'}€
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Largeur:</strong> {selectedBarriere.width || 'N/A'} cm
                  </Typography>
                </Box>

                <Typography variant="body1">
                  <strong>Description:</strong>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {selectedBarriere.description || 'Aucune description disponible'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Barriere Dialog */}
      <Dialog open={editMode} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#38598b', color: '#fff', px: 3, py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              Modifier la Barrière
            </Typography>
            <IconButton onClick={closeDialog} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3, py: 3 }}>
          {selectedBarriere && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="name"
                  value={selectedBarriere.name || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Référence"
                  name="reference"
                  value={selectedBarriere.reference || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                  disabled
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
                  margin="normal"
                  InputProps={{
                    inputProps: { step: "0.01" }
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
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={selectedBarriere.description || ''}
                  onChange={handleFieldChange}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            startIcon={<CancelIcon />}
            onClick={closeDialog}
            color="error"
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={saveChanges}
            sx={{ backgroundColor: '#38598b', color: '#fff' }}
            variant="contained"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer "{barriereToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)} sx={{color: '#38598b'}} variant="outlined">
            Annuler
          </Button>
          <Button onClick={confirmDelete} sx={{backgroundColor: '#d32f2f', color: '#fff'}} variant="contained">
            Supprimer
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

export default EditBarriere;