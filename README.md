# Spoquen - Daily Audio Social App

A clean, focused MVP for a daily audio-only social app. Users record one 20-second audio clip per day in response to a global daily prompt.

## Features

- ✅ Email authentication (password & magic link)
- ✅ Daily prompt system with admin panel
- ✅ Browser-based audio recording (20-second limit)
- ✅ Autoplay feed (today's posts only)
- ✅ Like and share functionality
- ✅ User profiles with archive
- ✅ Shareable public pages for each Spoque
- ✅ Automatic daily feed rotation
- ✅ Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Audio**: Web Audio API (MediaRecorder)
- **Deployment**: Vercel (with cron jobs)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Vercel account (for deployment)

### 1. Clone and Install

```bash
cd spoquen
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Email link (passwordless sign-in)"

3. Create Firestore Database:
   - Go to Firestore Database > Create database
   - Start in **test mode** (you'll update rules later)
   - Choose a region close to your users

4. Set up Storage:
   - Go to Storage > Get started
   - Start in **test mode** (you'll update rules later)

5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and click "Web" icon
   - Copy the config values

6. Create `.env.local` file in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Job Secret (generate a random string)
CRON_SECRET=your-random-secret-here
```

### 3. Firestore Security Rules

In Firebase Console > Firestore Database > Rules, update to:

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

### 4. Storage Security Rules

In Firebase Console > Storage > Rules, update to:

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

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First-Time Setup

1. Create an account at `/auth/signup`
2. Go to `/admin` to create the first daily prompt
3. Record your first Spoque at `/record`
4. View the feed at `/feed`

### Daily Workflow

1. Admin sets tomorrow's prompt via `/admin`
2. Users see the new prompt when they log in
3. Each user can record one 20-second Spoque per day
4. Feed shows only today's Spoques in autoplay mode
5. Feed automatically resets at midnight (UTC)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project to Vercel:
   ```bash
   npm i -g vercel
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - Add all variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel URL

4. The `vercel.json` file configures a cron job that runs at midnight UTC
   - This can be used for maintenance tasks
   - The feed naturally resets via date-based queries

### Cron Job Setup

The cron job at `/api/cron/rotate-feed` runs automatically on Vercel. To test it manually:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-app.vercel.app/api/cron/rotate-feed
```

## Project Structure

```
spoquen/
├── app/
│   ├── (pages)
│   │   ├── page.tsx           # Landing page
│   │   ├── feed/              # Main feed
│   │   ├── record/            # Recording interface
│   │   ├── profile/           # User profiles
│   │   ├── spoque/[id]/       # Shareable Spoque pages
│   │   ├── auth/              # Sign in/up
│   │   ├── admin/             # Admin panel
│   │   └── settings/          # User settings
│   └── api/
│       └── cron/              # Cron job endpoints
├── components/
│   ├── auth/                  # Auth components
│   ├── feed/                  # Feed components
│   ├── recorder/              # Audio recorder
│   └── layout/                # Layout components
├── contexts/
│   └── AuthContext.tsx        # Auth state management
├── hooks/
│   └── useAudioRecorder.ts    # Audio recording hook
└── lib/
    ├── firebase.ts            # Firebase config
    ├── api.ts                 # API functions
    └── types.ts               # TypeScript types
```

## Key Components

### Audio Recording
- Uses Web Audio API's MediaRecorder
- Hard limit of 20 seconds
- No editing or retakes (one take only)
- Uploads to Firebase Storage as WebM format

### Feed System
- Queries Firestore for today's Spoques only
- Autoplay: moves to next Spoque after playback
- Like/share functionality
- Real-time updates

### Authentication
- Email/password sign in
- Magic link (passwordless) sign in
- Profile creation with username
- Optional profile photo

### Admin Panel
- Create daily prompts
- Schedule prompts for future dates
- View current prompt status

## API Endpoints

### `/api/cron/rotate-feed`
- Method: GET
- Auth: Bearer token (CRON_SECRET)
- Purpose: Daily maintenance (called by Vercel Cron)

## Firestore Collections

### `users`
```typescript
{
  email: string
  username: string
  displayName: string
  photoURL: string | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

### `prompts`
```typescript
{
  prompt: string
  date: string          // YYYY-MM-DD
  createdAt: timestamp
  createdBy: string     // user ID
}
```

### `spoques`
```typescript
{
  userId: string
  username: string
  userPhotoURL: string | null
  audioURL: string
  caption: string | null
  promptId: string
  promptText: string
  date: string          // YYYY-MM-DD
  likes: number
  likedBy: string[]     // array of user IDs
  createdAt: timestamp
}
```

## Browser Compatibility

- Chrome/Edge: Full support
- Safari: Full support (iOS 14.3+)
- Firefox: Full support

**Note**: Microphone access requires HTTPS in production.

## Future Enhancements

Potential features to add (not in MVP):
- Push notifications for new prompts
- Follow/followers system
- Comments on Spoques
- Discover page
- Trending Spoques
- Email digests
- Mobile apps (React Native)

## Troubleshooting

### Audio not recording
- Check browser permissions for microphone
- Ensure HTTPS in production
- Try a different browser

### Authentication errors
- Verify Firebase config in `.env.local`
- Check Firebase Authentication is enabled
- Ensure email/password provider is active

### Upload failures
- Check Firebase Storage rules
- Verify Storage bucket name in config
- Check file size limits

## Support

For issues or questions:
1. Check Firebase console for errors
2. Review browser console for client errors
3. Check Vercel logs for server errors

## License

MIT License - feel free to use for your own projects!

---

Built with ❤️ using Next.js, TypeScript, and Firebase
