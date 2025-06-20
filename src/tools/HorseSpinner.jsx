import React from 'react';
import Lottie from 'lottie-react';
import { Box } from '@mui/material';
import horseAnimation from '../assets/spinner.json';

const HorseSpinner = () => (


  <Box
    sx={{
      position: 'fixed', // Takes spinner out of normal document flow
      top: '50%',       // Centers vertically
      left: '50%',      // Centers horizontally
      transform: 'translate(-50%, -50%)', // Precise centering
      height: '50vh',
      width: '50vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: 'background.default',
      zIndex: 9999, 
    }}
  >
    <Box textAlign="center">
      <Lottie
        animationData={horseAnimation}
        loop={true}
        autoplay={true}
        style={{ width: 180, height: 180 }}
      />
    </Box>
  </Box>
);

export default HorseSpinner;