import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Inventory, Store, Settings, People } from '@mui/icons-material';
import { motion } from 'framer-motion';

const iconStyle = { fontSize: 40 };

const boxData = [
  { icon: <Inventory />, title: "Produits", subtitle: "124 articles en stock" },
  { icon: <Store />, title: "Commandes", subtitle: "58 commandes en cours" },
  { icon: <People />, title: "Clients", subtitle: "312 clients enregistrés" },
  { icon: <Settings />, title: "Paramètres", subtitle: "Configuration système" },
];

const AdminDash = () => {
  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', p: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: '#755139',
          fontFamily: 'Savate, sans-serif',
          mb: 6,
          textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: '2px',
        }}
      >
        Tableau de Bord Administratif pour la Gestion des Box à Chevaux et des Barns Démontables
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            {boxData.map((box, index) => {
              const isEven = index % 2 === 0;
              const bgColor = isEven ? '#755139' : '#F2EDD7';
              const textColor = isEven ? '#F2EDD7' : '#755139';

              return (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Card
                      sx={{
                        backgroundColor: bgColor,
                        color: textColor,
                        minHeight: 140,
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {React.cloneElement(box.icon, { style: { ...iconStyle, color: textColor } })}
                          <Box>
                            <Typography variant="h6">{box.title}</Typography>
                            <Typography variant="body2">{box.subtitle}</Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#F2EDD7', color: '#755139', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Statistiques de Vente</Typography>
                  <BarChart
                    series={[{ data: [5, 10, 15, 20], label: 'Box vendus' }]}
                    xAxis={[{ data: ['Jan', 'Fév', 'Mar', 'Avr'], scaleType: 'band' }]}
                    height={200}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#755139', color: '#F2EDD7', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Répartition des Produits</Typography>
                  <PieChart
                    series={[{
                      data: [
                        { id: 0, value: 40, label: 'Box' },
                        { id: 1, value: 30, label: 'Barns' },
                        { id: 2, value: 30, label: 'Accessoires' },
                      ],
                    }]}
                    height={200}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDash;