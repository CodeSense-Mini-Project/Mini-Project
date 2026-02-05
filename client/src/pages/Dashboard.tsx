import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Code2, TrendingUp, FileCode, Award, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

interface Stats {
  totalSubmissions: number;
  averageScore: number;
  languages: string[];
}

interface RecentScore {
  score: number;
  date: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentScores, setRecentScores] = useState<RecentScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/code/stats');
      if (response.data.success) {
        setStats(response.data.stats || {
          totalSubmissions: 0,
          averageScore: 0,
          languages: []
        });
        setRecentScores(response.data.recentScores || []);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      // Set default values instead of showing error
      setStats({
        totalSubmissions: 0,
        averageScore: 0,
        languages: []
      });
      setRecentScores([]);
      // Only show error for server errors, not for empty results
      if (error.response?.status >= 500) {
        toast.error('Failed to load statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  const chartData = recentScores.map((item, index) => ({
    name: `Submission ${index + 1}`,
    score: item.score
  }));

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to CodeSense - Your AI-powered code analysis platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <FileCode className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalSubmissions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.averageScore ? Math.round(stats.averageScore) : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Languages Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.languages?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {recentScores.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/editor"
              className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <div className="flex items-center">
                <Code2 className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Analyze Code</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Submit code for AI-powered analysis</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </Link>

            <Link
              to="/history"
              className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <div className="flex items-center">
                <FileCode className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">View History</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Browse your previous submissions</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

