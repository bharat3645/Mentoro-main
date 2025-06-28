import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Target,
  Trophy,
  Flame,
  TrendingUp,
  Users,
  Clock,
  Star,
  BarChart3,
  Sword,
  Crown,
  Rocket,
  Brain,
  Code,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { goalsAPI, leaderboardAPI, xpAPI } from '../services/api';
import toast from 'react-hot-toast';

// Components
import StatsCard from '../components/ui/StatsCard';
import ProgressChart from '../components/ui/ProgressChart';
import QuestCard from '../components/ui/QuestCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [xpLogs, setXpLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  
  const {
    currentStreak,
    activeQuests,
    completedQuests,
    engagementMetrics,
    updateStreak,
    addXP,
    completeGoal,
    user
  } = useGameStore();

  // Demo user data
  const profile = user || {
    username: 'Demo User',
    avatar: '🚀',
    level: 5,
    xp: 2450,
    total_xp: 2450,
    streak_days: 7,
    rank: 'Silver II',
    battles_won: 12,
    quests_completed: 23
  };

  useEffect(() => {
    loadDashboardData();
    updateStreak();
  }, [updateStreak]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setBackendAvailable(true);
      
      // Mock daily goals
      setDailyGoals([
        {
          id: '1',
          title: 'Earn 500 XP',
          description: 'Complete quests and battles to earn experience',
          target: 500,
          current: 350,
          xp_reward: 100,
          completed: false,
          type: 'xp',
          icon: '⚡'
        },
        {
          id: '2',
          title: 'Complete 2 Quests',
          description: 'Finish any learning activities',
          target: 2,
          current: 1,
          xp_reward: 150,
          completed: false,
          type: 'quests',
          icon: '🎯'
        },
        {
          id: '3',
          title: 'Win 1 Battle',
          description: 'Emerge victorious in coding battles',
          target: 1,
          current: 1,
          xp_reward: 200,
          completed: true,
          type: 'battles',
          icon: '⚔️'
        }
      ]);
      
      // Mock leaderboard
      setLeaderboard([
        { rank: 1, username: 'CodeMaster99', xp: 12450, streak_days: 15, avatar: '🏆' },
        { rank: 2, username: 'ReactNinja', xp: 11890, streak_days: 12, avatar: '🥈' },
        { rank: 3, username: 'JSWarrior', xp: 11340, streak_days: 8, avatar: '🥉' },
        { rank: 4, username: profile.username, xp: profile.total_xp, streak_days: profile.streak_days, avatar: profile.avatar },
        { rank: 5, username: 'AlgoQueen', xp: 10200, streak_days: 6, avatar: '👑' }
      ]);
      
      // Mock XP logs
      setXpLogs([
        { id: '1', amount: 150, description: 'Completed React Hooks quest', created_at: new Date().toISOString() },
        { id: '2', amount: 100, description: 'Won coding battle', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', amount: 75, description: 'Answered flashcard correctly', created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: '4', amount: 200, description: 'Completed daily goal', created_at: new Date(Date.now() - 86400000).toISOString() }
      ]);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setBackendAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      const goal = dailyGoals.find(g => g.id === goalId);
      if (!goal || goal.completed) return;

      // Update goal status
      setDailyGoals(prev => prev.map(g => 
        g.id === goalId ? { ...g, completed: true, current: g.target } : g
      ));

      // Add XP
      addXP(goal.xp_reward, 'daily_goal');
      
      toast.success(`Goal completed! +${goal.xp_reward} XP`);
    } catch (error: any) {
      toast.error('Failed to complete goal');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const completionRate = profile ? Math.round((profile.quests_completed / (profile.quests_completed + activeQuests.length)) * 100) : 0;
  const nextLevelProgress = profile ? Math.round(((profile.xp % 1000) / 1000) * 100) : 0;

  const handleContinueQuest = () => {
    navigate('/skill-tree');
  };

  const handleEnterBattle = () => {
    navigate('/arena');
  };

  const handleBrowseQuests = () => {
    navigate('/skill-tree');
  };

  const handleViewAllQuests = () => {
    navigate('/skill-tree');
  };

  const handleViewFullRankings = () => {
    navigate('/emotions');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Welcome Section */}
      <motion.div 
        variants={itemVariants} 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-cyan/20 p-8 border border-neon-blue/30"
      >
        <div className="absolute inset-0 bg-star-field opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-transparent to-neon-purple/10 animate-pulse-neon"></div>
        
        <div className="relative z-10 text-center">
          <motion.div
            className="inline-flex items-center space-x-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center text-3xl animate-hologram">
              {profile.avatar || '🚀'}
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent font-game">
                Welcome back, {profile.username || 'Jedi'}!
              </h1>
              <p className="text-neon-cyan/80 text-lg font-space">
                Level {profile.level || 1} • {profile.rank || 'Bronze I'} • {profile.streak_days || currentStreak} day streak
              </p>
            </div>
          </motion.div>
          
          <motion.p
            className="text-gray-300 text-lg font-space max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your coding journey continues. Ready to conquer new challenges and expand your skills across the galaxy?
          </motion.p>

          {/* Quick Action Buttons */}
          <motion.div
            className="flex justify-center space-x-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={handleContinueQuest}
              className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg font-bold text-white hover:shadow-lg hover:shadow-neon-blue/25 transition-all duration-300 border border-neon-blue/30 font-space"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="w-5 h-5 inline mr-2" />
              Continue Quest
            </motion.button>
            <motion.button
              onClick={handleEnterBattle}
              className="px-6 py-3 bg-gradient-to-r from-neon-red to-neon-pink rounded-lg font-bold text-white hover:shadow-lg hover:shadow-neon-red/25 transition-all duration-300 border border-neon-red/30 font-space"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Sword className="w-5 h-5 inline mr-2" />
              Enter Battle
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total XP"
          value={profile.total_xp?.toLocaleString() || '0'}
          icon={<Zap className="w-6 h-6 text-neon-yellow" />}
          trend="+125 today"
          color="yellow"
        />
        <StatsCard
          title="Current Level"
          value={profile.level || 1}
          icon={<Crown className="w-6 h-6 text-neon-purple" />}
          trend={`${nextLevelProgress}% to next`}
          color="purple"
        />
        <StatsCard
          title="Day Streak"
          value={profile.streak_days || currentStreak}
          icon={<Flame className="w-6 h-6 text-neon-red" />}
          trend="Personal best!"
          color="pink"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<Target className="w-6 h-6 text-neon-green" />}
          trend="+5% this week"
          color="green"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Goals */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-green/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent animate-pulse-neon"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold flex items-center font-game">
              <Target className="w-5 h-5 mr-2 text-neon-green animate-pulse" />
              Daily Missions
            </h2>
            <span className="text-sm text-neon-green/80 font-space">
              {dailyGoals.filter(g => g.complete).length}/{dailyGoals.length}
            </span>
          </div>

          <div className="space-y-4 relative z-10">
            {dailyGoals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-space">No missions active</p>
                <p className="text-sm font-space">Complete quests to unlock goals!</p>
              </div>
            ) : (
              dailyGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                    goal.completed
                      ? 'bg-neon-green/10 border-neon-green/30'
                      : 'bg-black/20 border-neon-blue/20 hover:border-neon-green/30'
                  }`}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}
                  onClick={() => !goal.completed && goal.current >= goal.target && handleCompleteGoal(goal.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{goal.icon}</span>
                      <h3 className="font-medium text-white font-space">{goal.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {goal.completed && <CheckCircle className="w-4 h-4 text-neon-green" />}
                      <span className="text-sm text-neon-yellow font-bold font-space">
                        +{goal.xp_reward} XP
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 font-space">{goal.description}</p>
                  <div className="w-full bg-black/40 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-neon-green to-neon-cyan h-2 rounded-full relative overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      transition={{ duration: 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-space">
                    <span>{goal.current}/{goal.target}</span>
                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Active Quests */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-cyan/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent animate-pulse-neon"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold flex items-center font-game">
              <TrendingUp className="w-5 h-5 mr-2 text-neon-cyan animate-pulse" />
              Active Quests
            </h2>
            <button 
              onClick={handleViewAllQuests}
              className="text-sm text-neon-cyan hover:text-white transition-colors font-space"
            >
              View All Quests →
            </button>
          </div>

          <div className="grid gap-4 relative z-10">
            {activeQuests.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2 font-game">No Active Quests</h3>
                <p className="mb-4 font-space">Start your coding journey by taking on a quest!</p>
                <motion.button
                  onClick={handleBrowseQuests}
                  className="bg-gradient-to-r from-neon-cyan to-neon-blue px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 border border-neon-cyan/30 font-space"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Quests
                </motion.button>
              </div>
            ) : (
              activeQuests.slice(0, 3).map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Progress Analytics */}
      <motion.div
        variants={itemVariants}
        className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-purple/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent animate-pulse-neon"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-xl font-bold flex items-center font-game">
            <BarChart3 className="w-5 h-5 mr-2 text-neon-purple animate-pulse" />
            Performance Analytics
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-lg text-sm font-space border border-neon-purple/30">
              7 Days
            </button>
            <button className="px-3 py-1 bg-black/20 text-gray-400 rounded-lg text-sm hover:bg-black/40 font-space border border-gray-600">
              30 Days
            </button>
          </div>
        </div>

        <ProgressChart data={engagementMetrics} />
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-yellow/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-yellow/5 to-transparent animate-pulse-neon"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold flex items-center font-game">
              <Award className="w-5 h-5 mr-2 text-neon-yellow animate-pulse" />
              Recent Activity
            </h2>
          </div>

          <div className="space-y-3 relative z-10">
            {xpLogs.length > 0 ? (
              xpLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white font-space">{log.description}</p>
                    <p className="text-xs text-gray-400 font-space">
                      {new Date(log.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-neon-yellow font-bold font-space">+{log.amount} XP</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-space">No recent activity</p>
                <p className="text-sm font-space">Complete quests to earn XP!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard Preview */}
        <motion.div
          variants={itemVariants}
          className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-pink/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 to-transparent animate-pulse-neon"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold flex items-center font-game">
              <Users className="w-5 h-5 mr-2 text-neon-pink animate-pulse" />
              Galaxy Leaderboard
            </h2>
            <button 
              onClick={handleViewFullRankings}
              className="text-sm text-neon-pink hover:text-white transition-colors font-space"
            >
              View Full Rankings →
            </button>
          </div>

          <div className="space-y-3 relative z-10">
            {leaderboard.length > 0 ? (
              leaderboard.slice(0, 5).map((player, index) => (
                <motion.div
                  key={player.rank}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    player.username === profile.username
                      ? 'bg-neon-cyan/10 border-neon-cyan/30'
                      : 'bg-black/20 border-gray-600 hover:border-neon-pink/30'
                  }`}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(236, 72, 153, 0.2)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                        player.rank === 1 ? 'bg-gradient-to-r from-neon-yellow to-neon-orange' :
                        player.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                        player.rank === 3 ? 'bg-gradient-to-r from-neon-orange to-neon-red' :
                        'bg-gradient-to-r from-neon-blue to-neon-cyan'
                      }`}>
                        {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.avatar}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white font-space">#{player.rank}</span>
                          <span className={`font-medium ${
                            player.username === profile.username ? 'text-neon-cyan' : 'text-gray-300'
                          } font-space`}>
                            {player.username}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 font-space">
                          {player.xp?.toLocaleString()} XP
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4 text-neon-red" />
                        <span className="font-medium text-white font-space">{player.streak_days}</span>
                      </div>
                      <div className="text-xs text-gray-400 font-space">Streak</div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-space">No leaderboard data</p>
                <p className="text-sm font-space">Be the first to join!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;