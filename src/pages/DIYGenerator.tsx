import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Sparkles, 
  Code, 
  FileText, 
  Play, 
  Download,
  Brain,
  Heart,
  Zap,
  Target,
  Rocket,
  Star,
  TrendingUp,
  Lightbulb,
  Coffee,
  Moon,
  Sun,
  Flame,
  Loader,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Trophy,
  BookOpen,
  Palette,
  Database,
  Globe,
  Shield,
  Cpu,
  Layers,
  Settings
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useGameStore } from '../store/gameStore';
import toast from 'react-hot-toast';

interface ProjectConfig {
  projectType: string;
  difficulty: string;
  technologies: string[];
  projectSize: string;
  focusArea: string;
  timePreference: string;
  learningGoal: string;
  currentMood: string;
  energyLevel: string;
  preferredStyle: string;
}

interface GeneratedProject {
  title: string;
  description: string;
  features: string[];
  challenges: string[];
  files: Array<{
    name: string;
    type: string;
    lines: number;
    description: string;
  }>;
  estimatedTime: string;
  xpReward: number;
  difficulty: string;
  technologies: string[];
  learningOutcomes: string[];
  motivationalMessage: string;
  personalizedTips: string[];
  moodBasedFeatures: string[];
  nextSteps: string[];
  resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  codeSnippets: Array<{
    filename: string;
    code: string;
    explanation: string;
  }>;
}

const DIYGenerator: React.FC = () => {
  const [config, setConfig] = useState<ProjectConfig>({
    projectType: 'web-app',
    difficulty: 'intermediate',
    technologies: ['react', 'typescript'],
    projectSize: 'medium',
    focusArea: 'frontend',
    timePreference: 'evening',
    learningGoal: 'skill-building',
    currentMood: 'motivated',
    energyLevel: 'high',
    preferredStyle: 'hands-on'
  });

  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [personalityInsights, setPersonalityInsights] = useState<string[]>([]);
  const [moodAnalysis, setMoodAnalysis] = useState<string>('');

  const { user, addXP, addNotification } = useGameStore();

  // Enhanced project types with emotional appeal
  const projectTypes = [
    { 
      id: 'web-app', 
      name: 'Web Application', 
      icon: '🌐',
      description: 'Build interactive web experiences',
      appeal: 'Create something users will love',
      mood: 'creative'
    },
    { 
      id: 'mobile-app', 
      name: 'Mobile App', 
      icon: '📱',
      description: 'Develop mobile experiences',
      appeal: 'Reach millions on mobile',
      mood: 'ambitious'
    },
    { 
      id: 'api', 
      name: 'REST API', 
      icon: '⚡',
      description: 'Power applications with data',
      appeal: 'Be the backbone of innovation',
      mood: 'logical'
    },
    { 
      id: 'cli-tool', 
      name: 'CLI Tool', 
      icon: '💻',
      description: 'Automate developer workflows',
      appeal: 'Make developers more productive',
      mood: 'efficient'
    },
    { 
      id: 'game', 
      name: 'Interactive Game', 
      icon: '🎮',
      description: 'Create engaging entertainment',
      appeal: 'Bring joy and fun to users',
      mood: 'playful'
    },
    { 
      id: 'data-viz', 
      name: 'Data Visualization', 
      icon: '📊',
      description: 'Transform data into insights',
      appeal: 'Make complex data beautiful',
      mood: 'analytical'
    },
    {
      id: 'ai-project',
      name: 'AI Integration',
      icon: '🤖',
      description: 'Harness the power of AI',
      appeal: 'Build the future with AI',
      mood: 'innovative'
    },
    {
      id: 'blockchain',
      name: 'Blockchain App',
      icon: '⛓️',
      description: 'Decentralized applications',
      appeal: 'Pioneer the decentralized web',
      mood: 'revolutionary'
    }
  ];

  // Enhanced technology options with categories
  const techCategories = {
    frontend: {
      name: 'Frontend',
      icon: <Palette className="w-4 h-4" />,
      color: 'neon-cyan',
      techs: ['react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'typescript', 'javascript']
    },
    backend: {
      name: 'Backend',
      icon: <Database className="w-4 h-4" />,
      color: 'neon-purple',
      techs: ['nodejs', 'python', 'golang', 'rust', 'java', 'php', 'express', 'fastapi']
    },
    database: {
      name: 'Database',
      icon: <Database className="w-4 h-4" />,
      color: 'neon-green',
      techs: ['mongodb', 'postgresql', 'mysql', 'redis', 'sqlite', 'supabase', 'firebase']
    },
    cloud: {
      name: 'Cloud & DevOps',
      icon: <Globe className="w-4 h-4" />,
      color: 'neon-yellow',
      techs: ['docker', 'kubernetes', 'aws', 'vercel', 'netlify', 'heroku', 'github-actions']
    },
    ai: {
      name: 'AI & ML',
      icon: <Brain className="w-4 h-4" />,
      color: 'neon-pink',
      techs: ['tensorflow', 'pytorch', 'openai', 'gemini', 'huggingface', 'langchain']
    },
    security: {
      name: 'Security',
      icon: <Shield className="w-4 h-4" />,
      color: 'neon-red',
      techs: ['auth0', 'jwt', 'oauth', 'bcrypt', 'helmet', 'cors']
    }
  };

  // Mood-based suggestions
  const moodSuggestions = {
    excited: {
      emoji: '🚀',
      message: 'Your excitement is contagious! Let\'s build something amazing!',
      projectBoost: 'Add extra interactive features',
      techSuggestion: 'Try cutting-edge technologies',
      timeBoost: 'You can tackle a bigger challenge today!'
    },
    focused: {
      emoji: '🎯',
      message: 'Perfect focus for deep learning. Let\'s dive into complex concepts!',
      projectBoost: 'Include architectural patterns',
      techSuggestion: 'Focus on best practices and clean code',
      timeBoost: 'Great time for detailed implementation'
    },
    tired: {
      emoji: '☕',
      message: 'Let\'s start with something manageable and build momentum!',
      projectBoost: 'Begin with a simple, satisfying project',
      techSuggestion: 'Use familiar technologies',
      timeBoost: 'Perfect for quick wins and learning'
    },
    curious: {
      emoji: '🔍',
      message: 'Your curiosity will drive great discoveries! Let\'s explore!',
      projectBoost: 'Include experimental features',
      techSuggestion: 'Try new frameworks or libraries',
      timeBoost: 'Great for research and exploration'
    },
    motivated: {
      emoji: '💪',
      message: 'Your motivation is your superpower! Let\'s build something impressive!',
      projectBoost: 'Add challenging features',
      techSuggestion: 'Combine multiple technologies',
      timeBoost: 'Perfect for ambitious projects'
    },
    creative: {
      emoji: '🎨',
      message: 'Let your creativity flow! Time to build something beautiful!',
      projectBoost: 'Focus on UI/UX and visual appeal',
      techSuggestion: 'Include animation and design libraries',
      timeBoost: 'Great for frontend and design work'
    }
  };

  // Time-based suggestions
  const timeBasedSuggestions = {
    morning: {
      emoji: '🌅',
      message: 'Fresh mind, fresh code! Perfect time for complex logic.',
      suggestion: 'Tackle algorithmic challenges and architecture decisions'
    },
    afternoon: {
      emoji: '☀️',
      message: 'Peak productivity hours! Time for your main development work.',
      suggestion: 'Focus on core feature implementation'
    },
    evening: {
      emoji: '🌆',
      message: 'Wind down with creative coding and UI polish.',
      suggestion: 'Perfect for styling, animations, and creative features'
    },
    night: {
      emoji: '🌙',
      message: 'Quiet focus time for deep work and debugging.',
      suggestion: 'Great for refactoring and optimization'
    }
  };

  useEffect(() => {
    analyzeMoodAndPersonality();
  }, [config.currentMood, config.energyLevel, config.preferredStyle]);

  const analyzeMoodAndPersonality = () => {
    const mood = moodSuggestions[config.currentMood as keyof typeof moodSuggestions];
    const insights = [
      mood?.message || 'Ready to code something amazing!',
      `Energy level: ${config.energyLevel} - ${config.energyLevel === 'high' ? 'Perfect for challenging projects!' : config.energyLevel === 'medium' ? 'Great for steady progress!' : 'Let\'s start with something manageable!'}`,
      `Learning style: ${config.preferredStyle} - ${config.preferredStyle === 'hands-on' ? 'You learn by doing!' : config.preferredStyle === 'theoretical' ? 'You love understanding the why!' : 'You enjoy structured learning!'}`
    ];
    
    setPersonalityInsights(insights);
    setMoodAnalysis(mood?.projectBoost || 'Let\'s create something amazing!');
  };

  const generateProject = async () => {
    setIsGenerating(true);
    setCurrentStep(1);

    try {
      // Step 1: Analyzing preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(2);

      // Step 2: AI generation
      const mood = moodSuggestions[config.currentMood as keyof typeof moodSuggestions];
      const timeContext = timeBasedSuggestions[config.timePreference as keyof typeof timeBasedSuggestions];

      const prompt = `Generate a comprehensive ${config.projectType} project with the following specifications:

**Project Configuration:**
- Type: ${config.projectType}
- Difficulty: ${config.difficulty}
- Technologies: ${config.technologies.join(', ')}
- Size: ${config.projectSize}
- Focus Area: ${config.focusArea}
- Time Preference: ${config.timePreference}
- Learning Goal: ${config.learningGoal}

**Personalization Context:**
- Current Mood: ${config.currentMood} (${mood?.message})
- Energy Level: ${config.energyLevel}
- Preferred Style: ${config.preferredStyle}
- User Level: ${user?.level || 1}

**Mood-Based Enhancements:**
${mood?.projectBoost}
${timeContext?.suggestion}

Create a project that:
1. Matches the user's current emotional state and energy
2. Provides appropriate challenge level
3. Includes motivational elements
4. Has clear learning outcomes
5. Feels personally relevant and engaging

Return a detailed project specification with:
- Compelling title and description
- Feature list with mood-appropriate enhancements
- Technical challenges suited to their energy level
- Personalized motivational message
- Learning outcomes
- File structure with explanations
- Code snippets for key components
- Next steps for continuation

Make it feel like this project was designed specifically for them in this moment.`;

      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(3);

      // Generate with AI or use enhanced fallback
      let project: GeneratedProject;
      
      try {
        const aiResponse = await geminiService.generateDIYProject(config, mood, timeContext, user?.level || 1);
        project = aiResponse;
      } catch (error) {
        console.error('AI generation failed, using enhanced fallback:', error);
        project = generateEnhancedFallbackProject();
      }

      setGeneratedProject(project);
      
      // Award XP for project generation
      const xpReward = 50 + (config.difficulty === 'hard' ? 25 : config.difficulty === 'medium' ? 15 : 10);
      addXP(xpReward, 'project_generation');
      
      addNotification({
        title: 'Project Generated! 🚀',
        message: `Your personalized ${config.projectType} project is ready!`,
        type: 'success',
        read: false,
        priority: 'medium',
        icon: '🎯'
      });

      toast.success('Your personalized project is ready!');
      
    } catch (error) {
      console.error('Error generating project:', error);
      toast.error('Failed to generate project. Please try again.');
    } finally {
      setIsGenerating(false);
      setCurrentStep(1);
    }
  };

  const generateEnhancedFallbackProject = (): GeneratedProject => {
    const mood = moodSuggestions[config.currentMood as keyof typeof moodSuggestions];
    const projectTypeData = projectTypes.find(p => p.id === config.projectType);
    
    const baseProjects = {
      'web-app': {
        title: 'Interactive Task Management Hub',
        description: 'A beautiful, responsive task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
        features: [
          'Drag-and-drop task organization',
          'Real-time collaboration',
          'Beautiful animations and transitions',
          'Dark/light theme toggle',
          'Progress tracking and analytics',
          'Team member management'
        ],
        challenges: [
          'Implement smooth drag-and-drop interactions',
          'Set up real-time data synchronization',
          'Create responsive design for all devices',
          'Build efficient state management'
        ]
      },
      'mobile-app': {
        title: 'Mindful Coding Companion',
        description: 'A mobile app that helps developers maintain work-life balance with coding session tracking, break reminders, and productivity insights.',
        features: [
          'Coding session timer with break reminders',
          'Productivity analytics and insights',
          'Goal setting and achievement tracking',
          'Mood tracking for coding sessions',
          'Integration with development tools',
          'Social features for developer community'
        ],
        challenges: [
          'Implement background timers and notifications',
          'Create engaging data visualizations',
          'Build smooth navigation and animations',
          'Integrate with external APIs'
        ]
      },
      'api': {
        title: 'Smart Developer Analytics API',
        description: 'A comprehensive REST API that aggregates and analyzes developer productivity data from multiple sources with intelligent insights.',
        features: [
          'Multi-source data aggregation',
          'Real-time analytics endpoints',
          'Intelligent productivity insights',
          'Secure authentication and authorization',
          'Rate limiting and caching',
          'Comprehensive API documentation'
        ],
        challenges: [
          'Design scalable database architecture',
          'Implement efficient data processing',
          'Create robust authentication system',
          'Build comprehensive error handling'
        ]
      }
    };

    const baseProject = baseProjects[config.projectType as keyof typeof baseProjects] || baseProjects['web-app'];
    
    // Enhance based on mood and preferences
    const moodEnhancements = mood?.projectBoost ? [mood.projectBoost] : [];
    const personalizedFeatures = [
      ...baseProject.features,
      ...moodEnhancements
    ];

    return {
      ...baseProject,
      features: personalizedFeatures,
      files: [
        { name: 'src/App.tsx', type: 'component', lines: 120, description: 'Main application component with routing' },
        { name: 'src/components/TaskCard.tsx', type: 'component', lines: 80, description: 'Reusable task card component' },
        { name: 'src/hooks/useTasks.ts', type: 'hook', lines: 45, description: 'Custom hook for task management' },
        { name: 'src/api/tasks.ts', type: 'api', lines: 60, description: 'API integration layer' },
        { name: 'src/types/Task.ts', type: 'types', lines: 25, description: 'TypeScript type definitions' },
        { name: 'src/utils/animations.ts', type: 'utility', lines: 35, description: 'Animation utilities and helpers' }
      ],
      estimatedTime: config.projectSize === 'small' ? '2-3 hours' : config.projectSize === 'medium' ? '4-6 hours' : '8-12 hours',
      xpReward: 750 + (config.difficulty === 'hard' ? 250 : config.difficulty === 'medium' ? 150 : 50),
      difficulty: config.difficulty,
      technologies: config.technologies,
      learningOutcomes: [
        `Master ${config.technologies[0]} development patterns`,
        'Understand modern web development best practices',
        'Learn efficient state management techniques',
        'Gain experience with responsive design'
      ],
      motivationalMessage: mood?.message || 'You\'re about to build something amazing! This project is perfectly tailored to your current energy and goals.',
      personalizedTips: [
        `Since you're feeling ${config.currentMood}, ${mood?.techSuggestion || 'focus on clean, maintainable code'}`,
        `Your ${config.energyLevel} energy level is perfect for ${config.energyLevel === 'high' ? 'tackling complex features' : 'steady, focused development'}`,
        `As someone who prefers ${config.preferredStyle} learning, make sure to ${config.preferredStyle === 'hands-on' ? 'experiment and iterate' : 'understand the concepts deeply'}`
      ],
      moodBasedFeatures: moodEnhancements,
      nextSteps: [
        'Set up your development environment',
        'Create the basic project structure',
        'Implement core functionality first',
        'Add styling and animations',
        'Test and refine the user experience'
      ],
      resources: [
        { title: 'Official Documentation', url: '#', type: 'documentation' },
        { title: 'Best Practices Guide', url: '#', type: 'guide' },
        { title: 'Community Examples', url: '#', type: 'examples' }
      ],
      codeSnippets: [
        {
          filename: 'src/App.tsx',
          code: `import React from 'react';\nimport { TaskProvider } from './contexts/TaskContext';\nimport TaskBoard from './components/TaskBoard';\n\nfunction App() {\n  return (\n    <TaskProvider>\n      <div className="app">\n        <TaskBoard />\n      </div>\n    </TaskProvider>\n  );\n}\n\nexport default App;`,
          explanation: 'Main app component with context provider for state management'
        },
        {
          filename: 'src/hooks/useTasks.ts',
          code: `import { useState, useCallback } from 'react';\n\nexport const useTasks = () => {\n  const [tasks, setTasks] = useState([]);\n  \n  const addTask = useCallback((task) => {\n    setTasks(prev => [...prev, { ...task, id: Date.now() }]);\n  }, []);\n  \n  return { tasks, addTask };\n};`,
          explanation: 'Custom hook for managing task state with optimized performance'
        }
      ]
    };
  };

  const toggleTechnology = (tech: string) => {
    setConfig(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Brain className="w-5 h-5" />;
      case 2: return <Sparkles className="w-5 h-5" />;
      case 3: return <Rocket className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStepMessage = (step: number) => {
    switch (step) {
      case 1: return 'Analyzing your preferences and mood...';
      case 2: return 'Generating your personalized project...';
      case 3: return 'Adding final touches and optimizations...';
      default: return 'Complete!';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center py-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-neon-purple/20 via-neon-cyan/20 to-neon-blue/20 border border-neon-purple/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-star-field opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Wrench className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent font-game">
                AI Project Forge
              </h1>
              <p className="text-gray-400 text-lg font-space">
                Personalized projects that adapt to your mood, energy, and goals
              </p>
            </div>
          </div>

          {/* Mood Indicator */}
          <div className="flex justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 bg-black/20 rounded-full px-4 py-2 border border-neon-pink/30">
              <Heart className="w-4 h-4 text-neon-pink" />
              <span className="text-sm font-space">Mood: {config.currentMood}</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/20 rounded-full px-4 py-2 border border-neon-yellow/30">
              <Zap className="w-4 h-4 text-neon-yellow" />
              <span className="text-sm font-space">Energy: {config.energyLevel}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personality Insights */}
      {personalityInsights.length > 0 && (
        <motion.div
          className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-pink/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center font-game">
            <Brain className="w-5 h-5 mr-2 text-neon-pink animate-pulse" />
            AI Personality Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalityInsights.map((insight, index) => (
              <motion.div
                key={index}
                className="p-4 bg-black/20 rounded-lg border border-neon-pink/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-sm text-gray-300 font-space">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <motion.div
          className="lg:col-span-2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-cyan/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center font-game">
            <Target className="w-5 h-5 mr-2 text-neon-cyan animate-pulse" />
            Project Configuration
          </h2>

          <div className="space-y-6">
            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 font-space">
                What do you want to build?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {projectTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setConfig(prev => ({ ...prev, projectType: type.id }))}
                    className={`p-4 rounded-lg border transition-all text-center ${
                      config.projectType === type.id
                        ? 'bg-neon-purple/20 border-neon-purple/50'
                        : 'bg-black/20 border-dark-600 hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium font-space">{type.name}</div>
                    <div className="text-xs text-gray-400 mt-1 font-space">{type.appeal}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mood & Energy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-space">
                  How are you feeling?
                </label>
                <select
                  value={config.currentMood}
                  onChange={(e) => setConfig(prev => ({ ...prev, currentMood: e.target.value }))}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-pink focus:outline-none font-space"
                >
                  <option value="excited">🚀 Excited & Ready</option>
                  <option value="focused">🎯 Focused & Determined</option>
                  <option value="creative">🎨 Creative & Inspired</option>
                  <option value="motivated">💪 Motivated & Driven</option>
                  <option value="curious">🔍 Curious & Exploring</option>
                  <option value="tired">☕ Tired but Willing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-space">
                  Energy Level
                </label>
                <select
                  value={config.energyLevel}
                  onChange={(e) => setConfig(prev => ({ ...prev, energyLevel: e.target.value }))}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-yellow focus:outline-none font-space"
                >
                  <option value="high">⚡ High Energy</option>
                  <option value="medium">🔋 Medium Energy</option>
                  <option value="low">🪫 Low Energy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-space">
                  Time Preference
                </label>
                <select
                  value={config.timePreference}
                  onChange={(e) => setConfig(prev => ({ ...prev, timePreference: e.target.value }))}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-blue focus:outline-none font-space"
                >
                  <option value="morning">🌅 Morning Person</option>
                  <option value="afternoon">☀️ Afternoon Focus</option>
                  <option value="evening">🌆 Evening Coder</option>
                  <option value="night">🌙 Night Owl</option>
                </select>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 font-space">
                Choose Your Tech Stack
              </label>
              <div className="space-y-4">
                {Object.entries(techCategories).map(([categoryId, category]) => (
                  <div key={categoryId}>
                    <div className={`flex items-center space-x-2 mb-2 text-${category.color}`}>
                      {category.icon}
                      <span className="font-medium text-sm font-space">{category.name}</span>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 ml-6">
                      {category.techs.map((tech) => (
                        <motion.button
                          key={tech}
                          onClick={() => toggleTechnology(tech)}
                          className={`p-2 rounded-lg border text-sm transition-all font-space ${
                            config.technologies.includes(tech)
                              ? `bg-${category.color}/20 border-${category.color}/50 text-${category.color}`
                              : 'bg-black/20 border-dark-600 hover:border-gray-500 text-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tech}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div>
              <motion.button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-neon-cyan hover:text-white transition-colors font-space"
                whileHover={{ scale: 1.02 }}
              >
                <Settings className="w-4 h-4" />
                <span>Advanced Options</span>
              </motion.button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-space">
                        Project Size
                      </label>
                      <select
                        value={config.projectSize}
                        onChange={(e) => setConfig(prev => ({ ...prev, projectSize: e.target.value }))}
                        className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white font-space"
                      >
                        <option value="small">Small (1-2 hours)</option>
                        <option value="medium">Medium (3-5 hours)</option>
                        <option value="large">Large (6-10 hours)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-space">
                        Learning Goal
                      </label>
                      <select
                        value={config.learningGoal}
                        onChange={(e) => setConfig(prev => ({ ...prev, learningGoal: e.target.value }))}
                        className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white font-space"
                      >
                        <option value="skill-building">Skill Building</option>
                        <option value="portfolio">Portfolio Project</option>
                        <option value="experimentation">Experimentation</option>
                        <option value="career-prep">Career Preparation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-space">
                        Difficulty Level
                      </label>
                      <select
                        value={config.difficulty}
                        onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white font-space"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-space">
                        Learning Style
                      </label>
                      <select
                        value={config.preferredStyle}
                        onChange={(e) => setConfig(prev => ({ ...prev, preferredStyle: e.target.value }))}
                        className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white font-space"
                      >
                        <option value="hands-on">Hands-on Learning</option>
                        <option value="theoretical">Theoretical First</option>
                        <option value="guided">Guided Practice</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={generateProject}
              disabled={isGenerating || config.technologies.length < 1}
              className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-space"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <div className="flex items-center space-x-3">
                  <Loader className="w-5 h-5 animate-spin" />
                  <div className="flex items-center space-x-2">
                    {getStepIcon(currentStep)}
                    <span>{getStepMessage(currentStep)}</span>
                  </div>
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate My Perfect Project
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Generated Project Details */}
        <motion.div
          className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-green/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {generatedProject ? (
            <div className="space-y-6">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-green to-neon-cyan flex items-center justify-center mx-auto mb-3"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Rocket className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold mb-2 font-game">{generatedProject.title}</h2>
                <p className="text-sm text-gray-400 font-space">{generatedProject.description}</p>
              </div>

              {/* Motivational Message */}
              <div className="p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-neon-pink" />
                  <span className="font-medium text-neon-pink text-sm font-space">Personal Message</span>
                </div>
                <p className="text-sm text-gray-300 font-space">{generatedProject.motivationalMessage}</p>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <div className="text-lg font-bold text-neon-yellow">{generatedProject.estimatedTime}</div>
                  <div className="text-xs text-gray-400 font-space">Estimated Time</div>
                </div>
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <div className="text-lg font-bold text-neon-green">{generatedProject.xpReward} XP</div>
                  <div className="text-xs text-gray-400 font-space">Reward</div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-medium mb-2 flex items-center font-space">
                  <Star className="w-4 h-4 mr-2 text-neon-yellow" />
                  Key Features
                </h3>
                <div className="space-y-1">
                  {generatedProject.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-neon-green mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 font-space">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h3 className="font-medium mb-2 flex items-center font-space">
                  <Brain className="w-4 h-4 mr-2 text-neon-purple" />
                  You'll Learn
                </h3>
                <div className="space-y-1">
                  {generatedProject.learningOutcomes.slice(0, 3).map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <Lightbulb className="w-3 h-3 text-neon-yellow mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 font-space">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized Tips */}
              {generatedProject.personalizedTips && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center font-space">
                    <Target className="w-4 h-4 mr-2 text-neon-cyan" />
                    Personal Tips
                  </h3>
                  <div className="space-y-1">
                    {generatedProject.personalizedTips.slice(0, 2).map((tip, index) => (
                      <div key={index} className="text-xs text-gray-400 bg-black/20 p-2 rounded font-space">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-neon-green to-neon-cyan rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-green/25 transition-all flex items-center justify-center font-space"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Building
                </motion.button>
                
                <motion.button
                  className="w-full py-2 bg-dark-700 hover:bg-dark-600 rounded-lg font-medium text-white transition-all flex items-center justify-center font-space"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Starter
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Wrench className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2 font-game">Ready to Build?</h3>
              <p className="text-sm font-space mb-4">
                Configure your preferences and let AI create the perfect project for you!
              </p>
              
              <div className="space-y-2 text-xs text-gray-500 font-space">
                <p>✨ Personalized to your mood and energy</p>
                <p>🎯 Tailored to your skill level</p>
                <p>🚀 Designed for maximum engagement</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DIYGenerator;