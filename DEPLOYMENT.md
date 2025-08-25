# 🚀 Netlify Deployment Guide

## Prerequisites
- Netlify account
- Firebase project configured
- Environment variables ready

## Step 1: Prepare Environment Variables

Copy your Firebase configuration from `src/lib/firebase.ts` and set these environment variables in Netlify:

```
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-actual-auth-domain
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-actual-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id
```

## Step 2: Deploy to Netlify

### Option A: Git Integration (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

### Option B: Manual Upload
1. Run `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables

## Step 3: Configure Firebase

1. Go to Firebase Console
2. Add your Netlify domain to authorized domains
3. Update Firestore security rules if needed

## Build Commands

```bash
# Development build
npm run build

# Production build
npm run build:prod

# Clean build directory
npm run clean

# Type checking
npm run type-check
```

## Environment Variables Reference

See `env-template.txt` for all required environment variables.

## Troubleshooting

- **Build fails**: Check TypeScript errors with `npm run type-check`
- **Firebase errors**: Verify environment variables are set correctly
- **Routing issues**: Ensure `netlify.toml` is in the root directory
