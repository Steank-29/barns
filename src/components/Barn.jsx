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
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  useMediaQuery,
  Snackbar,
  Alert,
  Dialog,
  IconButton
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

  useEffect(() => {
    const fetchBarns = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/barn/getallbarns');
        setBarns(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBarns();
  }, []);

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
      <Box sx={{ mt: 2 }}>
        {details.map((detail, i) => (
          <Typography key={i} variant="body2" sx={{ fontSize: '0.8rem' }}>{detail}</Typography>
        ))}
      </Box>
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

        <Grid container spacing={3}>
          {filterBarns().map((barn) => (
            <Grid item xs={12} key={barn._id}>
              <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 3 }}>
                <Box sx={{ position: 'relative', width: { xs: '100%', md: '40%' } }}>
                  <CardMedia
                    component="img"
                    sx={{ height: { xs: 250, md: '100%' }, objectFit: 'cover', width: '100%' }}
                    image={getValidImageUrl(barn.imageUrl || barn.imageURL)}
                    alt={barn.productName || barn.name}
                  />
                  <IconButton
                    onClick={() => { setOpenSlider(true); setCurrentIndex(0); }}
                    sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.8)' }}
                  >
                    <ImageIcon />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{fontFamily:'Savate'}}>{barn.productName || barn.name}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{fontFamily:'Savate'}}>
                      {barn.description || 'Ecurie professionnelle'}
                    </Typography>
                    <Typography sx={{fontFamily:'Savate'}} variant="body1"><strong>Réf:</strong> {barn.reference}</Typography>
                    {renderBarnDetails(barn)}
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                    <Typography sx={{fontFamily:'Savate'}} variant="h5" color="primary">{barn.price.toLocaleString('fr-FR')} €</Typography>
                    <Button onClick={() => {
                      addToCart(barn);
                      setSnackbarMessage(`${barn.productName || barn.name} ajouté au panier`);
                      setSnackbarOpen(true);
                    }} variant="contained" sx={{fontFamily:'Savate'}} color="primary">Ajouter au panier</Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

<Box sx={{ mt: 8, mb: 6 }}>
  {/* Title Section */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <Typography 
      variant="h2" 
      color="primary" 
      sx={{ 
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
        fontFamily: "Savate",
        textAlign: 'center',
        mb: 4,
        fontWeight: 'bold'
      }}
    >
      Écuries Démontables Sur Mesure
    </Typography>
  </motion.div>

  {/* Configuration Section */}
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    viewport={{ once: true }}
  >
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" color="primary" sx={{ fontFamily: 'Savate', mb: 3, fontWeight: 'bold' }}>
        Configuration Flexible
      </Typography>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Typography variant="body1" sx={{ fontFamily: 'Savate', mb: 3, lineHeight: 1.7 }}>
          Nos écuries démontables offrent une solution évolutive adaptée à vos besoins spécifiques. 
          Chaque structure est conçue pour s'adapter parfaitement à votre terrain et à votre effectif équin,
          avec des options de personnalisation complètes négociables avec notre responsable technique.
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            {
              title: "Hauteur",
              content: "Standard: sur mesure\nExtensions possibles selon besoin"
            },
            {
              title: "Largeur",
              content: "Modules sur mesure\nAssemblage extensible"
            },
            {
              title: "Délais",
              content: "Fabrication: Rapide\nInstallation: Rapide"
            },
            {
              title: "Matériaux",
              content: "Bois traité autoclave\nAcier galvanisé ou mixte"
            }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Typography variant="h6" sx={{ fontFamily: 'Savate', color: '#38598b', fontWeight: 'bold' }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Savate' }}>
                {item.content.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </motion.div>
      
      <Divider sx={{ my: 4, borderColor: 'rgba(56, 89, 139, 0.2)' }} />
    </Box>
  </motion.div>

  {/* Process Section */}
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    viewport={{ once: true }}
  >
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" color="primary" sx={{ fontFamily: 'Savate', mb: 3, fontWeight: 'bold' }}>
        Processus Sur Mesure
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[
          {
            title: "1. Consultation Technique",
            content: "Analyse approfondie de vos besoins avec notre responsable technique pour déterminer la configuration optimale (taille, matériaux, options spéciales)."
          },
          {
            title: "2. Devis Personnalisé",
            content: "Proposition détaillée incluant tous les éléments techniques et financiers, avec différentes options configurables selon votre budget."
          },
          {
            title: "3. Fabrication",
            content: "Production dans nos ateliers avec contrôle qualité à chaque étape. Visite possible sur rendez-vous."
          },
          {
            title: "4. Livraison & Installation",
            content: "Montage par nos équipes techniques avec formation à l'entretien et remise des garanties."
          }
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
            viewport={{ once: true }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'Savate', color: '#38598b', mb: 1, fontWeight: 'bold' }}>
                {step.title}
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Savate', pl: 2 }}>
                {step.content}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
      
      <Divider sx={{ my: 4, borderColor: 'rgba(56, 89, 139, 0.2)' }} />
    </Box>
  </motion.div>

  {/* Quality Section */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
  >
    <Box>
      <Typography variant="h4" color="primary" sx={{ fontFamily: 'Savate', mb: 3, fontWeight: 'bold' }}>
        Garanties Qualité
      </Typography>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Typography variant="body1" sx={{ fontFamily: 'Savate', mb: 4, lineHeight: 1.7 }}>
          Toutes nos structures démontables bénéficient de notre savoir-faire équestre et répondent 
          aux normes les plus exigeantes pour la sécurité et le confort de vos chevaux.
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { value: "1-2 ans", label: "Durée de vie moyenne" },
            { value: "2 ans", label: "Garantie structure" },
            { value: "Certifié CE", label: "Normes européennes" },
            { value: "Sur site", label: "Assistance technique" }
          ].map((item, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Typography variant="h5" sx={{ fontFamily: 'Savate', color: '#38598b' }}>
                {item.value}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Savate', fontWeight: 'bold' }}>
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  </motion.div>
</Box>

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">{snackbarMessage}</Alert>
        </Snackbar>

        <Dialog open={openSlider} onClose={() => setOpenSlider(false)} maxWidth="md" fullWidth>
          <Box sx={{ position: 'relative', backgroundColor: '#000' }}>
            <IconButton onClick={() => setOpenSlider(false)} sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10 }}>
              <CloseIcon />
            </IconButton>
            <IconButton onClick={() => setCurrentIndex((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1))} sx={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', color: 'white', zIndex: 10 }}>
              <ArrowBackIosIcon />
            </IconButton>
            <img src={sliderImages[currentIndex]} alt={`barn-${currentIndex + 1}`} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
            <IconButton onClick={() => setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1))} sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', color: 'white', zIndex: 10 }}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default Barn;