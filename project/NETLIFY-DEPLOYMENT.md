# Netlify Deployment Guide

## Configuration Files

### netlify.toml
This file configures how Netlify builds and deploys your Next.js application:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## Deployment Steps

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with your Git provider
   - Click "New site from Git"
   - Choose your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18` (or higher)

4. **Environment Variables** (if needed)
   - Go to Site settings > Environment variables
   - Add any required environment variables

5. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically install the Next.js plugin and deploy

## Important Notes

- The `@netlify/plugin-nextjs` plugin is automatically installed by Netlify
- This configuration supports both static and server-side rendered pages
- The plugin handles routing automatically
- Make sure your Node.js version is 18 or higher

## Troubleshooting

If you get a "Page not found" error:
1. Check that the `netlify.toml` file is in your repository root
2. Verify the build command and publish directory are correct
3. Check the build logs in Netlify dashboard
4. Make sure all dependencies are properly installed

## Custom Domain

To add a custom domain:
1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Performance

- The Next.js plugin optimizes your application automatically
- Static pages are served from CDN
- Server-side rendered pages are handled by Netlify Functions
