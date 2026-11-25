// ============================================
// MULTI-AI SYSTEM - SIDEBAR COMPONENT
// Everything Mixed - Nothing Separate
// ============================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();

  // Navigation items
  const navItems = [
    {
      path: '/composer',
      icon: '✏️',
      label: 'Composer',
      description: 'Ask questions and get answers',
    },
    {
      path: '/history',
      icon: '📜',
      label: 'History',
      description: 'View past runs and conversations',
    },
    {
      path: '/roster',
      icon: '👥',
      label: 'Roster',
      description: 'All 105 agents',
    },
    {
      path: '/skills',
      icon: '✨',
      label: 'Skills',
      description: 'All 40 skills',
    },
    {
      path: '/workshop',
      icon: '🔬',
      label: '3D Workshop',
      description: 'DC Motor, Electrolysis, Pendulum, Plant Cell',
    },
    {
      path: '/maker',
      icon: '🔨',
      label: 'Maker Workshop',
      description: 'Build machines with 33 parts',
    },
    {
      path: '/gamification',
      icon: '🎮',
      label: 'Gamification',
      description: 'XP, missions, streak, achievements',
    },
    {
      path: '/memory',
      icon: '🧠',
      label: 'Memory',
      description: 'Profile, memories, corrections',
    },
    {
      path: '/settings',
      icon: '⚙️',
      label: 'Settings',
      description: 'System configuration',
    },
  ];

  // Sidebar variants for animation
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
      },
    },
    closed: {
      x: -250,
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
      },
    },
  };

  // Overlay variants
  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="overlay"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={onClose}
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`sidebar ${isMobile ? 'mobile' : 'desktop'}`}
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="header-content">
                <span className="header-icon">🤖</span>
                <span className="header-title">Multi-AI System</span>
              </div>
              {isMobile && (
                <button className="close-button" onClick={onClose}>
                  ✕
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={isMobile ? onClose : undefined}
                >
                  <div className="nav-icon">{item.icon}</div>
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="sidebar-footer">
              <div className="footer-info">
                <div className="info-item">
                  <span className="info-icon">🎯</span>
                  <span className="info-text">Everything Mixed</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🔄</span>
                  <span className="info-text">No Separate Roles</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">⬆️</span>
                  <span className="info-text">Limitless Improvement</span>
                </div>
              </div>
            </div>

            <style jsx>{`
              .overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
              }
              
              .sidebar {
                position: fixed;
                top: 0;
                left: 0;
                width: 250px;
                height: 100vh;
                background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
                color: white;
                z-index: 1000;
                display: flex;
                flex-direction: column;
              }
              
              .sidebar-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              }
              
              .header-content {
                display: flex;
                align-items: center;
                gap: 10px;
              }
              
              .header-icon {
                font-size: 24px;
              }
              
              .header-title {
                font-size: 16px;
                font-weight: bold;
              }
              
              .close-button {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
              }
              
              .sidebar-nav {
                flex: 1;
                padding: 10px;
                overflow-y: auto;
              }
              
              .nav-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 15px;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.3s;
                margin-bottom: 5px;
              }
              
              .nav-item:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
              }
              
              .nav-item.active {
                background: rgba(0, 255, 255, 0.2);
                color: #00ffff;
                border: 1px solid #00ffff;
              }
              
              .nav-icon {
                font-size: 20px;
                width: 30px;
                text-align: center;
              }
              
              .nav-content {
                display: flex;
                flex-direction: column;
              }
              
              .nav-label {
                font-size: 14px;
                font-weight: 500;
              }
              
              .nav-description {
                font-size: 11px;
                opacity: 0.6;
              }
              
              .sidebar-footer {
                padding: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
              }
              
              .footer-info {
                display: flex;
                flex-direction: column;
                gap: 8px;
              }
              
              .info-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                opacity: 0.7;
              }
              
              .info-icon {
                font-size: 14px;
              }
              
              .info-text {
                flex: 1;
              }
              
              @media (max-width: 768px) {
                .sidebar {
                  width: 100%;
                }
                
                .nav-item {
                  padding: 10px 12px;
                }
                
                .nav-description {
                  display: none;
                }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
