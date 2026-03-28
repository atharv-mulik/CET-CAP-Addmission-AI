import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const Preloader = ({ onComplete }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc', // Match theme background
                zIndex: 9999,
            }}
        >
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: [0, 1.2, 1],
                    opacity: 1,
                    rotate: [0, 0, 360]
                }}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    times: [0, 0.6, 1]
                }}
            >
                <SchoolIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            </motion.div>

            <Box sx={{ overflow: 'hidden' }}>
                <Typography
                    variant="h3"
                    component={motion.h1}
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                    sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        letterSpacing: '-0.02em'
                    }}
                >
                    CapAdmission<span style={{ color: '#2563eb' }}>.ai</span>
                </Typography>
            </Box>

            <motion.div
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ delay: 1, duration: 1.5 }}
                onAnimationComplete={() => {
                    // Wait a tiny bit after bar fills then trigger complete
                    setTimeout(onComplete, 500);
                }}
                style={{
                    height: 4,
                    background: '#2563eb',
                    marginTop: 20,
                    borderRadius: 2
                }}
            />
        </Box>
    );
};

export default Preloader;
