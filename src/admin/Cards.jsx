import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
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

const optionLabels = {
  metre3: '3 mètres',
  metre4: '4 mètres',
  grille3ml: 'avec grille 3ml',
  grille35: 'avec grille 3,5ml',
  grille4: 'avec grille 4ml',
  cygne3: 'avec cole de cygne 300',
  cygne35: 'avec cole de cygne 350',
  cygne4: 'avec cole de cygne 400',
};

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
    options: {
      metre3: { selected: false, priceIncrease: 0 },
      metre4: { selected: false, priceIncrease: 0 },
      grille3ml: { selected: false, priceIncrease: 0 },
      grille35: { selected: false, priceIncrease: 0 },
      grille4: { selected: false, priceIncrease: 0 },
      cygne3: { selected: false, priceIncrease: 0 },
      cygne35: { selected: false, priceIncrease: 0 },
      cygne4: { selected: false, priceIncrease: 0 },
    }
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

  const handleOptionChange = (optionName) => (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionName]: {
          ...prev.options[optionName],
          selected: checked
        }
      }
    }));
  };

  const handleOptionPriceChange = (optionName) => (e) => {
    const { value } = e.target;
    const parsedValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionName]: {
          ...prev.options[optionName],
          priceIncrease: parsedValue
        }
      }
    }));
  };

  const calculateTotalPrice = () => {
    let total = parseFloat(formData.price) || 0;
    Object.values(formData.options).forEach(option => {
      if (option.selected) {
        total += parseFloat(option.priceIncrease) || 0;
      }
    });
    return total.toFixed(2);
  };

  const apiUrl = process.env.RENDER_API_URL || 'https://barns.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      formPayload.append('reference', formData.reference);
      formPayload.append('productName', formData.productName);
      formPayload.append('price', calculateTotalPrice());
      formPayload.append('height', formData.height);
      formPayload.append('width', formData.width);
      formPayload.append('thickness', formData.thickness);
      formPayload.append('description', formData.description);
      formPayload.append('image', formData.image);

      const selectedOptions = Object.entries(formData.options)
        .filter(([_, opt]) => opt.selected)
        .map(([key, opt]) => ({
          name: key,
          priceIncrease: opt.priceIncrease
        }));
      formPayload.append('options', JSON.stringify(selectedOptions));

      const response = await axios.post(`${apiUrl}/api/products`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      alert('Produit ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi ', error);
      alert('Erreur lors de la création du produit');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', p: 2 }}>
      {/* Left Side Form */}
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Référence"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Nom du produit"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  type="file"
                  label="Image du produit"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleImageChange}
                  inputProps={{ accept: "image/*" }}
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
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Prix de base (€)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Prix total"
                  value={calculateTotalPrice()}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ 
                  color: '#38598b', 
                  fontFamily: 'Savate',
                  mb: 1
                }}>
                  Description
                </Typography>
                <StyledTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Description du produit...'
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#38598b', 
                  fontFamily: 'Savate',
                  mb: 2
                }}>
                  Options supplémentaires
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(formData.options).map(([key, option]) => (
                    <Grid container item spacing={1} key={key} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={option.selected}
                              onChange={handleOptionChange(key)}
                              color="primary"
                              sx={{
                                color: '#38598b',
                                '&.Mui-checked': {
                                  color: '#38598b',
                                },
                              }}
                            />
                          }
                          label={optionLabels[key]}
                          sx={{ 
                            color: '#38598b',
                            fontFamily: 'Savate'
                          }}
                        />
                      </Grid>
                      {option.selected && (
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            label="Montant à ajouter (€)"
                            type="number"
                            value={option.priceIncrease}
                            onChange={handleOptionPriceChange(key)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">€</InputAdornment>,
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ mt: 3 }}>
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
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: '8px'
                  }}
                >
                  Créer la fiche produit
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
              {formData.productName || 'Nom du produit'} — <span style={{ color: '#2e7d32' }}>€{calculateTotalPrice()}</span>
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
              mb: 1
            }}>
              Hauteur : {formData.height || 'N/A'} cm
            </Typography>
            <Typography variant="subtitle2" sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 1
            }}>
              Largeur : {formData.width || 'N/A'} cm
            </Typography>
            <Typography variant="subtitle2" sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 3
            }}>
              Épaisseur : {formData.thickness || 'N/A'} mm
            </Typography>

            {Object.entries(formData.options).some(([_, opt]) => opt.selected && parseFloat(opt.priceIncrease) > 0) && (
              <>
                <Divider sx={{ my: 2, borderColor: '#38598b' }} />
                <Typography variant="subtitle1" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  mb: 1
                }}>
                  Options sélectionnées:
                </Typography>
                <Box>
                  {Object.entries(formData.options).map(([key, opt]) =>
                    opt.selected && parseFloat(opt.priceIncrease) > 0 ? (
                      <FormControlLabel
                        key={key}
                        control={<Checkbox checked disabled sx={{ color: '#38598b' }} />}
                        label={`${optionLabels[key]} (+${opt.priceIncrease} €)`}
                        sx={{ 
                          color: '#38598b',
                          fontFamily: 'Savate',
                          display: 'block',
                          ml: 0.5,
                          mb: 0.5
                        }}
                      />
                    ) : null
                  )}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Cards;