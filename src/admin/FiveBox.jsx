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
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  },
  '& .MuiSelect-select': {
    fontFamily: 'Savate',
    color: '#38598b',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },
  width: '220px',
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
  { value: ' porte battante deux volets  avec huisserie galvanisée et entourage en 50 mm', 
    label: ' porte battante deux volets  avec huisserie galvanisée et entourage en 50 mm' 
  },
];

const boxOptions = [
  { value: '5 Box EN LIGNE BOIS ROUGE(3*3)', label: '5 Box EN LIGNE BOIS ROUGE(3*3)' },
  { value: '5 Box EN LIGNE BOIS ROUGE(3*4)', label: '5 Box EN LIGNE BOIS ROUGE(3*4)' },
  { value: '5 Box EN LIGNE BOIS ROUGE(3*3.5)', label: '5 Box EN LIGNE BOIS ROUGE(3*3.5)' },
  { value: '5 Box EN LIGNE BOIS ROUGE(4*4)', label: '5 Box EN LIGNE BOIS ROUGE(4*4)' }
];

const FiveBox = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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

      const response = await axios.post(`http://localhost:5000/api/fivebox`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Produit 5 Box ajouté avec succès !');
      console.log(response.data);
    } catch (error) {
      toast.error("Erreur lors de la création du produit");
      console.error('Erreur lors de l\'envoi ', error);
    }
  };

  const formattedProductName = `${formData.name || 'Nom du produit'}  ${formData.type || 'Type'} `;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
      p: isMobile ? 1 : 2,
      gap: isMobile ? 2 : 0
    }}>
      {/* Left Side Form */}
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
          Création d'une fiche produit 5 BOX
        </Typography>

        <StyledPaper elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={isMobile ? 1 : 2}>
              {/* Reference and Name */}
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
                    fullWidth
                  >
                    {boxOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <StyledTextField
                  type="file"
                  label="Image du produit"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleImageChange}
                  inputProps={{ accept: "image/*" }}
                  fullWidth
                />
              </Grid>

              {/* Price and Type */}
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
                <StyledFormControl>
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Type"
                    fullWidth
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                  </Select>
                </StyledFormControl>
              </Grid>

              {/* Conception and Thickness */}
              <Grid item xs={12} sm={6}>
                <StyledFormControl>
                  <InputLabel id="conception-select-label">Conception</InputLabel>
                  <Select
                    labelId="conception-select-label"
                    name="conception"
                    value={formData.conception}
                    onChange={handleInputChange}
                    label="Conception"
                    fullWidth
                  >
                    {conceptionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Épaisseur (mm)"
                  name="epaisseur"
                  type="number"
                  value={formData.epaisseur}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>

              {/* Heights */}
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Hauteur partie basse (m)"
                  name="hauteurPartieBasse"
                  type="number"
                  value={formData.hauteurPartieBasse}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Hauteur partie haute (m)"
                  name="hauteurPartieHaute"
                  type="number"
                  value={formData.hauteurPartieHaute}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>

              {/* Advance and Option */}
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Avancée (ML)"
                  name="avancee"
                  type="number"
                  value={formData.avancee}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">ML</InputAdornment>,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Option"
                  name="option"
                  value={formData.option}
                  onChange={handleInputChange}
                  placeholder="Options spéciales..."
                  fullWidth
                />
              </Grid>

              {/* Posts and Sheet */}
              <Grid item xs={12} sm={6}>
                <StyledFormControl>
                  <InputLabel id="poteaux-select-label">Poteaux</InputLabel>
                  <Select
                    labelId="poteaux-select-label"
                    name="poteaux"
                    value={formData.poteaux}
                    onChange={handleInputChange}
                    label="Poteaux"
                    fullWidth
                  >
                    {poteauxOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledFormControl>
                  <InputLabel id="tole-select-label">Tôle</InputLabel>
                  <Select
                    labelId="tole-select-label"
                    name="tole"
                    value={formData.tole}
                    onChange={handleInputChange}
                    label="Tôle"
                    fullWidth
                  >
                    {toleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>

              {/* Color and Opening */}
              <Grid item xs={12} sm={6}>
                <StyledFormControl>
                  <InputLabel id="couleur-select-label">Couleur</InputLabel>
                  <Select
                    labelId="couleur-select-label"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleInputChange}
                    label="Couleur"
                    fullWidth
                  >
                    {couleurOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
              <Grid item xs={12}>
                <StyledFormControl>
                  <InputLabel id="ouverture-select-label">Ouverture</InputLabel>
                  <Select
                    labelId="ouverture-select-label"
                    name="ouverture"
                    value={formData.ouverture}
                    onChange={handleInputChange}
                    label="Ouverture"
                    fullWidth
                  >
                    {ouvertureOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <StyledTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Description du produit 5 Box...'
                />
              </Grid>

              {/* Buttons */}
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
                  Créer les 5 Box
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
              {formattedProductName}
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
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Conception:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.conception || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Épaisseur:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.epaisseur || 'N/A'} mm
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  H. Partie Basse:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.hauteurPartieBasse || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  H. Partie Haute:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.hauteurPartieHaute || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Avancée:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.avancee || 'N/A'} ML
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Poteaux:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.poteaux || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Tôle:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.tole || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Couleur:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.couleur || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Ouverture:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  {formData.ouverture || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}>
                  Option:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
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

export default FiveBox;