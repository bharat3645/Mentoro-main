import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  Settings, 
  Zap, 
  Trophy,
  Flame,
  Menu,
  Crown,
  Sword,
  Target,
  X,
  LogOut
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { goalsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Refs for click outside detection
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { 
    notifications, 
    currentStreak, 
    toggleSidebar,
    markNotificationRead,
    clearNotifications,
    user
  } = useGameStore();

  // Demo user data
  const profile = user || {
    username: 'Demo User',
    avatar: '🚀',
    level: 5,
    xp: 2450,
    streak_days: 7,
    rank: 'Silver II',
    battles_won: 12,
    quests_completed: 23
  };

  useEffect(() => {
    loadDailyGoals();
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadDailyGoals = async () => {
    try {
      const response = await goalsAPI.getDailyGoals();
      setDailyGoals(response.goals);
    } catch (error) {
      console.error('Error loading daily goals:', error);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: any) => {
    markNotificationRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setShowNotifications(false);
  };

  const handleUserProfileClick = () => {
    navigate('/emotions');
    setShowUserMenu(false);
  };

  const handleSettingsClick = () => {
    navigate('/emotions');
    setShowUserMenu(false);
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      setLoading(true);
      const response = await goalsAPI.completeGoal(goalId);
      toast.success(`Goal completed! +${response.xp_earned} XP`);
      await loadDailyGoals();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to complete goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.nav 
        className="bg-black/40 backdrop-blur-md border-b border-neon-blue/20 px-6 py-4 flex items-center justify-between relative overflow-hidden z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5 animate-pulse-neon"></div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-neon-blue/10 hover:bg-neon-blue/20 transition-all duration-300 border border-neon-blue/30 group"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-neon-blue group-hover:text-white transition-colors" />
          </motion.button>
          
          <div className="flex items-center space-x-6">
            {/* XP Display */}
            <motion.div 
              className="flex items-center space-x-2 bg-gradient-to-r from-neon-yellow/20 to-neon-orange/20 rounded-full px-4 py-2 border border-neon-yellow/30 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}
              onClick={() => navigate('/skill-tree')}
            >
              <Zap className="w-4 h-4 text-neon-yellow animate-pulse" />
              <span className="text-sm font-bold text-white font-space">{profile.xp?.toLocaleString() || 0} XP</span>
            </motion.div>
            
            {/* Level Display */}
            <motion.div 
              className="flex items-center space-x-2 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 rounded-full px-4 py-2 border border-neon-purple/30 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
              onClick={() => navigate('/skill-tree')}
            >
              <Crown className="w-4 h-4 text-neon-purple animate-pulse" />
              <span className="text-sm font-bold text-white font-space">Level {profile.level || 1}</span>
            </motion.div>
            
            {/* Rank Display */}
            <motion.div 
              className="flex items-center space-x-2 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 rounded-full px-4 py-2 border border-neon-cyan/30 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}
              onClick={() => navigate('/emotions')}
            >
              <Trophy className="w-4 h-4 text-neon-cyan animate-pulse" />
              <span className="text-sm font-bold text-white font-space">{profile.rank || 'Unranked'}</span>
            </motion.div>
            
            {/* Streak Display */}
            <motion.div 
              className="flex items-center space-x-2 bg-gradient-to-r from-neon-red/20 to-neon-pink/20 rounded-full px-4 py-2 border border-neon-red/30 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}
              onClick={() => navigate('/')}
            >
              <Flame className="w-4 h-4 text-neon-red animate-pulse" />
              <span className="text-sm font-bold text-white font-space">{profile.streak_days || currentStreak} Day Streak</span>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center space-x-4 relative z-10">
          {/* Battle Stats */}
          <motion.div 
            className="flex items-center space-x-2 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 rounded-full px-3 py-1 border border-neon-green/30 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/arena')}
          >
            <Sword className="w-3 h-3 text-neon-green" />
            <span className="text-xs font-medium text-white font-space">{profile.battles_won || 0}W</span>
          </motion.div>

          {/* Quest Stats */}
          <motion.div 
            className="flex items-center space-x-2 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 rounded-full px-3 py-1 border border-neon-purple/30 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/skill-tree')}
          >
            <Target className="w-3 h-3 text-neon-purple" />
            <span className="text-xs font-medium text-white font-space">{profile.quests_completed || 0}Q</span>
          </motion.div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-neon-blue/10 hover:bg-neon-blue/20 transition-all duration-300 border border-neon-blue/30 group"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-neon-blue group-hover:text-white transition-colors" />
              {unreadNotifications > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-neon-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {unreadNotifications}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Settings */}
          <motion.button
            onClick={handleSettingsClick}
            className="p-2 rounded-lg bg-neon-purple/10 hover:bg-neon-purple/20 transition-all duration-300 border border-neon-purple/30 group"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 text-neon-purple group-hover:text-white transition-colors" />
          </motion.button>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 rounded-lg px-4 py-2 hover:from-neon-cyan/30 hover:to-neon-blue/30 transition-all duration-300 border border-neon-cyan/30 group"
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center text-lg animate-hologram">
                {profile.avatar || '🚀'}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors font-space">
                  {profile.username || 'Player'}
                </p>
                <p className="text-xs text-neon-cyan/80 group-hover:text-white transition-colors font-space">
                  Level {profile.level || 1} • {profile.rank || 'Unranked'}
                </p>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Notifications Dropdown Portal */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              className="absolute right-6 top-20 w-80 bg-black/95 backdrop-blur-xl border border-neon-blue/30 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 212, 255, 0.2)' 
              }}
            >
              <div className="p-6 border-b border-neon-blue/20 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white font-space text-lg">Notifications</h3>
                  <motion.button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-space text-lg">No notifications</p>
                    <p className="font-space text-sm opacity-70">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 border-b border-gray-700/50 cursor-pointer hover:bg-white/5 transition-all duration-300 ${
                        !notification.read ? 'bg-neon-blue/5 border-l-4 border-l-neon-blue' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 8, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{notification.icon || '🔔'}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm font-space mb-1">{notification.title}</h4>
                          <p className="text-gray-400 text-sm font-space leading-relaxed">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-2 font-space">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-4 border-t border-neon-blue/20 bg-black/20">
                  <motion.button
                    onClick={() => {
                      clearNotifications();
                      setShowNotifications(false);
                    }}
                    className="text-sm text-neon-blue hover:text-white transition-colors font-space"
                    whileHover={{ scale: 1.05 }}
                  >
                    Clear all notifications
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Menu Dropdown Portal */}
      <AnimatePresence>
        {showUserMenu && (
          <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUserMenu(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              className="absolute right-6 top-20 w-64 bg-black/95 backdrop-blur-xl border border-neon-cyan/30 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2)' 
              }}
            >
              <div className="p-6 border-b border-neon-cyan/20 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center text-xl">
                    {profile.avatar || '🚀'}
                  </div>
                  <div>
                    <p className="font-bold text-white font-space">{profile.username || 'Player'}</p>
                    <p className="text-sm text-neon-cyan/80 font-space">Level {profile.level || 1}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <motion.button
                  onClick={handleUserProfileClick}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-space"
                  whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  Profile & Analytics
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate('/emotions');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-space"
                  whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  Performance Analytics
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate('/architect');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-space"
                  whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  Contributions
                </motion.button>
                <hr className="my-2 border-gray-600" />
                <motion.button
                  onClick={() => {
                    toast.success('Demo mode - no logout needed');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex items-center font-space"
                  whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Demo Mode
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;