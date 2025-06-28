import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export interface FlashcardData {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  explanation?: string;
  codeExample?: string;
}

export interface AIPersonalityConfig {
  name: string;
  style: string;
  traits: string[];
  teachingApproach: string;
}

export interface ProjectConfig {
  projectType: string;
  difficulty: string;
  technologies: string[];
  projectSize: string;
  focusArea: string;
  timePreference: string;
  learningGoal: string;
  currentMood: string;
  energyLevel: string;
  preferredStyle: string;
}

export interface GeneratedProject {
  title: string;
  description: string;
  features: string[];
  challenges: string[];
  files: Array<{
    name: string;
    type: string;
    lines: number;
    description: string;
  }>;
  estimatedTime: string;
  xpReward: number;
  difficulty: string;
  technologies: string[];
  learningOutcomes: string[];
  motivationalMessage: string;
  personalizedTips: string[];
  moodBasedFeatures: string[];
  nextSteps: string[];
  resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  codeSnippets: Array<{
    filename: string;
    code: string;
    explanation: string;
  }>;
}

export class GeminiService {
  private model: any;

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async generateAIResponse(
    message: string, 
    personality: AIPersonalityConfig,
    userContext: {
      level: number;
      mood: string;
      currentTopic?: string;
      learningGoals?: string[];
    }
  ): Promise<string> {
    if (!this.model) {
      return this.getFallbackResponse(message, personality);
    }

    try {
      const prompt = this.buildPersonalityPrompt(message, personality, userContext);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackResponse(message, personality);
    }
  }

  async generateFlashcards(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5,
    userLevel: number = 1,
    specificFocus?: string
  ): Promise<FlashcardData[]> {
    if (!this.model) {
      return this.getFallbackFlashcards(topic, difficulty, count);
    }

    try {
      const focusText = specificFocus ? ` with specific focus on ${specificFocus}` : '';
      const prompt = `Generate ${count} educational flashcards about ${topic}${focusText} for a ${difficulty} level programmer (user level: ${userLevel}).

Create practical, coding-focused questions that test real understanding, not just memorization.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Clear, specific question about ${topic} that tests practical understanding",
    "answer": "Comprehensive answer with clear explanation",
    "difficulty": "${difficulty}",
    "category": "${topic}",
    "tags": ["relevant", "programming", "tags"],
    "explanation": "Why this concept is important and how it's used",
    "codeExample": "// Optional: Brief code example if relevant\nconst example = 'code here';"
  }
]

Guidelines:
- Make questions practical and scenario-based
- Include code examples in answers when helpful
- Ensure answers teach the concept, not just state facts
- Use real-world programming scenarios
- Make explanations beginner-friendly but technically accurate
- Focus on concepts that ${difficulty} level programmers should know`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const flashcards = JSON.parse(jsonMatch[0]);
        return flashcards.map((card: any) => ({
          ...card,
          difficulty,
          category: topic,
          tags: Array.isArray(card.tags) ? card.tags : [topic, difficulty]
        }));
      }
      
      return this.getFallbackFlashcards(topic, difficulty, count);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      return this.getFallbackFlashcards(topic, difficulty, count);
    }
  }

  async generateTopicFlashcards(
    conversationContext: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    count: number = 3
  ): Promise<FlashcardData[]> {
    if (!this.model) {
      return this.getFallbackFlashcards('programming', difficulty, count);
    }

    try {
      const prompt = `Based on this conversation context, generate ${count} relevant flashcards:

"${conversationContext}"

Create flashcards that reinforce the concepts discussed. Return ONLY a valid JSON array:
[
  {
    "question": "Question based on the conversation topic",
    "answer": "Detailed answer with explanation",
    "difficulty": "${difficulty}",
    "category": "extracted from context",
    "tags": ["relevant", "tags"],
    "explanation": "Why this is important to understand",
    "codeExample": "// Code example if relevant"
  }
]

Make the flashcards directly relevant to what was just discussed.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const flashcards = JSON.parse(jsonMatch[0]);
        return flashcards.map((card: any) => ({
          ...card,
          difficulty,
          tags: Array.isArray(card.tags) ? card.tags : ['programming']
        }));
      }
      
      return this.getFallbackFlashcards('programming', difficulty, count);
    } catch (error) {
      console.error('Error generating topic flashcards:', error);
      return this.getFallbackFlashcards('programming', difficulty, count);
    }
  }

  async generateDIYProject(
    config: ProjectConfig,
    moodContext: any,
    timeContext: any,
    userLevel: number = 1
  ): Promise<GeneratedProject> {
    if (!this.model) {
      throw new Error('AI service not available');
    }

    try {
      const prompt = `Generate a comprehensive, personalized ${config.projectType} project with the following specifications:

**Project Configuration:**
- Type: ${config.projectType}
- Difficulty: ${config.difficulty}
- Technologies: ${config.technologies.join(', ')}
- Size: ${config.projectSize}
- Focus Area: ${config.focusArea}
- Time Preference: ${config.timePreference}
- Learning Goal: ${config.learningGoal}

**Personalization Context:**
- Current Mood: ${config.currentMood} (${moodContext?.message || 'Ready to code!'})
- Energy Level: ${config.energyLevel}
- Preferred Style: ${config.preferredStyle}
- User Level: ${userLevel}
- Time Context: ${timeContext?.suggestion || 'Perfect time for coding!'}

**Mood-Based Enhancements:**
${moodContext?.projectBoost || 'Add engaging features'}
${timeContext?.suggestion || 'Focus on core functionality'}

Create a project that:
1. Matches the user's current emotional state and energy level
2. Provides appropriate challenge for their skill level
3. Includes motivational elements and personal encouragement
4. Has clear, achievable learning outcomes
5. Feels personally relevant and engaging
6. Uses sensory language to create excitement
7. Includes mood-appropriate features and suggestions

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Compelling, personalized project title that excites the user",
  "description": "Detailed description that makes the user excited to build this",
  "features": ["Feature 1 with emotional appeal", "Feature 2 that matches their mood", "Feature 3 that challenges appropriately"],
  "challenges": ["Challenge 1 suited to their energy", "Challenge 2 that builds confidence"],
  "files": [
    {
      "name": "src/App.tsx",
      "type": "component",
      "lines": 120,
      "description": "Main application component with routing and state"
    }
  ],
  "estimatedTime": "X-Y hours based on project size",
  "xpReward": 750,
  "difficulty": "${config.difficulty}",
  "technologies": ${JSON.stringify(config.technologies)},
  "learningOutcomes": ["Specific skill 1", "Specific skill 2", "Specific skill 3"],
  "motivationalMessage": "Personal, encouraging message that acknowledges their mood and energy",
  "personalizedTips": ["Tip based on their mood", "Tip based on their energy level", "Tip based on their learning style"],
  "moodBasedFeatures": ["Feature that matches their current mood"],
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "resources": [
    {
      "title": "Resource title",
      "url": "#",
      "type": "documentation"
    }
  ],
  "codeSnippets": [
    {
      "filename": "src/App.tsx",
      "code": "// Starter code example",
      "explanation": "What this code does and why it's important"
    }
  ]
}

Make the project feel like it was designed specifically for this person in this moment. Use sensory language, emotional appeals, and personal touches that make them excited to start coding immediately.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const project = JSON.parse(jsonMatch[0]);
        return {
          ...project,
          difficulty: config.difficulty,
          technologies: config.technologies
        };
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Error generating DIY project:', error);
      throw error;
    }
  }

  private buildPersonalityPrompt(
    message: string,
    personality: AIPersonalityConfig,
    userContext: any
  ): string {
    // Enhanced prompt to better detect flashcard requests
    const flashcardKeywords = [
      'make flashcard', 'create flashcard', 'generate flashcard',
      'flashcard on', 'flashcard about', 'flashcard for',
      'make cards', 'create cards', 'generate cards'
    ];
    
    const hasFlashcardRequest = flashcardKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    const flashcardInstruction = hasFlashcardRequest ? 
      `\n\nIMPORTANT: The user is asking for flashcards. Acknowledge their request and confirm that you'll create flashcards for them. Say something like "I'll create flashcards for you right away!" or "Perfect! I'll generate some practice cards about [topic]."` : 
      `\n\nIf the user is asking about a programming concept, you can naturally offer to create flashcards by saying something like "I can create some practice flashcards to help you master this concept!" or "Would you like me to generate some flashcards to reinforce what we just discussed?"`;

    return `You are ${personality.name}, an AI coding mentor with these characteristics:
- Style: ${personality.style}
- Traits: ${personality.traits.join(', ')}
- Teaching approach: ${personality.teachingApproach}

User context:
- Level: ${userContext.level}
- Current mood: ${userContext.mood}
- Current topic: ${userContext.currentTopic || 'general programming'}

User message: "${message}"

Respond in character as ${personality.name}. Keep responses helpful, encouraging, and under 200 words.${flashcardInstruction}

Focus on being helpful and educational while maintaining your personality traits.`;
  }

  private getFallbackResponse(message: string, personality: AIPersonalityConfig): string {
    const lowerMessage = message.toLowerCase();
    const isFlashcardRequest = lowerMessage.includes('flashcard') || 
                              lowerMessage.includes('make card') || 
                              lowerMessage.includes('create card');

    const responses = {
      encouraging: isFlashcardRequest ? 
        `Absolutely! I'd love to create some flashcards for you! 🎯 While my AI is having a moment, I can still help you practice. What topic would you like flashcards on? I'll generate some great practice questions to help you learn!` :
        `I love your curiosity about coding! While I'm having trouble connecting to my full AI capabilities right now, I'm still here to help. ${lowerMessage.includes('react') ? 'React is such a powerful library - would you like me to create some flashcards to help you learn React concepts better?' : 'What specific programming topic would you like to explore together? I can create flashcards to help you practice!'}`,
      
      direct: isFlashcardRequest ?
        `Confirmed. I'll generate flashcards for you. Specify the topic and difficulty level for optimal results.` :
        `I'm currently running in limited mode, but I can still assist you. ${lowerMessage.includes('error') ? 'For debugging, try checking your console logs and breaking down the problem step by step.' : 'What programming challenge are you working on? I can generate practice flashcards for any topic.'}`,
      
      humorous: isFlashcardRequest ?
        `Flashcards coming right up! 🃏 Even though my AI brain is taking a coffee break, I can still whip up some awesome practice questions for you! What topic shall we tackle?` :
        `Oops! Looks like my AI brain is taking a coffee break ☕ But don't worry, I'm still here to help! ${lowerMessage.includes('bug') ? 'Bugs are just undocumented features, right? 😄 Let me know what you\'re working on!' : 'What coding adventure shall we embark on today? I can whip up some flashcards to make learning more fun!'}`,
      
      analytical: isFlashcardRequest ?
        `Request acknowledged. I'll systematically generate flashcards based on your specified parameters. Please provide the topic and desired difficulty level.` :
        `I'm currently operating with reduced functionality, but I can still provide structured guidance. ${lowerMessage.includes('algorithm') ? 'For algorithmic problems, let\'s break this down systematically.' : 'What specific technical concept would you like to analyze? I can create targeted flashcards to test your understanding.'}`,
      
      supportive: isFlashcardRequest ?
        `Of course! I'm here to support your learning journey! 💪 I'll create some helpful flashcards for you. What topic would you like to practice? Remember, every expert was once a beginner!` :
        `I understand this might be frustrating, but I'm here to support you! 💪 ${lowerMessage.includes('difficult') ? 'Remember, every expert was once a beginner. What specific area would you like help with?' : 'What programming goal are you working towards today? I can create personalized flashcards to help you succeed!'}`
    };
    
    return responses[personality.style as keyof typeof responses] || responses.encouraging;
  }

  private getFallbackFlashcards(topic: string, difficulty: string, count: number): FlashcardData[] {
    const fallbackCards: Record<string, FlashcardData[]> = {
      react: [
        {
          question: "What is JSX and why is it used in React?",
          answer: "JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It gets transpiled to React.createElement() calls.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['jsx', 'syntax', 'react'],
          explanation: "JSX makes React code more readable and allows developers to write component templates in a familiar HTML-like syntax.",
          codeExample: "const element = <h1>Hello, World!</h1>;\n// Transpiles to: React.createElement('h1', null, 'Hello, World!');"
        },
        {
          question: "What is the difference between state and props in React?",
          answer: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component that can trigger re-renders when changed.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['state', 'props', 'components'],
          explanation: "Understanding the difference between props and state is fundamental to React's data flow and component architecture.",
          codeExample: "// Props (read-only)\nfunction Child({ name }) { return <h1>Hello {name}</h1>; }\n\n// State (mutable)\nconst [count, setCount] = useState(0);"
        },
        {
          question: "What is the purpose of the useEffect hook?",
          answer: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after render and can be controlled with dependencies.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['hooks', 'useEffect', 'side-effects'],
          explanation: "useEffect replaces lifecycle methods in functional components and helps manage side effects in a declarative way.",
          codeExample: "useEffect(() => {\n  // Side effect code\n  fetchData();\n}, [dependency]); // Runs when dependency changes"
        },
        {
          question: "How do you handle events in React?",
          answer: "React uses SyntheticEvents, which are wrappers around native events. Event handlers are passed as props and use camelCase naming convention.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['events', 'handlers', 'synthetic-events'],
          explanation: "React's event system provides consistent behavior across different browsers and integrates well with React's component model.",
          codeExample: "function Button() {\n  const handleClick = (e) => {\n    e.preventDefault();\n    console.log('Button clicked!');\n  };\n  return <button onClick={handleClick}>Click me</button>;\n}"
        },
        {
          question: "What are React keys and why are they important?",
          answer: "Keys are special attributes that help React identify which items have changed, been added, or removed in lists. They should be stable, predictable, and unique among siblings.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['keys', 'lists', 'performance'],
          explanation: "Keys help React optimize rendering performance by tracking list items and minimizing DOM manipulations.",
          codeExample: "const items = data.map(item => \n  <li key={item.id}>{item.name}</li>\n); // Use unique, stable keys"
        }
      ],
      javascript: [
        {
          question: "What is a closure in JavaScript and how does it work?",
          answer: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This allows for data privacy and function factories.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['closure', 'scope', 'functions'],
          explanation: "Closures are fundamental to JavaScript and enable powerful patterns like module patterns, callbacks, and data encapsulation.",
          codeExample: "function outer(x) {\n  return function inner(y) {\n    return x + y; // inner has access to x\n  };\n}\nconst add5 = outer(5);\nconsole.log(add5(3)); // 8"
        },
        {
          question: "What is the difference between let, const, and var?",
          answer: "var is function-scoped and can be redeclared; let is block-scoped and can be reassigned but not redeclared; const is block-scoped and cannot be reassigned or redeclared.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['variables', 'scope', 'declarations'],
          explanation: "Understanding variable declarations is crucial for avoiding scope-related bugs and writing predictable JavaScript code.",
          codeExample: "var a = 1; // function-scoped\nlet b = 2; // block-scoped, reassignable\nconst c = 3; // block-scoped, immutable binding"
        },
        {
          question: "What is the event loop in JavaScript?",
          answer: "The event loop is JavaScript's concurrency model that handles asynchronous operations. It continuously checks the call stack and task queue, moving tasks from the queue to the stack when the stack is empty.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['event-loop', 'async', 'concurrency'],
          explanation: "The event loop enables JavaScript's non-blocking behavior and is essential for understanding how async code executes.",
          codeExample: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nconsole.log('3');\n// Output: 1, 3, 2"
        },
        {
          question: "What is prototypal inheritance in JavaScript?",
          answer: "Prototypal inheritance is JavaScript's inheritance model where objects can inherit properties and methods from other objects through the prototype chain.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['prototype', 'inheritance', 'objects'],
          explanation: "Understanding prototypes is key to mastering JavaScript's object-oriented features and how built-in methods work.",
          codeExample: "const parent = { greet() { return 'Hello'; } };\nconst child = Object.create(parent);\nconsole.log(child.greet()); // 'Hello'"
        },
        {
          question: "What are JavaScript functions and how do they work?",
          answer: "Functions are reusable blocks of code that perform specific tasks. They can take parameters, return values, and can be declared, expressed, or created as arrow functions.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['functions', 'parameters', 'return'],
          explanation: "Functions are fundamental building blocks in JavaScript that enable code reusability and modular programming.",
          codeExample: "// Function declaration\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Arrow function\nconst greet = (name) => `Hello, ${name}!`;"
        }
      ],
      css: [
        {
          question: "What is the CSS Box Model?",
          answer: "The CSS Box Model describes how elements are structured with content, padding, border, and margin. It determines the total space an element occupies.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['box-model', 'layout', 'spacing'],
          explanation: "Understanding the box model is fundamental for controlling layout and spacing in CSS.",
          codeExample: "/* Total width = content + padding + border + margin */\n.box {\n  width: 100px;\n  padding: 10px;\n  border: 2px solid;\n  margin: 5px;\n}"
        },
        {
          question: "What is the difference between Flexbox and CSS Grid?",
          answer: "Flexbox is designed for one-dimensional layouts (row or column), while CSS Grid is designed for two-dimensional layouts (rows and columns simultaneously).",
          difficulty: difficulty as any,
          category: topic,
          tags: ['flexbox', 'grid', 'layout'],
          explanation: "Choosing between Flexbox and Grid depends on whether you need one-dimensional or two-dimensional layout control.",
          codeExample: "/* Flexbox - 1D */\n.flex { display: flex; }\n\n/* Grid - 2D */\n.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}"
        }
      ],
      programming: [
        {
          question: "What is a variable in programming?",
          answer: "A variable is a named storage location that holds data which can be modified during program execution. Variables have types and scope.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['variables', 'data', 'storage'],
          explanation: "Variables are fundamental concepts in programming that allow us to store and manipulate data.",
          codeExample: "// JavaScript variable examples\nlet name = 'John';  // String variable\nconst age = 25;     // Number constant\nvar isActive = true; // Boolean variable"
        },
        {
          question: "What is a function in programming?",
          answer: "A function is a reusable block of code that performs a specific task. It can accept input parameters and return output values.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['functions', 'reusability', 'parameters'],
          explanation: "Functions help organize code, promote reusability, and make programs more modular and maintainable.",
          codeExample: "// Function that adds two numbers\nfunction add(a, b) {\n  return a + b;\n}\n\n// Usage\nconst result = add(5, 3); // Returns 8"
        },
        {
          question: "What is a loop in programming?",
          answer: "A loop is a programming construct that repeats a block of code multiple times until a specified condition is met.",
          difficulty: difficulty as any,
          category: topic,
          tags: ['loops', 'iteration', 'control-flow'],
          explanation: "Loops are essential for automating repetitive tasks and processing collections of data efficiently.",
          codeExample: "// For loop example\nfor (let i = 0; i < 5; i++) {\n  console.log('Count:', i);\n}\n// Prints numbers 0 through 4"
        }
      ]
    };

    const cards = fallbackCards[topic.toLowerCase()] || fallbackCards.programming;
    return cards.slice(0, count);
  }
}

export const geminiService = new GeminiService();