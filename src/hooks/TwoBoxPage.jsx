// src/pages/TwoBoxPage.jsx
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
  if (!imageUrl) return "/placeholder-twobox.jpg";
  if (imageUrl.startsWith("/") || !imageUrl.startsWith("http")) {
    return `http://localhost:5000${
      imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
    }`;
  }
  return imageUrl;
};

export default function TwoBoxPage() {
  const { addToCart } = useCart();
  const [twoBoxes, setTwoBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchTwoBoxes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/twobox/getalltwoboxes"
        );
        setTwoBoxes(res.data);
        if (res.data.length > 0) {
          setSelectedId(res.data[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTwoBoxes();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedId(event.target.value);
    setExpanded(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const activeTwoBox = twoBoxes.find((item) => item._id === selectedId);
  const description =
    activeTwoBox?.description || "Aucune description disponible";
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
        Notre Collection de 2 Box
      </Typography>

      {activeTwoBox && (
        <Fade in timeout={500}>
          <ProductCard elevation={3}>
            {/* Selection Menu */}
            <SelectionMenuBox>
              <InventoryIcon sx={{ color: "#38598b" }} />
              <FormControl size="small">
                <InputLabel
                  id="twobox-select-label"
                  sx={{ color: "#38598b", fontFamily: "Savate" }}
                >
                  TwoBox
                </InputLabel>
                <Select
                  labelId="twobox-select-label"
                  value={selectedId}
                  onChange={handleSelectChange}
                  sx={{ minWidth: 160, fontFamily: "Savate" }}
                >
                  {twoBoxes.map((item) => (
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
                src={getValidImageUrl(activeTwoBox.imageURL)}
                alt={activeTwoBox.name}
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
                {activeTwoBox.name}
              </Typography>

              <Chip
                label={`Réf: ${activeTwoBox.reference}`}
                size="small"
                sx={{
                  mb: 2,
                  color: "white",
                  bgcolor: "#38598b",
                  fontFamily: "Savate",
                }}
              />

              {activeTwoBox.type && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontFamily: "Savate" }}
                >
                  Type : {activeTwoBox.type}
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
                {activeTwoBox.conception && (
                  <Chip label={`Conception: ${activeTwoBox.conception}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.epaisseur && (
                  <Chip label={`Épaisseur: ${activeTwoBox.epaisseur}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.hauteurPartieBasse && (
                  <Chip label={`Hauteur Basse: ${activeTwoBox.hauteurPartieBasse}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.hauteurPartieHaute && (
                  <Chip label={`Hauteur Haute: ${activeTwoBox.hauteurPartieHaute}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.avancee && (
                  <Chip label={`Avancée: ${activeTwoBox.avancee}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.poteaux && (
                  <Chip label={`Poteaux: ${activeTwoBox.poteaux}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.tole && (
                  <Chip label={`Tôle: ${activeTwoBox.tole}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.option && (
                  <Chip label={`Option: ${activeTwoBox.option}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.couleur && (
                  <Chip label={`Couleur: ${activeTwoBox.couleur}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
                )}
                {activeTwoBox.ouverture && (
                  <Chip label={`Ouverture: ${activeTwoBox.ouverture}`} size="small" sx={{ backgroundColor: "grey.100", fontFamily: "Savate" }} />
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
                {formatPrice(activeTwoBox.price)}
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
                  addToCart(activeTwoBox);
                  setSnackbarMessage(
                    `${activeTwoBox.name} ajouté au panier`
                  );
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
