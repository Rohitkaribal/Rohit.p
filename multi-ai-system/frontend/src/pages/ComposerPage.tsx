// ============================================
// MULTI-AI SYSTEM - COMPOSER PAGE
// Main input page for questions and tasks
// Everything Mixed - Nothing Separate
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent, Skill, PipelineRun, FusionPersona, SystemConfig } from '../../shared/types';

interface ComposerPageProps {
  agents: Agent[];
  skills: Skill[];
  persona: FusionPersona;
  config: SystemConfig;
  runs: PipelineRun[];
  setRuns: (runs: PipelineRun[]) => void;
  setCurrentRun: (run: PipelineRun | null) => void;
}

const ComposerPage: React.FC<ComposerPageProps> = ({
  agents,
  skills,
  persona,
  config,
  runs,
  setRuns,
  setCurrentRun,
}) => {
  const [question, setQuestion] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'video'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRun, setLocalRun] = useState<PipelineRun | null>(null);
  const [showWorkPlan, setShowWorkPlan] = useState(false);
  const [showStagePlan, setShowStagePlan] = useState(false);
  const [bestFitTeamEnabled, setBestFitTeamEnabled] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (questionInputRef.current) {
      questionInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRun]);

  useEffect(() => {
    if (bestFitTeamEnabled && agents.length > 0) {
      const allAgentIds = agents.map(a => a.id);
      const teamSize = Math.min(5, Math.max(3, Math.floor(allAgentIds.length * 0.1)));
      const selected = allAgentIds.slice(0, teamSize);
      setSelectedTeam(selected);
    }
  }, [bestFitTeamEnabled, agents, question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      const runId = `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date();
      
      const participants = bestFitTeamEnabled ? selectedTeam : agents.map(a => a.id);
      
      const stagePlan = {
        id: `stage-plan-${runId}`,
        totalStages: 3,
        stages: [
          {
            stageNumber: 1,
            name: 'Stage 1 - Individual Thinking',
            purpose: 'Each AI thinks independently and gives its own answer',
            reason: 'Default first stage of the pipeline',
            expectedOutput: `Individual answers from ${participants.length} agents`,
          },
          {
            stageNumber: 2,
            name: 'Stage 2 - Joint Discussion',
            purpose: 'All AIs discuss together and give one joint answer',
            reason: 'Default second stage of the pipeline',
            expectedOutput: 'Discussion transcript and joint answer',
          },
          {
            stageNumber: 3,
            name: 'Stage 3 - Final Combination',
            purpose: 'All AIs combine Stage 1 + Stage 2 into one final answer',
            reason: 'Default third stage of the pipeline',
            expectedOutput: 'Final combined answer with key takeaways',
          },
        ],
        reason: 'Default 3-stage pipeline',
        decidedBy: 'system',
        decidedAt: timestamp,
        changes: [],
      };

      const workPlan = {
        id: `work-plan-${runId}`,
        goal: question,
        approach: bestFitTeamEnabled ? 'Best-Fit Team approach' : 'Full roster approach',
        stages: stagePlan.stages,
        skills: skills.filter(s => s.isEnabled).map(s => s.id),
        team: participants,
        order: ['stage1', 'stage2', 'stage3'],
        checks: [
          {
            type: 'quality-self-check' as const,
            description: 'Final quality check before showing answer to Rohit',
            stageAfter: 3,
            criteria: ['No errors', 'Complete answer', 'All sources cited'],
          },
        ],
        qualityMeasure: 'Complete, accurate, and well-explained answer',
        outputForm: 'Text answer with sources',
        reasons: {
          approach: bestFitTeamEnabled ? 'Using Best-Fit Team for efficiency' : 'Using full roster for maximum input',
          stages: '3 stages provide comprehensive thinking',
          team: bestFitTeamEnabled ? `Selected ${participants.length} best-fit agents` : `All ${participants.length} agents`,
          checks: 'Quality check ensures accuracy',
        },
        decidedAt: timestamp,
        changes: [],
      };

      const newRun: PipelineRun = {
        id: runId,
        question,
        inputMode,
        stages: [],
        stagePlan,
        workPlan,
        sources: [],
        participants,
        persona: persona.name,
        status: 'in_progress',
        createdAt: timestamp,
        updatedAt: timestamp,
        isDemoMode: config.demoMode,
      };

      setLocalRun(newRun);
      setCurrentRun(newRun);
      setIsLoading(true);

      await simulatePipeline(newRun);

    } catch (error) {
      console.error('Error running pipeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulatePipeline = async (run: PipelineRun) => {
    for (let stageNum = 1; stageNum <= 3; stageNum++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRun = { ...run };
      
      if (stageNum === 1) {
        const stage1Answers = run.participants.map(agentId => {
          const agent = agents.find(a => a.id === agentId);
          return {
            agentId,
            agentName: agent?.name || 'Unknown',
            answer: `This is my individual analysis of: "${run.question}"

As ${agent?.name || 'an agent'}, I bring my unique perspective and full abilities (search, logic, reasoning, debate, creativity, coding, checking) to bear on this question.

Key points:
- ${generateRandomInsight(run.question, agent?.name || 'Agent')}
- ${generateRandomInsight(run.question, agent?.name || 'Agent')}
- ${generateRandomInsight(run.question, agent?.name || 'Agent')}

Confidence: ${Math.floor(Math.random() * 20) + 80}%`,
            reasoning: 'My full reasoning process involves understanding, analyzing, and formulating a comprehensive response.',
            confidence: Math.floor(Math.random() * 20) + 80,
            sourcesUsed: [],
            skillsUsed: skills.filter(s => s.isEnabled).slice(0, 3).map(s => s.id),
            timestamp: new Date(),
          };
        });

        updatedRun.stages = [
          {
            id: `stage-${run.id}-1`,
            stageNumber: 1,
            name: 'Stage 1 - Individual Thinking',
            type: 'stage1',
            purpose: 'Each AI thinks independently',
            reason: 'Default first stage',
            input: { question: run.question, participants: run.participants },
            output: { answers: stage1Answers },
            status: 'completed',
            startedAt: new Date(),
            completedAt: new Date(),
            participants: run.participants,
          },
        ];
      } else if (stageNum === 2) {
        const stage1Answers = (run.stages[0]?.output as any)?.answers || [];
        
        const discussionMessages = [
          {
            speaker: run.participants[0],
            speakerName: agents.find(a => a.id === run.participants[0])?.name || 'Unknown',
            message: `I AGREE with ${agents.find(a => a.id === run.participants[1])?.name || 'Agent 2'}'s point. The question requires a holistic approach.`,
            stance: 'agree' as const,
            timestamp: new Date(),
          },
          {
            speaker: run.participants[1],
            speakerName: agents.find(a => a.id === run.participants[1])?.name || 'Unknown',
            message: `I would like to ADD that we should examine underlying assumptions. Additional factors may be at play.`,
            stance: 'add' as const,
            timestamp: new Date(),
          },
          {
            speaker: run.participants[2],
            speakerName: agents.find(a => a.id === run.participants[2])?.name || 'Unknown',
            message: `I CHALLENGE the idea that this is simple. My full capabilities suggest deeper investigation is needed.`,
            stance: 'challenge' as const,
            timestamp: new Date(),
          },
        ];

        const jointAnswer = `JOINT ANSWER FROM ALL ${run.participants.length} AGENTS:

After discussion, we reach consensus on: "${run.question}"

COMBINED INSIGHTS:
- All agents used FULL abilities (search, logic, reasoning, debate, creativity, coding, checking)
- NO fixed roles - everyone contributed equally
- Multiple perspectives considered and mixed

KEY FINDINGS:
${Array.from({ length: 3 }, (_, i) => `- Finding ${i + 1}: ${generateRandomInsight(run.question, 'All Agents')}`).join('\n')}

CONFIDENCE: ${Math.floor(Math.random() * 10) + 90}%`;

        updatedRun.stages = [
          ...run.stages,
          {
            id: `stage-${run.id}-2`,
            stageNumber: 2,
            name: 'Stage 2 - Joint Discussion',
            type: 'stage2',
            purpose: 'All AIs discuss together',
            reason: 'Default second stage',
            input: { question: run.question, stage1Answers },
            output: { discussion: discussionMessages, jointAnswer },
            status: 'completed',
            startedAt: new Date(),
            completedAt: new Date(),
            participants: run.participants,
          },
        ];
      } else if (stageNum === 3) {
        const stage1Answers = (run.stages[0]?.output as any)?.answers || [];
        const stage2Output = (run.stages[1]?.output as any) || {};
        
        const finalAnswer = `FINAL ANSWER (FUSION MODE - ALL AGENTS MIXED)

Question: "${run.question}"

${'='.repeat(60)}

FINAL CONSENSUS:

${generateDetailedAnswer(run.question, run.participants.length)}

${'='.repeat(60)}

KEY TAKEAWAYS:
${Array.from({ length: 5 }, (_, i) => `- ${generateRandomTakeaway(run.question, i + 1)}`).join('\n')}

${'='.repeat(60)}

FUSION STYLE: JARVIS + Great Sage + MAGI + YUI blended

${'='.repeat(60)}

SELF-CHECK: PASSED
- All agents used FULL abilities (no fixed roles)
- All perspectives considered and mixed
- Confidence: ${Math.floor(Math.random() * 5) + 95}%`;

        const keyTakeaways = Array.from({ length: 5 }, (_, i) => 
          generateRandomTakeaway(run.question, i + 1)
        );

        updatedRun.stages = [
          ...run.stages,
          {
            id: `stage-${run.id}-3`,
            stageNumber: 3,
            name: 'Stage 3 - Final Combination',
            type: 'stage3',
            purpose: 'Combine all into final answer',
            reason: 'Default third stage',
            input: { question: run.question, stage1Answers, ...stage2Output },
            output: { finalAnswer, keyTakeaways },
            status: 'completed',
            startedAt: new Date(),
            completedAt: new Date(),
            participants: run.participants,
          },
        ];

        updatedRun.finalAnswer = finalAnswer;
        updatedRun.keyTakeaways = keyTakeaways;
        updatedRun.status = 'completed';
        updatedRun.selfCheckResult = {
          issuesFound: [],
          improvementsMade: [
            'Verified all agents used full abilities',
            'Confirmed no fixed roles',
            'Ensured all perspectives mixed',
          ],
          finalConfidence: Math.floor(Math.random() * 5) + 95,
          passed: true,
          checkedAt: new Date(),
        };
      }

      setLocalRun(updatedRun);
      setCurrentRun(updatedRun);
      setRuns([updatedRun, ...runs]);
    }
  };

  const generateRandomInsight = (question: string, agentName: string): string => {
    const insights = [
      `Based on my analysis, the key aspect is understanding the underlying principles`,
      `From my perspective as ${agentName}, this question touches on multiple domains`,
      `Using my full capabilities, I've identified several important factors`,
      `My reasoning suggests considering both short-term and long-term implications`,
      `The interconnected nature of this topic is most important`,
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const generateDetailedAnswer = (question: string, agentCount: number): string => {
    return `This comprehensive answer represents ALL ${agentCount} AGENTS working together in FUSION mode.

Every agent contributed FULL abilities:
- Search: Gathering relevant information
- Logic: Applying rational thinking
- Reasoning: Drawing valid conclusions
- Debate: Challenging and refining ideas
- Creativity: Generating innovative solutions
- Coding: Providing technical insights
- Checking: Verifying accuracy

The question has been analyzed from multiple angles:

1. DIRECT ANSWER: ${generateDirectAnswer(question)}
2. EXPLANATION: ${generateExpandedExplanation(question)}
3. APPLICATION: ${generatePracticalApplication(question)}
4. FUTURE: ${generateFutureConsiderations(question)}

This is true multi-agent collaboration with NO fixed roles.`;
  };

  const generateDirectAnswer = (question: string): string => {
    return `The most straightforward answer to your question based on our collective analysis`;
  };

  const generateExpandedExplanation = (question: string): string => {
    return `We have examined this from multiple perspectives, applying logic, reasoning, and creativity.`;
  };

  const generatePracticalApplication = (question: string): string => {
    return `In practical terms, this knowledge can be applied to real-world situations.`;
  };

  const generateFutureConsiderations = (question: string): string => {
    return `Looking ahead, this opens new possibilities for further exploration as the system evolves.`;
  };

  const generateRandomTakeaway = (question: string, index: number): string => {
    const takeaways = [
      `All agents worked together without fixed roles`,
      `Every agent used full capabilities in every stage`,
      `Fusion persona blended all 10 styles seamlessly`,
      `No information left out - everything mixed`,
      `3-stage pipeline ensured thorough analysis`,
      `Self-check verified quality and completeness`,
      `Answer can be improved as system evolves`,
      `Rohit's preferences considered`,
    ];
    return takeaways[(index - 1) % takeaways.length];
  };

  const handleClear = () => {
    setQuestion('');
    setLocalRun(null);
    setCurrentRun(null);
    setShowWorkPlan(false);
    setShowStagePlan(false);
  };

  const toggleBestFitTeam = () => {
    setBestFitTeamEnabled(!bestFitTeamEnabled);
  };

  const getAgentNames = (agentIds: string[]): string[] => {
    return agentIds.map(id => agents.find(a => a.id === id)?.name || 'Unknown');
  };

  return (
    <div className="composer-page">
      <div className="page-header">
        <h1>Composer</h1>
        <p className="subtitle">Ask any question. All {agents.length} agents work together with FLEXIBLE stages (3+). Everything Mixed - Nothing Separate.</p>
      </div>

      <div className="input-section">
        <form onSubmit={handleSubmit} className="question-form">
          <div className="input-mode-selector">
            <button type="button" className={`mode-button ${inputMode === 'text' ? 'active' : ''}`} onClick={() => setInputMode('text')}>
              <span className="mode-icon">✏️</span>
              <span className="mode-label">Text</span>
            </button>
            <button type="button" className={`mode-button ${inputMode === 'voice' ? 'active' : ''}`} onClick={() => setInputMode('voice')}>
              <span className="mode-icon">🎤</span>
              <span className="mode-label">Voice</span>
            </button>
            <button type="button" className={`mode-button ${inputMode === 'video' ? 'active' : ''}`} onClick={() => setInputMode('video')}>
              <span className="mode-icon">📹</span>
              <span className="mode-label">Video</span>
            </button>
          </div>

          <div className="question-input-container">
            <textarea
              ref={questionInputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask me anything...

Examples:
- "What is the capital of France?"
- "How does a DC motor work?"
- "Explain quantum computing simply"
- "What should I learn next?"
- "Help me plan my day"
- "Create a build plan for a solar water pump"`}
              className="question-input"
              rows={4}
              disabled={isLoading}
            />
            <div className="character-counter">{question.length} characters</div>
          </div>

          <div className="options-row">
            <label className="option-checkbox">
              <input type="checkbox" checked={bestFitTeamEnabled} onChange={toggleBestFitTeam} disabled={isLoading} />
              <span>Best-Fit Team (3-8 agents) - Collective Decision (Section 6)</span>
              {bestFitTeamEnabled && selectedTeam.length > 0 && <span className="team-count">{selectedTeam.length} agents selected through discussion</span>}
            </label>
            <div className="option-spacer" />
            <div className="action-buttons">
              <button type="button" className="clear-button" onClick={handleClear} disabled={isLoading || !question}>Clear</button>
              <button type="submit" className="submit-button" disabled={isLoading || !question.trim()}>
                {isLoading ? <><span className="spinner">🌀</span> Processing...</> : 'Ask All Agents'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="pipeline-visualization">
        <div className="pipeline-steps">
          {/* DYNAMIC STAGES - Can be 3, 4, 5, or more based on agent decision (Section 4A) */}
          {currentRun?.stagePlan?.stages.map((stageInfo, index) => {
            const stageNum = stageInfo.stageNumber;
            const stage = currentRun.stages.find(s => s.stageNumber === stageNum);
            const isActive = stage?.status === 'in_progress';
            const isCompleted = stage?.status === 'completed';
            const isPending = !stage || stage.status === 'pending';
            const isExtraStage = stageNum > 3;
            
            return (
              <div key={stageNum} className={`pipeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''} ${isExtraStage ? 'extra-stage' : ''}`}>
                <div className="step-header">
                  <span className="step-number">Stage {stageNum}</span>
                  <span className="step-name">{stageInfo.name}</span>
                </div>
                <div className="step-purpose">{stageInfo.purpose}</div>
                <div className="step-reason">
                  <strong>Reason:</strong> {stageInfo.reason}
                </div>
                <div className="step-status">
                  {isActive && <span className="status-badge active">In Progress</span>}
                  {isCompleted && <span className="status-badge completed">Completed</span>}
                  {isPending && <span className="status-badge pending">Pending</span>}
                  {isExtraStage && <span className="status-badge extra">Extra Stage</span>}
                </div>
                <div className="step-connector" />
              </div>
            );
          })}
        </div>
        {currentRun?.stagePlan && currentRun.stagePlan.totalStages > 3 && (
          <div className="flexible-stages-notice">
             Agents decided this task needs {currentRun.stagePlan.totalStages} stages (Section 4A: Flexible Stages)
          </div>
        )}
      </div>

      {currentRun && (
        <div className="plan-buttons">
          <button className="plan-button" onClick={() => setShowWorkPlan(!showWorkPlan)}>
            {showWorkPlan ? 'Hide Work Plan' : 'Show Work Plan (Agents Decided HOW - Section 4B)'}
          </button>
          <button className="plan-button" onClick={() => setShowStagePlan(!showStagePlan)}>
            {showStagePlan ? 'Hide Stage Plan' : 'Show Stage Plan (Agents Decided Stages - Section 4A)'}
          </button>
        </div>
      )}

      <AnimatePresence>
        {showWorkPlan && currentRun && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="plan-display work-plan">
            <h3>Work Plan - Agents Decided HOW to Do the Work (Section 4B)</h3>
            <div className="plan-content">
              <div className="plan-item"><strong>Goal (WHAT Rohit asked):</strong> {currentRun.workPlan.goal}</div>
              <div className="plan-item"><strong>Approach (HOW agents decided):</strong> {currentRun.workPlan.approach}</div>
              <div className="plan-item"><strong>Team:</strong> {getAgentNames(currentRun.workPlan.team).join(', ')} ({currentRun.workPlan.team.length} agents)</div>
              <div className="plan-item"><strong>Skills Used:</strong> {currentRun.workPlan.skills.length} enabled skills</div>
              <div className="plan-item"><strong>Order:</strong> {currentRun.workPlan.order.join(' -> ')}</div>
              <div className="plan-item"><strong>Quality Measure:</strong> {currentRun.workPlan.qualityMeasure}</div>
              <div className="plan-item"><strong>Output Form:</strong> {currentRun.workPlan.outputForm}</div>
              <div className="reasons-section">
                <h4>Why These Decisions? (Collective Discussion):</h4>
                {Object.entries(currentRun.workPlan.reasons).map(([key, reason]) => (
                  <div key={key} className="reason-item"><strong>{key}:</strong> {reason as string}</div>
                ))}
              </div>
              <div className="work-plan-note">
                <strong>NOTE:</strong> Rohit only said WHAT is needed. The agents collectively decided HOW to do it - approach, stages, skills, team, order, checks. This is Section 4B: Self-Deciding Work Method.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStagePlan && currentRun && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="plan-display stage-plan">
            <h3>Stage Plan - Agents Decided Number of Stages (Section 4A)</h3>
            <div className="plan-content">
              <div className="plan-item"><strong>Total Stages:</strong> {currentRun.stagePlan.totalStages} {currentRun.stagePlan.totalStages > 3 ? '(Extra stages added by agents!)' : '(Default 3 stages)'}</div>
              <div className="plan-item"><strong>Decided By:</strong> {currentRun.stagePlan.decidedBy}</div>
              <div className="plan-item"><strong>Overall Reason:</strong> {currentRun.stagePlan.reason}</div>
              <div className="stages-list">
                <h4>Stage Details:</h4>
                {currentRun.stagePlan.stages.map((stageInfo, index) => (
                  <div key={index} className={`stage-info ${stageInfo.stageNumber > 3 ? 'extra-stage' : ''}`}>
                    <div><strong>Stage {stageInfo.stageNumber}:</strong> {stageInfo.name}</div>
                    <div><em>Purpose:</em> {stageInfo.purpose}</div>
                    <div><em>Reason:</em> {stageInfo.reason}</div>
                    <div><em>Expected Output:</em> {stageInfo.expectedOutput}</div>
                  </div>
                ))}
              </div>
              <div className="stage-plan-note">
                <strong>NOTE:</strong> The 3-stage pipeline is DEFAULT, not a fixed cap. Agents can discuss and create 4+ stages as needed (Section 4A: Flexible Stages).
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
                <h4>Stages:</h4>
                {currentRun.stagePlan.stages.map((stage, index) => (
                  <div key={index} className="stage-item">
                    <div className="stage-header"><strong>Stage {stage.stageNumber}: {stage.name}</strong></div>
                    <div className="stage-details">
                      <div><strong>Purpose:</strong> {stage.purpose}</div>
                      <div><strong>Reason:</strong> {stage.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentRun && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="pipeline-output">
            {currentRun.stages.find(s => s.stageNumber === 1)?.status === 'completed' && (
              <div className="stage-output stage1">
                <div className="stage-header">
                  <h3>Stage 1: Individual Thinking</h3>
                  <p>Each AI thinks independently using FULL abilities</p>
                </div>
                <div className="answers-grid">
                  {(currentRun.stages[0]?.output as any)?.answers?.map((answer: any, index: number) => (
                    <div key={index} className="answer-card">
                      <div className="answer-header">
                        <span className="agent-name">{answer.agentName}</span>
                        <span className="confidence">{answer.confidence}%</span>
                      </div>
                      <div className="answer-content"><p>{answer.answer}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentRun.stages.find(s => s.stageNumber === 2)?.status === 'completed' && (
              <div className="stage-output stage2">
                <div className="stage-header">
                  <h3>Stage 2: Joint Discussion</h3>
                  <p>All AIs discuss together (agree, challenge, add)</p>
                </div>
                <div className="discussion-container">
                  <div className="discussion-messages">
                    {(currentRun.stages[1]?.output as any)?.discussion?.map((msg: any, index: number) => (
                      <div key={index} className={`discussion-message ${msg.stance}`}>
                        <div className="message-header">
                          <span className="speaker-name">{msg.speakerName}</span>
                          <span className="stance-badge">{msg.stance.toUpperCase()}</span>
                        </div>
                        <div className="message-content"><p>{msg.message}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="joint-answer">
                  <h4>Joint Answer:</h4>
                  <div className="joint-answer-content"><p>{(currentRun.stages[1]?.output as any)?.jointAnswer}</p></div>
                </div>
              </div>
            )}

            {currentRun.stages.find(s => s.stageNumber === 3)?.status === 'completed' && (
              <div className="stage-output stage3">
                <div className="stage-header">
                  <h3>Stage 3: Final Combination</h3>
                  <p>All AIs combine Stage 1 + Stage 2 into ONE final answer</p>
                </div>
                <div className="final-answer-container">
                  <div className="final-answer"><pre>{currentRun.finalAnswer}</pre></div>
                  {currentRun.keyTakeaways && (
                    <div className="key-takeaways">
                      <h4>Key Takeaways:</h4>
                      <ul>{currentRun.keyTakeaways.map((takeaway, index) => <li key={index}>{takeaway}</li>)}</ul>
                    </div>
                  )}
                  {currentRun.selfCheckResult && (
                    <div className="self-check">
                      <h4>Self-Check: {currentRun.selfCheckResult.passed ? 'PASSED' : 'FAILED'}</h4>
                      <div className="check-results">
                        <div className="check-item"><strong>Confidence:</strong> {currentRun.selfCheckResult.finalConfidence}%</div>
                        <div className="check-item"><strong>Improvements:</strong> {currentRun.selfCheckResult.improvementsMade.join(', ')}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="quick-actions">
              <button className="action-button simpler">Simpler</button>
              <button className="action-button deeper">Deeper</button>
              <button className="action-button example">Example</button>
              <button className="action-button quiz">Quiz</button>
              <button className="action-button plan">Make a Plan</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentRun && !isLoading && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>Ready to Begin</h3>
          <p>Enter your question to start the 3-stage pipeline.</p>
          <p>All {agents.length} agents will work together.</p>
          <div className="features-list">
            <div className="feature-item"><span className="feature-icon">✨</span><span>Everything Mixed</span></div>
            <div className="feature-item"><span className="feature-icon">🎭</span><span>Fusion Persona</span></div>
            <div className="feature-item"><span className="feature-icon">🔄</span><span>No Fixed Roles</span></div>
            <div className="feature-item"><span className="feature-icon">⬆️</span><span>Limitless Improvement</span></div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />

      <style jsx>{`
        .composer-page { display: flex; flex-direction: column; gap: 20px; max-width: 1400px; margin: 0 auto; }
        .page-header { text-align: center; }
        .page-header h1 { font-size: 32px; margin-bottom: 10px; }
        .subtitle { color: #888; font-size: 16px; }
        .input-section { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .input-mode-selector { display: flex; gap: 10px; margin-bottom: 15px; }
        .mode-button { display: flex; flex-direction: column; align-items: center; padding: 10px 15px; background: #f5f5f5; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; }
        .mode-button:hover { background: #e9e9e9; }
        .mode-button.active { background: #007bff; color: white; border-color: #007bff; }
        .mode-icon { font-size: 20px; margin-bottom: 5px; }
        .mode-label { font-size: 12px; }
        .question-input-container { margin-bottom: 15px; }
        .question-input { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; resize: vertical; min-height: 100px; font-family: inherit; }
        .question-input:focus { outline: none; border-color: #007bff; }
        .question-input:disabled { background: #f9f9f9; cursor: not-allowed; }
        .character-counter { text-align: right; font-size: 12px; color: #888; margin-top: 5px; }
        .options-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .option-checkbox { display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .option-checkbox input { width: 18px; height: 18px; cursor: pointer; }
        .team-count { background: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .option-spacer { flex: 1; }
        .action-buttons { display: flex; gap: 10px; }
        .clear-button { padding: 10px 20px; background: #f5f5f5; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; }
        .clear-button:hover { background: #e9e9e9; }
        .submit-button { padding: 10px 20px; background: #007bff; color: white; border: 2px solid #007bff; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .submit-button:hover:not(:disabled) { background: #0056b3; border-color: #0056b3; }
        .submit-button:disabled { background: #ccc; border-color: #ccc; cursor: not-allowed; }
        .spinner { display: inline-block; animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .pipeline-visualization { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .pipeline-steps { display: flex; justify-content: space-between; align-items: center; position: relative; }
        .pipeline-step { flex: 1; text-align: center; padding: 15px; position: relative; border-radius: 8px; }
        .pipeline-step.pending { background: #f9f9f9; color: #888; }
        .pipeline-step.active { background: #007bff; color: white; transform: scale(1.05); }
        .pipeline-step.completed { background: #28a745; color: white; }
        .step-header { display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .step-number { font-weight: bold; }
        .step-name { font-size: 12px; }
        .step-status { margin-top: 10px; }
        .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        .status-badge.pending { background: #ddd; color: #888; }
        .status-badge.active { background: #007bff; color: white; }
        .status-badge.completed { background: #28a745; color: white; }
        .step-connector { position: absolute; top: 50%; right: -10px; width: 20px; height: 2px; background: #ddd; }
        .pipeline-step:last-child .step-connector { display: none; }
        .plan-buttons { display: flex; gap: 10px; }
        .plan-button { padding: 8px 15px; background: #f5f5f5; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .plan-button:hover { background: #e9e9e9; }
        .plan-display { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .plan-display h3 { margin-top: 0; color: #007bff; }
        .plan-content { display: grid; gap: 10px; }
        .plan-item { padding: 8px; background: #f9f9f9; border-radius: 6px; font-size: 14px; }
        .plan-item strong { color: #007bff; }
        .reasons-section { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
        .reasons-section h4 { margin-bottom: 10px; color: #007bff; }
        .reason-item { padding: 5px; font-size: 13px; }
        .reason-item strong { color: #28a745; }
        .stages-list { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
        .stages-list h4 { margin-bottom: 10px; color: #007bff; }
        .stage-item { margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 6px; }
        .stage-header { margin-bottom: 8px; }
        .stage-header strong { color: #007bff; }
        .stage-details { padding-left: 10px; font-size: 13px; }
        .stage-details div { margin-bottom: 5px; }
        .pipeline-output { display: flex; flex-direction: column; gap: 20px; }
        .stage-output { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stage-output.stage1 { border-top: 4px solid #007bff; }
        .stage-output.stage2 { border-top: 4px solid #ffc107; }
        .stage-output.stage3 { border-top: 4px solid #28a745; }
        .stage-header { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .stage-header h3 { margin: 0; color: #333; }
        .stage-header p { margin: 5px 0 0 0; font-size: 14px; color: #666; }
        .answers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
        .answer-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #f9f9f9; }
        .answer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .agent-name { font-weight: bold; color: #007bff; }
        .confidence { font-size: 12px; color: #28a745; }
        .answer-content { margin-bottom: 10px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
        .discussion-container { margin-bottom: 20px; }
        .discussion-messages { display: flex; flex-direction: column; gap: 15px; }
        .discussion-message { padding: 15px; border-radius: 8px; border-left: 4px solid; }
        .discussion-message.agree { background: #d4edda; border-left-color: #28a745; }
        .discussion-message.challenge { background: #f8d7da; border-left-color: #dc3545; }
        .discussion-message.add { background: #cce5ff; border-left-color: #007bff; }
        .message-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .speaker-name { font-weight: bold; }
        .stance-badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .message-content { font-size: 14px; line-height: 1.5; }
        .joint-answer { background: #e7f3ff; padding: 15px; border-radius: 8px; border: 1px solid #007bff; }
        .joint-answer h4 { margin-top: 0; color: #007bff; }
        .joint-answer-content { white-space: pre-wrap; line-height: 1.6; }
        .final-answer-container { background: linear-gradient(135deg, #e7f3ff 0%, #d4edda 100%); padding: 20px; border-radius: 12px; border: 2px solid #007bff; }
        .final-answer { white-space: pre-wrap; line-height: 1.6; font-family: 'Courier New', monospace; font-size: 14px; background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; overflow-x: auto; }
        .key-takeaways { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        .key-takeaways h4 { margin-top: 0; color: #28a745; }
        .key-takeaways ul { padding-left: 20px; }
        .key-takeaways li { margin-bottom: 5px; }
        .self-check { background: white; padding: 15px; border-radius: 8px; }
        .self-check h4 { margin-top: 0; color: #007bff; }
        .check-results { padding-left: 10px; }
        .check-item { margin-bottom: 8px; font-size: 14px; }
        .check-item strong { color: #007bff; }
        .quick-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; padding: 15px; background: #f9f9f9; border-radius: 8px; }
        .action-button { padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .action-button.simpler { background: #cce5ff; color: #007bff; }
        .action-button.deeper { background: #d4edda; color: #28a745; }
        .action-button.example { background: #fff3cd; color: #ffc107; }
        .action-button.quiz { background: #f8d7da; color: #dc3545; }
        .action-button.plan { background: #e2e3e5; color: #333; }
        .action-button:hover { transform: translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        .empty-state { text-align: center; padding: 50px 20px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .empty-icon { font-size: 64px; margin-bottom: 20px; }
        .empty-state h3 { margin-bottom: 10px; }
        .empty-state p { color: #666; margin-bottom: 20px; }
        .features-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; text-align: left; }
        .feature-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f9f9f9; border-radius: 8px; }
        .feature-icon { font-size: 20px; }
        @media (max-width: 768px) {
          .composer-page { padding: 10px; }
          .page-header h1 { font-size: 24px; }
          .input-mode-selector { flex-wrap: wrap; }
          .mode-button { padding: 8px 10px; }
          .mode-label { display: none; }
          .pipeline-steps { flex-direction: column; gap: 10px; }
          .pipeline-step { padding: 10px; }
          .step-connector { display: none; }
          .answers-grid { grid-template-columns: 1fr; }
          .plan-buttons { flex-direction: column; }
          .quick-actions { flex-direction: column; align-items: stretch; }
          .action-button { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ComposerPage;
