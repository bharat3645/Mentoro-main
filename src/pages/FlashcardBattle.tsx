import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Sword, 
  Trophy, 
  Star,
  Zap,
  Timer,
  Target,
  Shuffle,
  Play,
  CheckCircle,
  XCircle,
  Brain,
  Users,
  Award,
  Crown,
  Flame,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { flashcardAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_value: number;
  times_played: number;
  correct_answers: number;
  tags: string[];
}

const FlashcardBattle: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'collection' | 'battle' | 'practice'>('practice');
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    totalTime: 0,
    xpEarned: 0
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const { user, addXP, addNotification } = useGameStore();

  // Mock flashcards data
  const mockFlashcards: Flashcard[] = [
    {
      id: '1',
      question: 'What is the time complexity of binary search?',
      answer: 'O(log n) - Binary search eliminates half of the remaining elements in each iteration.',
      category: 'Algorithms',
      difficulty: 'medium',
      rarity: 'common',
      xp_value: 50,
      times_played: 15,
      correct_answers: 12,
      tags: ['algorithms', 'complexity', 'search']
    },
    {
      id: '2',
      question: 'What does CSS stand for?',
      answer: 'Cascading Style Sheets - A language used to describe the presentation of HTML documents.',
      category: 'Web Development',
      difficulty: 'easy',
      rarity: 'common',
      xp_value: 25,
      times_played: 8,
      correct_answers: 7,
      tags: ['css', 'web', 'styling']
    },
    {
      id: '3',
      question: 'Explain closures in JavaScript',
      answer: 'A closure is a function that has access to variables in its outer scope even after the outer function has returned.',
      category: 'JavaScript',
      difficulty: 'hard',
      rarity: 'epic',
      xp_value: 150,
      times_played: 5,
      correct_answers: 3,
      tags: ['javascript', 'closures', 'scope']
    },
    {
      id: '4',
      question: 'What is React Virtual DOM?',
      answer: 'A JavaScript representation of the real DOM kept in memory for optimization.',
      category: 'React',
      difficulty: 'medium',
      rarity: 'rare',
      xp_value: 75,
      times_played: 10,
      correct_answers: 8,
      tags: ['react', 'virtual-dom', 'performance']
    },
    {
      id: '5',
      question: 'What is Big O notation?',
      answer: 'A mathematical notation used to describe the upper bound of an algorithm\'s complexity.',
      category: 'Algorithms',
      difficulty: 'medium',
      rarity: 'common',
      xp_value: 60,
      times_played: 12,
      correct_answers: 9,
      tags: ['algorithms', 'complexity', 'big-o']
    },
    {
      id: '6',
      question: 'What is a REST API?',
      answer: 'Representational State Transfer - An architectural style for web services using HTTP methods.',
      category: 'Web Development',
      difficulty: 'medium',
      rarity: 'common',
      xp_value: 55,
      times_played: 7,
      correct_answers: 6,
      tags: ['api', 'rest', 'http']
    }
  ];

  useEffect(() => {
    setCards(mockFlashcards);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  const handleTimeUp = () => {
    handleAnswer(false);
  };

  const startPracticeSession = () => {
    if (cards.length === 0) return;
    
    const filteredCards = cards.filter(card => {
      const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || card.difficulty === selectedDifficulty;
      return matchesCategory && matchesDifficulty;
    });

    if (filteredCards.length === 0) {
      toast.error('No cards match your filters');
      return;
    }
    
    setIsPlaying(true);
    setCurrentCardIndex(0);
    setCurrentCard(filteredCards[0]);
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setShowAnswer(false);
    setUserAnswer('');
    setSessionStats({ correct: 0, incorrect: 0, totalTime: 0, xpEarned: 0 });
    setCards(filteredCards);
  };

  const handleAnswer = async (correct: boolean) => {
    if (!currentCard) return;

    const responseTime = 30 - timeLeft;
    
    if (correct) {
      setScore(score + currentCard.xp_value);
      setStreak(streak + 1);
      setSessionStats(prev => ({
        ...prev,
        correct: prev.correct + 1,
        xpEarned: prev.xpEarned + currentCard.xp_value
      }));
      
      addXP(currentCard.xp_value, 'flashcard_correct');
      
      addNotification({
        title: 'Correct!',
        message: `+${currentCard.xp_value} XP earned!`,
        type: 'success',
        read: false,
        priority: 'low'
      });
    } else {
      setStreak(0);
      setSessionStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1
      }));
    }

    // Move to next card
    setTimeout(() => {
      nextCard();
    }, 1500);
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);
      setCurrentCard(cards[nextIndex]);
      setTimeLeft(30);
      setShowAnswer(false);
      setUserAnswer('');
    } else {
      endSession();
    }
  };

  const endSession = () => {
    setIsPlaying(false);
    addNotification({
      title: 'Session Complete!',
      message: `You answered ${sessionStats.correct} questions correctly and earned ${sessionStats.xpEarned} XP!`,
      type: 'success',
      read: false,
      priority: 'medium'
    });
  };

  const battleStats = {
    totalBattles: 23,
    wins: 17,
    winRate: 74,
    currentStreak: streak,
    cardsCollected: cards.length,
    totalCards: 120
  };

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600'
  };

  const difficultyColors = {
    easy: 'text-neon-green border-neon-green/30',
    medium: 'text-neon-yellow border-neon-yellow/30',
    hard: 'text-neon-pink border-neon-pink/30'
  };

  const categories = ['all', 'Algorithms', 'Web Development', 'JavaScript', 'React'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredCards = cards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || card.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Layers className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent font-game">
              Card Nexus
            </h1>
            <p className="text-gray-400 text-lg font-space">
              Master knowledge through interactive flashcard battles
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-cyan/20 text-center">
          <Layers className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{battleStats.cardsCollected}</p>
          <p className="text-sm text-gray-400">Cards Available</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-purple/20 text-center">
          <Sword className="w-6 h-6 text-neon-purple mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{battleStats.totalBattles}</p>
          <p className="text-sm text-gray-400">Sessions</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-yellow/20 text-center">
          <Trophy className="w-6 h-6 text-neon-yellow mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{battleStats.wins}</p>
          <p className="text-sm text-gray-400">Correct</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-green/20 text-center">
          <Target className="w-6 h-6 text-neon-green mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{battleStats.winRate}%</p>
          <p className="text-sm text-gray-400">Accuracy</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-pink/20 text-center">
          <Flame className="w-6 h-6 text-neon-pink mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{streak}</p>
          <p className="text-sm text-gray-400">Current Streak</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-purple/20 text-center">
          <Star className="w-6 h-6 text-neon-purple mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{Math.round((battleStats.cardsCollected / battleStats.totalCards) * 100)}%</p>
          <p className="text-sm text-gray-400">Collection</p>
        </div>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        className="flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { id: 'practice', name: 'Practice Mode', icon: <Brain className="w-5 h-5" /> },
          { id: 'battle', name: 'Battle Mode', icon: <Sword className="w-5 h-5" /> },
          { id: 'collection', name: 'Card Collection', icon: <Layers className="w-5 h-5" /> }
        ].map((mode) => (
          <motion.button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              selectedMode === mode.id
                ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mode.icon}
            <span>{mode.name}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {selectedMode === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-neon-green/20"
          >
            {!isPlaying ? (
              <div>
                <div className="text-center mb-8">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-neon-green" />
                  <h2 className="text-2xl font-bold mb-4 font-game">Practice Mode</h2>
                  <p className="text-gray-400 mb-8 font-space">
                    Test your knowledge and earn XP with interactive flashcards
                  </p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-green focus:outline-none"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-neon-green focus:outline-none"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
                  <div className="p-6 bg-black/20 border border-neon-green/20 rounded-lg text-center">
                    <Shuffle className="w-8 h-8 mx-auto mb-3 text-neon-green" />
                    <h3 className="font-medium mb-2">Smart Selection</h3>
                    <p className="text-sm text-gray-400">Cards selected based on your filters</p>
                  </div>
                  
                  <div className="p-6 bg-black/20 border border-neon-yellow/20 rounded-lg text-center">
                    <Timer className="w-8 h-8 mx-auto mb-3 text-neon-yellow" />
                    <h3 className="font-medium mb-2">Timed Challenge</h3>
                    <p className="text-sm text-gray-400">30 seconds per question</p>
                  </div>
                  
                  <div className="p-6 bg-black/20 border border-neon-purple/20 rounded-lg text-center">
                    <Zap className="w-8 h-8 mx-auto mb-3 text-neon-purple" />
                    <h3 className="font-medium mb-2">XP Rewards</h3>
                    <p className="text-sm text-gray-400">Earn XP for correct answers</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-4">
                    {filteredCards.length} cards available with current filters
                  </p>
                  <motion.button
                    onClick={startPracticeSession}
                    disabled={filteredCards.length === 0}
                    className="px-8 py-4 bg-gradient-to-r from-neon-green to-neon-cyan rounded-lg font-bold text-white hover:shadow-lg hover:shadow-neon-green/25 transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    Start Practice Session
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {/* Game Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-neon-cyan">
                      Score: {score}
                    </div>
                    <div className="text-lg text-neon-pink">
                      Streak: {streak}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Timer className="w-5 h-5 text-neon-yellow" />
                    <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-neon-red animate-pulse' : 'text-neon-yellow'}`}>
                      {timeLeft}s
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{currentCardIndex + 1} / {cards.length}</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-neon-green to-neon-cyan h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Current Card */}
                {currentCard && (
                  <motion.div
                    key={currentCard.id}
                    className="bg-black/20 border border-neon-blue/30 rounded-xl p-8 mb-6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${difficultyColors[currentCard.difficulty]} mb-4`}>
                        {currentCard.difficulty.toUpperCase()}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 font-game">
                        {currentCard.question}
                      </h3>
                    </div>

                    {!showAnswer ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none"
                          onKeyPress={(e) => e.key === 'Enter' && setShowAnswer(true)}
                        />
                        <motion.button
                          onClick={() => setShowAnswer(true)}
                          className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-blue/25 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Show Answer
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                          <h4 className="font-medium text-neon-blue mb-2">Correct Answer:</h4>
                          <p className="text-white">{currentCard.answer}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <motion.button
                            onClick={() => handleAnswer(true)}
                            className="py-3 bg-gradient-to-r from-neon-green to-green-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-green/25 transition-all flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Correct
                          </motion.button>
                          <motion.button
                            onClick={() => handleAnswer(false)}
                            className="py-3 bg-gradient-to-r from-neon-red to-red-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-red/25 transition-all flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <XCircle className="w-5 h-5 mr-2" />
                            Incorrect
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Session Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-black/20 rounded-lg">
                    <div className="text-lg font-bold text-neon-green">{sessionStats.correct}</div>
                    <div className="text-xs text-gray-400">Correct</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg">
                    <div className="text-lg font-bold text-neon-red">{sessionStats.incorrect}</div>
                    <div className="text-xs text-gray-400">Incorrect</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg">
                    <div className="text-lg font-bold text-neon-yellow">{sessionStats.xpEarned}</div>
                    <div className="text-xs text-gray-400">XP Earned</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {selectedMode === 'battle' && (
          <motion.div
            key="battle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-neon-red/20 text-center"
          >
            <Sword className="w-16 h-16 mx-auto mb-4 text-neon-red" />
            <h2 className="text-2xl font-bold mb-4 font-game">Battle Mode</h2>
            <p className="text-gray-400 mb-8 font-space">
              Challenge other players in real-time flashcard battles!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <motion.button
                className="p-6 bg-black/20 border border-dark-600 rounded-lg hover:border-neon-red/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Timer className="w-8 h-8 mx-auto mb-3 text-neon-cyan" />
                <h3 className="font-medium mb-2">Quick Battle</h3>
                <p className="text-sm text-gray-400">Find a random opponent instantly</p>
              </motion.button>
              
              <motion.button
                className="p-6 bg-black/20 border border-dark-600 rounded-lg hover:border-neon-red/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trophy className="w-8 h-8 mx-auto mb-3 text-neon-yellow" />
                <h3 className="font-medium mb-2">Ranked Battle</h3>
                <p className="text-sm text-gray-400">Compete for ranking points</p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {selectedMode === 'collection' && (
          <motion.div
            key="collection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-center font-game">Card Collection</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className="p-4 bg-black/20 rounded-lg border border-dark-600 hover:border-neon-cyan/50 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${rarityColors[card.rarity]} opacity-10`} />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColors[card.difficulty]}`}>
                        {card.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${rarityColors[card.rarity]} text-white`}>
                        {card.rarity}
                      </span>
                    </div>

                    <h3 className="font-medium text-white mb-2 line-clamp-2">
                      {card.question}
                    </h3>

                    <p className="text-sm text-gray-400 mb-3">{card.category}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                      <div>Played: {card.times_played}</div>
                      <div>Accuracy: {card.times_played > 0 ? Math.round((card.correct_answers / card.times_played) * 100) : 0}%</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-neon-yellow" />
                        <span className="text-xs text-neon-yellow font-bold">{card.xp_value} XP</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {card.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-1 py-0.5 bg-dark-700 text-xs rounded text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashcardBattle;