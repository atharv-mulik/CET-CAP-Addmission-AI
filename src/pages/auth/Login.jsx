import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await import('../../services/api').then(m => m.authAPI.login(email, password));
      localStorage.setItem('token', data.token); // Store JWT
      setLoading(false);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Background animation variants
  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      rotate: [0, -90, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc'
      }}
    >
      {/* Animated Background Blobs */}
      <motion.div
        variants={blobVariants}
        animate="animate"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f733 0%, #3b82f633 100%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        initial={{ rotate: 180 }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb33 0%, #06b6d433 100%)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>

        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
          Back to Home
        </Button>

        <Paper
          elevation={24}
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          sx={{
            p: 4,
            borderRadius: 5,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255,255,255,0.3)',
            textAlign: 'center'
          }}
        >
          {/* Icon Header */}
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 25px rgba(37,99,235,0.4)'
            }}
          >
            <LoginIcon fontSize="large" />
          </Box>

          <Typography variant="h4" fontWeight="800" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Sign in to continue your journey.
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{ sx: { borderRadius: 3 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    sx: { borderRadius: 3 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2" align="center">{error}</Typography>
                </Grid>
              )}
            </Grid>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                fontSize: '1.1rem',
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(37,99,235,0.4)'
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </Button>

            <Box display="flex" alignItems="center" gap={2} my={2}>
              <Box flex={1} height="1px" bgcolor="divider" />
              <Typography variant="caption" color="text.secondary">OR</Typography>
              <Box flex={1} height="1px" bgcolor="divider" />
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', color: 'text.primary', borderColor: 'divider' }}
            >
              Sign in with Google
            </Button>

            <Box textAlign="center" mt={4}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
