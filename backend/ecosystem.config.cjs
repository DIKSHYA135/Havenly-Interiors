// PM2 Ecosystem Configuration for Havenly Interiors Backend
// Runs the Express API on internal port 5001, managed by PM2.
// Configured for single-core t2.micro/t3.micro instances.

module.exports = {
  apps: [
    {
      name: 'havenly-backend',
      script: 'server.js',
      cwd: '/var/www/app/backend',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      // Exponential restart delay prevents crash loops from consuming resources
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
    },
  ],
};
