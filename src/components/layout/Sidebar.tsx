import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Swords,
  TreePine,
  Wrench,
  Bot,
  Layers,
  GitPullRequest,
  BarChart3,
  Gamepad2,
  Zap,
  Crown
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description: string;
  color: string;
}

const navItems: NavItem[] = [
  {
    name: 'Command Center',
    path: '/',
    icon: Home,
    description: 'Your mission control hub',
    color: 'neon-blue'
  },
  {
    name: 'Battle Arena',
    path: '/arena',
    icon: Swords,
    description: 'Duel other code warriors',
    color: 'neon-red'
  },
  {
    name: 'Skill Nexus',
    path: '/skill-tree',
    icon: TreePine,
    description: 'Your learning constellation',
    color: 'neon-green'
  },
  {
    name: 'Project Forge',
    path: '/diy',
    icon: Wrench,
    description: 'AI-powered build quests',
    color: 'neon-orange'
  },
  {
    name: 'AI Companion',
    path: '/ai-buddy',
    icon: Bot,
    description: 'Your coding mentor',
    color: 'neon-purple'
  },
  {
    name: 'Card Nexus',
    path: '/flashcards',
    icon: Layers,
    description: 'Collect & battle with cards',
    color: 'neon-pink'
  },
  {
    name: 'Code Architect',
    path: '/architect',
    icon: GitPullRequest,
    description: 'Contribute to the galaxy',
    color: 'neon-cyan'
  },
  {
    name: 'Mind Palace',
    path: '/emotions',
    icon: BarChart3,
    description: 'Emotion & performance analytics',
    color: 'neon-yellow'
  }
];

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, currentStreak, user } = useGameStore();

  // Demo user data
  const demoUser = user || {
    username: 'Demo User',
    avatar: '🚀',
    level: 5,
    xp: 2450,
    rank: 'Silver II'
  };

  return (
    <AnimatePresence>
      <motion.aside
        className="bg-black/60 backdrop-blur-md border-r border-neon-blue/20 flex flex-col relative overflow-hidden"
        initial={{ width: sidebarCollapsed ? 80 : 320 }}
        animate={{ width: sidebarCollapsed ? 80 : 320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 via-transparent to-neon-purple/5 animate-pulse-neon"></div>
        
        {/* Logo */}
        <div className="p-6 border-b border-neon-blue/20 relative z-10">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center relative overflow-hidden"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/50 to-neon-purple/50 animate-pulse"></div>
              <Gamepad2 className="w-7 h-7 text-white relative z-10" />
            </motion.div>
            
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent font-game">
                    AI QUEST
                  </h1>
                  <p className="text-xs text-neon-cyan/80 font-space">Code • Battle • Evolve</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* User Stats Preview */}
        {!sidebarCollapsed && (
          <motion.div
            className="p-4 border-b border-neon-blue/20 relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-lg p-3 border border-neon-blue/20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center text-sm">
                  {demoUser.avatar || '🚀'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{demoUser.username || 'Jedi'}</p>
                  <p className="text-xs text-neon-cyan/80">Level {demoUser.level || 1}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-neon-yellow" />
                  <span className="text-white">{demoUser.xp?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-neon-purple" />
                  <span className="text-white">{demoUser.rank || 'Bronze'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/10 text-white border border-neon-purple/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                } ${sidebarCollapsed ? 'p-3 justify-center' : 'p-3'}`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    className={`${isActive ? 'text-neon-purple' : 'group-hover:text-neon-cyan'} transition-colors relative`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <item.icon className="w-5 h-5" />
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-neon-purple rounded-full blur-lg opacity-30"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                  
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.div
                        className="ml-3 flex-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="font-medium font-space">{item.name}</p>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400 font-space">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {item.badge && (
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          className="ml-auto px-2 py-1 bg-neon-pink/20 text-neon-pink rounded-full text-xs font-bold border border-neon-pink/30"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Tooltip for collapsed sidebar */}
                  {sidebarCollapsed && (
                    <motion.div
                      className="absolute left-full ml-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-neon-blue/30 backdrop-blur-md"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0, x: 0 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="font-medium font-space">{item.name}</div>
                      <div className="text-xs text-gray-400 font-space">{item.description}</div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-neon-blue rotate-45"></div>
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neon-blue/20 relative z-10">
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-xs text-gray-500 mb-2 font-space">
                  Daily Progress
                </div>
                <motion.div
                  className="w-full bg-black/40 rounded-full h-2 mb-2 border border-neon-blue/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.div
                    className="bg-gradient-to-r from-neon-blue to-neon-cyan h-2 rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </motion.div>
                </motion.div>
                <div className="text-xs text-neon-cyan font-space">75% Complete</div>
                <div className="text-xs text-gray-400 mt-1 font-space">
                  {currentStreak} day streak • Keep going!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;