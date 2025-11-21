# Quick Start with Firebase Emulators

Get Spoquen running locally in minutes using Firebase emulators (no cloud setup needed).

## Setup Steps

### 1. Install Firebase Tools

First, you need to fix your npm cache issue and install Firebase tools:

```bash
# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm

# Install Firebase CLI globally
npm install -g firebase-tools

# OR if you prefer, install locally in the project
npm install -D firebase-tools
```

### 2. Start Firebase Emulators

Open a terminal and run:

```bash
cd /Users/chasedavis/spoquen
firebase emulators:start
```

You should see:
```
✔  All emulators ready! It is now safe to connect your app.
┌─────────────┬────────────────┬─────────────────────────────────┐
│ Emulator    │ Host:Port      │ View in Emulator UI             │
├─────────────┼────────────────┼─────────────────────────────────┤
│ Auth        │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
│ Firestore   │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore │
│ Storage     │ 127.0.0.1:9199 │ http://127.0.0.1:4000/storage   │
└─────────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub running at 127.0.0.1:4400
  Other reserved ports: 4500, 9150
```

**Keep this terminal running!**

### 3. Start Next.js Development Server

Open a **new terminal** and run:

```bash
cd /Users/chasedavis/spoquen
npm run dev
```

You should see:
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
```

### 4. Open the App

Go to: **http://localhost:3000**

## First Time Usage

### Create an Account

1. Click "Get Started"
2. Sign up with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`

### Create a Daily Prompt

1. Go to: **http://localhost:3000/admin**
2. Enter a prompt like: "What made you smile today?"
3. Click "Create Prompt"

### Record Your First Spoque

1. Go to: **http://localhost:3000/record**
2. Click the microphone button (allow mic access)
3. Speak for up to 20 seconds
4. Click stop
5. Preview your recording
6. Add a caption (optional)
7. Click "Post Spoque"

### View the Feed

Go to: **http://localhost:3000/feed**

Your Spoque will autoplay!

## Emulator UI

Check out the Firebase Emulator UI at: **http://localhost:4000**

Here you can:
- View all users (Auth tab)
- Browse Firestore data (Firestore tab)
- See uploaded audio files (Storage tab)

## Tips

### Saving Emulator Data

To save your emulator data between sessions:

```bash
# Export data
firebase emulators:export ./emulator-data

# Next time, import it
firebase emulators:start --import=./emulator-data
```

### Reset Everything

Stop the emulators (Ctrl+C) and start fresh:

```bash
rm -rf emulator-data
firebase emulators:start
```

### Create Multiple Test Users

You can create as many test accounts as you want. Just use different emails:
- user1@test.com
- user2@test.com
- etc.

### Test Different Prompts

Go to `/admin` to create prompts for today or future dates. The app will automatically show the right prompt based on the date.

## Troubleshooting

### "Failed to connect to emulators"

Make sure Firebase emulators are running:
```bash
firebase emulators:start
```

### "Port already in use"

Another process is using the port. Kill it or change ports in `firebase.json`.

### Audio recording not working

- Make sure you're using Chrome, Firefox, or Safari
- Allow microphone permissions when prompted
- Check if your mic is working in system settings

### npm cache issues

If you see permission errors:
```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
```

## What's Running?

When everything is working, you should have **2 terminals**:

**Terminal 1:** Firebase Emulators
```
firebase emulators:start
```

**Terminal 2:** Next.js Dev Server
```
npm run dev
```

## Quick Reference

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| Emulator UI | http://localhost:4000 |
| Auth Emulator | http://127.0.0.1:9099 |
| Firestore Emulator | http://127.0.0.1:8080 |
| Storage Emulator | http://127.0.0.1:9199 |

## Next Steps

Once you're ready to deploy to production:

1. Create a real Firebase project
2. Update `.env.local` with real credentials
3. Deploy Firestore rules and indexes
4. Deploy to Vercel

See `SETUP.md` for full production setup instructions.

---

**Happy coding! 🎉**

Start recording those Spoques!

