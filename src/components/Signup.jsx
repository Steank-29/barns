import React, { useState, useEffect } from 'react';
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
  Divider,
  MenuItem,
  InputAdornment,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff, CloudUpload, CheckCircle } from '@mui/icons-material';
import countries from './Countries';

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

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    country: '',
    region: '', 
    street: '',
    email: '',
    picture: null,
    password: '',
    confirmPassword: '',
    horseCount: 0,
    termsAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (/[A-Z]/.test(formData.password)) strength += 1;
      if (/[0-9]/.test(formData.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (files ? files[0] : value)
    }));

    if (name === 'picture' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setSubmitError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (!formData.termsAccepted) {
      setSubmitError("Veuillez accepter les conditions d'utilisation");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return 'error';
      case 2: return 'warning';
      case 3: return 'info';
      case 4: return 'success';
      default: return 'inherit';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 1: return 'Faible';
      case 2: return 'Moyen';
      case 3: return 'Fort';
      case 4: return 'Très fort';
      default: return '';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#38598b',
          py: 0
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 800 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={8}>
              <Paper elevation={6} sx={{ 
                p: { xs: 3, sm: 3, md: 4 },
                borderRadius: theme.shape.borderRadius,
                backgroundColor: 'rgba(255, 255, 255, 0.96)'
              }}>
                {submitSuccess ? (
                  <Box sx={{ textAlign: 'center', py: 0}}>
                    <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                      Inscription réussie !
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Votre compte a été créé avec succès. Un email de confirmation vous a été envoyé.
                    </Typography>
                    <Button 
                      variant="contained" 
                      href="/signin"
                      sx={{ 
                        borderRadius: theme.shape.borderRadius,
                        fontWeight: 'bold',
                        px: 4
                      }}
                    >
                      Se connecter
                    </Button>
                  </Box>
                ) : (
                  <>
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
                      Créer un nouveau compte
                    </Typography>
                    
                    {submitError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {submitError}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                      <Grid container spacing={2}>
                        {/* Prénom et Nom */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="firstName"
                            label="Prénom"
                            name="firstName"
                            autoComplete="given-name"
                            variant="outlined"
                            value={formData.firstName}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Nom"
                            name="lastName"
                            autoComplete="family-name"
                            variant="outlined"
                            value={formData.lastName}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="birthDate"
                            label="Date de naissance"
                            name="birthDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            value={formData.birthDate}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="gender"
                            label="Genre"
                            name="gender"
                            select
                            variant="outlined"
                            value={formData.gender}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }, 
                              width: '120px'
                            }}
                          >
                            <MenuItem value="male">Homme</MenuItem>
                            <MenuItem value="female">Femme</MenuItem>
                            <MenuItem value="other">Autre</MenuItem>
                            <MenuItem value="prefer-not-to-say">Je préfère ne pas dire</MenuItem>
                          </TextField>
                        </Grid>

                        <Grid item xs={12}>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="country"
                            label="Pays"
                            name="country"
                            select
                            variant="outlined"
                            value={formData.country}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }, width: '120px'
                            }}
                          >
                            {countries.map((country) => (
                              <MenuItem key={country.code} value={country.code}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {country.icon && (
                                    <Box component="span" sx={{ mr: 1 }}>
                                      {country.icon}
                                    </Box>
                                  )}
                                  {country.name}
                                </Box>
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="region"
                            label="Région/État"
                            name="region"
                            variant="outlined"
                            value={formData.region}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="street"
                            label="Rue et numéro"
                            name="street"
                            variant="outlined"
                            value={formData.street}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="email"
                            label="Adresse Email"
                            name="email"
                            autoComplete="email"
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {previewImage ? (
                              <Avatar
                                src={previewImage}
                                sx={{ width: 56, height: 56, mr: 2 }}
                              />
                            ) : (
                              <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                            )}
                            <Button
                              variant="outlined"
                              component="label"
                              startIcon={<CloudUpload />}
                              sx={{
                                flexGrow: 1,
                                height: '56px',
                                borderRadius: theme.shape.borderRadius
                              }}
                            >
                              Photo
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                name="picture"
                                onChange={handleChange}
                              />
                            </Button>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                          {formData.password && (
                            <Typography 
                              variant="caption" 
                              color={getPasswordStrengthColor()}
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              Force du mot de passe: {getPasswordStrengthText()}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirmer le mot de passe"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            variant="outlined"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                          {formData.password && formData.confirmPassword && (
                            <Typography 
                              variant="caption" 
                              color={formData.password === formData.confirmPassword ? 'success' : 'error'}
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              {formData.password === formData.confirmPassword 
                                ? 'Les mots de passe correspondent' 
                                : 'Les mots de passe ne correspondent pas'}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="horseCount"
                            label="Nombre de chevaux"
                            name="horseCount"
                            type="number"
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            value={formData.horseCount}
                            onChange={handleChange}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: theme.shape.borderRadius
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                name="termsAccepted"
                                color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2">
                                J'accepte les {' '}
                                <Link href="/terms" target="_blank">
                                  conditions d'utilisation
                                </Link>
                                {' '} et la {' '}
                                <Link href="/privacy" target="_blank">
                                  politique de confidentialité
                                </Link>
                              </Typography>
                            }
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            sx={{ 
                              mt: 2,
                              mb: 1, 
                              py: 1.5,
                              borderRadius: theme.shape.borderRadius,
                              fontWeight: 'bold',
                              fontSize: '1rem'
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                En cours...
                              </>
                            ) : (
                              "S'inscrire"
                            )}
                          </Button>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                            Déjà un compte?{' '}
                            <Link href="/signin" variant="body2" sx={{ fontWeight: 'bold' }}>
                              Se connecter
                            </Link>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;