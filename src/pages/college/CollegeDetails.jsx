import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  useTheme,
  IconButton,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import axios from 'axios';

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/colleges`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filtering by ID for now, ideally backend should have /api/colleges/{id}
        const found = response.data.find(c => c.id == id);
        setCollege(found);
      } catch (error) {
        console.error("Error fetching college details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!college) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error">College Not Found</Typography>
        <Button onClick={() => navigate('/colleges')} sx={{ mt: 2 }} variant="outlined">Back to List</Button>
      </Container>
    );
  }

  const sections = [
    { icon: <CategoryIcon color="primary" />, label: "Branch", value: college.branch },
    { icon: <TrendingUpIcon color="success" />, label: "Cutoff Percentile", value: `${college.cutoff || '85.5'}%` },
    { icon: <LocationOnIcon color="error" />, label: "Location", value: college.location || "Pune, Maharashtra" },
    { icon: <AccountBalanceIcon color="warning" />, label: "College Code", value: college.collegeCode || "6001" },
  ];

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', pb: 8 }}>
      {/* Hero Header */}
      <Box
        sx={{
          height: 300,
          background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <IconButton
            onClick={() => navigate('/colleges')}
            sx={{ position: 'absolute', top: 20, left: 20, color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
          >
            <ArrowBackIcon />
          </IconButton>

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar
                sx={{ width: 100, height: 100, bgcolor: 'white', color: 'primary.main', fontSize: 50 }}
              >
                <SchoolIcon fontSize="inherit" />
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="900" sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  {college.name}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip label="Top Rated" color="warning" size="small" sx={{ fontWeight: 'bold' }} />
                  <Chip label="A++ Grade" color="success" size="small" sx={{ fontWeight: 'bold' }} />
                  <Chip label="Government Aided" color="info" size="small" sx={{ fontWeight: 'bold' }} />
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>About Institution</Typography>
              <Typography color="text.secondary" paragraph>
                {college.name} is one of the premier engineering institutions in Maharashtra, known for its academic excellence and state-of-the-art facilities.
                With a strong focus on research and industry-readiness, it consistently ranks among the top percentile for {college.branch} engineering.
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>Academic Stats</Typography>
              <Grid container spacing={2}>
                {sections.map((sec, idx) => (
                  <Grid item xs={6} sm={3} key={idx}>
                    <Box textAlign="center" p={2} sx={{ bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: 3 }}>
                      {sec.icon}
                      <Typography variant="caption" display="block" color="text.secondary" mt={1}>{sec.label}</Typography>
                      <Typography variant="body1" fontWeight="bold">{sec.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box mt={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Admission Roadmap</Typography>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  <Typography variant="body2" color="text.primary">
                    To get into this college, you must follow the CAP Process strictly. Ensure your <b>DTE Registration</b> is completed and document verification is done.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, borderRadius: 2 }}
                    onClick={() => navigate('/tracker')}
                  >
                    Check My Eligibility
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: '#1e293b', color: 'white' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>Quick Inquiry</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                Have questions about the fees, hostel, or placements? Ask our AI Chatbot now.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', borderRadius: 2, py: 1.5 }}
                onClick={() => navigate('/chatbot')}
              >
                Chat with Counselor
              </Button>

              <Box mt={4}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Contact Details</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>📍 {college.location || "Principal's Office, Academic Main Block"}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>📞 020-2567XXXX</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>🌐 www.{college.name.toLowerCase().replace(/\s/g, '')}.edu.in</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CollegeDetails;
