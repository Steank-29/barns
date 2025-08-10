import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Paper,
  Fade,
  Snackbar,
  Alert
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useCart } from '../components/CartContext';

const MAX_DESCRIPTION_LENGTH = 420;

const ProductCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  border: `2px solid transparent`,
  display: "flex",
  gap: theme.spacing(3),
  alignItems: "flex-start",
  position: "relative",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

const SelectionMenuBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(3),
  right: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(1.5, 2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder-facade.jpg";
  if (imageUrl.startsWith("/") || !imageUrl.startsWith("http")) {
    return `http://localhost:5000${
      imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
    }`;
  }
  return imageUrl;
};

export default function PageFacades() {
  const { addToCart } = useCart();
  const [facades, setFacades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFacadeId, setSelectedFacadeId] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchFacades = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/facade/getallfacades"
        );
        setFacades(res.data);
        if (res.data.length > 0) {
          setSelectedFacadeId(res.data[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFacades();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedFacadeId(event.target.value);
    setExpanded(false);
  };

    const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const activeFacade = facades.find((f) => f._id === selectedFacadeId);
  const description =
    activeFacade?.description || "Aucune description disponible";
  const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const shortDescription = isLongDescription
    ? `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
    : description;

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bolder",
          mb: 5,
          color: 'black',
          fontFamily: 'Savate',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        Notre Collection de Façades
      </Typography>

      {activeFacade && (
        <Fade in timeout={500}>
          <ProductCard elevation={3}>
            {/* Selection Menu Top Right */}
            <SelectionMenuBox>
              <InventoryIcon sx={{ color: '#38598b' }} />
              <FormControl size="small">
                <InputLabel id="facade-select-label" sx={{ color: '#38598b', fontFamily:'Savate' }}>Façade</InputLabel>
                <Select
                  labelId="facade-select-label"
                  value={selectedFacadeId}
                  onChange={handleSelectChange}
                  sx={{ minWidth: 160, fontFamily:'Savate' }}
                >
                  {facades.map((facade) => (
                    <MenuItem key={facade._id} value={facade._id}>
                      {facade.productName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </SelectionMenuBox>

            {/* Product image */}
            <Box
              sx={{
                width: 220,
                height: 300,
                borderRadius: 2,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={getValidImageUrl(
                  activeFacade.imageUrl || activeFacade.imageURL
                )}
                alt={activeFacade.productName}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />
            </Box>

            {/* Product details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1,fontFamily:'Savate' }}>
                {activeFacade.productName}
              </Typography>

              <Chip
                label={`Réf: ${activeFacade.reference}`}
                size="small"
                sx={{ mb: 2 , color:'white', bgcolor:'#38598b',fontFamily:'Savate'}}
              />

              {activeFacade.type && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontFamily:'Savate' }}
                >
                  Type : {activeFacade.type}
                </Typography>
              )}

              <Typography variant="body1" paragraph sx={{ mb: 1 ,fontFamily:'Savate'}}>
                {expanded ? description : shortDescription}
              </Typography>

              {isLongDescription && (
                <Button
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    textTransform: "none",
                    p: 0,
                    minWidth: 0,
                    fontSize: "0.875rem",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",fontFamily:'Savate'
                    },
                  }}
                >
                  {expanded ? "Voir moins" : "Voir plus"}
                </Button>
              )}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  my: 2,
                }}
              >
                {activeFacade.height && (
                  <Chip
                    label={`Hauteur: ${activeFacade.height}`}
                    size="small"
                    sx={{ backgroundColor: "grey.100",fontFamily:'Savate' }}
                  />
                )}
                {activeFacade.width && (
                  <Chip
                    label={`Largeur: ${activeFacade.width}`}
                    size="small"
                    sx={{ backgroundColor: "grey.100",fontFamily:'Savate' }}
                  />
                )}
                {activeFacade.thickness && (
                  <Chip
                    label={`Épaisseur: ${activeFacade.thickness}`}
                    size="small"
                    sx={{ backgroundColor: "grey.100",fontFamily:'Savate' }}
                  />
                )}
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  color:'#38598b',fontFamily:'Savate'
                }}
              >
                {formatPrice(activeFacade.price)}
              </Typography>

              <Button
  variant="contained"
  fullWidth
  sx={{
    borderRadius: 2,
    textTransform: "none",
    fontWeight: "bold",
    bgcolor: '#38598b',fontFamily:'Savate'
  }}
  onClick={() => {
                        addToCart(activeFacade);
                        setSnackbarMessage(`${activeFacade.productName || activeFacade.name} ajouté au panier`);
                        setSnackbarOpen(true);
                        }}
>
  Ajouter au panier
</Button>

            </Box>
          </ProductCard>
        </Fade>
      )}
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
  );
}
