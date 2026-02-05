# 🔥 Firebase Authentication Setup Guide

## ✅ What's Been Done

1. ✅ Firebase SDK installed in client
2. ✅ Firebase Admin SDK installed in server  
3. ✅ AuthContext updated to use Firebase Authentication
4. ✅ Backend middleware updated to verify Firebase tokens
5. ✅ User model updated to use Firebase UIDs (strings)

## 📋 Next Steps - REQUIRED

### Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mini** (ID: mini-fef00)
3. Click ⚙️ (Settings) → **Project settings**
4. Scroll to **"Your apps"** section
5. If no web app exists, click **"Add app"** → Select **Web** icon (</>)
6. Register your app (name it "CodeSense Web")
7. Copy the **config values** shown

### Step 2: Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"** (if first time)
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable** the first toggle (Email/Password)
6. Click **"Save"**

### Step 3: Configure Client (.env file)

Create/update `client/.env`:

```env
VITE_FIREBASE_API_KEY=AIza... (from Firebase Console)
VITE_FIREBASE_AUTH_DOMAIN=mini-fef00.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mini-fef00
VITE_FIREBASE_STORAGE_BUCKET=mini-fef00.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=... (from Firebase Console)
VITE_FIREBASE_APP_ID=... (from Firebase Console)
```

### Step 4: Configure Server (.env file)

Update `server/.env` and add:

```env
FIREBASE_PROJECT_ID=mini-fef00
FIREBASE_API_KEY=AIza... (same as client - from Firebase Console)
```

**Important:** The `FIREBASE_API_KEY` is the same value you use in the client.

### Step 5: Restart Servers

```bash
# Stop current servers (Ctrl+C)
# Then restart:

# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm start
```

## 🧪 Testing

1. Open http://localhost:5173
2. Click **"Sign up"**
3. Enter:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
4. Click **"Sign up"**
5. You should see: ✅ "Registration successful!"

## 🔍 Troubleshooting

### "Registration failed" Error

**Check:**
- ✅ Email/Password auth is enabled in Firebase Console
- ✅ `.env` file in `client/` has correct `VITE_FIREBASE_API_KEY`
- ✅ Firebase project ID matches: `mini-fef00`
- ✅ Restarted the frontend after adding `.env`

### "Invalid token" Error

**Check:**
- ✅ `FIREBASE_API_KEY` is set in `server/.env`
- ✅ Same API key in both client and server `.env` files
- ✅ Restarted the backend after adding `.env`

### Still Not Working?

1. Check browser console (F12) for errors
2. Check server terminal for errors
3. Verify Firebase Console → Authentication → Users (should show new users)

## 📝 Notes

- Firebase Authentication is now fully integrated
- Users are stored in Firebase (not MongoDB)
- Code submissions still use MongoDB with Firebase UID as userId
- No need for backend user registration/login routes anymore
- All auth is handled by Firebase

## 🎉 Success!

Once configured, you can:
- ✅ Register new users
- ✅ Login with email/password
- ✅ Secure API endpoints with Firebase tokens
- ✅ All authentication handled by Firebase

