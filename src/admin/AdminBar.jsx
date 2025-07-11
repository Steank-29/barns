import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Logout from '@mui/icons-material/Logout';
import adminlogo from '../assets/admin.png';

import fence from '../assets/fence.png';
import stable from '../assets/stable.png';
import stables from '../assets/stables.png';
import gate from '../assets/gate.png';
import window from '../assets/window.png';
import dashboard from '../assets/dashboard.png';
import cabinet from '../assets/cabinet-drawer.png';
import barn from '../assets/barn.png';
import manger from '../assets/manger.png';
import help from '../assets/help.png';
import settings from '../assets/settings.png';

const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

// Sidebar tabs data with paths
const sidebarTabs = [
  { 
    id: 'dashboard',
    text:<Typography sx={{ fontFamily: 'Savate' }}> Dashboard </Typography>,
    icon: (
    <Box component="img" src={dashboard} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ), 
    path: '/admin-dashboard', 
    style: { fontWeight: 'bold', fontFamily: 'Savate' },
  },
  { 
    id: 'facade',
    text: (
          <Typography sx={{ fontFamily: 'Savate' }}> Façade </Typography>
    ), 
    icon: (
    <Box component="img" src={stable} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ), 
    style: { fontWeight: 'bold', fontFamily: 'Savate' },
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}> Gestion des Façades </Typography>
      ),  path: '/admin-cards-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}> Création d'une façade </Typography>
      ),  path: '/admin-cards' }
    ]
  },
  { 
    id: 'barriere',
    text:(
          <Typography sx={{ fontFamily: 'Savate' }}> Barrière </Typography>
    ), 
    icon:  (
    <Box component="img" src={fence} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ),
    style: { fontWeight: 'bold', fontFamily: 'Savate' },
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}> Gestion des Barrières </Typography>
      ),  path: '/admin-barriere-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}> Création d'une Barrière </Typography>
      ),  path: '/admin-barriere' }
    ]
  },
  { 
    id: 'deuxbox',
    text:(
          <Typography sx={{ fontFamily: 'Savate' }}> 2 Box </Typography>
    ), 
    icon:  (
    <Box component="img" src={stables} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ), 
    nested: [
      { text:(
          <Typography sx={{ fontFamily: 'Savate' }}> Gestion des 2 Box Rouge </Typography>
      ), path: '/admin-twobox-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}> Création d'un 2 Box Rouge </Typography>
      ), path: '/admin-twobox' },
      { text:(
          <Typography sx={{ fontFamily: 'Savate' }}> Gestion des 2 Box Résin </Typography>
      ), path: '/admin-twoboxresin-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}> Création d'un 2 Box Résin </Typography>
      ), path: '/admin-twoboxresin' }
    ]
  },
  { 
    id: 'troisbox',
    text: (
      <Typography sx={{ fontFamily: 'Savate' }}>
        3 Box
      </Typography>
    ), 
    icon:  (
    <Box component="img" src={stables} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ),
    nested: [
      { 
        text: (
          <Typography sx={{ fontFamily: 'Savate' }}>
            Gestion des 3 Box
          </Typography>
        ), 
        
        path: '/admin-threebox-edit' 
      },
      { 
        text: (
          <Typography sx={{ fontFamily: 'Savate' }}>
            Création d'un 3 Box
          </Typography>
        ), 
        
        path: '/admin-threebox' 
      }
    ]
  },
  { 
    id: 'cinqbox',
    text: (
      <Typography sx={{ fontFamily: 'Savate' }}>
        5 Box
      </Typography>
    ), 
    icon:  (
    <Box component="img" src={stables} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ),
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>
            Gestion des 5 Box
          </Typography>
      ), path: '/admin-fivebox-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>
            Création d'un 5 Box
          </Typography>
      ), path: '/admin-fivebox' }
    ]
  },
  { 
    id: 'sixbox',
    text: (
      <Typography sx={{ fontFamily: 'Savate' }}>
        6 Box
      </Typography>
    ), 
    icon:  (
    <Box component="img" src={stables} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ), 
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>
            Gestion des 6 Box
          </Typography>
      ), path: '/admin-sixbox-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>
            Création d'un 6 Box
          </Typography>
      ), path: '/admin-sixbox' }
    ]
  },
  { 
    id: 'malle',
    text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Malle de Concours</Typography>
    ), 
    icon: (
    <Box component="img" src={cabinet} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ),  
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Gestion des Malles</Typography>
      ), path: '/admin-malle-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Création d'une Malle</Typography>
      ), path: '/admin-malle' }
    ]
  },
  { 
    id: 'porte',
    text:(
          <Typography sx={{ fontFamily: 'Savate' }}>Porte de la Sellerie</Typography>
    ), 
     icon:  (
    <Box component="img" src={gate} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ), 
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Gestion des Portes</Typography>
      ), path: '/admin-porte-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Création d'une Porte</Typography>
      ), path: '/admin-porte' }
    ]
  },
  { 
    id: 'fenetre',
    text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Fenêtre Extérieure</Typography>
    ), 
     icon:  (
    <Box component="img" src={window} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ), 
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Gestion des Fenêtres</Typography>
      ), path: '/admin-fenetre-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Création d'une Fenêtre</Typography>
      ), path: '/admin-fenetre' }
    ]
  },
  { 
    id: 'mangeoire',
    text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Mangeoire Pivotante</Typography>
    ), 
    icon:  (
    <Box component="img" src={manger} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ),  
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Gestion des Mangeoires</Typography>
      ), path: '/admin-mangeoire-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Création d'une Mangeoire</Typography>
      ), path: '/admin-mangeoire' }
    ]
  },
  { 
    id: 'barn',
    text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Barn Démontable</Typography>
    ), 
    icon: (
    <Box component="img" src={barn} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ),   
    nested: [
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Gestion des Barns</Typography>
      ), path: '/admin-barn-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Création d'un Barn</Typography>
      ), path: '/admin-barn' }
    ]
  },
  // Non-nested items
  { id: 'parametres', text: (
      <Typography sx={{ fontFamily: 'Savate' }}>Paramètres</Typography>
  ), icon: (
    <Box component="img" src={settings} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ), path: '/admin-parametres' },
  { id: 'support', text: (
      <Typography sx={{ fontFamily: 'Savate' }}>Support</Typography>
  ), icon: (
    <Box component="img" src={help} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ),  path: '/admin-support' },
];

const AdminBar = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  const profileMenuOpen = Boolean(anchorEl);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
<AppBar position="fixed" open={open} sx={{ backgroundColor: '#38598b', color: 'white' }}>
  <Toolbar>
    {/* Always show menu icon on mobile, conditionally on larger screens */}
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      edge="start"
      sx={{
        marginRight: { xs: 2, sm: 3, md: 5 },
        display: { xs: 'block', sm: open ? 'none' : 'block' },
      }}
    >
      <MenuIcon />
    </IconButton>
    
    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
      <Avatar 
        src={adminlogo} 
        alt="Logo" 
        sx={{ 
          mr: { xs: 1, sm: 2 },
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          bgcolor: 'white' 
        }}
      />
      <Typography 
        variant="h6" 
        noWrap 
        component="div"
        sx={{ 
          fontFamily: 'Savate', 
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'white',
          fontSize: {
            xs: '0.7rem',  // smaller on mobile
            sm: '0.875rem',      // medium on tablet
            md: '1.4rem'    // larger on desktop
          }
        }}
      >
        Espace administrateur GBH
      </Typography>
    </Box>
    
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* Show mail icon on all screens */}
      <IconButton 
        size="large" 
        color="inherit"
        sx={{ 
          display: { xs: 'flex', sm: 'flex' },
          p: { xs: 0.5, sm: 1 }
        }}
      >
        <Badge badgeContent={4} color="error">
          <MailIcon fontSize="small" />
        </Badge>
      </IconButton>
      
      {/* Profile avatar - adjust size for mobile */}
      <IconButton
        onClick={handleProfileMenuOpen}
        size="small"
        sx={{ 
          ml: { xs: 1, sm: 2 },
          p: { xs: 0.5, sm: 1 }
        }}
        aria-controls={profileMenuOpen ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={profileMenuOpen ? 'true' : undefined}
      >
        <Avatar sx={{ 
          width: { xs: 28, sm: 32 },
          height: { xs: 28, sm: 32 }
        }}>A</Avatar>
      </IconButton>
    </Box>
  </Toolbar>
</AppBar>

<Menu
  anchorEl={anchorEl}
  id="account-menu"
  open={profileMenuOpen}
  onClose={handleProfileMenuClose}
  onClick={handleProfileMenuClose}
  PaperProps={{
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5,
      minWidth: 200,
      '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  }}
  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
>
  <MenuItem onClick={handleProfileMenuClose}>
    <Avatar /> Profile
  </MenuItem>
  <MenuItem onClick={handleProfileMenuClose}>
    <Avatar /> My account
  </MenuItem>
  <Divider />
  <MenuItem onClick={handleProfileMenuClose}>
    <ListItemIcon>
      <SettingsIcon fontSize="small" />
    </ListItemIcon>
    <Typography variant="inherit">Settings</Typography>
  </MenuItem>
  <MenuItem onClick={handleProfileMenuClose}>
    <ListItemIcon>
      <HelpOutlineIcon fontSize="small" />
    </ListItemIcon>
    <Typography variant="inherit">Help</Typography>
  </MenuItem>
  <MenuItem onClick={handleProfileMenuClose}>
    <ListItemIcon>
      <MailIcon fontSize="small" />
    </ListItemIcon>
    <Typography variant="inherit">Contact Support</Typography>
  </MenuItem>
  <Divider />
  <MenuItem onClick={handleProfileMenuClose}>
    <ListItemIcon>
      <Logout fontSize="small" />
    </ListItemIcon>
    <Typography variant="inherit">Logout</Typography>
  </MenuItem>
</Menu>

      <Drawer variant="permanent" open={open} sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: '#38598b',
          color: 'white',
        }
      }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon sx={{ color: 'white' }} /> : <ChevronLeftIcon sx={{ color: 'white' }} />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sidebarTabs.map((tab) => (
            <React.Fragment key={tab.id}>
              {tab.nested ? (
                <>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      onClick={() => handleMenuClick(tab.id)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        },
                        ...tab.style,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        {tab.icon}
                      </ListItemIcon>
                      <ListItemText primary={tab.text} sx={{ opacity: open ? 1 : 0 }} />
                      {open && (openMenus[tab.id] ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </ListItem>
                  
                  <Collapse in={openMenus[tab.id] && open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {tab.nested.map((nestedTab, index) => (
                        <ListItem 
                          key={`${tab.id}-${index}`} 
                          disablePadding 
                          sx={{ 
                            display: 'block', 
                            textDecoration: 'none', 
                            color: 'inherit',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            },
                          }}
                          component={Link}
                          to={nestedTab.path}
                        >
                          <ListItemButton
                            sx={{ 
                              pl: 4,
                              minHeight: 48,
                              justifyContent: open ? 'initial' : 'center',
                              color: 'white',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: 'white',
                              }}
                            >
                              {nestedTab.icon}
                            </ListItemIcon>
                            <ListItemText primary={nestedTab.text} sx={{ opacity: open ? 1 : 0 }} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem 
                  disablePadding 
                  sx={{ 
                    display: 'block',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                  component={Link}
                  to={tab.path}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      color: 'white',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      {tab.icon}
                    </ListItemIcon>
                    <ListItemText primary={tab.text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: '100%',
          overflowX: 'auto',
          [theme.breakpoints.down('sm')]: {
            p: 1,
          }
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};

export default AdminBar;