import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';
import { FileCode, Calendar, Award, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Submission {
  _id: string;
  language: string;
  code: string;
  analysis: {
    overallScore: number;
  };
  createdAt: string;
}

const History = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`/api/code/history?page=${page}&limit=10`);
      if (response.data.success) {
        setSubmissions(response.data.submissions || []);
        setTotalPages(response.data.pagination?.pages || 0);
      } else {
        setSubmissions([]);
        setTotalPages(0);
      }
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      // If it's a network error or 500, show error toast
      if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.response?.status === 401) {
        toast.error('Please log in again');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        // For other errors, just show empty state
        setSubmissions([]);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
  };

  const truncateCode = (code: string, maxLength: number = 100) => {
    if (code.length <= maxLength) return code;
    return code.substring(0, maxLength) + '...';
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

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submission History</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">View and review your previous code analyses</p>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <FileCode className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No submissions yet</p>
            <Link
              to="/editor"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Start Analyzing Code
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-medium rounded">
                          {submission.language.toUpperCase()}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(submission.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                      <pre className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-700 dark:text-gray-300 mb-4 overflow-x-auto">
                        {truncateCode(submission.code)}
                      </pre>
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded ${getScoreColor(submission.analysis.overallScore)}`}>
                          <Award className="h-4 w-4" />
                          <span className="font-semibold">Score: {submission.analysis.overallScore}</span>
                        </div>
                        <Link
                          to={`/submission/${submission._id}`}
                          className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default History;

