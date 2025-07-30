import React from 'react';
import Lottie from 'lottie-react';
import { Box } from '@mui/material';
import horseAnimation from '../assets/spinner.json';

const HorseSpinner = () => (


  <Box
    sx={{
      position: 'fixed', 
      top: '50%',       
      left: '50%',      
      transform: 'translate(-50%, -50%)', 
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