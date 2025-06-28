/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        space: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Professional developer-preferred neon palette
        neon: {
          blue: '#00d4ff',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          green: '#10b981',
          pink: '#ec4899',
          yellow: '#f59e0b',
          red: '#ef4444',
          orange: '#f97316',
          indigo: '#6366f1',
          emerald: '#059669',
          lime: '#65a30d',
          amber: '#d97706',
          rose: '#e11d48',
          violet: '#7c3aed',
          sky: '#0284c7',
          teal: '#0d9488',
        },
        // Professional gradients
        gradient: {
          primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          warning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          danger: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        },
        saber: {
          blue: '#4fc3f7',
          red: '#f44336',
          green: '#4caf50',
          purple: '#9c27b0',
        }
      },
      fontFamily: {
        'game': ['Orbitron', 'monospace'],
        'space': ['Inter', 'system-ui', 'sans-serif'],
        'code': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'saber-glow': 'saber-glow 1.5s ease-in-out infinite alternate',
        'hologram': 'hologram 3s ease-in-out infinite',
        'particle': 'particle 4s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'code-typing': 'code-typing 3s steps(40) infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite alternate',
        'magnetic': 'magnetic 2s ease-in-out infinite',
        'aurora': 'aurora 8s ease-in-out infinite',
        'cyber-pulse': 'cyber-pulse 1.5s ease-in-out infinite',
        'data-flow': 'data-flow 3s linear infinite',
        'neural-network': 'neural-network 4s ease-in-out infinite',
        'quantum-flicker': 'quantum-flicker 0.1s ease-in-out infinite',
        'energy-surge': 'energy-surge 2s ease-in-out infinite',
        'holographic-shift': 'holographic-shift 3s ease-in-out infinite',
        'neon-breathe': 'neon-breathe 3s ease-in-out infinite',
        'electric-arc': 'electric-arc 1s ease-in-out infinite',
        'plasma-wave': 'plasma-wave 4s ease-in-out infinite',
        'digital-rain': 'digital-rain 15s linear infinite',
        'circuit-trace': 'circuit-trace 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            opacity: 1,
            boxShadow: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor',
          },
          '50%': {
            opacity: 0.8,
            boxShadow: '0 0 40px currentColor, 0 0 80px currentColor, 0 0 120px currentColor',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          from: { textShadow: '0 0 10px currentColor' },
          to: { textShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'saber-glow': {
          from: { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            filter: 'brightness(1)'
          },
          to: { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            filter: 'brightness(1.2)'
          },
        },
        'hologram': {
          '0%, 100%': { opacity: 0.8, transform: 'translateY(0px)' },
          '50%': { opacity: 1, transform: 'translateY(-2px)' },
        },
        'particle': {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: 0 },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'scale-in': {
          from: { transform: 'scale(0.9)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'code-typing': {
          '0%': { width: '0ch' },
          '100%': { width: '40ch' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'magnetic': {
          '0%, 100%': { transform: 'translateX(0) scale(1)' },
          '50%': { transform: 'translateX(2px) scale(1.02)' },
        },
        'aurora': {
          '0%, 100%': { 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            transform: 'rotate(0deg)'
          },
          '25%': { 
            background: 'linear-gradient(45deg, #f093fb, #f5576c)',
            transform: 'rotate(90deg)'
          },
          '50%': { 
            background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
            transform: 'rotate(180deg)'
          },
          '75%': { 
            background: 'linear-gradient(45deg, #43e97b, #38f9d7)',
            transform: 'rotate(270deg)'
          },
        },
        'cyber-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
            borderColor: 'rgba(0, 212, 255, 0.5)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 212, 255, 1), 0 0 60px rgba(139, 92, 246, 0.5)',
            borderColor: 'rgba(0, 212, 255, 1)'
          },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'neural-network': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
        'quantum-flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'energy-surge': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '50%': { transform: 'scaleX(1)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(0)', transformOrigin: 'right' },
        },
        'holographic-shift': {
          '0%, 100%': { 
            background: 'linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(139, 92, 246, 0.1))',
            transform: 'translateX(0)'
          },
          '50%': { 
            background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
            transform: 'translateX(2px)'
          },
        },
        'neon-breathe': {
          '0%, 100%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor',
            filter: 'brightness(1)'
          },
          '50%': { 
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            filter: 'brightness(1.2)'
          },
        },
        'electric-arc': {
          '0%, 100%': { 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          },
          '25%': { 
            clipPath: 'polygon(0 0, 95% 5%, 100% 100%, 5% 95%)'
          },
          '50%': { 
            clipPath: 'polygon(5% 0, 100% 5%, 95% 100%, 0 95%)'
          },
          '75%': { 
            clipPath: 'polygon(0 5%, 95% 0, 100% 95%, 5% 100%)'
          },
        },
        'plasma-wave': {
          '0%': { 
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)',
            transform: 'translateX(-100%)'
          },
          '100%': { 
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)',
            transform: 'translateX(100%)'
          },
        },
        'digital-rain': {
          '0%': { transform: 'translateY(-100vh)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(100vh)', opacity: 0 },
        },
        'circuit-trace': {
          '0%': { 
            strokeDasharray: '0 100',
            stroke: 'rgba(0, 212, 255, 0)'
          },
          '50%': { 
            strokeDasharray: '50 50',
            stroke: 'rgba(0, 212, 255, 1)'
          },
          '100%': { 
            strokeDasharray: '100 0',
            stroke: 'rgba(0, 212, 255, 0.5)'
          },
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0c0c0c 100%)',
        'nebula': 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 35%, rgba(0, 0, 0, 0.8) 70%)',
        'star-field': 'radial-gradient(2px 2px at 20px 30px, #eee, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent), radial-gradient(2px 2px at 160px 30px, #ddd, transparent)',
        'cyber-grid': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
        'neural-network': 'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 212, 255, 0.2) 0%, transparent 50%)',
        'quantum-field': 'conic-gradient(from 0deg at 50% 50%, rgba(0, 212, 255, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(0, 212, 255, 0.1))',
        'holographic': 'linear-gradient(45deg, rgba(0, 212, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(236, 72, 153, 0.1) 50%, rgba(245, 158, 11, 0.1) 75%, rgba(0, 212, 255, 0.1) 100%)',
        'matrix-code': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
        'energy-flow': 'linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.5) 50%, transparent 100%)',
        'plasma-burst': 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.4) 0%, rgba(0, 212, 255, 0.2) 50%, transparent 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon-sm': '0 0 10px currentColor',
        'neon': '0 0 20px currentColor',
        'neon-lg': '0 0 40px currentColor',
        'neon-xl': '0 0 60px currentColor',
        'cyber': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
        'hologram': '0 0 30px rgba(0, 212, 255, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.1)',
        'quantum': '0 0 50px rgba(139, 92, 246, 0.4), 0 0 100px rgba(0, 212, 255, 0.2)',
      },
      backgroundSize: {
        'grid': '50px 50px',
        'neural': '200px 200px',
        'matrix': '20px 20px',
      },
      filter: {
        'neon': 'drop-shadow(0 0 10px currentColor)',
        'cyber': 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.5))',
        'hologram': 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))',
      },
      transitionTimingFunction: {
        'cyber': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'quantum': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'neural': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
};