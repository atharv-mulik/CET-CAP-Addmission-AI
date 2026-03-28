import {
    Box,
    Container,
    Typography,
    Link,
    IconButton,
    Stack,
    Grid,
    TextField,
    Button,
    Divider,
    InputAdornment
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                pt: 8,
                pb: 4,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? '#f1f5f9' // Slate 100
                        : theme.palette.grey[900],
                borderTop: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={5} justifyContent="space-between">
                    {/* Brand Column */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon color="primary" /> CapAdmission.ai
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mb: 3 }}>
                            Empowering students with AI-driven insights to navigate the college admission process with confidence.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small" sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                                <GitHubIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                                <TwitterIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                                <LinkedInIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Product</Typography>
                        <Stack spacing={1}>
                            <Link href="/colleges" color="text.secondary" underline="hover" variant="body2">Colleges</Link>
                            <Link href="/prediction" color="text.secondary" underline="hover" variant="body2">Predictions</Link>
                            <Link href="/cutoffs" color="text.secondary" underline="hover" variant="body2">Cutoff Trends</Link>
                            <Link href="/tracker" color="text.secondary" underline="hover" variant="body2">Tracker</Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Company</Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="text.secondary" underline="hover" variant="body2">About Us</Link>
                            <Link href="#" color="text.secondary" underline="hover" variant="body2">Careers</Link>
                            <Link href="#" color="text.secondary" underline="hover" variant="body2">Privacy Policy</Link>
                            <Link href="#" color="text.secondary" underline="hover" variant="body2">Terms</Link>
                        </Stack>
                    </Grid>

                    {/* Newsletter */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Stay Updated</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Get the latest admission news and cutoff alerts directly to your inbox.
                        </Typography>
                        <Box display="flex" gap={1}>
                            <TextField
                                size="small"
                                placeholder="Enter your email"
                                fullWidth
                                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SendIcon fontSize="small" color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button variant="contained">Subscribe</Button>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} CapAdmission.ai. All rights reserved.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Made with ❤️ for students.
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
