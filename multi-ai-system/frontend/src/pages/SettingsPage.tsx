// ============================================
// MULTI-AI SYSTEM - SETTINGS PAGE (STUB)
// System Configuration, API Keys, Preferences
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SYSTEM_CONFIG } from '../shared/constants';

const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState(SYSTEM_CONFIG);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const handleAddApiKey = () => {
    if (newKeyName.trim() && newKeyValue.trim()) {
      setApiKeys({...apiKeys, [newKeyName]: newKeyValue});
      setNewKeyName('');
      setNewKeyValue('');
    }
  };

  return (
    <div className="page settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="subtitle">System Configuration & API Keys</p>
      </div>
      
      <motion.div className="settings-section" whileHover={{ scale: 1.01 }}>
        <h3>System Configuration</h3>
        <div className="config-grid">
          <div className="config-item">
            <label>Demo Mode:</label>
            <span>{config.demoMode ? 'ON (Simulated)' : 'OFF (Real APIs)'}</span>
          </div>
          <div className="config-item">
            <label>Fusion Persona:</label>
            <span>Always ON (All 10 styles mixed)</span>
          </div>
          <div className="config-item">
            <label>Flexible Stages:</label>
            <span>Enabled (Agents can add extra stages)</span>
          </div>
          <div className="config-item">
            <label>Self-Deciding Work Method:</label>
            <span>Enabled (Agents decide HOW to do work)</span>
          </div>
          <div className="config-item">
            <label>Limitless Improvement:</label>
            <span>Enabled (NO cap on level/points/upgrades)</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div className="settings-section" whileHover={{ scale: 1.01 }}>
        <h3>API Keys Management</h3>
        <p><strong>IMPORTANT:</strong> API keys are ALWAYS added/approved by Rohit himself through secure method. The system must NEVER search for, copy, create, or steal API keys (Section 5).</p>
        
        <div className="api-keys-list">
          {Object.entries(apiKeys).map(([name, value]) => (
            <div key={name} className="api-key-item">
              <span className="api-key-name">{name}</span>
              <span className="api-key-value">{'*'.repeat(value.length)}</span>
            </div>
          ))}
        </div>
        
        <div className="api-key-input">
          <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="API Provider Name" />
          <input type="password" value={newKeyValue} onChange={(e) => setNewKeyValue(e.target.value)} placeholder="API Key" />
          <button onClick={handleAddApiKey}>Add Key (Rohit Only)</button>
        </div>
        
        <p className="api-note">
          <strong>Note:</strong> In Demo Mode, all providers are simulated. In Real Mode, Rohit adds his own keys securely.
        </p>
      </motion.div>
      
      <motion.div className="settings-section" whileHover={{ scale: 1.01 }}>
        <h3>Preferences</h3>
        <div className="preferences-form">
          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked /> Best-Fit Team (Default ON)
            </label>
            <span>3-8 agents selected through collective discussion</span>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked /> Auto-Save Runs
            </label>
            <span>Save all pipeline runs to history</span>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" defaultChecked /> Show Fusion Panel
            </label>
            <span>Display all 10 persona styles in answers</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div className="settings-section" whileHover={{ scale: 1.01 }}>
        <h3>Safety & Boundaries</h3>
        <ul>
          <li>Safety limits apply to all agents/personas/skills</li>
          <li>No "Unrestricted/limitless/no filters" mode</li>
          <li>No real action without Rohit's approval (send, buy, payment, delete, submit, publish)</li>
          <li>No help with private information, identification, tracking, or surveillance</li>
          <li>No help with hacking/intrusion</li>
          <li>No password or payment without Rohit's approval</li>
        </ul>
        <p><strong>NOTE:</strong> "Limitless" only applies to IMPROVEMENT/LEVEL-UP (Section 16). Safety limits stay.</p>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
