const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();

// Database connection
const dbUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/phoenix';

mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Failed to connect:', err));

// Serve Vite build
const uiPath = path.join(__dirname, 'dist');
app.use(express.static(uiPath));

// Logs directory
const logDir = path.join(__dirname, 'logs');

// Health API
app.get('/api/health', (req, res) => {
    const logFile = path.join(logDir, 'server.log');

    fs.appendFileSync(
        logFile,
        `[${new Date().toISOString()}] Health endpoint accessed\n`
    );

    res.json({ status: 'API is alive' });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(uiPath, 'index.html'));
});

app.listen(5000, () => console.log('Server running on port 5000'));