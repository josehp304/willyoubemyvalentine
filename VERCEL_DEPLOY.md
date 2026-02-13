# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Have a Vercel account

## Environment Variables
Set these in your Vercel project settings:
- `DATABASE_URL` - Your Neon database connection string
- `JWT_SECRET` - Secret key for JWT tokens (generate a random string)

## Deploy Commands

### Development/Preview
```bash
vercel
```

### Production
```bash
vercel --prod
```

## Local Build Test
```bash
npm run build
```

## Project Structure for Vercel
- Frontend builds to `frontend/dist/` (static files)
- Backend compiles to `api/` (serverless functions)
- API routes accessible at `/api/*`
- Frontend routes at root `/`

## Post-Deployment
1. Update frontend `VITE_API_URL` in Vercel environment variables to point to your deployment URL
2. Re-deploy if needed
