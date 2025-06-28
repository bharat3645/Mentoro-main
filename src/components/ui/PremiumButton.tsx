import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  glowEffect?: boolean;
  magneticEffect?: boolean;
  soundEffect?: boolean;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  glowEffect = true,
  magneticEffect = true,
  soundEffect = false,
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white border-neon-blue/30 hover:shadow-cyber',
    secondary: 'bg-gradient-to-r from-neon-purple to-neon-pink text-white border-neon-purple/30 hover:shadow-hologram',
    success: 'bg-gradient-to-r from-neon-green to-neon-emerald text-white border-neon-green/30 hover:shadow-neon-lg',
    warning: 'bg-gradient-to-r from-neon-yellow to-neon-amber text-black border-neon-yellow/30 hover:shadow-neon-lg',
    danger: 'bg-gradient-to-r from-neon-red to-neon-rose text-white border-neon-red/30 hover:shadow-neon-lg',
    ghost: 'bg-transparent text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan/10 hover:shadow-neon',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const handleClick = () => {
    if (soundEffect) {
      // Add sound effect here if needed
    }
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-md font-space font-medium
        transition-all duration-300 ease-cyber
        ${variants[variant]}
        ${sizes[size]}
        ${magneticEffect ? 'magnetic' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        ${glowEffect ? 'hover:shadow-quantum' : ''}
        ${className}
      `}
      whileHover={!disabled ? { 
        scale: magneticEffect ? 1.05 : 1.02,
        boxShadow: glowEffect ? '0 0 30px currentColor' : undefined,
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Glow Effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0"
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <motion.div
            className={`border-2 border-current border-t-transparent rounded-full ${iconSizes[size]}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={iconSizes[size]} />
            )}
            <span>{children}</span>
            {Icon && iconPosition === 'right' && (
              <Icon className={iconSizes[size]} />
            )}
          </>
        )}
      </div>

      {/* Quantum Particles */}
      {glowEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-current rounded-full opacity-0"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
              }}
              whileHover={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
};

export default PremiumButton;