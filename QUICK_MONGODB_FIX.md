# 🚀 Quick MongoDB Setup

## Current Status
MongoDB is **disconnected** - submissions are not being saved.

## Quick Solutions

### Option 1: MongoDB Atlas (Cloud - Easiest, 5 minutes)

1. **Sign up for free MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Create database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `codesense`
   - Password: Create a strong password (save it!)
   - Click "Add User"

4. **Whitelist your IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP

5. **Get connection string:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://codesense:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update server/.env:**
   ```
   MONGODB_URI=mongodb+srv://codesense:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/codesense?retryWrites=true&w=majority
   ```
   Replace `YOUR_PASSWORD` with the password you created.

7. **Restart backend server**

### Option 2: Install Local MongoDB (Windows)

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Download and install

2. **Start MongoDB:**
   ```powershell
   # MongoDB should start automatically as a Windows service
   # Check if it's running:
   Get-Service MongoDB
   
   # If not running, start it:
   net start MongoDB
   ```

3. **Verify connection:**
   ```powershell
   mongosh
   # Should connect successfully
   ```

4. **Restart backend server**

### Option 3: Use Docker (If you have Docker installed)

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then restart your backend server.

## Verify Connection

After setup, check:
```bash
curl http://localhost:5001/api/health
```

Should show:
```json
{
  "mongodb": {
    "connected": true
  }
}
```

## Test Saving

1. Restart backend server
2. Analyze some code
3. You should see: "Analysis complete and saved!"
4. Check History - your submission should appear!

## Current .env Setting

Your current `server/.env` has:
```
MONGODB_URI=mongodb://localhost:27017/codesense
```

This works for **local MongoDB**. If using **MongoDB Atlas**, replace with the Atlas connection string.

