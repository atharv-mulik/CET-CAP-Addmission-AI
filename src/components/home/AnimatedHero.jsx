import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PieChartIcon from '@mui/icons-material/PieChart';

const floatAnimation = {
    animate: {
        y: [0, -20, 0],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const pulseAnimation = {
    animate: {
        scale: [1, 1.05, 1],
        boxShadow: [
            '0 10px 30px rgba(37, 99, 235, 0.2)',
            '0 20px 50px rgba(37, 99, 235, 0.4)',
            '0 10px 30px rgba(37, 99, 235, 0.2)'
        ],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const AnimatedHero = () => {
    return (
        <Box position="relative" height={600} display="flex" alignItems="center" justifyContent="center">

            {/* Central Dashboard Card */}
            <Paper
                elevation={10}
                component={motion.div}
                variants={pulseAnimation}
                animate="animate"
                sx={{
                    width: 320,
                    height: 220,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    position: 'relative'
                }}
            >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <TrendingUpIcon fontSize="large" color="primary" />
                    <Typography variant="h5" fontWeight="900" color="text.primary">98.5%</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">Admission Probability</Typography>

                {/* Mini 'Graph' */}
                <Box mt={3} width="80%" height={6} bgcolor="grey.200" borderRadius={4} overflow="hidden">
                    <Box width="85%" height="100%" bgcolor="success.main" />
                </Box>
            </Paper>

            {/* Floating Icon 1 - Top Left */}
            <Paper
                elevation={4}
                component={motion.div}
                animate={{
                    y: [0, -30, 0],
                    x: [0, 10, 0],
                    rotate: [0, -10, 0]
                }}
                transition={{ duration: 7, repeat: Infinity }}
                sx={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'white',
                    zIndex: 1
                }}
            >
                <SchoolIcon fontSize="large" sx={{ color: '#ec4899' }} />
            </Paper>

            {/* Floating Icon 2 - Bottom Right */}
            <Paper
                elevation={4}
                component={motion.div}
                animate={{
                    y: [0, 40, 0],
                    x: [0, -20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                sx={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '15%',
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'white',
                    zIndex: 1
                }}
            >
                <PieChartIcon fontSize="large" sx={{ color: '#f59e0b' }} />
            </Paper>

            {/* Floating Icon 3 - Top Right */}
            <Paper
                elevation={4}
                component={motion.div}
                animate={{
                    y: [0, -25, 0],
                    x: [0, -15, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                sx={{
                    position: 'absolute',
                    top: '25%',
                    right: '5%',
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'white',
                    zIndex: 1
                }}
            >
                <InsertChartIcon fontSize="large" sx={{ color: '#10b981' }} />
            </Paper>

            {/* Decorative Circle Background */}
            <Box
                component={motion.div}
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                sx={{
                    position: 'absolute',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    border: '2px dashed',
                    borderColor: 'primary.100',
                    zIndex: 0
                }}
            />
            <Box
                component={motion.div}
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                sx={{
                    position: 'absolute',
                    width: 350,
                    height: 350,
                    borderRadius: '50%',
                    border: '2px dashed',
                    borderColor: 'secondary.100',
                    zIndex: 0
                }}
            />

        </Box>
    );
};

export default AnimatedHero;
