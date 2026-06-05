const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const { buildCorsOptions } = require('./lib/cors');
const { isProduction, logger, devLog } = require('./lib/logger');

// Load environment variables (prefer config.env next to this file, fallback to .env)
const configPath = path.join(__dirname, 'config.env');
let result = dotenv.config({ path: configPath, override: true });
if (result.error) {
  result = dotenv.config({ override: true });
}

try {
  if (fs.existsSync(configPath)) {
    const parsed = dotenv.parse(fs.readFileSync(configPath));
    if (parsed.GEMINI_API_KEY) {
      process.env.GEMINI_API_KEY = parsed.GEMINI_API_KEY;
    }
  }
} catch (e) {
  logger.warn({ err: e }, '[Startup] Unable to force-load GEMINI_API_KEY from config.env');
}

function validateEnv() {
  const missing = [];
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  if (missing.length) {
    logger.error(`[Startup] Missing required env: ${missing.join(', ')}`);
    logger.error('[Startup] Copy server/.env.example to server/.env and fill in values.');
    process.exit(1);
  }
}

validateEnv();

if (!process.env.GEMINI_API_KEY) {
  logger.warn('[Startup] GEMINI_API_KEY is not set. The AI chatbot will be disabled until configured.');
} else if (!isProduction) {
  devLog('[Startup] GEMINI_API_KEY configured');
}

const app = express();

const corsOptions = buildCorsOptions();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/student', require('./routes/student'));
app.use('/api/mentor', require('./routes/mentor'));

app.get('/api/health', (req, res) => {
  const dbReady = require('mongoose').connection.readyState === 1;
  res.json({
    message: 'EduBeacon API is running!',
    db: dbReady ? 'connected' : 'disconnected',
  });
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, '[Startup] Failed to start');
    process.exit(1);
  }
};

startServer();
