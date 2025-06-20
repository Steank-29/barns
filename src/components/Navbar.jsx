import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Container, Avatar, Button, IconButton, Drawer, InputAdornment, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '../assets/goldenbh_logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
      }}
    >
      <Container maxWidth="xl">
        {/* Main Navbar with Logo, Links, and Connexion */}
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo */}
          <Avatar
            src={Logo}
            alt="golden box horse Logo"
            sx={{ 
              width: 90, 
              height: 90, 
              borderRadius: '8px', 
              mr: 2,
              display: { xs: 'none', md: 'flex' }
            }}
          />

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 2, display: { xs: 'none', md: 'flex' } }}>
            <Typography sx={navLinkStyle}>
              <FontAwesomeIcon icon={faHouse} fontSize="meduim" style={{color:'#38598b'}} />&nbsp; Accueil
            </Typography>
            <Typography sx={navLinkStyle}>
              <FontAwesomeIcon icon={faCircleInfo} fontSize="meduim" style={{color:'#38598b'}} /> &nbsp; Qui sommes-nous
            </Typography>
            <Typography sx={navLinkStyle}>
              <FontAwesomeIcon icon={faHorse} fontSize="meduim" style={{color:'#38598b'}} />&nbsp; Chevaux
            </Typography>
            <Typography sx={navLinkStyle}>
              <FontAwesomeIcon icon={faWarehouse} fontSize="meduim" style={{color:'#38598b'}} /> &nbsp; Equipements
            </Typography>
            <Typography sx={navLinkStyle}>
              <FontAwesomeIcon icon={faRecycle} fontSize="meduim" style={{color:'#38598b'}} /> &nbsp; Seconde main
            </Typography>
            <Typography sx={navLinkStyle}>
              <FontAwesomeIcon icon={faPersonChalkboard} fontSize="medium" style={{color:'#38598b'}} />&nbsp; Stages
            </Typography>
          </Box>

          {/* Connexion Button */}
          <Button 
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'transparent',
              backgroundColor: '#38598b',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: '#38598b',
                color: '#38598b'
              },
              display: { xs: 'none', md: 'flex' },
              ml: 2
            }}
          >
            Connexion
          </Button>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              color: '#38598b',
              display: { xs: 'flex', md: 'none' },
              ml: 'auto'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* Second Line with Icons and Search */}
        <Toolbar disableGutters sx={{ 
          py: 0,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          borderTop: '1px solid rgba(56, 89, 139, 0.1)'
        }}>
          {/* Feature Icons */}
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
            <IconButton sx={iconButtonStyle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faUser} size="sm" style={{color: '#38598b'}} />
                <Typography variant="caption" sx={{  fontSize: '0.7rem' }}>
                  Clients Satisfaits
                </Typography>
              </Box>
            </IconButton>
            
            <IconButton sx={iconButtonStyle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faShieldHalved} size="sm" style={{color: '#38598b'}} />
                <Typography variant="caption" sx={{  fontSize: '0.7rem' }}>
                  Garantie Qualité
                </Typography>
              </Box>
            </IconButton>
            
            <IconButton sx={iconButtonStyle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faTruck} size="sm" style={{color: '#38598b'}} />
                <Typography variant="caption" sx={{  fontSize: '0.7rem' }}>
                  Livraison Rapide
                </Typography>
              </Box>
            </IconButton>
            
            <IconButton sx={iconButtonStyle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faHandshake} size="sm" style={{color: '#38598b'}} />
                <Typography variant="caption" sx={{  fontSize: '0.7rem' }}>
                  Service Personnalisé
                </Typography>
              </Box>
            </IconButton>
          </Box>

          {/* Search Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <form onSubmit={handleSearch}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#38598b',
                    },
                    '&:hover fieldset': {
                      borderColor: '#38598b',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    color: 'black',
                  },
                  width: '300px'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        edge="end"
                        sx={{ color: '#38598b' }}
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

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.9)' },
        }}
      >
        <IconButton
          color="inherit"
          onClick={toggleDrawer(false)}
          sx={{ position: 'absolute', top: 16, right: 16, color: '#38598b' }}
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
          
          <Typography sx={navLinkStyle}>
            <FontAwesomeIcon icon={faHouse} fontSize="small" style={{color:'#38598b'}} />&nbsp; Accueil
          </Typography>
          <Typography sx={navLinkStyle}>
            <FontAwesomeIcon icon={faCircleInfo} fontSize="small" style={{color:'#38598b'}} /> &nbsp; Qui sommes-nous
          </Typography>
          <Typography sx={navLinkStyle}>
            <FontAwesomeIcon icon={faHorse} fontSize="small" style={{color:'#38598b'}} />&nbsp; Chevaux
          </Typography>
          <Typography sx={navLinkStyle}>
            <FontAwesomeIcon icon={faWarehouse} fontSize="small" style={{color:'#38598b'}} />&nbsp; Equipements
          </Typography>
          <Typography sx={navLinkStyle}>
            <FontAwesomeIcon icon={faRecycle} fontSize="small" style={{color:'#38598b'}} />&nbsp; Seconde main
          </Typography>
          <Typography sx={navLinkStyle}>
            <FontAwesomeIcon icon={faPersonChalkboard} fontSize="meduim" style={{color:'#38598b'}} />&nbsp; Stages
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
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#38598b',
                    },
                    '&:hover fieldset': {
                      borderColor: '#38598b',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    color: 'black',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        edge="end"
                        sx={{ color: '#38598b' }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>
          
          <Button 
            variant="outlined"
            sx={{
              color: '#38598b',
              borderColor: '#38598b',
              mt: 2,
              '&:hover': {
                backgroundColor: 'rgba(56, 89, 139, 0.1)',
                borderColor: '#38598b'
              }
            }}
          >
            Connexion
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}

// Nav link styles
const navLinkStyle = {
  color: 'black',
  textDecoration: 'none',
  mx: 3,
  fontFamily: 'monospace',
  textTransform: 'uppercase',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': { 
    color: '#38598b',
    transform: 'scale(1.1)',
    backgroundColor: 'transparent'
  },
  ml:6
};

// Icon button styles
const iconButtonStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: '#38598b',
  mx: 1,
  '&:hover': {
    backgroundColor: 'rgba(56, 89, 139, 0.05)',
  },
  padding: '4px 8px',
};

export default Navbar;