import { StaticAnalyzer, StaticAnalysisResult } from './staticAnalyzer';
import { GeminiService, AIAnalysisResult } from './geminiService';
import { PistonService, ExecutionResult } from './pistonService';
import { logger } from '../utils/logger';

export interface CompleteAnalysis {
  staticAnalysis: StaticAnalysisResult;
  aiAnalysis: AIAnalysisResult;
  execution?: ExecutionResult;
  overallScore: number;
}

export class CodeAnalyzer {
  private geminiService: GeminiService;
  private pistonService: PistonService;

  constructor() {
    this.geminiService = new GeminiService();
    this.pistonService = new PistonService();
  }

  async analyze(
    code: string,
    language: string,
    executeCode: boolean = false
  ): Promise<CompleteAnalysis> {
    try {
      // Step 1: Static Analysis
      logger.info(`Starting static analysis for ${language}`);
      const staticAnalysis = await StaticAnalyzer.analyze(code, language);

      // Step 2: AI Analysis (parallel with execution if needed)
      logger.info('Starting AI analysis');
      const [aiAnalysis, execution] = await Promise.all([
        this.geminiService.analyzeCode(code, language, staticAnalysis),
        executeCode ? this.pistonService.executeCode(code, language) : Promise.resolve(undefined)
      ]);

      // Step 3: Calculate overall score
      const overallScore = this.calculateOverallScore(
        staticAnalysis,
        aiAnalysis,
        execution
      );

      return {
        staticAnalysis,
        aiAnalysis,
        execution,
        overallScore
      };
    } catch (error) {
      logger.error('Code analysis error:', error);
      throw error;
    }
  }

  private calculateOverallScore(
    staticAnalysis: StaticAnalysisResult,
    aiAnalysis: AIAnalysisResult,
    execution?: ExecutionResult
  ): number {
    let score = 100;

    // Deduct for static analysis errors
    score -= staticAnalysis.errors.filter(e => e.severity === 'error').length * 10;
    score -= staticAnalysis.errors.filter(e => e.severity === 'warning').length * 3;
    score -= staticAnalysis.errors.filter(e => e.severity === 'info').length * 1;

    // Factor in AI readability and complexity scores
    const readabilityFactor = aiAnalysis.readabilityScore / 100;
    const complexityFactor = (100 - aiAnalysis.complexityScore) / 100;
    score = (score * 0.4) + (readabilityFactor * 30) + (complexityFactor * 30);

    // Deduct for execution errors
    if (execution?.error) {
      score -= 20;
    }

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

