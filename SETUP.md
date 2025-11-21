# Spoquen Setup Guide

This guide will walk you through setting up Spoquen from scratch.

## Prerequisites

- Node.js 18+ installed
- A Firebase account
- A code editor (VS Code recommended)
- Basic familiarity with Terminal/Command Prompt

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd spoquen
npm install
```

This will install all required packages including Next.js, Firebase, and UI components.

### Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: "spoquen" (or your preferred name)
4. Disable Google Analytics (not needed for MVP)
5. Click "Create project"

### Step 3: Enable Firebase Authentication

1. In Firebase Console, click "Authentication" in sidebar
2. Click "Get started"
3. Click "Sign-in method" tab
4. Enable "Email/Password":
   - Toggle "Email/Password" to Enabled
   - Toggle "Email link (passwordless sign-in)" to Enabled
   - Click "Save"

### Step 4: Create Firestore Database

1. Click "Firestore Database" in sidebar
2. Click "Create database"
3. Select "Start in test mode" (we'll add security rules later)
4. Choose your region (select closest to your users)
5. Click "Enable"

### Step 5: Enable Firebase Storage

1. Click "Storage" in sidebar
2. Click "Get started"
3. Click "Next" (keep default rules for now)
4. Choose same region as Firestore
5. Click "Done"

### Step 6: Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Enter app nickname: "spoquen-web"
6. **Don't check** "Firebase Hosting"
7. Click "Register app"
8. Copy the config values (you'll need these next)

### Step 7: Create Environment Variables

1. In your project folder, create a file named `.env.local`
2. Copy this template and fill in your Firebase values:

```env
# Firebase Configuration (get these from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Secret (make up a random string)
CRON_SECRET=your-random-secret-12345
```

**Important**: 
- Replace all values with your actual Firebase config
- For `CRON_SECRET`, use any random string (e.g., `my-secret-key-xyz-789`)
- Never commit `.env.local` to git

### Step 8: Update Firestore Security Rules

1. Go to Firestore Database in Firebase Console
2. Click "Rules" tab
3. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Prompts collection
    match /prompts/{promptId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Spoques collection
    match /spoques/{spoqueId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

4. Click "Publish"

### Step 9: Update Storage Security Rules

1. Go to Storage in Firebase Console
2. Click "Rules" tab
3. Replace the content with:

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

4. Click "Publish"

### Step 10: Run the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

### Step 11: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Get Started"
3. Create an account with:
   - Username: testuser
   - Email: test@example.com
   - Password: password123

4. You should be redirected to the feed

### Step 12: Create Your First Prompt

1. Go to http://localhost:3000/admin
2. Enter a prompt like: "What made you smile today?"
3. Click "Create Prompt"

### Step 13: Record Your First Spoque

1. Go to http://localhost:3000/record
2. Click the microphone button
3. Allow microphone access when prompted
4. Speak for up to 20 seconds
5. Click the stop button
6. Click play to preview
7. Add a caption (optional)
8. Click "Post Spoque"

### Step 14: View the Feed

1. Go to http://localhost:3000/feed
2. You should see your Spoque
3. It will autoplay automatically

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/spoquen.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (leave default)
   - Output Directory: (leave default)

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your `.env.local` file
   - **Important**: Update `NEXT_PUBLIC_APP_URL` to your Vercel URL

6. Click "Deploy"

### Step 3: Update Firebase Auth Domain

1. After deployment, copy your Vercel URL (e.g., `spoquen.vercel.app`)
2. Go to Firebase Console > Authentication > Settings
3. Add your Vercel domain to "Authorized domains"

### Step 4: Test Production

Visit your Vercel URL and test:
- ✅ Sign up works
- ✅ Sign in works
- ✅ Recording works (requires HTTPS)
- ✅ Feed works
- ✅ Profiles work

## Troubleshooting

### "Firebase config not found"
- Make sure `.env.local` exists
- Check all environment variables are set
- Restart the dev server: `npm run dev`

### "Permission denied" in Firestore
- Check your Firestore security rules
- Make sure you're signed in
- Verify the rules were published

### "Microphone not working"
- Check browser permissions
- Production requires HTTPS
- Try a different browser

### "Audio upload fails"
- Check Storage security rules
- Verify Storage is enabled in Firebase
- Check browser console for specific error

## Next Steps

Now that your app is running:

1. **Customize branding**: Update colors in `tailwind.config.ts`
2. **Add more prompts**: Use the admin panel
3. **Invite beta users**: Share your Vercel URL
4. **Monitor usage**: Check Firebase Console for analytics

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Vercel Documentation](https://vercel.com/docs)

## Common Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Check TypeScript errors
npm run type-check

# Deploy to Vercel
vercel
```

---

**You're all set! 🎉**

Your Spoquen MVP is now running. Time to start sharing those daily audio thoughts!

