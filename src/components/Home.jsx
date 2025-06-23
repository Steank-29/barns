import React, {useState} from 'react';
import { Box, Typography, Button, styled, Paper, Card, CardContent, CardMedia, Rating, Grid, Container, Modal, IconButton, Stepper, Step, StepLabel, Accordion, AccordionSummary, AccordionDetails, Divider,Link,ListItem,ListItemIcon, List } from '@mui/material';
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

import {
  ExpandMore,
  CheckCircle,
  LocalShipping,
  Construction,
  Euro,
  Help,
  ArrowForward 
} from '@mui/icons-material';




const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    '& .arrow-icon': {
      color: theme.palette.primary.main,
      transform: 'translateX(3px)'
    }
  }
}));


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

const services = [
  {
    title: "Barns Demontable",
    description: "Écuries modulaires spécialement conçues pour le confort des chevaux, faciles à installer et adapter selon vos besoins équestres."
  },
  {
    title: "Installation et Montage",
    description: "Installation professionnelle de vos infrastructures équestres pour garantir la sécurité et le bien-être de vos chevaux."
  },
  {
    title: "Facade Porte",
    description: "Entrées d'écuries esthétiques et fonctionnelles, conçues pour le passage sécurisé des chevaux et l'aération optimale."
  },
  {
    title: "Dalles et Tapis",
    description: "Revêtements de sols spécialement étudiés pour les boxes, offrant confort aux sabots et facilité d'entretien pour les écuries."
  }
];

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
    price: "12 500 €",
    image: barn1,
    rating: 4
  },
  {
    id: 2,
    name: "Écurie Premium Luxe",
    description: "4 boxes spacieux avec sellerie intégrée et système de ventilation avancé.",
    price: "18 900 €",
    image: barn2,
    rating: 5
  },
  {
    id: 3,
    name: "Mini-Écurie Compacte",
    description: "Solution 2 boxes pour propriétaires privés. Installation en 48h.",
    price: "8 750 €",
    image: barn3,
    rating: 4.5
  },
  {
    id: 4,
    name: "Écurie Professionnelle",
    description: "Configurable jusqu'à 10 boxes avec bureau et espace soins. Sur devis.",
    price: "À partir de 25 000 €",
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


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
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
        <Typography paragraph sx={{ fontFamily: 'Savate', textAlign: 'justify', fontSize:22 }}>
          Les écuries démontables offrent une sécurité exceptionnelle pour vos chevaux.
          Ces structures polyvalentes assurent une protection tout en conservant la flexibilité
          nécessaire pour différents emplacements et besoins.
        </Typography>
      );
    case 1:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate', textAlign: 'justify', fontSize:22  }}>
          <strong>Sécurité structurelle :</strong> Nos écuries démontables sont conçues avec
          des cadres renforcés et des fixations sécurisées pour garantir une stabilité même
          dans des conditions difficiles. Le design modulaire n'altère pas la solidité,
          offrant un environnement sûr pour vos chevaux.
        </Typography>
      );
    case 2:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate', textAlign: 'justify', fontSize:22  }}>
          <strong>Protection contre les intempéries :</strong> Conçues pour résister à diverses
          conditions météorologiques, ces écuries offrent une excellente isolation et étanchéité.
          Vos chevaux seront protégés de la pluie, du vent et des températures extrêmes.
        </Typography>
      );
    case 3:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate', textAlign: 'justify', fontSize:22  }}>
          <strong>Avantage de flexibilité :</strong> Contrairement aux structures permanentes,
          les écuries démontables peuvent être déplacées selon les besoins. Vous pouvez ainsi
          toujours assurer que vos chevaux se trouvent dans l'emplacement le plus sécurisé,
          que ce soit près des zones de pâturage ou à l'abri des vents dominants.
        </Typography>
      );
    case 4:
      return (
        <Typography paragraph sx={{ fontFamily: 'Savate', textAlign: 'justify', fontSize:22  }}>
          <strong>Conclusion :</strong> Choisir une écurie démontable, c'est opter pour une
          sécurité adaptable. Vous bénéficiez de toutes les caractéristiques de sécurité d'une
          écurie traditionnelle, avec en plus l'avantage de la mobilité et des options de personnalisation.
        </Typography>
      );
    default:
      return 'Étape inconnue';
  }
};

const faqItems = [
    {
      question: (<Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:20, color:'white'}}>Vos écuries démontables sont-elles vraiment mobiles ?</Typography>),
      answer: (
        <>
          <Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:16}}>Nos structures sont conçues pour un montage et démontage faciles :</Typography>
          <List dense sx={{ mt: 1 }}>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><CheckCircle color="success" fontSize="small"/></ListItemIcon>
              <Typography variant="body2" sx={{fontFamily:'Savate' ,}}>Aucune fondation permanente nécessaire</Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><CheckCircle color="success" fontSize="small"/></ListItemIcon>
              <Typography variant="body2" sx={{fontFamily:'Savate' ,}}>Panneaux modulaires transportables par remorque standard</Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><CheckCircle color="success" fontSize="small"/></ListItemIcon>
              <Typography variant="body2" sx={{fontFamily:'Savate' ,}}>Relocalisation possible en moins de 2 jours</Typography>
            </ListItem>
          </List>
        </>
      ),
      icon: <LocalShipping sx={{color:'white'}}/>
    },
    {
      question: (<Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:20, color:'white'}}>Quels matériaux utilisez-vous ?</Typography>),
      answer: (<Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:16}}>Nous employons du pin traité premium (résistance 50 ans à la pourriture), des toitures en acier galvanisé et des parois en PVC renforcé. Tous nos matériaux sont certifiés sans danger pour les équidés et résistent à des températures de -30°C à 50°C.</Typography>),
      icon: <Construction  sx={{color:'white'}} />
    },
    {
      question: (<Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:20, color:'white'}}>Qu'est-ce qui est inclus dans le prix de base ?</Typography>),
      answer: (
        <>
          <Typography  sx={{fontFamily:'Savate' , fontSize:18, color:'black'}}>Notre package standard 3 900€ à 12 500€ selon taille comprend :</Typography>
          <ul style={{ marginTop: '8px', paddingLeft: '20px', fontFamily:'Savate' , fontSize:16 }}>
            <li style={{fontSize:16, fontFamily:'Savate'}}>Éléments structurels pré-découpés avec fixations</li>
            <li style={{fontSize:16, fontFamily:'Savate'}}>Système de toiture étanche</li>
            <li style={{fontSize:16, fontFamily:'Savate'}}>Panneaux de ventilation (4 par box)</li>
            <li style={{fontSize:16, fontFamily:'Savate'}}>Manuel d'assemblage détaillé</li>
            <li style={{fontSize:16, fontFamily:'Savate'}}>Garantie structurelle 1 an</li>
          </ul>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', fontFamily:'Savate' }}>
            Options : Installation professionnelle (850€/jour), séparations de box sur mesure, abreuvoirs automatiques.
          </Typography>
        </>
      ),
      icon: <Euro sx={{color:'white'}} />
    },
    {
      question: (<Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:20, color:'white'}}>Quel support après l'achat ?</Typography>),
      answer: (
        <>
          <Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:20, fontWeight:700}}>Nous offrons un accompagnement complet :</Typography>
          <List dense sx={{ mt: 1 }}>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><Help sx={{color:'#38598b'}} fontSize="small"/></ListItemIcon>
              <Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:16}}>Assistance téléphonique technique 24h/7j</Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><Help sx={{color:'#38598b'}} fontSize="small"/></ListItemIcon>
              <Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:16}}>Tutoriels vidéo pour montage et entretien</Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}><Help sx={{color:'#38598b'}} fontSize="small"/></ListItemIcon>
              <Typography variant="body2" sx={{fontFamily:'Savate' , fontSize:16}}>Intervention sur site (95€/h dans un rayon de 150km)</Typography>
            </ListItem>
          </List>
        </>
      ),
      icon: <Help sx={{color:'white'}} />
    }
  ];



const handleCardClick = (serviceTitle) => {
    console.log(`Service selected: ${serviceTitle}`);
    // Add your navigation logic here
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
  spacing={3}
  sx={{
    flexWrap: 'nowrap',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    py: 2,
    px: 1,
    mx: -1, // Compensate for padding
    '&::-webkit-scrollbar': { 
      height: 6,
      backgroundColor: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'text.secondary',
      borderRadius: 3
    },
    // Hide scrollbar on mobile if needed
    '@media (hover: none)': {
      '&::-webkit-scrollbar': { display: 'none' }
    }
  }}
>
  {products.map((product) => (
    <Grid 
      item 
      key={product.id} 
      sx={{ 
        minWidth: { xs: '75vw', sm: 300, md: 350 },
        scrollSnapAlign: 'center',
        px: 1 // Add horizontal spacing
      }}
    >
      <StyledCard sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ 
            objectFit: 'cover',
            aspectRatio: '4/3' // Consistent image ratio
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{
              fontFamily: 'Savate',
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            {product.name}
          </Typography>
          <Rating 
            value={product.rating} 
            precision={0.5} 
            readOnly 
            size="small"
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 1, 
              mb: 2,
              fontFamily: 'Savate',
              fontSize: { xs: '0.875rem', sm: '0.9rem' }
            }}
          >
            {product.description}
          </Typography>
          <PriceText 
            variant="h6" 
            sx={{
              fontFamily: 'Savate',
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
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

<Box sx={{ maxWidth: '100%', overflow: 'hidden', py: 2}}>
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
                borderRadius: '8px', mt:2 
              }} 
            />
          </Box>
        ))}
      </Slider>
    </Box>


    <Box sx={{
  position: 'relative',
  height: '85vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#38598b',
  overflow: 'hidden',
  mt:4
}}>

  {/* Horse Image */}
  <Box
    component="img"
    src={horse}
    alt="Beautiful horse"
    sx={{
      maxWidth: { xs: '30%', sm: '30%', md: '30%', lg: '40%' },
    maxHeight: { xs: '30%', sm: '30%', md: '30%', lg: '40%' },
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

<Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      my: 4, 
      p: 3, 
      bgcolor: 'background.paper', 
      borderRadius: 2,
      boxShadow: 1,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        mb: 2,
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontFamily:'Savate',
      }}>
        FAQ - Écuries Démontables
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {faqItems.map((item, index) => (
        <Accordion key={index} defaultExpanded={index === 0} sx={{ 
          mb: 1,
          '&:before': { display: 'none' }
        }}>
          <AccordionSummary
            expandIcon={<ExpandMore sx={{color:'white'}} />}
            sx={{ 
              bgcolor: '#38598b',
              '&:hover': { bgcolor: '#38598b' },
              borderRadius: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.icon}
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {item.question}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ 
            pt: 2, 
            pb: 3,
            bgcolor: 'background.default',
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4
          }}>
            <Typography variant="body1" component="div">
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily:'Savate' }}>
          Vous avez d'autres questions ? <Link href="#contact" sx={{ cursor: 'pointer' }}>Contactez notre équipe</Link>
        </Typography>
      </Box>
    </Box>


<Box sx={{ 
  width: '90%',
  maxWidth: '1400px',
  px: { xs: 2, md: 4 },
  py: 6,
  backgroundColor: 'background.paper',
  mx: 'auto',
  my: 4,
}}>
  {/* Section Title */}
  <Typography 
    variant="h3" 
    component="h2" 
    sx={{ 
      mb: 6,
      textAlign: 'center',
      fontWeight: 700,
      color: 'black',
      fontFamily: 'Savate',
    }}
  >
    Le confort de votre cheval, notre priorité absolue
  </Typography>
  
  {/* Services Grid */}
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: { 
      xs: '1fr', 
      sm: 'repeat(2, 1fr)', 
      md: 'repeat(4, 1fr)' 
    },
    gap: 4,
    maxWidth: '1400px',
    mx: 'auto'
  }}>
    {services.map((service, index) => (
      <ServiceCard 
        key={index} 
        onClick={() => handleCardClick(service.title)}
        elevation={3}
        sx={{
          backgroundColor: (index + 1) % 2 === 0 ? '#38598b' : 'background.paper',
          '& .MuiTypography-root': {
            color: (index + 1) % 2 === 0 ? 'white' : 'inherit'
          },
          '& .arrow-icon': {
            color: (index + 1) % 2 === 0 ? 'white' : '#38598b'
          }
        }}
      >
        <CardContent sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3
        }}>
          <Typography 
            variant="h5" 
            component="h3"
            sx={{ 
              fontWeight: 600,
              mb: 2,
              fontFamily: 'Savate',
            }}
          >
            {service.title}
          </Typography>
          
          <Typography 
            variant="body1"
            sx={{ 
              mb: 2, 
              flexGrow: 1, 
              fontFamily: 'Savate',
            }}
          >
            {service.description}
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <ArrowForward
              className="arrow-icon" 
              sx={{ 
                transition: 'all 0.3s ease',
                
              }} 
            />
          </Box>
        </CardContent>
      </ServiceCard>
    ))}
  </Box>
</Box>

    </React.Fragment>
  );
};

export default Home;