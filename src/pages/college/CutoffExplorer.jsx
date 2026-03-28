import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

// Mock Data for Trends
const mockTrendData = [
  { year: '2023', COEP: 120, PICT: 450, VJTI: 85 },
  { year: '2024', COEP: 110, PICT: 420, VJTI: 78 },
  { year: '2025', COEP: 105, PICT: 380, VJTI: 72 },
];

const mockBranchData = [
  { name: 'CS', cutoff: 120 },
  { name: 'IT', cutoff: 350 },
  { name: 'EnTC', cutoff: 800 },
  { name: 'Mech', cutoff: 2500 },
];

const CutoffExplorer = () => {
  const [selectedCollege, setSelectedCollege] = useState('COEP');

  return (
    <Container maxWidth="xl">
      <Box mb={5} textAlign="center">
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Cutoff Trends Explorer
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Visualize historical data to predict future trends.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Line Chart Section */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 4, height: '400px' }}
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Year-wise Cutoff Trends</Typography>
              <TextField
                select
                size="small"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                sx={{ width: 150 }}
              >
                <MenuItem value="COEP">COEP</MenuItem>
                <MenuItem value="PICT">PICT</MenuItem>
                <MenuItem value="VJTI">VJTI</MenuItem>
              </TextField>
            </Box>

            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis reversed label={{ value: 'Rank (Lower is Better)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selectedCollege}
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bar Chart Section */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 4, height: '400px' }}
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>Branch Comparison (2025)</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={mockBranchData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={50} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="cutoff" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Insights Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {[
              { title: 'Tougher Competition', desc: 'Cutoffs for CS have dropped by 15% in the last 2 years.', color: 'error.main' },
              { title: 'Rising Branch', desc: 'AI & DS branch is seeing a massive surge in demand.', color: 'success.main' },
              { title: 'Safe Zone', desc: 'Mechanical Engineering cutoffs remain stable.', color: 'info.main' },
            ].map((insight, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ borderLeft: 6, borderColor: insight.color, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">{insight.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{insight.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

      </Grid>
    </Container>
  )
}

export default CutoffExplorer
