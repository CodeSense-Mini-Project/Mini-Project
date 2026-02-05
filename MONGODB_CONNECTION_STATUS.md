# MongoDB Connection Status

## Current Status: ❌ DISCONNECTED

**Backend Server:** ✅ Running on port 5001  
**MongoDB:** ❌ Not connected

## Why MongoDB is Disconnected

The server is trying to connect but failing. Common reasons:

1. **No `.env` file** - MongoDB connection string not configured
2. **IP not whitelisted** - Your IP `106.206.41.93/32` not added to MongoDB Atlas
3. **Wrong connection string** - Invalid MongoDB URI in `.env`
4. **Local MongoDB not running** - If using local MongoDB, service not started

## How to Fix

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Add your IP to MongoDB Atlas:**
   - Go to: https://cloud.mongodb.com/
   - Navigate to **Network Access**
   - Add IP: `106.206.41.93/32`
   - Wait 1-2 minutes for activation

2. **Get your connection string:**
   - In MongoDB Atlas, go to **Database** → **Connect**
   - Choose **"Connect your application"**
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/codesense?retryWrites=true&w=majority`

3. **Create `server/.env` file:**
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codesense?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   GEMINI_API_KEY=your-gemini-api-key-here
   PISTON_API_URL=https://emkc.org/api/v2/piston
   CORS_ORIGIN=http://localhost:5173
   FIREBASE_PROJECT_ID=mini-fef00
   FIREBASE_API_KEY=AIzaSyBe6M35Ir1tqI2W-g76Uva5oaA7YMSdVH0
   ```

4. **Restart backend server:**
   ```powershell
   cd C:\Users\amrut\Desktop\CODE\server
   npm run dev
   ```

### Option 2: Local MongoDB

1. **Start MongoDB service:**
   ```powershell
   net start MongoDB
   ```

2. **Create `server/.env` file:**
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/codesense
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   GEMINI_API_KEY=your-gemini-api-key-here
   PISTON_API_URL=https://emkc.org/api/v2/piston
   CORS_ORIGIN=http://localhost:5173
   FIREBASE_PROJECT_ID=mini-fef00
   FIREBASE_API_KEY=AIzaSyBe6M35Ir1tqI2W-g76Uva5oaA7YMSdVH0
   ```

3. **Restart backend server:**
   ```powershell
   cd C:\Users\amrut\Desktop\CODE\server
   npm run dev
   ```

## Verify Connection

After fixing, check connection:

```powershell
Invoke-WebRequest -Uri http://localhost:5001/api/health -UseBasicParsing
```

**Expected response:**
```json
{
  "status": "ok",
  "mongodb": {
    "status": "connected",
    "connected": true
  }
}
```

## Current IP Address

**Your IP:** `106.206.41.93/32`

Make sure this IP is whitelisted in MongoDB Atlas Network Access!

