import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useRef } from 'react';
import { DOCUMENTS_BY_CATEGORY } from '../../utils/constants';
import { docAPI, authAPI } from '../../services/api';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const DocumentCard = ({ doc, onUpload, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await docAPI.verify(file);
      onUpload(doc.name, data.status || 'Verified');
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Verification failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const isUploaded = doc.status === 'Uploaded' || doc.status === 'Verified';

  return (
    <Grid item xs={12} md={6}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        elevation={isHovered ? 8 : 1}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          p: 3,
          borderRadius: 4,
          height: '100%',
          border: '1px solid',
          borderColor: isUploaded ? 'success.light' : isHovered ? 'primary.main' : 'divider',
          bgcolor: isUploaded ? '#f0fdf4' : 'background.paper'
        }}
      >
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isUploaded ? 'success.main' : 'primary.50', color: isUploaded ? 'white' : 'primary.main' }}>
            {isUploaded ? <CheckCircleIcon /> : <InsertDriveFileIcon />}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">{doc.name}</Typography>
            <Typography variant="caption" sx={{ color: isUploaded ? 'success.main' : 'text.secondary', fontWeight: 'bold' }}>
              {uploading ? 'UPLOADING...' : isUploaded ? 'VERIFIED' : 'PENDING ACTION'}
            </Typography>
          </Box>
        </Box>

        {uploading ? (
          <Box mt={2}><LinearProgress /></Box>
        ) : isUploaded ? (
          <Box p={2} sx={{ border: '2px dashed', borderColor: 'success.light', borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="success.dark">Successfully Verified</Typography>
          </Box>
        ) : (
          <Box
            sx={{ border: '2px dashed', borderColor: 'grey.300', borderRadius: 3, p: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'primary.50', borderColor: 'primary.main' } }}
            onClick={() => fileInputRef.current.click()}
          >
            <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            <CloudUploadIcon sx={{ fontSize: 40, color: 'grey.300', mb: 1 }} />
            <Typography variant="body2" fontWeight="bold">Click to Upload</Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

const DocumentUpload = () => {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await authAPI.getProfile();
        setProfile(data);
        if (data) localStorage.setItem('userProfile', JSON.stringify(data));

        if (data && data.email) {
          const cat = (data.category || 'OPEN').toUpperCase();
          const requiredDocs = DOCUMENTS_BY_CATEGORY[cat] || DOCUMENTS_BY_CATEGORY['OPEN'];

          const storageKey = `documents_${data.email}`;
          const storedDocs = JSON.parse(localStorage.getItem(storageKey)) || {};

          setDocuments(requiredDocs.map(doc => ({
            name: doc,
            status: storedDocs[doc]?.status || 'Pending'
          })));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpload = (docName, status) => {
    const updatedDocs = documents.map(doc =>
      doc.name === docName ? { ...doc, status: status || 'Uploaded' } : doc
    );
    setDocuments(updatedDocs);

    if (profile?.email) {
      const storageKey = `documents_${profile.email}`;
      const store = {};
      updatedDocs.forEach(d => { store[d.name] = { status: d.status }; });
      localStorage.setItem(storageKey, JSON.stringify(store));
    }
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
      <CircularProgress />
      <Typography variant="h6" mt={2}>Loading Verification Hub...</Typography>
    </Container>
  );

  if (!profile || !profile.email) return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 5, border: '2px dashed', borderColor: 'divider' }}>
        <Typography variant="h4" gutterBottom fontWeight="800">Please Login</Typography>
        <Typography color="text.secondary" mb={4}>We couldn't retrieve your session details. Please login again.</Typography>
        <Button variant="contained" href="/login" size="large">Login Now</Button>
      </Paper>
    </Container>
  );

  const totalDocs = documents.length;
  const uploadedDocs = documents.filter(d => d.status === 'Uploaded' || d.status === 'Verified').length;
  const progress = totalDocs === 0 ? 0 : (uploadedDocs / totalDocs) * 100;

  return (
    <Container maxWidth="lg">
      <Box mb={6} textAlign="center">
        <Typography variant="h3" fontWeight="800" gutterBottom>Document Verification Hub</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>Secure vault for your admission certificates.</Typography>

        <Paper elevation={0} sx={{ p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="bold">Verification Status</Typography>
            <Typography variant="h5" fontWeight="bold">{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
          <PendingActionsIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 150, opacity: 0.2 }} />
        </Paper>
      </Box>

      {totalDocs === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6">No documents required for category: {profile.category || 'N/A'}</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} href="/profile">Update Profile</Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {documents.map((doc, index) => (
            <DocumentCard key={doc.name} doc={doc} index={index} onUpload={handleUpload} />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DocumentUpload;
