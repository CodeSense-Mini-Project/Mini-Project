# 🗄️ MongoDB Setup Guide

## Why MongoDB is Needed

MongoDB is required to:
- ✅ Save your code analysis submissions
- ✅ View submission history
- ✅ See statistics on the dashboard
- ✅ Access previous analyses

**Without MongoDB:** Analysis works, but submissions are not saved.

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0 - Free tier)
4. Get your connection string
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codesense
   ```

### Option 2: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   ```powershell
   # MongoDB should start automatically as a Windows service
   # Or start manually:
   net start MongoDB
   ```
4. Verify it's running:
   ```powershell
   mongosh
   # Should connect successfully
   ```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Verify MongoDB Connection

### Check Health Endpoint

```bash
curl http://localhost:5001/api/health
```

**Response should show:**
```json
{
  "status": "ok",
  "mongodb": {
    "status": "connected",
    "connected": true
  }
}
```

### Check Server Logs

When you start the server, you should see:
```
Connected to MongoDB
```

If you see:
```
MongoDB connection error (server will continue without database)
```
Then MongoDB is not running or connection string is wrong.

## Current Status

**Check MongoDB status:**
- Visit: http://localhost:5001/api/health
- Look for `mongodb.connected: true/false`

## Troubleshooting

### "MongoDB not connected" in logs

1. **Check if MongoDB is running:**
   ```powershell
   # Windows
   Get-Service MongoDB
   
   # Or check if process is running
   Get-Process | Where-Object {$_.ProcessName -like "*mongo*"}
   ```

2. **Check connection string in `server/.env`:**
   ```
   MONGODB_URI=mongodb://localhost:27017/codesense
   ```

3. **Try connecting manually:**
   ```bash
   mongosh mongodb://localhost:27017/codesense
   ```

### Connection String Issues

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/codesense
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codesense?retryWrites=true&w=majority
```

### Firewall Issues

If using local MongoDB:
- Make sure port 27017 is not blocked
- Check Windows Firewall settings

## After MongoDB is Connected

1. **Restart the backend server**
2. **Analyze some code** - you should see "Analysis complete and saved!"
3. **Check History page** - your submissions should appear
4. **Check Dashboard** - statistics should update

## What You'll See

### When MongoDB is Connected:
- ✅ Toast: "Analysis complete and saved!"
- ✅ Submissions appear in History
- ✅ Dashboard shows statistics
- ✅ Health endpoint shows `mongodb.connected: true`

### When MongoDB is NOT Connected:
- ⚠️ Toast: "Analysis complete! (Not saved - MongoDB not connected)"
- ⚠️ History shows "No submissions yet"
- ⚠️ Dashboard shows 0 submissions
- ⚠️ Health endpoint shows `mongodb.connected: false`

## Quick Test

1. Start MongoDB (if local)
2. Restart backend server
3. Analyze code
4. Check History - should see your submission!

