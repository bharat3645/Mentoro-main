import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Swords, 
  Users, 
  Timer, 
  Trophy, 
  Zap,
  Play,
  Crown,
  Target,
  Settings,
  Gamepad2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { battleAPI } from '../services/api';
import BattleRoom from '../components/battle/BattleRoom';
import toast from 'react-hot-toast';

const CodingArena: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedMode, setSelectedMode] = useState<'quick' | 'ranked' | 'custom'>('quick');
  const [activeBattles, setActiveBattles] = useState<any[]>([]);
  const [currentBattle, setCurrentBattle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [battleConfig, setBattleConfig] = useState({
    difficulty: 'easy',
    xp_wager: 100,
    time_limit: 1800
  });

  useEffect(() => {
    loadActiveBattles();
    const interval = setInterval(loadActiveBattles, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadActiveBattles = async () => {
    try {
      const response = await battleAPI.getActiveBattles();
      setActiveBattles(response.battles);
    } catch (error) {
      console.error('Error loading active battles:', error);
    }
  };

  const arenaStats = {
    totalBattles: profile?.total_battles || 0,
    wins: profile?.battles_won || 0,
    winRate: profile?.total_battles ? Math.round((profile.battles_won / profile.total_battles) * 100) : 0,
    currentRank: profile?.rank || 'Bronze I',
    highestStreak: 8
  };

  const handleFindMatch = async () => {
    try {
      setLoading(true);
      const response = await battleAPI.createBattle({
        difficulty: battleConfig.difficulty,
        xp_wager: battleConfig.xp_wager,
        mode: selectedMode,
        time_limit: battleConfig.time_limit
      });
      
      toast.success('Battle created! Waiting for opponent...');
      setCurrentBattle(response.match_id);
      
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create battle');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinBattle = async (battleId: string) => {
    try {
      setLoading(true);
      await battleAPI.joinBattle(battleId);
      setCurrentBattle(battleId);
      toast.success('Joined battle!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to join battle');
    } finally {
      setLoading(false);
    }
  };

  const handleExitBattle = () => {
    setCurrentBattle(null);
    loadActiveBattles();
  };

  if (currentBattle) {
    return <BattleRoom matchId={currentBattle} onExit={handleExitBattle} />;
  }

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
            className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-red to-neon-pink flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Swords className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-red to-neon-pink bg-clip-text text-transparent font-game">
              Coding Arena
            </h1>
            <p className="text-gray-400 text-lg font-space">
              Battle other coders and prove your skills
            </p>
          </div>
        </div>
      </motion.div>

      {/* Arena Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-yellow/20 text-center">
          <Trophy className="w-6 h-6 text-neon-yellow mx-auto mb-2" />
          <p className="text-2xl font-bold text-white font-game">{arenaStats.totalBattles}</p>
          <p className="text-sm text-gray-400 font-space">Total Battles</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-green/20 text-center">
          <Target className="w-6 h-6 text-neon-green mx-auto mb-2" />
          <p className="text-2xl font-bold text-white font-game">{arenaStats.wins}</p>
          <p className="text-sm text-gray-400 font-space">Wins</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-cyan/20 text-center">
          <Zap className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
          <p className="text-2xl font-bold text-white font-game">{arenaStats.winRate}%</p>
          <p className="text-sm text-gray-400 font-space">Win Rate</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-purple/20 text-center">
          <Crown className="w-6 h-6 text-neon-purple mx-auto mb-2" />
          <p className="text-2xl font-bold text-white font-game">{arenaStats.currentRank}</p>
          <p className="text-sm text-gray-400 font-space">Current Rank</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-neon-pink/20 text-center">
          <Swords className="w-6 h-6 text-neon-pink mx-auto mb-2" />
          <p className="text-2xl font-bold text-white font-game">{arenaStats.highestStreak}</p>
          <p className="text-sm text-gray-400 font-space">Best Streak</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Battle Modes */}
        <motion.div
          className="lg:col-span-2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-red/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center font-game">
            <Gamepad2 className="w-5 h-5 mr-2 text-neon-red animate-pulse" />
            Battle Modes
          </h2>

          {/* Mode Selector */}
          <div className="flex space-x-2 mb-6">
            {(['quick', 'ranked', 'custom'] as const).map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all font-space ${
                  selectedMode === mode
                    ? 'bg-gradient-to-r from-neon-red to-neon-pink text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode} Battle
              </motion.button>
            ))}
          </div>

          {/* Battle Configuration */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {selectedMode === 'quick' && (
                <motion.div
                  key="quick"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-black/20 rounded-lg border border-neon-blue/20">
                    <h3 className="font-medium mb-2 font-game">Quick Match</h3>
                    <p className="text-sm text-gray-400 mb-4 font-space">
                      Get matched with a player of similar skill level instantly
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-space">Difficulty</label>
                        <select 
                          value={battleConfig.difficulty}
                          onChange={(e) => setBattleConfig({...battleConfig, difficulty: e.target.value})}
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white font-space"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-space">XP Wager</label>
                        <select 
                          value={battleConfig.xp_wager}
                          onChange={(e) => setBattleConfig({...battleConfig, xp_wager: parseInt(e.target.value)})}
                          className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white font-space"
                        >
                          <option value={100}>100 XP</option>
                          <option value={250}>250 XP</option>
                          <option value={500}>500 XP</option>
                        </select>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleFindMatch}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-neon-red to-neon-pink rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-red/25 transition-all flex items-center justify-center disabled:opacity-50 font-space"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Creating Battle...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Find Match
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {selectedMode === 'ranked' && (
                <motion.div
                  key="ranked"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-black/20 rounded-lg border border-neon-purple/20">
                    <h3 className="font-medium mb-2 font-game">Ranked Battle</h3>
                    <p className="text-sm text-gray-400 mb-4 font-space">
                      Compete for rank points and climb the leaderboard
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-space">Current Rank</label>
                        <div className="p-2 bg-dark-800 rounded-lg border border-neon-purple/30">
                          <span className="text-neon-purple font-medium font-space">{arenaStats.currentRank}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2 font-space">Entry Fee</label>
                        <div className="p-2 bg-dark-800 rounded-lg">
                          <span className="text-neon-yellow font-space">50 XP</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleFindMatch}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all flex items-center justify-center disabled:opacity-50 font-space"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Entering Queue...
                        </>
                      ) : (
                        <>
                          <Crown className="w-5 h-5 mr-2" />
                          Enter Ranked Queue
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {selectedMode === 'custom' && (
                <motion.div
                  key="custom"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-black/20 rounded-lg border border-neon-cyan/20">
                    <h3 className="font-medium mb-2 font-game">Custom Battle</h3>
                    <p className="text-sm text-gray-400 mb-4 font-space">
                      Create a custom battle room
                    </p>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2 font-space">Difficulty</label>
                          <select 
                            value={battleConfig.difficulty}
                            onChange={(e) => setBattleConfig({...battleConfig, difficulty: e.target.value})}
                            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white font-space"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2 font-space">Time Limit</label>
                          <select 
                            value={battleConfig.time_limit}
                            onChange={(e) => setBattleConfig({...battleConfig, time_limit: parseInt(e.target.value)})}
                            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white font-space"
                          >
                            <option value={900}>15 minutes</option>
                            <option value={1800}>30 minutes</option>
                            <option value={2700}>45 minutes</option>
                            <option value={3600}>60 minutes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleFindMatch}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-lg font-medium text-white hover:shadow-lg hover:shadow-neon-cyan/25 transition-all flex items-center justify-center disabled:opacity-50 font-space"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Creating Room...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          Create Room
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Active Battles */}
        <motion.div
          className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-cyan/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center font-game">
              <Users className="w-5 h-5 mr-2 text-neon-cyan animate-pulse" />
              Live Battles
            </h2>
            <motion.button
              onClick={loadActiveBattles}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </motion.button>
          </div>

          <div className="space-y-4">
            {activeBattles.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Swords className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-space">No active battles</p>
                <p className="text-sm font-space">Create one to get started!</p>
              </div>
            ) : (
              activeBattles.map((battle) => (
                <motion.div
                  key={battle.id}
                  className="p-4 bg-black/20 rounded-lg border border-dark-600 hover:border-neon-cyan/50 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleJoinBattle(battle.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium font-space">{battle.problem_title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-space ${
                      battle.difficulty === 'easy' ? 'bg-neon-green/20 text-neon-green' :
                      battle.difficulty === 'medium' ? 'bg-neon-yellow/20 text-neon-yellow' :
                      'bg-neon-pink/20 text-neon-pink'
                    }`}>
                      {battle.difficulty}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-2 font-space">
                    Created by {battle.creator?.username || 'Unknown'}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-neon-yellow">
                      <Zap className="w-3 h-3 mr-1" />
                      {battle.xp_wager} XP
                    </div>
                    <div className="flex items-center text-neon-cyan">
                      <Users className="w-3 h-3 mr-1" />
                      {battle.participant_count}/{battle.max_players}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodingArena;