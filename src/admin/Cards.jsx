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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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

const facadeTypes = [
  { value: 'De Box 300 BOIS', label: 'De Box 300 BOIS' },
  { value: 'De Box 400 BOIS', label: 'De Box 400 BOIS' },
  { value: 'Avec Col De Cygne 300', label: 'Avec Col De Cygne 300' },
  { value: 'Avec Col De Cygne 350', label: 'Avec Col De Cygne 350' },
  { value: 'Avec Col De Cygne 400', label: 'Avec Col De Cygne 400' },
  { value: 'Retour Avec Grille 300', label: 'Retour Avec Grille 300' },
  { value: 'Retour Avec Grille 350', label: 'Retour Avec Grille 350' },
  { value: 'Retour Avec Grille 400', label: 'Retour Avec Grille 400' },
  { value: 'Open Porte Coulissante 300', label: 'Open Porte Coulissante 300' },
  { value: 'Open Porte Coulissante 350', label: 'Open Porte Coulissante 350' },
  { value: 'DEMOBOX 3M', label: 'DEMOBOX 3M' },
  { value: 'Open Porte Battante', label: 'Open Porte Battante' },
  { value: 'Open 4m Porte Battante', label: 'Open 4m Porte Battante' },
  { value: 'LUNA 3.74M BOIS Exotique Avec Ouverture Totale', label: 'LUNA 3.74M BOIS Exotique Avec Ouverture Totale' },
  { value: 'Retour Avec Grille 3ml ,hauteur : 2.20ml', label: 'Retour Avec Grille 3ml ,hauteur : 2.20ml' },
  { value: 'Retour Avec Grille 3.5ml ,hauteur : 2.20ml', label: 'Retour Avec Grille 3.5ml ,hauteur : 2.20ml' },
  { value: 'Retour Avec Grille 4ml ,hauteur : 2.20ml', label: 'Retour Avec Grille 4ml ,hauteur : 2.20ml' },
];

const Cards = () => {
  const [formData, setFormData] = useState({
    reference: '',
    image: null,
    productName: '',
    price: 0,
    height: '',
    width: '',
    thickness: '',
    description: '',
    type: '',
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
      type: '',
    });
    setPreviewImage(null);
  };

  // const apiUrl = process.env.RENDER_API_URL || 'https://barns.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productName.includes('Facade')) {
      toast.error('Le nom du produit doit contenir le mot "Façade"');
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append('reference', formData.reference);
      formPayload.append('productName', formattedProductName);
      formPayload.append('price', formData.price);
      formPayload.append('height', formData.height);
      formPayload.append('width', formData.width);
      formPayload.append('thickness', formData.thickness);
      formPayload.append('description', formData.description);
      formPayload.append('type', formData.type);
      formPayload.append('image', formData.image);

      const response = await axios.post(`http://localhost:5000/api/facade`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Produit ajouté avec succès !');
      console.log(response.data);
    } catch (error) {
      toast.error("Erreur lors de la création du produit");
      console.error('Erreur lors de l\'envoi ', error);
    }
  };

  const formattedProductName = `${formData.productName || 'Nom du produit'} ${facadeTypes.find(t => t.value === formData.type)?.label || 'N/A'} `;

  return (
    <Box sx={{ display: 'flex', height: '100vh', p: 2 }}>
      {/* Left Side Form */}
      <Toaster position="top-right" />
      <Box sx={{ width: '50%', overflowY: 'auto', pr: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontFamily: 'Savate', 
          fontWeight: 'bolder', 
          textAlign: 'center', 
          color: '#38598b', 
          textTransform: 'uppercase',
          mb: 4
        }}>
          Création d'une fiche produit FACADE
        </Typography>

        <StyledPaper elevation={3}>
          <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Row 1: Référence (full width) */}
            <Grid item xs={12}>
              <StyledTextField
                label="Référence"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                required
                sx={{ width: 250 }}
              />
            </Grid>

            {/* Row 2: Nom, Type, Taille */}
            <Grid item xs={4}>
              <StyledTextField
                label="Nom de Façade"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                helperText="Doit contenir 'Façade'"
                sx={{ width: 250 }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledFormControl>
                <InputLabel id="type-select-label">Type de façade</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type de façade"
                  sx={{ width: 250 }}
                  >
                  {facadeTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Grid>

            {/* Row 3: Image (full width) */}
            <Grid item xs={12}>
              <StyledTextField
                type="file"
                name="image"
                label="Image du produit"
                InputLabelProps={{ shrink: true }}
                onChange={handleImageChange}
                inputProps={{ accept: "image/*" }}
                sx={{ width: 250 }}
              />
            </Grid>

            {/* Row 4: Height, Width, Thickness */}
            <Grid item xs={4}>
              <StyledTextField
                label="Hauteur (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
                sx={{ width: 250 }}
              />
            </Grid>
            <Grid item xs={4}>
              <StyledTextField
                label="Largeur (cm)"
                name="width"
                type="number"
                value={formData.width}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }}
                sx={{ width: 250 }}
              />
            </Grid>
            <Grid item xs={4}>
              <StyledTextField
                label="Épaisseur (mm)"
                name="thickness"
                type="number"
                value={formData.thickness}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                }}
                sx={{ width: 250 }}
              />
            </Grid>

            {/* Row 5: Description (66%) + Prix (33%) */}

              <Grid item xs={4}>
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
            </Grid>

            <Grid item xs={4}>
              <StyledTextarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Description du Façade...'
                sx={{ width: 250 }}
              />
            </Grid>


            {/* Buttons */}
            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IconButton 
                onClick={handleReset}
                sx={{ 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '8px',
                  mr: 1,
                  '&:hover': { backgroundColor: '#e0e0e0' },
                  width: 50,

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
                  py: 1,
                  px: 2,
                  fontSize: '0.8rem',
                  borderRadius: '8px',
                  width: 160
                }}
              >
                Créer le facade
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
          Aperçu du produit
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
              alt="Aperçu du produit"
              sx={{ objectFit: 'fill' }}
            />
          )}
          <CardContent sx={{ backgroundColor: '#FFFFFF' }}>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Savate',
              color: '#38598b',
              mb: 1
            }}>
              {formattedProductName}
            </Typography>
            <Typography sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 2
            }}>
              Réf: {formData.reference || 'N/A'} | Prix: <span style={{ color: '#2e7d32' }}>€{formData.price || '0.00'}</span>
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 3
            }}>
              {formData.description || 'Aucune description fournie'}
            </Typography>

            <Divider sx={{ my: 2, borderColor: '#38598b' }} />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Hauteur:
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.height || 'N/A'} cm
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Largeur:
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.width || 'N/A'} cm
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Épaisseur:
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
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

export default Cards;