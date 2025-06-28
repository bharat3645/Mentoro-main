# AI Companion Quest 🚀

A gamified coding learning platform that transforms programming education into an epic space adventure. Master coding skills through quests, battles, and AI-powered mentorship in a beautifully designed cyberpunk universe.

![AI Companion Quest](https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🎮 Core Gaming Experience
- **Skill Nexus**: Interactive skill tree with constellation view for learning paths
- **Coding Arena**: Real-time coding battles with other players
- **Project Forge**: AI-powered DIY project generator
- **Card Nexus**: Collectible flashcard system with battle mechanics
- **Code Architect**: GitHub-like contribution and review system

### 🤖 AI-Powered Learning
- **AI Companion**: Multiple personality-driven coding mentors
- **Adaptive Learning**: Personalized quest recommendations
- **Intelligent Feedback**: Context-aware code review and suggestions
- **Mood Analytics**: Emotion tracking for optimized learning

### 🎨 Premium Design
- **Cyberpunk Aesthetic**: Neon-themed dark UI with smooth animations
- **Theme Engine**: Unlockable themes and customization options
- **Responsive Design**: Seamless experience across all devices
- **Micro-interactions**: Polished hover states and transitions

### 📊 Progress Tracking
- **XP System**: Comprehensive experience point mechanics
- **Leaderboards**: Global and friend rankings
- **Achievement System**: Unlockable badges and rewards
- **Streak Tracking**: Daily coding habit building

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **React Router** for navigation
- **Recharts** for data visualization

### Backend
- **FastAPI** (Python) for high-performance API
- **Supabase** for database and authentication
- **WebSockets** for real-time features
- **OpenAI API** for AI-powered features (optional)

### Database
- **PostgreSQL** via Supabase
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Supabase account (free tier available)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-companion-quest
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run backend:install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# Get these from your Supabase project dashboard
```

Required environment variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_api_key (optional)
```

### 4. Database Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration files in the Supabase SQL editor:
   - Copy content from `supabase/migrations/20250628083213_lucky_water.sql`
   - Copy content from `supabase/migrations/20250628083306_weathered_snow.sql`
3. Enable Row Level Security in your Supabase dashboard

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run start

# Or start them separately:
npm run dev          # Frontend only
npm run backend      # Backend only
```

### 6. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
ai-companion-quest/
├── src/                          # Frontend source code
│   ├── components/              # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   ├── battle/             # Battle system components
│   │   ├── layout/             # Layout components (Navbar, Sidebar)
│   │   └── ui/                 # Generic UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   ├── pages/                  # Page components
│   ├── services/               # API service layer
│   └── store/                  # State management
├── backend/                     # Python FastAPI backend
│   ├── main.py                 # Main application file
│   └── requirements.txt        # Python dependencies
├── supabase/                   # Database migrations
│   └── migrations/             # SQL migration files
├── public/                     # Static assets
└── docs/                       # Documentation
```

## 🎯 Key Features Explained

### Skill Nexus (Learning System)
- **Constellation View**: Interactive skill map with connected learning paths
- **Progressive Unlocking**: Skills unlock based on prerequisites and XP investment
- **Multiple Categories**: Frontend, Backend, Algorithms, AI/ML, DevOps, Security
- **Visual Progress**: Animated progress rings and mastery indicators

### Coding Arena (Battle System)
- **Real-time Battles**: Live coding competitions with WebSocket communication
- **Multiple Modes**: Quick match, ranked battles, custom rooms
- **Code Evaluation**: Automated test case execution and scoring
- **Live Chat**: In-battle communication system

### AI Companion System
- **Multiple Personalities**: Ada (encouraging), Syntax (direct), Debug (humorous), Sage (analytical), Coach (supportive)
- **Context-Aware Responses**: AI adapts to user level, mood, and current challenges
- **Learning Analytics**: Tracks user patterns and provides personalized insights

### Project Forge (DIY Generator)
- **AI-Powered Generation**: Creates custom coding projects based on user preferences
- **Technology Integration**: Supports multiple frameworks and languages
- **Difficulty Scaling**: Adjusts complexity based on user skill level
- **Structured Learning**: Provides clear objectives and challenges

## 🔧 Development Guide

### Adding New Features
1. **Frontend Components**: Create in appropriate `src/components/` subdirectory
2. **API Endpoints**: Add to `backend/main.py` with proper authentication
3. **Database Changes**: Create new migration files in `supabase/migrations/`
4. **State Management**: Update Zustand store in `src/store/gameStore.ts`

### Code Style Guidelines
- Use TypeScript for type safety
- Follow React functional component patterns
- Implement responsive design with Tailwind CSS
- Add proper error handling and loading states
- Include accessibility features (ARIA labels, keyboard navigation)

### Testing
```bash
# Run frontend tests
npm run test

# Run backend tests
cd backend && python -m pytest

# Type checking
npm run type-check
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
# Build for production
npm run build

# Deploy to Netlify
npm run deploy
```

### Backend Deployment (Railway/Heroku)
```bash
# Set environment variables in your hosting platform
# Deploy using your platform's CLI or Git integration
```

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_API_URL=your_production_api_url
OPENAI_API_KEY=your_openai_api_key
```

## 🎮 Game Mechanics

### XP System
- **Quest Completion**: 500-1000 XP based on difficulty
- **Battle Victories**: 100-500 XP based on wager
- **Daily Goals**: 50-200 XP for consistency
- **Flashcard Mastery**: 25-150 XP per card
- **Code Reviews**: 50 XP per helpful review

### Level Progression
- **Level Formula**: Level = (Total XP ÷ 1000) + 1
- **Rank System**: Bronze → Silver → Gold → Platinum → Diamond
- **Unlockables**: Themes, avatars, and features unlock with progression

### Streak System
- **Daily Activity**: Maintains streak counter
- **Streak Bonuses**: Multiplier effects for consistent learning
- **Recovery Grace**: 24-hour window to maintain streaks

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Contribution Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility
- Test across different browsers

## 📝 API Documentation

The backend API is fully documented with OpenAPI/Swagger. Access the interactive documentation at:
- **Local**: http://localhost:8000/docs
- **Production**: Your deployed API URL + `/docs`

### Key Endpoints
- `GET /api/profile` - User profile data
- `POST /api/xp/add` - Add experience points
- `GET /api/battles/active` - Active coding battles
- `POST /api/buddy/chat` - AI companion chat
- `GET /api/leaderboard` - Global rankings

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Secure cross-origin requests

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Failed**
```bash
# Check if backend is running
curl http://localhost:8000/health

# Restart backend
npm run backend
```

**Supabase Connection Issues**
- Verify environment variables in `.env`
- Check Supabase project status
- Ensure RLS policies are properly configured

**Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run build --clean
```

**WebSocket Connection Failed**
- Ensure backend WebSocket endpoint is accessible
- Check firewall settings for port 8000
- Verify WebSocket URL in frontend configuration

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy loading for route components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching Strategy**: Service worker implementation

### Backend Optimizations
- **Database Indexing**: Optimized queries for leaderboards
- **Connection Pooling**: Efficient database connections
- **Caching Layer**: Redis for frequently accessed data
- **Rate Limiting**: Prevents API abuse

## 🌟 Roadmap

### Phase 1 (Current)
- ✅ Core gaming mechanics
- ✅ AI companion system
- ✅ Real-time battles
- ✅ Skill progression

### Phase 2 (Next)
- 🔄 Mobile app development
- 🔄 Advanced AI features
- 🔄 Team collaboration tools
- 🔄 Marketplace for user-generated content

### Phase 3 (Future)
- 📋 VR/AR integration
- 📋 Blockchain achievements
- 📋 Corporate training modules
- 📋 Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Cyberpunk 2077, Tron Legacy
- **Educational Framework**: Khan Academy, Codecademy
- **Gaming Mechanics**: Duolingo, Habitica
- **UI Components**: Tailwind UI, Headless UI
- **Icons**: Lucide React
- **Fonts**: Orbitron, Inter

## 📞 Support

- **Documentation**: [GitHub Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@aicompanionquest.com

---

**Ready to embark on your coding quest? The galaxy awaits! 🚀✨**

*Built with ❤️ by the AI Companion Quest team*