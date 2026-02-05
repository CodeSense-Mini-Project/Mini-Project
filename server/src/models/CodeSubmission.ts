import mongoose, { Schema, Document } from 'mongoose';

export interface ICodeSubmission extends Document {
  userId: string;
  language: string;
  code: string;
  analysis: {
    staticAnalysis: {
      errors: Array<{
        line: number;
        column?: number;
        message: string;
        severity: 'error' | 'warning' | 'info';
        rule?: string;
      }>;
      warnings: number;
      errorCount: number;
    };
    aiAnalysis: {
      feedback: string;
      optimizationHints: string[];
      readabilityScore: number;
      complexityScore: number;
      suggestions: Array<{
        type: 'performance' | 'readability' | 'best-practice';
        message: string;
        priority: 'high' | 'medium' | 'low';
      }>;
    };
    execution?: {
      output?: string;
      error?: string;
      executionTime?: number;
    };
    overallScore: number;
  };
  createdAt: Date;
}

const CodeSubmissionSchema = new Schema<ICodeSubmission>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    language: {
      type: String,
      required: true,
      enum: ['python', 'c', 'cpp', 'java', 'javascript']
    },
    code: {
      type: String,
      required: true
    },
    analysis: {
      staticAnalysis: {
        errors: [{
          line: Number,
          column: Number,
          message: String,
          severity: {
            type: String,
            enum: ['error', 'warning', 'info']
          },
          rule: String
        }],
        warnings: Number,
        errorCount: Number
      },
      aiAnalysis: {
        feedback: String,
        optimizationHints: [String],
        readabilityScore: Number,
        complexityScore: Number,
        suggestions: [{
          type: {
            type: String,
            enum: ['performance', 'readability', 'best-practice']
          },
          message: String,
          priority: {
            type: String,
            enum: ['high', 'medium', 'low']
          }
        }]
      },
      execution: {
        output: String,
        error: String,
        executionTime: Number
      },
      overallScore: Number
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
CodeSubmissionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ICodeSubmission>('CodeSubmission', CodeSubmissionSchema);

