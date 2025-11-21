# Deploy to Firebase App Hosting

Firebase App Hosting supports full Next.js including API routes, SSR, and cron jobs.

## Prerequisites

✅ Firebase project created: `spoquen`
✅ Authentication enabled
✅ Firestore created
✅ Storage enabled
✅ Rules deployed

## Step 1: Deploy Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Step 2: Set Up App Hosting

### Option A: Via Console (Recommended)

1. Go to: https://console.firebase.google.com/project/spoquen/apphosting
2. Click "Get started"
3. Connect your GitHub repository
4. Select branch: `main`
5. Root directory: `/`

### Add Environment Variables

In the App Hosting console, add these secrets:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_APP_URL=https://your-project.web.app
CRON_SECRET=your-random-secret-key
```

Note: Update `NEXT_PUBLIC_APP_URL` after first deploy with actual URL.

### Option B: Via CLI

```bash
# Initialize App Hosting
firebase apphosting:backends:create spoquen-backend \
  --location=us-central1 \
  --github-repo=your-username/spoquen

# Deploy
firebase apphosting:rollouts:create spoquen-backend --location=us-central1
```

## Step 3: Deploy

Push to GitHub or use:

```bash
git add .
git commit -m "Configure for App Hosting"
git push origin main
```

App Hosting will auto-build and deploy!

## Step 4: Update Auth Domain

After deployment, get your URL: `https://spoquen--<rollout-id>.web.app`

1. Go to: https://console.firebase.google.com/project/spoquen/authentication/settings
2. Add to Authorized domains:
   - Your App Hosting URL
   - Your custom domain (if any)

## Step 5: Test

Visit your deployed URL and:
- ✅ Create account
- ✅ Record a Spoque  
- ✅ View feed
- ✅ Check autoplay

## Configuration Files

- `apphosting.yaml` - Runtime config
- `firebase.json` - Firebase services config
- `.firebaserc` - Project mapping
- `next.config.ts` - Next.js config (output: standalone)

## Monitoring

- Logs: https://console.firebase.google.com/project/spoquen/apphosting/logs
- Metrics: https://console.firebase.google.com/project/spoquen/apphosting/metrics

## Rollbacks

```bash
# List rollouts
firebase apphosting:rollouts:list spoquen-backend --location=us-central1

# Rollback to previous
firebase apphosting:rollouts:rollback spoquen-backend --location=us-central1
```

## Custom Domain

1. Go to App Hosting settings
2. Add custom domain
3. Update DNS records
4. SSL auto-provisions

## Troubleshooting

**Build fails:**
- Check environment variables are set
- Review build logs in console

**Auth not working:**
- Verify domain is in authorized domains
- Check Firebase config in .env

**Storage uploads fail:**
- Verify storage rules deployed
- Check CORS settings

## What Works

✅ Full Next.js SSR
✅ API routes (`/api/*`)
✅ Dynamic routes
✅ Server actions
✅ Image optimization
✅ Firebase Integration
✅ Auto-scaling
✅ HTTPS + CDN

Perfect for production! 🚀

