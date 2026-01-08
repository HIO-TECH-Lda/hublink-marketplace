// PM2 Ecosystem Configuration
// Usage: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/app.js',
      cwd: '/var/www/hublink-marketplace/api',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/hublink-marketplace/project',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};


