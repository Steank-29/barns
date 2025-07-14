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
  TextareaAutosize
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
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
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Savate',
    color: '#38598b',
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
}));

const Barriere = () => {
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
    <Box sx={{ display: 'flex', height: '100vh', p: 2 }}>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Savate',
            color: '#38598b',
            border: '1px solid #38598b',
          },
        }}
      />
      
      <Box sx={{ width: '50%', overflowY: 'auto', pr: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontFamily: 'Savate', 
          fontWeight: 'bolder', 
          textAlign: 'center', 
          color: '#38598b', 
          textTransform: 'uppercase',
          mb: 4
        }}>
          Création d'une barrière
        </Typography>

        <StyledPaper elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <StyledTextField
                  label="Référence"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                  sx={{ width: 250 }}
                />
                
              </Grid>

              <Grid item xs={6}>
                <StyledTextField
                  label="Nom de la barrière"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  sx={{ width: 250 }}
                />
                
              </Grid>

              <Grid item xs={6}>
                <StyledTextField
                  type="file"
                  name='image'
                  label="Image de la barrière"
                InputLabelProps={{ shrink: true }}
                onChange={handleImageChange}
                inputProps={{ accept: "image/*" }}
                sx={{ width: 250 }}
                />
              </Grid>

              <Grid item xs={6}>
                <StyledTextField
                  label="Largeur (cm)"
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mL</InputAdornment>,
                  }}
                  sx={{ width: 250 }}
                />
              </Grid>

              <Grid item xs={6}>
                <StyledTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Description de la barrière...'
                  sx={{ width: 510 }}
                />
              </Grid>

              <Grid item xs={6}>
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
                  sx={{ width: 250 }}
                />
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
                    py: 1.7,
                    fontSize: '0.9rem',
                    borderRadius: '8px',
                    width: 250,
                    ml: 2
                  }}
                >
                  Créer la fiche barrière
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#38598b' }} />

      {/* Preview */}
      <Box sx={{ width: '50%', backgroundColor: 'white', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontFamily: 'Savate', 
          fontWeight: 'bolder', 
          textAlign: 'center', 
          color: '#38598b', 
          textTransform: 'uppercase',
          mb: 4
        }}>
          Aperçu de la barrière
        </Typography>
        <Card sx={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(117, 81, 57, 0.2)'
        }}>
          {previewImage && (
            <CardMedia
              component="img"
              height="280"
              image={previewImage}
              alt="Aperçu de la barrière"
              sx={{ objectFit: 'fill' }}
            />
          )}
          <CardContent sx={{ backgroundColor: '#FFFFFF' }}>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Savate',
              color: '#38598b',
              mb: 1
            }}>
              {formData.name || 'Nom de la barrière'} — <span style={{ color: '#2e7d32' }}>€{formData.price || '0'}</span>
            </Typography>
            <Typography sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 2
            }}>
              Réf: {formData.reference || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 3
            }}>
              {formData.description || 'Aucune description fournie'}
            </Typography>

            <Divider sx={{ my: 2, borderColor: '#38598b' }} />

            <Typography variant="subtitle2" sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 3
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