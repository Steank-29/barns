import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, TextField, IconButton, Box, Avatar,
  Chip, Divider, Badge, styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from './CartContext';
import toast, { Toaster } from 'react-hot-toast';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#38598b',
    },
    secondary: {
      main: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Savate, Arial, sans-serif',
  },
});

const StyledAvatar = styled(Avatar)({
  width: 70,
  height: 70,
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const CartItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 0',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(56, 89, 139, 0.05)',
  },
});

const OrderButton = styled(Button)({
  fontWeight: 'bold',
  letterSpacing: '1px',
  padding: '10px 24px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(56, 89, 139, 0.2)',
  '&:hover': {
    boxShadow: '0 6px 8px rgba(56, 89, 139, 0.3)',
  },
});

const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-facade.jpg';
  if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
    return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  }
  return imageUrl;
};

const CartDialog = ({ open, onClose }) => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  });

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const getImageSource = (item) => {
    const name = (item.productName || item.name || '').toUpperCase();
    const specialPrefixes = ['MALLE', 'FENÊTRE', 'PORTE', 'MANGEOIRE', 'FACADE', 'BARN'];
    const useImageUrl = specialPrefixes.some(prefix => name.startsWith(prefix));
    const imagePath = useImageUrl ? item.imageUrl : item.imageURL;
    return getValidImageUrl(imagePath);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.whatsapp) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.whatsapp,
          notes: formData.message
        },
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.productName || item.name,
          quantity: item.quantity || 1,
          unitPrice: item.price || 0,
          image: getImageSource(item),
          totalPrice: (item.price || 0) * (item.quantity || 1)
        })),
        orderTotal: total,
        orderDate: new Date().toISOString()
      };

      const response = await axios.post(
        'http://localhost:5000/apic/buy/mail',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('✅ Commande envoyée avec succès !');
        clearCart();
        setFormData({ name: '', email: '', whatsapp: '', message: '' });
        onClose();
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'envoi de la commande');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(`❌ Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Toaster position="top-right" />
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            background: 'linear-gradient(to bottom, #f9f9f9, #e8f0fe)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Badge badgeContent={cartItems.length} color="secondary" sx={{ mr: 1 }}>
            🛒 Votre Panier
          </Badge>
        </DialogTitle>
        
        <DialogContent dividers sx={{ py: 2 }}>
          {cartItems.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                Votre panier est vide
              </Typography>
              <Typography variant="body1" mt={2}>
                Parcourez nos produits et ajoutez des articles à votre panier
              </Typography>
            </Box>
          ) : (
            <>
              {cartItems.map(item => (
                <React.Fragment key={item._id}>
                  <CartItem>
                    <Box display="flex" alignItems="center" flexGrow={1}>
                      <StyledAvatar
                        src={getImageSource(item)}
                        alt={item.productName || item.name}
                        variant="rounded"
                      />
                      <Box ml={2}>
                        <Typography fontWeight="bold">{item.productName || item.name}</Typography>
                        <Typography color="primary.main" fontWeight="bold">
                          {item.price ? `${item.price}€` : 'Prix non disponible'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <IconButton 
                        onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                        size="small"
                        disabled={isSubmitting}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      
                      <Chip 
                        label={item.quantity || 1} 
                        sx={{ mx: 1, fontWeight: 'bold' }}
                      />
                      
                      <IconButton 
                        onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                        size="small"
                        disabled={isSubmitting}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton 
                        onClick={() => removeFromCart(item._id)}
                        sx={{ ml: 2, color: 'error.main' }}
                        disabled={isSubmitting}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CartItem>
                  <Divider sx={{ my: 1 }} />
                </React.Fragment>
              ))}
              
              <Box mt={3} textAlign="right">
                <Typography variant="h6" fontWeight="bold">
                  Total: <span style={{ color: '#38598b' }}>{total}€</span>
                </Typography>
              </Box>

              <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
                  Informations de contact
                </Typography>
                
                <TextField
                  label="Nom complet *"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  margin="dense"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  disabled={isSubmitting}
                />
                
                <Box display="flex" gap={2}>
                  <TextField
                    label="Email *"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    margin="dense"
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={isSubmitting}
                  />
                  
                  <TextField
                    label="Numéro WhatsApp *"
                    fullWidth
                    value={formData.whatsapp}
                    onChange={handleInputChange('whatsapp')}
                    margin="dense"
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={isSubmitting}
                  />
                </Box>
                
                <TextField
                  label="Message (facultatif)"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  margin="dense"
                  variant="outlined"
                  disabled={isSubmitting}
                />
              </Box>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            sx={{ 
              borderRadius: '8px',
              borderColor: 'primary.main',
              color: 'primary.main'
            }}
            disabled={isSubmitting}
          >
            Continuer mes achats
          </Button>
          
          <OrderButton
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={cartItems.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : `Passer la commande (${total}€)`}
          </OrderButton>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default CartDialog;