module.exports = {
    apps : [{
      name: 'physapp',
      script: './index.js',
  
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    }]
  };
  