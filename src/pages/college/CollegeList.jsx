import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Chip,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { collegeAPI, authAPI } from '../../services/api'; // Import API
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { motion } from 'framer-motion';

const CollegeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Profile
        const { data: userProfile } = await authAPI.getProfile();
        setProfile(userProfile);

        if (userProfile && userProfile.rank) {
          // 2. Fetch Colleges based on Profile
          const { data: collegeList } = await collegeAPI.predict(userProfile.rank, userProfile.category || 'OPEN');
          setColleges(collegeList);
        } else {
          // Fallback if no profile: fetch all or show empty? 
          // Logic below handles "no profile" state
        }
      } catch (err) {
        console.error("Failed to load data", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => window.location.href = '/login', 2000);
          return;
        }
        const detailedError = err.response?.data?.message || err.message || "Failed to load colleges.";
        setError(`Error: ${detailedError}. Please ensure you have completed your profile.`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!profile || !profile.rank) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Let's get you started!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Please complete your profile to see personalized college recommendations.
        </Typography>
        <Button variant="contained" href="/profile">
          Go to Profile Setup
        </Button>
      </Container>
    )
  }

  const userRank = Number(profile.rank);
  const userCategory = profile.category;

  // Filter existing API results by Search Term
  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChance = (closingRank) => {
    // Simple frontend logic for visual color coding, 
    // though backend has already filtered for "best fit" mostly
    if (userRank <= closingRank * 0.6) return { label: 'High', color: 'success' };
    if (userRank <= closingRank * 0.85) return { label: 'Medium', color: 'warning' };
    return { label: 'Low', color: 'error' };
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Recommended Colleges
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI Predictions for Rank: <strong>{userRank}</strong> ({userCategory})
        </Typography>
      </Box>

      {/* Filters & Search Toolbar */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <TextField
          placeholder="Search within results..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: '300px' }}
        />
        <Button startIcon={<FilterListIcon />} variant="outlined">
          Filters
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Results Grid */}
      <Grid container spacing={3}>
        {filteredColleges.length === 0 ? (
          <Grid item xs={12}>
            <Box textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                No colleges found matching your criteria.
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredColleges.map((college, index) => {
            const chance = getChance(college.closingRank);

            return (
              <Grid item xs={12} md={6} lg={4} key={college.id || index}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="600" noWrap title={college.name}>
                      {college.name}
                    </Typography>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip label={college.branch} size="small" variant="outlined" />
                      <Chip label={`Round ${college.round}`} size="small" variant="outlined" />
                      {college.location && <Chip label={college.location} size="small" variant="outlined" />}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last Year Cutoff
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          {college.closingRank}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Admission Chance
                        </Typography>
                        <Chip
                          label={chance.label}
                          color={chance.color}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Container>
  )
}

export default CollegeList
