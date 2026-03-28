import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Container,
    useTheme,
    useMediaQuery,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';

const pages = [
    { title: 'Colleges', path: '/colleges' },
    { title: 'Prediction', path: '/prediction' },
    { title: 'Tracker', path: '/tracker' },
    { title: 'Documents', path: '/documents' },
    { title: 'Chatbot', path: '/chatbot' },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    const isHome = location.pathname === '/';

    // Handle scroll effect for transparent navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <SchoolIcon color="primary" /> CapAdmission.ai
            </Typography>
            <List>
                {pages.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <Button
                            component={Link}
                            to={item.path}
                            sx={{
                                textAlign: 'left',
                                width: '100%',
                                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                                bgcolor: location.pathname === item.path ? 'action.hover' : 'transparent',
                                py: 2
                            }}
                        >
                            <ListItemText primary={item.title} sx={{ ml: 2 }} />
                        </Button>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <Button
                        component={Link}
                        to="/profile"
                        sx={{ width: '100%', py: 2, color: 'text.primary' }}
                    >
                        <ListItemText primary="Profile" sx={{ ml: 2 }} />
                    </Button>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="sticky"
                color="default"
                elevation={isHome && !isScrolled ? 0 : 0}
                sx={{
                    backgroundColor: isHome && !isScrolled ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: isHome && !isScrolled ? 'none' : 'blur(8px)',
                    borderBottom: isHome && !isScrolled ? 'none' : '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease'
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Desktop Logo */}
                        <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'text.primary',
                                textDecoration: 'none',
                                flexGrow: 1
                            }}
                        >
                            CAP ADMISSION AI
                        </Typography>

                        {/* Mobile Menu Icon */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        {/* Mobile Logo */}
                        <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'text.primary',
                                textDecoration: 'none',
                            }}
                        >
                            CAP AI
                        </Typography>

                        {/* Desktop Navigation */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
                            {pages.map((item) => (
                                <Button
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        my: 2,
                                        color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                                        fontWeight: location.pathname === item.path ? 700 : 500,
                                        '&:hover': {
                                            backgroundColor: isHome && !isScrolled ? 'rgba(255,255,255,0.5)' : 'action.hover',
                                        }
                                    }}
                                >
                                    {item.title}
                                </Button>
                            ))}

                            {/* Show Login button if on Home, otherwise Profile */}
                            {isHome ? (
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="contained"
                                    sx={{ ml: 2, px: 3, borderRadius: 20 }}
                                >
                                    Login
                                </Button>
                            ) : (
                                <Button
                                    component={Link}
                                    to="/profile"
                                    variant="outlined"
                                    sx={{ ml: 2, my: 1.5, borderRadius: 20 }}
                                    startIcon={<PersonIcon />}
                                >
                                    Profile
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );
};

export default Navbar;
