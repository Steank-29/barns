import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  styled,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { tableCellClasses } from '@mui/material/TableCell';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#38598b',
    color: theme.palette.common.white,
    fontFamily: 'Savate, sans-serif',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: 'Savate, sans-serif',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AdminDash = () => {
  const [counts, setCounts] = useState({
    facades: 0,
    barrieres: 0,
    twoboxes: 0,
    twoboxresins: 0,
    threeboxes: 0,
    fiveboxes: 0,
    mangs: 0,
    portes: 0,
    fenets: 0,
    malles: 0,
    barns: 0
  });
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState({
    products: true,
    subscribers: true
  });
  const [error, setError] = useState({
    products: null,
    subscribers: null
  });
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setSnackbar({
      open: true,
      message: 'Email copied to clipboard!',
      severity: 'success'
    });
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleDeleteClick = (email) => {
    setEmailToDelete(email);
    setDeleteDialogOpen(true);
  };

const handleDeleteConfirm = async () => {
  setIsDeleting(true);
  try {
    const response = await axios.delete(`http://localhost:5000/news/unsubscribe/${encodeURIComponent(emailToDelete)}`);

    if (response.data.success) {
      setSubscribers(subscribers.filter(sub => sub.email !== emailToDelete));
      setSnackbar({
        open: true,
        message: response.data.message || 'Subscriber deleted successfully',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: response.data.message || 'Failed to delete subscriber',
        severity: 'error'
      });
    }
  } catch (err) {
    setSnackbar({
      open: true,
      message: err.response?.data?.message || 'Error deleting subscriber',
      severity: 'error'
    });
  } finally {
    setIsDeleting(false);
    setDeleteDialogOpen(false);
  }
};

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmailToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products data
        const productsRes = await Promise.all([
          axios.get('http://localhost:5000/api/facade/getallfacades'),
          axios.get('http://localhost:5000/api/barriere/getallbarrieres'),
          axios.get('http://localhost:5000/api/twobox/getalltwoboxes'),
          axios.get('http://localhost:5000/api/twoboxresin/getalltwoboxresins'),
          axios.get('http://localhost:5000/api/threebox/getallthreeboxes'),
          axios.get('http://localhost:5000/api/fivebox/getallfiveboxes'),
          axios.get('http://localhost:5000/api/mang/getallmangs'),
          axios.get('http://localhost:5000/api/porte/getallportes'),
          axios.get('http://localhost:5000/api/fenet/getallfenets'),
          axios.get('http://localhost:5000/api/malle/getallmalles'),
          axios.get('http://localhost:5000/api/barn/getallbarns')
        ]);

        setCounts({
          facades: productsRes[0].data.length,
          barrieres: productsRes[1].data.length,
          twoboxes: productsRes[2].data.length,
          twoboxresins: productsRes[3].data.length,
          threeboxes: productsRes[4].data.length,
          fiveboxes: productsRes[5].data.length,
          mangs: productsRes[6].data.length,
          portes: productsRes[7].data.length,
          fenets: productsRes[8].data.length,
          malles: productsRes[9].data.length,
          barns: productsRes[10].data.length
        });
        setLoading(prev => ({ ...prev, products: false }));
      } catch (err) {
        setError(prev => ({ ...prev, products: err.message }));
        setLoading(prev => ({ ...prev, products: false }));
      }

      try {
        const subscribersRes = await axios.get('http://localhost:5000/news/subscribers');
        let subscribersData = [];
        if (subscribersRes.data && subscribersRes.data.data) {
          subscribersData = subscribersRes.data.data;
        } else if (Array.isArray(subscribersRes.data)) {
          subscribersData = subscribersRes.data;
        }
        setSubscribers(subscribersData);
        setLoading(prev => ({ ...prev, subscribers: false }));
      } catch (err) {
        setError(prev => ({ ...prev, subscribers: err.message }));
        setSubscribers([]);
        setLoading(prev => ({ ...prev, subscribers: false }));
      }
    };

    fetchData();
  }, []);

  const boxData = [
    { title: "Façades", count: counts.facades, route: "/admin-cards-edit" },
    { title: "Barrières", count: counts.barrieres, route: "/admin-barriere-edit" },
    { title: "Two Box", count: counts.twoboxes, route: "/admin-twobox-edit" },
    { title: "Two Box Resin", count: counts.twoboxresins, route: "/admin-twoboxresin-edit" },
    { title: "Three Box", count: counts.threeboxes, route: "/admin-threebox-edit" },
    { title: "Five Box", count: counts.fiveboxes, route: "/admin-fivebox-edit" },
    { title: "Mangs", count: counts.mangs, route: "/admin-malle-edit" },
    { title: "Portes", count: counts.portes, route: "/admin-porte-edit" },
    { title: "Fenêtres", count: counts.fenets, route: "/admin-fenet-edit" },
    { title: "Malles", count: counts.malles, route: "/admin-mang-edit" },
    { title: "Barns", count: counts.barns, route: "/admin-barn-edit" },
  ];

  if (loading.products && loading.subscribers) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error.products) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading products: {error.products}
      </Alert>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh', p: 4 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          color: 'black',
          fontFamily: 'Savate',
          mb: 6,
          textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: '4px',
        }}
      >
        Tableau de Bord Administratif
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
        {boxData.map((box, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card
                sx={{
                  backgroundColor: index % 2 === 0 ? '#38598b' : 'white',
                  color: index % 2 === 0 ? 'white' : 'black',
                  minHeight: 140,
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Box>
                    <Typography variant="h6" fontFamily="Savate, sans-serif">
                      {box.title}
                    </Typography>
                    <Typography variant="body2" fontFamily="Savate, sans-serif">
                      {box.count} articles en stock
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, textAlign: 'right' }}>
                  <Link
                    href={box.route}
                    underline="hover"
                    sx={{
                      color: index % 2 === 0 ? 'white' : '#38598b',
                      fontFamily: 'Savate, sans-serif',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Manage {box.title}
                  </Link>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="h4"
        sx={{
          color: 'black',
          fontFamily: 'Savate',
          mb: 3,
          fontWeight: 'bold',
        }}
      >
        Newsletter Subscribers ({subscribers.length})
      </Typography>
      
      {error.subscribers ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading subscribers: {error.subscribers}
        </Alert>
      ) : loading.subscribers ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="subscribers table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell align="right">Subscription Date</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscribers.length > 0 ? (
                subscribers.map((subscriber, index) => (
                  <StyledTableRow key={subscriber._id || index}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{subscriber.email}</StyledTableCell>
                    <StyledTableCell align="right">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip 
                        title={copiedEmail === subscriber.email ? "Copied!" : "Copy to clipboard"}
                        arrow
                      >
                        <IconButton
                          onClick={() => copyToClipboard(subscriber.email)}
                          color="primary"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete subscriber" arrow>
                        <IconButton
                          onClick={() => handleDeleteClick(subscriber.email)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} align="center">
                    No subscribers found
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontFamily="Savate">
          Confirm Unsubscribe
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" fontFamily="Savate">
            Are you sure you want to unsubscribe {emailToDelete}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            color="primary"
            disabled={isDeleting}
            fontFamily="Savate"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            autoFocus
            disabled={isDeleting}
            fontFamily="Savate"
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Unsubscribe'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ fontFamily: 'Savate' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDash;