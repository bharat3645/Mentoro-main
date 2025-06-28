import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Star, 
  Trophy, 
  Target, 
  Flame,
  Crown,
  Rocket,
  Brain,
  Heart,
  Eye,
  Lightbulb,
  Code,
  Coffee,
  Music,
  Gamepad2,
  Award,
  Gift,
  Gem,
  Magic,
  Wand2
} from 'lucide-react';

// Floating Achievement Notifications
export const FloatingAchievement: React.FC<{ 
  achievement: { title: string; icon: string; xp: number; color: string };
  onComplete: () => void;
}> = ({ achievement, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed top-20 right-6 z-[9999] pointer-events-none"
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        y: [0, -10, 0]
      }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ 
        duration: 0.6,
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div className={`bg-gradient-to-r ${achievement.color} p-4 rounded-xl border border-white/20 shadow-quantum backdrop-blur-xl`}>
        <div className="flex items-center space-x-3">
          <motion.div
            className="text-3xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {achievement.icon}
          </motion.div>
          <div>
            <h3 className="font-bold text-white font-game">Achievement Unlocked!</h3>
            <p className="text-sm text-white/90 font-space">{achievement.title}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Zap className="w-3 h-3 text-yellow-300" />
              <span className="text-xs font-bold text-yellow-300">+{achievement.xp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Particle System
export const ParticleSystem: React.FC<{ 
  count?: number; 
  colors?: string[];
  speed?: 'slow' | 'medium' | 'fast';
}> = ({ 
  count = 20, 
  colors = ['neon-blue', 'neon-purple', 'neon-cyan', 'neon-pink'],
  speed = 'medium'
}) => {
  const speedMap = {
    slow: '8s',
    medium: '5s',
    fast: '3s'
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 bg-${colors[i % colors.length]} rounded-full opacity-60`}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: speedMap[speed],
          }}
          animate={{
            y: ['-100vh', '100vh'],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: parseInt(speedMap[speed]),
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Magnetic Cursor Effect
export const MagneticCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('magnetic')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] mix-blend-difference"
      animate={{
        x: mousePosition.x - 10,
        y: mousePosition.y - 10,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <div className="w-5 h-5 bg-white rounded-full opacity-50" />
    </motion.div>
  );
};

// Progress Celebration
export const ProgressCelebration: React.FC<{ 
  progress: number; 
  onMilestone?: (milestone: number) => void;
}> = ({ progress, onMilestone }) => {
  const [lastMilestone, setLastMilestone] = useState(0);

  useEffect(() => {
    const milestone = Math.floor(progress / 25) * 25;
    if (milestone > lastMilestone && milestone > 0) {
      setLastMilestone(milestone);
      onMilestone?.(milestone);
    }
  }, [progress, lastMilestone, onMilestone]);

  return (
    <div className="relative">
      <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink relative overflow-hidden"
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
      
      {/* Milestone Sparks */}
      <AnimatePresence>
        {[25, 50, 75, 100].map(milestone => (
          progress >= milestone && (
            <motion.div
              key={milestone}
              className="absolute top-0 bg-neon-yellow rounded-full"
              style={{ left: `${milestone}%` }}
              initial={{ scale: 0, y: 0 }}
              animate={{ 
                scale: [0, 1.5, 1],
                y: [0, -20, -10],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-neon-yellow" />
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

// Ambient Sound Visualizer
export const SoundVisualizer: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-neon-cyan rounded-full"
          animate={isActive ? {
            height: [4, 16, 8, 20, 6],
            opacity: [0.4, 1, 0.6, 1, 0.5],
          } : { height: 4, opacity: 0.3 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Typing Effect
export const TypingEffect: React.FC<{ 
  text: string; 
  speed?: number;
  onComplete?: () => void;
}> = ({ text, speed = 50, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className="font-code">
      {displayText}
      <motion.span
        className="inline-block w-0.5 h-5 bg-neon-cyan ml-1"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </span>
  );
};

// Holographic Card
export const HolographicCard: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-xl border border-neon-blue/20 ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(0, 212, 255, 0.3) 0%, transparent 50%)`,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Energy Orb
export const EnergyOrb: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ size = 'md', color = 'neon-blue', intensity = 'medium' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const intensityMap = {
    low: '0 0 20px',
    medium: '0 0 40px',
    high: '0 0 60px'
  };

  return (
    <motion.div
      className={`${sizeMap[size]} rounded-full bg-gradient-to-r from-${color} to-${color} relative`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        boxShadow: `${intensityMap[intensity]} currentColor`,
        filter: 'blur(1px)',
      }}
    >
      <motion.div
        className="absolute inset-2 rounded-full bg-white/20"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

// Neural Network Background
export const NeuralNetwork: React.FC = () => {
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
      <svg className="w-full h-full">
        {nodes.map((node, i) => (
          <g key={node.id}>
            {/* Connections */}
            {nodes.slice(i + 1).map((otherNode, j) => {
              const distance = Math.sqrt(
                Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
              );
              if (distance < 30) {
                return (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${otherNode.x}%`}
                    y2={`${otherNode.y}%`}
                    stroke="rgba(0, 212, 255, 0.3)"
                    strokeWidth="1"
                    animate={{
                      opacity: [0.1, 0.5, 0.1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                );
              }
              return null;
            })}
            
            {/* Nodes */}
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="3"
              fill="rgba(0, 212, 255, 0.6)"
              animate={{
                r: [2, 4, 2],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

// Quantum Dots
export const QuantumDots: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-neon-cyan rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Glitch Text Effect
export const GlitchText: React.FC<{ 
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, intensity = 'medium' }) => {
  const intensityMap = {
    low: 0.1,
    medium: 0.3,
    high: 0.5,
  };

  return (
    <motion.div
      className="relative inline-block"
      animate={{
        x: [0, -1, 1, 0],
        y: [0, 1, -1, 0],
      }}
      transition={{
        duration: 0.2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{
        filter: `hue-rotate(${Math.random() * 360}deg)`,
      }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 text-neon-cyan opacity-50"
        animate={{
          x: [0, 2, -2, 0],
          opacity: [0, intensityMap[intensity], 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 2,
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-neon-pink opacity-50"
        animate={{
          x: [0, -2, 2, 0],
          opacity: [0, intensityMap[intensity], 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 2 + 0.5,
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
};