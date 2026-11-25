// ============================================
// MULTI-AI SYSTEM - DATABASE SCHEMA
// Everything Mixed - Nothing Separate
// ============================================

import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  boolean,
  jsonb,
  uuid,
  varchar,
  real,
} from 'drizzle-orm/pg-core';

// ============================================
// AGENTS TABLE
// ============================================

export const agents = pgTable('agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  capabilities: jsonb('capabilities').notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// SKILLS TABLE
// ============================================

export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  keywords: jsonb('keywords').notNull().default([]),
  isEnabled: boolean('is_enabled').notNull().default(true),
  isBuiltIn: boolean('is_builtin').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  createdBy: text('created_by'),
  buildSteps: jsonb('build_steps').default([]),
});

// ============================================
// PIPELINE RUNS TABLE
// ============================================

export const runs = pgTable('runs', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  inputMode: text('input_mode').notNull().$type<'text' | 'voice' | 'video' | 'command'>(),
  stages: jsonb('stages').notNull().default([]),
  stagePlan: jsonb('stage_plan').notNull(),
  workPlan: jsonb('work_plan').notNull(),
  sources: jsonb('sources').notNull().default([]),
  participants: jsonb('participants').notNull().default([]),
  persona: text('persona').notNull().default('fusion'),
  status: text('status').notNull().$type<'pending' | 'in_progress' | 'completed' | 'failed'>(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  selfCheckResult: jsonb('self_check_result'),
  finalAnswer: text('final_answer'),
  keyTakeaways: jsonb('key_takeaways').default([]),
  markedObjects: jsonb('marked_objects').default([]),
  visualFrameKey: text('visual_frame_key'),
  isDemoMode: boolean('is_demo_mode').notNull().default(true),
});

// ============================================
// STAGES TABLE (for individual stage records)
// ============================================

export const stages = pgTable('stages', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => runs.id),
  stageNumber: integer('stage_number').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull().$type<'stage1' | 'stage2' | 'stage3' | 'extra'>(),
  purpose: text('purpose').notNull(),
  reason: text('reason').notNull(),
  input: jsonb('input').notNull(),
  output: jsonb('output').notNull(),
  status: text('status').notNull().$type<'pending' | 'in_progress' | 'completed' | 'failed'>(),
  startedAt: timestamp('started_at', { mode: 'date' }),
  completedAt: timestamp('completed_at', { mode: 'date' }),
  participants: jsonb('participants').notNull().default([]),
});

// ============================================
// STAGE PLANS TABLE
// ============================================

export const stagePlans = pgTable('stage_plans', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => runs.id),
  totalStages: integer('total_stages').notNull(),
  stages: jsonb('stages').notNull().default([]),
  reason: text('reason').notNull(),
  decidedBy: text('decided_by').notNull(),
  decidedAt: timestamp('decided_at', { mode: 'date' }).notNull().defaultNow(),
  changes: jsonb('changes').notNull().default([]),
});

// ============================================
// WORK PLANS TABLE
// ============================================

export const workPlans = pgTable('work_plans', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => runs.id),
  goal: text('goal').notNull(),
  approach: text('approach').notNull(),
  stages: jsonb('stages').notNull().default([]),
  skills: jsonb('skills').notNull().default([]),
  team: jsonb('team').notNull().default([]),
  order: jsonb('order').notNull().default([]),
  checks: jsonb('checks').notNull().default([]),
  qualityMeasure: text('quality_measure').notNull(),
  outputForm: text('output_form').notNull(),
  reasons: jsonb('reasons').notNull().default({}),
  decidedAt: timestamp('decided_at', { mode: 'date' }).notNull().defaultNow(),
  changes: jsonb('changes').notNull().default([]),
});

// ============================================
// SOURCES TABLE
// ============================================

export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => runs.id),
  title: text('title').notNull(),
  url: text('url').notNull(),
  snippet: text('snippet').notNull(),
  provider: text('provider').notNull(),
  retrievedAt: timestamp('retrieved_at', { mode: 'date' }).notNull().defaultNow(),
  relevance: real('relevance').notNull().default(0),
});

// ============================================
// VISUAL FRAMES TABLE
// ============================================

export const visualFrames = pgTable('visual_frames', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => runs.id),
  imageData: text('image_data').notNull(),
  objects: jsonb('objects').notNull().default([]),
  timestamp: timestamp('timestamp', { mode: 'date' }).notNull().defaultNow(),
  source: text('source').notNull().$type<'camera' | 'upload' | 'screenshot'>(),
});

// ============================================
// USER PROFILE TABLE
// ============================================

export const userProfile = pgTable('user_profile', {
  id: text('id').primaryKey(),
  level: text('level').notNull().$type<'beginner' | 'medium' | 'advanced'>(),
  preferredStyle: text('preferred_style').notNull().$type<'story' | 'analogy' | 'steps' | 'quiz' | 'simple' | 'detailed'>(),
  depth: text('depth').notNull().$type<'simple' | 'detailed'>(),
  language: text('language').notNull().$type<'english' | 'hinglish' | 'hindi'>(),
  specialNotes: text('special_notes').notNull().default(''),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// MEMORIES TABLE
// ============================================

export const memories = pgTable('memories', {
  id: text('id').primaryKey(),
  type: text('type').notNull().$type<'preference' | 'fact' | 'style' | 'note'>(),
  content: text('content').notNull(),
  context: text('context').notNull(),
  tags: jsonb('tags').notNull().default([]),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// CORRECTIONS TABLE
// ============================================

export const corrections = pgTable('corrections', {
  id: text('id').primaryKey(),
  runId: text('run_id').references(() => runs.id),
  originalAnswer: text('original_answer').notNull(),
  correctedAnswer: text('corrected_answer').notNull(),
  issue: text('issue').notNull(),
  correction: text('correction').notNull(),
  appliedToAll: boolean('applied_to_all').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// USER STATS TABLE
// ============================================

export const userStats = pgTable('user_stats', {
  id: text('id').primaryKey(),
  xp: integer('xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  points: integer('points').notNull().default(0),
  upgrades: integer('upgrades').notNull().default(0),
  runsCompleted: integer('runs_completed').notNull().default(0),
  streak: integer('streak').notNull().default(0),
  lastActiveDate: timestamp('last_active_date', { mode: 'date' }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// SELF-UPGRADES TABLE
// ============================================

export const selfUpgrades = pgTable('self_upgrades', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull().$type<'skill' | 'agent' | 'feature' | 'improvement'>(),
  sourceTitle: text('source_title').notNull(),
  sourceUrl: text('source_url').notNull(),
  whyAdded: text('why_added').notNull(),
  addedBy: text('added_by').notNull(),
  addedAt: timestamp('added_at', { mode: 'date' }).notNull().defaultNow(),
  status: text('status').notNull().$type<'pending' | 'implemented' | 'failed'>(),
  implementationSteps: jsonb('implementation_steps').default([]),
});

// ============================================
// GROUP DECISIONS TABLE
// ============================================

export const groupDecisions = pgTable('group_decisions', {
  id: text('id').primaryKey(),
  runId: text('run_id').references(() => runs.id),
  topic: text('topic').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull().$type<'add-agent' | 'add-skill' | 'extra-stage' | 'work-plan' | 'team-selection'>(),
  messages: jsonb('messages').notNull().default([]),
  verdict: jsonb('verdict').notNull(),
  status: text('status').notNull().$type<'pending' | 'in_progress' | 'completed'>(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { mode: 'date' }),
});

// ============================================
// TASK TEAMS TABLE
// ============================================

export const taskTeams = pgTable('task_teams', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => runs.id),
  agents: jsonb('agents').notNull().default([]),
  reason: text('reason').notNull(),
  selectedAt: timestamp('selected_at', { mode: 'date' }).notNull().defaultNow(),
  selectedBy: text('selected_by').notNull(),
});

// ============================================
// WORKSHOP BUILDS TABLE
// ============================================

export const workshopBuilds = pgTable('workshop_builds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  parts: jsonb('parts').notNull().default([]),
  connections: jsonb('connections').notNull().default([]),
  switches: jsonb('switches').notNull().default([]),
  state: jsonb('state').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// DEVICE TASKS TABLE
// ============================================

export const deviceTasks = pgTable('device_tasks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  steps: jsonb('steps').notNull().default([]),
  status: text('status').notNull().$type<'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'>(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  startedAt: timestamp('started_at', { mode: 'date' }),
  completedAt: timestamp('completed_at', { mode: 'date' }),
  isSensitive: boolean('is_sensitive').notNull().default(false),
  requiresApproval: boolean('requires_approval').notNull().default(false),
  approvedBy: text('approved_by'),
  approvedAt: timestamp('approved_at', { mode: 'date' }),
});

// ============================================
// PLANS TABLE
// ============================================

export const plans = pgTable('plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  tasks: jsonb('tasks').notNull().default([]),
  status: text('status').notNull().$type<'pending' | 'in_progress' | 'completed' | 'cancelled'>(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  dueDate: timestamp('due_date', { mode: 'date' }),
});

// ============================================
// GOALS TABLE
// ============================================

export const goals = pgTable('goals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  target: text('target').notNull(),
  current: text('current').notNull(),
  unit: text('unit').notNull(),
  targetValue: real('target_value').notNull(),
  currentValue: real('current_value').notNull().default(0),
  startDate: timestamp('start_date', { mode: 'date' }).notNull().defaultNow(),
  dueDate: timestamp('due_date', { mode: 'date' }),
  status: text('status').notNull().$type<'pending' | 'in_progress' | 'completed' | 'failed'>(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// GOAL LOGS TABLE
// ============================================

export const goalLogs = pgTable('goal_logs', {
  id: text('id').primaryKey(),
  goalId: text('goal_id').notNull().references(() => goals.id),
  value: real('value').notNull(),
  note: text('note').notNull().default(''),
  loggedAt: timestamp('logged_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// DAILY BRIEFINGS TABLE
// ============================================

export const dailyBriefings = pgTable('daily_briefings', {
  id: text('id').primaryKey(),
  date: timestamp('date', { mode: 'date' }).notNull().defaultNow(),
  summary: text('summary').notNull(),
  progress: jsonb('progress').notNull().default([]),
  reminders: jsonb('reminders').notNull().default([]),
  suggestions: jsonb('suggestions').notNull().default([]),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// PROACTIVE SUGGESTIONS TABLE
// ============================================

export const proactiveSuggestions = pgTable('proactive_suggestions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  why: text('why').notNull(),
  how: text('how').notNull(),
  payload: jsonb('payload').notNull(),
  status: text('status').notNull().$type<'pending' | 'approved' | 'rejected' | 'executed'>(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  executedAt: timestamp('executed_at', { mode: 'date' }),
});

// ============================================
// DAILY MISSIONS TABLE
// ============================================

export const dailyMissions = pgTable('daily_missions', {
  id: text('id').primaryKey(),
  date: timestamp('date', { mode: 'date' }).notNull().defaultNow(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  progress: integer('progress').notNull().default(0),
  target: integer('target').notNull().default(1),
  rewardXP: integer('reward_xp').notNull().default(0),
  rewardPoints: integer('reward_points').notNull().default(0),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at', { mode: 'date' }),
});

// ============================================
// ACHIEVEMENTS TABLE
// ============================================

export const achievements = pgTable('achievements', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  earned: boolean('earned').notNull().default(false),
  earnedAt: timestamp('earned_at', { mode: 'date' }),
  criteria: text('criteria').notNull(),
});

// ============================================
// STREAKS TABLE
// ============================================

export const streaks = pgTable('streaks', {
  id: text('id').primaryKey(),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActiveDate: timestamp('last_active_date', { mode: 'date' }).notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(false),
});

// ============================================
// VISUAL LESSONS TABLE
// ============================================

export const visualLessons = pgTable('visual_lessons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull().$type<'explainer' | 'whiteboard'>(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// DAY ACTIVITY TABLE
// ============================================

export const dayActivity = pgTable('day_activity', {
  id: text('id').primaryKey(),
  date: timestamp('date', { mode: 'date' }).notNull().defaultNow(),
  runs: integer('runs').notNull().default(0),
  stagesCompleted: integer('stages_completed').notNull().default(0),
  skillsUsed: jsonb('skills_used').notNull().default([]),
  agentsUsed: jsonb('agents_used').notNull().default([]),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// MISSION CLAIMS TABLE
// ============================================

export const missionClaims = pgTable('mission_claims', {
  id: text('id').primaryKey(),
  missionId: text('mission_id').notNull().references(() => dailyMissions.id),
  claimedAt: timestamp('claimed_at', { mode: 'date' }).notNull().defaultNow(),
  xpEarned: integer('xp_earned').notNull().default(0),
  pointsEarned: integer('points_earned').notNull().default(0),
});

// ============================================
// SYSTEM CONFIG TABLE
// ============================================

export const systemConfig = pgTable('system_config', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  version: text('version').notNull(),
  demoMode: boolean('demo_mode').notNull().default(true),
  maxAgents: integer('max_agents').notNull().default(105),
  maxSkills: integer('max_skills').notNull().default(40),
  defaultPersona: text('default_persona').notNull().default('fusion'),
  features: jsonb('features').notNull().default([]),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// ============================================
// EXPORT ALL TABLES
// ============================================

export const allTables = {
  agents,
  skills,
  runs,
  stages,
  stagePlans,
  workPlans,
  sources,
  visualFrames,
  userProfile,
  memories,
  corrections,
  userStats,
  selfUpgrades,
  groupDecisions,
  taskTeams,
  workshopBuilds,
  deviceTasks,
  plans,
  goals,
  goalLogs,
  dailyBriefings,
  proactiveSuggestions,
  dailyMissions,
  achievements,
  streaks,
  visualLessons,
  dayActivity,
  missionClaims,
  systemConfig,
};

export type TableNames = keyof typeof allTables;
