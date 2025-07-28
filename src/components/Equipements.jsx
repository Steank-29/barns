import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
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
  IconButton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useCart } from './CartContext';


// --- UTILS
const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-facade.jpg';
  if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
    return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  }
  return imageUrl;
};

// THEME
const theme = createTheme({
  palette: {
    primary: { main: '#38598b' },
    secondary: { main: '#f50057' },
  },
  typography: {
    fontFamily: 'Savate, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontWeight: 500, fontSize: '1rem' },
    h6: { fontWeight: 500, fontSize: '0.875rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem' },
    button: { textTransform: 'none' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          }
        }
      }
    }
  }
});

const Equipements = () => {

    const { addToCart } = useCart();
  // State for all product categories
  const [facades, setFacades] = useState([]);
  const [barrieres, setBarrieres] = useState([]);
  const [twoBoxes, setTwoBoxes] = useState([]);
  const [twoBoxResins, setTwoBoxResins] = useState([]);
  const [threeBoxes, setThreeBoxes] = useState([]);
  const [fiveBoxes, setFiveBoxes] = useState([]);
  const [mangeoires, setMangeoires] = useState([]);
  const [portes, setPortes] = useState([]);
  const [fenetres, setFenetres] = useState([]);
  const [malles, setMalles] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Refs for all sliders
  const sliderRefs = {
    facades: useRef(null),
    barrieres: useRef(null),
    twoBoxes: useRef(null),
    twoBoxResins: useRef(null),
    threeBoxes: useRef(null),
    fiveBoxes: useRef(null),
    mangeoires: useRef(null),
    portes: useRef(null),
    fenetres: useRef(null),
    malles: useRef(null)
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const [
          facadeResponse, 
          barriereResponse, 
          twoBoxResponse, 
          twoBoxResinResponse,
          threeBoxResponse,
          fiveBoxResponse,
          mangeoireResponse,
          porteResponse,
          fenetreResponse,
          malleResponse
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/facade/getallfacades'),
          axios.get('http://localhost:5000/api/barriere/getallbarrieres'),
          axios.get('http://localhost:5000/api/twobox/getalltwoboxes'),
          axios.get('http://localhost:5000/api/twoboxresin/getalltwoboxresins'),
          axios.get('http://localhost:5000/api/threebox/getallthreeboxes'),
          axios.get('http://localhost:5000/api/fivebox/getallfiveboxes'),
          axios.get('http://localhost:5000/api/mang/getallmangs'),
          axios.get('http://localhost:5000/api/porte/getallportes'),
          axios.get('http://localhost:5000/api/fenet/getallfenets'),
          axios.get('http://localhost:5000/api/malle/getallmalles')
        ]);

        setFacades(facadeResponse.data);
        setBarrieres(barriereResponse.data);
        setTwoBoxes(twoBoxResponse.data);
        setTwoBoxResins(twoBoxResinResponse.data);
        setThreeBoxes(threeBoxResponse.data);
        setFiveBoxes(fiveBoxResponse.data);
        setMangeoires(mangeoireResponse.data);
        setPortes(porteResponse.data);
        setFenetres(fenetreResponse.data);
        setMalles(malleResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Get all unique types across all products
  const types = [
    ...new Set([
      ...facades.map(f => f.type),
      ...barrieres.map(b => 'barriere'),
      ...twoBoxes.map(b => '2 Box'),
      ...twoBoxResins.map(b => '2 Box Résine'),
      ...threeBoxes.map(b => '3 Box'),
      ...fiveBoxes.map(b => '5 Box'),
      ...mangeoires.map(m => 'mangeoire'),
      ...portes.map(p => 'porte'),
      ...fenetres.map(f => 'fenetre'),
      ...malles.map(m => 'malle')
    ])
  ].filter(Boolean);

  const filterProducts = (products, productType) => {
    return products.filter(product => {
      const nameMatch = (product.productName || product.name).toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = typeFilter === '' || 
                       (productType === 'facade' && product.type === typeFilter) || 
                       (productType === 'barriere' && typeFilter === 'barriere') ||
                       (productType === '2 Box' && typeFilter === '2 Box') ||
                       (productType === '2 Box Résine' && typeFilter === '2 Box Résine') ||
                       (productType === '3 Box' && typeFilter === '3 Box') ||
                       (productType === '5 Box' && typeFilter === '5 Box') ||
                       (productType === 'mangeoire' && typeFilter === 'mangeoire') ||
                       (productType === 'porte' && typeFilter === 'porte') ||
                       (productType === 'fenetre' && typeFilter === 'fenetre') ||
                       (productType === 'malle' && typeFilter === 'malle');
      const priceMatch = priceFilter === '' ||
                        (priceFilter === 'low' && product.price <= 500) ||
                        (priceFilter === 'high' && product.price > 5000);

      return nameMatch && typeMatch && priceMatch;
    });
  };

  // Filter all product categories
  const filteredFacades = filterProducts(facades, 'facade');
  const filteredBarrieres = filterProducts(barrieres, 'barriere');
  const filteredTwoBoxes = filterProducts(twoBoxes, '2 Box');
  const filteredTwoBoxResins = filterProducts(twoBoxResins, '2 Box Résine');
  const filteredThreeBoxes = filterProducts(threeBoxes, '3 Box');
  const filteredFiveBoxes = filterProducts(fiveBoxes, '5 Box');
  const filteredMangeoires = filterProducts(mangeoires, 'mangeoire');
  const filteredPortes = filterProducts(portes, 'porte');
  const filteredFenetres = filterProducts(fenetres, 'fenetre');
  const filteredMalles = filterProducts(malles, 'malle');

  const getSlidesToShow = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4;
  };

  const sliderSettings = {
    dots: true,
    infinite: false, // Changed to false to prevent duplication
    speed: 500,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  const renderProductDetails = (product) => {
    const details = [];
    
    if (product.type) details.push(`Type: ${product.type}`);
    if (product.conception) details.push(`Conception: ${product.conception}`);
    if (product.epaisseur) details.push(`Épaisseur: ${product.epaisseur}`);
    if (product.hauteurPartieBasse) details.push(`Hauteur partie basse: ${product.hauteurPartieBasse}`);
    if (product.hauteurPartieHaute) details.push(`Hauteur partie haute: ${product.hauteurPartieHaute}`);
    if (product.avancee) details.push(`Avancée: ${product.avancee}`);
    if (product.poteaux) details.push(`Poteaux: ${product.poteaux}`);
    if (product.tole) details.push(`Tôle: ${product.tole}`);
    if (product.option) details.push(`Option: ${product.option}`);
    if (product.couleur) details.push(`Couleur: ${product.couleur}`);
    if (product.ouverture) details.push(`Ouverture: ${product.ouverture}`);
    if (product.longueur) details.push(`Longueur: ${product.longueur}`);
    if (product.profondeur) details.push(`Profondeur: ${product.profondeur}`);
    if (product.pannes) details.push(`Pannes: ${product.pannes}`);
    if (product.ossatureM) details.push(`Ossature: ${product.ossatureM}`);
    if (product.height && product.width) details.push(`Dimensions: ${product.height} x ${product.width}${product.thickness ? ` x ${product.thickness}` : ''}`);

    if (details.length === 0) return null;

    return (
      <Accordion sx={{ mt: 1, boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '1rem' }} />}>
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Détails techniques</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {details.map((detail, index) => (
            <Typography key={index} variant="body2" component="div" sx={{ fontSize: '0.7rem', lineHeight: 1.5 }}>
              {detail}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderSlider = (products, sliderRef, title) => {
    if (products.length === 0) return null;
    
    return (
      <Box mb={4}>
        <Typography variant="h4" color="primary" mb={2} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          {title}
        </Typography>
        <Box position="relative" sx={{ px: { xs: 0, sm: 2 } }}>
          {products.length > getSlidesToShow() && (
            <>
              <IconButton
                onClick={() => sliderRef.current?.slickPrev()}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: { xs: -10, sm: -20 },
                  zIndex: 10,
                  backgroundColor: 'white',
                  boxShadow: 2,
                  '&:hover': { backgroundColor: '#f0f0f0' },
                  transform: 'translateY(-50%)',
                  width: { xs: 30, sm: 40 },
                  height: { xs: 30, sm: 40 }
                }}
              >
                <ArrowBackIosIcon sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }} />
              </IconButton>

              <IconButton
                onClick={() => sliderRef.current?.slickNext()}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: { xs: -10, sm: -20 },
                  zIndex: 10,
                  backgroundColor: 'white',
                  boxShadow: 2,
                  '&:hover': { backgroundColor: '#f0f0f0' },
                  transform: 'translateY(-50%)',
                  width: { xs: 30, sm: 40 },
                  height: { xs: 30, sm: 40 }
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }} />
              </IconButton>
            </>
          )}

          <Slider {...sliderSettings} ref={sliderRef}>
            {products.map((product) => (
              <Box key={product._id} px={0.5}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    mx: 'auto',
                    maxWidth: 300,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={getValidImageUrl(product.imageUrl || product.imageURL)}
                    alt={product.productName || product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {product.productName || product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        mb: 1
                      }}
                    >
                      {product.description || 'Produit de qualité professionnelle'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      <strong>Réf:</strong> {product.reference}
                    </Typography>
                    <Typography variant="h6" color="primary" mt={0.5} sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {product.price.toLocaleString('fr-FR')} €
                    </Typography>
                    {renderProductDetails(product)}
                  </CardContent>
                  <Box sx={{ p: 1.5 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      size="small"
                      onClick={() => {
                        addToCart(product);
                        setSnackbarMessage(`${product.productName || product.name} ajouté au panier`);
                        setSnackbarOpen(true);
                        }}
                      sx={{ 
                        fontSize: '0.75rem',
                        py: 0.5,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark
                        }
                      }}
                    >
                      Ajouter au panier
                    </Button>
                  </Box>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress color="primary" />
          <Typography variant="h6" mt={2}>Chargement des produits...</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h6" color="error">Erreur: {error}</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' } }}>
            Nos Équipements Équestres
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" maxWidth={800} mx="auto" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Une sélection professionnelle pour vos installations équestres.
          </Typography>
        </Box>

        {/* Product Type Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, overflowX: 'auto' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                minWidth: 'unset',
                px: { xs: 1, sm: 2 },
                py: 1
              }
            }}
          >
            <Tab label="Tous les produits" value="all" />
            <Tab label="Façades" value="facades" />
            <Tab label="Barrières" value="barrieres" />
            <Tab label="2 Box" value="2 Box" />
            <Tab label="2 Box Résine" value="2 Box Résine" />
            <Tab label="3 Box" value="3 Box" />
            <Tab label="5 Box" value="5 Box" />
            <Tab label="Mangeoires" value="mangeoires" />
            <Tab label="Portes" value="portes" />
            <Tab label="Fenêtres" value="fenetres" />
            <Tab label="Malles" value="malles" />
          </Tabs>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} justifyContent="center" mb={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher des produits..."
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
            <FormControl fullWidth size="small">
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
                    {type === 'barriere' ? 'Barrière' : 
                     type === '2 Box' ? '2 Box' : 
                     type === '2 Box Résine' ? '2 Box Résine' :
                     type === '3 Box' ? '3 Box' :
                     type === '5 Box' ? '5 Box' :
                     type === 'mangeoire' ? 'Mangeoire' :
                     type === 'porte' ? 'Porte' :
                     type === 'fenetre' ? 'Fenêtre' :
                     type === 'malle' ? 'Malle' : type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
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

        {/* Content Section */}
        {activeTab === 'all' ? (
          <>
            {renderSlider(filteredFacades, sliderRefs.facades, "Nos Façades")}
            {renderSlider(filteredBarrieres, sliderRefs.barrieres, "Nos Barrières")}
            {renderSlider(filteredTwoBoxes, sliderRefs.twoBoxes, "Nos 2 Box")}
            {renderSlider(filteredTwoBoxResins, sliderRefs.twoBoxResins, "Nos 2 Box Résine")}
            {renderSlider(filteredThreeBoxes, sliderRefs.threeBoxes, "Nos 3 Box")}
            {renderSlider(filteredFiveBoxes, sliderRefs.fiveBoxes, "Nos 5 Box")}
            {renderSlider(filteredMangeoires, sliderRefs.mangeoires, "Nos Mangeoires")}
            {renderSlider(filteredPortes, sliderRefs.portes, "Nos Portes")}
            {renderSlider(filteredFenetres, sliderRefs.fenetres, "Nos Fenêtres")}
            {renderSlider(filteredMalles, sliderRefs.malles, "Nos Malles")}
            
            {filteredFacades.length === 0 && 
             filteredBarrieres.length === 0 && 
             filteredTwoBoxes.length === 0 && 
             filteredTwoBoxResins.length === 0 &&
             filteredThreeBoxes.length === 0 &&
             filteredFiveBoxes.length === 0 &&
             filteredMangeoires.length === 0 &&
             filteredPortes.length === 0 &&
             filteredFenetres.length === 0 &&
             filteredMalles.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary">
                  Aucun produit ne correspond à vos critères
                </Typography>
              </Box>
            )}
          </>
        ) : activeTab === 'facades' ? (
          filteredFacades.length > 0 ? (
            renderSlider(filteredFacades, sliderRefs.facades, "Nos Façades")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucune façade ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : activeTab === 'barrieres' ? (
          filteredBarrieres.length > 0 ? (
            renderSlider(filteredBarrieres, sliderRefs.barrieres, "Nos Barrières")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucune barrière ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : activeTab === '2 Box' ? (
          filteredTwoBoxes.length > 0 ? (
            renderSlider(filteredTwoBoxes, sliderRefs.twoBoxes, "Nos 2 Box")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucun 2 Box ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : activeTab === '2 Box Résine' ? (
          filteredTwoBoxResins.length > 0 ? (
            renderSlider(filteredTwoBoxResins, sliderRefs.twoBoxResins, "Nos 2 Box Résine")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucun 2 Box Résine ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : activeTab === '3 Box' ? (
          filteredThreeBoxes.length > 0 ? (
            renderSlider(filteredThreeBoxes, sliderRefs.threeBoxes, "Nos 3 Box")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucun 3 Box ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : activeTab === '5 Box' ? (
          filteredFiveBoxes.length > 0 ? (
            renderSlider(filteredFiveBoxes, sliderRefs.fiveBoxes, "Nos 5 Box")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucun 5 Box ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : activeTab === 'mangeoires' ? (
          filteredMangeoires.length > 0 ? (
            renderSlider(filteredMangeoires, sliderRefs.mangeoires, "Nos Mangeoires")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucune mangeoire ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : activeTab === 'portes' ? (
          filteredPortes.length > 0 ? (
            renderSlider(filteredPortes, sliderRefs.portes, "Nos Portes")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucune porte ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : activeTab === 'fenetres' ? (
          filteredFenetres.length > 0 ? (
            renderSlider(filteredFenetres, sliderRefs.fenetres, "Nos Fenêtres")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucune fenêtre ne correspond à vos critères
              </Typography>
            </Box>
          )
        ) : (
          filteredMalles.length > 0 ? (
            renderSlider(filteredMalles, sliderRefs.malles, "Nos Malles")
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Aucune malle ne correspond à vos critères
              </Typography>
            </Box>
          )
        )}

        {/* Snackbar for cart notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default Equipements;