# CodeSense - AI-Powered Code Analysis Platform

A full-stack web application that provides multi-language code submission, static analysis, AI-driven feedback, and comprehensive code quality evaluation using Google's Gemini API.

## 🚀 Features

### Core Functionality
- **Multi-Language Support**: Python, C, C++, Java, and JavaScript
- **Static Code Analysis**: Automated detection of syntax errors, warnings, and code quality issues
- **AI-Powered Feedback**: Contextual insights using Google Gemini API for:
  - Performance optimizations
  - Code readability improvements
  - Best practice recommendations
  - Complexity analysis
- **Code Execution**: Run code safely using Piston API
- **User Dashboard**: Track progress, view statistics, and monitor improvement over time
- **Submission History**: Access and review all previous code analyses

### Technical Highlights
- **Frontend**: React + TypeScript with Monaco Editor for code editing
- **Backend**: Node.js + Express with TypeScript
- **Database**: MongoDB for user data and submission history
- **Authentication**: JWT-based secure authentication
- **Real-time Analysis**: Parallel processing of static analysis and AI evaluation

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codesense
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**

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

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev

   # Or run separately:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 5173
   ```

## 📁 Project Structure

```
codesense/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── index.ts        # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Code Analysis
- `POST /api/code/analyze` - Analyze code (requires authentication)
- `GET /api/code/history` - Get submission history
- `GET /api/code/submission/:id` - Get specific submission
- `GET /api/code/stats` - Get user statistics

### User
- `GET /api/user/profile` - Get current user profile

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Write Code**: Use the Monaco editor to write or paste your code
3. **Select Language**: Choose from Python, C, C++, Java, or JavaScript
4. **Analyze**: Click "Analyze" to get:
   - Static analysis results
   - AI-powered feedback
   - Code quality score
   - Optimization suggestions
5. **View History**: Track your progress in the History page
6. **Monitor Dashboard**: View statistics and performance trends

## 🔧 Configuration

### Gemini API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `server/.env` as `GEMINI_API_KEY`

### MongoDB Setup
- **Local**: Install MongoDB and run `mongod`
- **Cloud**: Use MongoDB Atlas and update `MONGODB_URI` in `.env`

## 🚧 Future Enhancements

- [ ] Test case generation
- [ ] Leaderboard system
- [ ] Plagiarism detection
- [ ] GitHub integration
- [ ] Classroom/team features
- [ ] Advanced code metrics
- [ ] Export reports (PDF/JSON)
- [ ] Real-time collaboration

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI






