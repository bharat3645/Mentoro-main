import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Mic, 
  Settings, 
  Heart,
  Lightbulb,
  Code,
  HelpCircle,
  Sparkles,
  BookOpen,
  Layers,
  Loader,
  Zap,
  Brain,
  Target,
  Shuffle,
  TrendingUp,
  MessageSquare,
  Star,
  Cpu,
  Rocket,
  Coffee,
  Moon,
  Sun,
  Flame,
  Eye,
  ArrowDown,
  Volume2,
  VolumeX,
  RotateCcw,
  Palette,
  Activity
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { geminiService, FlashcardData } from '../services/geminiService';
import FlashcardWidget from '../components/ui/FlashcardWidget';
import toast from 'react-hot-toast';

const AIBuddy: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [generatedFlashcards, setGeneratedFlashcards] = useState<FlashcardData[]>([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [flashcardDifficulty, setFlashcardDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [conversationContext, setConversationContext] = useState<string>('');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showPersonalityDetails, setShowPersonalityDetails] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    currentAIPersonality,
    availablePersonalities,
    chatHistory,
    switchPersonality,
    addChatMessage,
    addXP,
    addNotification,
    user
  } = useGameStore();

  const personalityConfigs = {
    encouraging: {
      name: 'Alex the Motivator',
      style: 'encouraging',
      traits: ['Positive', 'Supportive', 'Energetic', 'Patient'],
      teachingApproach: 'Uses positive reinforcement and celebrates small wins',
      color: 'neon-green',
      gradient: 'from-neon-green to-emerald-400',
      description: 'Your cheerful coding companion who celebrates every victory'
    },
    direct: {
      name: 'Code Master Pro',
      style: 'direct',
      traits: ['Efficient', 'Logical', 'Precise', 'Technical'],
      teachingApproach: 'Provides clear, concise explanations with practical examples',
      color: 'neon-blue',
      gradient: 'from-neon-blue to-blue-400',
      description: 'Straight to the point with efficient solutions'
    },
    humorous: {
      name: 'Debug Duck',
      style: 'humorous',
      traits: ['Funny', 'Creative', 'Relaxed', 'Entertaining'],
      teachingApproach: 'Makes learning fun with jokes and memorable analogies',
      color: 'neon-yellow',
      gradient: 'from-neon-yellow to-yellow-400',
      description: 'Makes coding fun with jokes and witty explanations'
    },
    analytical: {
      name: 'Data Sage',
      style: 'analytical',
      traits: ['Thorough', 'Methodical', 'Insightful', 'Strategic'],
      teachingApproach: 'Breaks down complex concepts systematically',
      color: 'neon-purple',
      gradient: 'from-neon-purple to-purple-400',
      description: 'Deep analytical insights and systematic problem solving'
    },
    supportive: {
      name: 'Mentor Maya',
      style: 'supportive',
      traits: ['Empathetic', 'Understanding', 'Nurturing', 'Wise'],
      teachingApproach: 'Provides gentle guidance and emotional support',
      color: 'neon-pink',
      gradient: 'from-neon-pink to-pink-400',
      description: 'Gentle guidance through challenging concepts'
    }
  };

  const personalityMoods = {
    encouraging: '😊',
    direct: '🤖',
    humorous: '😄',
    analytical: '🧠',
    supportive: '💝'
  };

  // Enhanced scroll management
  const scrollToBottom = (force = false) => {
    if ((shouldAutoScroll && !userScrolledUp) || force) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Detect user scroll behavior
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setUserScrolledUp(!isNearBottom);
    setShouldAutoScroll(isNearBottom);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Only auto-scroll for new messages, not during loading
  useEffect(() => {
    if (!isLoading && chatHistory.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [chatHistory.length]);

  // Update conversation context when chat history changes
  useEffect(() => {
    const recentMessages = chatHistory.slice(-6);
    const context = recentMessages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
    setConversationContext(context);
  }, [chatHistory]);

  // Enhanced command detection for flashcards
  const detectFlashcardCommand = (text: string): { shouldGenerate: boolean; topic?: string; difficulty?: string } => {
    const lowerText = text.toLowerCase();
    
    // Command patterns
    const flashcardPatterns = [
      /make flashcard(?:s)?\s+(?:on|about|for)\s+(\w+)/i,
      /create flashcard(?:s)?\s+(?:on|about|for)\s+(\w+)/i,
      /generate flashcard(?:s)?\s+(?:on|about|for)\s+(\w+)/i,
      /flashcard(?:s)?\s+(?:on|about|for)\s+(\w+)/i,
      /(?:can you |please )?make (?:some )?flashcard(?:s)?/i,
      /(?:can you |please )?create (?:some )?flashcard(?:s)?/i,
      /(?:can you |please )?generate (?:some )?flashcard(?:s)?/i
    ];

    // Topic detection
    const programmingTopics = [
      'react', 'javascript', 'python', 'css', 'html', 'node', 'typescript', 
      'vue', 'angular', 'java', 'c++', 'algorithms', 'data structures',
      'api', 'database', 'sql', 'mongodb', 'express', 'hooks', 'components',
      'functions', 'variables', 'loops', 'arrays', 'objects', 'classes'
    ];

    // Difficulty detection
    const difficultyPatterns = {
      easy: /\b(easy|beginner|basic|simple)\b/i,
      medium: /\b(medium|intermediate|normal)\b/i,
      hard: /\b(hard|advanced|difficult|expert)\b/i
    };

    // Check for flashcard commands
    for (const pattern of flashcardPatterns) {
      const match = text.match(pattern);
      if (match) {
        const topic = match[1] || programmingTopics.find(t => lowerText.includes(t)) || currentTopic;
        const difficulty = Object.entries(difficultyPatterns).find(([_, pattern]) => 
          pattern.test(text)
        )?.[0] as 'easy' | 'medium' | 'hard';
        
        return { 
          shouldGenerate: true, 
          topic, 
          difficulty: difficulty || flashcardDifficulty 
        };
      }
    }

    return { shouldGenerate: false };
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    // Detect flashcard commands before sending
    const flashcardCommand = detectFlashcardCommand(message);

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date().toISOString(),
      personality: currentAIPersonality.id
    };

    addChatMessage(userMessage);
    setIsLoading(true);
    
    // Clear message immediately for better UX
    const currentMessage = message;
    setMessage('');

    try {
      const personalityConfig = personalityConfigs[currentAIPersonality.responseStyle as keyof typeof personalityConfigs];
      
      const userContext = {
        level: user?.level || 1,
        mood: user?.mood || 'neutral',
        currentTopic,
        learningGoals: []
      };

      // Generate AI response
      const aiResponse = await geminiService.generateAIResponse(
        currentMessage,
        personalityConfig,
        userContext
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
        personality: currentAIPersonality.id,
        mood: currentAIPersonality.responseStyle
      };
      
      addChatMessage(aiMessage);

      // Handle flashcard command
      if (flashcardCommand.shouldGenerate) {
        const topic = flashcardCommand.topic || currentTopic || 'programming';
        const difficulty = flashcardCommand.difficulty || flashcardDifficulty;
        
        // Add confirmation message
        const confirmationMessage = {
          id: (Date.now() + 2).toString(),
          content: `🎯 I'll create some ${difficulty} flashcards about ${topic} for you! Give me a moment to generate them...`,
          sender: 'ai' as const,
          timestamp: new Date().toISOString(),
          personality: currentAIPersonality.id,
          mood: 'helpful'
        };
        
        addChatMessage(confirmationMessage);
        
        // Generate flashcards
        setTimeout(() => {
          generateFlashcards(topic, difficulty);
        }, 1000);
      } else {
        // Detect programming topics from the conversation
        const programmingTopics = [
          'react', 'javascript', 'python', 'css', 'html', 'node', 'typescript', 
          'vue', 'angular', 'java', 'c++', 'algorithms', 'data structures',
          'api', 'database', 'sql', 'mongodb', 'express', 'hooks', 'components'
        ];
        
        const messageText = (currentMessage + ' ' + aiResponse).toLowerCase();
        const detectedTopic = programmingTopics.find(topic => 
          messageText.includes(topic)
        );

        if (detectedTopic && detectedTopic !== currentTopic) {
          setCurrentTopic(detectedTopic);
          
          // Auto-suggest flashcards for learning conversations
          if (messageText.includes('learn') || 
              messageText.includes('understand') || 
              messageText.includes('explain') ||
              messageText.includes('how') ||
              aiResponse.toLowerCase().includes('flashcard')) {
            setTimeout(() => {
              suggestFlashcards(detectedTopic);
            }, 2000);
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestFlashcards = (topic: string) => {
    const suggestionMessage = {
      id: (Date.now() + 3).toString(),
      content: `💡 I can create some flashcards to help you practice ${topic}! Just say "make flashcards on ${topic}" or choose a difficulty level. I can make them easy, medium, or hard.`,
      sender: 'ai' as const,
      timestamp: new Date().toISOString(),
      personality: currentAIPersonality.id,
      mood: 'helpful'
    };
    
    addChatMessage(suggestionMessage);
  };

  const generateFlashcards = async (topic: string, difficulty: 'easy' | 'medium' | 'hard' = flashcardDifficulty, count: number = 5) => {
    setIsGeneratingCards(true);
    
    try {
      const flashcards = await geminiService.generateFlashcards(
        topic,
        difficulty,
        count,
        user?.level || 1
      );
      
      setGeneratedFlashcards(flashcards);
      setShowFlashcards(true);
      
      const confirmationMessage = {
        id: Date.now().toString(),
        content: `✅ Perfect! I've created ${flashcards.length} ${difficulty} flashcards about ${topic}! You can find them in the practice panel on the right. Each correct answer earns you 25 XP! 🎯`,
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
        personality: currentAIPersonality.id,
        mood: 'accomplished'
      };
      
      addChatMessage(confirmationMessage);
      toast.success(`Generated ${flashcards.length} ${difficulty} flashcards for ${topic}!`);
      
    } catch (error) {
      console.error('Error generating flashcards:', error);
      
      const errorMessage = {
        id: Date.now().toString(),
        content: `❌ I had trouble generating flashcards right now, but I can still help you learn about ${topic}! Try asking me specific questions about the topic instead.`,
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
        personality: currentAIPersonality.id,
        mood: 'apologetic'
      };
      
      addChatMessage(errorMessage);
      toast.error('Failed to generate flashcards');
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const generateContextualFlashcards = async () => {
    if (!conversationContext.trim()) {
      toast.error('No conversation context available');
      return;
    }

    setIsGeneratingCards(true);
    
    try {
      const flashcards = await geminiService.generateTopicFlashcards(
        conversationContext,
        flashcardDifficulty,
        3
      );
      
      setGeneratedFlashcards(flashcards);
      setShowFlashcards(true);
      
      const confirmationMessage = {
        id: Date.now().toString(),
        content: `🎯 I've created flashcards based on our conversation! These questions will help you practice what we just discussed.`,
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
        personality: currentAIPersonality.id,
        mood: 'accomplished'
      };
      
      addChatMessage(confirmationMessage);
      toast.success(`Generated contextual flashcards!`);
      
    } catch (error) {
      console.error('Error generating contextual flashcards:', error);
      toast.error('Failed to generate flashcards');
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleFlashcardComplete = (results: { correct: number; total: number; xpEarned: number }) => {
    addXP(results.xpEarned, 'flashcard_practice');
    
    addNotification({
      title: 'Flashcard Practice Complete!',
      message: `You got ${results.correct}/${results.total} correct and earned ${results.xpEarned} XP!`,
      type: 'success',
      read: false,
      priority: 'medium',
      icon: '🎯'
    });
    
    const completionMessage = {
      id: Date.now().toString(),
      content: `🎉 Excellent work! You got ${results.correct}/${results.total} correct and earned ${results.xpEarned} XP! ${results.correct === results.total ? "Perfect score! You're really mastering this topic!" : "Great progress! Keep practicing to strengthen your understanding."}`,
      sender: 'ai' as const,
      timestamp: new Date().toISOString(),
      personality: currentAIPersonality.id,
      mood: 'proud'
    };
    
    addChatMessage(completionMessage);
    toast.success(`Earned ${results.xpEarned} XP from flashcard practice!`);
  };

  const quickActions = [
    { 
      icon: <Code className="w-5 h-5" />, 
      text: "Debug Help", 
      color: "neon-cyan",
      gradient: "from-neon-cyan to-cyan-400",
      message: "I'm having trouble debugging my code. Can you help me understand common debugging techniques and best practices?"
    },
    { 
      icon: <Lightbulb className="w-5 h-5" />, 
      text: "React Concepts", 
      color: "neon-yellow",
      gradient: "from-neon-yellow to-yellow-400",
      message: "Can you explain React hooks and how they work? I'd like to understand useState and useEffect better with some examples."
    },
    { 
      icon: <HelpCircle className="w-5 h-5" />, 
      text: "JavaScript Fundamentals", 
      color: "neon-purple",
      gradient: "from-neon-purple to-purple-400",
      message: "I want to strengthen my JavaScript fundamentals. Can you help me understand closures, scope, and the event loop?"
    },
    { 
      icon: <BookOpen className="w-5 h-5" />, 
      text: "Generate Flashcards", 
      color: "neon-pink",
      gradient: "from-neon-pink to-pink-400",
      message: "Make flashcards on JavaScript functions to help me practice"
    }
  ];

  const handleQuickAction = (actionMessage: string) => {
    setMessage(actionMessage);
    setTimeout(() => sendMessage(), 100);
  };

  const currentPersonalityConfig = personalityConfigs[currentAIPersonality.responseStyle as keyof typeof personalityConfigs];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 bg-star-field opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 animate-pulse-neon pointer-events-none"></div>
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${currentPersonalityConfig.gradient} opacity-10 blur-xl`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8 space-y-8">
        {/* Premium Header */}
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center space-x-6 mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentPersonalityConfig.gradient} flex items-center justify-center shadow-2xl`}
              animate={{ 
                rotate: [0, 360],
                boxShadow: [
                  `0 0 30px rgba(139, 92, 246, 0.3)`,
                  `0 0 60px rgba(139, 92, 246, 0.5)`,
                  `0 0 30px rgba(139, 92, 246, 0.3)`
                ]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Bot className="w-10 h-10 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-neon-cyan to-neon-purple bg-clip-text text-transparent mb-3 font-game">
                AI Coding Companion
              </h1>
              <p className="text-xl text-gray-300 font-space max-w-2xl">
                Your personalized coding mentor with AI-powered flashcard generation and adaptive learning
              </p>
            </div>
          </motion.div>
          
          {/* Status Indicators */}
          <motion.div
            className="flex justify-center space-x-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-neon-green/30">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-neon-green font-medium font-space">AI Online</span>
            </div>
            <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-neon-blue/30">
              <Brain className="w-4 h-4 text-neon-blue" />
              <span className="text-neon-blue font-medium font-space">{currentPersonalityConfig.name}</span>
            </div>
            {currentTopic && (
              <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-neon-purple/30">
                <Target className="w-4 h-4 text-neon-purple" />
                <span className="text-neon-purple font-medium font-space">{currentTopic}</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Personality & Controls Panel */}
          <motion.div
            className="xl:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* AI Personality Selector */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-neon-purple/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white font-game flex items-center">
                  <Settings className="w-5 h-5 mr-3 text-neon-purple" />
                  AI Personalities
                </h2>
                <motion.button
                  onClick={() => setShowPersonalityDetails(!showPersonalityDetails)}
                  className="p-2 rounded-lg bg-neon-purple/10 hover:bg-neon-purple/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4 text-neon-purple" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {availablePersonalities.map((personality, index) => {
                  const config = personalityConfigs[personality.responseStyle as keyof typeof personalityConfigs];
                  const isActive = currentAIPersonality.id === personality.id;
                  
                  return (
                    <motion.button
                      key={personality.id}
                      onClick={() => switchPersonality(personality.id)}
                      className={`w-full p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                        isActive
                          ? `bg-gradient-to-r ${config.gradient}/20 border-${config.color}/50 shadow-lg`
                          : 'bg-black/20 border-dark-600 hover:border-gray-500 hover:bg-black/30'
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {isActive && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-5`}
                          animate={{ opacity: [0.05, 0.1, 0.05] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      <div className="relative z-10">
                        <div className="flex items-center mb-3">
                          <motion.div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-xl mr-4 shadow-lg`}
                            animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {personality.avatar}
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-white font-space">{config.name}</h3>
                            <p className="text-xs text-gray-400 font-space capitalize">{personality.responseStyle}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-3 font-space leading-relaxed">
                          {config.description}
                        </p>
                        
                        <AnimatePresence>
                          {(showPersonalityDetails || isActive) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2"
                            >
                              <div className="flex flex-wrap gap-1">
                                {config.traits.map((trait) => (
                                  <span
                                    key={trait}
                                    className={`px-2 py-1 bg-${config.color}/20 text-${config.color} text-xs rounded-full border border-${config.color}/30 font-space`}
                                  >
                                    {trait}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-gray-400 font-space italic">
                                {config.teachingApproach}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-neon-cyan/20 shadow-2xl">
              <h3 className="font-bold text-white mb-4 font-space flex items-center">
                <Rocket className="w-5 h-5 mr-3 text-neon-cyan" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickAction(action.message)}
                    className={`w-full p-4 bg-gradient-to-r ${action.gradient}/10 border border-${action.color}/30 rounded-xl hover:${action.gradient}/20 transition-all text-left flex items-center group`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`text-${action.color} mr-4 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium text-white font-space">{action.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Flashcard Controls */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-neon-pink/20 shadow-2xl">
              <h3 className="font-bold text-white mb-4 font-space flex items-center">
                <Layers className="w-5 h-5 mr-3 text-neon-pink" />
                Flashcard Generator
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-space">Difficulty</label>
                  <select
                    value={flashcardDifficulty}
                    onChange={(e) => setFlashcardDifficulty(e.target.value as any)}
                    className="w-full bg-dark-800/50 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-pink focus:outline-none font-space"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {currentTopic && (
                    <motion.button
                      onClick={() => generateFlashcards(currentTopic)}
                      disabled={isGeneratingCards}
                      className="w-full p-3 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-cyan/25 transition-all disabled:opacity-50 flex items-center justify-center font-space"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isGeneratingCards ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          {currentTopic} Cards
                        </>
                      )}
                    </motion.button>
                  )}

                  {conversationContext && (
                    <motion.button
                      onClick={generateContextualFlashcards}
                      disabled={isGeneratingCards}
                      className="w-full p-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all disabled:opacity-50 flex items-center justify-center font-space"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isGeneratingCards ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          From Chat
                        </>
                      )}
                    </motion.button>
                  )}
                </div>

                <div className="p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                  <h4 className="text-xs font-medium text-neon-blue mb-2 font-space">💡 Try saying:</h4>
                  <div className="space-y-1 text-xs text-gray-400 font-space">
                    <p>"Make flashcards on React"</p>
                    <p>"Create easy JavaScript cards"</p>
                    <p>"Generate hard CSS flashcards"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            className="xl:col-span-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-neon-cyan/20 flex flex-col shadow-2xl"
            style={{ height: '700px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Enhanced Chat Header */}
            <div className="p-6 border-b border-dark-700/50 flex-shrink-0 bg-gradient-to-r from-black/20 to-black/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <motion.div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${currentPersonalityConfig.gradient} flex items-center justify-center text-2xl mr-4 shadow-lg`}
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      boxShadow: [
                        `0 0 20px rgba(139, 92, 246, 0.3)`,
                        `0 0 40px rgba(139, 92, 246, 0.5)`,
                        `0 0 20px rgba(139, 92, 246, 0.3)`
                      ]
                    }}
                    transition={{ 
                      rotate: { duration: 3, repeat: Infinity },
                      boxShadow: { duration: 2, repeat: Infinity }
                    }}
                  >
                    {currentAIPersonality.avatar}
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-xl text-white font-game">{currentPersonalityConfig.name}</h3>
                    <p className="text-sm text-gray-400 font-space flex items-center">
                      {personalityMoods[currentAIPersonality.responseStyle]} {currentPersonalityConfig.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg transition-all ${soundEnabled ? 'bg-neon-green/20 text-neon-green' : 'bg-dark-700 text-gray-400'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </motion.button>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400 font-space">Online</span>
                  </div>
                </div>
              </div>
              
              {currentTopic && (
                <motion.div
                  className="mt-4 flex items-center space-x-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-xs text-gray-400 font-space">Current topic:</span>
                  <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-xs rounded-full border border-neon-cyan/30 font-space">
                    {currentTopic}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Messages Container */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              <AnimatePresence>
                {chatHistory.length === 0 ? (
                  <motion.div
                    className="text-center py-16 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bot className="w-20 h-20 mx-auto mb-6 opacity-50" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 font-game">Start Your Coding Journey!</h3>
                    <p className="text-lg font-space mb-6 max-w-md mx-auto">
                      Ask me anything about coding, debugging, or learning new concepts. I'm here to help you grow!
                    </p>
                    <div className="bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 border border-neon-purple/30 rounded-xl p-6 max-w-lg mx-auto">
                      <h4 className="text-lg font-bold text-neon-purple mb-3 font-space">💡 Pro Tip:</h4>
                      <p className="text-sm text-gray-300 font-space leading-relaxed">
                        Say "make flashcards on [topic]" and I'll create personalized practice questions to accelerate your learning!
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  chatHistory.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      layout
                    >
                      <div
                        className={`max-w-[80%] p-5 rounded-2xl shadow-lg ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                            : 'bg-black/30 border border-dark-600 backdrop-blur-md'
                        }`}
                      >
                        <p className="text-sm font-space whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-3 font-space">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                  >
                    <div className="bg-black/30 border border-dark-600 backdrop-blur-md rounded-2xl p-5 flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader className="w-5 h-5 text-neon-cyan" />
                      </motion.div>
                      <span className="text-sm text-gray-400 font-space">
                        {currentPersonalityConfig.name} is thinking...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {userScrolledUp && (
                <motion.button
                  onClick={() => scrollToBottom(true)}
                  className="absolute bottom-28 right-8 p-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 rounded-full border border-neon-cyan/30 transition-all shadow-lg backdrop-blur-md"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowDown className="w-5 h-5 text-neon-cyan" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Enhanced Message Input */}
            <div className="p-6 border-t border-dark-700/50 flex-shrink-0 bg-gradient-to-r from-black/10 to-black/20">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                    placeholder={`Ask ${currentPersonalityConfig.name} anything or say "make flashcards on [topic]"...`}
                    className="w-full bg-dark-900/50 border border-dark-600 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-neon-purple focus:outline-none font-space backdrop-blur-md"
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {message.trim() && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xs text-gray-400 font-space"
                      >
                        {message.length}/500
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <motion.button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-4 rounded-xl transition-all ${
                    isListening
                      ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
                      : 'bg-dark-700 text-gray-400 hover:text-white border border-dark-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  onClick={sendMessage}
                  disabled={!message.trim() || isLoading}
                  className="p-4 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-xl text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-neon-purple/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Flashcard Practice Panel */}
          <motion.div
            className="xl:col-span-3 bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-neon-cyan/20 shadow-2xl h-fit"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center font-game">
              <Layers className="w-5 h-5 mr-3 text-neon-cyan" />
              Practice Cards
            </h2>

            {showFlashcards && generatedFlashcards.length > 0 ? (
              <FlashcardWidget
                flashcards={generatedFlashcards}
                onComplete={handleFlashcardComplete}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 font-game">No Practice Cards</h3>
                <p className="text-sm font-space mb-6 leading-relaxed">
                  Ask me about a programming topic or say "make flashcards" and I'll generate personalized practice questions!
                </p>
                
                <div className="space-y-3">
                  {currentTopic && (
                    <motion.button
                      onClick={() => generateFlashcards(currentTopic)}
                      disabled={isGeneratingCards}
                      className="w-full px-4 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-cyan/25 transition-all disabled:opacity-50 flex items-center justify-center font-space"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isGeneratingCards ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate {currentTopic} Cards
                        </>
                      )}
                    </motion.button>
                  )}

                  {conversationContext && (
                    <motion.button
                      onClick={generateContextualFlashcards}
                      disabled={isGeneratingCards}
                      className="w-full px-4 py-3 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all disabled:opacity-50 flex items-center justify-center font-space"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isGeneratingCards ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          From Our Chat
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            )}

            {/* XP Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-neon-yellow/10 to-neon-orange/10 border border-neon-yellow/30 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-5 h-5 text-neon-yellow" />
                <span className="font-bold text-neon-yellow text-sm font-space">Earn XP</span>
              </div>
              <p className="text-xs text-gray-400 font-space leading-relaxed">
                Get 25 XP for each correct flashcard answer! Practice makes perfect and builds your coding mastery.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIBuddy;