import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TreePine, 
  Lock, 
  CheckCircle, 
  Star, 
  Zap, 
  Play, 
  Target,
  Crown,
  Brain,
  Code,
  Database,
  Palette,
  Shield,
  Rocket,
  Globe,
  Cpu,
  Search,
  Filter,
  RotateCcw,
  BookOpen,
  Trophy,
  Eye,
  ArrowRight,
  Award,
  Clock,
  Users
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { xpAPI } from '../services/api';
import toast from 'react-hot-toast';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number;
  maxLevel: number;
  xpCost: number;
  prerequisites: string[];
  unlocked: boolean;
  mastered: boolean;
  icon: React.ReactNode;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewards: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  projects: string[];
  skills: string[];
}

interface SkillPath {
  id: string;
  name: string;
  description: string;
  nodes: string[];
  color: string;
  icon: React.ReactNode;
  totalXP: number;
  estimatedTime: string;
  difficulty: string;
}

const SkillTree: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'paths'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { addXP, addNotification, user } = useGameStore();

  // Enhanced skill categories
  const categories = [
    { id: 'all', name: 'All Skills', icon: <Globe className="w-5 h-5" />, color: 'neon-white' },
    { id: 'frontend', name: 'Frontend', icon: <Palette className="w-5 h-5" />, color: 'neon-cyan' },
    { id: 'backend', name: 'Backend', icon: <Database className="w-5 h-5" />, color: 'neon-purple' },
    { id: 'algorithms', name: 'Algorithms', icon: <Brain className="w-5 h-5" />, color: 'neon-pink' },
    { id: 'systems', name: 'Systems', icon: <Cpu className="w-5 h-5" />, color: 'neon-green' },
    { id: 'security', name: 'Security', icon: <Shield className="w-5 h-5" />, color: 'neon-red' },
    { id: 'devops', name: 'DevOps', icon: <Rocket className="w-5 h-5" />, color: 'neon-orange' }
  ];

  // Learning paths
  const learningPaths: SkillPath[] = [
    {
      id: 'web-fundamentals',
      name: 'Web Development Fundamentals',
      description: 'Master the core technologies of modern web development',
      nodes: ['html-mastery', 'css-artistry', 'js-foundations', 'responsive-design'],
      color: 'neon-cyan',
      icon: <Globe className="w-5 h-5" />,
      totalXP: 2000,
      estimatedTime: '8-12 weeks',
      difficulty: 'Beginner to Intermediate'
    },
    {
      id: 'react-mastery',
      name: 'React Ecosystem Mastery',
      description: 'Become a React expert with modern tools and patterns',
      nodes: ['react-foundations', 'react-hooks', 'state-management', 'react-performance'],
      color: 'neon-blue',
      icon: <Code className="w-5 h-5" />,
      totalXP: 3500,
      estimatedTime: '10-16 weeks',
      difficulty: 'Intermediate to Advanced'
    },
    {
      id: 'fullstack-journey',
      name: 'Full-Stack Developer Path',
      description: 'Complete journey from frontend to backend mastery',
      nodes: ['js-foundations', 'react-foundations', 'node-mastery', 'database-design', 'api-architecture'],
      color: 'neon-purple',
      icon: <Rocket className="w-5 h-5" />,
      totalXP: 6000,
      estimatedTime: '20-30 weeks',
      difficulty: 'Beginner to Expert'
    },
    {
      id: 'algorithm-master',
      name: 'Algorithm Master Path',
      description: 'Conquer data structures and algorithms',
      nodes: ['data-structures', 'sorting-algorithms', 'graph-algorithms', 'dynamic-programming'],
      color: 'neon-pink',
      icon: <Brain className="w-5 h-5" />,
      totalXP: 4500,
      estimatedTime: '16-24 weeks',
      difficulty: 'Intermediate to Expert'
    }
  ];

  // Enhanced skill nodes
  const skillNodes: SkillNode[] = [
    // Frontend Skills
    {
      id: 'html-mastery',
      name: 'HTML Mastery',
      description: 'Master semantic HTML, accessibility, and modern web standards',
      category: 'frontend',
      level: 5,
      maxLevel: 5,
      xpCost: 200,
      prerequisites: [],
      unlocked: true,
      mastered: true,
      icon: <Code className="w-6 h-6" />,
      color: 'neon-orange',
      rarity: 'common',
      rewards: ['Semantic HTML Badge', 'Accessibility Champion'],
      estimatedTime: '2-3 weeks',
      difficulty: 'beginner',
      projects: ['Portfolio Website', 'Blog Template', 'Landing Page'],
      skills: ['Semantic HTML', 'Forms', 'Accessibility', 'SEO Basics']
    },
    {
      id: 'css-artistry',
      name: 'CSS Artistry',
      description: 'Create stunning visual experiences with advanced CSS',
      category: 'frontend',
      level: 4,
      maxLevel: 5,
      xpCost: 300,
      prerequisites: ['html-mastery'],
      unlocked: true,
      mastered: false,
      icon: <Palette className="w-6 h-6" />,
      color: 'neon-pink',
      rarity: 'rare',
      rewards: ['CSS Wizard Badge', 'Animation Master'],
      estimatedTime: '4-6 weeks',
      difficulty: 'intermediate',
      projects: ['Animated Portfolio', 'CSS Art Gallery', 'Component Library'],
      skills: ['Flexbox', 'Grid', 'Animations', 'Responsive Design']
    },
    {
      id: 'js-foundations',
      name: 'JavaScript Foundations',
      description: 'Build solid JavaScript fundamentals and ES6+ features',
      category: 'frontend',
      level: 3,
      maxLevel: 5,
      xpCost: 400,
      prerequisites: ['html-mastery'],
      unlocked: true,
      mastered: false,
      icon: <Zap className="w-6 h-6" />,
      color: 'neon-yellow',
      rarity: 'common',
      rewards: ['JS Ninja Badge', 'ES6+ Master'],
      estimatedTime: '6-8 weeks',
      difficulty: 'intermediate',
      projects: ['Interactive Calculator', 'Todo App', 'Weather Dashboard'],
      skills: ['ES6+', 'DOM Manipulation', 'Async/Await', 'Modules']
    },
    {
      id: 'react-foundations',
      name: 'React Foundations',
      description: 'Master React fundamentals and component architecture',
      category: 'frontend',
      level: 2,
      maxLevel: 5,
      xpCost: 500,
      prerequisites: ['js-foundations', 'css-artistry'],
      unlocked: true,
      mastered: false,
      icon: <Crown className="w-6 h-6" />,
      color: 'neon-blue',
      rarity: 'epic',
      rewards: ['React Developer Badge', 'Component Master'],
      estimatedTime: '8-10 weeks',
      difficulty: 'intermediate',
      projects: ['React Portfolio', 'E-commerce App', 'Social Dashboard'],
      skills: ['Components', 'Props', 'State', 'Event Handling']
    },
    {
      id: 'react-hooks',
      name: 'React Hooks Mastery',
      description: 'Master React Hooks and functional components',
      category: 'frontend',
      level: 1,
      maxLevel: 5,
      xpCost: 600,
      prerequisites: ['react-foundations'],
      unlocked: true,
      mastered: false,
      icon: <Target className="w-6 h-6" />,
      color: 'neon-cyan',
      rarity: 'epic',
      rewards: ['Hooks Expert Badge', 'Custom Hook Creator'],
      estimatedTime: '6-8 weeks',
      difficulty: 'advanced',
      projects: ['Custom Hook Library', 'Real-time Chat', 'Data Visualization'],
      skills: ['useState', 'useEffect', 'Custom Hooks', 'Context API']
    },
    {
      id: 'state-management',
      name: 'State Management',
      description: 'Master complex state with Redux, Zustand, and more',
      category: 'frontend',
      level: 0,
      maxLevel: 5,
      xpCost: 700,
      prerequisites: ['react-hooks'],
      unlocked: false,
      mastered: false,
      icon: <Database className="w-6 h-6" />,
      color: 'neon-purple',
      rarity: 'legendary',
      rewards: ['State Master Badge', 'Redux Wizard'],
      estimatedTime: '8-12 weeks',
      difficulty: 'advanced',
      projects: ['Complex Dashboard', 'Multi-user App', 'Game State Manager'],
      skills: ['Redux', 'Zustand', 'Context', 'State Patterns']
    },

    // Backend Skills
    {
      id: 'node-mastery',
      name: 'Node.js Mastery',
      description: 'Build scalable server-side applications',
      category: 'backend',
      level: 3,
      maxLevel: 5,
      xpCost: 500,
      prerequisites: ['js-foundations'],
      unlocked: true,
      mastered: false,
      icon: <Rocket className="w-6 h-6" />,
      color: 'neon-green',
      rarity: 'rare',
      rewards: ['Backend Developer Badge', 'Server Architect'],
      estimatedTime: '8-10 weeks',
      difficulty: 'intermediate',
      projects: ['REST API', 'Real-time Chat Server', 'File Upload Service'],
      skills: ['Express.js', 'Middleware', 'Authentication', 'File System']
    },
    {
      id: 'database-design',
      name: 'Database Design',
      description: 'Design efficient and scalable databases',
      category: 'backend',
      level: 2,
      maxLevel: 5,
      xpCost: 600,
      prerequisites: ['node-mastery'],
      unlocked: true,
      mastered: false,
      icon: <Database className="w-6 h-6" />,
      color: 'neon-blue',
      rarity: 'epic',
      rewards: ['Database Architect Badge', 'SQL Master'],
      estimatedTime: '10-12 weeks',
      difficulty: 'advanced',
      projects: ['E-commerce Database', 'Analytics Platform', 'User Management'],
      skills: ['SQL', 'NoSQL', 'Indexing', 'Optimization']
    },

    // Algorithm Skills
    {
      id: 'data-structures',
      name: 'Data Structures',
      description: 'Master fundamental data structures',
      category: 'algorithms',
      level: 4,
      maxLevel: 5,
      xpCost: 400,
      prerequisites: ['js-foundations'],
      unlocked: true,
      mastered: false,
      icon: <Brain className="w-6 h-6" />,
      color: 'neon-pink',
      rarity: 'common',
      rewards: ['Data Structure Expert', 'Algorithm Foundation'],
      estimatedTime: '6-8 weeks',
      difficulty: 'intermediate',
      projects: ['Data Structure Visualizer', 'Algorithm Playground'],
      skills: ['Arrays', 'Linked Lists', 'Trees', 'Hash Tables']
    },
    {
      id: 'sorting-algorithms',
      name: 'Sorting Algorithms',
      description: 'Implement and optimize sorting algorithms',
      category: 'algorithms',
      level: 3,
      maxLevel: 5,
      xpCost: 500,
      prerequisites: ['data-structures'],
      unlocked: true,
      mastered: false,
      icon: <Target className="w-6 h-6" />,
      color: 'neon-orange',
      rarity: 'rare',
      rewards: ['Sorting Master', 'Optimization Expert'],
      estimatedTime: '4-6 weeks',
      difficulty: 'intermediate',
      projects: ['Sorting Visualizer', 'Performance Analyzer'],
      skills: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Radix Sort']
    }
  ];

  // Filter skills based on current filters
  const filteredSkills = skillNodes.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || skill.difficulty === filterDifficulty;
    const matchesUnlocked = !showOnlyUnlocked || skill.unlocked;
    
    return matchesCategory && matchesSearch && matchesDifficulty && matchesUnlocked;
  });

  const handleLevelUp = async (skill: SkillNode) => {
    if (!skill.unlocked || skill.mastered || (user?.xp || 0) < skill.xpCost) return;

    try {
      setLoading(true);
      
      addNotification({
        title: 'Skill Upgraded!',
        message: `${skill.name} leveled up! You're getting stronger.`,
        type: 'success',
        read: false,
        priority: 'medium'
      });

      toast.success(`${skill.name} upgraded!`);
    } catch (error) {
      toast.error('Failed to upgrade skill');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuest = () => {
    navigate('/diy');
  };

  const handleFollowPath = (pathId: string) => {
    setSelectedPath(pathId);
    toast.success('Following learning path!');
  };

  const renderSkillCard = (skill: SkillNode) => {
    const progressPercentage = (skill.level / skill.maxLevel) * 100;
    const isSelected = selectedNode?.id === skill.id;
    
    return (
      <motion.div
        key={skill.id}
        className={`p-6 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
          isSelected
            ? 'bg-neon-cyan/10 border-neon-cyan/50 shadow-lg shadow-neon-cyan/25'
            : skill.unlocked
            ? 'bg-black/40 border-dark-600 hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/10'
            : 'bg-black/20 border-dark-700 opacity-60'
        }`}
        whileHover={skill.unlocked ? { scale: 1.02, y: -2 } : {}}
        whileTap={skill.unlocked ? { scale: 0.98 } : {}}
        onClick={() => skill.unlocked && setSelectedNode(skill)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${skill.unlocked ? `bg-${skill.color}/20 border border-${skill.color}/30` : 'bg-gray-700 border border-gray-600'}`}>
                <div className={`${skill.unlocked ? `text-${skill.color}` : 'text-gray-500'}`}>
                  {skill.unlocked ? skill.icon : <Lock className="w-6 h-6" />}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg font-game">{skill.name}</h3>
                <p className={`text-sm ${skill.unlocked ? `text-${skill.color}/80` : 'text-gray-500'} font-space`}>
                  {skill.difficulty}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                skill.rarity === 'common' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                skill.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                skill.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              } font-space`}>
                {skill.rarity.toUpperCase()}
              </span>
              
              {skill.mastered && (
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Crown className="w-5 h-5 text-neon-yellow" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 font-space">
            {skill.description}
          </p>

          {/* Progress */}
          {skill.unlocked && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2 font-space">
                <span>Progress</span>
                <span>{skill.level}/{skill.maxLevel}</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-3 border border-dark-600">
                <motion.div
                  className={`bg-gradient-to-r from-${skill.color} to-${skill.color} h-3 rounded-full relative overflow-hidden`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Skills Preview */}
          <div className="flex flex-wrap gap-1 mb-4">
            {skill.skills.slice(0, 3).map((skillName) => (
              <span
                key={skillName}
                className={`px-2 py-1 ${skill.unlocked ? `bg-${skill.color}/20 text-${skill.color} border border-${skill.color}/30` : 'bg-gray-700/50 text-gray-400 border border-gray-600'} text-xs rounded-full font-space`}
              >
                {skillName}
              </span>
            ))}
            {skill.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600 font-space">
                +{skill.skills.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400 font-space">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{skill.estimatedTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-neon-yellow" />
                <span className="text-neon-yellow font-bold">{skill.xpCost} XP</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPathCard = (path: SkillPath) => (
    <motion.div
      key={path.id}
      className={`p-6 rounded-xl border cursor-pointer transition-all ${
        selectedPath === path.id
          ? `bg-${path.color}/10 border-${path.color}/50`
          : 'bg-black/40 border-dark-600 hover:border-gray-500'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleFollowPath(path.id)}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 rounded-lg bg-${path.color}/20 border border-${path.color}/30`}>
          <div className={`text-${path.color}`}>
            {path.icon}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white text-lg font-game">{path.name}</h3>
          <p className={`text-${path.color}/80 text-sm font-space`}>{path.difficulty}</p>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 font-space">{path.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-neon-yellow">{path.totalXP}</div>
          <div className="text-xs text-gray-400 font-space">Total XP</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-neon-cyan">{path.estimatedTime}</div>
          <div className="text-xs text-gray-400 font-space">Duration</div>
        </div>
      </div>

      <motion.button
        className={`w-full py-2 bg-gradient-to-r from-${path.color} to-${path.color} rounded-lg font-medium text-white hover:shadow-lg transition-all font-space`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {selectedPath === path.id ? 'Following Path' : 'Follow Path'}
      </motion.button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center py-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-neon-green/20 via-neon-cyan/20 to-neon-blue/20 border border-neon-green/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-star-field opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-green to-neon-cyan flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <TreePine className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent font-game">
                Skill Nexus
              </h1>
              <p className="text-gray-400 text-lg font-space">
                Master your coding skills through structured learning paths
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green">{skillNodes.filter(s => s.unlocked).length}</div>
              <div className="text-sm text-gray-400 font-space">Skills Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-yellow">{skillNodes.filter(s => s.mastered).length}</div>
              <div className="text-sm text-gray-400 font-space">Skills Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-purple">{user?.xp || 0}</div>
              <div className="text-sm text-gray-400 font-space">Available XP</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-blue/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View Mode Selector */}
          <div className="flex space-x-2">
            {[
              { id: 'grid', name: 'Skills Grid', icon: <Target className="w-4 h-4" /> },
              { id: 'paths', name: 'Learning Paths', icon: <TreePine className="w-4 h-4" /> }
            ].map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 font-space ${
                  viewMode === mode.id
                    ? 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode.icon}
                <span>{mode.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search skills..."
                className="bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none w-48 font-space"
              />
            </div>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-blue focus:outline-none font-space"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            <motion.button
              onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
              className={`p-2 rounded-lg transition-all ${
                showOnlyUnlocked ? 'bg-neon-green/20 text-neon-green' : 'bg-dark-700 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => {
                setSearchTerm('');
                setFilterDifficulty('all');
                setShowOnlyUnlocked(false);
                setSelectedCategory('all');
              }}
              className="p-2 rounded-lg bg-dark-700 text-gray-400 hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 font-space ${
                selectedCategory === category.id
                  ? `bg-${category.color}/20 text-${category.color} border border-${category.color}/30`
                  : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon}
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Skills/Paths Display */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {viewMode === 'grid' && (
              <motion.div
                key="grid"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredSkills.map(renderSkillCard)}
              </motion.div>
            )}

            {viewMode === 'paths' && (
              <motion.div
                key="paths"
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {learningPaths.map(renderPathCard)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Skill Details Panel */}
        <motion.div
          className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-purple/20 h-fit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {selectedNode ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-${selectedNode.color}/20 border border-${selectedNode.color}/30`}>
                    {selectedNode.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-game">{selectedNode.name}</h3>
                    {selectedNode.mastered && (
                      <div className="flex items-center space-x-1">
                        <Crown className="w-4 h-4 text-neon-yellow" />
                        <span className="text-sm text-neon-yellow font-space">Mastered</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 font-space">
                {selectedNode.description}
              </p>
              
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2 font-space">
                    <span>Progress</span>
                    <span>{selectedNode.level}/{selectedNode.maxLevel}</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-3">
                    <motion.div
                      className={`bg-gradient-to-r from-${selectedNode.color} to-${selectedNode.color} h-3 rounded-full relative overflow-hidden`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedNode.level / selectedNode.maxLevel) * 100}%` }}
                      transition={{ duration: 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </motion.div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-black/20 rounded-lg">
                    <div className="text-lg font-bold text-neon-yellow">{selectedNode.xpCost}</div>
                    <div className="text-xs text-gray-400 font-space">XP Cost</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-lg">
                    <div className="text-lg font-bold text-neon-cyan">{selectedNode.estimatedTime}</div>
                    <div className="text-xs text-gray-400 font-space">Duration</div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-medium mb-2 font-space">Skills You'll Learn</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.skills.map(skill => (
                      <span
                        key={skill}
                        className={`px-2 py-1 bg-${selectedNode.color}/20 text-${selectedNode.color} text-xs rounded-full border border-${selectedNode.color}/30 font-space`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h4 className="font-medium mb-2 font-space">Practice Projects</h4>
                  <div className="space-y-1">
                    {selectedNode.projects.map(project => (
                      <div key={project} className="flex items-center space-x-2 text-sm">
                        <Code className="w-3 h-3 text-neon-green" />
                        <span className="text-gray-300 font-space">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div>
                  <h4 className="font-medium mb-2 font-space">Rewards</h4>
                  <div className="space-y-1">
                    {selectedNode.rewards.map(reward => (
                      <div key={reward} className="flex items-center space-x-2 text-sm">
                        <Trophy className="w-3 h-3 text-neon-yellow" />
                        <span className="text-gray-300 font-space">{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                {selectedNode.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 font-space">Prerequisites</h4>
                    <div className="space-y-1">
                      {selectedNode.prerequisites.map(prereqId => {
                        const prereq = skillNodes.find(s => s.id === prereqId);
                        return prereq ? (
                          <div key={prereqId} className="flex items-center space-x-2 text-sm">
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-300 font-space">{prereq.name}</span>
                            {prereq.unlocked ? (
                              <CheckCircle className="w-3 h-3 text-neon-green" />
                            ) : (
                              <Lock className="w-3 h-3 text-gray-500" />
                            )}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <motion.button
                    onClick={() => handleLevelUp(selectedNode)}
                    disabled={!selectedNode.unlocked || selectedNode.mastered || (user?.xp || 0) < selectedNode.xpCost || loading}
                    className={`w-full py-3 rounded-lg font-medium transition-all font-space ${
                      selectedNode.unlocked && !selectedNode.mastered && (user?.xp || 0) >= selectedNode.xpCost
                        ? `bg-gradient-to-r from-${selectedNode.color} to-${selectedNode.color} hover:shadow-lg text-white`
                        : selectedNode.mastered
                        ? 'bg-neon-green/20 text-neon-green cursor-not-allowed'
                        : 'bg-dark-700 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={selectedNode.unlocked && !selectedNode.mastered && (user?.xp || 0) >= selectedNode.xpCost ? { scale: 1.02 } : {}}
                    whileTap={selectedNode.unlocked && !selectedNode.mastered && (user?.xp || 0) >= selectedNode.xpCost ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Upgrading...
                      </div>
                    ) : selectedNode.mastered ? (
                      'Mastered'
                    ) : selectedNode.unlocked ? (
                      'Level Up'
                    ) : (
                      'Locked'
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleStartQuest}
                    className="w-full py-2 bg-dark-700 hover:bg-dark-600 rounded-lg font-medium text-white transition-all font-space"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Practice Projects
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2 font-game">Select a Skill</h3>
              <p className="text-sm font-space">
                Click on any skill card to view detailed information and upgrade options
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SkillTree;