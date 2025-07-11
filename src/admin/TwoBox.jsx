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

const conceptionOptions = [
  { value: ' Bois Français 100% Douglas, Classe III Naturel', label: ' Bois Français 100% Douglas, Classe III Naturel' },
];

const poteauxOptions = [
  { value: '12 x 12 cm, poteaux en bois', label: '12 x 12 cm, poteaux en bois' },
];

const toleOptions = [
  { value: ' bac acier anti-condensation (standard)', label: ' bac acier anti-condensation  (standard)' },
  { value: 'bac acier anti-condensation (standard) avec option 10 mm', label: 'bac acier anti-condensation (standard) avec option 10 mm' },
  { value: 'bac acier anti-condensation (standard) avec option 40 mm', label: 'bac acier anti-condensation (standard) avec option 40 mm' },
];

const couleurOptions = [
  { value: 'ardoise (RAL 5008)', label: 'Ardoise (RAL 5008)' },
  { value: 'tuile (RAL 8012)', label: 'Tuile (RAL 8012)' },
  { value: 'tuile (RAL 8012) ou Ardoise (RAL 5008)', label: 'Tuile (RAL 8012) ou Ardoise (RAL 5008)' },
];

const ouvertureOptions = [
  { value: 'porte battante deux volets avec huisserie galvanisée et entourage en 50 mm', 
    label: 'porte battante deux volets avec huisserie galvanisée et entourage en 50 mm' 
},
];

const boxOptions = [
  { value: '2 Box EN LIGNE BOIS ROUGE(3*3)', label: '2 Box EN LIGNE BOIS ROUGE(3*3)' },
  { value: '2 Box EN LIGNE BOIS ROUGE(3*4)', label: '2 Box EN LIGNE BOIS ROUGE(3*4)' },
  { value: '2 Box EN LIGNE BOIS ROUGE(3*3.5)', label: '2 Box EN LIGNE BOIS ROUGE(3*3.5)' },
  { value: '2 Box EN LIGNE BOIS ROUGE(4*4)', label: '2 Box EN LIGNE BOIS ROUGE(4*4)' },
];

const TwoBox = () => {
  const [formData, setFormData] = useState({
    reference: '',
    name: '',
    image: null,
    price: 0,
    type: '',
    conception: '',
    epaisseur: '',
    hauteurPartieBasse: '',
    hauteurPartieHaute: '',
    avancee: '',
    poteaux: '',
    tole: '',
    option: '',
    couleur: '',
    ouverture: '',
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
      name: '',
      image: null,
      price: 0,
      type: '',
      conception: '',
      epaisseur: '',
      hauteurPartieBasse: '',
      hauteurPartieHaute: '',
      avancee: '',
      poteaux: '',
      tole: '',
      option: '',
      couleur: '',
      ouverture: '',
      description: '',
    });
    setPreviewImage(null);
  };

  // const apiUrl = process.env.RENDER_API_URL || 'https://barns.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.includes('Box')) {
      toast.error('Le nom du produit doit contenir le mot "Box"');
      return;
    }

    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formPayload.append(key, formData[key]);
        } else if (key !== 'image') {
          formPayload.append(key, formData[key]);
        }
      });

      const response = await axios.post(`http://localhost:5000/api/twobox`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Produit 2 Box ajouté avec succès !');
      console.log(response.data);
    } catch (error) {
      toast.error("Erreur lors de la création du produit");
      console.error('Erreur lors de l\'envoi ', error);
    }
  };

  const formattedProductName = `${formData.name || 'Nom du produit'}  ${formData.type || 'Type'} `;

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
          Création d'une fiche produit 2 BOX
        </Typography>

        <StyledPaper elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Row 1: Référence et Nom */}
              <Grid item xs={6}>
                <StyledTextField
                  label="Référence"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                  sx={{ width: 220 }}
                />
              </Grid>
            <Grid item xs={6}>
            <StyledFormControl>
                <InputLabel id="name-select-label">Nom du produit</InputLabel>
                <Select
                labelId="name-select-label"
                id="name-select"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                label="Nom du produit"
                required
                sx={{ width: 220 }}
                >
                {boxOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
                </Select>
            </StyledFormControl>
            </Grid>

              {/* Row 2: Image */}
              <Grid item xs={12}>
                <StyledTextField
                  type="file"
                  label="Image du produit"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleImageChange}
                  inputProps={{ accept: "image/*" }}
                  sx={{ width: 220 }}
                />
              </Grid>

              {/* Row 3: Prix et Type */}
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
                  sx={{ width: 220 }}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledFormControl>
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Type"
                    sx={{ width: 220 }}
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                  </Select>
                </StyledFormControl>
              </Grid>

              {/* Row 4: Conception et Épaisseur */}
              <Grid item xs={6}>
                <StyledFormControl>
                  <InputLabel id="conception-select-label">Conception</InputLabel>
                  <Select
                    labelId="conception-select-label"
                    name="conception"
                    value={formData.conception}
                    onChange={handleInputChange}
                    label="Conception"
                    sx={{ width: 220 }}
                  >
                    {conceptionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  label="Épaisseur (mm)"
                  name="epaisseur"
                  type="number"
                  value={formData.epaisseur}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                  }}
                  sx={{ width: 220 }}
                />
              </Grid>

              {/* Row 5: Hauteurs */}
              <Grid item xs={6}>
                <StyledTextField
                  label="Hauteur partie basse (m)"
                  name="hauteurPartieBasse"
                  type="number"
                  value={formData.hauteurPartieBasse}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }}
                  sx={{ width: 220 }}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  label="Hauteur partie haute (m)"
                  name="hauteurPartieHaute"
                  type="number"
                  value={formData.hauteurPartieHaute}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }}
                  sx={{ width: 220 }}
                />
              </Grid>

              {/* Row 6: Avancée */}
              <Grid item xs={6}>
                <StyledTextField
                  label="Avancée (ML)"
                  name="avancee"
                  type="number"
                  value={formData.avancee}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">ML</InputAdornment>,
                  }}
                  sx={{ width: 220 }}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  label="Option"
                  name="option"
                  value={formData.option}
                  onChange={handleInputChange}
                  placeholder="Options spéciales..."
                  sx={{ width: 220 }}
                />
              </Grid>

              {/* Row 7: Poteaux et Tôle */}
              <Grid item xs={6}>
                <StyledFormControl>
                  <InputLabel id="poteaux-select-label">Poteaux</InputLabel>
                  <Select
                    labelId="poteaux-select-label"
                    name="poteaux"
                    value={formData.poteaux}
                    onChange={handleInputChange}
                    label="Poteaux"
                    sx={{ width: 220 }}
                  >
                    {poteauxOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
              <Grid item xs={6}>
                <StyledFormControl>
                  <InputLabel id="tole-select-label">Tôle</InputLabel>
                  <Select
                    labelId="tole-select-label"
                    name="tole"
                    value={formData.tole}
                    onChange={handleInputChange}
                    label="Tôle"
                    sx={{ width: 220 }}
                  >
                    {toleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>

              {/* Row 8: Couleur et Ouverture */}
              <Grid item xs={6}>
                <StyledFormControl>
                  <InputLabel id="couleur-select-label">Couleur</InputLabel>
                  <Select
                    labelId="couleur-select-label"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleInputChange}
                    label="Couleur"
                    sx={{ width: 220 }}
                  >
                    {couleurOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
              <Grid item xs={6}>
                <StyledFormControl>
                  <InputLabel id="ouverture-select-label">Ouverture</InputLabel>
                  <Select
                    labelId="ouverture-select-label"
                    name="ouverture"
                    value={formData.ouverture}
                    onChange={handleInputChange}
                    label="Ouverture"
                    sx={{ width: 460 }}
                  >
                    {ouvertureOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>

              {/* Row 9: Description */}
              <Grid item xs={8}>
                <StyledTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Description du produit 2 Box...'
                  sx={{ width: 460 }}
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
                  Créer les 2 Box
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
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Conception:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.conception || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Épaisseur:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.epaisseur || 'N/A'} mm
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  H. Partie Basse:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.hauteurPartieBasse || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  H. Partie Haute:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.hauteurPartieHaute || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Avancée:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.avancee || 'N/A'} ML
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Poteaux:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.poteaux || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Tôle:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.tole || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Couleur:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.couleur || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Ouverture:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.ouverture || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold'
                }}>
                  Option:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                }}>
                  {formData.option || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TwoBox;