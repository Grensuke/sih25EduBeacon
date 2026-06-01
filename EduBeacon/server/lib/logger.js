const isProduction = process.env.NODE_ENV === 'production';

function devLog(...args) {
  if (!isProduction) {
    console.log(...args);
  }
}

function devWarn(...args) {
  if (!isProduction) {
    console.warn(...args);
  }
}

module.exports = { isProduction, devLog, devWarn };
