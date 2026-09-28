# 🚀 OpenImpact Deployment Guide

## Pre-Deployment Verification

Before deploying, verify everything works locally:

```bash
# Navigate to project
cd /tmp/openimpact

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev
```

Then test:
- ✅ Landing page loads
- ✅ Click "Explore Projects" → ProjectList modernized
- ✅ Navigation tabs appear
- ✅ Click "Proof of Work" → New page loads
- ✅ Click "Analytics" → New page loads
- ✅ All colors & animations work

---

## Deployment Options

### **Option 1: Hostinger (FTP Deployment) - RECOMMENDED**

**Requirements:**
- FTP credentials in `.env.local`
- Hostinger account with domain

**Steps:**

```bash
# Build production bundle
npm run build

# Create deployment script (if not exists)
cat > deploy.sh << 'EOF'
#!/bin/bash
npm run build
zip -r dist.zip dist
# FTP upload dist/ to hosting
echo "Upload dist/ folder to Hostinger via FTP"
EOF

chmod +x deploy.sh
./deploy.sh
```

**Manual FTP Upload:**
1. Build: `npm run build`
2. Open FTP client (FileZilla, Cyberduck)
3. Connect to: `skill-sch.com` FTP server
4. Upload `dist/` contents to `/public_html/`
5. Clear browser cache
6. Visit: `https://skill-sch.com`

---

### **Option 2: Firebase Hosting**

**Setup:**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# When prompted:
# - Select "Hosting"
# - Use "dist" as public directory
# - Configure rewrites for SPA
```

**Deploy:**

```bash
npm run build
firebase deploy --only hosting
```

**Live at:** `https://openimpact.firebaseapp.com`

---

### **Option 3: Vercel**

**Setup:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (first time)
vercel
```

**Deploy (subsequent):**

```bash
npm run build
vercel --prod
```

**Live at:** Auto-generated domain or custom domain

---

### **Option 4: GitHub Pages**

**Setup:**

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json:
# "deploy": "npm run build && gh-pages -d dist"
```

**Deploy:**

```bash
npm run deploy
```

---

## Post-Deployment Verification

### **Visual Inspection:**

```bash
# Test production URL in browser
1. Visit deployed URL
2. Open DevTools (F12)
3. Check Console for errors
4. Test all pages load
5. Verify animations work
6. Check mobile responsiveness
```

### **Performance Audit:**

```bash
# Use Lighthouse
1. Open DevTools
2. Go to Lighthouse tab
3. Run audit
4. Target: 90+ scores
```

### **Cross-Browser Testing:**

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

## Troubleshooting

### **Issue: Build fails**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Issue: Styles not loading**

```bash
# Check CSS import
# In App.tsx, ensure:
import './styles/modern-theme.css';
```

### **Issue: Components not found**

```bash
# Verify file paths in App.tsx imports
# All component files must exist:
ls src/components/ProofOfWorkShowcase.tsx
ls src/components/AnalyticsDashboard.tsx
```

### **Issue: Port already in use**

```bash
# Use different port
npm run dev -- --port 3001
```

---

## Environment Variables

Create `.env.local` for local development:

```env
# Firebase (if using)
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_PROJECT_ID=xxx

# API endpoints
VITE_API_BASE_URL=https://api.skill-sch.com

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PROOF_VERIFICATION=true
```

---

## Git Commit for Deployment

```bash
# Stage all changes
git add .

# Create descriptive commit
git commit -m "Feat: Complete UI modernization with new Proof of Work and Analytics pages"

# Push to main
git push origin main
```

---

## Performance Optimization

### **Bundle Size:**

```bash
# Analyze bundle
npm run build
npm run preview

# Check size
du -sh dist/
# Target: <5MB
```

### **Image Optimization:**

```bash
# Convert PNG → WebP
npx imagemin src/assets/*.png --out-dir=src/assets --plugin=webp
```

### **Lazy Loading:**

Components are already optimized with:
- Dynamic imports
- Memoization
- Efficient re-renders

---

## Monitoring & Analytics

### **Monitor Errors:**

```javascript
// Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### **Track Usage:**

```javascript
// Add Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

---

## Rollback Instructions

If issues occur:

```bash
# Revert to previous version
git revert HEAD

# Push revert
git push origin main

# Deploy previous version
npm run build
# Re-upload to hosting
```

---

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] All pages accessible via navigation
- [ ] Gradients display correctly
- [ ] Animations play smoothly
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Links are functional
- [ ] Forms submit correctly
- [ ] Performance is good (Lighthouse 90+)
- [ ] No console errors
- [ ] Search works
- [ ] Currency conversion works
- [ ] All buttons are clickable

---

## DNS & Domain Setup

If using custom domain:

```bash
# Update DNS records to point to hosting provider
# Example for Hostinger:
# A Record: skill-sch.com → 185.236.xxx.xxx
# CNAME: www.skill-sch.com → skill-sch.com

# Enable SSL (usually automatic)
# Verify HTTPS works
curl -I https://skill-sch.com
```

---

## Scheduled Maintenance

Set up automated backups:

```bash
# Create backup script
#!/bin/bash
timestamp=$(date +%Y-%m-%d_%H-%M-%S)
zip -r backup_$timestamp.zip src/ public/ dist/
aws s3 cp backup_$timestamp.zip s3://backups/
```

---

## Support & Troubleshooting

For issues:

1. Check browser console (F12 → Console)
2. Review server logs
3. Check network tab for failed requests
4. Verify all files are deployed
5. Clear cache and hard refresh (Ctrl+Shift+R)

---

## Success Criteria

✅ Deployment is successful when:

- All pages load without errors
- Modern design is visible
- Animations work smoothly
- Responsive on all devices
- Lighthouse score 90+
- No broken links
- All functionality operational

---

## Next Steps

After successful deployment:

1. Share the live URL with stakeholders
2. Gather feedback on new pages
3. Monitor analytics for usage patterns
4. Plan future enhancements
5. Set up regular backups

---

**Deployment Version:** 1.0  
**Date:** 2026-08-13  
**Status:** Ready for Production ✅
