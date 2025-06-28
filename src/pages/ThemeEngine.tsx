import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Monitor, 
  Smartphone,
  Eye,
  Download,
  Star,
  Lock,
  Check
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const ThemeEngine: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('themes');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const { currentTheme, changeTheme, user } = useGameStore();

  const themes = [
    {
      id: 'dark',
      name: 'Neon Dark',
      description: 'The classic dark theme with neon accents',
      preview: 'bg-dark-950',
      colors: ['#0f172a', '#8B5CF6', '#06B6D4', '#EC4899'],
      unlocked: true,
      xpRequired: 0,
      category: 'default'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Futuristic theme with electric blues and magentas',
      preview: 'bg-gradient-to-br from-purple-900 to-blue-900',
      colors: ['#1a0b2e', '#7209b7', '#2d1b69', '#f72585'],
      unlocked: true,
      xpRequired: 500,
      category: 'premium'
    },
    {
      id: 'matrix',
      name: 'Matrix',
      description: 'Green-on-black terminal aesthetic',
      preview: 'bg-gradient-to-br from-black to-green-900',
      colors: ['#000000', '#00ff00', '#008f11', '#00ff41'],
      unlocked: false,
      xpRequired: 1000,
      category: 'premium'
    },
    {
      id: 'sunset',
      name: 'Sunset Coder',
      description: 'Warm oranges and purples for evening coding',
      preview: 'bg-gradient-to-br from-orange-500 to-purple-600',
      colors: ['#1a1a2e', '#ff6b35', '#f7931e', '#9d4edd'],
      unlocked: false,
      xpRequired: 1500,
      category: 'premium'
    },
    {
      id: 'ocean',
      name: 'Deep Ocean',
      description: 'Calming blues and teals for focused coding',
      preview: 'bg-gradient-to-br from-blue-900 to-teal-700',
      colors: ['#0f3460', '#16537e', '#1e6091', '#06b6d4'],
      unlocked: false,
      xpRequired: 2000,
      category: 'premium'
    },
    {
      id: 'forest',
      name: 'Forest',
      description: 'Natural greens for a refreshing coding experience',
      preview: 'bg-gradient-to-br from-green-800 to-emerald-600',
      colors: ['#1b2f1b', '#2d5a2d', '#10b981', '#34d399'],
      unlocked: false,
      xpRequired: 2500,
      category: 'legendary'
    }
  ];

  const avatars = [
    {
      id: 'robot',
      name: 'Cyber Robot',
      emoji: '🤖',
      unlocked: true,
      xpRequired: 0,
      rarity: 'common'
    },
    {
      id: 'ninja',
      name: 'Code Ninja',
      emoji: '🥷',
      unlocked: true,
      xpRequired: 300,
      rarity: 'common'
    },
    {
      id: 'wizard',
      name: 'Code Wizard',
      emoji: '🧙‍♂️',
      unlocked: false,
      xpRequired: 800,
      rarity: 'rare'
    },
    {
      id: 'dragon',
      name: 'Code Dragon',
      emoji: '🐉',
      unlocked: false,
      xpRequired: 1500,
      rarity: 'epic'
    },
    {
      id: 'phoenix',
      name: 'Phoenix Coder',
      emoji: '🔥',
      unlocked: false,
      xpRequired: 3000,
      rarity: 'legendary'
    }
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600'
  };

  const categories = [
    { id: 'themes', name: 'Themes', icon: <Palette className="w-5 h-5" /> },
    { id: 'avatars', name: 'Avatars', icon: <Eye className="w-5 h-5" /> }
  ];

  const unlockTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme && user && user.xp >= theme.xpRequired) {
      // In a real app, this would deduct XP and unlock the theme
      console.log(`Unlocking theme: ${theme.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-2">
          Theme Engine
        </h1>
        <p className="text-gray-400 text-lg">
          Customize your coding environment and unlock new looks
        </p>
      </motion.div>

      {/* Category Selector */}
      <motion.div
        className="flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.icon}
            <span>{category.name}</span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedCategory === 'themes' && (
          <motion.div
            key="themes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Theme Grid */}
            <div className="lg:col-span-2">
              <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Available Themes</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Your XP: {user?.xp || 0}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                        currentTheme === theme.id
                          ? 'bg-neon-purple/10 border-neon-purple/50'
                          : theme.unlocked
                          ? 'bg-dark-900/50 border-dark-600 hover:border-gray-500'
                          : 'bg-dark-900/20 border-dark-700 opacity-60'
                      }`}
                      whileHover={theme.unlocked ? { scale: 1.02 } : {}}
                      whileTap={theme.unlocked ? { scale: 0.98 } : {}}
                      onClick={() => theme.unlocked && changeTheme(theme.id)}
                    >
                      {/* Theme Preview */}
                      <div className={`w-full h-24 rounded-lg mb-3 ${theme.preview} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                        <div className="absolute bottom-2 left-2 flex space-x-1">
                          {theme.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        {currentTheme === theme.id && (
                          <div className="absolute top-2 right-2">
                            <Check className="w-5 h-5 text-neon-green" />
                          </div>
                        )}
                      </div>

                      {/* Theme Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white">{theme.name}</h3>
                          {theme.category === 'legendary' && (
                            <Star className="w-4 h-4 text-neon-yellow" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{theme.description}</p>
                        
                        {!theme.unlocked && (
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-neon-yellow">
                              {theme.xpRequired} XP required
                            </span>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                unlockTheme(theme.id);
                              }}
                              disabled={(user?.xp || 0) < theme.xpRequired}
                              className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded text-xs hover:bg-neon-purple/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Unlock
                            </motion.button>
                          </div>
                        )}
                      </div>

                      {!theme.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 rounded-lg">
                          <Lock className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Theme Preview */}
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Preview</h3>
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-lg transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : 'bg-dark-700 text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Monitor className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-lg transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : 'bg-dark-700 text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Smartphone className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Mock UI Preview */}
              <div className={`${previewDevice === 'mobile' ? 'max-w-xs mx-auto' : ''}`}>
                <div className="bg-dark-900 rounded-lg p-4 border border-dark-600">
                  {/* Mock Header */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full" />
                      <span className="text-sm font-medium">AI Quest</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-neon-pink rounded-full" />
                      <div className="w-3 h-3 bg-neon-yellow rounded-full" />
                      <div className="w-3 h-3 bg-neon-green rounded-full" />
                    </div>
                  </div>

                  {/* Mock Content */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-neon-cyan rounded" />
                      <div className="h-2 bg-gray-600 rounded flex-1" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-neon-purple rounded" />
                      <div className="h-2 bg-gray-600 rounded flex-1" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-neon-pink rounded" />
                      <div className="h-2 bg-gray-600 rounded flex-1" />
                    </div>
                  </div>

                  {/* Mock Button */}
                  <div className="mt-4">
                    <div className="w-full h-8 bg-gradient-to-r from-neon-purple to-neon-cyan rounded" />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Theme
                </motion.button>
                
                <motion.button
                  className="w-full py-2 bg-dark-700 hover:bg-dark-600 rounded-lg font-medium text-white transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Theme
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {selectedCategory === 'avatars' && (
          <motion.div
            key="avatars"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-8 border border-dark-700"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Avatar Collection</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {avatars.map((avatar) => (
                <motion.div
                  key={avatar.id}
                  className={`relative p-6 rounded-xl border text-center cursor-pointer transition-all ${
                    avatar.unlocked
                      ? 'bg-dark-900/50 border-dark-600 hover:border-neon-purple/50'
                      : 'bg-dark-900/20 border-dark-700 opacity-60'
                  }`}
                  whileHover={avatar.unlocked ? { scale: 1.05, y: -5 } : {}}
                  whileTap={avatar.unlocked ? { scale: 0.95 } : {}}
                >
                  {/* Rarity Glow */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${rarityColors[avatar.rarity as keyof typeof rarityColors]} opacity-10`} />
                  
                  <div className="relative">
                    <div className="text-4xl mb-3">{avatar.emoji}</div>
                    <h3 className="font-medium text-white mb-1">{avatar.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${rarityColors[avatar.rarity as keyof typeof rarityColors]} text-white`}>
                      {avatar.rarity}
                    </span>
                    
                    {!avatar.unlocked && (
                      <div className="mt-3">
                        <div className="text-xs text-neon-yellow mb-2">
                          {avatar.xpRequired} XP
                        </div>
                        <motion.button
                          disabled={(user?.xp || 0) < avatar.xpRequired}
                          className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded text-xs hover:bg-neon-purple/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Unlock
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {!avatar.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 rounded-xl">
                      <Lock className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeEngine;