const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'https://sih25edubeacon.vercel.app',
  'https://sih25-edu-beacon.vercel.app',
];

const VERCEL_PREVIEW = /^https:\/\/[\w.-]+\.vercel\.app$/;

function getAllowedOrigins() {
  const origins = [...DEFAULT_ORIGINS];
  const fromEnv = process.env.ALLOWED_ORIGINS;
  if (fromEnv) {
    fromEnv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((origin) => {
        if (!origins.includes(origin)) {
          origins.push(origin);
        }
      });
  }
  return origins;
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
        // Do not pass Error — that becomes a 500 Internal Server Error
        console.warn('[CORS] Blocked origin:', origin);
        callback(null, false);
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
    optionsSuccessStatus: 204,
  };
}

module.exports = { buildCorsOptions, getAllowedOrigins };
