# 🔄 Server Restart Commands

## Quick Restart (PowerShell)

### Stop All Servers
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

### Start Backend Server
```powershell
cd server
npm run dev
```

### Start Frontend Server (New Terminal)
```powershell
cd client
npm start
```

---

## Step-by-Step Restart

### 1. Stop All Node Processes
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

### 2. Start Backend (Terminal 1)
```powershell
cd C:\Users\amrut\Desktop\CODE\server
npm run dev
```

**Expected output:**
```
Server running on port 5001
Connected to MongoDB
```

### 3. Start Frontend (Terminal 2)
```powershell
cd C:\Users\amrut\Desktop\CODE\client
npm start
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## One-Line Commands

### Restart Backend Only
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force; cd server; npm run dev
```

### Restart Frontend Only
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force; cd client; npm start
```

### Restart Both (Backend First)
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force; Start-Sleep -Seconds 2; cd server; Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"; Start-Sleep -Seconds 3; cd client; Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
```

---

## Verify Servers Are Running

### Check Backend
```powershell
Invoke-WebRequest -Uri http://localhost:5001/api/health -UseBasicParsing
```

### Check Frontend
```powershell
Invoke-WebRequest -Uri http://localhost:5173 -UseBasicParsing
```

### Check MongoDB Connection
```powershell
$response = Invoke-WebRequest -Uri http://localhost:5001/api/health -UseBasicParsing
$health = $response.Content | ConvertFrom-Json
Write-Host "MongoDB Connected: $($health.mongodb.connected)"
```

---

## Manual Restart (Recommended)

**Open 2 separate terminal windows:**

**Terminal 1 - Backend:**
```powershell
cd C:\Users\amrut\Desktop\CODE\server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\amrut\Desktop\CODE\client
npm start
```

---

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 5001
netstat -ano | findstr :5001

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Same for port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Check if Servers Are Running
```powershell
# Check node processes
Get-Process | Where-Object {$_.ProcessName -eq "node"}

# Check ports
netstat -ano | findstr ":5001 :5173"
```

