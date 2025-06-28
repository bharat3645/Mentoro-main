import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Page Components
import Dashboard from './pages/Dashboard';
import CodingArena from './pages/CodingArena';
import SkillTree from './pages/SkillTree';
import DIYGenerator from './pages/DIYGenerator';
import AIBuddy from './pages/AIBuddy';
import FlashcardBattle from './pages/FlashcardBattle';
import ArchitectMode from './pages/ArchitectMode';
import EmotionDashboard from './pages/EmotionDashboard';

// Hooks
import { useGameStore } from './store/gameStore';

function App() {
  const { currentTheme, initializeUser } = useGameStore();

  useEffect(() => {
    // Initialize demo user
    initializeUser();
  }, [initializeUser]);

  return (
    <Router>
      <div className={`min-h-screen bg-space-gradient text-white ${currentTheme} relative overflow-hidden`}>
        {/* Background Effects */}
        <div className="fixed inset-0 bg-star-field opacity-30 pointer-events-none"></div>
        <div className="fixed inset-0 bg-nebula pointer-events-none"></div>
        
        {/* Floating Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-neon-${['blue', 'purple', 'cyan', 'pink', 'yellow', 'green'][i % 6]} rounded-full animate-particle`}
              style={{ 
                left: `${(i + 1) * 10}%`, 
                animationDelay: `${i}s`,
                animationDuration: `${4 + (i % 3)}s`
              }}
            />
          ))}
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#ffffff',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        
        <div className="flex h-screen relative z-10">
          <Sidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            
            <main className="flex-1 overflow-auto p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/arena" element={<CodingArena />} />
                  <Route path="/skill-tree" element={<SkillTree />} />
                  <Route path="/diy" element={<DIYGenerator />} />
                  <Route path="/ai-buddy" element={<AIBuddy />} />
                  <Route path="/flashcards" element={<FlashcardBattle />} />
                  <Route path="/architect" element={<ArchitectMode />} />
                  <Route path="/emotions" element={<EmotionDashboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;