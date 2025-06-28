import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../../store/gameStore';

interface AchievementBadgeProps {
  achievement: Achievement;
}

const rarityColors = {
  common: {
    bg: 'from-gray-400 to-gray-600',
    border: 'border-gray-400/30',
    glow: 'hover:shadow-gray-400/25'
  },
  rare: {
    bg: 'from-neon-blue to-neon-cyan',
    border: 'border-neon-blue/30',
    glow: 'hover:shadow-neon-blue/25'
  },
  epic: {
    bg: 'from-neon-purple to-neon-pink',
    border: 'border-neon-purple/30',
    glow: 'hover:shadow-neon-purple/25'
  },
  legendary: {
    bg: 'from-neon-yellow to-neon-orange',
    border: 'border-neon-yellow/30',
    glow: 'hover:shadow-neon-yellow/25'
  },
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const rarityConfig = rarityColors[achievement.rarity];

  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-gray-600 hover:border-neon-purple/50 transition-all duration-300 text-center relative overflow-hidden group"
      whileHover={{ 
        scale: 1.05, 
        y: -2,
        boxShadow: `0 10px 25px ${rarityConfig.glow.split('/')[1]}`
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.bg} opacity-5 animate-pulse-neon`}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <motion.div
          className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${rarityConfig.bg} flex items-center justify-center text-3xl border-2 ${rarityConfig.border} relative overflow-hidden`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <span className="relative z-10">{achievement.icon}</span>
        </motion.div>
        
        <h3 className="font-bold text-white text-sm mb-1 font-game">
          {achievement.title}
        </h3>
        
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 font-space">
          {achievement.description}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <span className={`px-2 py-1 rounded-full font-bold bg-gradient-to-r ${rarityConfig.bg} text-white border ${rarityConfig.border} font-space`}>
            {achievement.rarity.toUpperCase()}
          </span>
          <span className="text-neon-yellow font-bold font-space">+{achievement.xpReward} XP</span>
        </div>

        {/* Unlock Date */}
        <div className="mt-2 text-xs text-gray-500 font-space">
          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Rarity Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${rarityConfig.bg} opacity-0`}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.div>
  );
};

export default AchievementBadge;