#!/bin/bash

# Firebase App Hosting Secrets Setup
# Run this script to create all required secrets

# Get values from .env.local
source .env.local

# Create secrets
echo "Creating Firebase secrets..."

firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY "$NEXT_PUBLIC_FIREBASE_API_KEY"
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_PROJECT_ID "$NEXT_PUBLIC_FIREBASE_PROJECT_ID"
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET "$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID "$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_APP_ID "$NEXT_PUBLIC_FIREBASE_APP_ID"
firebase apphosting:secrets:set NEXT_PUBLIC_APP_URL "$NEXT_PUBLIC_APP_URL"
firebase apphosting:secrets:set CRON_SECRET "$CRON_SECRET"

echo "✅ All secrets created!"

