import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Container, Typography, Button, Box, Chip,
  FormControl, InputLabel, Select, MenuItem,
  Skeleton, Paper, Fade, Snackbar, Alert
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useCart } from "../components/CartContext";

const MAX_DESCRIPTION_LENGTH = 420;

const ProductCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  display: "flex",
  gap: theme.spacing(3),
  alignItems: "flex-start",
  position: "relative",
  transition: "all 0.3s ease",
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

const getValidImageUrl = (url) => {
  if (!url) return "/placeholder-barriere.jpg";
  if (url.startsWith("/") || !url.startsWith("http")) {
    return `http://localhost:5000${url.startsWith("/") ? url : "/" + url}`;
  }
  return url;
};

export default function BarrierePage() {
  const { addToCart } = useCart();
  const [barrieres, setBarrieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBarriereId, setSelectedBarriereId] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/barriere/getallbarrieres")
      .then((res) => {
        setBarrieres(res.data);
        if (res.data.length) setSelectedBarriereId(res.data[0]._id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const activeBarriere = useMemo(
    () => barrieres.find((b) => b._id === selectedBarriereId),
    [barrieres, selectedBarriereId]
  );

  const { description, shortDescription, isLong } = useMemo(() => {
    const desc = activeBarriere?.description || "Aucune description disponible";
    return {
      description: desc,
      shortDescription: desc.length > MAX_DESCRIPTION_LENGTH
        ? `${desc.slice(0, MAX_DESCRIPTION_LENGTH)}...`
        : desc,
      isLong: desc.length > MAX_DESCRIPTION_LENGTH,
    };
  }, [activeBarriere]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);

  const handleAddToCart = () => {
    addToCart(activeBarriere);
    setSnackbar({ open: true, message: `${activeBarriere.name} ajouté au panier` });
  };

  if (loading) {
    return <Container maxWidth="lg" sx={{ py: 5 }}>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
    </Container>;
  }

  if (error) {
    return <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography color="error" align="center">{error}</Typography>
    </Container>;
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
          textTransform: "uppercase",
        }}
      >
        Notre Collection de Barrières
      </Typography>

      {activeBarriere && (
        <Fade in timeout={500}>
          <ProductCard>
            {/* Selection Menu */}
            <SelectionMenuBox>
              <InventoryIcon sx={{ color: "#38598b" }} />
              <FormControl size="small">
                <InputLabel sx={{ color: "#38598b", fontFamily: "Savate" }}>Barrière</InputLabel>
                <Select
                  value={selectedBarriereId}
                  onChange={(e) => { setSelectedBarriereId(e.target.value); setExpanded(false); }}
                  sx={{ minWidth: 160, fontFamily: "Savate" }}
                >
                  {barrieres.map((barriere) => (
                    <MenuItem key={barriere._id} value={barriere._id}>
                      {barriere.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </SelectionMenuBox>

            {/* Product Image */}
            <Box sx={{ width: 220, height: 300, borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
              <Box
                component="img"
                src={getValidImageUrl(activeBarriere.imageURL)}
                alt={activeBarriere.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />
            </Box>

            {/* Product Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, fontFamily: "Savate" }}>
                {activeBarriere.name}
              </Typography>

              <Chip
                label={`Réf: ${activeBarriere.reference}`}
                size="small"
                sx={{ mb: 2, color: "white", bgcolor: "#38598b", fontFamily: "Savate" }}
              />

              <Typography variant="body1" paragraph sx={{ mb: 1, fontFamily: "Savate" }}>
                {expanded ? description : shortDescription}
              </Typography>

              {isLong && (
                <Button size="small" onClick={() => setExpanded(!expanded)} sx={{ textTransform: "none", p: 0 }}>
                  {expanded ? "Voir moins" : "Voir plus"}
                </Button>
              )}

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 2 }}>
                {activeBarriere.width && (
                  <Chip label={`Largeur: ${activeBarriere.width}`} size="small" />
                )}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#38598b", fontFamily: "Savate" }}>
                {formatPrice(activeBarriere.price)}
              </Typography>

              <Button variant="contained" fullWidth sx={{ borderRadius: 2, bgcolor: "#38598b" }} onClick={handleAddToCart}>
                Ajouter au panier
              </Button>
            </Box>
          </ProductCard>
        </Fade>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
