# 🔥 Firebase Authentication Error Fix: auth/invalid-credential

## Error: `Firebase: Error (auth/invalid-credential)`

This error occurs when:
1. ❌ Wrong email/password combination
2. ❌ Email/Password authentication not enabled in Firebase Console
3. ❌ User doesn't exist (if trying to login)
4. ❌ Incorrect Firebase configuration

## ✅ Step-by-Step Fix

### Step 1: Enable Email/Password Authentication in Firebase Console

**This is the most common cause!**

1. Go to: https://console.firebase.google.com/
2. Select your project: **mini** (Project ID: mini-fef00)
3. Click **"Authentication"** in the left sidebar
4. If you see "Get started", click it
5. Go to **"Sign-in method"** tab
6. Click on **"Email/Password"**
7. **Enable** the first toggle (Email/Password)
8. Click **"Save"**

### Step 2: Verify Firebase Configuration

Check that your Firebase config is correct in `client/src/firebase/config.ts`:

```typescript
apiKey: 'AIzaSyBe6M35Ir1tqI2W-g76Uva5oaA7YMSdVH0'
authDomain: 'mini-fef00.firebaseapp.com'
projectId: 'mini-fef00'
```

### Step 3: Check Your Credentials

**For Login:**
- Make sure the email exists in Firebase Console → Authentication → Users
- Verify the password is correct
- If user doesn't exist, register first

**For Registration:**
- Use a valid email format (e.g., `test@example.com`)
- Password must be at least 6 characters
- Email must not already be registered

### Step 4: Clear Browser Cache

Sometimes cached credentials cause issues:

1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Clear **Local Storage** and **Session Storage**
4. Refresh the page

### Step 5: Restart Frontend Server

Environment variables load on startup:

```powershell
# Stop the frontend (Ctrl+C)
cd C:\Users\amrut\Desktop\CODE\client
npm start
```

## 🧪 Testing Steps

### Test Registration (New User)

1. Open: http://localhost:5173
2. Click **"Sign up"**
3. Enter:
   - Name: Test User
   - Email: test@example.com (use a NEW email)
   - Password: password123 (at least 6 characters)
4. Click **"Sign up"**

**Expected:** ✅ "Registration successful!" toast

### Test Login (Existing User)

1. Use an email that exists in Firebase Console
2. Enter the correct password
3. Click **"Login"**

**Expected:** ✅ "Login successful!" toast

## 🔍 Verify in Firebase Console

After registration, check:
1. Go to Firebase Console → Authentication → Users
2. You should see the new user listed
3. Verify the email matches what you registered

## 🐛 Common Issues

### Issue: "auth/operation-not-allowed"
**Solution:** Email/Password authentication is not enabled. Follow Step 1 above.

### Issue: "auth/user-not-found"
**Solution:** User doesn't exist. Register first, then login.

### Issue: "auth/wrong-password"
**Solution:** Password is incorrect. Use the correct password or reset it in Firebase Console.

### Issue: "auth/email-already-in-use"
**Solution:** Email is already registered. Use a different email or login instead.

### Issue: "auth/weak-password"
**Solution:** Password must be at least 6 characters long.

## ✅ Quick Checklist

- [ ] Email/Password authentication enabled in Firebase Console
- [ ] Firebase project ID matches: `mini-fef00`
- [ ] Using correct email/password combination
- [ ] Frontend server restarted after any changes
- [ ] Browser cache cleared
- [ ] User exists in Firebase Console (for login)

## 🚀 After Fixing

1. Restart frontend server
2. Clear browser cache
3. Try registration/login again
4. Check Firebase Console → Authentication → Users to verify user was created

## 📞 Still Not Working?

1. Check browser console (F12) for detailed error messages
2. Check Firebase Console → Authentication → Sign-in method (should show Email/Password as enabled)
3. Verify Firebase project is active and not suspended
4. Try registering with a completely new email address

