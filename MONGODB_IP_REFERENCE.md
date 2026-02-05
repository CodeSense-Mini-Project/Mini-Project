# MongoDB Atlas IP Whitelist Reference

## Your Current IP Address
**IP Address:** `106.206.41.93/32`

## How to Add to MongoDB Atlas

1. Log in to MongoDB Atlas: https://cloud.mongodb.com/
2. Navigate to **Network Access** (Security → Network Access)
3. Click **Add IP Address**
4. Enter: `106.206.41.93/32`
5. Add comment: "CodeSense Development"
6. Click **Confirm**
7. Wait 1-2 minutes for activation

## Alternative: Allow from Anywhere (Development Only)
- Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
- ⚠️ Only use for development, not production!

## After Adding IP

1. Restart backend server:
   ```powershell
   cd C:\Users\amrut\Desktop\CODE\server
   npm run dev
   ```

2. Verify connection:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:5001/api/health -UseBasicParsing
   ```

3. Check MongoDB status in response:
   ```json
   {
     "mongodb": {
       "connected": true
     }
   }
   ```

## Current IP Status
- ✅ IP Address: 106.206.41.93/32
- ⏳ Add this to MongoDB Atlas Network Access
- ⏳ Restart server after adding

