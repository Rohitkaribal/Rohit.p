// ============================================
// MULTI-AI SYSTEM - DEMO MODE BANNER
// Clearly labeled as specified in Section 17
// ============================================

import React from 'react';
import { motion } from 'framer-motion';

const DemoModeBanner: React.FC = () => {
  return (
    <motion.div
      className="demo-banner"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="banner-content">
        <span className="banner-icon">🎭</span>
        <span className="banner-text">DEMO MODE</span>
        <span className="banner-info">
          All AI perspectives are simulated by one model engine.
          No real API keys are used.
        </span>
      </div>

      <style jsx>{`
        .demo-banner {
          position: fixed;
          top: 10px;
          right: 10px;
          background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
          color: white;
          padding: 10px 15px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
          z-index: 10000;
          max-width: 300px;
          font-size: 12px;
          animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .banner-content {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        
        .banner-icon {
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .banner-text {
          font-weight: bold;
          font-size: 14px;
          flex-shrink: 0;
        }
        
        .banner-info {
          font-size: 11px;
          opacity: 0.9;
          line-height: 1.3;
        }
        
        @media (max-width: 768px) {
          .demo-banner {
            max-width: 250px;
            right: 5px;
            top: 5px;
          }
          
          .banner-info {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          .demo-banner {
            max-width: 120px;
          }
          
          .banner-text {
            font-size: 12px;
          }
          
          .banner-icon {
            font-size: 16px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default DemoModeBanner;
