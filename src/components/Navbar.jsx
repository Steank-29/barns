import React, { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography, Container, Avatar, Button, IconButton, Drawer, InputAdornment, TextField, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/ExitToApp';
import Logo from '../assets/goldenbh_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CartDialog from '../components/CartDialog';
import { useCart } from './CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { 
  faHouse, 
  faCircleInfo, 
  faHorse, 
  faWarehouse, 
  faRecycle, 
  faPersonChalkboard,
  faUser,
  faShieldHalved,
  faTruck,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {  cartItems } = useCart();


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('À la recherche de:', searchQuery);
  };

  // Styles that change based on scroll state
  const appBarStyle = {
    backgroundColor: scrolled ? '#38598b' : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease',
  };

  const textColor = scrolled ? 'white' : 'black';
  const iconColor = scrolled ? 'white' : '#38598b';
  const searchFieldStyle = scrolled ? {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
  } : {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#38598b',
      },
      '&:hover fieldset': {
        borderColor: '#38598b',
      },
    },
    '& .MuiInputBase-input': {
      color: 'black',
    },
  };

  const navLinkStyle = {
    color: textColor,
    textDecoration: 'none',
    mx: 3,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': { 
      color: scrolled ? 'white' : '#38598b',
      transform: 'scale(1.1)',
      backgroundColor: 'transparent'
    },
    ml: 6
  };

  const iconButtonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: iconColor,
    mx: 1,
    '&:hover': {
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(56, 89, 139, 0.05)',
    },
    padding: '4px 8px',
  };

  const actionButtonStyle = {
    color: iconColor,
    backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(56, 89, 139, 0.1)',
    '&:hover': {
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(56, 89, 139, 0.2)',
    },
    display: { xs: 'none', md: 'flex' },
    ml: 2,
    p: 1.5
  };

  return (
    <AppBar
      position="sticky"
      sx={appBarStyle}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Avatar
            src={Logo}
            alt="golden box horse Logo"
            sx={{ 
              width: { xs: 70, md: 90 },
              height: { xs: 70, md: 90 },
              borderRadius: '8px', 
              mr: { xs: 1, md: 2 },
              display: 'flex' 
            }}
          />

          <Box sx={{ flexGrow: 2, display: { xs: 'none', md: 'flex' } }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <Typography sx={navLinkStyle}>
                <FontAwesomeIcon icon={faHouse} fontSize="meduim" style={{color: iconColor}} />&nbsp; Accueil
              </Typography>
            </a>
            <a href="/about" style={{ textDecoration: 'none' }}>
              <Typography sx={navLinkStyle}>
                <FontAwesomeIcon icon={faCircleInfo} fontSize="meduim" style={{color: iconColor}} /> &nbsp; Qui sommes-nous
              </Typography>
            </a>
            <a href="/barn" style={{ textDecoration: 'none' }}>
              <Typography sx={navLinkStyle}>
                <FontAwesomeIcon icon={faHorse} fontSize="meduim" style={{color: iconColor}} />&nbsp; Barn Démontable
              </Typography>
            </a>
            <a href="/equipmenets" style={{ textDecoration: 'none' }}>
              <Typography sx={navLinkStyle}>
                <FontAwesomeIcon icon={faWarehouse} fontSize="meduim" style={{color: iconColor}} /> &nbsp; Equipements
              </Typography>
            </a>
            <Typography sx={navLinkStyle}>
              <FontAwesomeIcon icon={faTruck} fontSize="small" style={{color: iconColor}} />&nbsp; Camion
            </Typography>
          </Box>

        <IconButton 
          sx={{
            ...actionButtonStyle,
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
          size="large"
          onClick={() => setCartOpen(true)}
          aria-label={`Shopping cart with ${cartItems.length} items`}
          disableRipple={false}
        >
          <Badge 
            badgeContent={cartItems.length} 
            color="error"
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                right: 5,
                top: 5,
                minWidth: 20,
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 0 0 2px rgba(255,255,255,0.8)',
              }
            }}
          >
            <ShoppingCartIcon 
              sx={{
                fontSize: '1.5rem',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            />
          </Badge>
        </IconButton>
          
          <IconButton
            href="/signin"
            sx={actionButtonStyle}
            size="large"
          >
            <PersonIcon />
          </IconButton>

<Box 
  sx={{ 
    display: 'flex', 
    ml: 'auto',
    alignItems: 'center',
    gap: 1
  }}
>
  {/* Enhanced Shopping Cart Icon */}
  <IconButton
    size="large"
    edge="end"
    onClick={() => setCartOpen(true)}
    aria-label={`View cart (${cartItems.length} items)`}
    sx={{
      color: iconColor,
      display: { xs: 'flex', md: 'none' },
      position: 'relative',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      },
      '&:active': {
        transform: 'scale(0.95)'
      }
    }}
  >
    <Badge
      badgeContent={cartItems.length}
      color="error"
      overlap="circular"
      invisible={cartItems.length === 0}
      sx={{
        '& .MuiBadge-badge': {
          right: 6,
          top: 6,
          minWidth: 18,
          height: 18,
          fontSize: '0.65rem',
          fontWeight: 'bold',
          border: '1.5px solid currentColor'
        }
      }}
    >
      <ShoppingCartIcon 
        sx={{ 
          fontSize: '1.4rem',
          transition: 'transform 0.15s ease'
        }} 
      />
    </Badge>
  </IconButton>

  {/* Enhanced Menu Icon */}
  <IconButton
    size="large"
    edge="end"
    onClick={toggleDrawer(true)}
    aria-label="Open navigation menu"
    sx={{
      color: iconColor,
      display: { xs: 'flex', md: 'none' },
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'rotate(5deg) scale(1.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      },
      '&:active': {
        transform: 'scale(0.95)'
      }
    }}
  >
    <MenuIcon 
      sx={{ 
        fontSize: '1.6rem',
        transition: 'transform 0.15s ease'
      }} 
    />
  </IconButton>
</Box>
        </Toolbar>

        <Toolbar disableGutters sx={{ 
          py: 0,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          borderTop: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(56, 89, 139, 0.1)'
        }}>
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
            <IconButton sx={iconButtonStyle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faUser} size="sm" style={{color: iconColor}} />
                <Typography variant="caption" sx={{ color: textColor, fontSize: '0.7rem' }}>
                  Clients Satisfaits
                </Typography>
              </Box>
            </IconButton>
            
            <IconButton sx={iconButtonStyle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faShieldHalved} size="sm" style={{color: iconColor}} />
                <Typography variant="caption" sx={{ color: textColor, fontSize: '0.7rem' }}>
                  Garantie Qualité
                </Typography>
              </Box>
            </IconButton>
            
            <IconButton sx={iconButtonStyle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faTruck} size="sm" style={{color: iconColor}} />
                <Typography variant="caption" sx={{ color: textColor, fontSize: '0.7rem' }}>
                  Livraison Rapide
                </Typography>
              </Box>
            </IconButton>
            
            <IconButton sx={iconButtonStyle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faHandshake} size="sm" style={{color: iconColor}} />
                <Typography variant="caption" sx={{ color: textColor, fontSize: '0.7rem' }}>
                  Service Personnalisé
                </Typography>
              </Box>
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <form onSubmit={handleSearch}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  ...searchFieldStyle,
                  fontFamily: 'monospace',
                  width: '300px'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        edge="end"
                        sx={{ color: iconColor }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: scrolled ? '#38598b' : 'rgba(255, 255, 255, 0.9)',
            transition: 'background-color 0.3s ease',
          },
        }}
      >
        <IconButton
          color="inherit"
          onClick={toggleDrawer(false)}
          sx={{ position: 'absolute', top: 16, right: 16, color: iconColor }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 1,
          }}
        >
          <Avatar
            src={Logo}
            alt="golden box horse Logo"
            sx={{ 
              width: 90, 
              height: 90, 
              borderRadius: '8px',
              mb: 2
            }}
          />
          <a href="/" style={{ textDecoration: 'none' }}>
            <Typography sx={{ ...navLinkStyle, color: textColor }}>
              <FontAwesomeIcon icon={faHouse} fontSize="small" style={{color: iconColor}} />&nbsp; Accueil
            </Typography>
          </a>
          <a href="/about" style={{ textDecoration: 'none' }}>
            <Typography sx={{ ...navLinkStyle, color: textColor }}>
              <FontAwesomeIcon icon={faCircleInfo} fontSize="small" style={{color: iconColor}} /> &nbsp; Qui sommes-nous
            </Typography>
          </a>
          <a href="/barn" style={{ textDecoration: 'none' }}>
            <Typography sx={{ ...navLinkStyle, color: textColor }}>
              <FontAwesomeIcon icon={faHorse} fontSize="small" style={{color: iconColor}} />&nbsp; Barn Démontable
            </Typography>
          </a>
          <a href="/equipmenets" style={{ textDecoration: 'none' }}>
            <Typography sx={{ ...navLinkStyle, color: textColor }}>
              <FontAwesomeIcon icon={faWarehouse} fontSize="small" style={{color: iconColor}} />&nbsp; Equipements
            </Typography>
          </a>
          <Typography sx={{ ...navLinkStyle, color: textColor }}>
            <FontAwesomeIcon icon={faTruck} fontSize="small" style={{color: iconColor}} />&nbsp; Camion
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 2, width: '80%' }}>
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  ...searchFieldStyle,
                  fontFamily: 'monospace',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        edge="end"
                        sx={{ color: iconColor }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>

          <IconButton
            href="/signin"
            sx={{
              ...actionButtonStyle,
              mt: 2,
            }}
            size="large"
          >
            <PersonIcon />
          </IconButton>
        </Box>
      </Drawer>
      <CartDialog open={cartOpen} onClose={() => setCartOpen(false)} />
    </AppBar>
  );
}

export default Navbar;