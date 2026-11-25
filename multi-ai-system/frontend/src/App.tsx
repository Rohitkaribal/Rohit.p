// ============================================
// MULTI-AI SYSTEM - MAIN APP COMPONENT
// Everything Mixed - Nothing Separate
// ============================================

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ComposerPage from './pages/ComposerPage';
import HistoryPage from './pages/HistoryPage';
import RosterPage from './pages/RosterPage';
import SkillsPage from './pages/SkillsPage';
import WorkshopPage from './pages/WorkshopPage';
import MakerPage from './pages/MakerPage';
import GamificationPage from './pages/GamificationPage';
import MemoryPage from './pages/MemoryPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DemoModeBanner from './components/DemoModeBanner';
import { AGENT_ROSTER, SKILLS, FUSION_PERSONA, SYSTEM_CONFIG } from '../shared/constants';
import type { Agent, Skill, PipelineRun } from '../shared/types';

// Main App Component
const App: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentRun, setCurrentRun] = useState<PipelineRun | null>(null);
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar
  const closeSidebar = () => setIsSidebarOpen(false);

  // Page transition animations
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  };

  return (
    <div className="app-container">
      {/* Demo Mode Banner */}
      <DemoModeBanner />

      {/* Navbar */}
      <Navbar 
        onMenuClick={toggleSidebar} 
        isMobile={isMobile} 
        runCount={runs.length}
      />

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        isMobile={isMobile}
      />

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen && isMobile ? 'sidebar-open' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="page-content"
          >
            <Routes location={location} key={location.pathname}>
              {/* Default route - redirect to composer */}
              <Route path="/" element={<Navigate to="/composer" replace />} />
              
              {/* Composer - Main input page */}
              <Route 
                path="/composer" 
                element={
                  <ComposerPage 
                    agents={AGENT_ROSTER} 
                    skills={SKILLS} 
                    persona={FUSION_PERSONA} 
                    config={SYSTEM_CONFIG}
                    runs={runs}
                    setRuns={setRuns}
                    setCurrentRun={setCurrentRun}
                  />
                }
              />
              
              {/* History - View past runs */}
              <Route 
                path="/history" 
                element={
                  <HistoryPage 
                    runs={runs} 
                    setCurrentRun={setCurrentRun}
                    agents={AGENT_ROSTER}
                  />
                }
              />
              
              {/* Roster - View all agents */}
              <Route 
                path="/roster" 
                element={<RosterPage agents={AGENT_ROSTER} />} 
              />
              
              {/* Skills - View all skills */}
              <Route 
                path="/skills" 
                element={<SkillsPage skills={SKILLS} />} 
              />
              
              {/* Workshop - 3D experiments */}
              <Route 
                path="/workshop" 
                element={<WorkshopPage agents={AGENT_ROSTER} />} 
              />
              
              {/* Maker - Build machines */}
              <Route 
                path="/maker" 
                element={<MakerPage agents={AGENT_ROSTER} />} 
              />
              
              {/* Gamification - XP, missions, achievements */}
              <Route 
                path="/gamification" 
                element={<GamificationPage agents={AGENT_ROSTER} />} 
              />
              
              {/* Memory - Profile and memories */}
              <Route 
                path="/memory" 
                element={<MemoryPage agents={AGENT_ROSTER} />} 
              />
              
              {/* Settings */}
              <Route 
                path="/settings" 
                element={<SettingsPage config={SYSTEM_CONFIG} />} 
              />
              
              {/* 404 - Not found */}
              <Route 
                path="*" 
                element={
                  <div className="not-found">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <button onClick={() => window.location.href = '/composer'}>Go to Composer</button>
                  </div>
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Style tags for demo mode */}
      <style jsx global>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .main-content {
          flex: 1;
          margin-left: 0;
          transition: margin-left 0.3s ease;
        }
        
        .main-content.sidebar-open {
          margin-left: 250px;
        }
        
        .page-content {
          padding: 20px;
          min-height: calc(100vh - 60px);
        }
        
        .not-found {
          text-align: center;
          padding: 50px;
          color: #666;
        }
        
        .not-found h1 {
          font-size: 48px;
          margin-bottom: 20px;
        }
        
        .not-found p {
          font-size: 18px;
          margin-bottom: 30px;
        }
        
        .not-found button {
          padding: 12px 24px;
          font-size: 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .not-found button:hover {
          background: #0056b3;
        }
        
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }
          
          .main-content.sidebar-open {
            margin-left: 0;
          }
          
          .page-content {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
