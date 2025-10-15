# PWA Troubleshooting Guide

## iPhone 14 Pro PWA Issues

### Common Issues and Solutions

#### 1. **PWA Not Installing**
**Symptoms**: No "Add to Home Screen" option appears
**Solutions**:
- Make sure you're using Safari (PWA only works in Safari on iOS)
- Visit the website multiple times to build trust
- Clear Safari cache and try again
- Check if the manifest.json is being served correctly

#### 2. **PWA Icon Not Showing**
**Symptoms**: Generic icon appears instead of custom icon
**Solutions**:
- The manifest now uses SVG data URLs for icons (no external files needed)
- Icons are embedded directly in the manifest.json
- Check browser console for any 404 errors

#### 3. **Service Worker Not Registering**
**Symptoms**: Offline functionality not working
**Solutions**:
- Check browser console for service worker errors
- Make sure HTTPS is enabled (required for service workers)
- Clear browser cache and reload

### Testing PWA on iPhone

#### Step-by-Step Testing:
1. **Open Safari** (not Chrome or other browsers)
2. **Navigate to your site**: `https://your-site.netlify.app`
3. **Wait for page to load completely**
4. **Tap the Share button** (square with arrow pointing up)
5. **Scroll down and look for "Add to Home Screen"**
6. **Tap "Add to Home Screen"**
7. **Customize the name if desired**
8. **Tap "Add"**

#### Debugging Steps:
1. **Check Safari Console**:
   - Connect iPhone to Mac
   - Open Safari on Mac
   - Go to Develop > [Your iPhone] > [Your Site]
   - Check for any JavaScript errors

2. **Verify Manifest**:
   - Visit `https://your-site.netlify.app/manifest.json`
   - Should return valid JSON
   - Check that icons are properly defined

3. **Test Service Worker**:
   - In Safari console, check if service worker is registered
   - Look for "Service Worker registered" message

### PWA Requirements Checklist

#### ✅ **Manifest.json**
- [x] Valid JSON format
- [x] `name` and `short_name` defined
- [x] `start_url` points to root
- [x] `display` set to "standalone"
- [x] Icons defined (192x192 and 512x512)
- [x] `theme_color` defined

#### ✅ **Service Worker**
- [x] Registered in PWAProvider
- [x] Handles offline functionality
- [x] Caches important resources

#### ✅ **HTTPS**
- [x] Site served over HTTPS (Netlify provides this)

#### ✅ **Meta Tags**
- [x] `apple-mobile-web-app-capable` set to "yes"
- [x] `apple-mobile-web-app-status-bar-style` defined
- [x] `apple-mobile-web-app-title` defined

### Current Configuration

#### Manifest Features:
- **Icons**: SVG data URLs (no external files needed)
- **Display**: Standalone (full-screen app experience)
- **Theme**: Blue (#2563EB)
- **Orientation**: Portrait primary
- **Shortcuts**: Quick access to key pages

#### Service Worker Features:
- **Caching**: Static files and API responses
- **Offline**: Shows offline page when no connection
- **Updates**: Prompts for app updates
- **Install**: Handles PWA installation

### Browser Support

#### ✅ **Fully Supported**:
- Safari (iOS 11.3+)
- Chrome (Android 67+)
- Edge (Windows 10+)
- Firefox (Android 58+)

#### ⚠️ **Limited Support**:
- Chrome on iOS (no PWA support)
- Firefox on iOS (no PWA support)

### Testing Tools

#### 1. **Lighthouse PWA Audit**
- Open Chrome DevTools
- Go to Lighthouse tab
- Run PWA audit
- Should score 90+ for PWA

#### 2. **Manifest Validator**
- Visit: https://manifest-validator.appspot.com/
- Paste your manifest.json URL
- Check for any validation errors

#### 3. **Service Worker Testing**
- Open DevTools > Application tab
- Check Service Workers section
- Verify registration and caching

### Common Fixes

#### If PWA still doesn't work:

1. **Clear all caches**:
   ```javascript
   // In browser console
   caches.keys().then(names => names.forEach(name => caches.delete(name)))
   ```

2. **Unregister service worker**:
   ```javascript
   // In browser console
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(registration => registration.unregister())
   })
   ```

3. **Force reload**:
   - Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
   - Or clear Safari cache in Settings > Safari > Clear History and Website Data

### iPhone-Specific Notes

- **Safari Only**: PWA installation only works in Safari on iOS
- **Trust Building**: iOS requires multiple visits before showing install prompt
- **Icon Requirements**: iOS prefers 180x180 icons for best display
- **Status Bar**: Can be customized with `apple-mobile-web-app-status-bar-style`

### Next Steps

1. **Deploy the updated code** to Netlify
2. **Test on iPhone 14 Pro** using Safari
3. **Check browser console** for any errors
4. **Verify manifest.json** is accessible
5. **Test offline functionality**

If issues persist, check the browser console for specific error messages and refer to this troubleshooting guide.
