# CodeSense Architecture Documentation

## System Overview

CodeSense is a full-stack web application designed for multi-language code analysis using AI-powered feedback. The system follows a modern, scalable architecture with clear separation of concerns.

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Monaco Editor** - Code editor (VS Code editor)
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Winston** - Logging

### External Services
- **Google Gemini API** - AI code analysis
- **Piston API** - Code execution engine

## Architecture Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (React Components & Pages)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Application Layer            │
│    (Context, State Management)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         API Layer                    │
│    (Express Routes & Middleware)     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Service Layer               │
│  (Business Logic & External APIs)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Data Layer                  │
│    (MongoDB & Mongoose Models)      │
└─────────────────────────────────────┘
```

### 2. Service-Oriented Design

The backend is organized into independent services:

- **StaticAnalyzer**: Performs static code analysis
- **GeminiService**: Handles AI-powered code review
- **PistonService**: Executes code safely
- **CodeAnalyzer**: Orchestrates all analysis services

### 3. RESTful API Design

All endpoints follow REST conventions:
- `POST /api/auth/*` - Authentication
- `POST /api/code/analyze` - Code analysis
- `GET /api/code/history` - Submission history
- `GET /api/code/stats` - User statistics

## Data Flow

### Code Analysis Flow

```
User Input (Code + Language)
    ↓
[Frontend: Monaco Editor]
    ↓
POST /api/code/analyze
    ↓
[Backend: Authentication Middleware]
    ↓
[CodeAnalyzer Service]
    ├─→ [StaticAnalyzer] → Syntax/Logic Errors
    ├─→ [GeminiService] → AI Feedback
    └─→ [PistonService] → Code Execution (optional)
    ↓
[Merge Results & Calculate Score]
    ↓
[Save to MongoDB]
    ↓
[Return Unified JSON Response]
    ↓
[Frontend: Display Results]
```

## Database Schema

### User Model
```typescript
{
  email: string (unique, indexed)
  password: string (hashed)
  name: string
  createdAt: Date
  updatedAt: Date
}
```

### CodeSubmission Model
```typescript
{
  userId: ObjectId (indexed, ref: User)
  language: string (enum: python, c, cpp, java, javascript)
  code: string
  analysis: {
    staticAnalysis: {
      errors: Array<Error>
      warnings: number
      errors: number
    }
    aiAnalysis: {
      feedback: string
      optimizationHints: string[]
      readabilityScore: number
      complexityScore: number
      suggestions: Array<Suggestion>
    }
    execution?: {
      output?: string
      error?: string
      executionTime?: number
    }
    overallScore: number
  }
  createdAt: Date
}
```

## Security Features

1. **Authentication**
   - JWT-based token authentication
   - Password hashing with bcrypt (10 rounds)
   - Token expiration (7 days)

2. **Authorization**
   - Protected routes with authentication middleware
   - User-specific data access (users can only see their submissions)

3. **Input Validation**
   - Express-validator for request validation
   - Type checking with TypeScript
   - Code length limits

4. **Error Handling**
   - Centralized error handler
   - Structured error responses
   - Logging for debugging

## Performance Optimizations

1. **Parallel Processing**
   - Static analysis and AI analysis run in parallel
   - Code execution runs concurrently when enabled

2. **Database Indexing**
   - User ID indexed for fast queries
   - Compound indexes for common query patterns

3. **Caching Opportunities**
   - API responses could be cached (future enhancement)
   - Static analysis results could be memoized

## Scalability Considerations

### Current Limitations
- Single server instance
- No load balancing
- No caching layer
- Synchronous AI API calls

### Future Enhancements
- **Horizontal Scaling**: Add load balancer, multiple server instances
- **Caching**: Redis for frequently accessed data
- **Queue System**: Bull/Redis for async job processing
- **CDN**: For static assets
- **Database Sharding**: For large-scale deployments

## API Rate Limiting (Future)

Consider implementing:
- Per-user rate limits
- Per-IP rate limits
- API key-based rate limits for external integrations

## Monitoring & Logging

### Current Implementation
- Winston logger for server-side logging
- Error tracking in error handler
- Console logging in development

### Recommended Additions
- Application Performance Monitoring (APM)
- Error tracking service (Sentry)
- Analytics for user behavior
- Performance metrics dashboard

## Testing Strategy (Future)

### Unit Tests
- Service layer functions
- Utility functions
- Model validations

### Integration Tests
- API endpoints
- Database operations
- External API integrations

### E2E Tests
- User workflows
- Authentication flows
- Code analysis flows

## Deployment Considerations

### Environment Variables
- Production vs Development configurations
- Secure secret management
- API key rotation strategy

### Docker Support (Future)
```dockerfile
# Multi-stage build for optimization
# Separate containers for frontend/backend
# MongoDB container or external service
```

### CI/CD Pipeline (Future)
- Automated testing
- Build and deployment
- Environment-specific deployments

## Code Quality

### TypeScript
- Strict mode enabled
- Type safety throughout
- Interface definitions for all data structures

### Code Organization
- Feature-based folder structure
- Separation of concerns
- Reusable components

### Best Practices
- Error handling at all levels
- Input validation
- Security-first approach
- Clean code principles

## Future Enhancements

1. **Real-time Features**
   - WebSocket for live analysis updates
   - Collaborative editing

2. **Advanced Analysis**
   - Security vulnerability scanning
   - Performance profiling
   - Code complexity metrics

3. **Educational Features**
   - Learning paths
   - Code challenges
   - Peer review system

4. **Integration**
   - GitHub integration
   - IDE plugins
   - CI/CD pipeline integration

5. **Analytics**
   - Advanced dashboards
   - Trend analysis
   - Comparative analytics

---

This architecture provides a solid foundation for a production-ready code analysis platform while maintaining flexibility for future enhancements.






