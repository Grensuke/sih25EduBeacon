const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'https://sih25edubeacon.vercel.app',
  'https://sih25-edu-beacon.vercel.app',
];

const VERCEL_PREVIEW = /^https:\/\/[\w.-]+\.vercel\.app$/;

function getAllowedOrigins() {
  const fromEnv = process.env.ALLOWED_ORIGINS;
  if (fromEnv) {
    return fromEnv.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return DEFAULT_ORIGINS;
}

function isOriginAllowed(origin, allowedOrigins) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (VERCEL_PREVIEW.test(origin)) return true;
  return false;
}

function buildCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      if (isOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
    optionsSuccessStatus: 204,
  };
}

module.exports = { buildCorsOptions, getAllowedOrigins };
