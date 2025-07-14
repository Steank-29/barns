import React, { useState } from 'react';
import { 
  Box, Button, Container, CssBaseline, TextField, Typography, 
  Paper, Grid, Link, Divider 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from "../tools/auth";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: { main: '#38598b', contrastText: '#ffffff' },
    secondary: { main: '#ffffff' },
    background: { default: '#38598b' },
  },
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h5: { fontWeight: 400, letterSpacing: '0.02em' }
  },
  shape: { borderRadius: 8 }
});

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      login(token); // Save token with your own method (e.g. localStorage)
      console.log("Connected user:", user); // Optional: see user info
      window.location.href = '/admin-dashboard';
    } catch (error) {
      const message = error.response?.data?.message || 'Échec de la connexion.';
      alert(message);
      console.error('Login error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '30vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#38598b',
          py: 1
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 600 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Paper elevation={6} sx={{ 
                p: { xs: 3, sm: 3, md: 4 },
                borderRadius: theme.shape.borderRadius,
                backgroundColor: 'rgba(255, 255, 255, 0.96)'
              }}>
                <Typography 
                  component="h1" 
                  variant="h5" 
                  align="center" 
                  sx={{ 
                    mb: 3,
                    color: 'primary.main',
                    fontWeight: 800,
                    fontSize: '1.8rem',
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
                      my: 1.5
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      my: 1.5
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                  />

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
                      fontSize: '0.95rem'
                    }}
                  >
                    Se connecter
                  </Button>

                  {/* Placeholder Gmail button (non-functional) */}
                  <Button
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
                    onClick={() => alert("Connexion avec Gmail non encore disponible.")}
                    startIcon={
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" 
                        alt="Gmail" 
                        width={18}
                        height={18}
                        style={{ filter: 'brightness(0) invert(1)' }} 
                      />
                    }
                  >
                    Connexion avec Gmail
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={1} direction="column">
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
