import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  CardMedia,
  TextareaAutosize,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#38598b',
    },
    '&:hover fieldset': {
      borderColor: '#38598b',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#38598b',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#38598b',
    fontFamily: 'Savate',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Savate',
    color: '#38598b',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      padding: '10.5px 14px',
    },
  },
  width: '100%',
  marginBottom: theme.spacing(2),
}));


const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  fontFamily: 'Savate',
  padding: theme.spacing(1),
  borderRadius: '8px',
  borderColor: '#38598b',
  backgroundColor: '#FFFFFF',
  color: '#38598b',
  '&:focus': {
    outline: 'none',
    borderColor: '#38598b',
    borderWidth: '2px',
  },
  minHeight: '120px',
  resize: 'vertical',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    minHeight: '80px',
  },
}));


const Malle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    reference: '',
    image: null,
    productName: '',
    price: 0,
    height: '',
    width: '',
    thickness: '',
    description: '',
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFormData({
      reference: '',
      image: null,
      productName: '',
      price: 0,
      height: '',
      width: '',
      thickness: '',
      description: '',
    });
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      formPayload.append('reference', formData.reference);
      formPayload.append('productName', formData.productName);
      formPayload.append('price', formData.price);
      formPayload.append('height', formData.height);
      formPayload.append('width', formData.width);
      formPayload.append('thickness', formData.thickness);
      formPayload.append('description', formData.description);
      formPayload.append('image', formData.image);

      const response = await axios.post(`http://localhost:5000/api/malle`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Produit ajouté avec succès !');
      console.log(response.data);
    } catch (error) {
      toast.error("Erreur lors de la création du produit");
      console.error('Erreur lors de l\'envoi ', error);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
      p: isMobile ? 1 : 2,
      gap: isMobile ? 2 : 0
    }}>
      <Toaster 
        position={isMobile ? "top-center" : "top-right"}
        toastOptions={{
          style: {
            fontFamily: 'Savate',
            color: '#38598b',
            border: '1px solid #38598b',
            fontSize: isMobile ? '0.8rem' : '1rem'
          },
        }}
      />
      <Box sx={{ 
        width: isMobile ? '100%' : '50%', 
        pr: isMobile ? 0 : 2 
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom 
          sx={{ 
            fontFamily: 'Savate', 
            fontWeight: 'bolder', 
            textAlign: 'center', 
            color: '#38598b', 
            textTransform: 'uppercase',
            mb: 4,
            fontSize: isMobile ? '1.4rem' : '2rem'
          }}
        >
          Création d'une fiche produit Malle de concours
        </Typography>

        <StyledPaper elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid item xs={12}>
                <StyledTextField
                  label="Référence"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Nom de Malle"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  helperText="Doit contenir 'Malle'"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  type="file"
                  name="image"
                  label="Image du produit"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleImageChange}
                  inputProps={{ accept: "image/*" }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Hauteur (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Largeur (cm)"
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  label="Épaisseur (mm)"
                  name="thickness"
                  type="number"
                  value={formData.thickness}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Prix (€)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Description de Malle...'
                />
              </Grid>

              <Grid item xs={12} sx={{ 
                display: 'flex', 
                justifyContent: isMobile ? 'center' : 'flex-end',
                alignItems: 'center',
                gap: 1
              }}>
                <IconButton 
                  onClick={handleReset}
                  sx={{ 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#e0e0e0' },
                    width: isMobile ? 40 : 50,
                    height: isMobile ? 40 : 50
                  }}
                >
                  <RestartAltIcon sx={{ color: '#38598b' }} />
                </IconButton>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    fontFamily: 'Savate',
                    fontWeight: 'bold',
                    backgroundColor: '#38598b',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'white',
                      color: '#38598b',
                      border: '1px solid #38598b'
                    },
                    py: isMobile ? 0.8 : 1,
                    px: 2,
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    borderRadius: '8px',
                    width: isMobile ? 'auto' : 160,
                    minWidth: isMobile ? 120 : 'auto'
                  }}
                >
                  Créer malle
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Box>

      {!isMobile && (
        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ 
            mx: 2, 
            borderColor: '#38598b',
            display: isMobile ? 'none' : 'block'
          }} 
        />
      )}

      <Box sx={{ 
        width: isMobile ? '100%' : '50%', 
        backgroundColor: isMobile ? 'transparent' : 'white', 
        p: isMobile ? 0 : 3,
        mt: isMobile ? 2 : 0
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom 
          sx={{ 
            fontFamily: 'Savate', 
            fontWeight: 'bolder', 
            textAlign: 'center', 
            color: '#38598b', 
            textTransform: 'uppercase',
            mb: 4,
            fontSize: isMobile ? '1.4rem' : '2rem'
          }}
        >
          Aperçu du produit
        </Typography>
        <Card sx={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(117, 81, 57, 0.2)',
          mb: isMobile ? 2 : 0
        }}>
          {previewImage && (
            <CardMedia
              component="img"
              height={isMobile ? "180" : "280"}
              image={previewImage}
              alt="Aperçu du produit"
              sx={{ objectFit: 'fill' }}
            />
          )}
          <CardContent sx={{ backgroundColor: '#FFFFFF' }}>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Savate',
              color: '#38598b',
              mb: 1,
              fontSize: isMobile ? '1rem' : '1.25rem'
            }}>
              {formData.name || 'Aucun nom fournie'}
            </Typography>
            <Typography sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 2,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Réf: {formData.reference || 'N/A'} | Prix: <span style={{ color: '#2e7d32' }}>€{formData.price || '0.00'}</span>
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 3,
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}>
              {formData.description || 'Aucune description fournie'}
            </Typography>

            <Divider sx={{ my: 2, borderColor: '#38598b' }} />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Hauteur:
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.height || 'N/A'} cm
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Largeur:
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.width || 'N/A'} cm
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Épaisseur:
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.thickness || 'N/A'} mm
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Malle;