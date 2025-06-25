import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Divider,
  Button,
  useTheme
} from '@mui/material';
import {
  Settings as OperationsIcon,
  ShoppingCart as SalesIcon,
  Engineering as EngineeringIcon,
  HeadsetMic as SupportIcon,
  ArrowForward
} from '@mui/icons-material';

// Images
import founder1 from "../assets/founder1.jpeg";
import founder2 from "../assets/founder2.jpeg";
import horsey from "../assets/goldenbh_logo.png";

// Team data
const teamData = [
  { 
    name: "Alex Morgan", 
    role: "Co-Fondateur", 
    isFounder: true, 
    image: founder1 
  },
  { 
    name: "Jamie Rivera", 
    role: "Co-Fondateur", 
    isFounder: true, 
    image: founder2 
  },
  { 
    name: "Opérations", 
    role: "Gestion de production", 
    icon: <OperationsIcon fontSize="large" /> 
  },
  { 
    name: "Commercial", 
    role: "Spécialiste marketing", 
    icon: <SalesIcon fontSize="large" /> 
  },
  { 
    name: "Ingénierie", 
    role: "Expert en conception", 
    icon: <EngineeringIcon fontSize="large" /> 
  },
  { 
    name: "Support", 
    role: "Service client", 
    icon: <SupportIcon fontSize="large" /> 
  },
];

const products = [
  {
    name: "Barn Standard",
    description: "Solution économique et fonctionnelle"
  },
  {
    name: "Barn Premium",
    description: "Robustesse et design amélioré"
  },
  {
    name: "Barn Équestre",
    description: "Conçu pour les professionnels"
  },
  {
    name: "Barn Luxe",
    description: "Élégance et matériaux haut de gamme"
  },
  {
    name: "Box Mobile",
    description: "Modularité et facilité de transport"
  },
  {
    name: "Accessoires",
    description: "Personnalisation et équipements"
  }
];

const services = [
  {
    name: "Conception",
    description: "Solutions sur-mesure adaptées à vos besoins"
  },
  {
    name: "Installation",
    description: "Professionnelle et sécurisée"
  },
  {
    name: "Personnalisation",
    description: "Choix des matériaux et options"
  },
  {
    name: "Maintenance",
    description: "Entretien pour une longévité optimale"
  },
  {
    name: "Livraison",
    description: "France et international"
  },
  {
    name: "Consultation",
    description: "Expertise et conseils techniques"
  }
];

const About = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <img src={horsey} alt="Golden Box Horse Logo" style={{ height: '80px', marginBottom: '20px' }} />
        <Typography variant="h2" component="h1" sx={{ 
          fontWeight: 700, 
          mb: 3,
          fontFamily: 'Savate',
          color: theme.palette.primary.main
        }}>
          Golden Box Horse
        </Typography>
        <Typography variant="h5" sx={{ 
          maxWidth: '800px', 
          mx: 'auto',
          fontFamily: 'Savate',
          mb: 4
        }}>
          Experts en barns démontables haut de gamme pour l'équitation
        </Typography>
      </Box>

      {/* Our Story */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          mb: 4,
          fontFamily: 'Savate',
          textAlign: 'center'
        }}>
          Notre Histoire
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ 
              mb: 3,
              fontFamily: 'Savate',
              fontSize: '1.1rem'
            }}>
              Fondée par <strong>Alex Morgan</strong> et <strong>Jamie Rivera</strong>, Golden Box Horse est née de la passion pour les chevaux et de l'expertise en construction modulaire.
            </Typography>
            <Typography variant="body1" sx={{ 
              fontFamily: 'Savate',
              fontSize: '1.1rem'
            }}>
              Notre mission est d'offrir des solutions innovantes, durables et haut de gamme pour l'hébergement équestre, combinant qualité supérieure et flexibilité.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: theme.palette.grey[100], 
              p: 4,
              borderRadius: 2,
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                mb: 2,
                fontFamily: 'Savate'
              }}>
                Nos Valeurs
              </Typography>
              <ul style={{ 
                paddingLeft: '20px',
                fontFamily: 'Savate',
                fontSize: '1.1rem'
              }}>
                <li>Qualité des matériaux certifiés</li>
                <li>Approche éco-responsable</li>
                <li>Satisfaction client absolue</li>
                <li>Innovation constante</li>
              </ul>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Our Products */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          mb: 4,
          fontFamily: 'Savate',
          textAlign: 'center'
        }}>
          Nos Produits
        </Typography>
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6]
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: 'Savate',
                    color: theme.palette.primary.main
                  }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Savate' }}>
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Services */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          mb: 4,
          fontFamily: 'Savate',
          textAlign: 'center'
        }}>
          Nos Services
        </Typography>
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.primary.main,
                color: 'white'
              }}>
                <CardContent sx={{ 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: 'Savate'
                  }}>
                    {service.name}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontFamily: 'Savate',
                    mb: 2,
                    flexGrow: 1
                  }}>
                    {service.description}
                  </Typography>
                  <Box sx={{ alignSelf: 'flex-end' }}>
                    <ArrowForward sx={{ color: 'white' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Team */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          mb: 6,
          fontFamily: 'Savate',
          textAlign: 'center'
        }}>
          Notre Équipe
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          {teamData.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {member.isFounder ? (
                  <Avatar 
                    src={member.image} 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 2,
                      border: `3px solid ${theme.palette.primary.main}`
                    }} 
                  />
                ) : (
                  <Box sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'white'
                  }}>
                    {member.icon}
                  </Box>
                )}
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontFamily: 'Savate'
                }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.secondary,
                  fontFamily: 'Savate'
                }}>
                  {member.role}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Why Choose Us */}
      <Box sx={{ 
        backgroundColor: theme.palette.grey[100],
        p: 6,
        borderRadius: 2,
        mb: 8
      }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700,
          mb: 4,
          fontFamily: 'Savate',
          textAlign: 'center'
        }}>
          Pourquoi Nous Choisir ?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              mb: 2,
              fontFamily: 'Savate'
            }}>
              Expertise Unique
            </Typography>
            <Typography variant="body1" sx={{ 
              fontFamily: 'Savate',
              mb: 3
            }}>
              Spécialistes des barns démontables équestres depuis plus de 10 ans, nous maîtrisons parfaitement les besoins spécifiques des chevaux et des cavaliers.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              mb: 2,
              fontFamily: 'Savate'
            }}>
              Qualité Garantie
            </Typography>
            <Typography variant="body1" sx={{ 
              fontFamily: 'Savate',
              mb: 3
            }}>
              Tous nos produits bénéficient d'une garantie de 2 ans et sont fabriqués avec des matériaux premium sélectionnés pour leur durabilité.
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button 
              variant="contained" 
              size="large"
              sx={{
                px: 6,
                fontFamily: 'Savate',
                fontWeight: 600
              }}
            >
              Contactez-nous
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About;