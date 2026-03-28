import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Stack,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnimatedHero from '../components/home/AnimatedHero';

const FeatureCard = ({ icon, title, description, delay }) => (
    <Paper
        elevation={0}
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        sx={{
            p: 4,
            height: '100%',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }
        }}
    >
        <Box sx={{ color: 'primary.main', mb: 2 }}>
            {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
            {description}
        </Typography>
    </Paper>
);

// Helper component for small chip labels
const ChipLabel = ({ text }) => (
    <Box
        sx={{
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            bgcolor: '#eff6ff', // primary.50 approximation
            color: '#2563eb', // primary.main
            borderRadius: 20,
            typography: 'caption',
            fontWeight: 600,
            mb: 2,
            border: '1px solid',
            borderColor: '#dbeafe' // primary.100 approximation
        }}
    >
        {text}
    </Box>
);

const Home = () => {
    const theme = useTheme();

    return (
        <Box sx={{ overflowX: 'hidden' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #e0f2fe 100%)`,
                    pt: { xs: 8, md: 0 }
                }}
            >
                {/* Abstract Background Shapes */}
                <Box
                    component={motion.div}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        right: '5%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #2563eb33 0%, #06b6d433 100%)',
                        filter: 'blur(60px)',
                        zIndex: 0
                    }}
                />

                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <ChipLabel text="New: 2026 Admissions Open" />
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 2,
                                        background: 'linear-gradient(45deg, #1e293b 30%, #2563eb 90%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    Your Dream College Needs a Strategy.
                                </Typography>
                                <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: '600px' }}>
                                    AI-powered predictions, real-time cutoff tracking, and smart analysis to secure your seat in top engineering institutes.
                                </Typography>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        variant="contained"
                                        size="large"
                                        sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button
                                        component={Link} // Or scroll to features
                                        to="/colleges"
                                        variant="outlined"
                                        size="large"
                                        sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                                    >
                                        Explore Colleges
                                    </Button>
                                </Stack>

                                <Box mt={4} display="flex" alignItems="center" gap={1}>
                                    <CheckCircleIcon color="success" fontSize="small" />
                                    <Typography variant="body2" color="text.secondary">Trusted by 10,000+ Students</Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <AnimatedHero />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box sx={{ py: 6, bgcolor: 'primary.main', color: 'white' }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4} textAlign="center">
                        {[
                            { number: '95%', label: 'Prediction Accuracy' },
                            { number: '500+', label: 'Colleges Tracked' },
                            { number: '50k+', label: 'Cutoff Records' },
                            { number: '24/7', label: 'AI Support' },
                        ].map((stat, i) => (
                            <Grid item xs={6} md={3} key={i}>
                                <Typography variant="h3" fontWeight="bold">{stat.number}</Typography>
                                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>{stat.label}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 10, bgcolor: 'background.default' }}>
                <Container maxWidth="xl">
                    <Box textAlign="center" mb={8} component={motion.div} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>why Choose CapAdmission.ai?</Typography>
                        <Typography variant="h6" color="text.secondary">Everything you need to navigate the chaotic admission process.</Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<AutoGraphIcon fontSize="large" />}
                                title="AI Prediction Engine"
                                description="Our advanced ML algorithms analyze historical data to predict your admission chances with high accuracy."
                                delay={0}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<SpeedIcon fontSize="large" />}
                                title="Real-time Tracking"
                                description="Stay updated with the latest CAP rounds, seat matrix changes, and cutoff fluctuations as they happen."
                                delay={0.2}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<SecurityIcon fontSize="large" />}
                                title="Secure Document Vault"
                                description="Keep all your admission documents organized and safe in one place, ready for verification."
                                delay={0.4}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Call to Action */}
            <Box sx={{ py: 10, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Ready to Secure Your Future?
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
                        Join thousands of students who are already using CapAdmission.ai to make smarter decisions.
                    </Typography>
                    <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        size="large"
                        sx={{ px: 6, py: 2, borderRadius: 50, fontSize: '1.2rem' }}
                    >
                        Create Free Account
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
