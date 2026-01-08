#!/bin/bash
# Script to identify and configure the correct Nginx

echo "🔍 Checking which Nginx is running..."

# Check running Nginx processes
echo "Running Nginx processes:"
ps aux | grep nginx | grep -v grep

# Check which nginx binary is being used
echo -e "\n📋 Nginx binary locations:"
which nginx
ls -la /usr/sbin/nginx 2>/dev/null
ls -la /www/server/nginx/sbin/nginx 2>/dev/null

# Check config file locations
echo -e "\n📋 Nginx config files:"
echo "Standard location: /etc/nginx/nginx.conf"
ls -la /etc/nginx/nginx.conf 2>/dev/null || echo "  Not found"

echo -e "\nCustom location: /www/server/nginx/conf/nginx.conf"
ls -la /www/server/nginx/conf/nginx.conf 2>/dev/null || echo "  Not found"

# Check which config the running nginx is using
echo -e "\n📋 Active Nginx config:"
nginx -t 2>&1 | grep "configuration file"


