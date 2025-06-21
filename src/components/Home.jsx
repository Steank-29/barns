import React, {useState} from 'react';
import { Box, Typography, Button, styled, Paper, Card, CardContent, CardMedia, Rating, Grid, Container, Modal, IconButton, Stepper, Step, StepLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import backgroundVideo from '../assets/barnvideo.mp4';
import barn1 from '../assets/barn1.jpeg';
import barn2 from '../assets/barn2.jpeg';
import barn3 from '../assets/barn3.jpeg';
import barn4 from '../assets/barn4.jpeg';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import equip1 from '../assets/equip1.jpeg';
import equip2 from '../assets/equip2.jpeg';
import equip3 from '../assets/equip3.jpeg'; 
import equip4 from '../assets/equip4.jpeg';
import equip5 from '../assets/equip5.jpeg';
import equip6 from '../assets/equip6.jpeg';
import equip7 from '../assets/equip7.jpeg';
import equip8 from '../assets/equip8.jpeg';
import equip9 from '../assets/equip9.jpeg';
import equip10 from '../assets/equip10.jpeg';

import horsey from "../assets/goldenbh_logo.png";
import horse from "../assets/horsey.png";

import HealthIcon from "../assets/light.png"
import HorseIcon from "../assets/hoof.png"
import BarnIcon from "../assets/recycling.png"
import ConstructionIcon from "../assets/bio.png"


const CircleButton = styled(IconButton)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: "#222831",
    transform: 'scale(1.1)'
  },
  transition: 'all 0.3s ease',
  boxShadow: theme.shadows[4],
  position: 'absolute',
}));



const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '90vh',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const VideoBackground = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: -1,
});

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 0,
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  zIndex: 1,
  textAlign: 'center',
  padding: theme.spacing(4),
  maxWidth: '800px',
  color: theme.palette.common.white,
}));

const CTAButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '50px',
  boxShadow: theme.shadows[4],
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
  },
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
}));


const products = [
  {
    id: 1,
    name: "Écurie Démontable Standard",
    description: "Structure de base 3 boxes avec allée centrale. Parfait pour centres équestres.",
    price: "12 500 DT",
    image: barn1,
    rating: 4
  },
  {
    id: 2,
    name: "Écurie Premium Luxe",
    description: "4 boxes spacieux avec sellerie intégrée et système de ventilation avancé.",
    price: "18 900 DT",
    image: barn2,
    rating: 5
  },
  {
    id: 3,
    name: "Mini-Écurie Compacte",
    description: "Solution 2 boxes pour propriétaires privés. Installation en 48h.",
    price: "8 750 DT",
    image: barn3,
    rating: 4.5
  },
  {
    id: 4,
    name: "Écurie Professionnelle",
    description: "Configurable jusqu'à 10 boxes avec bureau et espace soins. Sur devis.",
    price: "À partir de 25 000 DT",
    image: barn4,
    rating: 4
  }
];

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[6]
  }
}));

const PriceText = styled(Typography)(({ theme }) => ({
  color: '#38598b',
  fontWeight: 'bold',
  marginTop: theme.spacing(1)
}));




const Home = () => {
  const theme = useTheme();

  const images = [
    equip1,
    equip2,
    equip3,
    equip4,
    equip5,
    equip6,
    equip7,
    equip8,
    equip9,
    equip10,

  ];

 const settings = {
    dots: false,
    infinite: true,
    speed: 5000, // Slower speed for continuous scroll
    slidesToShow: 5, // Number of images to show at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Essential for continuous scroll
    cssEase: 'linear', // Creates smooth linear animation
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  // Duplicate images to create seamless infinite loop
  const duplicatedImages = [...images, ...images, ...images];

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', text: '' });

  const infoItems = [
    {
      id: 1,
      icon:  <img src={HorseIcon} alt='horse' style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        color:'white'
      }}/>,
      position: { top: '20%', left: '20%', backgroundColor:'#222831' },
      title: 'Horse Breeds',
      content: 'We specialize in caring for various horse breeds including Thoroughbreds, Arabians, and Quarter Horses. Each breed has unique needs we accommodate.'
    },
    {
      id: 2,
      icon: <img src={BarnIcon} alt='barn' style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        color:'white'
      }}/> ,
      position: { top: '20%', right: '20%', backgroundColor:'#222831' },
      title: 'Barn Features',
      content: 'Our demountable barns feature weather-resistant materials, optimal ventilation, and modular designs that can be customized to your needs.'
    },
    {
      id: 3,
      icon: <img src={ConstructionIcon} alt='ConstructionIcon' style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        color:'white'
      }}/>,
      position: { bottom: '20%', left: '20%', backgroundColor:'#222831' },
      title: 'Construction',
      content: 'Quick assembly structures that maintain structural integrity while being eco-friendly. No foundation required for most installations.'
    },
    {
      id: 4,
      icon: <img src={HealthIcon} alt='HealthIcon' style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        color:'white'
      }}/>,
      position: { bottom: '20%', right: '20%', backgroundColor:'#222831'  },
      title: 'Horse Health',
      content: 'Our designs prioritize equine welfare with features that reduce stress, prevent injuries, and promote overall health.'
    }
  ];

  const handleOpen = (title, content) => {
    setModalContent({ title, content });
    setOpenModal(true);
  };



  const [activeStep, setActiveStep] = React.useState(0);

  const handleClose = () => {
  setOpenModal(false);
  setActiveStep(0);  // Reset stepper to first step
};

const steps = [
  { label: 'Introduction' },
  { label: 'Structural Safety' },
  { label: 'Weather Protection' },
  { label: 'Flexibility' },
  { label: 'Conclusion' }
];

const handleNext = () => {
  setActiveStep((prevActiveStep) => prevActiveStep + 1);
};

const handleBack = () => {
  setActiveStep((prevActiveStep) => prevActiveStep - 1);
};

const getStepContent = (step) => {
  switch (step) {
    case 0:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate' }}>
          Demountable horse barns provide exceptional security and safety for your horses. 
          These versatile structures offer protection while maintaining flexibility for 
          different locations and needs.
        </Typography>
      );
    case 1:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate' }}>
          <strong>Structural Safety:</strong> Our demountable barns are engineered with 
          reinforced frames and secure fastenings to ensure stability even in harsh conditions. 
          The modular design doesn't compromise on strength, providing a safe environment 
          for your horses.
        </Typography>
      );
    case 2:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate' }}>
          <strong>Weather Protection:</strong> Designed to withstand various weather conditions, 
          these barns offer excellent insulation and waterproofing. Your horses will be 
          protected from rain, wind, and extreme temperatures.
        </Typography>
      );
    case 3:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate' }}>
          <strong>Flexibility Advantage:</strong> Unlike permanent structures, demountable barns 
          can be relocated as needed. This means you can always ensure your horses are in 
          the most secure location, whether that's near grazing areas or sheltered from 
          prevailing winds.
        </Typography>
      );
    case 4:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate' }}>
          <strong>Final Thoughts:</strong> Choosing a demountable horse barn means choosing 
          adaptable security. You get all the safety features of a traditional barn with 
          the added benefit of mobility and customization options.
        </Typography>
      );
    default:
      return 'Unknown step';
  }
};

  return (
    <React.Fragment>
    <HeroContainer component="section">
      {/* Video Background */}
      <VideoBackground autoPlay loop muted playsInline>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>
      
      {/* Dark overlay for better text contrast */}
      <Overlay />
      
      {/* Content */}
      <ContentContainer>
        <Typography 
          variant="h1" 
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 4,
            fontSize: { xs: '2rem', md: '4rem' },
            lineHeight: 1,
            fontFamily:'Savate'
          }}
        >
          Écuries Démontables Sur Mesure | Boxes Équins Portables Haut de Gamme
        </Typography>
        
        <Typography 
          variant="h5" 
          component="p"
          sx={{
            mb: 4,
            fontWeight: 400,
            fontSize: { xs: '0.8rem', md: '1.5rem' },
            fontFamily:'Savate'
          }}
        >
          Donnez Vie à Votre Projet Équestre – Solutions Modulaires, Robuste & Personnalisées
        </Typography>
        
        <Box sx={{mb:8}}>
          <CTAButton 
            variant="contained" 
            size="large"
            sx={{ mr: 2,backgroundColor:"#38598b", fontFamily:'Savate' }}
          >
            Get Started
          </CTAButton>
          <CTAButton 
            variant="outlined" 
            color="inherit"
            size="large"
            sx={{fontFamily:'Savate'}}
          >
            Learn More
          </CTAButton>
        </Box>
      </ContentContainer>
      
    </HeroContainer>

<Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Centered headline */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, fontFamily:'Savate' }}>
          Nos Écuries Démontables
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{color:'black', fontFamily:'Savate', fontSize:18}}>
          Découvrez notre gamme de structures équestres modulaires
        </Typography>
      </Box>

      {/* Product cards - single row */}
      <Grid 
        container 
        spacing={4}
        justifyContent="center"
        sx={{
          flexWrap: 'nowrap', // Prevent wrapping to new line
          overflowX: 'auto', // Enable horizontal scrolling on small screens
          py: 2,
          '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar
        }}
      >
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} sx={{ minWidth: 300 }}>
            <StyledCard>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" sx={{fontFamily:'Savate'}}>
                  {product.name}
                </Typography>
                <Rating value={product.rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 ,fontFamily:'Savate' }}>
                  {product.description}
                </Typography>
                <PriceText variant="h6" sx={{fontFamily:'Savate'}}>
                  {product.price}
                </PriceText>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>

          <Box sx={{ textAlign: 'center', mt: 2, mb:2 }}>
        <Typography sx={{ fontWeight: 700, fontFamily:'Savate', fontSize:22 }}>
          Plan architectural des écuries
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{color:'black', fontFamily:'Savate', fontSize:18}}>
          Ce plan architectural des écuries détaille les fondations, la charpente et les normes de sécurité équines.
        </Typography>
      </Box>

<Box sx={{ maxWidth: '100%', overflow: 'hidden', py: 2 }}>
      <Slider {...settings}>
        {duplicatedImages.map((image, index) => (
          <Box key={index} sx={{ px: 1 }}>
            <img 
              src={image} 
              alt={`Slide ${index}`} 
              style={{ 
                width: '60%', 
                height: '160px',
                objectFit: 'cover',
                borderRadius: '8px',
              }} 
            />
          </Box>
        ))}
      </Slider>
    </Box>


    <Box sx={{
  position: 'relative',
  height: '90vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#38598b',
  overflow: 'hidden'
}}>

  {/* Horse Image */}
  <Box
    component="img"
    src={horse}
    alt="Beautiful horse"
    sx={{
      maxWidth: '40%',
      maxHeight: '40%',
      objectFit: 'contain',
      borderRadius: 0,
      boxShadow: 0,
    }}
  />

  {/* Interactive Circles */}
  {infoItems.map((item) => (
    <CircleButton
      key={item.id}
      sx={item.position}
      onClick={() => handleOpen(item.title, item.content)}
    >
      {item.icon}
    </CircleButton>
  ))}

  {/* Enhanced Modal */}
  <Modal
    open={openModal}
    onClose={handleClose}
    aria-labelledby="horse-info-modal"
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Paper sx={{
      width: '80%',  // Larger width
      maxWidth: 900,  // Maximum size
      maxHeight: '90vh',
      p: 4,
      borderRadius: 2,
      outline: 'none',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo at top left */}
      <Box sx={{ position: 'relative', top: 20, left: 20 }}>
        <img src={horsey} alt="Logo" style={{ height: '50px' }} />
      </Box>
      
      {/* Centered Title */}
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          mt: 2,
          mb: 4, 
          fontFamily:'Savate'
        }}
      >
        {modalContent.title}
      </Typography>
      
      {/* Vertical Stepper and Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            width: '200px',
            pr: 4,
            flexShrink: 0
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Content Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {getStepContent(activeStep)}
        </Box>
      </Box>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{ width: 120, backgroundColor: 'white',borderColor:'white', color: '#38598b', '&:hover': { transform: 'scale(1.03)', backgroundColor: '#38598b', color: 'white',borderColor:'#38598b'
  } }}
        >
          Back
        </Button>
        
        <Button
          onClick={activeStep === steps.length - 1 ? handleClose : handleNext}
          variant="contained"
          sx={{ width: 120, backgroundColor: '#38598b', borderColor:'#38598b', color: 'white', '&:hover': { transform: 'scale(1.03)', backgroundColor: 'white', color: '#38598b', borderColor:'white' } }}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
        </Button>
      </Box>
    </Paper>
  </Modal>
</Box>

    </React.Fragment>
  );
};

export default Home;