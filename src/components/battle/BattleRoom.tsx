import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer, Users, Code, Send, Trophy, Play, CheckCircle, XCircle } from 'lucide-react';
import { battleAPI } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import toast from 'react-hot-toast';

interface BattleRoomProps {
  matchId: string;
  onExit: () => void;
}

const BattleRoom: React.FC<BattleRoomProps> = ({ matchId, onExit }) => {
  const [match, setMatch] = useState<any>(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(1800);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { joinMatchRoom, sendMatchMessage, sendCodeUpdate, messages } = useWebSocket();
  const codeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadMatchDetails();
    joinMatchRoom(matchId);
  }, [matchId]);

  useEffect(() => {
    // Handle WebSocket messages
    const latestMessage = messages[messages.length - 1];
    if (latestMessage) {
      switch (latestMessage.type) {
        case 'match_started':
          toast.success('Battle started! Code your solution!');
          break;
        case 'chat_message':
          setChatMessages(prev => [...prev, latestMessage]);
          break;
        case 'code_sync':
          if (latestMessage.user_id !== 'current_user') {
            // Show other player's cursor or code changes
            console.log('Other player code update:', latestMessage);
          }
          break;
        case 'match_ended':
          setResults(latestMessage.results);
          toast.success('Battle completed!');
          break;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (match && match.status === 'active') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [match]);

  const loadMatchDetails = async () => {
    try {
      // In a real implementation, you'd have an endpoint to get match details
      // For now, we'll simulate the match data
      setMatch({
        id: matchId,
        problem_title: "Two Sum Problem",
        problem_description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
        difficulty: "Easy",
        xp_wager: 250,
        status: 'active',
        starter_code: `def two_sum(nums, target):
    # Your code here
    pass

# Test your solution
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(result)  # Should output [0, 1]`
      });

      setCode(`def two_sum(nums, target):
    # Your code here
    pass

# Test your solution
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(result)  # Should output [0, 1]`);

      setParticipants([
        { id: '1', username: 'You', score: 0, submitted: false },
        { id: '2', username: 'CodeNinja', score: 0, submitted: false }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load match details:', error);
      toast.error('Failed to load battle details');
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim() || submitted) return;

    try {
      setSubmitted(true);
      const result = await battleAPI.submitCode(matchId, code);
      
      setResults(result);
      
      // Update participant status
      setParticipants(prev => prev.map(p => 
        p.username === 'You' ? { ...p, submitted: true, score: result.score } : p
      ));

      if (result.score > 0) {
        toast.success(`Great job! Score: ${result.score}`);
      } else {
        toast.error('Some tests failed. Keep practicing!');
      }
    } catch (error) {
      console.error('Failed to submit code:', error);
      toast.error('Failed to submit code');
      setSubmitted(false);
    }
  };

  const handleTimeUp = () => {
    if (!submitted) {
      handleSubmitCode();
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    sendMatchMessage(matchId, chatMessage);
    setChatMessage('');
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Send code updates to other participants (throttled)
    sendCodeUpdate(matchId, newCode, codeRef.current?.selectionStart);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (results) {
    return (
      <motion.div
        className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-neon-green/20 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Trophy className="w-16 h-16 mx-auto mb-4 text-neon-yellow" />
        <h2 className="text-2xl font-bold mb-4 font-game">Battle Complete!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-neon-cyan">{results.score}</div>
            <div className="text-sm text-gray-400">Your Score</div>
          </div>
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-neon-green">{results.passed}</div>
            <div className="text-sm text-gray-400">Tests Passed</div>
          </div>
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-neon-purple">{results.total}</div>
            <div className="text-sm text-gray-400">Total Tests</div>
          </div>
        </div>

        {results.error && (
          <div className="mb-4 p-4 bg-neon-red/10 border border-neon-red/30 rounded-lg">
            <p className="text-neon-red text-sm">{results.error}</p>
          </div>
        )}

        <motion.button
          onClick={onExit}
          className="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg font-bold text-white hover:shadow-lg hover:shadow-neon-blue/25 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Return to Arena
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen max-h-screen">
      {/* Problem Description */}
      <div className="lg:col-span-1 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-blue/20 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-neon-blue font-game">{match.problem_title}</h2>
        <div className="space-y-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
            match.difficulty === 'Easy' ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' :
            match.difficulty === 'Medium' ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30' :
            'bg-neon-red/20 text-neon-red border border-neon-red/30'
          } font-space`}>
            {match.difficulty}
          </div>
          
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-black/20 p-4 rounded-lg font-space">
            {match.problem_description}
          </pre>

          {/* Participants */}
          <div>
            <h3 className="font-medium mb-2 flex items-center font-space">
              <Users className="w-4 h-4 mr-2" />
              Participants
            </h3>
            <div className="space-y-2">
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
                  <span className="text-sm font-space">{participant.username}</span>
                  <div className="flex items-center space-x-2">
                    {participant.submitted ? (
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-xs text-gray-400 font-space">{participant.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="lg:col-span-2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-green/20 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neon-green font-game">Code Editor</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-neon-yellow" />
              <span className={`font-bold font-space ${timeLeft <= 300 ? 'text-neon-red animate-pulse' : 'text-neon-yellow'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-neon-purple" />
              <span className="text-neon-purple font-bold font-space">{match.xp_wager} XP</span>
            </div>
          </div>
        </div>

        <textarea
          ref={codeRef}
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="// Write your solution here..."
          className="flex-1 bg-black/20 border border-dark-600 rounded-lg p-4 text-white font-mono text-sm resize-none focus:border-neon-green focus:outline-none"
          disabled={submitted}
        />

        <div className="mt-4 flex space-x-4">
          <motion.button
            onClick={handleSubmitCode}
            disabled={submitted || !code.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-neon-green to-neon-cyan rounded-lg font-bold text-white hover:shadow-lg hover:shadow-neon-green/25 transition-all disabled:opacity-50 font-space"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitted ? 'Code Submitted!' : 'Submit Solution'}
          </motion.button>
          <motion.button
            onClick={onExit}
            className="px-6 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg font-medium text-white transition-all font-space"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Exit Battle
          </motion.button>
        </div>
      </div>

      {/* Chat */}
      <div className="lg:col-span-1 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-neon-purple/20 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-neon-purple font-game">Battle Chat</h2>
        
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {chatMessages.map((msg, index) => (
            <div key={index} className="p-2 bg-black/20 rounded text-sm">
              <span className="font-medium text-neon-cyan font-space">{msg.user_id}:</span>
              <span className="ml-2 text-gray-300 font-space">{msg.message}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-black/20 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-purple focus:outline-none font-space"
          />
          <motion.button
            onClick={handleSendMessage}
            className="p-2 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg text-white hover:shadow-lg hover:shadow-neon-purple/25 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BattleRoom;