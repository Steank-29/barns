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



const handleSubmit = async (e) => {
  e.preventDefault();
  const apiUrl = process.env.RENDER_API_URL;

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

    // Ajouter les options sélectionnées (nom + prix)
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
    console.error('Erreur lors de l’envoi :', error);
    alert('Erreur lors de la création du produit');
  }
};


  return (
    <Box sx={{ display: 'flex', height: '100vh', p: 2 }}>
      {/* Left Side Form */}
      <Box sx={{ width: '50%', overflowY: 'auto', pr: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Savate', fontWeight: 'bolder', textAlign: 'center', color: '#755139', textTransform: 'uppercase' }}>
          Création d'une fiche produit FACADE
        </Typography>

        <StyledPaper elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Référence"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                  sx={{ fontFamily: 'Savate'}}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom du produit"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  sx={{ fontFamily: 'Savate'}}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="file"
                  label="Image du produit"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleImageChange}
                  inputProps={{ accept: "image/*" }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Hauteur (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  sx={{ fontFamily: 'Savate'}}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Largeur (cm)"
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  sx={{ fontFamily: 'Savate'}}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Épaisseur (cm)"
                  name="thickness"
                  type="number"
                  value={formData.thickness}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                  }}
                  sx={{ fontFamily: 'Savate'}}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prix de base (€)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  required
                  sx={{ fontFamily: 'Savate'}}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prix total"
                  value={calculateTotalPrice()}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    readOnly: true,
                  }}
                  sx={{ fontFamily: 'Savate'}}
                />
              </Grid>

              <Grid item xs={12}>
                <TextareaAutosize
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  minRows={4}
                  style={{width: 350, height:40}}
                  placeholder='Description du produit...'
                  sx={{ fontFamily: 'Savate'}}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
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
                            />
                          }
                          label={optionLabels[key]}
                        />
                      </Grid>
                      {option.selected && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Montant à ajouter (€)"
                            type="number"
                            value={option.priceIncrease}
                            onChange={handleOptionPriceChange(key)}
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">€</InputAdornment>,
                            }}
                            sx={{ fontFamily: 'Savate'}}
                          />
                        </Grid>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ fontFamily: 'Savate', fontWeight: 'bold', backgroundColor: '#755139', color:'#F2EDD7', '&:hover': { backgroundColor: '#F2EDD7', color:'#755139' } }}
                >
                  Créer la fiche produit
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

      {/* Preview */}
      <Box sx={{ width: '50%', backgroundColor: '#F2EDD7'}}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Savate' , fontWeight: 'bolder', textAlign: 'center', color: '#755139', textTransform: 'uppercase' }}>
          Aperçu du produit
        </Typography>
        <Card>
          {previewImage && (
            <CardMedia
              component="img"
              height="280"
              image={previewImage}
              alt="Aperçu du produit"
            />
          )}
          <CardContent>
            <Typography variant="h6">
              {formData.productName} — <span style={{ color: '#2e7d32' }}>€{calculateTotalPrice()}</span>
            </Typography>
            <Typography color="text.secondary">Réf: {formData.reference}</Typography>
            <Typography variant="body2" mt={1}>{formData.description}</Typography>

            <Typography variant="subtitle2" mt={2}>
              Hauteur : {formData.height} cm
            </Typography>
            <Typography variant="subtitle2">
              Largeur : {formData.width} cm
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Épaisseur : {formData.thickness} cm
            </Typography>

            <Box mt={2}>
              {Object.entries(formData.options).map(([key, opt]) =>
                opt.selected && parseFloat(opt.priceIncrease) > 0 ? (
                  <FormControlLabel
                    key={key}
                    control={<Checkbox checked disabled />}
                    label={`${optionLabels[key]} (+${opt.priceIncrease} €)`}
                  />
                ) : null
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Cards;
