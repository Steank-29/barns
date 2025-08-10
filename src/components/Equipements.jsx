import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import FacadePage from '../hooks/FacadePage';
import BarrierePage from '../hooks/BarrierePage';
import TwoBoxPage from '../hooks/TwoBoxPage';
import TwoBoxResinPage from '../hooks/TwoBoxResinPage';
import ThreeBoxPage from '../hooks/ThreeBoxPage';
import FiveBoxPage from '../hooks/FiveBoxPage';
import MangPage from '../hooks/MangPage';
import PortePage from '../hooks/PortePage';
import FenetPage from '../hooks/FenetPage';
import MallePage from '../hooks/MallePage';

export default function Equipements() {
  const [value, setValue] = useState(<FacadePage/>);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 1, sm: 3, md: 5 } }}>
      <Box
        textAlign="center"
        mb={4}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h1"
          color="primary"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.75rem', lg: '4.75rem' },
            fontFamily: 'Savate',
          }}
          component={motion.h1}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Nos Équipements Équestres
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.primary"
          maxWidth={800}
          mx="auto"
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1rem', lg: '1.1rem' },
            fontFamily: 'Savate',
          }}
          component={motion.p}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Une gamme complète d&apos;équipements équestres haut de gamme, conçus par des professionnels
          pour répondre aux exigences des centres équestres, écuries privées et installations
          professionnelles. Nos produits allient qualité supérieure, sécurité optimale et design
          fonctionnel pour offrir des solutions durables à vos projets équestres.
        </Typography>
      </Box>

      <Box sx={{ mb: 3}}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="equipements tabs"
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.7rem', lg: '1.3rem' },
              px: { xs: 1, sm: 1, md: 1.5, lg: 2.5 },
              py: 2,
              fontFamily: 'Savate',
              color: '#38598b',
              textTransform: 'uppercase',
            },
          }}
        >
          <Tab label="Façades" value={<FacadePage/>} />
          <Tab label="Barrières" value={<BarrierePage/>} />
          <Tab label="2 Box" value={<TwoBoxPage/>} />
          <Tab label="2 Box Résine" value={<TwoBoxResinPage/>} />
          <Tab label="3 Box" value={<ThreeBoxPage/>} />
          <Tab label="5 Box" value={<FiveBoxPage/>} />
          <Tab label="Mangeoires" value={<MangPage/>} />
          <Tab label="Portes" value={<PortePage/>} />
          <Tab label="Fenêtres" value={<FenetPage/>} />
          <Tab label="Malles" value={<MallePage/>} />
        </Tabs>
      </Box>

      <Box sx={{ padding: 2 }}>
        {value}
      </Box>
    </Box>
  );
}
