/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, X } from 'lucide-react';
import TopAppBar from './components/layout/TopAppBar';
import BottomNavBar from './components/layout/BottomNavBar';
import Dashboard from './components/dashboard/Dashboard';
import NewComplaint from './components/complaint/NewComplaint';
import AnalysisReport from './components/complaint/AnalysisReport';
import Tracker from './components/complaint/Tracker';
import LoginPage from './components/auth/LoginPage';
import LanguageSelector from './components/auth/LanguageSelector';
import ProfilePage from './components/profile/ProfilePage';
import SettingsModal from './components/dashboard/SettingsModal';
import { ViewState, Report, Notification, Activity } from './types';
import { analyzeComplaint, AnalysisResult } from './services/geminiService';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

interface User {
  name: string;
  email: string;
  avatar: string;
}

function AppContent({ onSetLanguage, selectedLanguage }: { onSetLanguage: (lang: string) => void, selectedLanguage: string | null }) {
  const { setLanguage } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'REF-2044',
      title: 'Resolved Street Lighting',
      category: 'Infrastructure',
      urgency: 'Medium',
      status: 'Resolved',
      timeAgo: '2 days ago',
      description: 'Street light at sector 4 corner was fixed.',
      imageUrl: 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&q=80&w=400',
      estimatedDays: 3,
      rating: 5
    }
  ]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [emailNotification, setEmailNotification] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Civic Hub',
      message: 'Thank you for joining our platform. Start reporting civic issues to improve our city.',
      time: '2 hours ago',
      isRead: false
    }
  ]);

  const handleStartAnalysis = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeComplaint(text);
      setAnalysisResult(result);
      setCurrentView('analysis');
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback for demo if API fails
      setAnalysisResult({
        title: "Pothole / Infrastructure Issue",
        category: "Infrastructure",
        urgency: "High",
        description: text,
        location: "Location detected from report",
        nextActions: [
          { title: "Manual Review", detail: "Officer needs to verify the details." },
          { title: "Contact Submitter", detail: "Reach out for more evidence." },
          { title: "Dispatch Crew", detail: "Assign maintenance team to site." }
        ]
      });
      setCurrentView('analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExecuteActions = () => {
    if (analysisResult && currentUser) {
      const urgencyDays = {
        'Critical': 1,
        'High': 3,
        'Medium': 7,
        'Low': 14
      };

      const newReport: Report = {
        id: `REF-${Math.floor(Math.random() * 9000) + 1000}`,
        title: analysisResult.title,
        category: analysisResult.category,
        urgency: analysisResult.urgency,
        status: 'In Progress',
        timeAgo: 'Just now',
        description: analysisResult.description,
        imageUrl: 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&q=80&w=400',
        estimatedDays: urgencyDays[analysisResult.urgency as keyof typeof urgencyDays] || 5
      };
      setReports([newReport, ...reports]);
      
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        type: 'pending',
        title: 'Report Registered',
        detail: `Complaint "${newReport.title}" successfully logged.`,
        timeAgo: 'Just now'
      };
      setActivities([newActivity, ...activities]);
      
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        title: 'Report Submitted',
        message: `Your report "${newReport.title}" has been successfully submitted and is under review.`,
        time: 'Just now',
        isRead: false
      };
      setNotifications([newNotification, ...notifications]);

      // Simulate external notification
      setEmailNotification(`Official confirmation sent to ${currentUser.email}`);
      setTimeout(() => setEmailNotification(null), 5000);
      
      setAnalysisResult(null);
      setCurrentView('tracker');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onSetLanguage('');
    setCurrentView('dashboard');
    setReports([]);
    setActivities([]);
    setNotifications([]);
  };

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  if (!selectedLanguage) {
    return <LanguageSelector userName={currentUser.name} onSelect={(lang) => {
      onSetLanguage(lang);
      setLanguage(lang);
    }} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            reports={reports}
            activities={activities}
            onNewComplaint={() => setCurrentView('new-complaint')}
            onViewReport={() => setCurrentView('tracker')}
          />
        );
      case 'new-complaint':
        return <NewComplaint onAnalyze={handleStartAnalysis} isLoading={isAnalyzing} />;
      case 'analysis':
        return (
          <AnalysisReport 
            data={analysisResult}
            onExecute={handleExecuteActions}
            onDiscard={() => setCurrentView('dashboard')}
          />
        );
      case 'tracker':
        return <Tracker report={reports[0]} />;
      case 'profile':
        return (
          <ProfilePage 
            user={currentUser} 
            onUpdateUser={setCurrentUser} 
            onLogout={handleLogout}
            onBack={() => setCurrentView('dashboard')} 
          />
        );
      default:
        return <Dashboard reports={reports} activities={activities} onNewComplaint={() => setCurrentView('new-complaint')} onViewReport={() => setCurrentView('tracker')} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopAppBar 
        userName={currentUser.name} 
        userImage={currentUser.avatar} 
        notifications={notifications}
        onDeleteNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
        onProfileClick={() => setCurrentView('profile')}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onLogout={handleLogout}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>

        {/* Email Notification Toast */}
        <AnimatePresence>
          {emailNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-md w-[calc(100%-32px)] max-w-md"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">External Notification</p>
                <p className="font-bold text-sm">{emailNotification}</p>
              </div>
              <button 
                onClick={() => setEmailNotification(null)}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavBar currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  return (
    <ThemeProvider>
      <LanguageProvider initialLanguage={selectedLanguage || 'en'}>
        <AppContent onSetLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
