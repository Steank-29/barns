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
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ConstructionIcon from '@mui/icons-material/Construction';

// Icons for sidebar tabs
import DashboardIcon from '@mui/icons-material/Dashboard';
import FenceIcon from '@mui/icons-material/Fence';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReportIcon from '@mui/icons-material/Report';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Logout from '@mui/icons-material/Logout';
import adminlogo from '../assets/admin.png';

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
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard', style: { fontWeight: 'bold', fontFamily: 'Savate' } },
  { 
    text: 'Façade', 
    icon: <FenceIcon />, 
    style: { fontWeight: 'bold', fontFamily: 'Savate' },
    nested: [
      { text: 'Gestion des Façades', icon: <ConstructionIcon />, path: '/admin-cards-edit' },
      { text: 'Création d\'une façade', icon: <DesignServicesIcon />, path: '/admin-cards' }
    ],
  },
  { text: 'Products', icon: <InventoryIcon />, path: '/products' },
  { text: 'Orders', icon: <ReceiptIcon />, path: '/orders' },
  { text: 'Calendar', icon: <CalendarTodayIcon />, path: '/calendar' },
  { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Security', icon: <SecurityIcon />, path: '/security' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'Messages', icon: <ChatIcon />, path: '/messages' },
  { text: 'Favorites', icon: <StarBorderIcon />, path: '/favorites' },
  { text: 'Uploads', icon: <CloudUploadIcon />, path: '/uploads' },
  { text: 'Support', icon: <HelpOutlineIcon />, path: '/support' },
  { text: 'Documentation', icon: <HelpOutlineIcon />, path: '/documentation' },
];

const AdminBar = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openFacade, setOpenFacade] = useState(false);
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

  const handleFacadeClick = () => {
    setOpenFacade(!openFacade);
  };

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
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar 
              src={adminlogo} 
              alt="Logo" 
              sx={{ mr: 2, bgcolor: 'white' }}
            />
            <Typography 
              variant="h5" 
              noWrap 
              component="div"
              sx={{ 
                fontFamily: 'Savate', 
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              Bonjour Super Administrateur de Golden Box Horse
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={profileMenuOpen ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={profileMenuOpen ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
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
          Settings
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <HelpOutlineIcon fontSize="small" />
          </ListItemIcon>
          Help
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <MailIcon fontSize="small" />
          </ListItemIcon>
          Contact Support
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
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
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sidebarTabs.map((tab) => (
            <React.Fragment key={tab.text}>
              {tab.nested ? (
                <>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      onClick={handleFacadeClick}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(117, 81, 57, 0.12)',
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
                        onClick={handleFacadeClick}
                      >
                        {tab.icon}
                      </ListItemIcon>
                      <ListItemText primary={tab.text} sx={{ opacity: open ? 1 : 0 }} />
                      {open && (openFacade ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </ListItem>
                  
                  <Collapse in={openFacade && open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {tab.nested.map((nestedTab) => (
                        <ListItem 
                          key={nestedTab.text} 
                          disablePadding 
                          sx={{ 
                            display: 'block', 
                            textDecoration: 'none', 
                            color: 'inherit',
                            '&:hover': {
                              backgroundColor: 'rgba(117, 81, 57, 0.08)',
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
                              component={Link}
                              to={nestedTab.path}
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
                      backgroundColor: 'rgba(117, 81, 57, 0.08)',
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
                      component={Link}
                      to={tab.path}
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
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};

export default AdminBar;