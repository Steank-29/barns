import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
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
import Logout from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
import { Button } from '@mui/material';

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
      ),  path: '/admin-cards' },
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
          <Typography sx={{ fontFamily: 'Savate' }}> Gestion des 2 Box Résine </Typography>
      ), path: '/admin-twoboxresin-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}> Création d'un 2 Box Résine </Typography>
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
      ), path: '/admin-fenet-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Création d'une Fenêtre</Typography>
      ), path: '/admin-fenet' }
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
      ), path: '/admin-mang-edit' },
      { text: (
          <Typography sx={{ fontFamily: 'Savate' }}>Création d'une Mangeoire</Typography>
      ), path: '/admin-mang' }
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
  { id: 'parametres', text: (
      <Typography sx={{ fontFamily: 'Savate' }}>Paramètres</Typography>
  ), icon: (
    <Box component="img" src={settings} alt="Barn Icon" sx={{ 
      width: 20, 
      height: 20,
      filter: 'brightness(1) invert(1)' 
    }} />
  ), path: '/admin-parametres' },
];

const AdminBar = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  const profileMenuOpen = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email1: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('usersdatatoken');
    handleProfileMenuClose();
    navigate('/');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSettings = () => {
    setAnchorEl(null);
    navigate('/admin-parametres');
  };

  const handleProfileSupport = () => {
    setAnchorEl(null);
    setContactDialogOpen(true);
  };

  const handleContactDialogClose = () => {
    setContactDialogOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const response = await fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }

    setSnackbarMessage('Votre message a été envoyé avec succès!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setContactDialogOpen(false);
    setFormData({
      email1: '',
      email: '',
      subject: '',
      message: ''
    });
  } catch (error) {
    console.error('Error sending message:', error);
    setSnackbarMessage(error.message || 'Une erreur est survenue lors de l\'envoi du message');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMainTabClick = (tabId) => {
    const tab = sidebarTabs.find(tab => tab.id === tabId);
    if (tab?.nested) {
      setOpenMenus(prev => ({
        [tabId]: !prev[tabId] 
      }));
    } else {
      setOpenMenus({}); 
    }
    setOpen(true); 
  };

  useEffect(() => {
    setOpen(false);
    setOpenMenus({});
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: '#38598b', color: 'white' }}>
        <Toolbar>
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
                  xs: '0.7rem', 
                  sm: '0.875rem',      
                  md: '1.4rem'    
                }
              }}
            >
              Espace GBH
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            
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
                height: { xs: 28, sm: 32 },
                backgroundColor: 'white',
                color:'#38598b',
              }}>G</Avatar>
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
        <MenuItem onClick={handleProfileSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Paramétres</Typography>
        </MenuItem>
        <MenuItem onClick={handleProfileSupport}>
          <ListItemIcon>
            <MailIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Contacter le support</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Déconnexion</Typography>
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
                      onClick={() => handleMainTabClick(tab.id)}
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
                  onClick={() => handleMainTabClick(tab.id)}
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

      <Dialog
        open={contactDialogOpen}
        onClose={handleContactDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#38598b',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box display="flex" alignItems="center">
            <MailIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Contact Support</Typography>
          </Box>
          <IconButton onClick={handleContactDialogClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <form onSubmit={handleFormSubmit}>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Votre Adresse email"
                name="email1"
                value={formData.email1}
                onChange={handleFormChange}
                required
                margin="normal"
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Box mb={3}>
              <TextField
                fullWidth
                label="Adresse email que vous contactez"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                margin="normal"
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Box mb={3}>
              <TextField
                fullWidth
                label="Sujet de votre message"  
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                required
                margin="normal"
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Box mb={3}>
              <TextField
                fullWidth
                label="Décrivez votre demande ou votre message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                required
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>
            
            <DialogActions sx={{ px: 0 }}>
              <Button 
                onClick={handleContactDialogClose} 
                color="inherit"
                sx={{ color: 'text.secondary' }}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={isSubmitting}
                sx={{ 
                  backgroundColor: '#38598b',
                  '&:hover': { backgroundColor: '#2a4568' },
                  minWidth: '100px'
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Envoyer'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminBar;