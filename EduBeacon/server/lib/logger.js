const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isProduction ? undefined : {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
});

function devLog(...args) {
  if (!isProduction) {
    logger.info(...args);
  }
}

function devWarn(...args) {
  if (!isProduction) {
    logger.warn(...args);
  }
}

module.exports = { isProduction, logger, devLog, devWarn };
