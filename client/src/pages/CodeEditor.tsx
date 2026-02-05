import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useTheme } from '../contexts/ThemeContext';
import { Play, Loader2, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' }
];

const DEFAULT_CODE = {
  python: 'def hello_world():\n    print("Hello, World!")\n\nhello_world()',
  javascript: 'function helloWorld() {\n    console.log("Hello, World!");\n}\n\nhelloWorld();',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  java: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
};

interface AnalysisResult {
  staticAnalysis: {
    errors: Array<{
      line: number;
      message: string;
      severity: 'error' | 'warning' | 'info';
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
      type: string;
      message: string;
      priority: string;
    }>;
  };
  execution?: {
    output?: string;
    error?: string;
  };
  overallScore: number;
}

const CodeEditor = () => {
  const { theme } = useTheme();
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [language, setLanguage] = useState('python');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [executeCode, setExecuteCode] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await axios.post('/api/code/analyze', {
        code,
        language,
        execute: executeCode
      });

      // Validate response structure
      if (response.data && response.data.analysis) {
        setResult(response.data.analysis);
        
        // Show feedback about saving
        if (response.data.saved) {
          toast.success('Analysis complete and saved!');
        } else if (response.data.mongoConnected === false) {
          toast.success('Analysis complete! (Not saved - MongoDB not connected)', {
            duration: 4000
          });
        } else {
          toast.success('Analysis complete!');
        }
      } else {
        console.error('Invalid response structure:', response.data);
        toast.error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || 'Analysis failed. Please check your connection and try again.';
      toast.error(errorMessage);
      
      // If it's an auth error, redirect to login
      if (error.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage as keyof typeof DEFAULT_CODE] || '');
    setResult(null);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Code Editor</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Write or paste your code and get AI-powered analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={executeCode}
                      onChange={(e) => setExecuteCode(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Execute Code</span>
                  </label>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="h-[600px]">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {result && (
              <>
                {/* Overall Score */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Overall Score</h2>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{result.overallScore}</span>
                      <span className="text-gray-500 dark:text-gray-400">/100</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-4 rounded-full transition-all"
                      style={{ width: `${result.overallScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Static Analysis */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Static Analysis</h2>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.staticAnalysis.errors.length === 0 ? (
                      <p className="text-green-600 dark:text-green-400 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        No issues found
                      </p>
                    ) : (
                      result.staticAnalysis.errors.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          {getSeverityIcon(error.severity)}
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              <span className="font-semibold">Line {error.line}:</span> {error.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI Feedback</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{result.aiAnalysis.feedback}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Readability</p>
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{result.aiAnalysis.readabilityScore}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Complexity</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.aiAnalysis.complexityScore}</p>
                      </div>
                    </div>
                    {result.aiAnalysis.optimizationHints.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Optimization Hints:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {result.aiAnalysis.optimizationHints.map((hint, index) => (
                            <li key={index}>{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Execution Results */}
                {result.execution && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Execution Results</h2>
                    {result.execution.error ? (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                        <p className="text-red-800 dark:text-red-300 font-semibold">Error:</p>
                        <p className="text-red-700 dark:text-red-400 text-sm mt-1">{result.execution.error}</p>
                      </div>
                    ) : (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                        <p className="text-green-800 dark:text-green-300 font-semibold">Output:</p>
                        <pre className="text-green-700 dark:text-green-400 text-sm mt-1 whitespace-pre-wrap">{result.execution.output}</pre>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {analyzing && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600 dark:text-primary-400" />
                <p className="text-gray-600 dark:text-gray-400">Analyzing your code...</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">This may take a few moments</p>
              </div>
            )}

            {!result && !analyzing && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">Click "Analyze" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;

