import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Container,
  MenuItem,
  TextField,
  useTheme,
  Grid
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { CAP_ROUNDS } from '../../utils/constants';
import { trackerAPI } from '../../services/api';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import StarsIcon from '@mui/icons-material/Stars';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CelebrationIcon from '@mui/icons-material/Celebration';

// Custom pulsing dot for active state
const PulsingDot = ({ status }) => {
  const color = status === 'Allotted' ? '#f59e0b' : '#10b981';

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        sx={{
          position: 'absolute',
          width: 30,
          height: 30,
          borderRadius: '50%',
          bgcolor: color,
        }}
      />
      <TimelineDot
        sx={{
          bgcolor: status === 'Allotted' ? 'warning.main' : 'success.main',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}
      >
        {status === 'Accepted' ? <CelebrationIcon fontSize="small" /> : <StarsIcon fontSize="small" />}
      </TimelineDot>
    </Box>
  );
};

const CapTracker = () => {
  const profile = JSON.parse(localStorage.getItem('userProfile'));
  // State for Application Status from Backend
  const [appStatus, setAppStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Load status from backend
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await trackerAPI.getStatus();
        setAppStatus(data);
      } catch (error) {
        console.error("Failed to fetch tracker status", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const updateStep = async (step) => {
    try {
      const { data } = await trackerAPI.updateStep(step);
      setAppStatus(data);
    } catch (error) {
      console.error("Failed to update step", error);
    }
  };

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" color="error">Profile Missing</Typography>
          <Button href="/profile" sx={{ mt: 2 }} variant="contained">Create Profile</Button>
        </Paper>
      </Container>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return '#10b981'; // Emerald
      case 'Allotted': return '#f59e0b'; // Amber
      case 'Rejected': return '#ef4444'; // Red
      default: return '#64748b'; // Slate
    }
  };

  const getCardBg = (isActive, isCompleted) => {
    if (isCompleted) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255,255,255,0.8) 100%)';
    if (isActive) return 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(255,255,255,0.8) 100%)';
    return 'rgba(255,255,255,0.7)';
  }

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '90vh' }}>

      {/* Background Blobs for Atmosphere */}
      <Box
        component={motion.div}
        animate={{ y: [0, -50, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radiant-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(0,0,0,0) 70%)',
          bgcolor: '#ebf8ff',
          filter: 'blur(80px)',
          zIndex: -1
        }}
      />
      <Box
        component={motion.div}
        animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 600,
          height: 600,
          borderRadius: '50%',
          bgcolor: '#f0fdf4',
          filter: 'blur(100px)',
          zIndex: -1
        }}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={6}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Typography
              variant="h3"
              fontWeight="900"
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #1e293b 30%, #3b82f6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Admission Journey Map
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth="sm" mx="auto">
              Your personalized timeline to success. Track every milestone with AI-driven updates.
            </Typography>
          </motion.div>

          <Box mt={3}>
            <Paper elevation={0} sx={{ display: 'inline-flex', p: 1, borderRadius: 5, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.5)' }}>
              <Chip icon={<StarsIcon />} label={`Rank: ${profile.rank}`} color="primary" sx={{ mr: 1, fontWeight: 'bold' }} />
              <Chip label={`Category: ${profile.category}`} color="secondary" variant="outlined" sx={{ fontWeight: 'bold' }} />
            </Paper>
          </Box>
        </Box>

        <Timeline position="alternate">
          {CAP_ROUNDS.map((round, index) => {
            // Logic: backend 'currentStep' maps to index in CAP_ROUNDS
            // If currentStep > index, it's completed
            // If currentStep == index, it's Active
            // Else Pending
            const currentStepIndex = appStatus ? appStatus.currentStep : 0;
            const isCompleted = currentStepIndex > index;
            const isActive = currentStepIndex === index;

            // Visual Status text
            let statusText = 'Pending';
            if (isCompleted) statusText = 'Completed';
            if (isActive) statusText = 'In Progress';

            return (
              <TimelineItem key={round.id}>
                <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2" color="text.secondary">
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">{round.date || 'Upcoming'}</Typography>
                  {round.description}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: isCompleted ? 'success.main' : 'grey.300', height: 40 }} />
                  {isActive ? (
                    <PulsingDot status="Allotted" />
                  ) : (
                    <TimelineDot
                      color={isCompleted ? 'success' : 'grey'}
                      variant={isCompleted ? 'filled' : 'outlined'}
                      sx={{ p: 1 }}
                    >
                      {isCompleted ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                    </TimelineDot>
                  )}
                  <TimelineConnector sx={{ bgcolor: isCompleted ? 'success.main' : 'grey.300' }} />
                </TimelineSeparator>

                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Paper
                    elevation={isActive ? 12 : 1}
                    component={motion.div}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 50, delay: index * 0.1 }}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: getCardBg(isActive, isCompleted),
                      backdropFilter: 'blur(20px)',
                      border: isActive ? '2px solid' : '1px solid',
                      borderColor: isActive ? '#f59e0b' : 'divider',
                      position: 'relative',
                      overflow: 'hidden',
                      textAlign: 'left'
                    }}
                  >
                    {isActive && (
                      <Box
                        sx={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                          bgcolor: '#f59e0b'
                        }}
                      />
                    )}

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <RocketLaunchIcon color={isActive ? 'warning' : 'action'} fontSize="small" />
                      <Typography variant="h6" component="span" fontWeight="bold">
                        {round.name}
                      </Typography>
                    </Box>


                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">
                          Current Status
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isCompleted ? '#10b981' : (isActive ? '#f59e0b' : '#94a3b8') }} />
                          <Typography variant="body1" fontWeight="bold" sx={{ color: isCompleted ? '#10b981' : (isActive ? '#f59e0b' : '#94a3b8') }}>
                            {statusText}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} textAlign={{ sm: 'right' }}>
                        {isActive && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => updateStep(index + 1)}
                          >
                            Mark Complete
                          </Button>
                        )}
                        {isCompleted && (
                          <Chip label="Done" color="success" size="small" icon={<CheckCircleIcon />} />
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Container>
    </Box>
  );
};

export default CapTracker;
