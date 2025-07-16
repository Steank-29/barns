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
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
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

const Barriere = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    reference: '',
    name: '',
    price: 0,
    width: '',
    description: '',
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { 
      toast.error('Image size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Envoi en cours...');
    
    try {
      const formPayload = new FormData();
      formPayload.append('reference', formData.reference);
      formPayload.append('name', formData.name);
      formPayload.append('price', formData.price)
      formPayload.append('width', formData.width);
      formPayload.append('description', formData.description);
      formPayload.append('image', formData.image);

      const response = await axios.post(`http://localhost:5000/api/barriere`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log(response.data);
      toast.success('Barrière ajoutée avec succès !', {
        id: toastId,
        duration: 4000,
      });
      
      setFormData({
        reference: '',
        name: '',
        price: 0,
        width: '',
        description: '',
        image: null
      });
      setPreviewImage(null);
    } catch (error) {
      console.error('Erreur lors de l\'envoi ', error);
      toast.error('Erreur lors de la création de la barrière', {
        id: toastId,
        duration: 4000,
      });
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
        position={isMobile ? "top-center" : "top-center"}
        toastOptions={{
          style: {
            fontFamily: 'Savate',
            color: '#38598b',
            border: '1px solid #38598b',
            fontSize: isMobile ? '0.8rem' : '1rem'
          },
        }}
      />
      
      {/* Form Section */}
      <Box sx={{ 
        width: isMobile ? '100%' : '50%', 
        pr: isMobile ? 0 : 0.5 
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ 
          fontFamily: 'Savate', 
          fontWeight: 'bolder', 
          textAlign: 'center', 
          color: '#38598b', 
          textTransform: 'uppercase',
          mb: 4,
          fontSize: isMobile ? '1.4rem' : '2rem'
        }}>
          Création d'une barrière
        </Typography>

        <StyledPaper elevation={6}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Référence"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Nom de la barrière"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  type="file"
                  name='image'
                  label="Image de la barrière"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleImageChange}
                  inputProps={{ accept: "image/*" }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Largeur (cm)"
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mL</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Description de la barrière...'
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
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
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
                    py: isMobile ? 1 : 1.7,
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    borderRadius: '8px',
                    height: '56px', // Match text field height
                    mt: isMobile ? 0 : '8px'
                  }}
                >
                  Créer la fiche barrière
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Box>

      {/* Divider - Only show on desktop */}
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

      {/* Preview Section */}
      <Box sx={{ 
        width: isMobile ? '100%' : '50%', 
        backgroundColor: isMobile ? 'transparent' : 'white', 
        p: isMobile ? 0 : 3,
        mt: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ 
          fontFamily: 'Savate', 
          fontWeight: 'bolder', 
          textAlign: 'center', 
          color: '#38598b', 
          textTransform: 'uppercase',
          mb: 4,
          fontSize: isMobile ? '1.4rem' : '2rem'
        }}>
          Aperçu de la barrière
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
              alt="Aperçu de la barrière"
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
              {formData.name || 'Nom de la barrière'} — <span style={{ color: '#2e7d32' }}>€{formData.price || '0'}</span>
            </Typography>
            <Typography sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 2,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Réf: {formData.reference || 'N/A'}
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

            <Typography variant="subtitle2" sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 3,
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}>
              Largeur : {formData.width || 'N/A'} mL
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Barriere;