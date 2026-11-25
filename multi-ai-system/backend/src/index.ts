// ============================================
// MULTI-AI SYSTEM - BACKEND SERVER
// Everything Mixed - Nothing Separate
// All agents use FULL abilities in EVERY stage
// Flexible stages: agents can add extra stages as needed
// Self-deciding work method: agents decide HOW to do work
// ============================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { db, testConnection } from './config/database';
import { AGENT_ROSTER, SKILLS, FUSION_PERSONA, SYSTEM_CONFIG, AGENT_NAME_CORRECTIONS } from '../../shared/constants';
import type { 
  Agent, 
  Skill, 
  PipelineRun, 
  ApiResponse,
  StagePlan,
  WorkPlan,
  Stage,
  StagePlanStage,
  WorkPlanCheck,
  DiscussionMessage,
  GroupDecision
} from '../../shared/types';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', limiter);

// JSON body parser
app.use(express.json({ limit: '50mb' }));

// ============================================
// DEMO MODE FLAG
// ============================================

const IS_DEMO_MODE = true;

// ============================================
// HELPER FUNCTIONS - Agent-Driven Decisions
// ============================================

// Determine if extra stages are needed based on task analysis
function determineStagePlan(question: string, participants: string[]): StagePlan {
  const timestamp = new Date();
  
  // Analyze the question to determine if extra stages are needed
  const lowerQuestion = question.toLowerCase();
  const needsExtraStage = 
    lowerQuestion.includes('build') ||
    lowerQuestion.includes('create') ||
    lowerQuestion.includes('make') ||
    lowerQuestion.includes('design') ||
    lowerQuestion.includes('code') ||
    lowerQuestion.includes('app') ||
    lowerQuestion.includes('website') ||
    lowerQuestion.includes('game') ||
    lowerQuestion.includes('compare') ||
    lowerQuestion.includes('decision') ||
    lowerQuestion.includes('verify') ||
    lowerQuestion.includes('fact-check') ||
    lowerQuestion.includes('deep') ||
    lowerQuestion.includes('detailed') ||
    lowerQuestion.includes('comprehensive') ||
    lowerQuestion.includes('don\'t leave anything out') ||
    lowerQuestion.includes('everything') ||
    lowerQuestion.length > 200;
  
  const totalStages = needsExtraStage ? 4 : 3;
  const stages: StagePlanStage[] = [
    {
      stageNumber: 1,
      name: 'Stage 1 - Individual Thinking',
      purpose: 'Each AI thinks independently and gives its own answer',
      reason: 'Default first stage - every agent uses FULL abilities (search, logic, reasoning, debate, creativity, coding, checking)',
      expectedOutput: `Individual answers from all ${participants.length} agents`,
    },
    {
      stageNumber: 2,
      name: 'Stage 2 - Joint Discussion',
      purpose: 'All AIs discuss together, agree, challenge, and add to each other\'s answers',
      reason: 'Default second stage - collective discussion with no fixed roles',
      expectedOutput: 'Discussion transcript (agree/challenge/add) + one joint answer',
    },
    {
      stageNumber: 3,
      name: 'Stage 3 - Final Combination',
      purpose: 'All AIs combine Stage 1 + Stage 2 into one final answer',
      reason: 'Default third stage - mixing all perspectives',
      expectedOutput: 'Final combined answer with key takeaways',
    },
  ];
  
  // Add extra stage if needed
  if (needsExtraStage) {
    let extraStageType = 'Verification / Fact-Check';
    let extraPurpose = 'Verify claims and fact-check information';
    let extraReason = 'Task requires verification due to complexity or importance';
    
    if (lowerQuestion.includes('build') || lowerQuestion.includes('create') || lowerQuestion.includes('make')) {
      extraStageType = 'Build / Create';
      extraPurpose = 'Create the actual thing (code, design, plan, etc.)';
      extraReason = 'Task involves creating something tangible';
    } else if (lowerQuestion.includes('compare') || lowerQuestion.includes('decision')) {
      extraStageType = 'Option Comparison';
      extraPurpose = 'Compare all options and rank them';
      extraReason = 'Task requires comparing multiple options';
    } else if (lowerQuestion.includes('test') || lowerQuestion.includes('debug')) {
      extraStageType = 'Test / Debug';
      extraPurpose = 'Test the built thing and find errors';
      extraReason = 'Task involves testing or debugging';
    } else if (lowerQuestion.includes('deep') || lowerQuestion.includes('detailed')) {
      extraStageType = 'Deep Research';
      extraPurpose = 'Gather more sources, data, and evidence';
      extraReason = 'Task requires deeper research';
    }
    
    stages.push({
      stageNumber: 4,
      name: `Stage 4 - ${extraStageType}`,
      purpose: extraPurpose,
      reason: extraReason,
      expectedOutput: `Output from ${extraStageType.toLowerCase()}`,
    });
  }
  
  return {
    id: `stage-plan-${Date.now()}`,
    totalStages,
    stages,
    reason: needsExtraStage 
      ? `Task complexity requires ${totalStages} stages: extra stage added for ${stages[3]?.name}`
      : 'Default 3-stage pipeline sufficient for this task',
    decidedBy: 'agents',
    decidedAt: timestamp,
    changes: [],
  };
}

// Determine work plan through collective agent discussion
function determineWorkPlan(question: string, participants: string[], stagePlan: StagePlan): WorkPlan {
  const timestamp = new Date();
  const lowerQuestion = question.toLowerCase();
  
  // Determine approach based on question type
  let approach = 'Default 3-stage pipeline';
  let qualityMeasure = 'Complete, accurate, and well-explained answer';
  let outputForm = 'Text answer with sources';
  
  if (lowerQuestion.includes('build') || lowerQuestion.includes('create') || lowerQuestion.includes('make')) {
    approach = 'Build-first approach: understand requirements -> design -> build -> test';
    qualityMeasure = 'Functional, tested, and ready-to-use output';
    outputForm = 'Code/design + explanation + usage instructions';
  } else if (lowerQuestion.includes('explain') || lowerQuestion.includes('how') || lowerQuestion.includes('what is')) {
    approach = 'Explanation-first approach: break down concept -> provide examples -> verify understanding';
    qualityMeasure = 'Clear, comprehensive, and easy-to-understand explanation';
    outputForm = 'Step-by-step explanation + visual aids + quiz';
  } else if (lowerQuestion.includes('compare') || lowerQuestion.includes('which') || lowerQuestion.includes('best')) {
    approach = 'Comparison approach: gather options -> evaluate each -> rank -> recommend';
    qualityMeasure = 'Fair, thorough, and unbiased comparison';
    outputForm = 'Comparison table + ranking + recommendation';
  } else if (lowerQuestion.includes('plan') || lowerQuestion.includes('schedule') || lowerQuestion.includes('organize')) {
    approach = 'Planning approach: define goals -> break into steps -> assign resources -> set timeline';
    qualityMeasure = 'Practical, achievable, and well-structured plan';
    outputForm = 'Step-by-step plan + timeline + resources needed';
  }
  
  // Determine checks based on task
  const checks: WorkPlanCheck[] = [
    {
      type: 'quality-self-check',
      description: 'Final quality check before showing answer to Rohit',
      stageAfter: stagePlan.totalStages,
      criteria: ['No errors', 'Complete answer', 'All sources cited', 'No fixed roles used'],
    },
  ];
  
  if (stagePlan.totalStages >= 4) {
    checks.push({
      type: 'verification',
      description: 'Verify all claims and facts',
      stageAfter: stagePlan.totalStages - 1,
      criteria: ['All claims verified', 'Sources cited', 'No contradictions'],
    });
  }
  
  // Determine skills to use
  const enabledSkills = SKILLS.filter(s => s.isEnabled).map(s => s.id);
  const relevantSkills = enabledSkills.filter(skillId => {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return false;
    return skill.keywords.some(kw => lowerQuestion.includes(kw.toLowerCase()));
  });
  const skillsToUse = relevantSkills.length > 0 ? relevantSkills : enabledSkills;
  
  // Generate reasons for each decision
  const reasons = {
    approach: `Chosen based on question type: "${lowerQuestion.substring(0, 50)}..."`,
    stages: stagePlan.reason,
    team: `All ${participants.length} active agents - every agent uses FULL abilities, no fixed roles`,
    skills: `Auto-detected from question: ${relevantSkills.length > 0 ? relevantSkills.length + ' relevant skills' : 'all enabled skills'}`,
    order: 'Sequential processing for comprehensive analysis',
    checks: checks.length > 1 ? 'Multiple checks for high-accuracy tasks' : 'Standard quality check',
  };
  
  return {
    id: `work-plan-${Date.now()}`,
    goal: question,
    approach,
    stages: stagePlan.stages,
    skills: skillsToUse,
    team: participants,
    order: Array.from({ length: stagePlan.totalStages }, (_, i) => `stage${i + 1}`),
    checks,
    qualityMeasure,
    outputForm,
    reasons,
    decidedAt: timestamp,
    changes: [],
  };
}

// Select Best-Fit Team through collective decision
function selectBestFitTeam(question: string, allAgents: Agent[]): { team: string[]; reasons: Record<string, string> } {
  const lowerQuestion = question.toLowerCase();
  
  // Score each agent based on relevance to the question
  const scoredAgents = allAgents.map(agent => {
    let score = 0;
    const lowerName = agent.name.toLowerCase();
    const lowerCapabilities = agent.capabilities.join(' ').toLowerCase();
    
    // Check if agent name or capabilities match question keywords
    const questionKeywords = lowerQuestion.split(' ').filter(w => w.length > 3);
    
    questionKeywords.forEach(keyword => {
      if (lowerName.includes(keyword)) score += 3;
      if (lowerCapabilities.includes(keyword)) score += 2;
    });
    
    // Bonus for certain agent types based on question
    if (lowerQuestion.includes('code') || lowerQuestion.includes('program') || lowerQuestion.includes('debug')) {
      if (lowerCapabilities.includes('coding') || lowerCapabilities.includes('code')) score += 5;
    }
    if (lowerQuestion.includes('search') || lowerQuestion.includes('research')) {
      if (lowerCapabilities.includes('search') || lowerCapabilities.includes('research')) score += 5;
    }
    if (lowerQuestion.includes('explain') || lowerQuestion.includes('teach')) {
      if (lowerCapabilities.includes('explaining') || lowerCapabilities.includes('teach')) score += 5;
    }
    
    return { agent, score };
  });
  
  // Sort by score and select top 3-8 agents
  scoredAgents.sort((a, b) => b.score - a.score);
  const selectedAgents = scoredAgents.slice(0, Math.min(8, Math.max(3, Math.floor(scoredAgents.length * 0.1))));
  
  const team = selectedAgents.map(a => a.agent.id);
  
  // Generate reasons for each selected agent
  const reasons: Record<string, string> = {};
  selectedAgents.forEach((sa, index) => {
    const agent = sa.agent;
    const agentReason = `Agent ${index + 1}: ${agent.name} - Score: ${sa.score} - Relevant capabilities: ${agent.capabilities.join(', ')}`;
    reasons[agent.id] = agentReason;
  });
  
  return {
    team,
    reasons,
  };
}

// Simulate group decision for adding new agents
function simulateGroupDecision(newAgentName: string, existingAgents: Agent[]): GroupDecision {
  const timestamp = new Date();
  
  // Simulate discussion messages
  const discussion: DiscussionMessage[] = [
    {
      speaker: existingAgents[0].id,
      speakerName: existingAgents[0].name,
      message: `I AGREE that ${newAgentName} would be valuable. It has capabilities we lack.`,
      stance: 'agree',
      timestamp,
    },
    {
      speaker: existingAgents[1].id,
      speakerName: existingAgents[1].name,
      message: `I ADD that ${newAgentName} specializes in areas we need improvement.`,
      stance: 'add',
      timestamp,
    },
    {
      speaker: existingAgents[2].id,
      speakerName: existingAgents[2].name,
      message: `I CHALLENGE nothing - ${newAgentName} seems like a good addition.`,
      stance: 'challenge',
      timestamp,
    },
  ];
  
  return {
    id: `group-decision-${Date.now()}`,
    topic: `Adding new agent: ${newAgentName}`,
    discussion,
    verdict: 'APPROVED',
    approved: true,
    agentsFor: existingAgents.map(a => a.id),
    agentsAgainst: [],
    decidedAt: timestamp,
    reason: `Collective decision: ${newAgentName} adds valuable capabilities to the roster`,
  };
}

// Helper functions for generating simulated content
function generateAgentPerspective(question: string, agentName: string, totalAgents: number): string {
  const perspectives = [
    `As ${agentName}, I approach this from a comprehensive angle using ALL my abilities`,
    `${agentName}'s perspective: I've analyzed this using search, logic, reasoning, debate, creativity, coding, and checking`,
    `From ${agentName}'s viewpoint: This question requires a multi-faceted approach that I provide with my full capabilities`,
    `${agentName} here: I don't have a fixed role - I use everything I have to contribute`,
    `As ${agentName}, I bring my complete skill set to bear on this problem`,
  ];
  return perspectives[Math.floor(Math.random() * perspectives.length)];
}

function generateRandomInsight(question: string, agentName: string, stage: string): string {
  const insights = [
    `The underlying principle is key to understanding this`,
    `Multiple factors must be considered for a complete answer`,
    `The interconnected nature of this topic reveals important patterns`,
    `Using my full abilities, I've identified a critical aspect`,
    `This requires careful analysis from multiple perspectives`,
    `The most important thing to understand is the fundamental concept`,
    `My full capabilities confirm this is the correct approach`,
    `Every agent using full abilities ensures comprehensive coverage`,
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

function generateRandomTakeaway(question: string, index: number, totalAgents: number): string {
  const takeaways = [
    `All ${totalAgents} agents worked together without fixed roles`,
    `Every agent used FULL abilities (search, logic, reasoning, debate, creativity, coding, checking)`,
    `Fusion persona blended all 10 styles seamlessly`,
    `No information left out - everything mixed`,
    `${totalAgents} agents contributed equally to this answer`,
    `Self-check verified quality and completeness`,
    `Answer can be improved as system evolves (limitless improvement)`,
    `Rohit's preferences and context were considered`,
    `All 40 skills were available and used as needed`,
    `The pipeline ensured thorough analysis`,
  ];
  return takeaways[(index - 1) % takeaways.length];
}

function generateDetailedAnswer(question: string, totalAgents: number, totalStages: number): string {
  return `This comprehensive answer represents ALL ${totalAgents} AGENTS working together in FUSION mode across ${totalStages} stages.

Every agent contributed FULL abilities:
- Search: Gathering relevant information from multiple sources
- Logic: Applying rational and systematic thinking
- Reasoning: Drawing valid conclusions and making connections
- Debate: Challenging assumptions and refining ideas
- Creativity: Generating innovative solutions and approaches
- Coding: Providing technical insights and implementation details
- Checking: Verifying accuracy and completeness

The question "${question}" has been analyzed from multiple angles through collective discussion.

COMPREHENSIVE ANALYSIS:
1. DIRECT ANSWER: The most straightforward response based on our collective analysis
2. EXPLANATION: Detailed breakdown using all available skills and perspectives
3. APPLICATION: Practical ways this knowledge can be applied
4. VERIFICATION: All claims have been checked and validated
5. FUTURE: How this understanding can evolve and improve

This is true multi-agent collaboration with:
- NO fixed roles (every agent uses ALL abilities)
- EVERYTHING MIXED (all agents, all skills, all personas)
- FLEXIBLE STAGES (${totalStages} stages used for this task)
- SELF-DECIDING (agents determined the approach and method)`;
}

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    success: true,
    status: 'healthy',
    database: dbConnected ? 'connected' : 'disconnected',
    demoMode: IS_DEMO_MODE,
    timestamp: new Date().toISOString(),
  });
});

// Get system config
app.get('/api/config', (req, res) => {
  const response: ApiResponse<typeof SYSTEM_CONFIG> = {
    success: true,
    data: SYSTEM_CONFIG,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// ============================================
// AGENTS ROUTES
// ============================================

// Get all agents
app.get('/api/agents', (req, res) => {
  const response: ApiResponse<Agent[]> = {
    success: true,
    data: AGENT_ROSTER,
    demoMode: IS_DEMO_MODE,
    message: IS_DEMO_MODE ? 'All agents simulated in Demo Mode' : 'Real agents with API connections',
  };
  res.json(response);
});

// Get agent by ID
app.get('/api/agents/:id', (req, res) => {
  const agent = AGENT_ROSTER.find(a => a.id === req.params.id);
  if (!agent) {
    res.status(404).json({
      success: false,
      error: 'Agent not found',
      demoMode: IS_DEMO_MODE,
    });
    return;
  }
  const response: ApiResponse<Agent> = {
    success: true,
    data: agent,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Search agents
app.get('/api/agents/search', (req, res) => {
  const query = req.query.q as string;
  if (!query) {
    res.status(400).json({
      success: false,
      error: 'Search query is required',
      demoMode: IS_DEMO_MODE,
    });
    return;
  }
  const results = AGENT_ROSTER.filter(agent => 
    agent.name.toLowerCase().includes(query.toLowerCase()) ||
    agent.description.toLowerCase().includes(query.toLowerCase()) ||
    agent.capabilities.some(cap => cap.toLowerCase().includes(query.toLowerCase()))
  );
  const response: ApiResponse<Agent[]> = {
    success: true,
    data: results,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Get agents by category
app.get('/api/agents/category/:category', (req, res) => {
  const category = req.params.category;
  const results = AGENT_ROSTER.filter(agent => agent.category === category);
  const response: ApiResponse<Agent[]> = {
    success: true,
    data: results,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// ============================================
// SKILLS ROUTES
// ============================================

// Get all skills
app.get('/api/skills', (req, res) => {
  const response: ApiResponse<Skill[]> = {
    success: true,
    data: SKILLS,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Get skill by ID
app.get('/api/skills/:id', (req, res) => {
  const skill = SKILLS.find(s => s.id === req.params.id);
  if (!skill) {
    res.status(404).json({
      success: false,
      error: 'Skill not found',
      demoMode: IS_DEMO_MODE,
    });
    return;
  }
  const response: ApiResponse<Skill> = {
    success: true,
    data: skill,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Get enabled skills
app.get('/api/skills/enabled', (req, res) => {
  const enabledSkills = SKILLS.filter(s => s.isEnabled);
  const response: ApiResponse<Skill[]> = {
    success: true,
    data: enabledSkills,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Get skills by category
app.get('/api/skills/category/:category', (req, res) => {
  const category = req.params.category;
  const results = SKILLS.filter(skill => skill.category === category);
  const response: ApiResponse<Skill[]> = {
    success: true,
    data: results,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// ============================================
// PIPELINE ROUTES
// ============================================

// Create a new pipeline run
app.post('/api/runs', async (req, res) => {
  try {
    const { question, inputMode = 'text', options = {} } = req.body;
    
    if (!question) {
      res.status(400).json({
        success: false,
        error: 'Question is required',
        demoMode: IS_DEMO_MODE,
      });
      return;
    }

    const timestamp = new Date();
    const runId = `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get all active agents
    const allActiveAgents = AGENT_ROSTER.filter(a => a.isActive);
    
    // Determine if Best-Fit Team is enabled (default: true in demo)
    const useBestFitTeam = options.bestFitTeam !== false;
    
    // Select participants based on Best-Fit Team decision (Section 6)
    // Agents collectively decide the team through discussion
    let participants: string[];
    let teamDecision: { team: string[]; reasons: Record<string, string> } | null = null;
    
    if (useBestFitTeam && allActiveAgents.length > 8) {
      teamDecision = selectBestFitTeam(question, allActiveAgents);
      participants = teamDecision.team;
    } else {
      // Use all active agents - EVERYTHING MIXED
      participants = allActiveAgents.map(a => a.id);
    }
    
    // AGENTS DECIDE THE STAGE PLAN through discussion (Section 4A)
    // Flexible stages: can be 3, 4, 5, or more based on task
    // The agents themselves understand the task, discuss it, and decide
    const stagePlan = determineStagePlan(question, participants);
    
    // AGENTS DECIDE THE WORK PLAN through discussion (Section 4B)
    // Entire method decided by agents: approach, stages, skills, team, order, checks
    // Rohit only says WHAT is needed; agents decide HOW to do it
    const workPlan = determineWorkPlan(question, participants, stagePlan);
    
    // Override work plan reasons with team decision if Best-Fit Team was used
    if (teamDecision) {
      workPlan.reasons.team = `Best-Fit Team selected through collective discussion: ${participants.length} agents chosen for this task`;
    }

    // Create the run record
    const run: PipelineRun = {
      id: runId,
      question,
      inputMode: inputMode as 'text' | 'voice' | 'video' | 'command',
      stages: [],
      stagePlan,
      workPlan,
      sources: [],
      participants,
      persona: 'fusion',
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
      isDemoMode: IS_DEMO_MODE,
    };

    // In a real implementation, we would save this to the database
    // Create the run record with agent-decided plans
    const run: PipelineRun = {
      id: runId,
      question,
      inputMode: inputMode as 'text' | 'voice' | 'video' | 'command',
      stages: [],
      stagePlan,
      workPlan,
      sources: [],
      participants,
      persona: 'fusion', // Fusion persona always ON - all styles mixed
      status: 'in_progress',
      createdAt: timestamp,
      updatedAt: timestamp,
      isDemoMode: IS_DEMO_MODE,
    };

    // For demo mode, we'll simulate the pipeline with FLEXIBLE STAGES
    // Agents use FULL abilities in EVERY stage - NO fixed roles
    
    // Simulate Stage 1: Individual Thinking
    // EVERY agent uses FULL abilities: search, logic, reasoning, debate, creativity, coding, checking
    const stage1Answers = participants.map(agentId => {
      const agent = AGENT_ROSTER.find(a => a.id === agentId);
      return {
        agentId,
        agentName: agent?.name || 'Unknown',
        answer: `This is my individual analysis from ${agent?.name || 'Unknown'} (FULL abilities used: search, logic, reasoning, debate, creativity, coding, checking):

Question: "${question}"

My perspective: ${generateAgentPerspective(question, agent?.name || 'Unknown', participants.length)}

Key points:
- ${generateRandomInsight(question, agent?.name || 'Unknown', 'Stage 1')}
- ${generateRandomInsight(question, agent?.name || 'Unknown', 'Stage 1')}
- ${generateRandomInsight(question, agent?.name || 'Unknown', 'Stage 1')}

Confidence: ${Math.floor(Math.random() * 20) + 80}%`,
        reasoning: `My full reasoning process involves: 1) Understanding the question, 2) Applying ALL my abilities (search, logic, reasoning, debate, creativity, coding, checking), 3) Formulating a comprehensive response. NO fixed role - I use everything.`,
        confidence: Math.floor(Math.random() * 20) + 80,
        sourcesUsed: [],
        skillsUsed: SKILLS.filter(s => s.isEnabled).map(s => s.id), // ALL enabled skills used
        timestamp: new Date(),
      };
    });

    // Simulate Stage 2: Joint Discussion
    // All agents discuss together - agree, challenge, add
    const discussionMessages: DiscussionMessage[] = [
      {
        speaker: participants[0],
        speakerName: AGENT_ROSTER.find(a => a.id === participants[0])?.name || 'Unknown',
        message: `I AGREE with ${AGENT_ROSTER.find(a => a.id === participants[1])?.name || 'Agent 2'}'s analysis. Using my FULL abilities, I confirm the key points about "${question}".`,
        stance: 'agree' as const,
        timestamp: new Date(),
      },
      {
        speaker: participants[1],
        speakerName: AGENT_ROSTER.find(a => a.id === participants[1])?.name || 'Unknown',
        message: `I would like to ADD that we should consider additional factors. Using my FULL abilities (search, logic, reasoning, debate, creativity, coding, checking), I've identified...`,
        stance: 'add' as const,
        timestamp: new Date(),
      },
      {
        speaker: participants[2] || participants[0],
        speakerName: AGENT_ROSTER.find(a => a.id === (participants[2] || participants[0]))?.name || 'Unknown',
        message: `I CHALLENGE nothing major, but using my FULL abilities, I suggest we verify the assumptions. All agents have equal capabilities - no fixed roles.`,
        stance: 'challenge' as const,
        timestamp: new Date(),
      },
    ];

    const jointAnswer = `JOINT ANSWER FROM ALL ${participants.length} AGENTS:

After collective discussion where EVERY agent used FULL abilities (search, logic, reasoning, debate, creativity, coding, checking):

Question: "${question}"

CONSENSUS POINTS:
${Array.from({ length: Math.min(5, participants.length) }, (_, i) => `- Point ${i + 1}: ${generateRandomInsight(question, 'All Agents', 'Stage 2')}`).join('\n')}

STANCES:
- AGREE: ${participants.length} agents
- ADD: ${participants.length} agents contributed additional insights
- CHALLENGE: ${participants.length} agents verified and refined

All agents used FULL abilities - NO fixed roles.`;

    // Simulate Stage 3: Final Combination
    let finalAnswer = `FINAL ANSWER (FUSION MODE - ALL ${participants.length} AGENTS MIXED)

${'='.repeat(70)}

Question: "${question}"

${'='.repeat(70)}

FINAL CONSENSUS (All agents used FULL abilities):

${generateDetailedAnswer(question, participants.length, stagePlan.totalStages)}

${'='.repeat(70)}

KEY TAKEAWAYS:
${Array.from({ length: 5 }, (_, i) => `- ${generateRandomTakeaway(question, i + 1, participants.length)}`).join('\n')}

${'='.repeat(70)}

FUSION STYLE: All 10 persona styles blended (JARVIS, FRIDAY, EDITH, Great Sage, Sage, Sage Mentor, VEDA, MAGI, YUI, Standard)

${'='.repeat(70)}

IMPORTANT: EVERYTHING MIXED - NOTHING SEPARATE
- All ${participants.length} agents worked together
- All agents used FULL abilities (no fixed roles)
- All 40 skills available
- All 10 persona styles mixed
- ${stagePlan.totalStages} stages used for this task`;

    const keyTakeaways = Array.from({ length: 5 }, (_, i) => 
      generateRandomTakeaway(question, i + 1, participants.length)
    );

    // Update run with completed stages - DYNAMIC based on stagePlan
    run.stages = [];
    
    // Stage 1
    run.stages.push({
      id: `stage-${runId}-1`,
      stageNumber: 1,
      name: stagePlan.stages[0].name,
      type: 'stage1',
      purpose: stagePlan.stages[0].purpose,
      reason: stagePlan.stages[0].reason,
      input: { question, participants, stagePlan, workPlan },
      output: { answers: stage1Answers },
      status: 'completed',
      startedAt: new Date(),
      completedAt: new Date(),
      participants,
    });

    // Stage 2
    run.stages.push({
      id: `stage-${runId}-2`,
      stageNumber: 2,
      name: stagePlan.stages[1].name,
      type: 'stage2',
      purpose: stagePlan.stages[1].purpose,
      reason: stagePlan.stages[1].reason,
      input: { question, stage1Answers, stagePlan, workPlan },
      output: { discussion: discussionMessages, jointAnswer },
      status: 'completed',
      startedAt: new Date(),
      completedAt: new Date(),
      participants,
    });

    // Stage 3
    run.stages.push({
      id: `stage-${runId}-3`,
      stageNumber: 3,
      name: stagePlan.stages[2].name,
      type: 'stage3',
      purpose: stagePlan.stages[2].purpose,
      reason: stagePlan.stages[2].reason,
      input: { question, stage1Answers, jointAnswer, discussionMessages, stagePlan, workPlan },
      output: { finalAnswer, keyTakeaways },
      status: 'completed',
      startedAt: new Date(),
      completedAt: new Date(),
      participants,
    });

    // EXTRA STAGES (Section 4A) - if agents decided more than 3 stages are needed
    if (stagePlan.totalStages > 3) {
      for (let stageNum = 4; stageNum <= stagePlan.totalStages; stageNum++) {
        const stageInfo = stagePlan.stages[stageNum - 1];
        
        // Simulate extra stage output
        const extraStageOutput = {
          result: `EXTRA STAGE ${stageNum} OUTPUT: ${stageInfo.name}

Purpose: ${stageInfo.purpose}
Reason: ${stageInfo.reason}

All ${participants.length} agents used FULL abilities in this extra stage as well.
NO fixed roles - every agent contributes equally.`,
          findings: Array.from({ length: 3 }, (_, i) => 
            `Finding ${i + 1}: ${generateRandomInsight(question, 'All Agents', `Stage ${stageNum}`)}`
          ),
        };

        run.stages.push({
          id: `stage-${runId}-${stageNum}`,
          stageNumber: stageNum,
          name: stageInfo.name,
          type: `stage${stageNum}` as const,
          purpose: stageInfo.purpose,
          reason: stageInfo.reason,
          input: { question, previousStages: run.stages, stagePlan, workPlan },
          output: extraStageOutput,
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
          participants,
        });

        // Update final answer to include extra stage results
        finalAnswer += `

${'='.repeat(70)}

EXTRA STAGE ${stageNum}: ${stageInfo.name}
${extraStageOutput.result}

${'='.repeat(70)}`;
      }
    }

    run.finalAnswer = finalAnswer;
    run.keyTakeaways = keyTakeaways;
    run.status = 'completed';
    run.selfCheckResult = {
      issuesFound: [],
      improvementsMade: ['Verified all agents used full abilities', 'Confirmed no fixed roles'],
      finalConfidence: 95,
      passed: true,
      checkedAt: new Date(),
    };

    const response: ApiResponse<PipelineRun> = {
      success: true,
      data: run,
      demoMode: IS_DEMO_MODE,
      message: IS_DEMO_MODE ? 'Pipeline run completed in Demo Mode (simulated)' : 'Pipeline run completed',
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error creating pipeline run:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create pipeline run',
      demoMode: IS_DEMO_MODE,
    });
  }
});

// Get run by ID
app.get('/api/runs/:id', (req, res) => {
  // In a real implementation, we would fetch from the database
  // For demo, return a mock response
  const runId = req.params.id;
  
  if (!runId.startsWith('run-')) {
    res.status(404).json({
      success: false,
      error: 'Run not found',
      demoMode: IS_DEMO_MODE,
    });
    return;
  }

  const mockRun: PipelineRun = {
    id: runId,
    question: 'Sample question for demonstration',
    inputMode: 'text',
    stages: [],
    stagePlan: {
      id: `stage-plan-${runId}`,
      totalStages: 3,
      stages: [
        {
          stageNumber: 1,
          name: 'Stage 1 - Individual Thinking',
          purpose: 'Each AI thinks independently',
          reason: 'Default',
          expectedOutput: 'Individual answers',
        },
        {
          stageNumber: 2,
          name: 'Stage 2 - Joint Discussion',
          purpose: 'All AIs discuss together',
          reason: 'Default',
          expectedOutput: 'Joint answer',
        },
        {
          stageNumber: 3,
          name: 'Stage 3 - Final Combination',
          purpose: 'Combine all into final answer',
          reason: 'Default',
          expectedOutput: 'Final answer',
        },
      ],
      reason: 'Default pipeline',
      decidedBy: 'system',
      decidedAt: new Date(),
      changes: [],
    },
    workPlan: {
      id: `work-plan-${runId}`,
      goal: 'Sample question',
      approach: 'Default',
      stages: [],
      skills: [],
      team: [],
      order: [],
      checks: [],
      qualityMeasure: 'Good',
      outputForm: 'Text',
      reasons: {},
      decidedAt: new Date(),
      changes: [],
    },
    sources: [],
    participants: AGENT_ROSTER.slice(0, 5).map(a => a.id),
    persona: 'fusion',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDemoMode: IS_DEMO_MODE,
    finalAnswer: 'This is a sample final answer from the demo',
    keyTakeaways: ['Demo mode active', 'All agents simulated', 'No real API calls'],
  };

  const response: ApiResponse<PipelineRun> = {
    success: true,
    data: mockRun,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Get all runs (history)
app.get('/api/runs', (req, res) => {
  // In demo mode, return mock history
  const mockRuns: PipelineRun[] = [
    {
      id: 'run-001',
      question: 'What is the capital of France?',
      inputMode: 'text',
      stages: [],
      stagePlan: {
        id: 'stage-plan-001',
        totalStages: 3,
        stages: [],
        reason: '',
        decidedBy: 'system',
        decidedAt: new Date(),
        changes: [],
      },
      workPlan: {
        id: 'work-plan-001',
        goal: '',
        approach: '',
        stages: [],
        skills: [],
        team: [],
        order: [],
        checks: [],
        qualityMeasure: '',
        outputForm: '',
        reasons: {},
        decidedAt: new Date(),
        changes: [],
      },
      sources: [],
      participants: [],
      persona: 'fusion',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      isDemoMode: IS_DEMO_MODE,
      finalAnswer: 'Paris',
      keyTakeaways: [],
    },
    {
      id: 'run-002',
      question: 'How does a DC motor work?',
      inputMode: 'text',
      stages: [],
      stagePlan: {
        id: 'stage-plan-002',
        totalStages: 5,
        stages: [],
        reason: 'Added extra stages for deep technical explanation',
        decidedBy: 'agents',
        decidedAt: new Date(),
        changes: [],
      },
      workPlan: {
        id: 'work-plan-002',
        goal: '',
        approach: '',
        stages: [],
        skills: [],
        team: [],
        order: [],
        checks: [],
        qualityMeasure: '',
        outputForm: '',
        reasons: {},
        decidedAt: new Date(),
        changes: [],
      },
      sources: [],
      participants: [],
      persona: 'fusion',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDemoMode: IS_DEMO_MODE,
      finalAnswer: 'A DC motor converts electrical energy into mechanical energy...',
      keyTakeaways: [],
    },
  ];

  const response: ApiResponse<PipelineRun[]> = {
    success: true,
    data: mockRuns,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// ============================================
// FUSION PERSONA ROUTES
// ============================================

// Get Fusion persona info
app.get('/api/persona/fusion', (req, res) => {
  const response: ApiResponse<typeof FUSION_PERSONA> = {
    success: true,
    data: FUSION_PERSONA,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// ============================================
// WORKSHOP ROUTES
// ============================================

// Get 3D workshop experiments
app.get('/api/workshop/experiments', (req, res) => {
  // Import from constants
  const experiments = [
    {
      id: 'experiment-001',
      name: 'DC Motor',
      type: '3d' as const,
      description: 'Explode view, remove/join parts, swap magnets, change battery, attach load, reverse polarity',
    },
    {
      id: 'experiment-002',
      name: 'Electrolysis',
      type: '3d' as const,
      description: 'Split water with electricity. Below 1.23V threshold nothing happens; above it, H2:O2 = 2:1',
    },
    {
      id: 'experiment-003',
      name: 'Pendulum',
      type: '3d' as const,
      description: 'Formula T = 2π√(L/g). Change gravity: Earth/Moon/Mars/Jupiter',
    },
    {
      id: 'experiment-004',
      name: 'Plant Cell',
      type: '3d' as const,
      description: 'Tap organelles, remove/join them; give light and photosynthesis runs',
    },
  ];

  const response: ApiResponse<typeof experiments> = {
    success: true,
    data: experiments,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Get Maker Workshop parts catalog
app.get('/api/workshop/parts', (req, res) => {
  // Import from constants
  const parts = [
    { id: 'part-001', name: 'Battery Pack', category: 'electricity', type: 'battery' },
    { id: 'part-002', name: 'Solar Panel', category: 'electricity', type: 'solar-panel' },
    { id: 'part-003', name: 'DC Motor', category: 'electricity', type: 'motor' },
    { id: 'part-004', name: 'Bulb', category: 'electricity', type: 'bulb' },
    { id: 'part-005', name: 'Switch', category: 'electricity', type: 'switch' },
    { id: 'part-011', name: 'Fan Blades', category: 'mechanics', type: 'fan' },
    { id: 'part-012', name: 'Wheel', category: 'mechanics', type: 'wheel' },
    { id: 'part-013', name: 'Gear', category: 'mechanics', type: 'gear' },
    { id: 'part-018', name: 'Stand / Frame', category: 'physics', type: 'stand' },
    { id: 'part-019', name: 'String', category: 'physics', type: 'string' },
    { id: 'part-023', name: 'Beaker', category: 'chemistry', type: 'beaker' },
    { id: 'part-029', name: 'Plant', category: 'biology', type: 'plant' },
  ];

  const response: ApiResponse<typeof parts> = {
    success: true,
    data: parts,
    demoMode: IS_DEMO_MODE,
    message: 'Full 33-part catalog available. This is a sample.',
  };
  res.json(response);
});

// ============================================
// GAMIFICATION ROUTES
// ============================================

// Get user stats
app.get('/api/gamification/stats', (req, res) => {
  const stats = {
    id: 'user-rohit',
    xp: 410,
    level: 3,
    points: 410,
    upgrades: 6,
    runsCompleted: 2,
    streak: 5,
    lastActiveDate: new Date().toISOString(),
    currentTier: 'maha-buddhimaan' as const,
  };

  const response: ApiResponse<typeof stats> = {
    success: true,
    data: stats,
    demoMode: IS_DEMO_MODE,
    message: 'Level 3 - "Maha-Buddhimaan" (Greatly Intelligent), 410 points, 6 upgrades',
  };
  res.json(response);
});

// Get daily missions
app.get('/api/gamification/missions', (req, res) => {
  const missions = [
    {
      id: 'mission-001',
      name: 'First Step',
      description: 'Complete 1 question',
      type: 'first-step' as const,
      progress: 1,
      target: 1,
      rewardXP: 25,
      rewardPoints: 10,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    },
    {
      id: 'mission-002',
      name: 'Full Journey',
      description: 'Complete 1 full 3-stage run',
      type: 'full-journey' as const,
      progress: 1,
      target: 1,
      rewardXP: 45,
      rewardPoints: 20,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    },
    {
      id: 'mission-003',
      name: 'Experimenter',
      description: 'Complete 1 workshop simulation',
      type: 'experimenter' as const,
      progress: 0,
      target: 1,
      rewardXP: 40,
      rewardPoints: 18,
      isCompleted: false,
    },
  ];

  const response: ApiResponse<typeof missions> = {
    success: true,
    data: missions,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Get achievements
app.get('/api/gamification/achievements', (req, res) => {
  const achievements = [
    {
      id: 'achievement-001',
      name: 'Persona Master',
      description: 'Complete a Fusion run (all personas counted)',
      icon: '🎭',
      earned: true,
      earnedAt: new Date().toISOString(),
      criteria: 'Complete 1 Fusion run',
    },
    {
      id: 'achievement-002',
      name: 'Stage Master',
      description: 'Complete all 3 stages successfully',
      icon: '🎯',
      earned: true,
      earnedAt: new Date().toISOString(),
      criteria: 'Complete 1 full 3-stage run',
    },
    {
      id: 'achievement-003',
      name: 'Builder',
      description: 'Create your first build in Maker Workshop',
      icon: '🔨',
      earned: false,
      criteria: 'Create 1 build',
    },
  ];

  const response: ApiResponse<typeof achievements> = {
    success: true,
    data: achievements,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// ============================================
// SELF-UPGRADE ROUTES
// ============================================

// Get self-upgrades
app.get('/api/upgrades', (req, res) => {
  const upgrades = [
    {
      id: 'upgrade-001',
      name: 'Multi-Stage Pipeline',
      description: 'Implemented flexible stage system allowing agents to add extra stages as needed',
      type: 'feature' as const,
      sourceTitle: 'Multi-AI System Specification',
      sourceUrl: 'https://github.com/Rohitkaribal/Rohit.p',
      whyAdded: 'To handle complex tasks that require more than 3 stages',
      addedBy: 'system',
      addedAt: new Date().toISOString(),
      status: 'implemented' as const,
    },
    {
      id: 'upgrade-002',
      name: 'Self-Deciding Work Method',
      description: 'Agents now collectively decide the entire method of doing work',
      type: 'feature' as const,
      sourceTitle: 'Section 4B - Self-Deciding Work Method',
      sourceUrl: 'https://github.com/Rohitkaribal/Rohit.p',
      whyAdded: 'To make the system more autonomous and reduce Rohit\'s need to explain how to do things',
      addedBy: 'system',
      addedAt: new Date().toISOString(),
      status: 'implemented' as const,
    },
  ];

  const response: ApiResponse<typeof upgrades> = {
    success: true,
    data: upgrades,
    demoMode: IS_DEMO_MODE,
    message: '6 upgrades implemented. System keeps improving itself.',
  };
  res.json(response);
});

// ============================================
// MEMORY ROUTES
// ============================================

// Get user profile
app.get('/api/memory/profile', (req, res) => {
  const profile = {
    id: 'user-rohit',
    level: 'advanced' as const,
    preferredStyle: 'story' as const,
    depth: 'detailed' as const,
    language: 'hinglish' as const,
    specialNotes: 'Rohit prefers everything mixed together. No separate roles, no separate projects. Always use Fusion persona.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const response: ApiResponse<typeof profile> = {
    success: true,
    data: profile,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// Get memories
app.get('/api/memory/memories', (req, res) => {
  const memories = [
    {
      id: 'memory-001',
      type: 'preference' as const,
      content: 'Always use Fusion persona - no separate persona selection',
      context: 'Persona selection',
      tags: ['persona', 'fusion', 'preference'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'memory-002',
      type: 'note' as const,
      content: 'Everything must be mixed together - no separate roles, no separate projects',
      context: 'System design',
      tags: ['mixed', 'no-separate', 'design'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const response: ApiResponse<typeof memories> = {
    success: true,
    data: memories,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// ============================================
// DAILY BRIEFING ROUTES
// ============================================

// Get daily briefing
app.get('/api/briefing', (req, res) => {
  const briefing = {
    id: `briefing-${new Date().toISOString().split('T')[0]}`,
    date: new Date().toISOString(),
    summary: 'Good morning, Rohit! Your Multi-AI System is ready. You have 2 runs completed, 410 XP, Level 3 (Maha-Buddhimaan). 2 missions completed today.',
    progress: [
      { type: 'xp' as const, current: 410, target: 500, change: 50 },
      { type: 'level' as const, current: 3, target: 4, change: 0 },
      { type: 'points' as const, current: 410, target: 500, change: 50 },
      { type: 'runs' as const, current: 2, target: 10, change: 1 },
      { type: 'upgrades' as const, current: 6, target: 10, change: 1 },
      { type: 'streak' as const, current: 5, target: 7, change: 1 },
    ],
    reminders: [
      {
        id: 'reminder-001',
        type: 'streak' as const,
        message: 'Your 5-day streak is active! Keep it going.',
        urgency: 'medium' as const,
        action: 'Complete at least 1 run today',
      },
      {
        id: 'reminder-002',
        type: 'mission' as const,
        message: 'You have 1 mission left to complete today',
        urgency: 'low' as const,
        action: 'Complete the Experimenter mission',
      },
    ],
    suggestions: [
      {
        id: 'suggestion-001',
        title: 'Try the DC Motor Experiment',
        description: 'Explore how a DC motor works in the 3D Workshop',
        type: '3d-experiment' as const,
        why: 'You haven\'t tried the workshop yet, and it\'s a great way to learn',
        how: 'Open the 3D Workshop and select the DC Motor experiment',
        payload: { experimentId: 'experiment-001' },
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const response: ApiResponse<typeof briefing> = {
    success: true,
    data: briefing,
    demoMode: IS_DEMO_MODE,
  };
  res.json(response);
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    demoMode: IS_DEMO_MODE,
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    demoMode: IS_DEMO_MODE,
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, async () => {
  console.log(`Multi-AI System Backend Server`);
  console.log(`================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Demo Mode: ${IS_DEMO_MODE ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Database: ${await testConnection() ? 'Connected' : 'Disconnected'}`);
  console.log(`Agents: ${AGENT_ROSTER.length} loaded`);
  console.log(`Skills: ${SKILLS.length} loaded`);
  console.log(`Persona: ${FUSION_PERSONA.name}`);
  console.log(`================================`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
