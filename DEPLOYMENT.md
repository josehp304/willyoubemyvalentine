# Deployment Guide 🚀

## Prerequisites

- ✅ Neon DB account (https://neon.tech)
- ✅ Backend hosting account (Railway, Render, or similar)
- ✅ Frontend hosting account (Vercel, Netlify)
- ✅ Your code pushed to GitHub

## Step 1: Deploy Database (Neon DB)

Your Neon DB is already set up! Just make sure:
1. Your database is in the correct region for your users
2. You have the production connection string
3. The database is accessible from your backend host

## Step 2: Deploy Backend

### Option A: Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables:
   ```
   DATABASE_URL=your_neon_production_url
   PORT=3000
   NODE_ENV=production
   ```
6. Deploy!
7. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: willyoubemyvalentine-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Add environment variables:
   ```
   DATABASE_URL=your_neon_production_url
   PORT=3000
   NODE_ENV=production
   ```
6. Deploy!
7. Copy your backend URL

### Option C: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set DATABASE_URL=your_neon_production_url
   heroku config:set NODE_ENV=production
   ```
5. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Step 3: Update Backend CORS

Before deploying frontend, update backend CORS to allow your production domain:

Edit `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app'  // Add your production domain
  ]
}));
```

Redeploy backend after this change.

## Step 4: Deploy Frontend

### Option A: Vercel (Recommended)

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy!
7. Your site will be live at `https://your-app.vercel.app`

### Option B: Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy!
7. Your site will be live at `https://your-app.netlify.app`

### Option C: GitHub Pages

1. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Deploy: `npm run deploy`

## Step 5: Test Production Deployment

1. Visit your production frontend URL
2. Create a test request
3. Copy the shareable link
4. Open in incognito/private window
5. Respond to the request
6. Check that response appears in dashboard

## Environment Variables Summary

### Backend (.env in production)
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
PORT=3000
NODE_ENV=production
```

### Frontend (.env in production)
```
VITE_API_URL=https://your-backend-domain.com
```

## Post-Deployment Checklist

- ✅ Backend is accessible at its URL
- ✅ Frontend is accessible at its URL
- ✅ API calls from frontend to backend work
- ✅ CORS is properly configured
- ✅ Database tables are created
- ✅ Can create requests
- ✅ Can share links
- ✅ Can respond to requests
- ✅ Dashboard shows responses
- ✅ All routes work (/, /create, /request/:id)
- ✅ Mobile responsive
- ✅ HTTPS enabled
- ✅ Environment variables set correctly

## Monitoring

### Neon DB
- Monitor database usage in Neon dashboard
- Check for slow queries
- Monitor connection pool

### Backend
- Check logs in Railway/Render dashboard
- Monitor response times
- Set up error tracking (e.g., Sentry)

### Frontend
- Check Vercel/Netlify analytics
- Monitor build times
- Check for console errors in production

## Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### For Backend (Railway):
1. Go to your service settings
2. Click "Settings" → "Networking"
3. Add custom domain
4. Update DNS records

## Cost Estimates

- **Neon DB**: Free tier includes 0.5GB storage, 100 hours compute/month
- **Railway**: $5/month after free tier
- **Render**: Free tier available
- **Vercel**: Free for personal projects
- **Netlify**: Free tier includes 100GB bandwidth

## Scaling Considerations

If your app gets popular:

1. **Database**: Upgrade Neon DB plan for more storage/compute
2. **Backend**: Increase instance size or add more instances
3. **Frontend**: Both Vercel and Netlify handle CDN automatically
4. **Caching**: Add Redis for session management
5. **Rate Limiting**: Implement to prevent abuse

## Security Checklist

- ✅ Use HTTPS everywhere
- ✅ Validate all inputs on backend
- ✅ Use parameterized queries (already done)
- ✅ Set proper CORS origins
- ✅ Don't commit .env files
- ✅ Use environment variables for secrets
- ✅ Keep dependencies updated
- ✅ Set up security headers

## Troubleshooting Production Issues

### "Failed to fetch" in production
- Check CORS settings
- Verify backend URL in frontend env
- Check browser console for exact error

### Database connection errors
- Verify DATABASE_URL is correct
- Check Neon DB is not paused
- Verify SSL mode is required

### Build failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

### 404 on refresh
- For Vercel: Add `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- For Netlify: Add `_redirects` in public folder:
  ```
  /*    /index.html   200
  ```

## Rollback Strategy

If something goes wrong:

1. **Vercel/Netlify**: Click "Rollback" to previous deployment
2. **Railway/Render**: Redeploy previous commit
3. **Database**: Neon has point-in-time recovery

## Updates and Maintenance

To deploy updates:

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel/Netlify: Auto-deploys on push
5. Railway/Render: May need manual trigger

## Success! 🎉

Your Valentine Request app is now live and ready to spread the love!

Share your production URL and let people create Valentine requests!
