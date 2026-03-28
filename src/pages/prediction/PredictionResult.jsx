import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { authAPI, collegeAPI } from '../../services/api';

const PredictionResult = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // 1. Try to get profile from localStorage first
        const profileStr = localStorage.getItem('userProfile');
        let profile = profileStr ? JSON.parse(profileStr) : null;

        // 2. Clear corrupted local storage if it's junk
        if (profile && !profile.email && !profile.rank) {
          localStorage.removeItem('userProfile');
          profile = null;
        }

        // 3. Fetch from backend to ensure data is fresh
        const { data } = await authAPI.getProfile();
        if (data && data.email) {
          profile = data;
          localStorage.setItem('userProfile', JSON.stringify(data));
        }

        setUserProfile(profile);

        if (profile && profile.rank && profile.category) {
          await fetchPredictions(profile);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to load profile. Please ensure you are logged in.');
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchPredictions = async (profile) => {
    try {
      setLoading(true);
      setError('');
      const { data: collegeList } = await collegeAPI.predict(
        profile.rank,
        profile.category,
        profile.branch || 'Computer'
      );

      setPredictions(Array.isArray(collegeList) ? collegeList : []);
      setLoading(false);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('AI Service is currently busy. Showing rule-based results instead.');
      setLoading(false);
    }
  };

  const getChanceLevel = (closingRank) => {
    if (!userProfile?.rank || !closingRank) return 'Low';
    const userRank = Number(userProfile.rank);
    if (userRank <= closingRank * 0.7) return 'High';
    if (userRank <= closingRank * 0.95) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h5" mt={3} fontWeight="bold" color="text.secondary">
          Analyzing Admission Trends...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Our AI is calculating your chances based on last year's cutoffs.
        </Typography>
      </Container>
    );
  }

  if (!userProfile || !userProfile.rank || !userProfile.category) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 5, border: '2px dashed', borderColor: 'divider' }}>
          <Typography variant="h4" gutterBottom fontWeight="800" color="primary">
            Profile Incomplete
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, px: 4 }}>
            We need your **Rank**, **Category**, and **Preferred Branch** to generate accurate AI predictions.
          </Typography>
          <Button
            variant="contained"
            href="/profile"
            size="large"
            startIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: 3, px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Go to Profile Setup
          </Button>
        </Paper>
      </Container>
    );
  }

  const processedPredictions = (predictions || []).map(p => ({
    ...p,
    chance: getChanceLevel(p?.closingRank || 0)
  }));

  const groupByChance = (level) => processedPredictions.filter(p => p.chance === level);

  const renderSection = (title, color, icon, items) => (
    <Grid item xs={12} md={4}>
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 4,
          bgcolor: `${color}.50`,
          border: '1px solid',
          borderColor: `${color}.100`,
          overflow: 'hidden'
        }}
      >
        <Box
          p={2.5}
          display="flex"
          alignItems="center"
          gap={1.5}
          bgcolor={`${color}.main`}
          color="white"
        >
          {icon}
          <Typography variant="h6" fontWeight="bold">
            {title} Chance
          </Typography>
          <Chip
            label={items.length}
            size="small"
            sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
          />
        </Box>

        <Box p={2} sx={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {items.length === 0 ? (
            <Box textAlign="center" py={6} px={2}>
              <Typography variant="body2" color="text.secondary">
                No colleges in this category match your currently set rank and category.
              </Typography>
            </Box>
          ) : (
            items.map((college, idx) => (
              <Card
                key={idx}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                }}
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={1} lineHeight={1.3}>
                    {college.name || 'Unnamed College'}
                  </Typography>
                  <Divider sx={{ mb: 1.5, opacity: 0.5 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">Branch</Typography>
                        <Typography variant="body2" fontWeight="bold">{college.branch || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">Cutoff Rank</Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary.main">{college.closingRank || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">Location</Typography>
                        <Typography variant="body2" fontWeight="bold">{college.location || 'Maharashtra'}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Box mb={6} textAlign="center">
        <Typography variant="h3" fontWeight="900" gutterBottom color="text.primary">
          Smart Admission Predictions
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Chip label={`Rank: ${userProfile.rank}`} variant="outlined" color="primary" />
          <Chip label={`Category: ${userProfile.category}`} variant="outlined" color="primary" />
          <Chip label={`Branch: ${userProfile.branch || 'Any'}`} variant="outlined" color="primary" />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {predictions.length === 0 && !loading && !error ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 5, bgcolor: 'grey.50' }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>No exact matches found for your criteria.</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>Try adjusting your preferred branch or wait for Round 2 updates.</Typography>
              <Button variant="outlined" onClick={() => fetchPredictions(userProfile)}>Refresh Results</Button>
            </Paper>
          </Grid>
        ) : (
          <>
            {renderSection('High', 'success', <CheckCircleIcon />, groupByChance('High'))}
            {renderSection('Medium', 'warning', <WarningIcon />, groupByChance('Medium'))}
            {renderSection('Low', 'error', <ErrorIcon />, groupByChance('Low'))}
          </>
        )}
      </Grid>
    </Container>
  );
};

export default PredictionResult;
