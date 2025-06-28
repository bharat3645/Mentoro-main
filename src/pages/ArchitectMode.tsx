import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitPullRequest, 
  Code, 
  Eye, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Upload,
  Download,
  Github,
  ExternalLink,
  User,
  Calendar,
  Award,
  Filter,
  Search,
  Plus,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { submissionAPI } from '../services/api';
import { useGameStore } from '../store/gameStore';
import toast from 'react-hot-toast';

interface Submission {
  id: string;
  title: string;
  description: string;
  author: {
    username: string;
    avatar: string;
  };
  type: 'feature' | 'bugfix' | 'improvement' | 'documentation';
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  code_url: string;
  live_url?: string;
  tags: string[];
  created_at: string;
  review_count: number;
  average_rating: number;
}

const ArchitectMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'reviews' | 'submit'>('submissions');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [submitForm, setSubmitForm] = useState({
    title: '',
    description: '',
    type: 'feature',
    code_url: '',
    live_url: '',
    tags: [] as string[]
  });

  const { user, addNotification } = useGameStore();

  // Mock submissions data
  const mockSubmissions: Submission[] = [
    {
      id: '1',
      title: 'Interactive Dashboard Component',
      description: 'A reusable dashboard component with real-time data visualization and customizable widgets.',
      author: {
        username: 'CodeMaster99',
        avatar: '👨‍💻'
      },
      type: 'feature',
      status: 'approved',
      code_url: 'https://github.com/example/dashboard-component',
      live_url: 'https://dashboard-demo.netlify.app',
      tags: ['React', 'TypeScript', 'Charts', 'Dashboard'],
      created_at: '2024-01-15T10:30:00Z',
      review_count: 5,
      average_rating: 4.6
    },
    {
      id: '2',
      title: 'Authentication Hook Fix',
      description: 'Fixed memory leak in useAuth hook that was causing performance issues in large applications.',
      author: {
        username: 'ReactNinja',
        avatar: '🥷'
      },
      type: 'bugfix',
      status: 'under_review',
      code_url: 'https://github.com/example/auth-hook-fix',
      tags: ['React', 'Hooks', 'Performance', 'Authentication'],
      created_at: '2024-01-14T15:45:00Z',
      review_count: 2,
      average_rating: 4.0
    },
    {
      id: '3',
      title: 'API Response Caching System',
      description: 'Implemented intelligent caching system for API responses with automatic invalidation.',
      author: {
        username: 'APIGuru',
        avatar: '⚡'
      },
      type: 'improvement',
      status: 'pending',
      code_url: 'https://github.com/example/api-caching',
      live_url: 'https://api-cache-demo.vercel.app',
      tags: ['Node.js', 'Caching', 'Performance', 'API'],
      created_at: '2024-01-13T09:20:00Z',
      review_count: 0,
      average_rating: 0
    },
    {
      id: '4',
      title: 'Component Library Documentation',
      description: 'Comprehensive documentation for the UI component library with interactive examples.',
      author: {
        username: 'DocWriter',
        avatar: '📚'
      },
      type: 'documentation',
      status: 'approved',
      code_url: 'https://github.com/example/component-docs',
      live_url: 'https://components.example.com',
      tags: ['Documentation', 'Storybook', 'Components', 'UI'],
      created_at: '2024-01-12T14:10:00Z',
      review_count: 8,
      average_rating: 4.8
    },
    {
      id: '5',
      title: 'Dark Mode Toggle Component',
      description: 'Smooth animated dark mode toggle with system preference detection and persistence.',
      author: {
        username: 'ThemeExpert',
        avatar: '🌙'
      },
      type: 'feature',
      status: 'pending',
      code_url: 'https://github.com/example/dark-mode-toggle',
      live_url: 'https://dark-mode-demo.netlify.app',
      tags: ['React', 'CSS', 'Animation', 'Theme'],
      created_at: '2024-01-11T11:30:00Z',
      review_count: 1,
      average_rating: 5.0
    }
  ];

  useEffect(() => {
    setSubmissions(mockSubmissions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        title: 'Submission Created!',
        message: 'Your code has been submitted for review',
        type: 'success',
        read: false,
        priority: 'medium'
      });

      // Reset form
      setSubmitForm({
        title: '',
        description: '',
        type: 'feature',
        code_url: '',
        live_url: '',
        tags: []
      });

      // Add to submissions list
      const newSubmission: Submission = {
        id: Date.now().toString(),
        title: submitForm.title,
        description: submitForm.description,
        author: {
          username: user?.username || 'You',
          avatar: user?.avatar || '👤'
        },
        type: submitForm.type as any,
        status: 'pending',
        code_url: submitForm.code_url,
        live_url: submitForm.live_url,
        tags: submitForm.tags,
        created_at: new Date().toISOString(),
        review_count: 0,
        average_rating: 0
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      setActiveTab('submissions');
      toast.success('Submission created successfully!');
    } catch (error) {
      toast.error('Failed to create submission');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'text-neon-yellow border-neon-yellow/30 bg-neon-yellow/10',
    under_review: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
    approved: 'text-neon-green border-neon-green/30 bg-neon-green/10',
    rejected: 'text-neon-red border-neon-red/30 bg-neon-red/10'
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    under_review: <Eye className="w-4 h-4" />,
    approved: <CheckCircle className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />
  };

  const typeIcons = {
    feature: '✨',
    bugfix: '🐛',
    improvement: '⚡',
    documentation: '📚'
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || submission.type === filterType;
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <GitPullRequest className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent font-game">
              Code Architect
            </h1>
            <p className="text-gray-400 text-lg font-space">
              Contribute to the galaxy and review others' work
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-cyan/20 text-center">
          <GitPullRequest className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{submissions.length}</p>
          <p className="text-sm text-gray-400">Total Submissions</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-green/20 text-center">
          <CheckCircle className="w-6 h-6 text-neon-green mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{submissions.filter(s => s.status === 'approved').length}</p>
          <p className="text-sm text-gray-400">Approved</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-yellow/20 text-center">
          <Clock className="w-6 h-6 text-neon-yellow mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{submissions.filter(s => s.status === 'pending').length}</p>
          <p className="text-sm text-gray-400">Pending Review</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-purple/20 text-center">
          <Star className="w-6 h-6 text-neon-purple mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {submissions.length > 0 ? (submissions.reduce((acc, s) => acc + s.average_rating, 0) / submissions.filter(s => s.average_rating > 0).length || 0).toFixed(1) : '0.0'}
          </p>
          <p className="text-sm text-gray-400">Avg Rating</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { id: 'submissions', name: 'Browse Submissions', icon: <GitPullRequest className="w-5 h-5" /> },
          { id: 'reviews', name: 'Review Queue', icon: <Eye className="w-5 h-5" /> },
          { id: 'submit', name: 'Submit Code', icon: <Upload className="w-5 h-5" /> }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'submissions' && (
          <motion.div
            key="submissions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Submissions List */}
            <div className="lg:col-span-2">
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-cyan/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-game">Community Submissions</h2>
                  
                  {/* Filters */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none w-32"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="feature">Features</option>
                      <option value="bugfix">Bug Fixes</option>
                      <option value="improvement">Improvements</option>
                      <option value="documentation">Documentation</option>
                    </select>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <motion.div
                      key={submission.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedSubmission?.id === submission.id
                          ? 'bg-neon-cyan/10 border-neon-cyan/50'
                          : 'bg-black/20 border-dark-600 hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{typeIcons[submission.type]}</span>
                            <h3 className="font-medium text-white">{submission.title}</h3>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2">{submission.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <span className="text-lg">{submission.author.avatar}</span>
                              <span>{submission.author.username}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{submission.review_count} reviews</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${statusColors[submission.status]}`}>
                            {statusIcons[submission.status]}
                            <span className="capitalize">{submission.status.replace('_', ' ')}</span>
                          </span>
                          {submission.average_rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-neon-yellow fill-current" />
                              <span className="text-xs text-gray-400">{submission.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {submission.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-dark-700 text-xs rounded-full text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-purple/20">
              {selectedSubmission ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-game">Submission Details</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${statusColors[selectedSubmission.status]}`}>
                      {statusIcons[selectedSubmission.status]}
                      <span className="capitalize">{selectedSubmission.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Project</h4>
                      <p className="text-gray-400 text-sm">{selectedSubmission.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Author</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{selectedSubmission.author.avatar}</span>
                        <span className="text-gray-300">{selectedSubmission.author.username}</span>
                      </div>
                    </div>

                    {selectedSubmission.average_rating > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Community Rating</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= selectedSubmission.average_rating
                                    ? 'text-neon-yellow fill-current'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">
                            ({selectedSubmission.review_count} reviews)
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 py-4 bg-black/20 rounded-lg px-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-neon-cyan">
                          {new Date(selectedSubmission.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">Submitted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-neon-yellow">
                          {selectedSubmission.type}
                        </div>
                        <div className="text-xs text-gray-400">Type</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <motion.button
                        onClick={() => window.open(selectedSubmission.code_url, '_blank')}
                        className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-cyan/25 transition-all flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="w-5 h-5 mr-2" />
                        View Code
                      </motion.button>
                      
                      {selectedSubmission.live_url && (
                        <motion.button
                          onClick={() => window.open(selectedSubmission.live_url, '_blank')}
                          className="w-full py-2 bg-dark-700 hover:bg-dark-600 rounded-lg font-medium text-white transition-all flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </motion.button>
                      )}

                      {selectedSubmission.status === 'pending' && (
                        <motion.button
                          onClick={() => {
                            toast.success('Review submitted! +50 XP earned');
                          }}
                          className="w-full py-2 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg font-medium text-white transition-all flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Review This
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <GitPullRequest className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Select a Submission</h3>
                  <p className="text-sm">
                    Click on a submission to view its details and reviews
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-neon-yellow/20 text-center"
          >
            <Eye className="w-16 h-16 mx-auto mb-4 text-neon-yellow" />
            <h2 className="text-2xl font-bold mb-4 font-game">Review Queue</h2>
            <p className="text-gray-400 mb-8 font-space">
              Help other developers improve by reviewing their code submissions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <motion.button
                className="p-6 bg-black/20 border border-dark-600 rounded-lg hover:border-neon-yellow/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Code className="w-8 h-8 mx-auto mb-3 text-neon-cyan" />
                <h3 className="font-medium mb-2">Frontend Projects</h3>
                <p className="text-sm text-gray-400">Review React, Vue, and vanilla JS projects</p>
                <div className="mt-3 text-xs text-neon-yellow">3 pending reviews</div>
              </motion.button>
              
              <motion.button
                className="p-6 bg-black/20 border border-dark-600 rounded-lg hover:border-neon-yellow/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GitPullRequest className="w-8 h-8 mx-auto mb-3 text-neon-green" />
                <h3 className="font-medium mb-2">Backend APIs</h3>
                <p className="text-sm text-gray-400">Review Node.js, Python, and other backend projects</p>
                <div className="mt-3 text-xs text-neon-yellow">2 pending reviews</div>
              </motion.button>
            </div>

            <div className="mt-8 p-4 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-neon-yellow" />
                <span className="font-medium text-neon-yellow">Earn XP for Reviews</span>
              </div>
              <p className="text-sm text-gray-400">
                Earn 50 XP for each helpful review you provide to the community
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'submit' && (
          <motion.div
            key="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-neon-green/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-center font-game">Submit Your Code</h2>
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  placeholder="Enter your project title"
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-green focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                  placeholder="Describe your project, technologies used, and key features"
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-green focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={submitForm.code_url}
                    onChange={(e) => setSubmitForm({ ...submitForm, code_url: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-green focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={submitForm.live_url}
                    onChange={(e) => setSubmitForm({ ...submitForm, live_url: e.target.value })}
                    placeholder="https://your-demo.netlify.app"
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-green focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technologies Used
                </label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Tailwind CSS, Node.js..."
                  onChange={(e) => setSubmitForm({ ...submitForm, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type
                </label>
                <select 
                  value={submitForm.type}
                  onChange={(e) => setSubmitForm({ ...submitForm, type: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-neon-green focus:outline-none"
                >
                  <option value="feature">New Feature</option>
                  <option value="bugfix">Bug Fix</option>
                  <option value="improvement">Improvement</option>
                  <option value="documentation">Documentation</option>
                </select>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-neon-green to-neon-cyan rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-green/25 transition-all flex items-center justify-center disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <Upload className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Submitting...' : 'Submit for Review'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchitectMode;