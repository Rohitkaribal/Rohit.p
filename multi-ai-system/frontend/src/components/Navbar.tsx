// ============================================
// MULTI-AI SYSTEM - NAVBAR COMPONENT
// Everything Mixed - Nothing Separate
// ============================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FUSION_PERSONA } from '../../shared/constants';

interface NavbarProps {
  onMenuClick: () => void;
  isMobile: boolean;
  runCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, isMobile, runCount }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button className="menu-button" onClick={onMenuClick}>
          <span className="menu-icon">☰</span>
        </button>
      )}

      {/* Logo / System Name */}
      <div className="navbar-brand">
        <Link to="/composer" className="brand-link">
          <span className="brand-name">Multi-AI System</span>
          <span className="brand-subtitle">Omega Core</span>
        </Link>
      </div>

      {/* Persona Indicator */}
      <div className="persona-indicator">
        <span className="persona-badge">
          {FUSION_PERSONA.name.toUpperCase()}
        </span>
      </div>

      {/* Run Counter */}
      <div className="run-counter">
        <Link to="/history" className="counter-link">
          <span className="counter-icon">📜</span>
          <span className="counter-value">{runCount}</span>
          <span className="counter-label">Runs</span>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/composer" className={`action-button ${location.pathname === '/composer' ? 'active' : ''}`}>
          <span className="action-icon">✏️</span>
          <span className="action-label">Compose</span>
        </Link>
        <Link to="/workshop" className={`action-button ${location.pathname === '/workshop' ? 'active' : ''}`}>
          <span className="action-icon">🔬</span>
          <span className="action-label">Workshop</span>
        </Link>
        <Link to="/gamification" className={`action-button ${location.pathname === '/gamification' ? 'active' : ''}`}>
          <span className="action-icon">🎮</span>
          <span className="action-label">Gamify</span>
        </Link>
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .menu-button {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 5px;
          margin-right: 10px;
        }
        
        .menu-icon {
          display: block;
        }
        
        .navbar-brand {
          flex: 1;
        }
        
        .brand-link {
          display: flex;
          flex-direction: column;
          color: white;
          text-decoration: none;
        }
        
        .brand-name {
          font-size: 18px;
          font-weight: bold;
        }
        
        .brand-subtitle {
          font-size: 12px;
          opacity: 0.8;
          color: #00ffff;
        }
        
        .persona-indicator {
          margin: 0 10px;
        }
        
        .persona-badge {
          background: rgba(0, 255, 255, 0.2);
          color: #00ffff;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
          border: 1px solid #00ffff;
        }
        
        .run-counter {
          margin: 0 10px;
        }
        
        .counter-link {
          display: flex;
          align-items: center;
          color: white;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 5px;
          transition: background 0.3s;
        }
        
        .counter-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .counter-icon {
          margin-right: 5px;
        }
        
        .counter-value {
          font-weight: bold;
          margin-right: 5px;
        }
        
        .counter-label {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .quick-actions {
          display: flex;
          gap: 5px;
        }
        
        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s;
          font-size: 12px;
        }
        
        .action-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .action-button.active {
          background: rgba(0, 255, 255, 0.3);
          border: 1px solid #00ffff;
        }
        
        .action-icon {
          font-size: 18px;
          margin-bottom: 3px;
        }
        
        .action-label {
          font-size: 10px;
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .navbar {
            padding: 8px 10px;
          }
          
          .brand-name {
            font-size: 16px;
          }
          
          .brand-subtitle {
            display: none;
          }
          
          .persona-indicator {
            display: none;
          }
          
          .run-counter {
            display: none;
          }
          
          .action-button {
            padding: 6px 8px;
          }
          
          .action-label {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
