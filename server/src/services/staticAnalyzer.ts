import { logger } from '../utils/logger';

export interface StaticAnalysisResult {
  errors: Array<{
    line: number;
    column?: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    rule?: string;
  }>;
  warnings: number;
  errorCount: number;
}

export class StaticAnalyzer {
  /**
   * Analyzes code based on language using appropriate linters
   */
  static async analyze(code: string, language: string): Promise<StaticAnalysisResult> {
    try {
      switch (language.toLowerCase()) {
        case 'python':
          return await this.analyzePython(code);
        case 'javascript':
          return await this.analyzeJavaScript(code);
        case 'c':
        case 'cpp':
          return await this.analyzeCpp(code, language);
        case 'java':
          return await this.analyzeJava(code);
        default:
          return this.getDefaultResult();
      }
    } catch (error) {
      logger.error(`Static analysis error for ${language}:`, error);
      return this.getDefaultResult();
    }
  }

  private static async analyzePython(code: string): Promise<StaticAnalysisResult> {
    const errors: StaticAnalysisResult['errors'] = [];
    const lines = code.split('\n');

    // Basic Python static analysis
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for common issues
      if (line.trim().startsWith('import ') && line.includes('*')) {
        errors.push({
          line: lineNum,
          message: 'Avoid wildcard imports',
          severity: 'warning',
          rule: 'W0614'
        });
      }

      // Check for unused variables (basic pattern matching)
      const varMatch = line.match(/^\s*(\w+)\s*=/);
      if (varMatch && !code.includes(varMatch[1]) && code.split(varMatch[1]).length === 2) {
        errors.push({
          line: lineNum,
          message: `Variable '${varMatch[1]}' might be unused`,
          severity: 'info',
          rule: 'W0612'
        });
      }

      // Check for missing docstrings in functions
      if (line.trim().startsWith('def ') && index < lines.length - 1) {
        const nextLine = lines[index + 1];
        if (!nextLine.trim().startsWith('"""') && !nextLine.trim().startsWith("'''")) {
          errors.push({
            line: lineNum,
            message: 'Function missing docstring',
            severity: 'info',
            rule: 'C0111'
          });
        }
      }

      // Check for long lines
      if (line.length > 100) {
        errors.push({
          line: lineNum,
          message: 'Line too long (over 100 characters)',
          severity: 'warning',
          rule: 'C0301'
        });
      }
    });

    // Syntax validation
    try {
      // In production, you'd use pylint or flake8 via subprocess
      // For now, we do basic validation
      const syntaxErrors = this.checkPythonSyntax(code);
      errors.push(...syntaxErrors);
    } catch (error) {
      errors.push({
        line: 1,
        message: `Syntax error detected: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
    }

    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;

    return {
      errors,
      warnings: warningCount,
      errorCount: errorCount
    };
  }

  private static checkPythonSyntax(code: string): StaticAnalysisResult['errors'] {
    const errors: StaticAnalysisResult['errors'] = [];
    
    // Basic syntax checks
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({
        line: 1,
        message: 'Mismatched parentheses',
        severity: 'error'
      });
    }

    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        line: 1,
        message: 'Mismatched braces',
        severity: 'error'
      });
    }

    return errors;
  }

  private static async analyzeJavaScript(code: string): Promise<StaticAnalysisResult> {
    const errors: StaticAnalysisResult['errors'] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for == instead of ===
      if (line.includes(' == ') && !line.includes(' === ')) {
        errors.push({
          line: lineNum,
          message: 'Use === instead of ==',
          severity: 'warning',
          rule: 'eqeqeq'
        });
      }

      // Check for var instead of let/const
      if (line.match(/\bvar\s+\w+/)) {
        errors.push({
          line: lineNum,
          message: 'Use let or const instead of var',
          severity: 'warning',
          rule: 'no-var'
        });
      }

      // Check for console.log in production code
      if (line.includes('console.log')) {
        errors.push({
          line: lineNum,
          message: 'Consider removing console.log statements',
          severity: 'info',
          rule: 'no-console'
        });
      }
    });

    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;

    return {
      errors,
      warnings: warningCount,
      errorCount: errorCount
    };
  }

  private static async analyzeCpp(code: string, language: string): Promise<StaticAnalysisResult> {
    const errors: StaticAnalysisResult['errors'] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for using namespace std
      if (line.includes('using namespace std')) {
        errors.push({
          line: lineNum,
          message: 'Avoid "using namespace std"',
          severity: 'warning',
          rule: 'google-build-using-namespace'
        });
      }

      // Check for missing includes
      if (line.includes('cout') && !code.includes('#include <iostream>')) {
        errors.push({
          line: lineNum,
          message: 'Missing #include <iostream>',
          severity: 'error'
        });
      }

      // Check for memory leaks (basic)
      if (line.includes('new ') && !code.includes('delete')) {
        errors.push({
          line: lineNum,
          message: 'Potential memory leak: new without delete',
          severity: 'warning',
          rule: 'cppcoreguidelines-owning-memory'
        });
      }
    });

    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;

    return {
      errors,
      warnings: warningCount,
      errorCount: errorCount
    };
  }

  private static async analyzeJava(code: string): Promise<StaticAnalysisResult> {
    const errors: StaticAnalysisResult['errors'] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for missing access modifiers
      const classMatch = line.match(/^\s*(class|interface)\s+(\w+)/);
      if (classMatch && !line.includes('public') && !line.includes('private')) {
        errors.push({
          line: lineNum,
          message: 'Class should have explicit access modifier',
          severity: 'info',
          rule: 'MissingJavadocMethod'
        });
      }

      // Check for System.out.println
      if (line.includes('System.out.println')) {
        errors.push({
          line: lineNum,
          message: 'Consider using a logger instead of System.out.println',
          severity: 'info',
          rule: 'SystemPrintln'
        });
      }
    });

    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;

    return {
      errors,
      warnings: warningCount,
      errorCount: errorCount
    };
  }

  private static getDefaultResult(): StaticAnalysisResult {
    return {
      errors: [],
      warnings: 0,
      errorCount: 0
    };
  }
}

