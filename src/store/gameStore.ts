import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastLoginDate: string;
  achievements: Achievement[];
  unlockedThemes: string[];
  currentTheme: string;
  mood: 'excited' | 'focused' | 'tired' | 'confused' | 'motivated';
  skillPoints: Record<string, number>;
  rank: string;
  totalBattles: number;
  battlesWon: number;
  questsCompleted: number;
  cardsCollected: number;
  contributionsAccepted: number;
  streak_days: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  xpReward: number;
  category: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  xpReward: number;
  estimatedTime: number;
  prerequisites: string[];
  skills: string[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
  type: 'coding' | 'theory' | 'project' | 'challenge';
  category: string;
  objectives: string[];
  hints: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'battle' | 'quest' | 'social';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  personality: string;
  mood?: string;
}

export interface AIPersonality {
  id: string;
  name: string;
  avatar: string;
  description: string;
  responseStyle: 'encouraging' | 'direct' | 'humorous' | 'analytical' | 'supportive';
  traits: string[];
}

interface GameStore {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  
  // XP & Progression
  totalXP: number;
  currentStreak: number;
  dailyGoals: any[];
  
  // Quests & Learning
  availableQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  
  // UI State
  currentTheme: string;
  sidebarCollapsed: boolean;
  notifications: Notification[];
  
  // AI Chat State
  chatHistory: ChatMessage[];
  currentAIPersonality: AIPersonality;
  availablePersonalities: AIPersonality[];
  
  // Engagement Metrics
  engagementMetrics: any;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // XP & Progression Actions
  addXP: (amount: number, source: string) => void;
  updateStreak: () => void;
  completeGoal: (goalId: string) => void;
  levelUp: () => void;
  
  // Quest Actions
  startQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  unlockQuest: (questId: string) => void;
  
  // UI Actions
  toggleSidebar: () => void;
  changeTheme: (theme: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // AI Chat Actions
  addChatMessage: (message: ChatMessage) => void;
  switchPersonality: (personalityId: string) => void;
  clearChatHistory: () => void;
  
  // Initialization
  initializeUser: () => void;
  loadGameData: () => void;
}

// Mock data generators
const generateMockQuests = (): Quest[] => [
  {
    id: 'quest-1',
    title: 'JavaScript Fundamentals',
    description: 'Master the basics of JavaScript programming including variables, functions, and control structures.',
    difficulty: 'beginner',
    xpReward: 500,
    estimatedTime: 120,
    prerequisites: [],
    skills: ['JavaScript', 'Programming Basics', 'Syntax'],
    status: 'available',
    progress: 0,
    type: 'theory',
    category: 'Frontend',
    objectives: [
      'Understand variable declarations',
      'Learn function syntax',
      'Master conditional statements',
      'Practice loops and iterations'
    ],
    hints: [
      'Start with let and const declarations',
      'Functions can be declared or expressed',
      'Use console.log() to debug your code'
    ]
  },
  {
    id: 'quest-2',
    title: 'React Component Mastery',
    description: 'Build dynamic user interfaces with React components, hooks, and state management.',
    difficulty: 'intermediate',
    xpReward: 750,
    estimatedTime: 180,
    prerequisites: ['quest-1'],
    skills: ['React', 'JSX', 'Hooks', 'State Management'],
    status: 'locked',
    progress: 0,
    type: 'coding',
    category: 'Frontend',
    objectives: [
      'Create functional components',
      'Implement useState and useEffect',
      'Handle events and forms',
      'Manage component lifecycle'
    ],
    hints: [
      'Components should be pure functions',
      'Use hooks for state and side effects',
      'Props flow down, events flow up'
    ]
  },
  {
    id: 'quest-3',
    title: 'API Integration Challenge',
    description: 'Connect your frontend to real-world APIs and handle asynchronous data.',
    difficulty: 'advanced',
    xpReward: 1000,
    estimatedTime: 240,
    prerequisites: ['quest-2'],
    skills: ['APIs', 'Async/Await', 'Error Handling', 'HTTP'],
    status: 'locked',
    progress: 0,
    type: 'project',
    category: 'Full-Stack',
    objectives: [
      'Fetch data from REST APIs',
      'Handle loading and error states',
      'Implement proper error boundaries',
      'Cache and optimize API calls'
    ],
    hints: [
      'Always handle loading states',
      'Use try-catch for error handling',
      'Consider using React Query for caching'
    ]
  }
];

// Create demo user
const createDemoUser = (): User => ({
  id: 'demo-user-123',
  username: 'Demo User',
  email: 'demo@aiquest.com',
  avatar: '🚀',
  level: 5,
  xp: 2450,
  xpToNextLevel: 550,
  streak: 7,
  streak_days: 7,
  lastLoginDate: new Date().toDateString(),
  achievements: [
    {
      id: 'first-quest',
      title: 'First Steps',
      description: 'Completed your first quest',
      icon: '🎯',
      rarity: 'common',
      unlockedAt: new Date().toISOString(),
      xpReward: 100,
      category: 'Progress'
    }
  ],
  unlockedThemes: ['dark', 'cyberpunk'],
  currentTheme: 'dark',
  mood: 'excited',
  skillPoints: {
    javascript: 85,
    react: 70,
    algorithms: 60,
    databases: 45
  },
  rank: 'Silver II',
  totalBattles: 15,
  battlesWon: 12,
  questsCompleted: 23,
  cardsCollected: 45,
  contributionsAccepted: 8
});

// Create AI personalities
const createAIPersonalities = (): AIPersonality[] => [
  {
    id: 'encouraging',
    name: 'Alex the Motivator',
    avatar: '🌟',
    description: 'Your cheerful coding companion who celebrates every victory',
    responseStyle: 'encouraging',
    traits: ['Positive', 'Supportive', 'Energetic', 'Patient']
  },
  {
    id: 'direct',
    name: 'Code Master Pro',
    avatar: '🤖',
    description: 'Straight to the point with efficient solutions',
    responseStyle: 'direct',
    traits: ['Efficient', 'Logical', 'Precise', 'Technical']
  },
  {
    id: 'humorous',
    name: 'Debug Duck',
    avatar: '🦆',
    description: 'Makes coding fun with jokes and witty explanations',
    responseStyle: 'humorous',
    traits: ['Funny', 'Creative', 'Relaxed', 'Entertaining']
  },
  {
    id: 'analytical',
    name: 'Data Sage',
    avatar: '🧠',
    description: 'Deep analytical insights and systematic problem solving',
    responseStyle: 'analytical',
    traits: ['Thorough', 'Methodical', 'Insightful', 'Strategic']
  },
  {
    id: 'supportive',
    name: 'Mentor Maya',
    avatar: '💝',
    description: 'Gentle guidance through challenging concepts',
    responseStyle: 'supportive',
    traits: ['Empathetic', 'Understanding', 'Nurturing', 'Wise']
  }
];

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      totalXP: 2450,
      currentStreak: 7,
      dailyGoals: [],
      availableQuests: generateMockQuests(),
      activeQuests: [
        {
          ...generateMockQuests()[0],
          status: 'in_progress',
          progress: 65
        }
      ],
      completedQuests: [],
      currentTheme: 'dark',
      sidebarCollapsed: false,
      notifications: [
        {
          id: 'notif-1',
          title: 'Welcome to AI Quest!',
          message: 'Start your coding journey by completing your first quest.',
          type: 'info',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          icon: '🚀'
        },
        {
          id: 'notif-2',
          title: 'Daily Streak Active!',
          message: 'You\'re on a 7-day coding streak. Keep it up!',
          type: 'success',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          priority: 'low',
          icon: '🔥'
        },
        {
          id: 'notif-3',
          title: 'New Battle Available',
          message: 'A new coding challenge is waiting in the arena.',
          type: 'info',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
          priority: 'medium',
          icon: '⚔️'
        }
      ],
      
      // AI Chat State
      chatHistory: [],
      availablePersonalities: createAIPersonalities(),
      currentAIPersonality: createAIPersonalities()[0],
      
      engagementMetrics: {
        sessionTime: 145,
        questsCompleted: 23,
        battlesWon: 32,
        streakDays: 12,
        averageMood: 8.1,
        productivityScore: 87,
        focusTime: 120,
        codeLines: 2847,
        problemsSolved: 156,
        helpRequests: 12
      },

      // Actions
      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        activeQuests: [],
        notifications: [],
        chatHistory: []
      }),
      
      updateUserProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      addXP: (amount, source) => set((state) => {
        const newXP = state.totalXP + amount;
        const user = state.user;
        if (!user) return state;
        
        const newLevel = Math.floor(newXP / 1000) + 1;
        const leveledUp = newLevel > user.level;
        
        return {
          totalXP: newXP,
          user: {
            ...user,
            xp: user.xp + amount,
            level: newLevel,
            xpToNextLevel: 1000 - (newXP % 1000)
          },
          notifications: leveledUp ? [
            ...state.notifications,
            {
              id: Date.now().toString(),
              title: 'Level Up!',
              message: `Congratulations! You've reached level ${newLevel}!`,
              type: 'success',
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'high',
              icon: '🎉'
            }
          ] : state.notifications
        };
      }),
      
      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const lastLogin = state.user?.lastLoginDate;
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        let newStreak = state.currentStreak;
        
        if (lastLogin === yesterday) {
          newStreak += 1;
        } else if (lastLogin !== today) {
          newStreak = 1;
        }
        
        return {
          currentStreak: newStreak,
          user: state.user ? {
            ...state.user,
            streak: newStreak,
            streak_days: newStreak,
            lastLoginDate: today
          } : null
        };
      }),
      
      completeGoal: (goalId) => set((state) => {
        const goal = state.dailyGoals.find(g => g.id === goalId);
        if (!goal || goal.completed) return state;
        
        return {
          dailyGoals: state.dailyGoals.map(g =>
            g.id === goalId ? { ...g, completed: true, current: g.target } : g
          ),
          totalXP: state.totalXP + goal.xpReward,
          user: state.user ? {
            ...state.user,
            xp: state.user.xp + goal.xpReward
          } : null,
          notifications: [
            ...state.notifications,
            {
              id: Date.now().toString(),
              title: 'Goal Completed!',
              message: `You completed "${goal.title}" and earned ${goal.xpReward} XP!`,
              type: 'success',
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'medium',
              icon: goal.icon
            }
          ]
        };
      }),
      
      levelUp: () => set((state) => {
        if (!state.user) return state;
        
        const newLevel = state.user.level + 1;
        return {
          user: {
            ...state.user,
            level: newLevel,
            xpToNextLevel: 1000
          }
        };
      }),
      
      startQuest: (questId) => set((state) => {
        const quest = state.availableQuests.find(q => q.id === questId);
        if (!quest) return state;
        
        return {
          availableQuests: state.availableQuests.filter(q => q.id !== questId),
          activeQuests: [...state.activeQuests, { ...quest, status: 'in_progress', progress: 0 }]
        };
      }),
      
      updateQuestProgress: (questId, progress) => set((state) => ({
        activeQuests: state.activeQuests.map(quest =>
          quest.id === questId ? { ...quest, progress } : quest
        )
      })),
      
      completeQuest: (questId) => set((state) => {
        const quest = state.activeQuests.find(q => q.id === questId);
        if (!quest) return state;
        
        const completedQuest = { ...quest, status: 'completed' as const, progress: 100 };
        
        return {
          activeQuests: state.activeQuests.filter(q => q.id !== questId),
          completedQuests: [...state.completedQuests, completedQuest],
          totalXP: state.totalXP + quest.xpReward,
          user: state.user ? {
            ...state.user,
            xp: state.user.xp + quest.xpReward,
            questsCompleted: state.user.questsCompleted + 1
          } : null
        };
      }),
      
      unlockQuest: (questId) => set((state) => ({
        availableQuests: state.availableQuests.map(quest =>
          quest.id === questId ? { ...quest, status: 'available' } : quest
        )
      })),
      
      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),
      
      changeTheme: (theme) => set({ currentTheme: theme }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
          },
          ...state.notifications
        ]
      })),
      
      markNotificationRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      // AI Chat Actions
      addChatMessage: (message) => set((state) => ({
        chatHistory: [...state.chatHistory, message]
      })),
      
      switchPersonality: (personalityId) => set((state) => {
        const personality = state.availablePersonalities.find(p => p.id === personalityId);
        if (!personality) return state;
        
        return {
          currentAIPersonality: personality
        };
      }),
      
      clearChatHistory: () => set({ chatHistory: [] }),
      
      initializeUser: () => set((state) => {
        // Initialize demo user if none exists
        if (!state.user) {
          return {
            ...state,
            user: createDemoUser(),
            isAuthenticated: true
          };
        }
        return state;
      }),
      
      loadGameData: () => set((state) => {
        // Load additional game data
        return {
          ...state,
          availableQuests: generateMockQuests()
        };
      })
    }),
    {
      name: 'ai-companion-quest-store',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        sidebarCollapsed: state.sidebarCollapsed,
        notifications: state.notifications.slice(-10), // Keep only last 10 notifications
        currentStreak: state.currentStreak,
        completedQuests: state.completedQuests,
        engagementMetrics: state.engagementMetrics,
        user: state.user,
        chatHistory: state.chatHistory.slice(-50), // Keep only last 50 messages
        currentAIPersonality: state.currentAIPersonality
      })
    }
  )
);