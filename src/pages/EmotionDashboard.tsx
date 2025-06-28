import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Heart, 
  Brain,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const EmotionDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const moodData = [
    { day: 'Mon', mood: 7, productivity: 85, engagement: 90 },
    { day: 'Tue', mood: 8, productivity: 92, engagement: 88 },
    { day: 'Wed', mood: 6, productivity: 78, engagement: 75 },
    { day: 'Thu', mood: 9, productivity: 95, engagement: 94 },
    { day: 'Fri', mood: 8, productivity: 88, engagement: 92 },
    { day: 'Sat', mood: 7, productivity: 82, engagement: 85 },
    { day: 'Sun', mood: 8, productivity: 90, engagement: 89 }
  ];

  const emotionDistribution = [
    { name: 'Excited', value: 35, color: '#EC4899' },
    { name: 'Focused', value: 28, color: '#8B5CF6' },
    { name: 'Motivated', value: 20, color: '#06B6D4' },
    { name: 'Tired', value: 12, color: '#F59E0B' },
    { name: 'Confused', value: 5, color: '#EF4444' }
  ];

  const leaderboardData = [
    { rank: 1, username: 'CodeMaster99', xp: 12450, mood: 8.5, avatar: '🏆' },
    { rank: 2, username: 'ReactNinja', xp: 11890, mood: 8.2, avatar: '🥈' },
    { rank: 3, username: 'JSWarrior', xp: 11340, mood: 7.9, avatar: '🥉' },
    { rank: 4, username: 'You', xp: 10850, mood: 8.1, avatar: '👤' },
    { rank: 5, username: 'AlgoQueen', xp: 10200, mood: 7.8, avatar: '👑' }
  ];

  const insights = [
    {
      title: 'Peak Performance Time',
      value: '2:00 PM - 4:00 PM',
      description: 'You show highest productivity during afternoon hours',
      icon: <TrendingUp className="w-5 h-5 text-neon-green" />
    },
    {
      title: 'Mood Booster',
      value: 'Completing Quests',
      description: 'Quest completion increases your mood by 15% on average',
      icon: <Heart className="w-5 h-5 text-neon-pink" />
    },
    {
      title: 'Learning Style',
      value: 'Visual Learner',
      description: 'You engage 40% more with visual content and diagrams',
      icon: <Brain className="w-5 h-5 text-neon-purple" />
    },
    {
      title: 'Optimal Session',
      value: '45 minutes',
      description: 'Your focus peaks at 45-minute coding sessions',
      icon: <Target className="w-5 h-5 text-neon-cyan" />
    }
  ];

  const currentMood = 8.1;
  const weeklyAverage = 7.8;
  const productivityScore = 87;
  const engagementLevel = 89;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-2">
          Emotion Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Track your mood, engagement, and learning patterns
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700 text-center">
          <Heart className="w-8 h-8 text-neon-pink mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{currentMood}/10</div>
          <div className="text-sm text-gray-400">Current Mood</div>
          <div className="text-xs text-neon-green mt-1">+0.3 from yesterday</div>
        </div>
        
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700 text-center">
          <Brain className="w-8 h-8 text-neon-purple mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{productivityScore}%</div>
          <div className="text-sm text-gray-400">Productivity</div>
          <div className="text-xs text-neon-green mt-1">+5% this week</div>
        </div>
        
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700 text-center">
          <Zap className="w-8 h-8 text-neon-yellow mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{engagementLevel}%</div>
          <div className="text-sm text-gray-400">Engagement</div>
          <div className="text-xs text-neon-green mt-1">+2% this week</div>
        </div>
        
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700 text-center">
          <TrendingUp className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{weeklyAverage}/10</div>
          <div className="text-sm text-gray-400">Weekly Average</div>
          <div className="text-xs text-neon-green mt-1">Above target</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Trends */}
        <motion.div
          className="lg:col-span-2 bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-neon-purple" />
              Mood & Performance Trends
            </h2>
            <div className="flex space-x-2">
              {['7d', '30d', '90d'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    selectedPeriod === period
                      ? 'bg-neon-purple/20 text-neon-purple'
                      : 'bg-dark-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#EC4899"
                  strokeWidth={3}
                  dot={{ fill: '#EC4899', strokeWidth: 2, r: 6 }}
                  name="Mood"
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  name="Productivity"
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                  name="Engagement"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div
          className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-neon-pink" />
            Emotion Distribution
          </h2>

          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {emotionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {emotionDistribution.map((emotion) => (
              <div key={emotion.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  />
                  <span className="text-sm">{emotion.name}</span>
                </div>
                <span className="text-sm text-gray-400">{emotion.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <motion.div
          className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-neon-cyan" />
            AI Insights
          </h2>

          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                className="p-4 bg-dark-900/50 rounded-lg border border-dark-600"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{insight.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{insight.title}</h3>
                    <p className="text-sm font-medium text-neon-cyan mb-1">{insight.value}</p>
                    <p className="text-xs text-gray-400">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mood Leaderboard */}
        <motion.div
          className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-neon-yellow" />
            Mood Leaderboard
          </h2>

          <div className="space-y-3">
            {leaderboardData.map((player) => (
              <motion.div
                key={player.rank}
                className={`p-4 rounded-lg border transition-all ${
                  player.username === 'You'
                    ? 'bg-neon-purple/10 border-neon-purple/30'
                    : 'bg-dark-900/50 border-dark-600'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{player.avatar}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">#{player.rank}</span>
                        <span className={`font-medium ${
                          player.username === 'You' ? 'text-neon-purple' : 'text-gray-300'
                        }`}>
                          {player.username}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {player.xp.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-neon-pink" />
                      <span className="font-medium text-white">{player.mood}</span>
                    </div>
                    <div className="text-xs text-gray-400">Avg Mood</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmotionDashboard;