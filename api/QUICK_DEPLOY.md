# Quick Deployment Checklist

## Prerequisites
- [ ] SSH access to server: `ssh root@192.145.237.193`
- [ ] MongoDB Atlas connection string ready
- [ ] All API keys and secrets ready

## Deployment Steps (Run on Server)

### 1. Initial Setup
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx
```

### 2. Upload Code
From your local machine:
```bash
# Using rsync (recommended)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  project-bolt-sb1-uqyvamjw root@192.145.237.193:/var/www/
```

### 3. Deploy API
```bash
cd /var/www/project-bolt-sb1-uqyvamjw/api
npm install
npm run build
cp env.example .env
nano .env  # Edit with your values
pm2 start dist/app.js --name "api"
```

### 4. Deploy Frontend
```bash
cd /var/www/project-bolt-sb1-uqyvamjw/project
npm install
echo "NEXT_PUBLIC_API_BASE_URL=http://192.145.237.193/api/v1" > .env.local
npm run build
pm2 start npm --name "frontend" -- start
```

### 5. Configure Nginx
```bash
nano /etc/nginx/sites-available/marketplace
# Paste the Nginx config from DEPLOYMENT_GUIDE.md

ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### 6. Configure Firewall
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 7. Save PM2 Configuration
```bash
pm2 save
pm2 startup  # Follow instructions
```

## Verify Deployment

```bash
# Check PM2 status
pm2 status

# Test locally
curl http://localhost:3000
curl http://localhost:3002/api/v1/health

# Test from outside
curl http://192.145.237.193
curl http://192.145.237.193/api/v1/health
```

## Access URLs

- **Frontend:** http://192.145.237.193
- **API:** http://192.145.237.193/api/v1
- **Health Check:** http://192.145.237.193/api/v1/health

## Quick Commands

```bash
# View logs
pm2 logs

# Restart apps
pm2 restart all

# Check Nginx
systemctl status nginx
tail -f /var/log/nginx/error.log
```


