import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  ExpandMore,
  EmojiNature as HorseIcon,
  Construction as ConstructionIcon,
  Groups as EcoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const cardHoverVariants = {
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const MissionCard = styled(Paper)({
    padding: theme.spacing(4),
    borderRadius: '16px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #38598b 0%, #222831 100%)',
    color: 'white',
  });

  const TimelineItem = styled(Box)({
    position: 'relative',
    paddingLeft: theme.spacing(4),
    marginBottom: theme.spacing(4),
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 7,
      top: 0,
      width: '2px',
      height: '100%',
      backgroundColor: "#38598b"
    }
  });

  const TimelineDot = styled(Box)({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: "#38598b",
    border: `3px solid ${theme.palette.background.paper}`,
    zIndex: 1
  });

  const historyItems = [
    {
      year: '2015',
      title: 'Fondation de Golden Box Horse',
      description: 'Création de notre entreprise avec une vision révolutionnaire pour les écuries démontables.'
    },
    {
      year: '2017',
      title: 'Première innovation brevetée',
      description: 'Développement de notre système unique de montage/démontage rapide.'
    },
    {
      year: '2019',
      title: 'Expansion internationale',
      description: 'Premières exportations vers la Belgique et la Suisse.'
    },
    {
      year: '2021',
      title: 'Gamme Premium lancée',
      description: 'Introduction de nos modèles haut de gamme avec matériaux écologiques.'
    },
    {
      year: '2023',
      title: '1000ème installation',
      description: 'Atteinte du cap des 1000 écuries installées à travers l\'Europe.'
    }
  ];

  const values = [
    {
      title: 'Innovation',
      icon: <ConstructionIcon fontSize="large" />,
      description: 'Nous repoussons constamment les limites du design équin modulaire.'
    },
    {
      title: 'Bien-être équin',
      icon: <HorseIcon fontSize="large" />,
      description: 'Le confort et la sécurité des chevaux guident chaque décision.'
    },
    {
      title: 'Durabilité',
      icon: <EcoIcon fontSize="large" />,
      description: 'Matériaux écologiques et conception éco-responsable.'
    },
  ];

  const faqItems = [
    {
      question: 'Quelle est votre philosophie chez Golden Box Horse ?',
      answer: 'Nous croyons que chaque cheval mérite un habitat sûr, confortable et adapté, sans compromis sur la qualité. Nos écuries démontables allient le meilleur de l\'innovation technique et de la compréhension des besoins équin.'
    },
    {
      question: 'Où sont fabriquées vos écuries ?',
      answer: 'Toutes nos structures sont conçues et assemblées en France, dans notre atelier normand. Nous utilisons principalement des matériaux locaux pour réduire notre empreinte carbone.'
    },
    {
      question: 'Proposez-vous des solutions sur mesure ?',
      answer: 'Absolument ! Chaque projet est unique. Notre équipe d\'ingénieurs travaille avec vous pour créer une solution parfaitement adaptée à votre terrain, votre budget et vos chevaux.'
    }
  ];
  

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Box sx={{
        position: 'relative',
        height: { xs: 'auto', md: '70vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: { xs: 8, md: 0 },
        flexDirection: { xs: 'column-reverse', md: 'row' },
        gap: { xs: 4, md: 0 }
      }}>
        <Container maxWidth="md" sx={{ mb: { xs: 4, md: 0 } }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div whileHover="hover" variants={cardHoverVariants}>
                  <MissionCard elevation={3}>
                    <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: 700, fontFamily: "Savate" }}>
                      Notre Mission
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: isMobile ? '1rem' : '1.1rem', fontFamily: "Savate" }}>
                      Offrir aux propriétaires et professionnels équestres des solutions d'hébergement modulaires qui allient qualité supérieure, bien-être animal et respect de l'environnement.
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: isMobile ? '1rem' : '1.1rem', fontFamily: "Savate" }}>
                      Nous transformons la conception traditionnelle des écuries avec des innovations brevetées qui redéfinissent les standards du secteur.
                    </Typography>
                    <Box sx={{ mt: 'auto', pt: 2 }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="contained" 
                          size={isMobile ? "medium" : "large"}
                          href='/equipmenets'
                          sx={{ 
                            backgroundColor: 'white', 
                            color: '#38598b',
                            fontFamily: "Savate",
                            '&:hover': {
                              backgroundColor: '#EFF3EA',
                            }
                          }}
                        >
                          Découvrir nos produits
                        </Button>
                      </motion.div>
                    </Box>
                  </MissionCard>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
        
        <Container maxWidth="md" sx={{ 
          mb: { xs: 4, md: 0 },
          px: { xs: 2, md: 0 }
        }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography variant={isMobile ? "h4" : "h2"} component="h1" gutterBottom sx={{ 
              fontWeight: 700, 
              fontFamily: "Savate", 
              color: "black",
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Notre Histoire, Votre Confiance
            </Typography>
            <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
              fontWeight: 700, 
              fontFamily: "Savate", 
              color: "black",
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Golden Box Horse - Révolutionner les habitats équin depuis 2015
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: '#f9f9f9', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant={isMobile ? "h4" : "h3"} align="center" gutterBottom sx={{ 
              fontWeight: 700, 
              mb: 6, 
              fontFamily: "Savate",
              px: { xs: 2, md: 0 }
            }}>
              Notre Parcours
            </Typography>
          </motion.div>
          
          <Box sx={{ 
            maxWidth: 800, 
            mx: 'auto',
            px: { xs: 2, md: 0 }
          }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {historyItems.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <TimelineItem>
                    <TimelineDot />
                    <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, fontFamily: "Savate" }}>
                      {item.year} - {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontFamily: "Savate" }}>
                      {item.description}
                    </Typography>
                  </TimelineItem>
                </motion.div>
              ))}
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant={isMobile ? "h4" : "h3"} align="center" gutterBottom sx={{ 
            fontWeight: 700, 
            mb: 6, 
            fontFamily: "Savate",
            px: { xs: 2, md: 0 }
          }}>
            Nos Valeurs Fondamentales
          </Typography>
        </motion.div>
        
        <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
          {values.map((value, index) => {
            const isOdd = index % 2 === 0;
            const bgColor = isOdd ? '#38598b' : 'white';
            const textColor = isOdd ? 'white' : 'text.primary';
            
            return (
              <Grid item xs={12} md={4} key={index} sx={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Paper 
                    elevation={6}
                    sx={{
                      p: isMobile ? 2 : 3,
                      width: '300px',
                      minHeight: '140px', 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      backgroundColor: bgColor,
                      color: textColor,
                      '&:hover': {
                        boxShadow: 6,
                        backgroundColor: isOdd ? 'white' : '#38598b',
                        color: isOdd ? 'text.primary' : 'white',
                        '& .MuiSvgIcon-root': {
                          color: isOdd ? 'primary.main' : 'white'
                        }
                      }
                    }}
                  >
                    <Box sx={{ 
                      mb: 2,
                      '& .MuiSvgIcon-root': {
                        color: isOdd ? 'white' : 'primary.main',
                        transition: 'color 0.3s ease',
                        fontSize: isMobile ? '2rem' : '2.5rem'
                      }
                    }}>
                      {value.icon}
                    </Box>
                    <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ 
                      fontWeight: 600, 
                      fontFamily: "Savate" 
                    }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontFamily: "Savate",
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      {value.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Container maxWidth="md" sx={{ py: 8, px: { xs: 2, md: 0 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant={isMobile ? "h4" : "h3"} align="center" gutterBottom sx={{ 
            fontWeight: 700, 
            mb: 6, 
            fontFamily: "Savate" 
          }}>
            Questions Fréquentes
          </Typography>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Accordion 
                elevation={2} 
                sx={{ mb: 2 }}
                component={motion.div}
                whileHover={{ scale: 1.01 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ 
                    fontWeight: 600, 
                    fontFamily: "Savate",
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}>
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{
                    fontFamily: "Savate",
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}>
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;