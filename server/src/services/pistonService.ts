import axios from 'axios';
import { logger } from '../utils/logger';

export interface ExecutionResult {
  output?: string;
  error?: string;
  executionTime?: number;
}

export class PistonService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.PISTON_BASE_URL || process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';
  }

  async executeCode(
    code: string,
    language: string
  ): Promise<ExecutionResult> {
    try {
      const languageMap: Record<string, string> = {
        python: 'python3',
        c: 'c',
        cpp: 'cpp',
        java: 'java',
        javascript: 'javascript'
      };

      const pistonLanguage = languageMap[language.toLowerCase()] || language;

      const response = await axios.post(`${this.apiUrl}/execute`, {
        language: pistonLanguage,
        version: '*',
        files: [
          {
            content: code
          }
        ]
      }, {
        timeout: 10000 // 10 second timeout
      });

      const result = response.data;

      if (result.run) {
        return {
          output: result.run.output || '',
          error: result.run.stderr || undefined,
          executionTime: result.run.code === 0 ? 0 : undefined
        };
      }

      return {
        error: 'Execution failed: No output received'
      };
    } catch (error) {
      logger.error('Piston API error:', error);
      
      if (axios.isAxiosError(error)) {
        return {
          error: `Execution error: ${error.message}`
        };
      }

      return {
        error: 'Failed to execute code'
      };
    }
  }

  async getAvailableLanguages(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/runtimes`);
      const runtimes = response.data;
      
      if (Array.isArray(runtimes)) {
        return runtimes.map((r: any) => r.language);
      }
      
      return ['python', 'javascript', 'c', 'cpp', 'java'];
    } catch (error) {
      logger.error('Failed to fetch available languages:', error);
      return ['python', 'javascript', 'c', 'cpp', 'java'];
    }
  }
}

