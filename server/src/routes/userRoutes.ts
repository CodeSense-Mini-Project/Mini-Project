import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;






