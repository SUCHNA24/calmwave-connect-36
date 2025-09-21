# Google OAuth Setup Guide for CalmWave Connect

## Why Google Sign-In Isn't Working

Google OAuth is not configured in your Supabase project. Here's how to fix it:

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click "Select a project" → "New Project"
   - Name: "CalmWave Connect" (or any name you prefer)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "CalmWave Connect Web"

5. **Configure Authorized URLs**
   - **Authorized JavaScript origins:**
     - `http://localhost:8080` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs:**
     - `https://wmpwxcxlbyfeyidxtewn.supabase.co/auth/v1/callback`

6. **Copy Your Credentials**
   - Copy the **Client ID** and **Client Secret**
   - Keep these safe - you'll need them for Supabase

## Step 2: Configure Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in and select your project

2. **Navigate to Authentication**
   - Go to "Authentication" → "Providers"
   - Find "Google" in the list

3. **Enable Google Provider**
   - Toggle "Enable sign in with Google" to ON
   - **Client ID**: Paste your Google Client ID
   - **Client Secret**: Paste your Google Client Secret
   - **Redirect URL**: Should auto-populate as:
     `https://wmpwxcxlbyfeyidxtewn.supabase.co/auth/v1/callback`

4. **Save Configuration**
   - Click "Save" at the bottom

## Step 3: Test Google Sign-In

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Test the sign-in**
   - Go to http://localhost:8080/auth
   - Click "Continue with Google"
   - You should be redirected to Google's sign-in page

## Alternative: Use Email Sign-In Only

If you prefer not to set up Google OAuth, you can:

1. **Remove Google sign-in button** from the AuthPage
2. **Use only email/password authentication**
3. **The app will work perfectly with email sign-in**

## Troubleshooting

### Common Issues:

1. **"Google sign-in is not configured"**
   - Google OAuth is not enabled in Supabase
   - Follow Step 2 above

2. **"Invalid redirect URI"**
   - Check that your redirect URI in Google Console matches exactly:
   - `https://wmpwxcxlbyfeyidxtewn.supabase.co/auth/v1/callback`

3. **"Client ID not found"**
   - Double-check your Google Client ID in Supabase
   - Make sure there are no extra spaces

4. **"Access blocked"**
   - Your app might be in testing mode
   - Add your email to test users in Google Console
   - Or publish your app (requires verification)

## Current Status

✅ **Email Sign-In**: Working perfectly  
❌ **Google Sign-In**: Needs OAuth configuration  
✅ **AI Chat**: Working with Gemini API  
✅ **Data Storage**: Working with Supabase  

## Quick Fix

For now, you can use **email sign-in** which works perfectly:

1. Go to http://localhost:8080/auth
2. Use the "Sign In" or "Sign Up" tabs
3. Enter your email and password
4. All features will work the same way

The Google sign-in is just a convenience feature - email sign-in provides the same functionality!
