import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  useMediaQuery,
  Snackbar,
  Alert,
  Dialog,
  IconButton,
  Button,
  Paper,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useCart } from './CartContext';

import barn1 from '../assets/barn11.jpg';
import barn2 from '../assets/barn22.jpg';
import barn3 from '../assets/barn33.jpg';
import barn4 from '../assets/barn44.jpg';
import barn5 from '../assets/barn5.jpg';
import barn6 from '../assets/barn6.jpg';
import barn7 from '../assets/barn7.jpg';
import barn8 from '../assets/barn8.jpg';
import barn9 from '../assets/barn9.jpg';
import barn10 from '../assets/barn12.jpg';

const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-barn.jpg';
  if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
    return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  }
  return imageUrl;
};

const theme = createTheme({
  palette: {
    primary: { main: '#38598b' },
    secondary: { main: '#f50057' },
  },
  typography: {
    fontFamily: 'Savate, Arial, sans-serif',
  },
});

const Barn = () => {
  const { addToCart } = useCart();
  const [barns, setBarns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSlider, setOpenSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderImages] = useState([
    barn1, barn2, barn3, barn4, barn5,
    barn6, barn7, barn8, barn9, barn10
  ]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchBarns = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/barn/getallbarns');
        setBarns(response.data);
        
        // Initialize quantities
        const initialQuantities = {};
        response.data.forEach(barn => {
          initialQuantities[barn._id] = 1; // Default to Lot de 4
        });
        setQuantities(initialQuantities);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBarns();
  }, []);

  const lotOptions = [
    { value: 1, label: 'Lot de 4', multiplier: 1 },
    { value: 2, label: 'Lot de 6', multiplier: 1.5 },
    { value: 3, label: 'Lot de 8', multiplier: 2 },
    { value: 4, label: 'Lot de 10', multiplier: 2.5 },
    { value: 5, label: 'Lot de 20', multiplier: 5 },
    { value: 6, label: 'Lot de 50', multiplier: 12.5 },
    { value: 7, label: 'Lot de 100', multiplier: 25 }
  ];

  const calculatePrice = (basePrice, quantityId) => {
    const selectedOption = lotOptions.find(opt => opt.value === quantityId);
    if (!selectedOption) return basePrice;
    return Math.round(basePrice * selectedOption.multiplier);
  };

  const handleQuantityChange = (barnId, newValue) => {
    setQuantities(prev => ({
      ...prev,
      [barnId]: parseInt(newValue)
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const types = [...new Set(barns.map(barn => barn.type))].filter(Boolean);

  const filterBarns = () => barns.filter(barn => {
    const nameMatch = (barn.productName || barn.name).toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === '' || barn.type === typeFilter;
    const priceMatch = priceFilter === '' ||
      (priceFilter === 'low' && barn.price <= 500) ||
      (priceFilter === 'high' && barn.price > 5000);
    return nameMatch && typeMatch && priceMatch;
  });

  const renderBarnDetails = (barn) => {
    const details = [];
    if (barn.type) details.push(`Type: ${barn.type}`);
    if (barn.material) details.push(`Matériau: ${barn.material}`);
    if (barn.dimensions) details.push(`Dimensions: ${barn.dimensions}`);
    if (barn.capacity) details.push(`Capacité: ${barn.capacity}`);
    if (barn.features) details.push(`Caractéristiques: ${barn.features}`);
    if (barn.color) details.push(`Couleur: ${barn.color}`);

    return (
      <Stack spacing={0.5} sx={{ mt: 2 }}>
        {details.map((detail, i) => (
          <Typography key={i} variant="body2" sx={{ fontSize: '0.8rem' }}>{detail}</Typography>
        ))}
      </Stack>
    );
  };

  if (loading) return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" mt={2}>Chargement des écuries...</Typography>
      </Container>
    </ThemeProvider>
  );

  if (error) return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Erreur: {error}</Typography>
      </Container>
    </ThemeProvider>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" mb={4}>
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            >
              <Typography 
                variant="h1" 
                color="primary" 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.5rem', lg: '4.75rem', md: '3.75rem' }, 
                  fontFamily: "Savate",
                  textShadow: '0px 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                Nos Écuries
              </Typography>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            >
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                maxWidth={800} 
                mx="auto" 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem', lg: '1.1rem', md: '1rem' }, 
                  fontFamily: "Savate",
                  lineHeight: 1.6
                }}
              >
                Des installations équestres haut de gamme, conçues par des experts pour offrir à vos chevaux un environnement sécurisé, fonctionnel et optimal pour leur bien-être et performance.
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Filters Section (unchanged) */}
        <Grid container spacing={2} justifyContent="center" mb={4}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher des écuries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { fontFamily: 'Savate, Arial, sans-serif' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{width:200}} size="small">
              <InputLabel sx={{ fontFamily: 'Savate, Arial, sans-serif' }}>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
                sx={{ fontFamily: 'Savate, Arial, sans-serif' }}
              >
                <MenuItem value="" sx={{ fontFamily: 'Savate, Arial, sans-serif' }}>Tous les types</MenuItem>
                {types.map(type => (
                  <MenuItem 
                    key={type} 
                    value={type}
                    sx={{ fontFamily: 'Savate, Arial, sans-serif', fontSize: '0.8rem' }}
                  >
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{width:200}} size="small">
              <InputLabel sx={{ fontFamily: 'Savate, Arial, sans-serif' }}>Prix</InputLabel>
              <Select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                label="Prix"
                sx={{ fontFamily: 'Savate, Arial, sans-serif' }}
              >
                <MenuItem value="" sx={{ fontFamily: 'Savate, Arial, sans-serif' }}>Toutes gammes</MenuItem>
                <MenuItem value="low" sx={{ fontFamily: 'Savate, Arial, sans-serif', fontSize: '0.8rem' }}>Moins de 500€</MenuItem>
                <MenuItem value="high" sx={{ fontFamily: 'Savate, Arial, sans-serif', fontSize: '0.8rem' }}>Plus de 5000€</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Barns List - New Design */}
        <Grid container spacing={4}>
          {filterBarns().map((barn) => (
            <Grid item xs={12} key={barn._id}>
              <Paper elevation={3} sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}>
                {/* Image Section */}
                <Box sx={{ 
                  position: 'relative', 
                  width: { xs: '100%', md: '300px' },
                  minHeight: { xs: '200px', md: 'auto' }
                }}>
                  <Avatar
                    variant="square"
                    src={getValidImageUrl(barn.imageUrl || barn.imageURL)}
                    alt={barn.productName || barn.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 0
                    }}
                  />
                  <IconButton
                    onClick={() => { setOpenSlider(true); setCurrentIndex(0); }}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                  >
                    <ImageIcon color="primary" />
                  </IconButton>
                </Box>

                {/* Content Section */}
                <Box sx={{ 
                  flex: 1, 
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ 
                      fontFamily: 'Savate',
                      fontWeight: 'bold',
                      mb: 1
                    }}>
                      {barn.productName || barn.name}
                    </Typography>
                    
                    <Chip 
                      label={barn.type || 'Standard'} 
                      color="primary" 
                      size="small" 
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="body1" color="text.secondary" sx={{
                      fontFamily: 'Savate',
                      mb: 2
                    }}>
                      {barn.description || 'Ecurie professionnelle de haute qualité'}
                    </Typography>
                    
                    {renderBarnDetails(barn)}
                  </Box>

                  {/* Price and Action Section */}
                  <Box sx={{ 
                    mt: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2
                  }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontFamily: 'Savate' }}>
                        <strong>Réf:</strong> {barn.reference}
                      </Typography>
                      
                      <FormControl size="small" sx={{ mt: 1, minWidth: 120 }}>
                        <InputLabel sx={{ fontFamily: 'Savate' }}>Lot</InputLabel>
                        <Select
                          value={quantities[barn._id] || 1}
                          onChange={(e) => handleQuantityChange(barn._id, e.target.value)}
                          label="Lot"
                          sx={{ fontFamily: 'Savate' }}
                        >
                          {lotOptions.map(option => (
                            <MenuItem 
                              key={option.value} 
                              value={option.value}
                              sx={{ fontFamily: 'Savate' }}
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                      <Typography variant="h5" color="primary" sx={{ 
                        fontFamily: 'Savate',
                        fontWeight: 'bold'
                      }}>
                        {calculatePrice(barn.price, quantities[barn._id]).toLocaleString('fr-FR')} €
                      </Typography>
                      {quantities[barn._id] > 1 && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Savate' }}>
                          ({barn.price.toLocaleString('fr-FR')} € par unité)
                        </Typography>
                      )}
                    </Box>

<Button 
  variant="contained" 
  color="primary"
  onClick={() => {
    const selectedLot = lotOptions.find(opt => opt.value === quantities[barn._id]);
    const itemToAdd = {
      ...barn,
      quantity: selectedLot ? parseInt(selectedLot.label.replace('Lot de ', '')) : 4,
      price: calculatePrice(barn.price, quantities[barn._id]),
      originalPrice: barn.price,
      lotLabel: selectedLot ? selectedLot.label : 'Lot de 4' // Add this line
    };
    addToCart(itemToAdd);
    setSnackbarMessage(`${barn.productName || barn.name} (${itemToAdd.lotLabel}) ajouté au panier`);
    setSnackbarOpen(true);
  }}
  sx={{
    fontFamily: 'Savate',
    fontWeight: 'bold',
    px: 3,
    py: 1
  }}
>
  Ajouter au panier
</Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Custom Barns Section (unchanged) */}
        <Box sx={{ mt: 8, mb: 6 }}>
          {/* ... (keep your existing custom barns section code) */}
        </Box>

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ fontFamily: 'Savate' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Dialog open={openSlider} onClose={() => setOpenSlider(false)} maxWidth="md" fullWidth>
          <Box sx={{ position: 'relative', backgroundColor: '#000' }}>
            <IconButton 
              onClick={() => setOpenSlider(false)} 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                color: 'white', 
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton 
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1))} 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: 16, 
                transform: 'translateY(-50%)', 
                color: 'white', 
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <img 
              src={sliderImages[currentIndex]} 
              alt={`barn-${currentIndex + 1}`} 
              style={{ 
                width: '100%', 
                maxHeight: '80vh', 
                objectFit: 'contain',
                display: 'block'
              }} 
            />
            <IconButton 
              onClick={() => setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1))} 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                right: 16, 
                transform: 'translateY(-50%)', 
                color: 'white', 
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default Barn;