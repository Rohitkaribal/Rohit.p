// ============================================
// MULTI-AI SYSTEM - ROSTER PAGE
// View all 105 agents
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Agent } from '../../shared/types';

interface RosterPageProps {
  agents: Agent[];
}

const RosterPage: React.FC<RosterPageProps> = ({ agents }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'date'>('name');

  // Get unique categories
  const categories = [...new Set(agents.map(a => a.category))];

  // Filter and sort agents
  const filteredAgents = agents
    .filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || agent.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  return (
    <div className="roster-page">
      <div className="page-header">
        <h1>Roster</h1>
        <p className="subtitle">All {agents.length} Agents - Everything Mixed, Nothing Separate</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="category-filter">
          <select value={selectedCategory || ''} onChange={(e) => setSelectedCategory(e.target.value || null)}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="sort-options">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'date')}>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="date">Date Added</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="summary">
        <p>Showing {filteredAgents.length} of {agents.length} agents</p>
        {selectedCategory && (
          <p>Category: {selectedCategory}</p>
        )}
      </div>

      {/* Agents Grid */}
      <div className="agents-grid">
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="agent-card"
          >
            <div className="agent-header">
              <div className="agent-name-row">
                <span className="agent-number">#{agents.indexOf(agent) + 1}</span>
                <span className="agent-name">{agent.name}</span>
              </div>
              <span className={`agent-status ${agent.isActive ? 'active' : 'inactive'}`}>
                {agent.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="agent-category">
              <span className="category-badge">{agent.category}</span>
            </div>

            <div className="agent-description">
              <p>{agent.description}</p>
            </div>

            <div className="agent-capabilities">
              <div className="capabilities-list">
                {agent.capabilities.slice(0, 3).map((cap, i) => (
                  <span key={i} className="capability-tag">{cap}</span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span className="capability-tag more">+{agent.capabilities.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="agent-footer">
              <span className="agent-date">
                Added: {new Date(agent.createdAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="category-breakdown">
        <h3>Category Breakdown</h3>
        <div className="breakdown-grid">
          {categories.map(category => {
            const count = agents.filter(a => a.category === category).length;
            const percentage = ((count / agents.length) * 100).toFixed(1);
            return (
              <div key={category} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-category">{category}</span>
                  <span className="breakdown-count">{count}</span>
                </div>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${percentage}%` }} />
                </div>
                <div className="breakdown-percentage">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Notes */}
      <div className="important-notes">
        <h3>⚠️ Important Notes</h3>
        <ul>
          <li><strong>Everything Mixed:</strong> All {agents.length} agents work together in ONE single model. No agent is separate.</li>
          <li><strong>No Fixed Roles:</strong> Every agent uses FULL abilities (search, logic, reasoning, debate, creativity, coding, checking) in every stage.</li>
          <li><strong>Correct Spellings:</strong> OpenClaw (C-L-A-W, NOT Open Claude), Open JEV (J-E-V, NOT Open JEV Jarvis), Jarvis, OpenJarvis, Open Jarvis are all separate names.</li>
          <li><strong>Demo Mode:</strong> In demo mode, all agents are simulated by one model engine. Real mode requires Rohit's API keys.</li>
        </ul>
      </div>

      <style jsx>{`
        .roster-page {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .page-header h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .subtitle {
          color: #888;
          font-size: 16px;
        }
        
        .controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .search-box {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        
        .search-box input {
          width: 100%;
          padding: 10px 35px 10px 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }
        
        .search-box input:focus {
          outline: none;
          border-color: #007bff;
        }
        
        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          font-size: 16px;
        }
        
        .category-filter select,
        .sort-options select {
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        }
        
        .sort-options {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .sort-options label {
          font-size: 14px;
          color: #666;
        }
        
        .summary {
          margin-bottom: 20px;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        
        .summary p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
        
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .agent-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
        }
        
        .agent-card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        
        .agent-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .agent-number {
          font-size: 12px;
          color: #888;
          font-weight: bold;
        }
        
        .agent-name {
          font-size: 18px;
          font-weight: bold;
          color: #007bff;
        }
        
        .agent-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .agent-status.active {
          background: #d4edda;
          color: #28a745;
        }
        
        .agent-status.inactive {
          background: #f8d7da;
          color: #dc3545;
        }
        
        .agent-category {
          margin-bottom: 10px;
        }
        
        .category-badge {
          padding: 4px 10px;
          background: #e7f3ff;
          color: #007bff;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .agent-description {
          margin-bottom: 15px;
        }
        
        .agent-description p {
          font-size: 14px;
          line-height: 1.5;
          color: #666;
        }
        
        .agent-capabilities {
          margin-bottom: 10px;
        }
        
        .capabilities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        
        .capability-tag {
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
        }
        
        .capability-tag.more {
          background: #e7f3ff;
          color: #007bff;
        }
        
        .agent-footer {
          padding-top: 10px;
          border-top: 1px solid #eee;
        }
        
        .agent-date {
          font-size: 12px;
          color: #888;
        }
        
        .category-breakdown {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        
        .category-breakdown h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #333;
        }
        
        .breakdown-grid {
          display: grid;
          gap: 15px;
        }
        
        .breakdown-item {
          padding: 10px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        
        .breakdown-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        
        .breakdown-category {
          font-weight: 500;
          color: #333;
        }
        
        .breakdown-count {
          font-weight: bold;
          color: #007bff;
        }
        
        .breakdown-bar {
          height: 8px;
          background: #e9e9e9;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 5px;
        }
        
        .breakdown-fill {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #0056b3);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        .breakdown-percentage {
          font-size: 12px;
          color: #666;
          text-align: right;
        }
        
        .important-notes {
          background: #fff3cd;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid #ffc107;
        }
        
        .important-notes h3 {
          margin-top: 0;
          color: #856404;
        }
        
        .important-notes ul {
          padding-left: 20px;
        }
        
        .important-notes li {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .important-notes strong {
          color: #856404;
        }
        
        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
          }
          
          .search-box {
            width: 100%;
          }
          
          .agents-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RosterPage;
