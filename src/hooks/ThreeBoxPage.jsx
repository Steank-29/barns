// src/pages/ThreeBoxPage.jsx
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
import { useCart } from "../components/CartContext";

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
  if (!imageUrl) return "/placeholder-threebox.jpg";
  if (imageUrl.startsWith("/") || !imageUrl.startsWith("http")) {
    return `http://localhost:5000${
      imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
    }`;
  }
  return imageUrl;
};

export default function ThreeBoxPage() {
  const { addToCart } = useCart();
  const [threeBoxes, setThreeBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchThreeBoxes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/threebox/getallthreeboxes"
        );
        setThreeBoxes(res.data);
        if (res.data.length > 0) {
          setSelectedId(res.data[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchThreeBoxes();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedId(event.target.value);
    setExpanded(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const activeItem = threeBoxes.find((item) => item._id === selectedId);
  const description =
    activeItem?.description || "Aucune description disponible";
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
          color: "black",
          fontFamily: "Savate",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Notre Collection de 3 Box
      </Typography>

      {activeItem && (
        <Fade in timeout={500}>
          <ProductCard elevation={3}>
            {/* Selection Menu */}
            <SelectionMenuBox>
              <InventoryIcon sx={{ color: "#38598b" }} />
              <FormControl size="small">
                <InputLabel
                  id="threebox-select-label"
                  sx={{ color: "#38598b", fontFamily: "Savate" }}
                >
                  Notre Collection de 3 Box
                </InputLabel>
                <Select
                  labelId="threebox-select-label"
                  value={selectedId}
                  onChange={handleSelectChange}
                  sx={{ minWidth: 160, fontFamily: "Savate" }}
                >
                  {threeBoxes.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </SelectionMenuBox>

            {/* Image */}
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
                src={getValidImageUrl(activeItem.imageURL)}
                alt={activeItem.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />
            </Box>

            {/* Details */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 1, fontFamily: "Savate" }}
              >
                {activeItem.name}
              </Typography>

              <Chip
                label={`Réf: ${activeItem.reference}`}
                size="small"
                sx={{
                  mb: 2,
                  color: "white",
                  bgcolor: "#38598b",
                  fontFamily: "Savate",
                }}
              />

              {activeItem.type && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontFamily: "Savate" }}
                >
                  Type : {activeItem.type}
                </Typography>
              )}

              <Typography
                variant="body1"
                paragraph
                sx={{ mb: 1, fontFamily: "Savate" }}
              >
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
                      textDecoration: "underline",
                      fontFamily: "Savate",
                    },
                  }}
                >
                  {expanded ? "Voir moins" : "Voir plus"}
                </Button>
              )}

              {/* Attributes */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 2 }}>
                {activeItem.conception && (
                  <Chip label={`Conception: ${activeItem.conception}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.epaisseur && (
                  <Chip label={`Épaisseur: ${activeItem.epaisseur}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.hauteurPartieBasse && (
                  <Chip label={`Hauteur Basse: ${activeItem.hauteurPartieBasse}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.hauteurPartieHaute && (
                  <Chip label={`Hauteur Haute: ${activeItem.hauteurPartieHaute}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.avancee && (
                  <Chip label={`Avancée: ${activeItem.avancee}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.poteaux && (
                  <Chip label={`Poteaux: ${activeItem.poteaux}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.tole && (
                  <Chip label={`Tôle: ${activeItem.tole}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.option && (
                  <Chip label={`Option: ${activeItem.option}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.couleur && (
                  <Chip label={`Couleur: ${activeItem.couleur}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeItem.ouverture && (
                  <Chip label={`Ouverture: ${activeItem.ouverture}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  color: "#38598b",
                  fontFamily: "Savate",
                }}
              >
                {formatPrice(activeItem.price)}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  bgcolor: "#38598b",
                  fontFamily: "Savate",
                }}
                onClick={() => {
                  addToCart(activeItem);
                  setSnackbarMessage(`${activeItem.name} ajouté au panier`);
                  setSnackbarOpen(true);
                }}
              >
                Ajouter au panier
              </Button>
            </Box>
          </ProductCard>
        </Fade>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
