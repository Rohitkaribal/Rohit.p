// ============================================
// MULTI-AI SYSTEM - CORE TYPES
// Everything Mixed - Nothing Separate
// ============================================

// ============================================
// AGENT TYPES
// ============================================

export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  capabilities: string[];
  isActive: boolean;
  createdAt: Date;
}

export type AgentCategory = 
  | 'foundation'
  | 'agent-computer-use'
  | 'agent-frameworks'
  | 'automation'
  | 'duet-variants'
  | 'agentic-platforms'
  | 'ai-assistants'
  | 'agent-bots'
  | 'agi-asi-research';

// ============================================
// PIPELINE TYPES
// ============================================

export type StageType = 'stage1' | 'stage2' | 'stage3' | 'extra';

export interface Stage {
  id: string;
  stageNumber: number;
  name: string;
  type: StageType;
  purpose: string;
  reason: string;
  input: any;
  output: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  participants: string[]; // Agent IDs
}

export interface PipelineRun {
  id: string;
  question: string;
  inputMode: 'text' | 'voice' | 'video' | 'command';
  stages: Stage[];
  stagePlan: StagePlan;
  workPlan: WorkPlan;
  sources: Source[];
  participants: string[]; // All agent IDs involved
  persona: 'fusion' | string; // Fusion is default
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  selfCheckResult?: SelfCheckResult;
  finalAnswer?: string;
  keyTakeaways?: string[];
  markedObjects?: MarkedObject[]; // For video mode
  visualFrameKey?: string; // For video/whiteboard
  isDemoMode: boolean;
}

export interface StagePlan {
  id: string;
  totalStages: number;
  stages: StageDefinition[];
  reason: string;
  decidedBy: string; // 'agents' or 'user'
  decidedAt: Date;
  changes: PlanChange[];
}

export interface StageDefinition {
  stageNumber: number;
  name: string;
  purpose: string;
  reason: string;
  expectedOutput: string;
}

export interface PlanChange {
  changedAt: Date;
  whatChanged: string;
  reason: string;
  by: string;
}

export interface WorkPlan {
  id: string;
  goal: string;
  approach: string;
  stages: StageDefinition[];
  skills: string[]; // Skill IDs
  team: string[]; // Agent IDs
  order: string[]; // Order of operations
  checks: CheckDefinition[];
  qualityMeasure: string;
  outputForm: string;
  reasons: Record<string, string>; // Decision reasons
  decidedAt: Date;
  changes: PlanChange[];
}

export interface CheckDefinition {
  type: 'fact-check' | 'verification' | 'test' | 'review' | 'real-life-check';
  description: string;
  stageAfter: number; // After which stage
  criteria: string[];
}

// ============================================
// STAGE OUTPUTS
// ============================================

export interface Stage1Output {
  agentId: string;
  agentName: string;
  answer: string;
  reasoning: string;
  confidence: number; // 0-100
  sourcesUsed: string[]; // Source IDs
  skillsUsed: string[]; // Skill IDs
  timestamp: Date;
}

export interface Stage2Output {
  discussion: DiscussionMessage[];
  jointAnswer: string;
  keyPoints: string[];
  consensusScore: number; // 0-100
  unresolvedIssues: string[];
}

export interface DiscussionMessage {
  speaker: string; // Agent ID
  speakerName: string;
  message: string;
  stance: 'agree' | 'challenge' | 'add' | 'question' | 'clarify';
  timestamp: Date;
  references?: string[]; // Stage1 answer IDs
}

export interface Stage3Output {
  finalAnswer: string;
  keyTakeaways: string[];
  combinedReasoning: string;
  confidence: number;
  markedObjects?: MarkedObject[]; // For video mode
}

export interface SelfCheckResult {
  issuesFound: CheckIssue[];
  improvementsMade: string[];
  finalConfidence: number;
  passed: boolean;
  checkedAt: Date;
}

export interface CheckIssue {
  type: 'error' | 'gap' | 'contradiction' | 'improvement';
  description: string;
  severity: 'low' | 'medium' | 'high';
  location: string; // Which stage/part
  fix: string;
}

// ============================================
// SOURCE TYPES
// ============================================

export interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  provider: string;
  retrievedAt: Date;
  relevance: number; // 0-100
}

// ============================================
// VIDEO/IMAGE TYPES
// ============================================

export interface MarkedObject {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z?: number };
  dimensions: { width: number; height: number; depth?: number };
  confidence: number;
  description: string;
  color: string; // For UI marking
}

export interface VisualFrame {
  id: string;
  imageData: string; // Base64 or URL
  objects: MarkedObject[];
  timestamp: Date;
  source: 'camera' | 'upload' | 'screenshot';
}

// ============================================
// SKILL TYPES
// ============================================

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  keywords: string[];
  isEnabled: boolean;
  isBuiltIn: boolean;
  createdAt: Date;
  createdBy?: string; // Agent ID if auto-created
  buildSteps?: string[]; // For self-developed skills
}

export type SkillCategory = 
  | 'coding'
  | 'image-creation'
  | 'video-explainer'
  | 'podcast-audio'
  | 'explaining'
  | 'writing'
  | 'planning'
  | 'web-research'
  | 'data-analysis'
  | 'maths-logic'
  | 'language-translation'
  | 'finance-budgeting'
  | 'health-routine'
  | 'study-exam'
  | 'game-making'
  | 'music-creativity'
  | 'everyday-help'
  | 'software-development'
  | 'app-development'
  | 'web-development'
  | 'software-maintenance'
  | 'engineering-design'
  | 'debugging-testing'
  | 'self-learning'
  | 'self-improvement'
  | 'quality-self-check'
  | 'creative-problem-solving'
  | 'goal-tracking'
  | 'personalisation'
  | 'efficient-working'
  | 'connect-operate'
  | 'website-login';

// ============================================
// PERSONA/FUSION TYPES
// ============================================

export type PersonaStyle = 
  | 'standard'
  | 'jarvis'
  | 'friday'
  | 'edith'
  | 'great-sage'
  | 'sage'
  | 'sage-mentor'
  | 'veda'
  | 'magi'
  | 'yui';

export interface FusionPersona {
  id: string;
  name: 'fusion';
  styles: PersonaStyle[];
  description: string;
  // Fusion means all styles are mixed
  // No separate persona selection
}

// ============================================
// MEMORY & LEARNING TYPES
// ============================================

export interface UserProfile {
  id: string;
  level: 'beginner' | 'medium' | 'advanced';
  preferredStyle: 'story' | 'analogy' | 'steps' | 'quiz' | 'simple' | 'detailed';
  depth: 'simple' | 'detailed';
  language: 'english' | 'hinglish' | 'hindi';
  specialNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MemoryType = 'preference' | 'fact' | 'style' | 'note';

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  context: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Correction {
  id: string;
  originalAnswer: string;
  correctedAnswer: string;
  issue: string;
  correction: string;
  appliedToAll: boolean;
  createdAt: Date;
}

export interface LearningContext {
  profile: UserProfile;
  recentFeedback: Correction[];
  enabledSkills: Skill[];
  recentMemories: Memory[];
  recentTasks: PipelineRun[];
}

// ============================================
// GAMIFICATION TYPES
// ============================================

export interface UserStats {
  id: string;
  xp: number;
  level: number;
  points: number; // Separate from XP for evolution
  upgrades: number;
  runsCompleted: number;
  streak: number;
  lastActiveDate: Date;
  createdAt: Date;
}

export type EvolutionTier = 
  | 'sahayak' // Helper
  | 'buddhimaan' // Intelligent
  | 'maha-buddhimaan' // Greatly Intelligent
  | 'asi-candidate' // ASI Candidate
  | 'asi' // Artificial Superintelligence
  | 'transcendent' // Beyond ASI
  | 'omega' // Omega Level
  | 'absolute' // Absolute
  | 'supreme'; // Supreme

export interface EvolutionProgress {
  currentTier: EvolutionTier;
  nextTier: EvolutionTier;
  currentPoints: number;
  pointsForNextTier: number;
  progressPercent: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  criteria: string;
}

export interface DailyMission {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  progress: number;
  target: number;
  rewardXP: number;
  rewardPoints: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export type MissionType = 
  | 'first-step' // 1 question
  | 'full-journey' // 1 full 3-stage run
  | 'new-style' // 1 Fusion run
  | 'experimenter' // 1 workshop sim
  | 'skill-builder' // 1 new skill
  | 'group-decision' // 1 group decision
  | 'deep-thought' // 1 follow-up
  | 'see-the-world'; // 1 voice/video run

export interface Streak {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  isActive: boolean;
}

// ============================================
// SELF-IMPROVEMENT TYPES
// ============================================

export interface SelfUpgrade {
  id: string;
  name: string;
  description: string;
  type: 'skill' | 'agent' | 'feature' | 'improvement';
  sourceTitle: string;
  sourceUrl: string;
  whyAdded: string;
  addedBy: string; // Agent ID or 'user'
  addedAt: Date;
  status: 'pending' | 'implemented' | 'failed';
  implementationSteps?: string[];
}

export interface UpgradeLog {
  id: string;
  upgrades: SelfUpgrade[];
  lastChecked: Date;
  nextCheck: Date;
}

// ============================================
// WORKSHOP TYPES
// ============================================

export type WorkshopType = '3d' | 'maker';

export interface WorkshopExperiment {
  id: string;
  name: string;
  type: WorkshopType;
  description: string;
  parts: ExperimentPart[];
  steps: ExperimentStep[];
  formulas: string[];
  simulationRules: string[];
}

export interface ExperimentPart {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  properties: Record<string, any>;
}

export interface ExperimentStep {
  id: string;
  name: string;
  description: string;
  action: string;
  expectedResult: string;
  order: number;
}

export interface MakerBuild {
  id: string;
  name: string;
  description: string;
  parts: MakerPart[];
  connections: BuildConnection[];
  switches: BuildSwitch[];
  state: BuildState;
  createdAt: Date;
  updatedAt: Date;
}

export interface MakerPart {
  id: string;
  catalogId: string; // From 33-part catalog
  name: string;
  type: string;
  category: 'electricity' | 'mechanics' | 'physics' | 'chemistry' | 'biology';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  properties: Record<string, any>;
}

export interface BuildConnection {
  id: string;
  fromPartId: string;
  toPartId: string;
  type: 'wire' | 'pipe' | 'string' | 'belt' | 'mechanical';
  createdAt: Date;
}

export interface BuildSwitch {
  id: string;
  partId: string;
  name: string;
  state: 'on' | 'off';
  type: 'sun' | 'wind' | 'crank' | 'power' | 'water';
}

export interface BuildState {
  simulationResult: SimulationResult;
  review: BuildReview;
  isWorking: boolean;
  faults: BuildFault[];
}

export interface SimulationResult {
  counters: Record<string, number>;
  animations: SimulationAnimation[];
  physics: Record<string, any>;
}

export interface SimulationAnimation {
  partId: string;
  type: 'rotate' | 'move' | 'scale' | 'color-change';
  parameters: Record<string, any>;
}

export interface BuildReview {
  overallRating: number; // 0-100
  feedback: string;
  suggestions: string[];
  willWork: boolean;
  willHalfWork: boolean;
  willNotWork: boolean;
}

export interface BuildFault {
  id: string;
  partId: string;
  connectionId?: string;
  type: 'missing' | 'wrong-connection' | 'wrong-part' | 'physics-error';
  description: string;
  severity: 'low' | 'medium' | 'high';
  fix: string;
}

// ============================================
// DEVICE CONTROL TYPES
// ============================================

export interface DeviceTask {
  id: string;
  name: string;
  description: string;
  steps: DeviceStep[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  isSensitive: boolean;
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface DeviceStep {
  id: string;
  order: number;
  action: string;
  description: string;
  command?: string;
  target?: string; // App, website, file, etc.
  parameters?: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  log?: string;
  error?: string;
  isSensitive: boolean;
  requiresApproval: boolean;
}

// ============================================
// PROACTIVE SUGGESTION TYPES
// ============================================

export interface ProactiveSuggestion {
  id: string;
  title: string;
  description: string;
  type: SuggestionType;
  why: string; // Reason connected to Rohit
  how: string; // How it will work
  payload: any; // Ready payload to execute
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  createdAt: Date;
  executedAt?: Date;
}

export type SuggestionType = 
  | 'build'
  | '3d-experiment'
  | 'study-lesson'
  | 'voice-question'
  | 'video-analysis'
  | 'coding'
  | 'skill-development'
  | 'routine';

// ============================================
// PLANNER & GOAL TYPES
// ============================================

export interface Plan {
  id: string;
  name: string;
  description: string;
  tasks: PlanTask[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface PlanTask {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dependencies: string[]; // Other task IDs
  assignee?: string; // Agent ID
  startedAt?: Date;
  completedAt?: Date;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  target: string;
  current: string;
  unit: string;
  targetValue: number;
  currentValue: number;
  startDate: Date;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  logs: GoalLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalLog {
  id: string;
  value: number;
  note: string;
  loggedAt: Date;
}

// ============================================
// DAILY BRIEFING TYPES
// ============================================

export interface DailyBriefing {
  id: string;
  date: Date;
  summary: string;
  progress: BriefingProgress[];
  reminders: BriefingReminder[];
  suggestions: ProactiveSuggestion[];
  createdAt: Date;
}

export interface BriefingProgress {
  type: 'xp' | 'level' | 'points' | 'runs' | 'upgrades' | 'streak';
  current: number;
  target?: number;
  change: number; // Since last briefing
}

export interface BriefingReminder {
  id: string;
  type: 'streak' | 'mission' | 'goal' | 'upgrade';
  message: string;
  urgency: 'low' | 'medium' | 'high';
  action?: string;
}

// ============================================
// GROUP DECISION TYPES
// ============================================

export interface GroupDecision {
  id: string;
  topic: string;
  description: string;
  type: DecisionType;
  messages: DecisionMessage[];
  verdict: DecisionVerdict;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

export type DecisionType = 
  | 'add-agent'
  | 'add-skill'
  | 'extra-stage'
  | 'work-plan'
  | 'team-selection';

export interface DecisionMessage {
  speaker: string; // Agent ID
  speakerName: string;
  message: string;
  stance: 'support' | 'oppose' | 'neutral' | 'question';
  timestamp: Date;
}

export interface DecisionVerdict {
  decision: string;
  chosenOptions: string[];
  reason: string;
  decidedAt: Date;
  decidedBy: string[]; // Agent IDs
}

// ============================================
// BEST-FIT TEAM TYPES
// ============================================

export interface TaskTeam {
  id: string;
  taskId: string; // PipelineRun ID
  agents: TeamAgent[];
  reason: string;
  selectedAt: Date;
  selectedBy: string; // 'agents' or 'user'
}

export interface TeamAgent {
  agentId: string;
  reason: string;
  confidence: number; // 0-100
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  demoMode?: boolean;
}

export interface ApiRequest {
  userId?: string;
  demoMode?: boolean;
}

// ============================================
// SYSTEM CONFIGURATION
// ============================================

export interface SystemConfig {
  id: string;
  name: string;
  version: string;
  demoMode: boolean;
  maxAgents: number; // 105 in full mode
  maxSkills: number; // 40
  maxStages: number; // No fixed cap, but default for UI
  defaultPersona: string; // 'fusion'
  features: SystemFeature[];
}

export interface SystemFeature {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}
