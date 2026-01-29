# Full Stack Deployment Guide (API + Next.js Frontend)

## Quick Answer
**Yes, both your API and Next.js frontend will be available online!** The frontend will be accessible at the root URL (`http://192.145.237.193`), and the API will be proxied through `/api/v1`.

---

## Architecture Overview

- **Frontend (Next.js):** Running on port `3000`, served at root path `/`
- **Backend API (Express):** Running on port `3002`, proxied at `/api/v1`
- **Nginx:** Reverse proxy serving frontend on root and proxying API requests

---

## Step-by-Step Deployment Instructions

### 1. Install Node.js on the Server

SSH into your server and install Node.js:

```bash
# Update system packages
apt update && apt upgrade -y

# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install PM2 (Process Manager)

PM2 will keep both apps running and restart them if they crash:

```bash
npm install -g pm2
```

### 3. Install Nginx

```bash
apt install -y nginx
```

### 4. Upload Your Code to the Server

**Option A: Using Git (Recommended)**
```bash
# On the server
cd /var/www
git clone <your-repo-url> project-bolt
cd project-bolt
```

**Option B: Using SCP (from your local machine)**
```bash
# From your local machine (in the parent directory containing both 'api' and 'project' folders)
scp -r project-bolt-sb1-uqyvamjw root@192.145.237.193:/var/www/
```

**Option C: Using rsync (from your local machine)**
```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' project-bolt-sb1-uqyvamjw root@192.145.237.193:/var/www/
```

After uploading, your structure on the server should be:
```
/var/www/project-bolt-sb1-uqyvamjw/
├── api/          # Backend API
└── project/      # Next.js Frontend
```

### 5. Deploy the Backend API

```bash
# Navigate to API directory
cd /var/www/project-bolt-sb1-uqyvamjw/api

# Install dependencies
npm install

# Build the application
npm run build

# Create .env file
cp env.example .env
nano .env
```

**Important API environment variables:**
```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster-url/txova_marketplace?retryWrites=true&w=majority
JWT_SECRET=your-strong-random-secret-key
CORS_ORIGIN=http://192.145.237.193,http://localhost:3000
FRONTEND_URL=http://192.145.237.193
```

**Start the API with PM2:**
```bash
cd /var/www/project-bolt-sb1-uqyvamjw/api
pm2 start dist/app.js --name "api" --env production
pm2 save
```

### 6. Deploy the Next.js Frontend

```bash
# Navigate to frontend directory
cd /var/www/project-bolt-sb1-uqyvamjw/project

# Install dependencies
npm install

# Create .env.local file for Next.js
nano .env.local
```

**Important Next.js environment variables:**
```env
NEXT_PUBLIC_API_BASE_URL=http://192.145.237.193/api/v1
NODE_ENV=production
```

**Build the Next.js app:**
```bash
npm run build
```

**Start the Next.js app with PM2:**
```bash
cd /var/www/project-bolt-sb1-uqyvamjw/project
pm2 start npm --name "frontend" -- start
pm2 save
```

### 7. Configure Nginx

**Important:** If Apache is running (you see Apache default page), you need to stop it first:

```bash
# Check if Apache is running
systemctl status apache2

# Stop Apache (if running)
systemctl stop apache2

# Disable Apache from starting on boot (optional)
systemctl disable apache2

# Check what's using port 80
netstat -tulpn | grep :80
# OR
ss -tulpn | grep :80
```

Now create the Nginx configuration file:

```bash
nano /etc/nginx/sites-available/marketplace
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name 192.145.237.193;  # Replace with your domain if you have one

    # Increase body size for file uploads
    client_max_body_size 10M;

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers (if needed)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # Serve Next.js frontend on root path
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Next.js specific headers
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site if it exists
nginx -t  # Test configuration
systemctl restart nginx
```

### 8. Configure Firewall

```bash
# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

### 9. Setup PM2 to Start on Boot

```bash
pm2 startup
# Follow the instructions it provides
pm2 save
```

### 10. Verify Everything Works

```bash
# Check if both apps are running
pm2 status

# Check logs
pm2 logs api
pm2 logs frontend

# Test the API
curl http://localhost:3002/health
curl http://localhost:3002/api/v1/health

# Test the frontend
curl http://localhost:3000

# Test from outside
curl http://192.145.237.193
curl http://192.145.237.193/api/v1/health
```

---

## Accessing Your Application

Once deployed, your application will be available at:

- **Frontend:** `http://192.145.237.193` (root path)
- **API Health Check:** `http://192.145.237.193/api/v1/health`
- **API Base URL:** `http://192.145.237.193/api/v1`

---

## Useful PM2 Commands

```bash
# View all running apps
pm2 status

# View logs for specific app
pm2 logs api
pm2 logs frontend

# View all logs
pm2 logs

# Restart applications
pm2 restart api
pm2 restart frontend
pm2 restart all

# Stop applications
pm2 stop api
pm2 stop frontend

# Monitor resources
pm2 monit

# View detailed info
pm2 show api
pm2 show frontend
```

---

## SSL/HTTPS Setup (Optional but Recommended)

For production, you should set up SSL using Let's Encrypt:

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
```

**Note:** If you don't have a domain, you can still use the IP address, but SSL won't work with Let's Encrypt (they require a domain name).

---

## Updating Your Application

### Update Backend API

```bash
cd /var/www/project-bolt-sb1-uqyvamjw/api
git pull  # If using Git
# OR upload new files via SCP/rsync

npm install
npm run build
pm2 restart api
```

### Update Frontend

```bash
cd /var/www/project-bolt-sb1-uqyvamjw/project
git pull  # If using Git
# OR upload new files via SCP/rsync

npm install
npm run build
pm2 restart frontend
```

---

## Troubleshooting

### Frontend won't start
- Check logs: `pm2 logs frontend`
- Verify environment variables: `cat .env.local`
- Check if port 3000 is in use: `netstat -tulpn | grep 3000`
- Ensure Next.js build completed: `ls -la .next`

### Frontend changes not reflecting after rebuild
If you've made changes to the frontend but they're not showing online:

1. **Check PM2 status and logs:**
   ```bash
   pm2 status
   pm2 logs frontend --lines 50
   ```

2. **Verify the build actually succeeded:**
   ```bash
   cd /var/www/project-bolt-sb1-uqyvamjw/project
   npm run build
   # Check for any errors in the build output
   ```

3. **Clear Next.js cache and rebuild:**
   ```bash
   cd /var/www/project-bolt-sb1-uqyvamjw/project
   rm -rf .next
   npm run build
   pm2 restart frontend
   ```

4. **Hard restart PM2 (delete and recreate):**
   ```bash
   pm2 delete frontend
   cd /var/www/project-bolt-sb1-uqyvamjw/project
   pm2 start npm --name "frontend" -- start
   pm2 save
   ```

5. **Check if changes are in the right directory:**
   ```bash
   # Verify you're editing files in the correct location
   cd /var/www/project-bolt-sb1-uqyvamjw/project
   ls -la
   # Check the last modified time of files you changed
   ```

6. **Clear browser cache or test in incognito mode:**
   - Browser may be caching old assets
   - Try: `Ctrl+Shift+R` (hard refresh) or `Ctrl+F5`
   - Or test in incognito/private browsing mode

7. **Check Nginx caching (if configured):**
   ```bash
   # If using aaPanel's nginx, check for cache settings
   # You may need to disable caching for development
   ```

8. **Verify the app is actually running:**
   ```bash
   curl http://localhost:3000
   # Compare with what you see at http://192.145.237.193/
   ```

### ChunkLoadError: Loading chunk failed (404 errors)
If you see errors like `ChunkLoadError: Loading chunk 9113 failed` or `404 (Not Found)` for `/_next/static/chunks/` files:

**This happens when:**
- Browser has cached old HTML with references to old chunk files
- Build output changed but browser still has old references
- Static files aren't being served correctly

**Solutions:**

1. **Clear browser cache completely:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache completely
   - Or test in incognito/private mode

2. **Verify the chunk file exists on server:**
   ```bash
   cd /var/www/project-bolt-sb1-uqyvamjw/project
   # Check if the chunk file exists (replace with actual filename from error)
   find .next -name "*9113*" -o -name "*2568e32d9d80452c*"
   # List all chunks
   ls -la .next/static/chunks/ | head -20
   ```

3. **Do a complete clean rebuild:**
   ```bash
   cd /var/www/project-bolt-sb1-uqyvamjw/project
   rm -rf .next
   rm -rf node_modules/.cache
   npm run build
   pm2 restart frontend
   ```

4. **Check if nginx is properly serving static files:**
   ```bash
   # Test if the chunk file is accessible
   curl -I http://localhost:3000/_next/static/chunks/webpack-*.js | head -5
   # Should return 200 OK, not 404
   ```

5. **Verify nginx configuration includes `/_next/static` location:**
   - Make sure your nginx config has the `location /_next/static` block
   - It should proxy to `http://localhost:3000`

6. **If using aaPanel, check nginx config:**
   ```bash
   # Find your site config
   ls -la /www/server/panel/vhost/nginx/
   # Edit and ensure /_next/static is proxied correctly
   ```

7. **Temporary fix - disable browser cache headers in nginx (for development):**
   ```nginx
   location / {
       proxy_pass http://localhost:3000;
       # ... other headers ...
       add_header Cache-Control "no-cache, no-store, must-revalidate";
   }
   ```

### API won't start
- Check logs: `pm2 logs api`
- Verify environment variables: `cat .env`
- Check if port 3002 is in use: `netstat -tulpn | grep 3002`
- Verify MongoDB connection

### Can't access from outside
- Check firewall: `ufw status`
- Verify Nginx is running: `systemctl status nginx`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`
- Test Nginx config: `nginx -t`
- **If you see Apache default page instead of your app:**
  ```bash
  # Stop Apache
  systemctl stop apache2
  
  # Check what's using port 80
  netstat -tulpn | grep :80
  
  # Make sure Nginx is running
  systemctl start nginx
  systemctl status nginx
  
  # Verify Nginx config is enabled
  ls -la /etc/nginx/sites-enabled/
  ```

### Nginx can't bind to port 80 (Address already in use)
- **If you have aaPanel installed**, aaPanel's nginx is likely using port 80
- **Check what's using port 80:**
  ```bash
  netstat -tulpn | grep :80
  # OR
  ss -tulpn | grep :80
  ```
- **If you see aaPanel's nginx processes:**
  ```bash
  ps aux | grep nginx
  # You'll see processes like:
  # /www/server/nginx/sbin/nginx
  # /www/server/panel/webserver/sbin/webserver
  ```
- **Option 1: Use aaPanel's nginx (Recommended if using aaPanel)**
  - Configure aaPanel's nginx via the web panel at `http://your-server-ip:22773`
  - Or edit the config file: `/www/server/panel/vhost/nginx/your-domain.conf`
  - Add the reverse proxy configuration there instead of `/etc/nginx/sites-available/`
- **Option 2: Stop aaPanel's nginx and use system nginx**
  ```bash
  # Stop aaPanel's nginx
  /etc/init.d/nginx stop
  # OR
  systemctl stop nginx
  
  # Disable aaPanel's nginx from auto-starting
  systemctl disable nginx
  
  # Now start system nginx
  systemctl start nginx
  systemctl enable nginx
  ```
  **Note:** This may affect aaPanel's functionality. It's better to use aaPanel's nginx if you're using the panel.

### API requests failing
- Verify API is running: `pm2 status`
- Check CORS settings in API `.env`
- Test API directly: `curl http://localhost:3002/api/v1/health`
- Check Nginx proxy configuration

### Next.js build errors
- Check Node.js version: `node --version` (should be 18+)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check for TypeScript errors: `npm run build` (will show errors)

### aaPanel access issues (ERR_TIMED_OUT or TypeError)
- **Check panel service status:** `systemctl status bt` or `/etc/init.d/bt status`
- **Check if port is listening:** `netstat -tulpn | grep 22773`
- **Check firewall:** `ufw status | grep 22773` and `iptables -L -n | grep 22773`
- **Restart panel:** `/etc/init.d/bt restart` or `bt restart`
- **Get panel info:** `bt default` (shows URL, username, password)
- **Check panel logs:** `tail -f /www/server/panel/logs/error.log`
- **If Flask TypeError occurs:**
  ```bash
  # Update aaPanel to latest version
  bt update
  
  # Or repair panel installation
  bt repair
  
  # Check Python environment
  /www/server/panel/pyenv/bin/python3 --version
  
  # Restart after repair/update
  bt restart
  ```
- **If still not working, check security group/firewall on cloud provider** (AWS, DigitalOcean, etc.)

---

## Security Checklist

- [ ] Change default SSH port (optional but recommended)
- [ ] Use strong passwords or SSH keys
- [ ] Set up firewall rules
- [ ] Use environment variables (never commit `.env` or `.env.local`)
- [ ] Enable HTTPS/SSL (requires domain)
- [ ] Keep Node.js and packages updated
- [ ] Set up regular backups
- [ ] Monitor logs for suspicious activity
- [ ] Configure proper CORS origins (not `*` in production)
- [ ] Use strong JWT secrets

---

## Quick Deployment Script

Save this as `deploy-all.sh` in the parent directory and run it on your server:

```bash
#!/bin/bash
set -e

echo "🚀 Starting full stack deployment..."

BASE_DIR="/var/www/project-bolt-sb1-uqyvamjw"

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Deploy API
echo "📦 Deploying API..."
cd $BASE_DIR/api
npm install
npm run build
pm2 start dist/app.js --name "api" --env production || pm2 restart api

# Deploy Frontend
echo "📦 Deploying Frontend..."
cd $BASE_DIR/project
npm install
npm run build
pm2 start npm --name "frontend" -- start || pm2 restart frontend

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs"
```

Make it executable and run:
```bash
chmod +x deploy-all.sh
./deploy-all.sh
```

---

## Environment Variables Summary

### Backend API (`/var/www/project-bolt-sb1-uqyvamjw/api/.env`)
```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CORS_ORIGIN=http://192.145.237.193
FRONTEND_URL=http://192.145.237.193
```

### Frontend (`/var/www/project-bolt-sb1-uqyvamjw/project/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://192.145.237.193/api/v1
NODE_ENV=production
```

---

## Next Steps

1. **Domain Setup:** Point your domain to `192.145.237.193`
2. **SSL Certificate:** Install Let's Encrypt certificate
3. **Monitoring:** Set up monitoring (e.g., PM2 Plus, or external monitoring)
4. **Backups:** Configure automated backups
5. **CI/CD:** Set up automated deployment pipeline
6. **CDN:** Consider using a CDN for static assets
7. **Database Backups:** Set up MongoDB Atlas automated backups

---

## File Structure on Server

```
/var/www/project-bolt-sb1-uqyvamjw/
├── api/
│   ├── dist/              # Compiled TypeScript
│   ├── src/               # Source code
│   ├── .env               # API environment variables
│   ├── package.json
│   └── ...
└── project/
    ├── .next/             # Next.js build output
    ├── app/               # Next.js app directory
    ├── .env.local         # Frontend environment variables
    ├── package.json
    └── ...
```

---

## Port Summary

- **Port 80:** Nginx (public access)
- **Port 3000:** Next.js Frontend (internal)
- **Port 3002:** Express API (internal)
- **Port 443:** HTTPS (if SSL is configured)
