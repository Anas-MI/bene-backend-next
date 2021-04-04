module.exports = {
	  apps : [{
		      name: 'bene-backend',
		      script: 'npm',
		      args:"start",
		      cwd:"/var/www/bene/bene-backend-next/",
		      instances: 1,
		      autorestart: true,
		      watch: true,
		      max_memory_restart: '1G',
		      env: {
			            NODE_ENV: 'development'
			          },
		      env_production: {
			            NODE_ENV: 'production',
			            API_URL: "https://admin.cbdbene.com",
			            PORT:3000
			          }
		    }]
};
