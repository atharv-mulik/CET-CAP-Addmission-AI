import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  CircularProgress,
  Alert,
  Fade
} from '@mui/material';
import { authAPI } from '../../services/api'; // Import API
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import TuneIcon from '@mui/icons-material/Tune';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const steps = ['Personal Details', 'Academic Info', 'Preferences'];

const ProfileSetup = () => {


  const [activeStep, setActiveStep] = useState(0);
  const [profileScore, setProfileScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [initialValues, setInitialValues] = useState({
    fullname: '',
    email: '',
    gender: '',
    category: '',
    rank: '',
    exam: 'MHT-CET',
    homeUniversity: '',
    branch: '',
    collegeType: 'Any'
  });

  // Fetch Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authAPI.getProfile();
        // Map backend fields to form fields if necessary
        // Assuming backend returns matching keys or we map them here
        setInitialValues({
          fullname: (data.firstName + ' ' + data.lastName) || '',
          email: data.email || '',
          gender: data.gender || '',
          category: data.category || '',
          rank: data.rank || '',
          exam: 'MHT-CET',
          homeUniversity: 'Pune University', // Default or fetch if available
          branch: data.branch || '',
          collegeType: 'Any'
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const validationSchema = Yup.object({
    fullname: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    category: Yup.string().required('Category is required'),
    rank: Yup.number().required('Rank is required').positive().integer(),
    homeUniversity: Yup.string().required('Home University is required'),
    branch: Yup.string().required('Preferred Branch is required'),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Important to load fetched data
    validationSchema,
    onSubmit: async (values) => {
      try {
        const nameParts = values.fullname.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const profileData = {
          rank: parseInt(values.rank),
          category: values.category,
          gender: values.gender,
          branch: values.branch,
          firstName: firstName,
          lastName: lastName,
          email: values.email
        };
        const { data: updatedUser } = await authAPI.updateProfile(profileData);

        // Update local storage so other components get the full fresh object
        localStorage.setItem('userProfile', JSON.stringify({
          ...updatedUser,
          fullname: values.fullname // Keep for frontend convenience
        }));

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (error) {
        console.error("Failed to save profile:", error);
        alert("Failed to save profile.");
      }
    }
  });

  // Calculate profile score live
  useEffect(() => {
    let filled = 0;
    const fields = Object.values(formik.values);
    fields.forEach(val => { if (val) filled++ });
    setProfileScore(Math.round((filled / fields.length) * 100));
  }, [formik.values]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth size="large" label="Full Name" name="fullname" value={formik.values.fullname} onChange={formik.handleChange} error={formik.touched.fullname && Boolean(formik.errors.fullname)} helperText={formik.touched.fullname && formik.errors.fullname} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth size="large" label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth size="large" label="Gender" name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth size="large" type="number" label="CET Rank" name="rank" value={formik.values.rank} onChange={formik.handleChange} error={formik.touched.rank && Boolean(formik.errors.rank)} helperText={formik.touched.rank && formik.errors.rank} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth size="large" label="Category" name="category" value={formik.values.category} onChange={formik.handleChange}>
                {['OPEN', 'OBC', 'SC', 'ST', 'EWS'].map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Home University" name="homeUniversity" value={formik.values.homeUniversity} onChange={formik.handleChange} />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField select fullWidth label="Preferred Branch" name="branch" value={formik.values.branch} onChange={formik.handleChange}>
                {['Computer', 'IT', 'ENTC', 'Mechanical', 'Civil'].map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="College Type Preference" name="collegeType" value={formik.values.collegeType} onChange={formik.handleChange}>
                <MenuItem value="Any">Any</MenuItem>
                <MenuItem value="Government">Government</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      default: return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold">Complete Your Profile</Typography>
        <Typography color="text.secondary">Get accurate predictions by providing details.</Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 4, position: 'relative', overflow: 'hidden' }} elevation={3}>
        {/* Header / Progress */}
        <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress variant="determinate" value={profileScore} size={50} color={profileScore === 100 ? 'success' : 'primary'} />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" component="div" color="text.secondary" fontWeight="bold">{`${Math.round(profileScore)}%`}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Profile Score</Typography>
              <Typography variant="caption" color="text.secondary">{profileScore === 100 ? 'Excellent!' : 'Keep going...'}</Typography>
            </Box>
          </Box>
          {saved && (
            <Fade in={saved}>
              <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ borderRadius: 2 }}>
                Profile Saved!
              </Alert>
            </Fade>
          )}
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </AnimatePresence>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                size="large"
              >
                Save Profile
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfileSetup;
