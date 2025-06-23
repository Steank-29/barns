import React from 'react';
import { Container, Typography, Box, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Changed from HomeIcon
import Lottie from 'lottie-react';
import errorAnimation from '../assets/error.json';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box sx={{ width: '300px', height: '300px', mb: 4 }}>
        <Lottie 
          animationData={errorAnimation} 
          loop={true} 
          autoPlay={true} 
        />
      </Box>
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Oups ! Une erreur est survenue
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        La page que vous recherchez n'existe pas ou une erreur s'est produite.
      </Typography>
      
      <Tooltip title="Retour à l'accueil" arrow>
        <IconButton
          color="primary"
          onClick={handleGoHome}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            width: 56,
            height: 56,
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Container>
  );
};

export default ErrorPage;