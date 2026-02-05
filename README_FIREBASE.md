# Firebase Authentication Setup

## Firebase Configuration

This project uses Firebase Authentication. You need to configure Firebase with your project credentials.

### Steps to Get Firebase Config:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mini** (Project ID: mini-fef00)
3. Click on the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select the web icon (</>)
7. Copy the Firebase configuration values

### Client Configuration

Create a `.env` file in the `client` directory with:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=mini-fef00.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mini-fef00
VITE_FIREBASE_STORAGE_BUCKET=mini-fef00.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Enable Authentication in Firebase Console

1. Go to Firebase Console > Authentication
2. Click "Get started"
3. Enable "Email/Password" authentication method
4. Save

### Backend Configuration (Optional)

For production, you can set up Firebase Admin SDK:

1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate a new private key
3. Save it as `serviceAccountKey.json` in the `server` directory
4. Add to `server/.env`:
   ```
   FIREBASE_PROJECT_ID=mini-fef00
   FIREBASE_API_KEY=your-api-key
   ```

### Testing

1. Start the backend: `cd server && npm run dev`
2. Start the frontend: `cd client && npm start`
3. Open http://localhost:5173
4. Try registering a new user - it should work with Firebase!

