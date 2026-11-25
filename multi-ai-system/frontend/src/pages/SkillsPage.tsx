// ============================================
// MULTI-AI SYSTEM - SKILLS PAGE (STUB)
// To be implemented - All 40 skills displayed
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '../shared/constants';
import type { Skill } from '../shared/types';

interface SkillsPageProps {
  skills: Skill[];
}

const SkillsPage: React.FC<SkillsPageProps> = ({ skills = SKILLS }) => {
  return (
    <div className="page skills-page">
      <div className="page-header">
        <h1>Skills Hub</h1>
        <p className="subtitle">All 40 skills available - Everything Mixed - Nothing Separate</p>
      </div>
      
      <div className="skills-grid">
        {skills.map((skill) => (
          <motion.div key={skill.id} className="skill-card" whileHover={{ scale: 1.02 }}>
            <div className="skill-header">
              <span className="skill-icon"></span>
              <h3>{skill.name}</h3>
            </div>
            <p>{skill.description}</p>
            <div className="skill-meta">
              <span className="skill-category">{skill.category}</span>
              <span className="skill-status">{skill.isEnabled ? 'Enabled' : 'Requires Approval'}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="page-note">
        <strong>NOTE:</strong> All 40 skills are available to every agent in every stage. No skill is locked to any one agent. Skills are mixed together in one single model.
      </div>
    </div>
  );
};

export default SkillsPage;
