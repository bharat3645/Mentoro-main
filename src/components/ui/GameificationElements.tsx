import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Flame,
  Award,
  Gem,
  Shield,
  Sword,
  Magic,
  Sparkles,
  Gift,
  Heart,
  Brain,
  Rocket,
  Lightning,
  Gamepad2
} from 'lucide-react';

// XP Burst Animation
export const XPBurst: React.FC<{ 
  amount: number; 
  onComplete: () => void;
  position?: { x: number; y: number };
}> = ({ amount, onComplete, position = { x: 50, y: 50 } }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        y: [0, -50, -100],
      }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-2 bg-gradient-to-r from-neon-yellow to-neon-orange px-4 py-2 rounded-full border border-neon-yellow/50 shadow-quantum">
        <Zap className="w-5 h-5 text-white" />
        <span className="font-bold text-white font-game">+{amount} XP</span>
      </div>
      
      {/* Particle Burst */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-neon-yellow rounded-full"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, Math.cos(i * 45 * Math.PI / 180) * 40],
            y: [0, Math.sin(i * 45 * Math.PI / 180) * 40],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
};

// Level Up Celebration
export const LevelUpCelebration: React.FC<{ 
  newLevel: number; 
  onComplete: () => void;
}> = ({ newLevel, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Celebration Content */}
      <motion.div
        className="relative text-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Crown */}
        <motion.div
          className="mx-auto mb-6"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Crown className="w-24 h-24 text-neon-yellow drop-shadow-neon" />
        </motion.div>
        
        {/* Level Up Text */}
        <motion.h1
          className="text-6xl font-bold bg-gradient-to-r from-neon-yellow via-neon-orange to-neon-red bg-clip-text text-transparent mb-4 font-game"
          animate={{ 
            scale: [1, 1.05, 1],
            textShadow: [
              '0 0 20px rgba(245, 158, 11, 0.5)',
              '0 0 40px rgba(245, 158, 11, 0.8)',
              '0 0 20px rgba(245, 158, 11, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          LEVEL UP!
        </motion.h1>
        
        <motion.p
          className="text-3xl text-white mb-8 font-space"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          You reached Level {newLevel}!
        </motion.p>
        
        {/* Fireworks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-neon-yellow rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * 30 * Math.PI / 180) * 200],
              y: [0, Math.sin(i * 30 * Math.PI / 180) * 200],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 2,
              delay: 1 + (i * 0.1),
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Streak Counter
export const StreakCounter: React.FC<{ 
  streak: number;
  maxStreak?: number;
}> = ({ streak, maxStreak = 30 }) => {
  const progress = Math.min((streak / maxStreak) * 100, 100);
  
  return (
    <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-neon-red/30">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Flame className="w-8 h-8 text-neon-red" />
      </motion.div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-white font-game">Streak</span>
          <span className="text-neon-red font-bold font-space">{streak} days</span>
        </div>
        
        <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-red to-neon-orange relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Achievement Toast
export const AchievementToast: React.FC<{ 
  achievement: {
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xp: number;
  };
  onClose: () => void;
}> = ({ achievement, onClose }) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-neon-blue to-neon-cyan',
    epic: 'from-neon-purple to-neon-pink',
    legendary: 'from-neon-yellow to-neon-orange',
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed top-20 right-6 z-[9999] max-w-sm"
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} p-1 rounded-xl`}>
        <div className="bg-black/90 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <motion.div
              className="text-3xl"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {achievement.icon}
            </motion.div>
            
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1 font-game">
                Achievement Unlocked!
              </h3>
              <p className="text-sm text-white/90 mb-1 font-space">
                {achievement.title}
              </p>
              <p className="text-xs text-white/70 mb-2 font-space">
                {achievement.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white font-space`}>
                  {achievement.rarity.toUpperCase()}
                </span>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-neon-yellow" />
                  <span className="text-xs font-bold text-neon-yellow font-space">
                    +{achievement.xp} XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Combo Multiplier
export const ComboMultiplier: React.FC<{ 
  combo: number;
  multiplier: number;
}> = ({ combo, multiplier }) => {
  if (combo < 2) return null;

  return (
    <motion.div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: [0, 1.2, 1],
        rotate: [0, 5, -5, 0],
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div className="bg-gradient-to-r from-neon-purple to-neon-pink p-4 rounded-xl border border-white/20 shadow-quantum backdrop-blur-xl text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            textShadow: [
              '0 0 10px rgba(236, 72, 153, 0.5)',
              '0 0 20px rgba(236, 72, 153, 0.8)',
              '0 0 10px rgba(236, 72, 153, 0.5)',
            ],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <h2 className="text-3xl font-bold text-white mb-1 font-game">
            {combo}x COMBO!
          </h2>
          <p className="text-lg text-white/90 font-space">
            {multiplier}x XP Multiplier
          </p>
        </motion.div>
        
        {/* Lightning Effects */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-8 bg-neon-yellow"
            style={{
              left: `${20 + i * 12}%`,
              top: '50%',
              transformOrigin: 'bottom',
            }}
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Power-Up Notification
export const PowerUpNotification: React.FC<{ 
  powerUp: {
    name: string;
    icon: string;
    duration: number;
    effect: string;
  };
  onComplete: () => void;
}> = ({ powerUp, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed top-32 right-6 z-[9999] pointer-events-none"
      initial={{ opacity: 0, x: 100, rotate: 10 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        rotate: 0,
        y: [0, -5, 0],
      }}
      exit={{ opacity: 0, x: 100, rotate: -10 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div className="bg-gradient-to-r from-neon-green to-neon-cyan p-4 rounded-xl border border-white/20 shadow-quantum backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <motion.div
            className="text-2xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {powerUp.icon}
          </motion.div>
          
          <div>
            <h3 className="font-bold text-white font-game">Power-Up!</h3>
            <p className="text-sm text-white/90 font-space">{powerUp.name}</p>
            <p className="text-xs text-white/70 font-space">{powerUp.effect}</p>
          </div>
        </div>
        
        {/* Duration Bar */}
        <motion.div
          className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden"
          initial={{ width: '100%' }}
        >
          <motion.div
            className="h-full bg-white"
            animate={{ width: '0%' }}
            transition={{ duration: powerUp.duration, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};