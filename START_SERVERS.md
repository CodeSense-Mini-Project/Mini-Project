# 🚀 How to Start CodeSense Application

## Step-by-Step Instructions

### Prerequisites
- Make sure you have Node.js installed
- Make sure you're in the project root directory: `C:\Users\amrut\Desktop\CODE`

---

## Method 1: Using Two Separate Terminal Windows (Recommended)

### Terminal 1 - Backend Server

1. Open **PowerShell** or **Command Prompt**
2. Navigate to the server directory:
   ```powershell
   cd C:\Users\amrut\Desktop\CODE\server
   ```
3. Start the backend server:
   ```powershell
   npm run dev
   ```
4. Wait for the message: `✅ Server running on port 5001`
5. **Keep this terminal open** - don't close it!

### Terminal 2 - Frontend Server

1. Open a **NEW** PowerShell or Command Prompt window
2. Navigate to the client directory:
   ```powershell
   cd C:\Users\amrut\Desktop\CODE\client
   ```
3. Start the frontend server:
   ```powershell
   npm start
   ```
4. Wait for the message showing the local URL (usually `http://localhost:5173`)
5. **Keep this terminal open** - don't close it!

---

## Method 2: Using One Terminal with Background Processes

### Start Both Servers

1. Open **PowerShell**
2. Navigate to project root:
   ```powershell
   cd C:\Users\amrut\Desktop\CODE
   ```
3. Start backend in background:
   ```powershell
   cd server; Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
   ```
4. Start frontend in background:
   ```powershell
   cd client; Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
   ```

---

## ✅ Verify Everything is Running

1. **Backend Health Check:**
   - Open browser: `http://localhost:5001/api/health`
   - Should show: `{"status":"ok","mongodb":{"connected":true}}`

2. **Frontend Application:**
   - Open browser: `http://localhost:5173`
   - Should see the CodeSense login page

---

## 🛑 How to Stop Servers

1. Go to each terminal window
2. Press `Ctrl + C` to stop the server
3. Repeat for both terminals

---

## 📝 Quick Reference

| Server | Directory | Command | Port | URL |
|--------|-----------|---------|------|-----|
| Backend | `server/` | `npm run dev` | 5001 | http://localhost:5001 |
| Frontend | `client/` | `npm start` | 5173 | http://localhost:5173 |

---

## ⚠️ Troubleshooting

### Port Already in Use
If you see `EADDRINUSE` error:
- Another instance is already running
- Close the previous terminal or kill the process

### MongoDB Not Connected
- Check `server/.env` has correct `MONGODB_URI`
- Verify your IP is whitelisted in MongoDB Atlas

### Frontend Can't Connect to Backend
- Make sure backend is running first
- Check `client/vite.config.ts` proxy configuration

---

## 🎉 You're All Set!

Once both servers are running:
- ✅ Login/Register at http://localhost:5173
- ✅ Use the theme toggle button (moon/sun icon)
- ✅ Analyze code and view history
- ✅ Check dashboard statistics
