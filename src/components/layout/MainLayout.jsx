import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from '../common/ChatWidget';

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, py: 4, backgroundColor: 'background.default' }}>
                {children}
            </Box>
            <Footer />
            <ChatWidget />
        </Box>
    );
};

export default MainLayout;
