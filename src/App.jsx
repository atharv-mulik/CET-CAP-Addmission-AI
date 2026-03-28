import { Routes, Route, Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import Navbar from './components/layout/Navbar'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProfileSetup from './pages/profile/ProfileSetup'
import CollegeList from './pages/college/CollegeList'
import CollegeDetails from './pages/college/CollegeDetails'
import CapTracker from './pages/tracker/CapTracker'
import DocumentUpload from './pages/documents/DocumentUpload'
import PredictionResult from './pages/prediction/PredictionResult'
import Chatbot from './pages/chatbot/Chatbot'
import Home from './pages/Home'

import ProtectedRoute from './components/auth/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/colleges" element={<CollegeList />} />
          <Route path="/colleges/:id" element={<CollegeDetails />} />
          <Route path="/prediction" element={<PredictionResult />} />
          <Route path="/tracker" element={<CapTracker />} />
          <Route path="/documents" element={<DocumentUpload />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Route>

        {/* Fallback for missing routes */}
        <Route path="*" element={
          <Box textAlign="center" py={10}>
            <Typography variant="h4">404 - Page Not Found</Typography>
            <Button component={Link} to="/" sx={{ mt: 2 }}>Go Home</Button>
          </Box>
        } />
      </Routes>
    </MainLayout>
  )
}

export default App;
