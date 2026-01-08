#!/bin/bash
# Configure Nginx for marketplace app in aaPanel's Nginx location

echo "🔍 Checking aaPanel Nginx structure..."

# Check aaPanel Nginx config location
NGINX_CONF="/www/server/nginx/conf/nginx.conf"
VHOST_DIR="/www/server/nginx/conf/vhost"

echo "Nginx config: $NGINX_CONF"
echo "Vhost directory: $VHOST_DIR"

# Check if vhost directory exists
if [ -d "$VHOST_DIR" ]; then
    echo "✅ Vhost directory exists"
    ls -la "$VHOST_DIR"
else
    echo "❌ Vhost directory not found"
fi

# Check main nginx config
echo -e "\n📋 Main Nginx config includes:"
grep -E "include|vhost" "$NGINX_CONF" | head -10

# Check existing vhost configs
echo -e "\n📋 Existing vhost configs:"
ls -la "$VHOST_DIR"/*.conf 2>/dev/null | head -10


