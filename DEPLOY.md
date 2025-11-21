# Deploy to Firebase Hosting

Quick guide to deploy Spoquen to Firebase Hosting.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select existing project
3. Project name: `spoquen` (or your choice)

## Step 2: Enable Firebase Services

### Authentication
1. Click "Authentication" → "Get started"
2. Enable "Email/Password"
3. Enable "Email link (passwordless sign-in)"

### Firestore Database
1. Click "Firestore Database" → "Create database"
2. Start in **production mode**
3. Choose your region

### Storage
1. Click "Storage" → "Get started"
2. Start in **production mode**
3. Same region as Firestore

## Step 3: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click web icon `</>` to add web app
4. Register app name: `spoquen-web`
5. Copy the config values

## Step 4: Create .env.local

Create `.env.local` in project root with your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# App URL (update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-project.web.app

# Cron Secret
CRON_SECRET=your-random-secret-key-12345
```

## Step 5: Deploy Firestore Rules

1. In Firebase Console, go to Firestore Database → Rules
2. Copy and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /prompts/{promptId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /spoques/{spoqueId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

## Step 6: Deploy Storage Rules

1. Go to Storage → Rules
2. Copy and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /spoques/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /profiles/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Build and Deploy

```bash
# Build the Next.js app
npm run build

# Login to Firebase (if needed)
firebase login

# Initialize Firebase Hosting (if not done)
firebase init hosting
# Choose:
# - Use existing project
# - Public directory: out
# - Configure as single-page app: No
# - Set up automatic builds: No
# - Don't overwrite files

# Deploy
firebase deploy --only hosting
```

## Step 8: Update Environment Variables

After first deploy, update `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://your-project.web.app
```

Then rebuild and redeploy:

```bash
npm run build
firebase deploy --only hosting
```

## Step 9: Update Firebase Auth Domain

1. Go to Authentication → Settings → Authorized domains
2. Add your Firebase Hosting domain: `your-project.web.app`

## Quick Deploy Commands

```bash
# Full deployment
npm run build && firebase deploy --only hosting

# Deploy rules only
firebase deploy --only firestore:rules,storage:rules

# View live site
firebase open hosting:site
```

## Important Notes

- Firebase Hosting only supports static exports
- Next.js API routes won't work on Firebase Hosting
- For API routes, use Vercel or Cloud Functions
- Cron jobs require Cloud Functions or external service

## Alternative: Deploy to Vercel

For full Next.js features (API routes, cron jobs):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then redeploy
vercel --prod
```

Vercel supports all Next.js features including:
- API routes (`/api/*`)
- Cron jobs (via `vercel.json`)
- Server-side rendering
- Incremental static regeneration

