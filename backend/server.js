const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import routes
const userRoutes = require('./routes/user');
const aiCareerChatRoutes = require('./routes/ai-career-chat-agent');
const aiResumeRoutes = require('./routes/ai-resume-agent');
const aiRoadmapRoutes = require('./routes/ai-roadmap-agent');
const analyzeResumeRoutes = require('./routes/analyze-resume');
const coverLetterRoutes = require('./routes/cover-letter');
const historyRoutes = require('./routes/history');

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/ai-career-chat-agent', aiCareerChatRoutes);
app.use('/api/ai-resume-agent', aiResumeRoutes);
app.use('/api/ai-roadmap-agent', aiRoadmapRoutes);
app.use('/api/analyze-resume', analyzeResumeRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/history', historyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 