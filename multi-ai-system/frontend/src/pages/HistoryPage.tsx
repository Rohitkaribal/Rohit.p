// ============================================
// MULTI-AI SYSTEM - HISTORY PAGE
// View past runs and conversations
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PipelineRun, Agent } from '../../shared/types';

interface HistoryPageProps {
  runs: PipelineRun[];
  setCurrentRun: (run: PipelineRun | null) => void;
  agents: Agent[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ runs, setCurrentRun, agents }) => {
  const getAgentNames = (agentIds: string[]): string[] => {
    return agentIds.map(id => agents.find(a => a.id === id)?.name || 'Unknown');
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>History</h1>
        <p className="subtitle">View all past runs and conversations</p>
      </div>

      {runs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <h3>No Runs Yet</h3>
          <p>Start a conversation to see it here.</p>
          <Link to="/composer" className="start-button">
            Start a New Run
          </Link>
        </div>
      ) : (
        <div className="runs-list">
          {runs.map((run, index) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="run-card"
            >
              <div className="run-header">
                <div className="run-info">
                  <span className="run-number">#{runs.length - index}</span>
                  <span className="run-date">{formatDate(run.createdAt)}</span>
                  <span className="run-mode">{run.inputMode}</span>
                </div>
                <div className="run-status">
                  <span className={`status-badge ${run.status}`}>{run.status}</span>
                </div>
              </div>

              <div className="run-question">
                <p>{run.question}</p>
              </div>

              <div className="run-details">
                <div className="detail-item">
                  <span className="detail-label">Stages:</span>
                  <span className="detail-value">{run.stagePlan.totalStages}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Agents:</span>
                  <span className="detail-value">{run.participants.length}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Persona:</span>
                  <span className="detail-value">{run.persona}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Demo:</span>
                  <span className="detail-value">{run.isDemoMode ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="run-actions">
                <button
                  className="action-button view"
                  onClick={() => setCurrentRun(run)}
                >
                  View Full Run
                </button>
                <Link to="/composer" className="action-button redo">
                  Redo with Same Question
                </Link>
              </div>

              {run.finalAnswer && (
                <div className="run-preview">
                  <div className="preview-header">
                    <span>Final Answer Preview:</span>
                  </div>
                  <div className="preview-content">
                    <pre>{run.finalAnswer.substring(0, 200)}{run.finalAnswer.length > 200 ? '...' : ''}</pre>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <style jsx>{`
        .history-page {
          max-width: 1200px;
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
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }
        
        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        
        .empty-state h3 {
          margin-bottom: 10px;
        }
        
        .empty-state p {
          color: #666;
          margin-bottom: 20px;
        }
        
        .start-button {
          display: inline-block;
          padding: 12px 24px;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.3s;
        }
        
        .start-button:hover {
          background: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
        }
        
        .runs-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .run-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
        }
        
        .run-card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .run-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .run-info {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .run-number {
          font-weight: bold;
          color: #007bff;
        }
        
        .run-date {
          font-size: 14px;
          color: #666;
        }
        
        .run-mode {
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .run-status {
          display: flex;
          align-items: center;
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .status-badge.completed {
          background: #d4edda;
          color: #28a745;
        }
        
        .status-badge.in_progress {
          background: #cce5ff;
          color: #007bff;
        }
        
        .status-badge.pending {
          background: #fff3cd;
          color: #ffc107;
        }
        
        .run-question {
          margin-bottom: 15px;
        }
        
        .run-question p {
          font-size: 16px;
          line-height: 1.6;
          color: #333;
        }
        
        .run-details {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .detail-item {
          display: flex;
          gap: 5px;
          font-size: 14px;
        }
        
        .detail-label {
          color: #888;
        }
        
        .detail-value {
          color: #333;
          font-weight: 500;
        }
        
        .run-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .action-button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .action-button.view {
          background: #007bff;
          color: white;
        }
        
        .action-button.view:hover {
          background: #0056b3;
        }
        
        .action-button.redo {
          background: #28a745;
          color: white;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        
        .action-button.redo:hover {
          background: #218838;
        }
        
        .run-preview {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 15px;
        }
        
        .preview-header {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .preview-content {
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          font-family: 'Courier New', monospace;
          overflow-x: auto;
        }
        
        @media (max-width: 768px) {
          .run-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .run-info {
            flex-direction: column;
            gap: 5px;
          }
          
          .run-actions {
            flex-direction: column;
          }
          
          .action-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;
