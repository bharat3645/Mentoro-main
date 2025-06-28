import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, BookOpen, Code, Trophy, Target, Brain, Rocket } from 'lucide-react';
import { Quest, useGameStore } from '../../store/gameStore';

interface QuestCardProps {
  quest: Quest;
}

const difficultyColors = {
  beginner: {
    text: 'text-neon-green',
    border: 'border-neon-green/30',
    bg: 'bg-neon-green/10',
    glow: 'hover:shadow-neon-green/25'
  },
  intermediate: {
    text: 'text-neon-yellow',
    border: 'border-neon-yellow/30',
    bg: 'bg-neon-yellow/10',
    glow: 'hover:shadow-neon-yellow/25'
  },
  advanced: {
    text: 'text-neon-orange',
    border: 'border-neon-orange/30',
    bg: 'bg-neon-orange/10',
    glow: 'hover:shadow-neon-orange/25'
  },
  expert: {
    text: 'text-neon-red',
    border: 'border-neon-red/30',
    bg: 'bg-neon-red/10',
    glow: 'hover:shadow-neon-red/25'
  },
};

const typeIcons = {
  coding: <Code className="w-4 h-4" />,
  theory: <Brain className="w-4 h-4" />,
  project: <Rocket className="w-4 h-4" />,
  challenge: <Target className="w-4 h-4" />,
};

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const navigate = useNavigate();
  const { startQuest, updateQuestProgress } = useGameStore();
  const difficultyConfig = difficultyColors[quest.difficulty];

  const handleQuestAction = () => {
    if (quest.status === 'available') {
      startQuest(quest.id);
    }
    // Navigate to skill tree or quest detail page
    navigate('/skill-tree');
  };

  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 relative overflow-hidden group"
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2)'
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-blue/5 animate-pulse-neon"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/30">
              <div className="text-neon-cyan">
                {typeIcons[quest.type]}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg font-game">{quest.title}</h3>
              <p className="text-neon-cyan/80 text-sm font-space">{quest.category}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${difficultyConfig.text} ${difficultyConfig.border} ${difficultyConfig.bg} font-space`}>
            {quest.difficulty.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2 font-space">
          {quest.description}
        </p>

        {/* Objectives Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neon-cyan mb-2 font-space">Objectives:</h4>
          <div className="space-y-1">
            {quest.objectives.slice(0, 2).map((objective, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></div>
                <span className="font-space">{objective}</span>
              </div>
            ))}
            {quest.objectives.length > 2 && (
              <div className="text-xs text-neon-cyan/60 font-space">
                +{quest.objectives.length - 2} more objectives
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-4 font-space">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{quest.estimatedTime}min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-neon-yellow" />
              <span className="text-neon-yellow font-bold">{quest.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-space">
            <span>Progress</span>
            <span>{quest.progress}%</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2 border border-neon-cyan/20">
            <motion.div
              className="bg-gradient-to-r from-neon-cyan to-neon-blue h-2 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${quest.progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quest.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded-full border border-neon-blue/30 font-space"
            >
              {skill}
            </span>
          ))}
          {quest.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600 font-space">
              +{quest.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleQuestAction}
          className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg font-bold text-white hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 border border-neon-cyan/30 font-space"
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
        >
          {quest.status === 'in_progress' ? (
            <>
              <Rocket className="w-4 h-4 inline mr-2" />
              Continue Quest
            </>
          ) : (
            <>
              <Target className="w-4 h-4 inline mr-2" />
              Start Quest
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuestCard;