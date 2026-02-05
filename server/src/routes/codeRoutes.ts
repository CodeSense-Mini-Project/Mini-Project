import express, { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { authenticate, AuthRequest } from '../middleware/auth';
import { CodeAnalyzer } from '../services/codeAnalyzer';
import CodeSubmission from '../models/CodeSubmission';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();
const codeAnalyzer = new CodeAnalyzer();

// Analyze code
router.post(
  '/analyze',
  authenticate,
  [
    body('code').notEmpty().withMessage('Code is required'),
    body('language').isIn(['python', 'c', 'cpp', 'java', 'javascript']).withMessage('Invalid language')
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { code, language, execute } = req.body;
      const userId = req.userId!;

      if (!code || !language) {
        throw new AppError('Code and language are required', 400);
      }

      logger.info(`Analyzing ${language} code for user ${userId}`);

      // Perform analysis
      const analysis = await codeAnalyzer.analyze(
        code,
        language,
        execute === true
      );

      // Save to database (optional - won't fail if MongoDB is not available)
      let submissionId = null;
      const isMongoConnected = mongoose.connection.readyState === 1;
      
      if (isMongoConnected) {
        try {
          const submission = new CodeSubmission({
            userId,
            language,
            code,
            analysis: {
              staticAnalysis: analysis.staticAnalysis,
              aiAnalysis: analysis.aiAnalysis,
              execution: analysis.execution,
              overallScore: analysis.overallScore
            }
          });

          await submission.save();
          submissionId = submission._id;
          logger.info(`Saved submission ${submissionId} for user ${userId}`);
        } catch (dbError: any) {
          logger.error('Failed to save submission to database:', dbError.message);
          logger.error('Database error details:', dbError);
        }
      } else {
        logger.warn('MongoDB not connected - submission not saved. Connect MongoDB to save submissions.');
      }

      res.json({
        success: true,
        analysis: {
          staticAnalysis: analysis.staticAnalysis,
          aiAnalysis: analysis.aiAnalysis,
          execution: analysis.execution,
          overallScore: analysis.overallScore
        },
        submissionId: submissionId,
        saved: !!submissionId,
        mongoConnected: isMongoConnected
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get submission history
router.get('/history', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      logger.warn('MongoDB not connected, returning empty history');
      return res.json({
        success: true,
        submissions: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }

    const submissions = await CodeSubmission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('language code analysis.overallScore createdAt')
      .lean();

    const total = await CodeSubmission.countDocuments({ userId });

    res.json({
      success: true,
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    logger.error('Error fetching submission history:', error);
    // Return empty history instead of error if MongoDB query fails
    res.json({
      success: true,
      submissions: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      }
    });
  }
});

// Get specific submission
router.get('/submission/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const submissionId = req.params.id;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      throw new AppError('Database not available', 503);
    }

    const submission = await CodeSubmission.findOne({
      _id: submissionId,
      userId
    });

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    res.json({
      success: true,
      submission
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Error fetching submission:', error);
      next(new AppError('Failed to fetch submission', 500));
    }
  }
});

// Get statistics
router.get('/stats', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      logger.warn('MongoDB not connected, returning empty stats');
      return res.json({
        success: true,
        stats: {
          totalSubmissions: 0,
          averageScore: 0,
          languages: []
        },
        recentScores: []
      });
    }

    const stats = await CodeSubmission.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          averageScore: { $avg: '$analysis.overallScore' },
          languages: { $addToSet: '$language' }
        }
      }
    ]);

    const recentScores = await CodeSubmission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('analysis.overallScore createdAt')
      .lean();

    res.json({
      success: true,
      stats: stats[0] || {
        totalSubmissions: 0,
        averageScore: 0,
        languages: []
      },
      recentScores: recentScores.map(s => ({
        score: s.analysis.overallScore,
        date: s.createdAt
      }))
    });
  } catch (error: any) {
    logger.error('Error fetching statistics:', error);
    // Return empty stats instead of error if MongoDB query fails
    res.json({
      success: true,
      stats: {
        totalSubmissions: 0,
        averageScore: 0,
        languages: []
      },
      recentScores: []
    });
  }
});

export default router;

