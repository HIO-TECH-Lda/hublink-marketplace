#!/bin/bash
# Script to fix Nginx installation issues

echo "🔧 Fixing Nginx installation..."

# Step 1: Reinstall Nginx to ensure all files are in place
echo "📦 Reinstalling Nginx..."
apt-get update
apt-get install --reinstall nginx -y

# Step 2: Check if files exist and restore if needed
echo "📋 Checking configuration files..."

# Restore mime.types if missing
if [ ! -f /etc/nginx/mime.types ] && [ -f /etc/nginx/mime.types.dpkg-new ]; then
    echo "Restoring mime.types..."
    mv /etc/nginx/mime.types.dpkg-new /etc/nginx/mime.types
fi

# Restore other config files if needed
for file in fastcgi.conf fastcgi_params proxy_params scgi_params uwsgi_params koi-utf koi-win win-utf; do
    if [ ! -f /etc/nginx/${file} ] && [ -f /etc/nginx/${file}.dpkg-new ]; then
        echo "Restoring ${file}..."
        mv /etc/nginx/${file}.dpkg-new /etc/nginx/${file}
    fi
done

# Step 3: Ensure main nginx.conf exists
if [ ! -f /etc/nginx/nginx.conf ] || [ -f /etc/nginx/nginx.conf.dpkg-new ]; then
    echo "Restoring nginx.conf..."
    if [ -f /etc/nginx/nginx.conf.dpkg-new ]; then
        mv /etc/nginx/nginx.conf.dpkg-new /etc/nginx/nginx.conf
    else
        # Create default nginx.conf
        cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
}

http {
	sendfile on;
	tcp_nopush on;
	types_hash_max_size 2048;
	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
	ssl_prefer_server_ciphers on;

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	gzip on;
	gzip_vary on;
	gzip_proxied any;
	gzip_comp_level 6;
	gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
}
EOF
    fi
fi

# Step 4: Test configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid!"
    echo "🚀 Starting Nginx..."
    systemctl start nginx
    systemctl enable nginx
    systemctl status nginx
else
    echo "❌ Nginx configuration test failed. Please check the errors above."
    exit 1
fi

echo "✅ Done!"


