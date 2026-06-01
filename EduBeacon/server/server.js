const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const { buildCorsOptions } = require('./lib/cors');
const { isProduction, devLog } = require('./lib/logger');

// Load environment variables (prefer config.env next to this file, fallback to .env)
const configPath = path.join(__dirname, 'config.env');
let result = dotenv.config({ path: configPath, override: true });
if (result.error) {
  // Fallback to default .env resolution if config.env not found
  result = dotenv.config({ override: true });
}

// Force-read GEMINI_API_KEY from config.env to avoid conflicts with other env sources
try {
  if (fs.existsSync(configPath)) {
    const parsed = dotenv.parse(fs.readFileSync(configPath));
    if (parsed.GEMINI_API_KEY) {
      process.env.GEMINI_API_KEY = parsed.GEMINI_API_KEY;
    }
  }
} catch (e) {
  console.warn('[Startup] Unable to force-load GEMINI_API_KEY from config.env:', e?.message);
}

if (!process.env.GEMINI_API_KEY) {
  console.warn('[Startup] GEMINI_API_KEY is not set. The AI chatbot will be disabled until configured.');
} else if (!isProduction) {
  devLog('[Startup] GEMINI_API_KEY configured');
}

// Connect to database
connectDB();

const app = express();

const corsOptions = buildCorsOptions();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/student', require('./routes/student'));
app.use('/api/mentor', require('./routes/mentor'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'EduBeacon API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
