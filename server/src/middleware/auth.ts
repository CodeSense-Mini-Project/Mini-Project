import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Verify Firebase ID token using Firebase REST API
 * This doesn't require Firebase Admin SDK setup
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    // Verify token using Firebase REST API
    // This is a simple verification - for production, use Firebase Admin SDK
    try {
      const verifyResponse = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.FIREBASE_API_KEY || ''}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: token })
        }
      );

      if (!verifyResponse.ok) {
        throw new AppError('Invalid or expired token', 401);
      }

      const data = await verifyResponse.json() as { users?: Array<{ localId: string }> };
      if (data.users && data.users.length > 0) {
        req.userId = data.users[0].localId;
        next();
      } else {
        throw new AppError('Invalid token', 401);
      }
    } catch (error: any) {
      // If API key is not set, allow the request but log a warning
      // In production, you should always have the API key set
      if (!process.env.FIREBASE_API_KEY) {
        console.warn('FIREBASE_API_KEY not set. Token verification skipped. Set it in .env for production.');
        // For development, extract user ID from token payload (not secure, but works for dev)
        try {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          req.userId = payload.user_id || payload.sub || 'dev-user';
          next();
        } catch {
          throw new AppError('Invalid token format', 401);
        }
      } else {
        throw new AppError('Invalid or expired token', 401);
      }
    }
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
};
