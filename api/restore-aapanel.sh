#!/bin/bash
# Script to restore aaPanel access

echo "🔍 Checking aaPanel status..."

# Check if aaPanel is installed
if [ -d "/www/server/panel" ]; then
    echo "✅ aaPanel detected"
    
    # Check aaPanel service
    echo "📋 Checking aaPanel service..."
    systemctl status bt 2>/dev/null || service bt status 2>/dev/null || /etc/init.d/bt status 2>/dev/null
    
    # Check if port 22773 is listening
    echo -e "\n📋 Checking port 22773..."
    netstat -tulpn | grep 22773 || ss -tulpn | grep 22773
    
    # Check firewall
    echo -e "\n📋 Checking firewall..."
    ufw status | grep 22773 || iptables -L -n | grep 22773
    
    # Check aaPanel process
    echo -e "\n📋 Checking aaPanel processes..."
    ps aux | grep -E "python.*panel|bt" | grep -v grep
    
    echo -e "\n🔧 Attempting to start aaPanel..."
    /etc/init.d/bt restart 2>/dev/null || systemctl restart bt 2>/dev/null || service bt restart 2>/dev/null
    
    echo -e "\n📋 aaPanel info:"
    /etc/init.d/bt default 2>/dev/null || bt default 2>/dev/null || echo "Run: bt default"
fi


