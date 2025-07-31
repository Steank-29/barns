import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  TextField, 
  Button, 
  Paper,
  Grid,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  DateRange as DateRangeIcon,
  LocationOn as LocationOnIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Parametre = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('usersdatatoken');
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token); 
      return decoded.id;
    } catch (err) {
      console.error('Erreur de décodage du token:', err);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const authAxios = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userdatatoken')}`
    }
  });

  const fetchAdminData = async () => {
    try {
      const response = await authAxios.get(`/users/${userId}`);
      setAdminData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Échec du chargement des données');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAdminData();
    } else {
      setError('Utilisateur non authentifié');
      setLoading(false);
    }
  }, [userId]);

  const handleEditStart = (fieldName) => {
    setEditingField(fieldName);
    setTempValue(adminData[fieldName]);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleEditSave = async () => {
    try {
      const response = await authAxios.put(`/users/${userId}`, {
        [editingField]: tempValue
      });
      
      setAdminData(response.data);
      setEditingField(null);
      showSnackbar('Modifications enregistrées avec succès', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Échec de la mise à jour', 'error');
    }
  };

  const handlePasswordChange = async () => {
    if (password.new !== password.confirm) {
      showSnackbar('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    try {
      await authAxios.put(`/users/${userId}`, {
        currentPassword: password.current,
        newPassword: password.new
      });
      
      setPassword({ current: '', new: '', confirm: '' });
      showSnackbar('Mot de passe mis à jour avec succès', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Échec de la mise à jour du mot de passe', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authAxios.delete(`/users/${userId}`);
      localStorage.removeItem('userdatatoken');
      window.location.href = '/connexion';
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Échec de la suppression du compte', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!adminData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Aucune donnée administrateur trouvée</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#38598b', fontWeight: 'bold' }}>
        Paramètres Administrateur
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#38598b' }}>
          Informations Personnelles
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom complet"
              name="name"
              value={editingField === 'name' ? tempValue : adminData.name}
              onChange={(e) => setTempValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
                readOnly: editingField !== 'name'
              }}
            />
            {editingField === 'name' ? (
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleEditSave}
                  sx={{ mr: 2, backgroundColor: '#38598b' }}
                >
                  <SaveIcon sx={{ mr: 1 }} /> Enregistrer
                </Button>
                <Button variant="outlined" onClick={handleEditCancel}>
                  Annuler
                </Button>
              </Box>
            ) : (
              <Button 
                startIcon={<EditIcon />}
                onClick={() => handleEditStart('name')}
                sx={{ mt: 2, color: '#38598b' }}
              >
                Modifier
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={adminData.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
                readOnly: true
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#38598b' }}>
          Informations de l'Entreprise
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom de l'entreprise"
              name="namecompany"
              value={editingField === 'namecompany' ? tempValue : adminData.namecompany}
              onChange={(e) => setTempValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="primary" />
                  </InputAdornment>
                ),
                readOnly: editingField !== 'namecompany'
              }}
            />
            {editingField === 'namecompany' ? (
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleEditSave}
                  sx={{ mr: 2, backgroundColor: '#38598b' }}
                >
                  <SaveIcon sx={{ mr: 1 }} /> Enregistrer
                </Button>
                <Button variant="outlined" onClick={handleEditCancel}>
                  Annuler
                </Button>
              </Box>
            ) : (
              <Button 
                startIcon={<EditIcon />}
                onClick={() => handleEditStart('namecompany')}
                sx={{ mt: 2, color: '#38598b' }}
              >
                Modifier
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date de création"
              name="date"
              value={editingField === 'date' ? tempValue : adminData.date}
              onChange={(e) => setTempValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon color="primary" />
                  </InputAdornment>
                ),
                readOnly: editingField !== 'date'
              }}
            />
            {editingField === 'date' ? (
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleEditSave}
                  sx={{ mr: 2, backgroundColor: '#38598b' }}
                >
                  <SaveIcon sx={{ mr: 1 }} /> Enregistrer
                </Button>
                <Button variant="outlined" onClick={handleEditCancel}>
                  Annuler
                </Button>
              </Box>
            ) : (
              <Button 
                startIcon={<EditIcon />}
                onClick={() => handleEditStart('date')}
                sx={{ mt: 2, color: '#38598b' }}
              >
                Modifier
              </Button>
            )}
          </Grid>


                    <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Produit Principal"
              name="produit"
              value={editingField === 'produit' ? tempValue : adminData.produit}
              onChange={(e) => setTempValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon color="primary" />
                  </InputAdornment>
                ),
                readOnly: editingField !== 'produit'
              }}
            />
            {editingField === 'produit' ? (
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleEditSave}
                  sx={{ mr: 2, backgroundColor: '#38598b' }}
                >
                  <SaveIcon sx={{ mr: 1 }} /> Enregistrer
                </Button>
                <Button variant="outlined" onClick={handleEditCancel}>
                  Annuler
                </Button>
              </Box>
            ) : (
              <Button 
                startIcon={<EditIcon />}
                onClick={() => handleEditStart('produit')}
                sx={{ mt: 2, color: '#38598b' }}
              >
                Modifier
              </Button>
            )}
          </Grid>


        <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom de Fondateur"
              name="fondateur"
              value={editingField === 'fondateur' ? tempValue : adminData.fondateur}
              onChange={(e) => setTempValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon color="primary" />
                  </InputAdornment>
                ),
                readOnly: editingField !== 'fondateur'
              }}
            />
            {editingField === 'fondateur' ? (
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleEditSave}
                  sx={{ mr: 2, backgroundColor: '#38598b' }}
                >
                  <SaveIcon sx={{ mr: 1 }} /> Enregistrer
                </Button>
                <Button variant="outlined" onClick={handleEditCancel}>
                  Annuler
                </Button>
              </Box>
            ) : (
              <Button 
                startIcon={<EditIcon />}
                onClick={() => handleEditStart('fondateur')}
                sx={{ mt: 2, color: '#38598b' }}
              >
                Modifier
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Adresse"
              name="adresse"
              value={editingField === 'adresse' ? tempValue : adminData.adresse}
              onChange={(e) => setTempValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="primary" />
                  </InputAdornment>
                ),
                readOnly: editingField !== 'adresse'
              }}
            />
            {editingField === 'adresse' ? (
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleEditSave}
                  sx={{ mr: 2, backgroundColor: '#38598b' }}
                >
                  <SaveIcon sx={{ mr: 1 }} /> Enregistrer
                </Button>
                <Button variant="outlined" onClick={handleEditCancel}>
                  Annuler
                </Button>
              </Box>
            ) : (
              <Button 
                startIcon={<EditIcon />}
                onClick={() => handleEditStart('adresse')}
                sx={{ mt: 2, color: '#38598b' }}
              >
                Modifier
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#38598b' }}>
          Changer le Mot de Passe
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mot de passe actuel"
              type="password"
              value={password.current}
              onChange={(e) => setPassword({...password, current: e.target.value})}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              type="password"
              value={password.new}
              onChange={(e) => setPassword({...password, new: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({...password, confirm: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              onClick={handlePasswordChange}
              sx={{ backgroundColor: '#38598b' }}
            >
              Mettre à jour le mot de passe
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
          Zone Danger
        </Typography>
        
        <Typography sx={{ mb: 2 }}>
          La suppression de votre compte est irréversible. Toutes vos données seront perdues.
        </Typography>
        
        <Button 
          variant="contained" 
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setOpenDeleteDialog(true)}
        >
          Supprimer le Compte
        </Button>
      </Paper>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmer la Suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Confirmer la Suppression
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Parametre;