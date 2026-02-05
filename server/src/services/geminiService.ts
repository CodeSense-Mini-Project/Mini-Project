import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';
import { StaticAnalysisResult } from './staticAnalyzer';

export interface AIAnalysisResult {
  feedback: string;
  optimizationHints: string[];
  readabilityScore: number;
  complexityScore: number;
  suggestions: Array<{
    type: 'performance' | 'readability' | 'best-practice';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private initialized: boolean = false;

  private initialize() {
    if (this.initialized) {
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn('GEMINI_API_KEY not found. AI analysis will be limited.');
      this.initialized = true;
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.initialized = true;
      logger.info('Gemini AI service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Gemini AI:', error);
      this.genAI = null;
      this.model = null;
      this.initialized = true;
    }
  }

  async analyzeCode(
    code: string,
    language: string,
    staticAnalysis: StaticAnalysisResult
  ): Promise<AIAnalysisResult> {
    // Initialize on first use to ensure env vars are loaded
    this.initialize();

    if (!this.genAI || !this.model) {
      logger.warn('Gemini AI not available, returning default analysis');
      return this.getDefaultAnalysis();
    }

    try {
      const prompt = this.buildPrompt(code, language, staticAnalysis);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      logger.error('Gemini API error:', error);
      return this.getDefaultAnalysis();
    }
  }

  private buildPrompt(
    code: string,
    language: string,
    staticAnalysis: StaticAnalysisResult
  ): string {
    const errorsSummary = staticAnalysis.errors
      .filter(e => e.severity === 'error')
      .map(e => `Line ${e.line}: ${e.message}`)
      .join('\n');

    const warningsSummary = staticAnalysis.errors
      .filter(e => e.severity === 'warning')
      .map(e => `Line ${e.line}: ${e.message}`)
      .join('\n');

    return `You are an expert code reviewer analyzing ${language} code. Provide a comprehensive analysis in the following JSON format:

{
  "feedback": "Overall assessment of the code quality, structure, and maintainability (2-3 sentences)",
  "optimizationHints": ["Hint 1", "Hint 2", "Hint 3"],
  "readabilityScore": 85,
  "complexityScore": 65,
  "suggestions": [
    {
      "type": "performance",
      "message": "Specific suggestion",
      "priority": "high"
    }
  ]
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Static Analysis Findings:
Errors:
${errorsSummary || 'None'}

Warnings:
${warningsSummary || 'None'}

Provide specific, actionable feedback. Focus on:
1. Code quality and best practices
2. Performance optimizations
3. Readability improvements
4. Security considerations
5. Maintainability

Return ONLY valid JSON, no markdown formatting.`;
  }

  private parseAIResponse(text: string): AIAnalysisResult {
    try {
      // Remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleanedText);

      // Validate and normalize the response
      return {
        feedback: parsed.feedback || 'No feedback available',
        optimizationHints: Array.isArray(parsed.optimizationHints)
          ? parsed.optimizationHints
          : [],
        readabilityScore: this.normalizeScore(parsed.readabilityScore),
        complexityScore: this.normalizeScore(parsed.complexityScore),
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions.map((s: any) => ({
              type: s.type || 'best-practice',
              message: s.message || '',
              priority: s.priority || 'medium'
            }))
          : []
      };
    } catch (error) {
      logger.error('Failed to parse AI response:', error);
      return this.getDefaultAnalysis();
    }
  }

  private normalizeScore(score: any): number {
    const num = typeof score === 'number' ? score : parseInt(score) || 50;
    return Math.max(0, Math.min(100, num));
  }

  private getDefaultAnalysis(): AIAnalysisResult {
    return {
      feedback: 'AI analysis unavailable. Please check your API key configuration.',
      optimizationHints: [],
      readabilityScore: 50,
      complexityScore: 50,
      suggestions: []
    };
  }
}

