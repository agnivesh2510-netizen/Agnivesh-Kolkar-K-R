/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import TopAppBar from './components/layout/TopAppBar';
import BottomNavBar from './components/layout/BottomNavBar';
import Dashboard from './components/dashboard/Dashboard';
import NewComplaint from './components/complaint/NewComplaint';
import AnalysisReport from './components/complaint/AnalysisReport';
import Tracker from './components/complaint/Tracker';
import { ViewState } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onNewComplaint={() => setCurrentView('new-complaint')}
            onViewReport={() => setCurrentView('tracker')}
          />
        );
      case 'new-complaint':
        return <NewComplaint onAnalyze={() => setCurrentView('analysis')} />;
      case 'analysis':
        return (
          <AnalysisReport 
            onExecute={() => setCurrentView('tracker')}
            onDiscard={() => setCurrentView('dashboard')}
          />
        );
      case 'tracker':
        return <Tracker />;
      default:
        return <Dashboard onNewComplaint={() => setCurrentView('new-complaint')} onViewReport={() => setCurrentView('tracker')} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopAppBar 
        userName="agnivesh" 
        userImage="https://lh3.googleusercontent.com/a/ACg8ocJO0UqGvG6vG-W-X-Y-Z-A=s96-c" 
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      <BottomNavBar currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}
