import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Button, Container, CssBaseline, TextField, Typography, 
  Paper, Grid, Link, Divider, Alert, CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {login} from "../tools/auth";

const theme = createTheme({
  palette: {
    primary: { main: '#38598b', contrastText: '#ffffff' },
    secondary: { main: '#ffffff' },
    background: { default: '#38598b' },
    error: { main: '#d32f2f' }
  },
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h5: { fontWeight: 400, letterSpacing: '0.02em' }
  },
  shape: { borderRadius: 8 }
});

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://barns.onrender.com/api/auth/login', formData);
      const data = response.data;
       if (response.status === 200) {
      login(data.token);
      navigate('/admin-dashboard'); 
       }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
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

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" noValidate onSubmit={handleSubmit}>
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
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius
                      },
                      my: 1.5
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
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius
                      },
                      my: 1.5
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      mt: 2,
                      mb: 1,
                      py: 1,
                      borderRadius: theme.shape.borderRadius,
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Se connecter'
                    )}
                  </Button>

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
                    <Grid item>
                      <Link 
                        href="/signup" 
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