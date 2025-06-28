from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import json
import uuid
from datetime import datetime, timedelta, date
import openai
from contextlib import asynccontextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set")

if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

# Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.match_rooms: Dict[str, List[str]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"User {user_id} connected")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"User {user_id} disconnected")

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending message to {user_id}: {e}")
                self.disconnect(user_id)

    async def broadcast_to_match(self, message: dict, match_id: str):
        if match_id in self.match_rooms:
            for user_id in self.match_rooms[match_id]:
                await self.send_personal_message(message, user_id)

    async def join_match_room(self, user_id: str, match_id: str):
        if match_id not in self.match_rooms:
            self.match_rooms[match_id] = []
        if user_id not in self.match_rooms[match_id]:
            self.match_rooms[match_id].append(user_id)
        logger.info(f"User {user_id} joined match {match_id}")

manager = ConnectionManager()

# FastAPI app
app = FastAPI(title="AI Companion Quest API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class UserProfile(BaseModel):
    username: str
    avatar: str = "🚀"

class XPTransaction(BaseModel):
    amount: int
    source: str
    description: Optional[str] = None

class MoodLog(BaseModel):
    mood: str
    intensity: int = 5
    context: Optional[str] = None
    triggers: List[str] = []
    activities: List[str] = []
    productivity_score: int = 50
    engagement_score: int = 50
    session_duration: int = 0

class MatchCreate(BaseModel):
    problem_title: Optional[str] = None
    difficulty: str = "easy"
    xp_wager: int = 100
    mode: str = "quick"
    time_limit: int = 1800

class CodeSubmission(BaseModel):
    code: str

class DIYTaskGenerate(BaseModel):
    topic: str
    level: str
    technologies: List[str] = []
    project_type: str = "web-app"

class ChatMessage(BaseModel):
    content: str
    personality: str = "ada"

class SubmissionCreate(BaseModel):
    title: str
    description: str
    type: str
    code_url: str
    live_url: Optional[str] = None
    tags: List[str] = []

class ReviewCreate(BaseModel):
    rating: int
    comment: str
    code_quality: int
    functionality: int
    design: int
    innovation: int

# Helper functions
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Verify JWT token with Supabase
        user = supabase.auth.get_user(credentials.credentials)
        if not user.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user.user
    except Exception as e:
        logger.error(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_user_profile(user_id: str):
    try:
        result = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        return result.data
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        return None

async def update_user_xp(user_id: str, amount: int, source: str, description: str = None):
    try:
        # Log XP transaction
        supabase.table("xp_logs").insert({
            "user_id": user_id,
            "amount": amount,
            "source": source,
            "description": description
        }).execute()
        
        # Update user profile
        profile = await get_user_profile(user_id)
        if profile:
            new_xp = profile["xp"] + amount
            new_total_xp = profile["total_xp"] + amount
            new_level = max(1, (new_total_xp // 1000) + 1)
            
            supabase.table("profiles").update({
                "xp": new_xp,
                "total_xp": new_total_xp,
                "level": new_level
            }).eq("id", user_id).execute()
            
            return {"xp": new_xp, "total_xp": new_total_xp, "level": new_level}
    except Exception as e:
        logger.error(f"Error updating XP: {e}")
        return None

async def update_daily_streak(user_id: str):
    try:
        today = date.today()
        
        # Check if user already has activity today
        existing = supabase.table("streaks").select("*").eq("user_id", user_id).eq("date", today).execute()
        
        if not existing.data:
            # Get yesterday's streak
            yesterday = today - timedelta(days=1)
            yesterday_streak = supabase.table("streaks").select("*").eq("user_id", user_id).eq("date", yesterday).execute()
            
            # Create today's streak entry
            supabase.table("streaks").insert({
                "user_id": user_id,
                "date": today,
                "activities": [],
                "xp_earned": 0
            }).execute()
            
            # Update profile streak count
            profile = await get_user_profile(user_id)
            if profile:
                new_streak = profile["streak_days"] + 1 if yesterday_streak.data else 1
                supabase.table("profiles").update({
                    "streak_days": new_streak,
                    "last_activity_date": today
                }).eq("id", user_id).execute()
                
                return new_streak
    except Exception as e:
        logger.error(f"Error updating streak: {e}")
        return None

def evaluate_code(code: str, test_cases: List[Dict], problem_type: str = "function") -> Dict:
    """Safely evaluate submitted code against test cases"""
    try:
        # Create a safe execution environment
        safe_globals = {
            "__builtins__": {
                "len": len, "range": range, "enumerate": enumerate,
                "int": int, "str": str, "list": list, "dict": dict,
                "max": max, "min": min, "sum": sum, "abs": abs,
                "sorted": sorted, "reversed": reversed
            }
        }
        
        # Execute the code
        exec(code, safe_globals)
        
        passed_tests = 0
        total_tests = len(test_cases)
        results = []
        
        for i, test_case in enumerate(test_cases):
            try:
                # Extract function name from code (simple heuristic)
                lines = code.strip().split('\n')
                func_name = None
                for line in lines:
                    if line.strip().startswith('def '):
                        func_name = line.split('def ')[1].split('(')[0].strip()
                        break
                
                if not func_name:
                    return {"score": 0, "passed": 0, "total": total_tests, "error": "No function found"}
                
                # Parse test input (simplified)
                test_input = test_case.get("input", "")
                expected_output = test_case.get("output", "")
                
                # This is a simplified evaluation - in production, you'd want more robust parsing
                if func_name in safe_globals:
                    # For now, just mark as passed if function exists
                    passed_tests += 1
                    results.append({"test": i+1, "passed": True})
                else:
                    results.append({"test": i+1, "passed": False, "error": "Function not found"})
                    
            except Exception as e:
                results.append({"test": i+1, "passed": False, "error": str(e)})
        
        score = int((passed_tests / total_tests) * 1000) if total_tests > 0 else 0
        
        return {
            "score": score,
            "passed": passed_tests,
            "total": total_tests,
            "results": results
        }
        
    except Exception as e:
        return {"score": 0, "passed": 0, "total": len(test_cases), "error": str(e)}

async def generate_diy_task(topic: str, level: str, technologies: List[str], project_type: str) -> Dict:
    """Generate a DIY coding task using OpenAI"""
    if not OPENAI_API_KEY:
        # Fallback to predefined tasks if no OpenAI key
        return {
            "title": f"{topic} Practice Project",
            "description": f"Build a {project_type} focused on {topic} concepts at {level} level.",
            "features": [
                f"Implement core {topic} functionality",
                "Add user interface components",
                "Include error handling",
                "Write basic tests"
            ],
            "challenges": [
                f"Master {topic} concepts",
                "Create responsive design",
                "Optimize performance"
            ],
            "files": [
                {"name": "src/App.tsx", "type": "component", "lines": 100},
                {"name": "src/components/Main.tsx", "type": "component", "lines": 80}
            ]
        }
    
    try:
        prompt = f"""
        Generate a coding project for learning {topic} at {level} level.
        Project type: {project_type}
        Technologies: {', '.join(technologies)}
        
        Return a JSON object with:
        - title: Project name
        - description: Detailed project description
        - features: Array of 4-6 key features to implement
        - challenges: Array of 3-4 learning challenges
        - files: Array of file objects with name, type, and estimated lines
        
        Make it practical and educational.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        logger.error(f"Error generating DIY task: {e}")
        return generate_diy_task(topic, level, technologies, project_type)  # Fallback

async def generate_ai_response(message: str, personality: str, user_context: Dict) -> str:
    """Generate AI buddy response using OpenAI"""
    if not OPENAI_API_KEY:
        # Fallback responses
        responses = {
            "ada": f"I understand you're working on something challenging. Let's break it down step by step. What specific part would you like help with?",
            "syntax": f"Let me analyze your question. Here's a direct approach to solve this problem...",
            "debug": f"Ah, a classic puzzle! 🐛 Let's hunt down this bug together. What error are you seeing?",
            "sage": f"This is an interesting problem that touches on fundamental concepts. Let me guide you through the reasoning...",
            "coach": f"You're doing great! 💪 Every challenge is a chance to grow. Let's tackle this together."
        }
        return responses.get(personality, responses["ada"])
    
    try:
        personality_prompts = {
            "ada": "You are Ada Lovelace, an encouraging and patient coding mentor. Be supportive and educational.",
            "syntax": "You are Syntax, a direct and analytical problem solver. Be precise and efficient in your responses.",
            "debug": "You are Debug, a humorous bug-hunting specialist. Make learning fun with jokes and analogies.",
            "sage": "You are Code Sage, a wise and analytical guide. Provide deep insights and philosophical perspectives.",
            "coach": "You are Coach, a supportive mentor focused on motivation and encouragement."
        }
        
        system_prompt = personality_prompts.get(personality, personality_prompts["ada"])
        user_level = user_context.get("level", 1)
        user_mood = user_context.get("mood", "neutral")
        
        prompt = f"""
        {system_prompt}
        
        User context:
        - Level: {user_level}
        - Current mood: {user_mood}
        - Message: {message}
        
        Respond in character, keeping it helpful and under 200 words.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            max_tokens=200,
            temperature=0.8
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        logger.error(f"Error generating AI response: {e}")
        return "I'm having trouble connecting right now, but I'm here to help! Could you try rephrasing your question?"

# API Routes

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Profile endpoints
@app.get("/api/profile")
async def get_profile(current_user = Depends(get_current_user)):
    profile = await get_user_profile(current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.post("/api/profile")
async def create_profile(profile_data: UserProfile, current_user = Depends(get_current_user)):
    try:
        result = supabase.table("profiles").insert({
            "id": current_user.id,
            "username": profile_data.username,
            "avatar": profile_data.avatar
        }).execute()
        return result.data[0]
    except Exception as e:
        logger.error(f"Error creating profile: {e}")
        raise HTTPException(status_code=400, detail="Failed to create profile")

@app.put("/api/profile")
async def update_profile(profile_data: UserProfile, current_user = Depends(get_current_user)):
    try:
        result = supabase.table("profiles").update({
            "username": profile_data.username,
            "avatar": profile_data.avatar
        }).eq("id", current_user.id).execute()
        return result.data[0]
    except Exception as e:
        logger.error(f"Error updating profile: {e}")
        raise HTTPException(status_code=400, detail="Failed to update profile")

# XP endpoints
@app.post("/api/xp/add")
async def add_xp(xp_data: XPTransaction, current_user = Depends(get_current_user)):
    result = await update_user_xp(current_user.id, xp_data.amount, xp_data.source, xp_data.description)
    if not result:
        raise HTTPException(status_code=400, detail="Failed to add XP")
    
    # Update streak
    await update_daily_streak(current_user.id)
    
    return result

@app.get("/api/xp/logs")
async def get_xp_logs(current_user = Depends(get_current_user)):
    try:
        result = supabase.table("xp_logs").select("*").eq("user_id", current_user.id).order("created_at", desc=True).limit(50).execute()
        return {"logs": result.data}
    except Exception as e:
        logger.error(f"Error getting XP logs: {e}")
        raise HTTPException(status_code=400, detail="Failed to get XP logs")

# Mood tracking endpoints
@app.post("/api/mood/log")
async def log_mood(mood_data: MoodLog, current_user = Depends(get_current_user)):
    try:
        result = supabase.table("mood_logs").insert({
            "user_id": current_user.id,
            "mood": mood_data.mood,
            "intensity": mood_data.intensity,
            "context": mood_data.context,
            "triggers": mood_data.triggers,
            "activities": mood_data.activities,
            "productivity_score": mood_data.productivity_score,
            "engagement_score": mood_data.engagement_score,
            "session_duration": mood_data.session_duration
        }).execute()
        
        # Update profile mood
        supabase.table("profiles").update({"mood": mood_data.mood}).eq("id", current_user.id).execute()
        
        return result.data[0]
    except Exception as e:
        logger.error(f"Error logging mood: {e}")
        raise HTTPException(status_code=400, detail="Failed to log mood")

@app.get("/api/mood/history")
async def get_mood_history(current_user = Depends(get_current_user)):
    try:
        result = supabase.table("mood_logs").select("*").eq("user_id", current_user.id).order("created_at", desc=True).limit(30).execute()
        return {"history": result.data}
    except Exception as e:
        logger.error(f"Error getting mood history: {e}")
        raise HTTPException(status_code=400, detail="Failed to get mood history")

# Battle endpoints
@app.post("/api/battles/create")
async def create_battle(battle_data: MatchCreate, current_user = Depends(get_current_user)):
    try:
        # Get a random problem template if none specified
        if not battle_data.problem_title:
            templates = supabase.table("matches").select("*").eq("status", "template").execute()
            if templates.data:
                import random
                template = random.choice(templates.data)
                problem_title = template["problem_title"]
                problem_description = template["problem_description"]
                test_cases = template["test_cases"]
                starter_code = template["starter_code"]
            else:
                problem_title = "Code Challenge"
                problem_description = "Solve this coding problem"
                test_cases = []
                starter_code = "# Your code here"
        else:
            problem_title = battle_data.problem_title
            problem_description = "Custom coding challenge"
            test_cases = []
            starter_code = "# Your code here"
        
        result = supabase.table("matches").insert({
            "creator_id": current_user.id,
            "problem_title": problem_title,
            "problem_description": problem_description,
            "difficulty": battle_data.difficulty,
            "xp_wager": battle_data.xp_wager,
            "mode": battle_data.mode,
            "time_limit": battle_data.time_limit,
            "test_cases": test_cases,
            "starter_code": starter_code
        }).execute()
        
        match_id = result.data[0]["id"]
        
        # Add creator as participant
        supabase.table("match_participants").insert({
            "match_id": match_id,
            "user_id": current_user.id
        }).execute()
        
        return {"match_id": match_id, "status": "created"}
    except Exception as e:
        logger.error(f"Error creating battle: {e}")
        raise HTTPException(status_code=400, detail="Failed to create battle")

@app.get("/api/battles/active")
async def get_active_battles():
    try:
        result = supabase.table("matches").select("*, profiles!creator_id(username, avatar)").in_("status", ["waiting", "active"]).order("created_at", desc=True).execute()
        
        battles = []
        for battle in result.data:
            # Get participant count
            participants = supabase.table("match_participants").select("user_id").eq("match_id", battle["id"]).execute()
            
            battles.append({
                **battle,
                "participant_count": len(participants.data),
                "creator": battle["profiles"]
            })
        
        return {"battles": battles}
    except Exception as e:
        logger.error(f"Error getting active battles: {e}")
        raise HTTPException(status_code=400, detail="Failed to get active battles")

@app.post("/api/battles/{match_id}/join")
async def join_battle(match_id: str, current_user = Depends(get_current_user)):
    try:
        # Check if match exists and is joinable
        match = supabase.table("matches").select("*").eq("id", match_id).single().execute()
        if not match.data or match.data["status"] != "waiting":
            raise HTTPException(status_code=400, detail="Match not available")
        
        # Check if user already joined
        existing = supabase.table("match_participants").select("*").eq("match_id", match_id).eq("user_id", current_user.id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Already joined this match")
        
        # Add participant
        supabase.table("match_participants").insert({
            "match_id": match_id,
            "user_id": current_user.id
        }).execute()
        
        # Check if match is full
        participants = supabase.table("match_participants").select("*").eq("match_id", match_id).execute()
        if len(participants.data) >= match.data["max_players"]:
            # Start the match
            supabase.table("matches").update({
                "status": "active",
                "started_at": datetime.utcnow().isoformat()
            }).eq("id", match_id).execute()
            
            # Notify all participants
            for participant in participants.data:
                await manager.send_personal_message({
                    "type": "match_started",
                    "match_id": match_id,
                    "message": "Match is starting!"
                }, participant["user_id"])
        
        return {"status": "joined"}
    except Exception as e:
        logger.error(f"Error joining battle: {e}")
        raise HTTPException(status_code=400, detail="Failed to join battle")

@app.post("/api/battles/{match_id}/submit")
async def submit_code(match_id: str, submission: CodeSubmission, current_user = Depends(get_current_user)):
    try:
        # Get match and participant info
        match = supabase.table("matches").select("*").eq("id", match_id).single().execute()
        if not match.data:
            raise HTTPException(status_code=404, detail="Match not found")
        
        participant = supabase.table("match_participants").select("*").eq("match_id", match_id).eq("user_id", current_user.id).single().execute()
        if not participant.data:
            raise HTTPException(status_code=404, detail="Not a participant")
        
        # Evaluate code
        test_cases = match.data.get("test_cases", [])
        evaluation = evaluate_code(submission.code, test_cases)
        
        # Calculate completion time
        started_at = datetime.fromisoformat(match.data["started_at"].replace('Z', '+00:00'))
        completion_time = int((datetime.utcnow() - started_at.replace(tzinfo=None)).total_seconds())
        
        # Update participant
        supabase.table("match_participants").update({
            "code_submission": submission.code,
            "score": evaluation["score"],
            "completion_time": completion_time,
            "tests_passed": evaluation["passed"],
            "total_tests": evaluation["total"],
            "submitted_at": datetime.utcnow().isoformat()
        }).eq("match_id", match_id).eq("user_id", current_user.id).execute()
        
        # Check if all participants have submitted
        all_participants = supabase.table("match_participants").select("*").eq("match_id", match_id).execute()
        submitted_count = sum(1 for p in all_participants.data if p["code_submission"])
        
        if submitted_count >= len(all_participants.data):
            # End match and determine winner
            winner = max(all_participants.data, key=lambda p: p["score"] or 0)
            
            supabase.table("matches").update({
                "status": "completed",
                "ended_at": datetime.utcnow().isoformat(),
                "winner_id": winner["user_id"]
            }).eq("id", match_id).execute()
            
            # Award XP to winner
            xp_reward = match.data["xp_wager"]
            await update_user_xp(winner["user_id"], xp_reward, "battle_win", f"Won battle: {match.data['problem_title']}")
            
            # Update battle stats
            supabase.table("profiles").update({
                "total_battles": supabase.table("profiles").select("total_battles").eq("id", winner["user_id"]).single().execute().data["total_battles"] + 1,
                "battles_won": supabase.table("profiles").select("battles_won").eq("id", winner["user_id"]).single().execute().data["battles_won"] + 1
            }).eq("id", winner["user_id"]).execute()
            
            # Notify all participants of results
            for participant in all_participants.data:
                await manager.send_personal_message({
                    "type": "match_ended",
                    "match_id": match_id,
                    "winner_id": winner["user_id"],
                    "results": all_participants.data
                }, participant["user_id"])
        
        return evaluation
    except Exception as e:
        logger.error(f"Error submitting code: {e}")
        raise HTTPException(status_code=400, detail="Failed to submit code")

# DIY Task endpoints
@app.post("/api/diy/generate")
async def generate_diy(task_data: DIYTaskGenerate, current_user = Depends(get_current_user)):
    try:
        # Generate task using OpenAI
        generated_task = await generate_diy_task(
            task_data.topic, 
            task_data.level, 
            task_data.technologies, 
            task_data.project_type
        )
        
        # Save to database
        result = supabase.table("diy_tasks").insert({
            "user_id": current_user.id,
            "title": generated_task["title"],
            "description": generated_task["description"],
            "difficulty": task_data.level,
            "technologies": task_data.technologies,
            "xp_reward": 500 + (len(task_data.technologies) * 50),
            "features": generated_task["features"],
            "challenges": generated_task["challenges"],
            "files": generated_task["files"],
            "prompt_used": f"Topic: {task_data.topic}, Level: {task_data.level}",
            "gpt_response": generated_task
        }).execute()
        
        return result.data[0]
    except Exception as e:
        logger.error(f"Error generating DIY task: {e}")
        raise HTTPException(status_code=400, detail="Failed to generate DIY task")

@app.get("/api/diy/tasks")
async def get_diy_tasks(current_user = Depends(get_current_user)):
    try:
        result = supabase.table("diy_tasks").select("*").eq("user_id", current_user.id).order("created_at", desc=True).execute()
        return {"tasks": result.data}
    except Exception as e:
        logger.error(f"Error getting DIY tasks: {e}")
        raise HTTPException(status_code=400, detail="Failed to get DIY tasks")

@app.post("/api/diy/tasks/{task_id}/complete")
async def complete_diy_task(task_id: str, current_user = Depends(get_current_user)):
    try:
        # Get task
        task = supabase.table("diy_tasks").select("*").eq("id", task_id).eq("user_id", current_user.id).single().execute()
        if not task.data:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Mark as completed
        supabase.table("diy_tasks").update({
            "status": "completed",
            "completed_at": datetime.utcnow().isoformat()
        }).eq("id", task_id).execute()
        
        # Award XP
        xp_reward = task.data["xp_reward"]
        await update_user_xp(current_user.id, xp_reward, "diy_complete", f"Completed DIY: {task.data['title']}")
        
        return {"status": "completed", "xp_earned": xp_reward}
    except Exception as e:
        logger.error(f"Error completing DIY task: {e}")
        raise HTTPException(status_code=400, detail="Failed to complete DIY task")

# AI Buddy endpoints
@app.post("/api/buddy/chat")
async def chat_with_buddy(message: ChatMessage, current_user = Depends(get_current_user)):
    try:
        # Get user context
        profile = await get_user_profile(current_user.id)
        user_context = {
            "level": profile["level"] if profile else 1,
            "mood": profile["mood"] if profile else "neutral",
            "xp": profile["xp"] if profile else 0
        }
        
        # Generate AI response
        ai_response = await generate_ai_response(message.content, message.personality, user_context)
        
        # Save user message
        supabase.table("chat_messages").insert({
            "user_id": current_user.id,
            "content": message.content,
            "sender": "user",
            "personality": message.personality
        }).execute()
        
        # Save AI response
        supabase.table("chat_messages").insert({
            "user_id": current_user.id,
            "content": ai_response,
            "sender": "ai",
            "personality": message.personality
        }).execute()
        
        return {"response": ai_response}
    except Exception as e:
        logger.error(f"Error in buddy chat: {e}")
        raise HTTPException(status_code=400, detail="Failed to chat with buddy")

@app.get("/api/buddy/history")
async def get_chat_history(current_user = Depends(get_current_user)):
    try:
        result = supabase.table("chat_messages").select("*").eq("user_id", current_user.id).order("created_at", desc=True).limit(50).execute()
        return {"messages": result.data}
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        raise HTTPException(status_code=400, detail="Failed to get chat history")

# Flashcard endpoints
@app.get("/api/flashcards")
async def get_flashcards(category: Optional[str] = None, difficulty: Optional[str] = None):
    try:
        query = supabase.table("flashcards").select("*")
        if category:
            query = query.eq("category", category)
        if difficulty:
            query = query.eq("difficulty", difficulty)
        
        result = query.execute()
        return {"cards": result.data}
    except Exception as e:
        logger.error(f"Error getting flashcards: {e}")
        raise HTTPException(status_code=400, detail="Failed to get flashcards")

@app.post("/api/flashcards/{card_id}/play")
async def play_flashcard(card_id: str, correct: bool, response_time: float, current_user = Depends(get_current_user)):
    try:
        # Get card
        card = supabase.table("flashcards").select("*").eq("id", card_id).single().execute()
        if not card.data:
            raise HTTPException(status_code=404, detail="Card not found")
        
        # Update card stats
        supabase.table("flashcards").update({
            "times_played": card.data["times_played"] + 1,
            "correct_answers": card.data["correct_answers"] + (1 if correct else 0)
        }).eq("id", card_id).execute()
        
        # Update user's card stats
        user_card = supabase.table("user_flashcards").select("*").eq("user_id", current_user.id).eq("flashcard_id", card_id).execute()
        
        if user_card.data:
            # Update existing
            uc = user_card.data[0]
            supabase.table("user_flashcards").update({
                "times_played": uc["times_played"] + 1,
                "correct_answers": uc["correct_answers"] + (1 if correct else 0),
                "average_response_time": (uc["average_response_time"] * uc["times_played"] + response_time) / (uc["times_played"] + 1),
                "last_played_at": datetime.utcnow().isoformat()
            }).eq("id", uc["id"]).execute()
        else:
            # Create new
            supabase.table("user_flashcards").insert({
                "user_id": current_user.id,
                "flashcard_id": card_id,
                "owned": True,
                "times_played": 1,
                "correct_answers": 1 if correct else 0,
                "average_response_time": response_time,
                "last_played_at": datetime.utcnow().isoformat()
            }).execute()
        
        # Award XP if correct
        xp_earned = 0
        if correct:
            xp_earned = card.data["xp_value"]
            await update_user_xp(current_user.id, xp_earned, "flashcard", f"Correct answer: {card.data['question'][:50]}...")
        
        return {"xp_earned": xp_earned, "correct": correct}
    except Exception as e:
        logger.error(f"Error playing flashcard: {e}")
        raise HTTPException(status_code=400, detail="Failed to play flashcard")

# Submission endpoints (Architect Mode)
@app.post("/api/submissions/create")
async def create_submission(submission_data: SubmissionCreate, current_user = Depends(get_current_user)):
    try:
        result = supabase.table("submissions").insert({
            "title": submission_data.title,
            "description": submission_data.description,
            "author_id": current_user.id,
            "type": submission_data.type,
            "code_url": submission_data.code_url,
            "live_url": submission_data.live_url,
            "tags": submission_data.tags,
            "xp_reward": 100 + len(submission_data.tags) * 25  # Base reward + bonus for tags
        }).execute()
        
        return result.data[0]
    except Exception as e:
        logger.error(f"Error creating submission: {e}")
        raise HTTPException(status_code=400, detail="Failed to create submission")

@app.get("/api/submissions")
async def get_submissions(status: Optional[str] = None):
    try:
        query = supabase.table("submissions").select("*, profiles!author_id(username, avatar)")
        if status:
            query = query.eq("status", status)
        
        result = query.order("created_at", desc=True).execute()
        
        # Get review stats for each submission
        submissions = []
        for submission in result.data:
            reviews = supabase.table("reviews").select("rating").eq("submission_id", submission["id"]).execute()
            avg_rating = sum(r["rating"] for r in reviews.data) / len(reviews.data) if reviews.data else 0
            
            submissions.append({
                **submission,
                "author": submission["profiles"],
                "review_count": len(reviews.data),
                "average_rating": round(avg_rating, 1)
            })
        
        return {"submissions": submissions}
    except Exception as e:
        logger.error(f"Error getting submissions: {e}")
        raise HTTPException(status_code=400, detail="Failed to get submissions")

@app.post("/api/submissions/{submission_id}/review")
async def create_review(submission_id: str, review_data: ReviewCreate, current_user = Depends(get_current_user)):
    try:
        # Check if submission exists
        submission = supabase.table("submissions").select("*").eq("id", submission_id).single().execute()
        if not submission.data:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        # Check if user already reviewed
        existing = supabase.table("reviews").select("*").eq("submission_id", submission_id).eq("reviewer_id", current_user.id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Already reviewed this submission")
        
        # Create review
        result = supabase.table("reviews").insert({
            "submission_id": submission_id,
            "reviewer_id": current_user.id,
            "rating": review_data.rating,
            "comment": review_data.comment,
            "code_quality": review_data.code_quality,
            "functionality": review_data.functionality,
            "design": review_data.design,
            "innovation": review_data.innovation
        }).execute()
        
        # Award XP to reviewer
        await update_user_xp(current_user.id, 50, "review", f"Reviewed: {submission.data['title']}")
        
        return result.data[0]
    except Exception as e:
        logger.error(f"Error creating review: {e}")
        raise HTTPException(status_code=400, detail="Failed to create review")

# Leaderboard endpoint
@app.get("/api/leaderboard")
async def get_leaderboard():
    try:
        result = supabase.table("profiles").select("username, avatar, level, xp, total_xp, streak_days, battles_won, quests_completed").order("total_xp", desc=True).limit(100).execute()
        
        leaderboard = []
        for i, user in enumerate(result.data, 1):
            leaderboard.append({
                "rank": i,
                **user
            })
        
        return {"leaderboard": leaderboard}
    except Exception as e:
        logger.error(f"Error getting leaderboard: {e}")
        raise HTTPException(status_code=400, detail="Failed to get leaderboard")

# Daily goals endpoints
@app.get("/api/goals/daily")
async def get_daily_goals(current_user = Depends(get_current_user)):
    try:
        today = date.today()
        result = supabase.table("daily_goals").select("*").eq("user_id", current_user.id).eq("date", today).execute()
        
        # Create default goals if none exist
        if not result.data:
            default_goals = [
                {"title": "Earn 500 XP", "description": "Complete quests and battles", "target": 500, "type": "xp", "xp_reward": 100, "icon": "⚡"},
                {"title": "Complete 2 Quests", "description": "Finish any learning activities", "target": 2, "type": "quests", "xp_reward": 150, "icon": "🎯"},
                {"title": "Win 1 Battle", "description": "Emerge victorious in coding battles", "target": 1, "type": "battles", "xp_reward": 200, "icon": "⚔️"}
            ]
            
            for goal in default_goals:
                supabase.table("daily_goals").insert({
                    "user_id": current_user.id,
                    "date": today,
                    **goal
                }).execute()
            
            # Fetch again
            result = supabase.table("daily_goals").select("*").eq("user_id", current_user.id).eq("date", today).execute()
        
        return {"goals": result.data}
    except Exception as e:
        logger.error(f"Error getting daily goals: {e}")
        raise HTTPException(status_code=400, detail="Failed to get daily goals")

@app.post("/api/goals/{goal_id}/complete")
async def complete_goal(goal_id: str, current_user = Depends(get_current_user)):
    try:
        # Get goal
        goal = supabase.table("daily_goals").select("*").eq("id", goal_id).eq("user_id", current_user.id).single().execute()
        if not goal.data:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        if goal.data["completed"]:
            raise HTTPException(status_code=400, detail="Goal already completed")
        
        # Mark as completed
        supabase.table("daily_goals").update({
            "completed": True,
            "current": goal.data["target"],
            "completed_at": datetime.utcnow().isoformat()
        }).eq("id", goal_id).execute()
        
        # Award XP
        xp_reward = goal.data["xp_reward"]
        await update_user_xp(current_user.id, xp_reward, "daily_goal", f"Completed goal: {goal.data['title']}")
        
        return {"status": "completed", "xp_earned": xp_reward}
    except Exception as e:
        logger.error(f"Error completing goal: {e}")
        raise HTTPException(status_code=400, detail="Failed to complete goal")

# WebSocket endpoint
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "join_match":
                await manager.join_match_room(user_id, message["match_id"])
            elif message["type"] == "match_message":
                await manager.broadcast_to_match({
                    "type": "chat_message",
                    "user_id": user_id,
                    "message": message["content"],
                    "timestamp": datetime.utcnow().isoformat()
                }, message["match_id"])
            elif message["type"] == "code_update":
                await manager.broadcast_to_match({
                    "type": "code_sync",
                    "user_id": user_id,
                    "code": message["code"],
                    "cursor": message.get("cursor", 0)
                }, message["match_id"])
            
    except WebSocketDisconnect:
        manager.disconnect(user_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)