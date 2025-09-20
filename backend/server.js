// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const startCleanup = require('./utils/cleanup');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => { console.error('MongoDB connect error:', err); process.exit(1); });

// Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());

// Routes
// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/admin', adminRoutes);
app.use('/api', uploadRoutes);

// Basic health check
app.get('/', (req, res) => res.send('Easy Print backend running'));

// Start cron for cleanup (runs every minute inside the module)
startCleanup();

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
