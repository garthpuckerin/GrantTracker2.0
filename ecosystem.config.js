module.exports = {
  apps: [
    {
      name: 'grant-tracker-2.0',
      script: 'server.js',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Process management
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      watch: false,

      // Memory management
      max_memory_restart: '1G',

      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,

      // Advanced settings
      node_args: '--max-old-space-size=2048',
      merge_logs: true,
      time: true,

      // Environment-specific overrides
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
      },

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,

      // Source map support
      source_map_support: true,

      // Process monitoring
      pmx: true,
    },
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/grant-tracker-2.0.git',
      path: '/var/www/grant-tracker-2.0',
      'pre-deploy-local': '',
      'post-deploy':
        'npm ci --only=production && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      ssh_options: 'ForwardAgent=yes',
    },
    staging: {
      user: 'deploy',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'https://github.com/your-username/grant-tracker-2.0.git',
      path: '/var/www/grant-tracker-2.0-staging',
      'post-deploy':
        'npm ci && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 reload ecosystem.config.js --env staging',
      ssh_options: 'ForwardAgent=yes',
    },
  },
};
