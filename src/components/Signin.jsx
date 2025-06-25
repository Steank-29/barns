import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  TextField, 
  Typography, 
  Paper,
  Grid,
  Link,
  Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#38598b',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#38598b',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h5: {
      fontWeight: 400,
      letterSpacing: '0.02em'
    }
  },
  shape: {
    borderRadius: 8
  }
});

const Signin = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '30vh', // Reduced from 40vh
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#38598b',
          py: 1 // Reduced padding
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 600 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Paper elevation={6} sx={{ 
                p: { xs: 3, sm: 3, md: 4 }, // Reduced padding
                borderRadius: theme.shape.borderRadius,
                backgroundColor: 'rgba(255, 255, 255, 0.96)'
              }}>
                <Typography 
                  component="h1" 
                  variant="h5" 
                  align="center" 
                  sx={{ 
                    mb: 3, // Reduced margin
                    color: 'primary.main',
                    fontWeight: 800,
                    fontSize: '1.8rem', // Slightly smaller
                    letterSpacing: '0.02em'
                  }}
                >
                  Accès à votre compte
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Adresse Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius
                      },
                      my: 1.5 // Reduced margin
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius
                      },
                      my: 1.5 // Reduced margin
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 2, // Reduced margin
                      mb: 1, 
                      py: 1, // Reduced padding
                      borderRadius: theme.shape.borderRadius,
                      fontWeight: 'bold',
                      fontSize: '0.95rem' // Slightly smaller
                    }}
                  >
                    Se connecter
                  </Button>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      mb: 1,
                      py: 1,
                      borderRadius: theme.shape.borderRadius,
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      backgroundColor: '#DB4437',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#C1351A',
                      }
                    }}
                    startIcon={
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" 
                        alt="Gmail" 
                        width={18} // Smaller icon
                        height={18} 
                        style={{ filter: 'brightness(0) invert(1)' }} 
                      />
                    }
                  >
                    Connexion avec Gmail
                  </Button>
                  
                  <Divider sx={{ my: 2 }} /> {/* Reduced margin */}
                  
                  <Grid container spacing={1} direction="column"> {/* Tighter spacing */}
                    <Grid item>
                      <Link 
                        href="#" 
                        variant="body2" 
                        sx={{ 
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Mot de passe oublié ?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link 
                        href="#" 
                        variant="body2" 
                        sx={{ 
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Créer un nouveau compte
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Signin;