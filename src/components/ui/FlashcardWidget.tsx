import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Star,
  Brain,
  Zap,
  Eye,
  EyeOff,
  Code,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { FlashcardData } from '../../services/geminiService';

interface FlashcardWidgetProps {
  flashcards: FlashcardData[];
  onComplete?: (results: { correct: number; total: number; xpEarned: number }) => void;
  className?: string;
}

const FlashcardWidget: React.FC<FlashcardWidgetProps> = ({ 
  flashcards, 
  onComplete,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleAnswer = (correct: boolean) => {
    const newResults = [...results, correct];
    setResults(newResults);

    if (currentIndex < flashcards.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setShowExplanation(false);
      }, 1500);
    } else {
      const correctCount = newResults.filter(Boolean).length;
      const xpEarned = correctCount * 25;
      setSessionComplete(true);
      onComplete?.({
        correct: correctCount,
        total: flashcards.length,
        xpEarned
      });
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setShowExplanation(false);
    setResults([]);
    setSessionComplete(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-neon-green border-neon-green/30 bg-neon-green/10';
      case 'medium': return 'text-neon-yellow border-neon-yellow/30 bg-neon-yellow/10';
      case 'hard': return 'text-neon-red border-neon-red/30 bg-neon-red/10';
      default: return 'text-neon-blue border-neon-blue/30 bg-neon-blue/10';
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className={`bg-black/20 rounded-lg p-6 border border-dark-600 text-center ${className}`}>
        <Layers className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
        <p className="text-gray-400 font-space">No flashcards available</p>
      </div>
    );
  }

  if (sessionComplete) {
    const correctCount = results.filter(Boolean).length;
    const accuracy = Math.round((correctCount / results.length) * 100);
    const xpEarned = correctCount * 25;

    return (
      <motion.div
        className={`bg-black/20 rounded-lg p-6 border border-neon-green/30 text-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1 }}
        >
          <Star className="w-16 h-16 mx-auto mb-4 text-neon-yellow" />
        </motion.div>
        
        <h3 className="text-xl font-bold mb-4 font-game">Session Complete!</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-neon-green">{correctCount}</div>
            <div className="text-xs text-gray-400 font-space">Correct</div>
          </div>
          <div className="p-3 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-neon-cyan">{accuracy}%</div>
            <div className="text-xs text-gray-400 font-space">Accuracy</div>
          </div>
        </div>

        <div className="p-3 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg mb-6">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 text-neon-yellow" />
            <span className="font-bold text-neon-yellow font-space">+{xpEarned} XP Earned!</span>
          </div>
        </div>

        <motion.button
          onClick={resetSession}
          className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-blue/25 transition-all flex items-center mx-auto font-space"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Practice Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className={`bg-black/20 rounded-lg border border-neon-blue/30 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-dark-600 bg-black/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-neon-blue" />
            <span className="font-medium font-space">Flashcard Practice</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(currentCard.difficulty)} font-space`}>
            {currentCard.difficulty.toUpperCase()}
          </span>
        </div>
        
        {/* Progress */}
        <div className="flex justify-between text-sm text-gray-400 mb-2 font-space">
          <span>Progress</span>
          <span>{currentIndex + 1} / {flashcards.length}</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-neon-blue to-neon-cyan h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3 font-game">
                {currentCard.question}
              </h3>
              
              {/* Category and Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full border border-neon-purple/30 font-space">
                  {currentCard.category}
                </span>
                {currentCard.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded-full border border-neon-blue/30 font-space"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              {!showAnswer ? (
                <motion.button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all flex items-center justify-center font-space"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Show Answer
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Answer */}
                  <div className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                    <h4 className="font-medium text-neon-blue mb-2 font-space">Answer:</h4>
                    <p className="text-white text-sm leading-relaxed font-space">
                      {currentCard.answer}
                    </p>
                  </div>

                  {/* Code Example */}
                  {currentCard.codeExample && (
                    <div className="p-4 bg-dark-900/50 border border-dark-600 rounded-lg">
                      <h4 className="font-medium text-neon-green mb-2 flex items-center font-space">
                        <Code className="w-4 h-4 mr-2" />
                        Code Example:
                      </h4>
                      <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                        {currentCard.codeExample}
                      </pre>
                    </div>
                  )}

                  {/* Explanation */}
                  {currentCard.explanation && (
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="flex items-center space-x-2 text-neon-yellow hover:text-white transition-colors font-space"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-sm">
                          {showExplanation ? 'Hide' : 'Show'} Explanation
                        </span>
                      </motion.button>
                      
                      <AnimatePresence>
                        {showExplanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg"
                          >
                            <p className="text-sm text-gray-300 font-space">
                              {currentCard.explanation}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Answer Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={() => handleAnswer(true)}
                      className="py-3 bg-gradient-to-r from-neon-green to-green-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-green/25 transition-all flex items-center justify-center font-space"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Got it right!
                    </motion.button>
                    <motion.button
                      onClick={() => handleAnswer(false)}
                      className="py-3 bg-gradient-to-r from-neon-red to-red-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-red/25 transition-all flex items-center justify-center font-space"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Need to study
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Results Preview */}
      {results.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-400 mr-2 font-space">Results:</span>
            {results.map((correct, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  correct ? 'bg-neon-green' : 'bg-neon-red'
                }`}
              />
            ))}
            {/* Show remaining cards */}
            {Array.from({ length: flashcards.length - results.length }).map((_, index) => (
              <div
                key={`remaining-${index}`}
                className="w-2 h-2 rounded-full bg-gray-600"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardWidget;