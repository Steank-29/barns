import React, { useState, useEffect } from 'react';
import { 
  AppBar, Box, Toolbar, Typography, Container, Avatar, Button, 
  IconButton, Drawer, InputAdornment, TextField, Badge, Paper, 
  List, ListItem, ListItemText, CircularProgress, Link, ListItemAvatar 
} from '@mui/material';
import axios from 'axios';
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
  faUser,
  faShieldHalved,
  faTruck,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const getValidImageUrl = (product) => {
  const imageUrl = product.imageUrl || product.imageURL || product.ImageUrl || product.ImageURL;
  if (!imageUrl) return '/placeholder-barn.jpg';
  if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
    return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  }
  return imageUrl;
};

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();

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

  const searchProducts = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const endpoints = [
        'http://localhost:5000/api/facade/getallfacades',
        'http://localhost:5000/api/barriere/getallbarrieres',
        'http://localhost:5000/api/twobox/getalltwoboxes',
        'http://localhost:5000/api/twoboxresin/getalltwoboxresins',
        'http://localhost:5000/api/threebox/getallthreeboxes',
        'http://localhost:5000/api/fivebox/getallfiveboxes',
        'http://localhost:5000/api/mang/getallmangs',
        'http://localhost:5000/api/porte/getallportes',
        'http://localhost:5000/api/fenet/getallfenets',
        'http://localhost:5000/api/malle/getallmalles'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => axios.get(endpoint))
      );

      const allResults = responses.flatMap(response => response.data);
      
      const filteredResults = allResults.filter(item => {
        const name = item.name || item.ProductName || '';
        const description = item.description || '';
        return (
          name.toLowerCase().includes(query.toLowerCase()) ||
          description.toLowerCase().includes(query.toLowerCase())
        );
      }).slice(0, 5);

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    await searchProducts(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      navigate('/equipmenets', { state: { searchResults } });
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (result) => {
    navigate('/equipmenets', { state: { selectedProduct: result } });
    setShowResults(false);
    setSearchQuery('');
  };

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
    mx: 6,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': { 
      color: scrolled ? 'white' : '#38598b',
      transform: 'scale(1.1)',
      backgroundColor: 'transparent'
    },
    ml: 6,
    fontSize:'1.1rem'
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

  const searchResultsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 9999,
    boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
    borderRadius: '0 0 4px 4px',
    backgroundColor: scrolled ? '#38598b' : 'white',
  };

  return (
    <AppBar position="sticky" sx={appBarStyle}>
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
            <Link href="/" sx={navLinkStyle}>
              <FontAwesomeIcon icon={faHouse} fontSize="meduim" style={{color: iconColor}} />&nbsp; Accueil
            </Link>
            <Link href="/about" sx={navLinkStyle}>
              <FontAwesomeIcon icon={faCircleInfo} fontSize="meduim" style={{color: iconColor}} /> &nbsp; Qui sommes-nous
            </Link>
            <Link href="/barn" sx={navLinkStyle}>
              <FontAwesomeIcon icon={faHorse} fontSize="meduim" style={{color: iconColor}} />&nbsp; Barn Démontable
            </Link>
            <Link href="/equipmenets" sx={navLinkStyle}>
              <FontAwesomeIcon icon={faWarehouse} fontSize="meduim" style={{color: iconColor}} /> &nbsp; Equipements
            </Link>
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

          <Box sx={{ display: 'flex', ml: 'auto', alignItems: 'center', gap: 1 }}>
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
                <ShoppingCartIcon sx={{ fontSize: '1.4rem' }} />
              </Badge>
            </IconButton>

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
              <MenuIcon sx={{ fontSize: '1.6rem' }} />
            </IconButton>
          </Box>
        </Toolbar>

        <Toolbar disableGutters sx={{ 
          py: 0,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          borderTop: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(56, 89, 139, 0.1)',
          position: 'relative'
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

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                sx={{
                  ...searchFieldStyle,
                  fontFamily: 'monospace',
                  width: '300px'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isSearching ? (
                        <CircularProgress size={20} sx={{ color: iconColor }} />
                      ) : (
                        <IconButton
                          type="submit"
                          edge="end"
                          sx={{ color: iconColor }}
                        >
                          <SearchIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              {showResults && searchResults.length > 0 && (
                <Paper sx={searchResultsStyle}>
                  <List>
                    {searchResults.map((result, index) => (
                      <ListItem 
                        key={index} 
                        button 
                        onClick={() => handleResultClick(result)}
                        sx={{
                          '&:hover': {
                            backgroundColor: scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(56, 89, 139, 0.1)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src={getValidImageUrl(result)} 
                            alt={result.name || result.ProductName}
                            sx={{ width: 56, height: 56, mr: 2 }}
                          />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={result.name || result.ProductName} 
                          secondary={result.description && result.description.length > 50 
                            ? `${result.description.substring(0, 50)}...` 
                            : result.description}
                          primaryTypographyProps={{ 
                            color: scrolled ? 'white' : 'text.primary',
                            fontWeight: 'bold'
                          }}
                          secondaryTypographyProps={{ 
                            color: scrolled ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
              {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <Paper sx={searchResultsStyle}>
                  <ListItem>
                    <ListItemText 
                      primary="No results found" 
                      primaryTypographyProps={{ 
                        color: scrolled ? 'white' : 'text.primary',
                        textAlign: 'center'
                      }}
                    />
                  </ListItem>
                </Paper>
              )}
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
          <Link href="/" sx={{ ...navLinkStyle, color: textColor }}>
            <FontAwesomeIcon icon={faHouse} fontSize="small" style={{color: iconColor}} />&nbsp; Accueil
          </Link>
          <Link href="/about" sx={{ ...navLinkStyle, color: textColor }}>
            <FontAwesomeIcon icon={faCircleInfo} fontSize="small" style={{color: iconColor}} /> &nbsp; Qui sommes-nous
          </Link>
          <Link href="/barn" sx={{ ...navLinkStyle, color: textColor }}>
            <FontAwesomeIcon icon={faHorse} fontSize="small" style={{color: iconColor}} />&nbsp; Barn Démontable
          </Link>
          <Link href="/equipmenets" sx={{ ...navLinkStyle, color: textColor }}>
            <FontAwesomeIcon icon={faWarehouse} fontSize="small" style={{color: iconColor}} />&nbsp; Equipements
          </Link>
          <Typography sx={{ ...navLinkStyle, color: textColor }}>
            <FontAwesomeIcon icon={faTruck} fontSize="small" style={{color: iconColor}} />&nbsp; Camion
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 2, width: '80%', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                sx={{
                  ...searchFieldStyle,
                  fontFamily: 'monospace',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isSearching ? (
                        <CircularProgress size={20} sx={{ color: iconColor }} />
                      ) : (
                        <IconButton
                          type="submit"
                          edge="end"
                          sx={{ color: iconColor }}
                        >
                          <SearchIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              {showResults && searchResults.length > 0 && (
                <Paper sx={{
                  ...searchResultsStyle,
                  backgroundColor: scrolled ? '#38598b' : 'white',
                  width: '100%'
                }}>
                  <List>
                    {searchResults.map((result, index) => (
                      <ListItem 
                        key={index} 
                        button 
                        onClick={() => handleResultClick(result)}
                        sx={{
                          '&:hover': {
                            backgroundColor: scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(56, 89, 139, 0.1)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            src={getValidImageUrl(result)} 
                            alt={result.name || result.ProductName}
                            sx={{ width: 56, height: 56, mr: 2 }}
                          />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={result.name || result.ProductName} 
                          secondary={result.description && result.description.length > 50 
                            ? `${result.description.substring(0, 50)}...` 
                            : result.description}
                          primaryTypographyProps={{ 
                            color: scrolled ? 'white' : 'text.primary',
                            fontWeight: 'bold'
                          }}
                          secondaryTypographyProps={{ 
                            color: scrolled ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
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