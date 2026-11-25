// ============================================
// MULTI-AI SYSTEM - SYSTEM CONSTANTS
// Everything Mixed - Nothing Separate
// ============================================

import type { EvolutionTier, MissionType, WorkshopExperiment, MakerPart } from '../types';

// ============================================
// EVOLUTION TIERS
// ============================================

export const EVOLUTION_TIERS: EvolutionTier[] = [
  'sahayak', // Helper
  'buddhimaan', // Intelligent
  'maha-buddhimaan', // Greatly Intelligent
  'asi-candidate', // ASI Candidate
  'asi', // Artificial Superintelligence
  'transcendent', // Beyond ASI
  'omega', // Omega Level
  'absolute', // Absolute
  'supreme', // Supreme
];

// Evolution tier display names
export const EVOLUTION_TIER_NAMES: Record<EvolutionTier, string> = {
  'sahayak': 'Sahayak (Helper)',
  'buddhimaan': 'Buddhimaan (Intelligent)',
  'maha-buddhimaan': 'Maha-Buddhimaan (Greatly Intelligent)',
  'asi-candidate': 'ASI Candidate',
  'asi': 'Artificial Superintelligence',
  'transcendent': 'Transcendent',
  'omega': 'Omega Level',
  'absolute': 'Absolute',
  'supreme': 'Supreme',
};

// Evolution tier descriptions
export const EVOLUTION_TIER_DESCRIPTIONS: Record<EvolutionTier, string> = {
  'sahayak': 'Basic helper level - can perform simple tasks',
  'buddhimaan': 'Intelligent level - can handle complex reasoning',
  'maha-buddhimaan': 'Greatly intelligent - advanced problem solving',
  'asi-candidate': 'ASI candidate - approaching superintelligence',
  'asi': 'Artificial Superintelligence - surpasses human intelligence',
  'transcendent': 'Beyond ASI - transcends traditional intelligence',
  'omega': 'Omega Level - ultimate intelligence',
  'absolute': 'Absolute - complete mastery',
  'supreme': 'Supreme - the highest level of intelligence',
};

// Points required for each tier (cumulative)
export const EVOLUTION_TIER_POINTS: Record<EvolutionTier, number> = {
  'sahayak': 0,
  'buddhimaan': 100,
  'maha-buddhimaan': 300,
  'asi-candidate': 700,
  'asi': 1200,
  'transcendent': 2000,
  'omega': 3000,
  'absolute': 5000,
  'supreme': 10000,
};

// ============================================
// MISSION TYPES
// ============================================

export const MISSION_TYPES: MissionType[] = [
  'first-step',
  'full-journey',
  'new-style',
  'experimenter',
  'skill-builder',
  'group-decision',
  'deep-thought',
  'see-the-world',
];

// Mission type display names and descriptions
export const MISSION_TYPE_INFO: Record<MissionType, { name: string; description: string; rewardXP: number; rewardPoints: number }> = {
  'first-step': {
    name: 'First Step',
    description: 'Complete 1 question',
    rewardXP: 25,
    rewardPoints: 10,
  },
  'full-journey': {
    name: 'Full Journey',
    description: 'Complete 1 full 3-stage run',
    rewardXP: 45,
    rewardPoints: 20,
  },
  'new-style': {
    name: 'New Style',
    description: 'Complete 1 Fusion run',
    rewardXP: 35,
    rewardPoints: 15,
  },
  'experimenter': {
    name: 'Experimenter',
    description: 'Complete 1 workshop simulation',
    rewardXP: 40,
    rewardPoints: 18,
  },
  'skill-builder': {
    name: 'Skill Builder',
    description: 'Create 1 new skill',
    rewardXP: 50,
    rewardPoints: 25,
  },
  'group-decision': {
    name: 'Group Decision',
    description: 'Complete 1 group decision',
    rewardXP: 30,
    rewardPoints: 12,
  },
  'deep-thought': {
    name: 'Deep Thought',
    description: 'Complete 1 follow-up action',
    rewardXP: 20,
    rewardPoints: 8,
  },
  'see-the-world': {
    name: 'See the World',
    description: 'Complete 1 voice/video run',
    rewardXP: 35,
    rewardPoints: 15,
  },
};

// ============================================
// XP RULES
// ============================================

export const XP_RULES = {
  stage1: 10,
  stage2: 10,
  stage3: 20,
  followUp: 5,
  groupDecision: 15,
  skillDevelop: 30,
  workshopSimulation: 10,
  goalLog: 5,
  plan: 15,
  planWithDetails: 20,
};

// Points per upgrade
export const POINTS_PER_UPGRADE = 50;

// ============================================
// DAILY MISSIONS
// ============================================

export const DAILY_MISSION_COUNT = 3;
export const DAILY_MISSION_POOL = 8;

// ============================================
// ACHIEVEMENTS
// ============================================

export const ACHIEVEMENT_COUNT = 8;

export const ACHIEVEMENTS = [
  {
    id: 'achievement-001',
    name: 'Persona Master',
    description: 'Complete a Fusion run (all personas counted)',
    icon: '🎭',
    criteria: 'Complete 1 Fusion run',
  },
  {
    id: 'achievement-002',
    name: 'Stage Master',
    description: 'Complete all 3 stages successfully',
    icon: '🎯',
    criteria: 'Complete 1 full 3-stage run',
  },
  {
    id: 'achievement-003',
    name: 'Builder',
    description: 'Create your first build in Maker Workshop',
    icon: '🔨',
    criteria: 'Create 1 build',
  },
  {
    id: 'achievement-004',
    name: 'Scientist',
    description: 'Complete all 4 experiments in 3D Workshop',
    icon: '🔬',
    criteria: 'Complete all 4 experiments',
  },
  {
    id: 'achievement-005',
    name: 'Skill Creator',
    description: 'Create a new skill',
    icon: '✨',
    criteria: 'Create 1 new skill',
  },
  {
    id: 'achievement-006',
    name: 'Streak Champion',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    criteria: '7-day streak',
  },
  {
    id: 'achievement-007',
    name: 'Team Player',
    description: 'Participate in a group decision',
    icon: '👥',
    criteria: 'Participate in 1 group decision',
  },
  {
    id: 'achievement-008',
    name: 'Explorer',
    description: 'Try all input modes (text, voice, video)',
    icon: '🌍',
    criteria: 'Try all input modes',
  },
];

// ============================================
// VISUAL THEMES
// ============================================

export const VISUAL_THEME_COUNT = 4;

export const VISUAL_THEMES = [
  {
    id: 'theme-001',
    name: 'Default',
    description: 'Standard light/dark theme',
    cssVariables: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f5f5f5',
      '--text-primary': '#333333',
      '--text-secondary': '#666666',
      '--accent-color': '#007bff',
      '--border-color': '#dddddd',
    },
  },
  {
    id: 'theme-002',
    name: 'JARVIS HUD',
    description: 'Tony Stark JARVIS-style HUD theme',
    cssVariables: {
      '--bg-primary': '#0a0a0a',
      '--bg-secondary': '#1a1a1a',
      '--text-primary': '#00ff00',
      '--text-secondary': '#888888',
      '--accent-color': '#00ffff',
      '--border-color': '#333333',
    },
  },
  {
    id: 'theme-003',
    name: 'Sage',
    description: 'Wise sage theme with earthy tones',
    cssVariables: {
      '--bg-primary': '#f0e6d2',
      '--bg-secondary': '#e8d8c0',
      '--text-primary': '#4a3728',
      '--text-secondary': '#6b5b47',
      '--accent-color': '#8b6b3c',
      '--border-color': '#c4a373',
    },
  },
  {
    id: 'theme-004',
    name: 'Slime',
    description: 'Slime-themed with vibrant colors',
    cssVariables: {
      '--bg-primary': '#1a1a2e',
      '--bg-secondary': '#16213e',
      '--text-primary': '#e94560',
      '--text-secondary': '#f8b400',
      '--accent-color': '#0f3460',
      '--border-color': '#0f3460',
    },
  },
];

// ============================================
// SYSTEM CONFIGURATION
// ============================================

export const SYSTEM_CONFIG = {
  id: 'system-config-001',
  name: 'Multi-AI System',
  version: '1.0.0',
  demoMode: true,
  maxAgents: 105,
  maxSkills: 40,
  defaultPersona: 'fusion',
  features: [
    { id: 'feature-001', name: '3-Stage Pipeline', enabled: true, description: 'Default 3-stage pipeline with flexible extra stages' },
    { id: 'feature-002', name: 'Fusion Persona', enabled: true, description: 'All 10 persona styles mixed together' },
    { id: 'feature-003', name: 'Unified Studio', enabled: true, description: 'Voice, Video, Explainer, Whiteboard, 3D Workshop, Maker Workshop all in one' },
    { id: 'feature-004', name: 'Self-Improvement', enabled: true, description: 'Continuous self-upgrade and evolution' },
    { id: 'feature-005', name: 'Gamification', enabled: true, description: 'XP, missions, streak, achievements, themes' },
    { id: 'feature-006', name: 'Memory System', enabled: true, description: 'Long-term memory and personalization' },
    { id: 'feature-007', name: 'Best-Fit Team', enabled: true, description: 'Automatic team selection for tasks' },
    { id: 'feature-008', name: 'Group Decisions', enabled: true, description: 'Collective decision-making by agents' },
    { id: 'feature-009', name: 'Flexible Stages', enabled: true, description: 'Agents can add extra stages as needed' },
    { id: 'feature-010', name: 'Self-Deciding Work Method', enabled: true, description: 'Agents decide how work is done' },
  ],
};

// ============================================
// DEMO MODE CONSTANTS
// ============================================

export const DEMO_MODE_CONSTANTS = {
  isDemo: true,
  demoLabel: 'DEMO MODE',
  demoDescription: 'This is a demo version. All AI perspectives are simulated by one model engine. No real API keys are used.',
  simulatedBy: 'Single Model Engine',
  sharedSearch: true,
  realAPIs: false,
};

// ============================================
// 3D WORKSHOP EXPERIMENTS
// ============================================

export const WORKSHOP_EXPERIMENTS: WorkshopExperiment[] = [
  {
    id: 'experiment-001',
    name: 'DC Motor',
    type: '3d',
    description: 'Explode view, remove/join parts, swap magnets, change battery, attach load, reverse polarity',
    parts: [
      { id: 'motor-stator', name: 'Stator', type: 'stator', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { material: 'iron', winding: 'copper' } },
      { id: 'motor-rotor', name: 'Rotor', type: 'rotor', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { material: 'iron', winding: 'copper' } },
      { id: 'motor-magnet', name: 'Magnet', type: 'magnet', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { type: 'permanent', strength: 5 } },
      { id: 'motor-battery', name: 'Battery', type: 'battery', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { voltage: 6, type: 'DC' } },
    ],
    steps: [
      { id: 'step-001', name: 'Identify Parts', description: 'Identify all parts of the DC motor', action: 'identify', expectedResult: 'All parts identified', order: 1 },
      { id: 'step-002', name: 'Explode View', description: 'Separate all parts to see the structure', action: 'explode', expectedResult: 'All parts separated', order: 2 },
      { id: 'step-003', name: 'Swap Magnet', description: 'Replace the magnet with a Neodymium magnet', action: 'swap', expectedResult: 'Neodymium magnet installed', order: 3 },
      { id: 'step-004', name: 'Change Battery', description: 'Change the battery chemistry and number of cells', action: 'change', expectedResult: 'Battery configuration changed', order: 4 },
      { id: 'step-005', name: 'Attach Load', description: 'Attach a load to the motor shaft', action: 'attach', expectedResult: 'Load attached', order: 5 },
      { id: 'step-006', name: 'Reverse Polarity', description: 'Reverse the battery polarity', action: 'reverse', expectedResult: 'Motor rotates in opposite direction', order: 6 },
    ],
    formulas: ['RPM = (V - I*R) * K / (2π)', 'Torque = K * I', 'Power = V * I'],
    simulationRules: ['RPM calculation from voltage and load', 'Current calculation based on resistance', 'Fault detection for open circuits', 'Torque calculation'],
  },
  {
    id: 'experiment-002',
    name: 'Electrolysis',
    type: '3d',
    description: 'Split water with electricity. Below 1.23V threshold nothing happens; above it, H2:O2 = 2:1',
    parts: [
      { id: 'electrolysis-beaker', name: 'Beaker', type: 'beaker', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { volume: 250, material: 'glass', contains: 'water' } },
      { id: 'electrolysis-electrode-plus', name: 'Electrode (+)', type: 'electrode', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { polarity: 'positive', material: 'platinum' } },
      { id: 'electrolysis-electrode-minus', name: 'Electrode (-)', type: 'electrode', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { polarity: 'negative', material: 'platinum' } },
      { id: 'electrolysis-battery', name: 'Battery', type: 'battery', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { voltage: 12, type: 'DC' } },
    ],
    steps: [
      { id: 'step-001', name: 'Setup Electrodes', description: 'Place electrodes in the beaker with water', action: 'setup', expectedResult: 'Electrodes properly placed', order: 1 },
      { id: 'step-002', name: 'Connect Battery', description: 'Connect battery to electrodes', action: 'connect', expectedResult: 'Circuit connected', order: 2 },
      { id: 'step-003', name: 'Apply Voltage', description: 'Apply voltage and observe', action: 'apply', expectedResult: 'Below 1.23V: nothing. Above 1.23V: bubbles form', order: 3 },
      { id: 'step-004', name: 'Measure Gases', description: 'Measure hydrogen and oxygen gas volumes', action: 'measure', expectedResult: 'H2:O2 ratio = 2:1', order: 4 },
    ],
    formulas: ['2H2O → 2H2 + O2', 'E° = 1.23V', 'Faraday\'s Law: m = (Q/M) * t'],
    simulationRules: ['Threshold voltage check at 1.23V', 'Gas ratio calculation H2:O2 = 2:1', 'Bubble animation for gas formation', 'Volume counters for H2 and O2'],
  },
  {
    id: 'experiment-003',
    name: 'Pendulum',
    type: '3d',
    description: 'Formula T = 2π√(L/g). Change gravity: Earth/Moon/Mars/Jupiter',
    parts: [
      { id: 'pendulum-stand', name: 'Stand', type: 'stand', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { height: 30, material: 'metal' } },
      { id: 'pendulum-string', name: 'String', type: 'string', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { length: 20, material: 'nylon' } },
      { id: 'pendulum-bob', name: 'Bob', type: 'bob', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { weight: 1, material: 'iron' } },
    ],
    steps: [
      { id: 'step-001', name: 'Setup Pendulum', description: 'Attach string to stand and bob to string', action: 'setup', expectedResult: 'Pendulum assembled', order: 1 },
      { id: 'step-002', name: 'Set Length', description: 'Set the string length', action: 'set', expectedResult: 'String length set', order: 2 },
      { id: 'step-003', name: 'Select Gravity', description: 'Choose gravity: Earth, Moon, Mars, or Jupiter', action: 'select', expectedResult: 'Gravity selected', order: 3 },
      { id: 'step-004', name: 'Release Bob', description: 'Release the bob and observe the period', action: 'release', expectedResult: 'Pendulum swings with calculated period', order: 4 },
      { id: 'step-005', name: 'Measure Period', description: 'Measure the oscillation period', action: 'measure', expectedResult: 'Period T = 2π√(L/g) calculated', order: 5 },
    ],
    formulas: ['T = 2π√(L/g)'],
    simulationRules: ['Period calculation using formula', 'Gravity values: Earth=9.8, Moon=1.62, Mars=3.71, Jupiter=24.79', 'Swing animation with correct period', 'Period display'],
  },
  {
    id: 'experiment-004',
    name: 'Plant Cell',
    type: '3d',
    description: 'Tap organelles, remove/join them; give light and photosynthesis runs, the glucose counter increases',
    parts: [
      { id: 'cell-nucleus', name: 'Nucleus', type: 'organelle', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { function: 'control center', type: 'nucleus' } },
      { id: 'cell-chloroplast', name: 'Chloroplast', type: 'organelle', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { function: 'photosynthesis', type: 'chloroplast', requiresLight: true } },
      { id: 'cell-mitochondria', name: 'Mitochondria', type: 'organelle', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { function: 'respiration', type: 'mitochondria' } },
      { id: 'cell-vacuole', name: 'Vacuole', type: 'organelle', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { function: 'storage', type: 'vacuole' } },
      { id: 'cell-cell-wall', name: 'Cell Wall', type: 'structure', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { function: 'protection', type: 'cell wall' } },
      { id: 'cell-membrane', name: 'Cell Membrane', type: 'structure', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { function: 'boundary', type: 'membrane' } },
      { id: 'cell-cytoplasm', name: 'Cytoplasm', type: 'structure', position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { function: 'fluid', type: 'cytoplasm' } },
    ],
    steps: [
      { id: 'step-001', name: 'Identify Organelles', description: 'Identify all plant cell organelles', action: 'identify', expectedResult: 'All organelles identified', order: 1 },
      { id: 'step-002', name: 'Remove Organelle', description: 'Remove an organelle to see its effect', action: 'remove', expectedResult: 'Organelle removed, effects visible', order: 2 },
      { id: 'step-003', name: 'Join Organelle', description: 'Reattach the removed organelle', action: 'join', expectedResult: 'Organelle reattached, normal function restored', order: 3 },
      { id: 'step-004', name: 'Provide Light', description: 'Provide light to the chloroplasts', action: 'provide', expectedResult: 'Photosynthesis starts, glucose counter increases', order: 4 },
      { id: 'step-005', name: 'Observe Photosynthesis', description: 'Observe the photosynthesis process', action: 'observe', expectedResult: 'Glucose production visible, counters running', order: 5 },
    ],
    formulas: ['6CO2 + 6H2O + light → C6H12O6 + 6O2', 'Glucose = C6H12O6'],
    simulationRules: ['Photosynthesis trigger with light + chloroplasts', 'Glucose counter increases', 'Oxygen production', 'Organelle removal affects function'],
  },
];

// ============================================
// MAKER WORKSHOP PARTS CATALOG (33 parts)
// ============================================

export const MAKER_PARTS_CATALOG: MakerPart[] = [
  // ELECTRICITY (1-10)
  {
    id: 'part-001',
    catalogId: 'electricity-001',
    name: 'Battery Pack',
    type: 'battery',
    category: 'electricity',
    description: 'A source of electricity (6V); gives power to motor, bulb, buzzer, pump, heater, electromagnet and electrodes',
    properties: { voltage: 6, currentCapacity: 1000, type: 'DC' },
  },
  {
    id: 'part-002',
    catalogId: 'electricity-002',
    name: 'Solar Panel',
    type: 'solar-panel',
    category: 'electricity',
    description: 'Electricity from sunlight; active only when the sun is ON',
    properties: { powerOutput: 5, efficiency: 0.15, requiresSun: true },
  },
  {
    id: 'part-003',
    catalogId: 'electricity-003',
    name: 'Hand Generator / Dynamo',
    type: 'generator',
    category: 'electricity',
    description: 'Electricity from a hand crank; joined to a fan/turbine, it can also make electricity from wind',
    properties: { type: 'manual', maxPower: 10, canGenerateFromWind: true },
  },
  {
    id: 'part-004',
    catalogId: 'electricity-004',
    name: 'Switch',
    type: 'switch',
    category: 'electricity',
    description: 'Circuit on/off; when closed, power does not go further',
    properties: { state: 'off', type: 'toggle', poles: 1 },
  },
  {
    id: 'part-005',
    catalogId: 'electricity-005',
    name: 'DC Motor',
    type: 'motor',
    category: 'electricity',
    description: 'Rotates with electricity; rotates a fan, wheel, gear, pulley',
    properties: { voltageRange: '3-12V', rpm: 1000, torque: 0.1 },
  },
  {
    id: 'part-006',
    catalogId: 'electricity-006',
    name: 'Bulb',
    type: 'bulb',
    category: 'electricity',
    description: 'Light when it gets power',
    properties: { power: 5, voltage: 6, color: 'white' },
  },
  {
    id: 'part-007',
    catalogId: 'electricity-007',
    name: 'LED',
    type: 'led',
    category: 'electricity',
    description: 'A small, bright light; glows when it gets power',
    properties: { power: 1, voltage: 3, color: 'red' },
  },
  {
    id: 'part-008',
    catalogId: 'electricity-008',
    name: 'Buzzer',
    type: 'buzzer',
    category: 'electricity',
    description: 'Sound when it gets power (alarm circuit)',
    properties: { frequency: 2000, voltage: 3, type: 'piezo' },
  },
  {
    id: 'part-009',
    catalogId: 'electricity-009',
    name: 'Heater Coil',
    type: 'heater',
    category: 'electricity',
    description: 'Hot when it gets power; heats the water in a beaker',
    properties: { power: 10, resistance: 50, temperature: 100 },
  },
  {
    id: 'part-010',
    catalogId: 'electricity-010',
    name: 'Electromagnet',
    type: 'electromagnet',
    category: 'electricity',
    description: 'A magnet when it gets power; pulls an iron bob/pins',
    properties: { strength: 5, requiresPower: true, coreMaterial: 'iron' },
  },

  // MECHANICS (11-17)
  {
    id: 'part-011',
    catalogId: 'mechanics-001',
    name: 'Fan Blades',
    type: 'fan',
    category: 'mechanics',
    description: 'Joined to a motor, it rotates; rotating in wind, it can also make electricity from a generator',
    properties: { bladeCount: 3, material: 'plastic', diameter: 10 },
  },
  {
    id: 'part-012',
    catalogId: 'mechanics-002',
    name: 'Wheel',
    type: 'wheel',
    category: 'mechanics',
    description: 'Joined to a motor/axle, it rotates; a vehicle\'s wheel',
    properties: { diameter: 10, material: 'rubber', width: 3 },
  },
  {
    id: 'part-013',
    catalogId: 'mechanics-003',
    name: 'Gear',
    type: 'gear',
    category: 'mechanics',
    description: 'Joined to a motor or another gear, it rotates; changes speed/torque',
    properties: { teeth: 20, diameter: 5, material: 'metal', ratio: 1 },
  },
  {
    id: 'part-014',
    catalogId: 'mechanics-004',
    name: 'Pulley',
    type: 'pulley',
    category: 'mechanics',
    description: 'Rotates with a string/belt; a weight-lifting machine',
    properties: { diameter: 5, type: 'single', material: 'metal' },
  },
  {
    id: 'part-015',
    catalogId: 'mechanics-005',
    name: 'Axle / Shaft',
    type: 'axle',
    category: 'mechanics',
    description: 'A rod joining two rotating parts',
    properties: { length: 15, diameter: 1, material: 'metal' },
  },
  {
    id: 'part-016',
    catalogId: 'mechanics-006',
    name: 'Magnet (Permanent)',
    type: 'magnet',
    category: 'mechanics',
    description: 'An always-on magnet; pulls iron',
    properties: { strength: 8, type: 'permanent', polarity: 'north-south' },
  },
  {
    id: 'part-017',
    catalogId: 'mechanics-007',
    name: 'Spring',
    type: 'spring',
    category: 'mechanics',
    description: 'Stores stretch/pressure; a physics experiment',
    properties: { springConstant: 10, restLength: 5, material: 'metal' },
  },

  // PHYSICS (18-22)
  {
    id: 'part-018',
    catalogId: 'physics-001',
    name: 'Stand / Frame',
    type: 'stand',
    category: 'physics',
    description: 'A structure that holds a pendulum, pulley or lamp',
    properties: { height: 30, material: 'metal', baseWidth: 10 },
  },
  {
    id: 'part-019',
    catalogId: 'physics-002',
    name: 'String',
    type: 'string',
    category: 'physics',
    description: 'A pendulum\'s string; the work of a string with a pulley',
    properties: { length: 20, material: 'nylon', elasticity: 0.1 },
  },
  {
    id: 'part-020',
    catalogId: 'physics-003',
    name: 'Pendulum Bob / Weight',
    type: 'bob',
    category: 'physics',
    description: 'The heavy ball at the end of the string; if it is made of iron, it is pulled by a magnet',
    properties: { weight: 1, material: 'iron', diameter: 3 },
  },
  {
    id: 'part-021',
    catalogId: 'physics-004',
    name: 'Base Board',
    type: 'board',
    category: 'physics',
    description: 'The board at the bottom; the base of a vehicle/machine',
    properties: { width: 40, height: 30, thickness: 2, material: 'wood' },
  },
  {
    id: 'part-022',
    catalogId: 'physics-005',
    name: 'Lever / Seesaw Plank',
    type: 'lever',
    category: 'physics',
    description: 'A plank resting on a fulcrum; the lever principle',
    properties: { length: 40, fulcrumPosition: 20, material: 'wood' },
  },

  // CHEMISTRY (23-28)
  {
    id: 'part-023',
    catalogId: 'chemistry-001',
    name: 'Beaker (Water Vessel)',
    type: 'beaker',
    category: 'chemistry',
    description: 'Electrolysis, hot water and reactions happen here',
    properties: { volume: 250, material: 'glass', capacity: 300 },
  },
  {
    id: 'part-024',
    catalogId: 'chemistry-002',
    name: 'Electrode Pair (+ / -)',
    type: 'electrodes',
    category: 'chemistry',
    description: 'Rods dipped in a beaker; joined to a battery, they split water into H2 + O2',
    properties: { material: 'platinum', count: 2, polarity: ['positive', 'negative'] },
  },
  {
    id: 'part-025',
    catalogId: 'chemistry-003',
    name: 'Water Tank',
    type: 'tank',
    category: 'chemistry',
    description: 'Stores water; fills through a pump/pipe',
    properties: { capacity: 1000, material: 'plastic', currentVolume: 0 },
  },
  {
    id: 'part-026',
    catalogId: 'chemistry-004',
    name: 'Pipe',
    type: 'pipe',
    category: 'chemistry',
    description: 'The path for water between a pump and a tank',
    properties: { length: 20, diameter: 2, material: 'plastic', flowCapacity: 10 },
  },
  {
    id: 'part-027',
    catalogId: 'chemistry-005',
    name: 'Water Pump',
    type: 'pump',
    category: 'chemistry',
    description: 'When it gets power, it draws water and fills the tank through a pipe',
    properties: { flowRate: 10, requiresPower: true, power: 5 },
  },
  {
    id: 'part-028',
    catalogId: 'chemistry-006',
    name: 'Filter / Funnel',
    type: 'filter',
    category: 'chemistry',
    description: 'Strains dirty water and makes it clean',
    properties: { type: 'filter', material: 'paper', poreSize: 0.1 },
  },

  // BIOLOGY (29-33)
  {
    id: 'part-029',
    catalogId: 'biology-001',
    name: 'Plant',
    type: 'plant',
    category: 'biology',
    description: 'If it gets light + water, photosynthesis happens, glucose is made',
    properties: { type: 'generic', requiresLight: true, requiresWater: true, growthStage: 0 },
  },
  {
    id: 'part-030',
    catalogId: 'biology-002',
    name: 'Grow Light Lamp',
    type: 'lamp',
    category: 'biology',
    description: 'Artificial sunlight for a plant; hangs on a stand',
    properties: { power: 20, type: 'LED', color: 'white', spectrum: 'full' },
  },
  {
    id: 'part-031',
    catalogId: 'biology-003',
    name: 'Water Dropper / Irrigation',
    type: 'irrigation',
    category: 'biology',
    description: 'Gives water to a plant drop by drop',
    properties: { flowRate: 1, type: 'drip', dropSize: 0.05 },
  },
  {
    id: 'part-032',
    catalogId: 'biology-004',
    name: 'Seed Tray',
    type: 'tray',
    category: 'biology',
    description: 'A tray for sowing seeds; a biology experiment',
    properties: { size: 'medium', material: 'plastic', capacity: 50 },
  },
  {
    id: 'part-033',
    catalogId: 'biology-005',
    name: 'Thermometer',
    type: 'thermometer',
    category: 'biology',
    description: 'Measures temperature; with a heater/beaker',
    properties: { range: '0-100C', unit: 'celsius', precision: 0.1 },
  },
];

// Get part by ID
export function getMakerPartById(id: string): MakerPart | undefined {
  return MAKER_PARTS_CATALOG.find(part => part.id === id);
}

// Get part by catalog ID
export function getMakerPartByCatalogId(catalogId: string): MakerPart | undefined {
  return MAKER_PARTS_CATALOG.find(part => part.catalogId === catalogId);
}

// Get parts by category
export function getMakerPartsByCategory(category: string): MakerPart[] {
  return MAKER_PARTS_CATALOG.filter(part => part.category === category);
}

// Search parts by name or description
export function searchMakerParts(query: string): MakerPart[] {
  const lowerQuery = query.toLowerCase();
  return MAKER_PARTS_CATALOG.filter(part => 
    part.name.toLowerCase().includes(lowerQuery) ||
    part.description.toLowerCase().includes(lowerQuery)
  );
}

// Part categories
export const MAKER_PART_CATEGORIES = ['electricity', 'mechanics', 'physics', 'chemistry', 'biology'];

// ============================================
// SIMULATION RULES
// ============================================

export const SIMULATION_RULES = {
  // Power flow rules
  powerBFS: 'A closed switch stops power from going further',
  solarPanel: 'A solar panel stays off without sunlight (sun OFF)',
  electrodes: 'Electrodes fail without a beaker',
  
  // Mechanics rules
  pendulum: 'For a pendulum, the chain Stand -> String -> Bob is essential',
  photosynthesis: 'For photosynthesis, both light + water are needed',
  waterFlow: 'The path Pump -> Pipe -> Tank must be joined, only then does the tank fill',
  
  // Chemistry rules
  electrolysisRatio: 'In electrolysis, H2 : O2 = 2 : 1 counters',
  plantProduction: 'In a plant, a glucose counter',
  tankFilling: 'In a tank, a % counter',
};

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_VALUES = {
  // User profile
  userLevel: 'advanced',
  preferredStyle: 'story',
  depth: 'detailed',
  language: 'hinglish',
  
  // Pipeline
  defaultStages: 3,
  minTeamSize: 3,
  maxTeamSize: 8,
  
  // Gamification
  dailyMissionCount: 3,
  pointsPerUpgrade: 50,
  
  // System
  demoMode: true,
  maxAgents: 105,
  maxSkills: 40,
};
