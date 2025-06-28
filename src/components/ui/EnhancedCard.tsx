import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, Zap } from 'lucide-react';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'holographic' | 'neon' | 'quantum' | 'cyber';
  interactive?: boolean;
  glowOnHover?: boolean;
  tiltEffect?: boolean;
  particleEffect?: boolean;
  borderAnimation?: boolean;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = true,
  glowOnHover = true,
  tiltEffect = true,
  particleEffect = false,
  borderAnimation = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const variants = {
    default: 'bg-black/40 backdrop-blur-xl border-neon-blue/20',
    holographic: 'bg-black/30 backdrop-blur-xl border-neon-purple/30 bg-holographic',
    neon: 'bg-black/50 backdrop-blur-xl border-neon-cyan/40',
    quantum: 'bg-black/20 backdrop-blur-xl border-neon-pink/30 bg-quantum-field',
    cyber: 'bg-black/60 backdrop-blur-xl border-neon-green/30 bg-cyber-grid bg-grid',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEffect) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const tiltStyle = tiltEffect ? {
    transform: `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg)`,
  } : {};

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-500 ease-cyber
        ${variants[variant]}
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={interactive ? { 
        scale: 1.02,
        boxShadow: glowOnHover ? '0 0 40px rgba(0, 212, 255, 0.3)' : undefined,
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Animated Border */}
      {borderAnimation && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `conic-gradient(from 0deg, transparent, rgba(0, 212, 255, 0.5), transparent)`,
            padding: '2px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-black/40 rounded-2xl" />
        </motion.div>
      )}

      {/* Holographic Overlay */}
      {variant === 'holographic' && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)`,
          }}
          animate={{
            background: [
              `radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.4) 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      )}

      {/* Particle Effect */}
      {particleEffect && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-cyan rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      )}

      {/* Quantum Glow */}
      {variant === 'quantum' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-pink/10 to-neon-cyan/10"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Energy Flow */}
      {variant === 'cyber' && isHovered && (
        <motion.div
          className="absolute inset-0 bg-energy-flow"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neon-cyan/50 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neon-cyan/50 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-neon-cyan/50 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neon-cyan/50 rounded-br-2xl" />
    </motion.div>
  );
};

export default EnhancedCard;