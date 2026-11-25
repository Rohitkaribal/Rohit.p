// ============================================
// MULTI-AI SYSTEM - MEMORY PAGE (STUB)
// User Profile, Long-Term Memory, Corrections, Learning Context
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MemoryPage: React.FC = () => {
  const [profile, setProfile] = useState({
    level: 'medium',
    preferredStyle: 'story',
    depth: 'detailed',
    specialNotes: '',
  });
  const [memories, setMemories] = useState<string[]>([]);
  const [corrections, setCorrections] = useState<string[]>([]);
  const [newMemory, setNewMemory] = useState('');
  const [newCorrection, setNewCorrection] = useState('');

  const handleAddMemory = () => {
    if (newMemory.trim()) {
      setMemories([...memories, newMemory]);
      setNewMemory('');
    }
  };

  const handleAddCorrection = () => {
    if (newCorrection.trim()) {
      setCorrections([...corrections, newCorrection]);
      setNewCorrection('');
    }
  };

  return (
    <div className="page memory-page">
      <div className="page-header">
        <h1>Memory, Learning & Personalisation</h1>
        <p className="subtitle">All memories apply to every future answer (Section 13)</p>
      </div>
      
      <motion.div className="memory-section" whileHover={{ scale: 1.01 }}>
        <h3>User Profile</h3>
        <div className="profile-form">
          <div className="form-group">
            <label>Level:</label>
            <select value={profile.level} onChange={(e) => setProfile({...profile, level: e.target.value})}>
              <option value="beginner">Beginner</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label>Preferred Style:</label>
            <select value={profile.preferredStyle} onChange={(e) => setProfile({...profile, preferredStyle: e.target.value})}>
              <option value="story">Story</option>
              <option value="analogy">Analogy</option>
              <option value="steps">Step-by-Step</option>
              <option value="quiz">Quiz</option>
              <option value="simple">Simple</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Depth:</label>
            <select value={profile.depth} onChange={(e) => setProfile({...profile, depth: e.target.value})}>
              <option value="simple">Simple</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Special Notes:</label>
            <textarea value={profile.specialNotes} onChange={(e) => setProfile({...profile, specialNotes: e.target.value})} />
          </div>
        </div>
      </motion.div>
      
      <motion.div className="memory-section" whileHover={{ scale: 1.01 }}>
        <h3>Long-Term Memory</h3>
        <p>4 kinds: preference, fact, style, note</p>
        <div className="memory-list">
          {memories.map((memory, index) => (
            <div key={index} className="memory-item">{memory}</div>
          ))}
        </div>
        <div className="memory-input">
          <input type="text" value={newMemory} onChange={(e) => setNewMemory(e.target.value)} placeholder="Add a memory..." />
          <button onClick={handleAddMemory}>Add Memory</button>
        </div>
      </motion.div>
      
      <motion.div className="memory-section" whileHover={{ scale: 1.01 }}>
        <h3>Corrections / Feedback Loop</h3>
        <p>Corrections apply to every future answer</p>
        <div className="corrections-list">
          {corrections.map((correction, index) => (
            <div key={index} className="correction-item">{correction}</div>
          ))}
        </div>
        <div className="correction-input">
          <input type="text" value={newCorrection} onChange={(e) => setNewCorrection(e.target.value)} placeholder="Add a correction..." />
          <button onClick={handleAddCorrection}>Add Correction</button>
        </div>
      </motion.div>
      
      <motion.div className="memory-section" whileHover={{ scale: 1.01 }}>
        <h3>Learning Context</h3>
        <p>Before every prompt, this block is added:</p>
        <ul>
          <li>Profile (level, style, depth, notes)</li>
          <li>Last 5 feedback/corrections</li>
          <li>All enabled/taught skills</li>
          <li>Last 12 memories</li>
          <li>Last 3 tasks</li>
        </ul>
        <p><strong>This is the agents' "learning"</strong></p>
      </motion.div>
      
      <div className="memory-note">
        <strong>NOTE:</strong> Memory is always editable/deletable - no memory is forcibly permanent (Section 13).
      </div>
    </div>
  );
};

export default MemoryPage;
