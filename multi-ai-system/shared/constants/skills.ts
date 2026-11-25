// ============================================
// MULTI-AI SYSTEM - SKILLS HUB
// 40 Skills - Everything Mixed - Nothing Separate
// ============================================

import type { Skill } from '../types';

export const SKILLS: Skill[] = [
  // Core Skills (1-7)
  {
    id: 'skill-001',
    name: 'Coding',
    description: 'Writing code, explaining it, debugging it, suggesting a better way',
    category: 'coding',
    keywords: ['code', 'program', 'script', 'debug', 'algorithm', 'function', 'class', 'variable'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-002',
    name: 'Image Creation',
    description: 'Creating a photo/visual, recognising what is shown',
    category: 'image-creation',
    keywords: ['image', 'photo', 'draw', 'picture', 'visual', 'generate', 'recognize', 'identify'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-003',
    name: 'Video / Explainer Generation',
    description: 'Creating an animated explainer',
    category: 'video-explainer',
    keywords: ['video', 'animation', 'explainer', 'animate', 'motion', 'story', 'tutorial'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-004',
    name: 'Podcast / Audio',
    description: 'Speaking aloud, narration, audio summary, voice answer',
    category: 'podcast-audio',
    keywords: ['podcast', 'audio', 'voice', 'speak', 'narrate', 'listen', 'sound', 'TTS'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-005',
    name: 'Explaining',
    description: 'In every style: story, analogy, step-by-step, quiz',
    category: 'explaining',
    keywords: ['explain', 'teach', 'describe', 'story', 'analogy', 'steps', 'quiz', 'understand'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-006',
    name: 'Writing',
    description: 'Writing, improving, shortening/lengthening, in Hinglish or English',
    category: 'writing',
    keywords: ['write', 'compose', 'edit', 'improve', 'text', 'article', 'essay', 'content'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-007',
    name: 'Planning',
    description: 'A plan, a routine, a roadmap, breaking work into steps',
    category: 'planning',
    keywords: ['plan', 'routine', 'roadmap', 'steps', 'schedule', 'organize', 'breakdown'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },

  // Everyday Skills (8-11)
  {
    id: 'skill-008',
    name: 'Web Research & Live Search',
    description: 'Live searching on the internet, with sources',
    category: 'web-research',
    keywords: ['search', 'research', 'web', 'internet', 'sources', 'find', 'look up'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-009',
    name: 'Data Analysis',
    description: 'Understanding data, calculations, patterns, chart thinking',
    category: 'data-analysis',
    keywords: ['data', 'analyze', 'calculate', 'pattern', 'chart', 'statistics', 'trend'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-010',
    name: 'Maths & Logic',
    description: 'Maths, reasoning, logic puzzles',
    category: 'maths-logic',
    keywords: ['math', 'mathematics', 'logic', 'puzzle', 'calculate', 'reason', 'solve'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-011',
    name: 'Language & Translation',
    description: 'Changing language, understanding a Hinglish/English mix',
    category: 'language-translation',
    keywords: ['language', 'translate', 'hinglish', 'hindi', 'english', 'bilingual', 'convert'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },

  // Practical Skills (12-17)
  {
    id: 'skill-012',
    name: 'Finance & Budgeting',
    description: 'Money calculations, budget, saving/investment thinking',
    category: 'finance-budgeting',
    keywords: ['finance', 'money', 'budget', 'invest', 'saving', 'expense', 'income'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-013',
    name: 'Health & Routine Coach',
    description: 'Help with routine, health habits, daily schedule',
    category: 'health-routine',
    keywords: ['health', 'routine', 'habit', 'schedule', 'fitness', 'wellness', 'exercise'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-014',
    name: 'Study & Exam Prep',
    description: 'Studies, exam preparation, memorisation techniques',
    category: 'study-exam',
    keywords: ['study', 'exam', 'learn', 'memorize', 'prepare', 'test', 'education'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-015',
    name: 'Game Making',
    description: 'Making / designing a game',
    category: 'game-making',
    keywords: ['game', 'design', 'create', 'build', 'play', 'developer', 'gaming'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-016',
    name: 'Music & Creativity',
    description: 'Help with music and creative work',
    category: 'music-creativity',
    keywords: ['music', 'creative', 'compose', 'art', 'design', 'lyrics', 'melody'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-017',
    name: 'Everyday Help',
    description: 'Small and large everyday tasks',
    category: 'everyday-help',
    keywords: ['help', 'task', 'everyday', 'daily', 'assist', 'support', 'advice'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },

  // Development Skills (18-23)
  {
    id: 'skill-018',
    name: 'Software Development',
    description: 'Building complete software',
    category: 'software-development',
    keywords: ['software', 'develop', 'build', 'application', 'program', 'engineer'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-019',
    name: 'App Development',
    description: 'Building a mobile/desktop app',
    category: 'app-development',
    keywords: ['app', 'mobile', 'desktop', 'application', 'build', 'developer'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-020',
    name: 'Web Development',
    description: 'Building a website',
    category: 'web-development',
    keywords: ['web', 'website', 'html', 'css', 'javascript', 'frontend', 'backend'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-021',
    name: 'Software Updates & Maintenance',
    description: 'Updating/maintaining old software',
    category: 'software-maintenance',
    keywords: ['update', 'maintain', 'software', 'upgrade', 'fix', 'patch', 'version'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-022',
    name: 'Engineering & System Design',
    description: 'System design, engineering thinking',
    category: 'engineering-design',
    keywords: ['engineering', 'system', 'design', 'architecture', 'plan', 'structure'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-023',
    name: 'Debugging & Testing',
    description: 'Finding an error, checking it and fixing it',
    category: 'debugging-testing',
    keywords: ['debug', 'test', 'error', 'fix', 'check', 'validate', 'bug'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },

  // Self-Improvement Skills (24-26)
  {
    id: 'skill-024',
    name: 'Self-Learning / Skill Creation',
    description: 'Creating a new skill itself, finding it, adding it',
    category: 'self-learning',
    keywords: ['learn', 'skill', 'create', 'develop', 'improve', 'add', 'new'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-025',
    name: 'Self-Improvement & Learning',
    description: 'Improving itself',
    category: 'self-improvement',
    keywords: ['improve', 'learn', 'upgrade', 'evolve', 'grow', 'better', 'enhance'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-026',
    name: 'Quality Self-Check',
    description: 'Checking itself before giving an answer',
    category: 'quality-self-check',
    keywords: ['check', 'quality', 'review', 'verify', 'improve', 'validate', 'assess'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },

  // Advanced Skills (27-30)
  {
    id: 'skill-027',
    name: 'Creative Problem-Solving',
    description: 'Finding a creative solution to a difficulty',
    category: 'creative-problem-solving',
    keywords: ['creative', 'problem', 'solve', 'solution', 'innovate', 'think', 'outside-box'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-028',
    name: 'Goal Tracking & Motivation',
    description: 'Goal, streak, motivation',
    category: 'goal-tracking',
    keywords: ['goal', 'track', 'motivation', 'streak', 'achieve', 'target', 'progress'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-029',
    name: 'Personalisation / Memory',
    description: 'Rohit\'s preferences and memories',
    category: 'personalisation',
    keywords: ['personal', 'memory', 'preference', 'custom', 'remember', 'user', 'profile'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-030',
    name: 'Efficient Working',
    description: 'Doing work fast and in fewer steps',
    category: 'efficient-working',
    keywords: ['efficient', 'fast', 'quick', 'optimize', 'streamline', 'productivity'],
    isEnabled: true,
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },

  // Connect & Operate Skills (31-39) - Require Rohit's approval
  {
    id: 'skill-031',
    name: 'Connect to Apps',
    description: 'Connecting to apps and working in them',
    category: 'connect-operate',
    keywords: ['connect', 'app', 'work', 'operate', 'integration', 'application'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-032',
    name: 'Connect to Websites',
    description: 'Connecting to websites and operating them',
    category: 'connect-operate',
    keywords: ['connect', 'website', 'operate', 'browse', 'interact', 'navigate'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-033',
    name: 'Run Browser',
    description: 'Running a browser and controlling it',
    category: 'connect-operate',
    keywords: ['browser', 'run', 'control', 'navigate', 'surf', 'web'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-034',
    name: 'Connect to Plugins',
    description: 'Connecting to plugins and using them',
    category: 'connect-operate',
    keywords: ['plugin', 'connect', 'use', 'extend', 'add-on', 'extension'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-035',
    name: 'Operate Computer',
    description: 'Operating a computer on Rohit\'s behalf',
    category: 'connect-operate',
    keywords: ['computer', 'operate', 'control', 'use', 'manage', 'desktop'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-036',
    name: 'Operate Mobile',
    description: 'Operating a mobile device on Rohit\'s behalf',
    category: 'connect-operate',
    keywords: ['mobile', 'phone', 'operate', 'control', 'use', 'device'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-037',
    name: 'Work on Behalf - Apps',
    description: 'Working on Rohit\'s behalf on apps',
    category: 'connect-operate',
    keywords: ['work', 'behalf', 'apps', 'represent', 'act', 'on-behalf'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-038',
    name: 'Work on Behalf - Websites',
    description: 'Working on Rohit\'s behalf on websites',
    category: 'connect-operate',
    keywords: ['work', 'behalf', 'websites', 'represent', 'act', 'on-behalf'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
  {
    id: 'skill-039',
    name: 'Work on Behalf - Devices',
    description: 'Working on Rohit\'s behalf on devices',
    category: 'connect-operate',
    keywords: ['work', 'behalf', 'devices', 'represent', 'act', 'on-behalf'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },

  // Website Login & Create (40)
  {
    id: 'skill-040',
    name: 'Website Login & Create',
    description: 'Logging in to a website on Rohit\'s behalf and creating something there. Show a draft first; do NOT save/publish without Rohit\'s "yes".',
    category: 'website-login',
    keywords: ['login', 'create', 'website', 'account', 'sign-in', 'register', 'draft'],
    isEnabled: false, // Requires Rohit's approval
    isBuiltIn: true,
    createdAt: new Date('2022-01-01'),
  },
];

// Get skill by ID
export function getSkillById(id: string): Skill | undefined {
  return SKILLS.find(skill => skill.id === id);
}

// Get skill by name
export function getSkillByName(name: string): Skill | undefined {
  return SKILLS.find(skill => skill.name === name);
}

// Get enabled skills
export function getEnabledSkills(): Skill[] {
  return SKILLS.filter(skill => skill.isEnabled);
}

// Get skills by category
export function getSkillsByCategory(category: string): Skill[] {
  return SKILLS.filter(skill => skill.category === category);
}

// Search skills by name or description
export function searchSkills(query: string): Skill[] {
  const lowerQuery = query.toLowerCase();
  return SKILLS.filter(skill => 
    skill.name.toLowerCase().includes(lowerQuery) ||
    skill.description.toLowerCase().includes(lowerQuery) ||
    skill.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
}

// Auto-detect skill from question
export function detectSkillFromQuestion(question: string): Skill | undefined {
  const lowerQuestion = question.toLowerCase();
  
  // Check each skill's keywords
  for (const skill of SKILLS) {
    for (const keyword of skill.keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        return skill;
      }
    }
  }
  
  // Default to general skills
  return SKILLS.find(skill => skill.category === 'everyday-help');
}

// Skill categories for filtering
export const SKILL_CATEGORIES = [
  'coding',
  'image-creation',
  'video-explainer',
  'podcast-audio',
  'explaining',
  'writing',
  'planning',
  'web-research',
  'data-analysis',
  'maths-logic',
  'language-translation',
  'finance-budgeting',
  'health-routine',
  'study-exam',
  'game-making',
  'music-creativity',
  'everyday-help',
  'software-development',
  'app-development',
  'web-development',
  'software-maintenance',
  'engineering-design',
  'debugging-testing',
  'self-learning',
  'self-improvement',
  'quality-self-check',
  'creative-problem-solving',
  'goal-tracking',
  'personalisation',
  'efficient-working',
  'connect-operate',
  'website-login',
];
