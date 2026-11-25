// ============================================
// MULTI-AI SYSTEM - 3D WORKSHOP PAGE (STUB)
// 4 experiments: DC Motor, Electrolysis, Pendulum, Plant Cell
// ============================================

import React from 'react';
import { motion } from 'framer-motion';

const WorkshopPage: React.FC = () => {
  const experiments = [
    { id: 'motor', name: 'DC Motor', description: 'Explode view, remove/join parts, swap magnets, change battery, attach load' },
    { id: 'electrolysis', name: 'Electrolysis', description: 'Split water with electricity - H2:O2 = 2:1 ratio' },
    { id: 'pendulum', name: 'Pendulum', description: 'Formula T = 2π√(L/g) - change gravity between Earth/Moon/Mars/Jupiter' },
    { id: 'plant-cell', name: 'Plant Cell', description: 'Tap organelles, remove/join them, photosynthesis with light' },
  ];

  return (
    <div className="page workshop-page">
      <div className="page-header">
        <h1>JARVIS 3D Hologram Workshop</h1>
        <p className="subtitle">Tony Stark style touchable 3D workshop - Part of Unified Studio (Section 12B)</p>
      </div>
      
      <div className="experiments-grid">
        {experiments.map((experiment) => (
          <motion.div key={experiment.id} className="experiment-card" whileHover={{ scale: 1.02 }}>
            <div className="experiment-header">
              <span className="experiment-icon"></span>
              <h3>{experiment.name}</h3>
            </div>
            <p>{experiment.description}</p>
            <div className="experiment-actions">
              <button className="action-button">Start Experiment</button>
              <button className="action-button secondary">Try This</button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="workshop-info">
        <h3>How It Works (Section 12B):</h3>
        <ol>
          <li>Identify the parts</li>
          <li>Explode view to separate parts</li>
          <li>Remove/join parts</li>
          <li>Change parameters (magnets, battery, gravity, etc.)</li>
          <li>Simulate with real formulas</li>
          <li>Observe results</li>
        </ol>
        <p><strong>NOTE:</strong> This is part of the Unified Studio (Section 9) - not a separate mode.</p>
      </div>
    </div>
  );
};

export default WorkshopPage;
