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
}));

const conceptionOptions = [
  { value: ' Résine 32 mm en plastique recyclé imitation bois', label: ' Résine 32 mm en plastique recyclé imitation bois' },
];

const poteauxOptions = [
  { value: '12 x 12 cm, poteaux en bois', label: '12 x 12 cm, poteaux en bois' },
];

const toleOptions = [
  { value: ' bac acier anti condensation (63 centièmes)  (standard), possibilité OPTION ISOLE:  40 mm', label: ' bac acier anti condensation (63 centièmes)  (standard), possibilité OPTION ISOLE:  40 mm' },
];

const couleurOptions = [
  { value: 'ardoise (RAL 5008)', label: 'Ardoise (RAL 5008)' },
  { value: 'tuile (RAL 8012)', label: 'Tuile (RAL 8012)' },
  { value: 'tuile (RAL 8012) ou Ardoise (RAL 5008)', label: 'Tuile (RAL 8012) ou Ardoise (RAL 5008)' },
];

const ouvertureOptions = [
  { value: ' Porte double battants 1.20 x 2.20 (verrous inclus)', label: 'Porte double battants 1.20 x 2.20 (verrous inclus)' },
];

const boxOptions = [
  { value: '2 Box EN LIGNE EN RESINE(3*3)', label: '2 Box EN LIGNE EN RESINE(3*3)' },
  { value: '2 Box EN LIGNE EN RESINE(3*4)', label: '2 Box EN LIGNE EN RESINE(3*4)' },
  { value: '2 Box EN LIGNE EN RESINE(3*3.5)', label: '2 Box EN LIGNE EN RESINE(3*3.5)' },
  { value: '2 Box EN LIGNE EN RESINE(4*4)', label: '2 Box EN LIGNE EN RESINE(4*4)' },
];

const TwoBoxResin = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
    longueur: '',
    profondeur: '',
    pannes: '',
    ossatureM: '',
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
      longueur: '',
      profondeur: '',
      pannes: '',
      ossatureM: '',
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

      const response = await axios.post(`http://localhost:5000/api/twoboxresin`, formPayload, {
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isSmallScreen ? 'column' : 'row',
      minHeight: '100vh',
      p: isExtraSmallScreen ? 1 : 2 
    }}>
      <Toaster position="top-right" />
      
      {/* Left Side Form */}
      <Box sx={{ 
        width: isSmallScreen ? '100%' : '50%', 
        pr: isSmallScreen ? 0 : 2,
        mb: isSmallScreen ? 3 : 0
      }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontFamily: 'Savate', 
          fontWeight: 'bolder', 
          textAlign: 'center', 
          color: '#38598b', 
          textTransform: 'uppercase',
          mb: 4,
          fontSize: isExtraSmallScreen ? '1.5rem' : '2rem'
        }}>
          Création d'une fiche produit 2 BOX
        </Typography>

        <StyledPaper elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Row 1: Référence et Nom */}
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
                <StyledFormControl>
                  <InputLabel id="name-label">Nom du produit</InputLabel>
                  <Select
                    labelId="name-label"
                    id="name-select"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    label="Nom du produit"
                    required
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
                />
              </Grid>

              {/* Row 3: Prix et Type */}
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
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                  </Select>
                </StyledFormControl>
              </Grid>

              {/* Row 4: Conception et Épaisseur */}
              <Grid item xs={12} sm={6}>
                <StyledFormControl>
                  <InputLabel id="conception-select-label">Conception</InputLabel>
                  <Select
                    labelId="conception-select-label"
                    name="conception"
                    value={formData.conception}
                    onChange={handleInputChange}
                    label="Conception"
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
                />
              </Grid>

              {/* Row 5: Hauteurs */}
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
                />
              </Grid>

              {/* Row 6: Avancée */}
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Longueur (m)"
                  name="longueur"
                  type="number"
                  value={formData.longueur}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Pannes"
                  name="pannes"
                  type="text"
                  value={formData.pannes}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Profondeur (m)"
                  name="profondeur"
                  type="number"
                  value={formData.profondeur}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Ossature Metallique (mm)"
                  name="ossatureM"
                  type="number"
                  value={formData.ossatureM}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Option"
                  name="option"
                  value={formData.option}
                  onChange={handleInputChange}
                  placeholder="Options spéciales..."
                />
              </Grid>

              {/* Row 7: Poteaux et Tôle */}
              <Grid item xs={12} sm={6}>
                <StyledFormControl>
                  <InputLabel id="poteaux-select-label">Poteaux</InputLabel>
                  <Select
                    labelId="poteaux-select-label"
                    name="poteaux"
                    value={formData.poteaux}
                    onChange={handleInputChange}
                    label="Poteaux"
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
              <Grid item xs={12} sm={6}>
                <StyledFormControl>
                  <InputLabel id="couleur-select-label">Couleur</InputLabel>
                  <Select
                    labelId="couleur-select-label"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleInputChange}
                    label="Couleur"
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
              <Grid item xs={12}>
                <StyledTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Description du produit 2 Box...'
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={12} sx={{ 
                display: 'flex', 
                justifyContent: isExtraSmallScreen ? 'center' : 'flex-end', 
                alignItems: 'center',
                gap: 1
              }}>
                <IconButton 
                  onClick={handleReset}
                  sx={{ 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#e0e0e0' },
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
                    minWidth: 160
                  }}
                >
                  Créer les 2 Box
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Box>

      {/* Divider - Only show on larger screens */}
      {!isSmallScreen && (
        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ mx: 2, borderColor: '#38598b' }} 
        />
      )}

      {/* Show horizontal divider on small screens */}
      {isSmallScreen && (
        <Divider 
          orientation="horizontal" 
          flexItem 
          sx={{ my: 2, borderColor: '#38598b', width: '100%' }} 
        />
      )}

      {/* Preview */}
      <Box sx={{ 
        width: isSmallScreen ? '100%' : '50%', 
        backgroundColor: 'white', 
        p: isExtraSmallScreen ? 1 : 3 
      }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontFamily: 'Savate', 
          fontWeight: 'bolder', 
          textAlign: 'center', 
          color: '#38598b', 
          textTransform: 'uppercase',
          mb: 4,
          fontSize: isExtraSmallScreen ? '1.5rem' : '2rem'
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
              height={isSmallScreen ? '200' : '280'}
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
              fontSize: isExtraSmallScreen ? '1rem' : '1.25rem'
            }}>
              {formattedProductName}
            </Typography>
            <Typography sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 2,
              fontSize: isExtraSmallScreen ? '0.875rem' : '1rem'
            }}>
              Réf: {formData.reference || 'N/A'} | Prix: <span style={{ color: '#2e7d32' }}>€{formData.price || '0.00'}</span>
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#38598b',
              fontFamily: 'Savate',
              mb: 3,
              fontSize: isExtraSmallScreen ? '0.8rem' : '0.9rem'
            }}>
              {formData.description || 'Aucune description fournie'}
            </Typography>

            <Divider sx={{ my: 2, borderColor: '#38598b' }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Conception:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.conception || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Épaisseur:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.epaisseur || 'N/A'} mm
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  H. Partie Basse:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.hauteurPartieBasse || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Longueur:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.longueur || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Profondeur:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.profondeur || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Pannes:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.pannes || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Ossature:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.ossatureM || 'N/A'} mm
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  H. Partie Haute:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.hauteurPartieHaute || 'N/A'} m
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Avancée:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.avancee || 'N/A'} ML
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Poteaux:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.poteaux || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Tôle:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.tole || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Couleur:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.couleur || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Ouverture:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
                }}>
                  {formData.ouverture || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontWeight: 'bold',
                  fontSize: isExtraSmallScreen ? '0.75rem' : '0.875rem'
                }}>
                  Option:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#38598b',
                  fontFamily: 'Savate',
                  fontSize: isExtraSmallScreen ? '0.7rem' : '0.8rem'
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

export default TwoBoxResin;