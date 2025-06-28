import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Reduced timeout for faster fallback
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.warn('Failed to get auth session:', error);
  }
  return config;
});

// Handle auth errors but let network errors pass through to be handled by fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only handle auth errors here, let network errors be handled by fallback
    if (error.response?.status === 401) {
      console.warn('Authentication failed, signing out user');
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fallback functions for when backend is not available
const fallbackResponses = {
  profile: {
    id: 'demo-user',
    username: 'Demo User',
    avatar: '🚀',
    level: 1,
    xp: 0,
    total_xp: 0,
    streak_days: 0,
    rank: 'Bronze I',
    total_battles: 0,
    battles_won: 0,
    quests_completed: 0,
    cards_collected: 0,
    contributions_accepted: 0,
    current_theme: 'dark',
    unlocked_themes: ['dark'],
    mood: 'excited'
  },
  xpLogs: { logs: [] },
  dailyGoals: { goals: [] },
  leaderboard: { leaderboard: [] },
  moodHistory: { history: [] },
  activeBattles: { battles: [] },
  diyTasks: { tasks: [] },
  flashcards: { cards: [] },
  submissions: { submissions: [] },
  chatHistory: { messages: [] }
};

// Helper function to make API calls with fallback
const apiCallWithFallback = async (apiCall: () => Promise<any>, fallbackData: any) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: any) {
    // Check for network connection errors
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' || 
        error.code === 'ENOTFOUND' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('timeout') ||
        !error.response) {
      console.warn('Backend server not available, using fallback data');
      return fallbackData;
    }
    throw error;
  }
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    return apiCallWithFallback(
      () => api.get('/api/profile'),
      fallbackResponses.profile
    );
  },

  createProfile: async (profileData: { username: string; avatar: string }) => {
    return apiCallWithFallback(
      () => api.post('/api/profile', profileData),
      { ...fallbackResponses.profile, ...profileData }
    );
  },

  updateProfile: async (profileData: { username: string; avatar: string }) => {
    return apiCallWithFallback(
      () => api.put('/api/profile', profileData),
      { ...fallbackResponses.profile, ...profileData }
    );
  },
};

// XP API
export const xpAPI = {
  addXP: async (amount: number, source: string, description?: string) => {
    return apiCallWithFallback(
      () => api.post('/api/xp/add', { amount, source, description }),
      { xp: amount, total_xp: amount, level: 1 }
    );
  },

  getXPLogs: async () => {
    return apiCallWithFallback(
      () => api.get('/api/xp/logs'),
      fallbackResponses.xpLogs
    );
  },
};

// Mood API
export const moodAPI = {
  logMood: async (moodData: {
    mood: string;
    intensity: number;
    context?: string;
    triggers: string[];
    activities: string[];
    productivity_score: number;
    engagement_score: number;
    session_duration: number;
  }) => {
    return apiCallWithFallback(
      () => api.post('/api/mood/log', moodData),
      { id: 'demo-mood', ...moodData, created_at: new Date().toISOString() }
    );
  },

  getMoodHistory: async () => {
    return apiCallWithFallback(
      () => api.get('/api/mood/history'),
      fallbackResponses.moodHistory
    );
  },
};

// Battle API
export const battleAPI = {
  createBattle: async (battleData: {
    problem_title?: string;
    difficulty: string;
    xp_wager: number;
    mode: string;
    time_limit?: number;
  }) => {
    return apiCallWithFallback(
      () => api.post('/api/battles/create', battleData),
      { match_id: 'demo-battle', status: 'created' }
    );
  },

  getActiveBattles: async () => {
    return apiCallWithFallback(
      () => api.get('/api/battles/active'),
      fallbackResponses.activeBattles
    );
  },

  joinBattle: async (matchId: string) => {
    return apiCallWithFallback(
      () => api.post(`/api/battles/${matchId}/join`),
      { status: 'joined' }
    );
  },

  submitCode: async (matchId: string, code: string) => {
    return apiCallWithFallback(
      () => api.post(`/api/battles/${matchId}/submit`, { code }),
      { score: 100, passed: 1, total: 1 }
    );
  },
};

// DIY API
export const diyAPI = {
  generateTask: async (taskData: {
    topic: string;
    level: string;
    technologies: string[];
    project_type: string;
  }) => {
    return apiCallWithFallback(
      () => api.post('/api/diy/generate', taskData),
      {
        id: 'demo-task',
        title: `${taskData.topic} Practice Project`,
        description: `Build a ${taskData.project_type} focused on ${taskData.topic}`,
        difficulty: taskData.level,
        technologies: taskData.technologies,
        xp_reward: 500,
        features: ['Core functionality', 'User interface', 'Error handling'],
        challenges: ['Master concepts', 'Responsive design', 'Performance'],
        files: [{ name: 'src/App.tsx', type: 'component', lines: 100 }],
        status: 'generated'
      }
    );
  },

  getTasks: async () => {
    return apiCallWithFallback(
      () => api.get('/api/diy/tasks'),
      fallbackResponses.diyTasks
    );
  },

  completeTask: async (taskId: string) => {
    return apiCallWithFallback(
      () => api.post(`/api/diy/tasks/${taskId}/complete`),
      { status: 'completed', xp_earned: 500 }
    );
  },
};

// AI Buddy API
export const buddyAPI = {
  chat: async (content: string, personality: string = 'ada') => {
    return apiCallWithFallback(
      () => api.post('/api/buddy/chat', { content, personality }),
      {
        response: "I'm here to help! Unfortunately, I'm running in demo mode right now. Please start the backend server to enable full AI functionality."
      }
    );
  },

  getChatHistory: async () => {
    return apiCallWithFallback(
      () => api.get('/api/buddy/history'),
      fallbackResponses.chatHistory
    );
  },
};

// Flashcard API
export const flashcardAPI = {
  getFlashcards: async (category?: string, difficulty?: string) => {
    return apiCallWithFallback(
      () => api.get('/api/flashcards', { params: { category, difficulty } }),
      fallbackResponses.flashcards
    );
  },

  playFlashcard: async (cardId: string, correct: boolean, responseTime: number) => {
    return apiCallWithFallback(
      () => api.post(`/api/flashcards/${cardId}/play`, { correct, response_time: responseTime }),
      { xp_earned: correct ? 25 : 0, correct }
    );
  },
};

// Submission API (Architect Mode)
export const submissionAPI = {
  createSubmission: async (submissionData: {
    title: string;
    description: string;
    type: string;
    code_url: string;
    live_url?: string;
    tags: string[];
  }) => {
    return apiCallWithFallback(
      () => api.post('/api/submissions/create', submissionData),
      { id: 'demo-submission', ...submissionData, status: 'pending' }
    );
  },

  getSubmissions: async (status?: string) => {
    return apiCallWithFallback(
      () => api.get('/api/submissions', { params: { status } }),
      fallbackResponses.submissions
    );
  },

  createReview: async (submissionId: string, reviewData: {
    rating: number;
    comment: string;
    code_quality: number;
    functionality: number;
    design: number;
    innovation: number;
  }) => {
    return apiCallWithFallback(
      () => api.post(`/api/submissions/${submissionId}/review`, reviewData),
      { id: 'demo-review', ...reviewData, submission_id: submissionId }
    );
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async () => {
    return apiCallWithFallback(
      () => api.get('/api/leaderboard'),
      fallbackResponses.leaderboard
    );
  },
};

// Goals API
export const goalsAPI = {
  getDailyGoals: async () => {
    return apiCallWithFallback(
      () => api.get('/api/goals/daily'),
      fallbackResponses.dailyGoals
    );
  },

  completeGoal: async (goalId: string) => {
    return apiCallWithFallback(
      () => api.post(`/api/goals/${goalId}/complete`),
      { status: 'completed', xp_earned: 100 }
    );
  },
};

export default api;