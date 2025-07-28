import React from 'react';
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
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#38598b',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Savate, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
});

const Equipements = () => {
  const [facades, setFacades] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [priceFilter, setPriceFilter] = React.useState('');

  // Fetch facades from backend
  React.useEffect(() => {
    const fetchFacades = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/facade/getallfacades');
        setFacades(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFacades();
  }, []);

  // Extract unique types for filter
  const types = [...new Set(facades.map(facade => facade.type))].filter(Boolean);

  const filteredFacades = facades.filter(facade => {
    return (
      facade.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (typeFilter === '' || facade.type === typeFilter) &&
      (priceFilter === '' || 
        (priceFilter === 'low' && facade.price <= 1500) || 
        (priceFilter === 'high' && facade.price > 25000))
  )});

  // Function to chunk array into groups of 5 for perfect rows
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const facadeRows = chunkArray(filteredFacades, 5);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>Chargement des produits...</Typography>
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
        {/* Main Title Section */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h1" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
            Découvrez nos façades pour équipements équestres
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Nous proposons une gamme complète de façades de qualité professionnelle pour boxes et barns démontables.
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ 
          mb: 6, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center",
          width: '100%'
        }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Rechercher des façades..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 600 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl sx={{ width: 200 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      label="Type"
                    >
                      <MenuItem value="">Tous les types</MenuItem>
                      {types.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl sx={{ width: 200 }}>
                    <InputLabel>Prix</InputLabel>
                    <Select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      label="Prix"
                    >
                      <MenuItem value="">Toutes gammes</MenuItem>
                      <MenuItem value="low">Moins de 1500€</MenuItem>
                      <MenuItem value="high">Plus de 25000€</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Products Grid - Now with perfect 5-card rows */}
        {facadeRows.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {facadeRows.map((row, rowIndex) => (
              <Grid key={`row-${rowIndex}`} container spacing={4} justifyContent="center">
                {row.map((facade) => (
                  <Grid item key={facade._id} xs={12} sm={6} md={4} lg={2.4}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 3
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={facade.imageUrl || '/placeholder-facade.jpg'}
                        alt={facade.productName}
                        sx={{ 
                          objectFit: 'cover',
                          width: '100%',
                          height: 200
                        }}
                        onError={(e) => {
                          e.target.src = '/placeholder-facade.jpg';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {facade.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {facade.description || 'Façade de qualité professionnelle'}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Référence:</strong> {facade.reference}
                        </Typography>
                        {facade.height && facade.width && (
                          <Typography variant="body2" paragraph>
                            <strong>Dimensions:</strong> {facade.height} x {facade.width} {facade.thickness && `x ${facade.thickness}`}
                          </Typography>
                        )}
                        <Typography variant="h6" color="primary" paragraph>
                          {facade.price.toLocaleString('fr-FR')} €
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2 }}>
                        <Button 
                          variant="contained" 
                          fullWidth
                          color="primary"
                        >
                          Ajouter au panier
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              Aucune façade ne correspond à vos critères de recherche
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Equipements;