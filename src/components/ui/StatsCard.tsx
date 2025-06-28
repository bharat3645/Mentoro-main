import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: 'yellow' | 'purple' | 'pink' | 'green' | 'cyan';
}

const colorMap = {
  yellow: {
    bg: 'from-neon-yellow/20 to-neon-orange/10',
    border: 'border-neon-yellow/30',
    glow: 'hover:shadow-neon-yellow/25'
  },
  purple: {
    bg: 'from-neon-purple/20 to-neon-pink/10',
    border: 'border-neon-purple/30',
    glow: 'hover:shadow-neon-purple/25'
  },
  pink: {
    bg: 'from-neon-pink/20 to-neon-red/10',
    border: 'border-neon-pink/30',
    glow: 'hover:shadow-neon-pink/25'
  },
  green: {
    bg: 'from-neon-green/20 to-neon-cyan/10',
    border: 'border-neon-green/30',
    glow: 'hover:shadow-neon-green/25'
  },
  cyan: {
    bg: 'from-neon-cyan/20 to-neon-blue/10',
    border: 'border-neon-cyan/30',
    glow: 'hover:shadow-neon-cyan/25'
  },
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color }) => {
  const colorConfig = colorMap[color];

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorConfig.bg} p-6 rounded-xl border ${colorConfig.border} backdrop-blur-md relative overflow-hidden group`}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 10px 30px ${colorConfig.glow.split('/')[1]}`
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-gray-300 text-sm font-medium font-space mb-1">{title}</p>
          <motion.p
            className="text-3xl font-bold text-white font-game"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
          {trend && (
            <motion.p
              className="text-sm text-gray-300 mt-1 font-space"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {trend}
            </motion.p>
          )}
        </div>
        <motion.div
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Pulse Effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colorConfig.bg} opacity-0`}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.div>
  );
};

export default StatsCard;