module.exports = {
  apps: [
    {
      name: 'edubeacon-api',
      script: './server.js',
      instances: 'max', // Utilize all available CPU cores
      exec_mode: 'cluster', // Enables Node clustering
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
