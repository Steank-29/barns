import React from 'react';
import { Box, Container, Grid, Link, Typography, TextField, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Email } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ 
        backgroundColor: '#38598b', 
        color: 'white',
        fontFamily: 'Savate, sans-serif',
        pt: 4,
        pb: 2
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="flex-start">
          {/* About Us Section */}
          <Grid item xs={12} sm={3} sx={{ mt: 4 }}>
            <Typography 
              variant="h6" 
              sx={{
                color: "white",
                fontSize: 20,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                mb: 2,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '50px',
                  height: '3px',
                  backgroundColor: '#ffc107'
                }
              }}
            >
              À Propos de Nous
            </Typography>
            <Typography 
              variant="body2"  
              sx={{
                fontSize: 16,
                fontWeight: 'bold',
                color: "white",
                lineHeight: 1.6
              }}
            >
              Nous sommes spécialisés dans la conception, fabrication et vente de barns démontables pour chevaux. 
              Nos solutions allient qualité, durabilité et facilité d'installation pour répondre aux besoins 
              des écuries et propriétaires équestres.
            </Typography>
          </Grid>
          
          {/* Navigation Sections */}
          <Grid item xs={12} sm={2} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              mb: 2
            }}>
              Home
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {['Écuries', 'Carrières', 'Paddocks', 'Écuries VIP', 'Installation', 'Galerie'].map((item) => (
                <li key={item}>
                  <Link href="#" variant="body2" sx={{ 
                    color: 'white', 
                    display: 'block', 
                    mb: 1.5,
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: '#ffc107',
                      transform: 'translateX(5px)'
                    }
                  }}>
                    {item}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={2} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              mb: 2
            }} gutterBottom>
              Products
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {['Barn Standard', 'Barn Premium', 'Barn Équestre', 'Barn Luxe', 'Box Mobile', 'Accessoires'].map((item) => (
                <li key={item}>
                  <Link href="#" variant="body2" sx={{ 
                    color: 'white', 
                    display: 'block', 
                    mb: 1.5,
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: '#ffc107',
                      transform: 'translateX(5px)'
                    }
                  }}>
                    {item}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={2} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              mb: 2
            }} gutterBottom>
              Services
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {['Conception', 'Installation', 'Personnalisation', 'Maintenance', 'Livraison', 'Consultation'].map((item) => (
                <li key={item}>
                  <Link href="#" variant="body2" sx={{ 
                    color: 'white', 
                    display: 'block', 
                    mb: 1.5,
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: '#ffc107',
                      transform: 'translateX(5px)'
                    }
                  }}>
                    {item}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>
          
          {/* Combined Newsletter & Social Section */}
          <Grid item xs={12} sm={3}>
            <Grid container spacing={3}>
              {/* Newsletter - Left side */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    mb: 1
                  }}>
                    Newsletter
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                    Abonnez-vous pour les dernières nouveautés.
                  </Typography>
                  <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Votre email"
                      sx={{ 
                        mr: 1, 
                        flexGrow: 1,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        '& .MuiInputBase-input': {
                          fontFamily: 'Savate'
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Email />}
                      sx={{
                        backgroundColor: '#ffc107',
                        color: '#38598b',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#ffca28'
                        }
                      }}
                    >
                      S'inscrire
                    </Button>
                  </Box>
                </Box>
              </Grid>
              
              {/* Social Icons - Right side */}
              <Grid item xs={12} md={6}>
                <Box sx={{ pl: { md: 2 } }}>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    mb: 1
                  }}>
                    Connect With Us
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 1,
                    mt: 1
                  }}>
                    {[
                      { icon: <Facebook />, color: '#3b5998', url: '#' },
                      { icon: <Twitter />, color: '#1DA1F2', url: '#' },
                      { icon: <Instagram />, color: '#E1306C', url: '#' },
                      { icon: <LinkedIn />, color: '#0077B5', url: '#' }
                    ].map((social, index) => (
                      <Link 
                        key={index}
                        href={social.url} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          transition: 'all 0.3s',
                          boxShadow: 2,
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        <Box sx={{ 
                          color: social.color, 
                          display: 'flex',
                          '& .MuiSvgIcon-root': {
                            fontSize: 24
                          }
                        }}>
                          {social.icon}
                        </Box>
                      </Link>
                    ))}
                  </Box>
                  
                  {/* Creative Horse Element */}
                  <Box sx={{ 
                    mt: 2, 
                    textAlign: 'center',
                    display: { xs: 'none', md: 'block' }
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: '#ffc107', 
                      fontWeight: 'bold',
                      mb: 0.5
                    }}>
                      Écuries d'excellence
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      gap: 1
                    }}>
                      {[...Array(3)].map((_, i) => (
                        <Box key={i} sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: '#ffc107',
                          borderRadius: '50%',
                          opacity: 0.7 - (i * 0.2)
                        }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Copyright */}
        <Box mt={5} sx={{ 
          textAlign: 'center',
          pt: 3,
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Typography variant="body2" sx={{
            textDecoration: 'none',
            fontSize: 16,
            color: 'white',
            letterSpacing: 1.2
          }}>
            {'Copyright © '}
            <Link color="inherit" href="https://yourwebsite.com/" sx={{ 
              textDecoration: 'none', 
              color: '#ffc107',
              fontWeight: 'bold'
            }}>
              Golden Box Horse
            </Link>{' '}
            {new Date().getFullYear()}
            {' • '}
            <Link href="#" sx={{ color: 'white', textDecoration: 'none', ml: 1 }}>
              Confidentialité
            </Link>
            {' • '}
            <Link href="#" sx={{ color: 'white', textDecoration: 'none', ml: 1 }}>
              Conditions
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;