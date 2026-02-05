import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { ArrowLeft, Award, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface SubmissionDetail {
  _id: string;
  language: string;
  code: string;
  analysis: {
    staticAnalysis: {
      errors: Array<{
        line: number;
        message: string;
        severity: 'error' | 'warning' | 'info';
      }>;
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
  };
  createdAt: string;
}

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await axios.get(`/api/code/submission/${id}`);
      setSubmission(response.data.submission);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load submission');
      navigate('/history');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
      </>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/history"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Link>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submission Details</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {format(new Date(submission.createdAt), 'MMMM dd, yyyy HH:mm')} • {submission.language.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Award className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{submission.analysis.overallScore}</span>
              <span className="text-gray-600 dark:text-gray-400">/100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Code</h2>
            </div>
            <div className="h-[500px]">
              <Editor
                height="100%"
                language={submission.language}
                value={submission.code}
                theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14
                }}
              />
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {/* Static Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Static Analysis</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {submission.analysis.staticAnalysis.errors.length === 0 ? (
                  <p className="text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    No issues found
                  </p>
                ) : (
                  submission.analysis.staticAnalysis.errors.map((error, index) => (
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Feedback</h2>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">{submission.analysis.aiAnalysis.feedback}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Readability</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{submission.analysis.aiAnalysis.readabilityScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Complexity</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{submission.analysis.aiAnalysis.complexityScore}</p>
                  </div>
                </div>
                {submission.analysis.aiAnalysis.optimizationHints.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Optimization Hints:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {submission.analysis.aiAnalysis.optimizationHints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Execution Results */}
            {submission.analysis.execution && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Execution Results</h2>
                {submission.analysis.execution.error ? (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-red-800 dark:text-red-300 font-semibold">Error:</p>
                    <pre className="text-red-700 dark:text-red-400 text-sm mt-1 whitespace-pre-wrap">{submission.analysis.execution.error}</pre>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <p className="text-green-800 dark:text-green-300 font-semibold">Output:</p>
                    <pre className="text-green-700 dark:text-green-400 text-sm mt-1 whitespace-pre-wrap">{submission.analysis.execution.output}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmissionDetail;

