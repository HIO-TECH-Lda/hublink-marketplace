#!/bin/bash
# Script to restore control panel access

echo "🔍 Checking control panel status..."

# Check if BT Panel is installed
if [ -d "/www/server/panel" ]; then
    echo "✅ BT Panel detected"
    
    # Check BT Panel service
    echo "📋 Checking BT Panel service..."
    systemctl status bt 2>/dev/null || service bt status 2>/dev/null
    
    # Check if port 22773 is listening
    echo -e "\n📋 Checking port 22773..."
    netstat -tulpn | grep 22773 || ss -tulpn | grep 22773
    
    # Check firewall
    echo -e "\n📋 Checking firewall..."
    ufw status | grep 22773 || iptables -L -n | grep 22773
    
    # Check BT Panel process
    echo -e "\n📋 Checking BT Panel processes..."
    ps aux | grep -E "python.*panel|bt" | grep -v grep
    
    echo -e "\n🔧 Attempting to start BT Panel..."
    /etc/init.d/bt restart 2>/dev/null || systemctl restart bt 2>/dev/null || service bt restart 2>/dev/null
    
    echo -e "\n📋 BT Panel info:"
    /etc/init.d/bt default 2>/dev/null || echo "Run: bt default"
fi


