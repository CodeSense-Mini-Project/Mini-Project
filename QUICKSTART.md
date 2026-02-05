# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed
- ✅ MongoDB running (local or Atlas)
- ✅ Google Gemini API key

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm run install-all
```

This installs dependencies for:
- Root project (concurrently for running both servers)
- Backend server
- Frontend client

### 2. Configure Environment

Create `server/.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codesense
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key-here
PISTON_API_URL=https://emkc.org/api/v2/piston
CORS_ORIGIN=http://localhost:5173
```

**Important**: 
- Replace `JWT_SECRET` with a strong random string
- Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- For MongoDB Atlas, use connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/codesense`

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- No local setup needed
- Use your Atlas connection string in `.env`

### 4. Run the Application

**Development Mode (Recommended):**
```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend client on `http://localhost:5173`

**Or run separately:**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 5. Access the Application

1. Open browser: `http://localhost:5173`
2. Register a new account
3. Start analyzing code!

## First Code Analysis

1. Navigate to **Editor** page
2. Select a language (Python, JavaScript, C, C++, Java)
3. Write or paste your code
4. Optionally check "Execute Code" to run it
5. Click **Analyze**
6. View results:
   - Overall score
   - Static analysis findings
   - AI-powered feedback
   - Execution results (if enabled)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity for Atlas

### Gemini API Error
- Verify `GEMINI_API_KEY` is correct
- Check API quota/limits
- Ensure internet connection

### Port Already in Use
- Change `PORT` in `server/.env`
- Update `CORS_ORIGIN` if port changes
- Kill process using the port

### Build Errors
- Delete `node_modules` and reinstall
- Clear cache: `npm cache clean --force`
- Check Node.js version: `node --version` (should be 18+)

## Next Steps

- Explore the **Dashboard** for statistics
- Check **History** to review past submissions
- Try different languages and code samples
- Experiment with code execution feature

## Getting Help

- Check `README.md` for detailed documentation
- Review `ARCHITECTURE.md` for system design
- Check server logs for errors
- Verify all environment variables are set

Happy coding! 🚀






