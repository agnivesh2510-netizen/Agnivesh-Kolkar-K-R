import { LayoutDashboard, PlusSquare, BarChart3, ClipboardList } from 'lucide-react';
import { ViewState } from '../../types';

interface BottomNavBarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export default function BottomNavBar({ currentView, onNavigate }: BottomNavBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-complaint', label: 'New', icon: PlusSquare },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'tracker', label: 'Tracker', icon: ClipboardList },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 bg-white border-t border-outline-variant">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id as ViewState)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
              isActive 
                ? 'bg-surface-container text-primary rounded-md' 
                : 'text-outline hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
            <span className="text-[11px] font-medium mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
