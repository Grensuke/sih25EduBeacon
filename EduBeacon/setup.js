const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const serverDir = path.join(__dirname, 'server');
const envPath = path.join(serverDir, '.env');
const examplePath = path.join(serverDir, '.env.example');
const legacyConfigPath = path.join(serverDir, 'config.env');

console.log('Setting up EduBeacon...\n');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(examplePath)) {
    console.log('Creating server/.env from .env.example...');
    fs.copyFileSync(examplePath, envPath);
    console.log('Created server/.env — edit it with your MongoDB URI, JWT_SECRET, and GEMINI_API_KEY.');
  } else if (fs.existsSync(legacyConfigPath)) {
    console.log('Creating server/.env from config.env (legacy)...');
    fs.copyFileSync(legacyConfigPath, envPath);
    console.log('Created server/.env from config.env.');
  } else {
    console.log('Warning: server/.env.example not found. Create server/.env manually.');
  }
} else {
  console.log('server/.env already exists.');
}

console.log('\nInstalling dependencies (root, server, client)...');
try {
  execSync('npm run install-all', { cwd: __dirname, stdio: 'inherit' });
} catch (e) {
  console.error('\nInstall failed. Run manually from EduBeacon/: npm run install-all');
  process.exit(1);
}

console.log('\nSetup complete.\n');
console.log('Next steps:');
console.log('  1. Edit EduBeacon/server/.env with real credentials');
console.log('  2. From EduBeacon/: npm run dev');
console.log('  3. Open http://localhost:3000');
console.log('\nDeploy: see README.md → Deployment');
