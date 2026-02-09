import React from 'react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'plan', icon: 'calendar_month', label: 'Plan' },
    { id: 'stats', icon: 'bar_chart', label: 'Stats' },
    { id: 'races', icon: 'emoji_events', label: 'Races', hasBadge: true },
  ];

  return (
    // Fixed position relative to viewport, centered for large screens, safe area padding at bottom
    <nav className="fixed bottom-0 z-30 w-full max-w-md left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border-t border-slate-100 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2 rounded-t-[2rem] shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-end h-14">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 w-20 transition-colors bubble-hover ${
                isActive ? 'text-primary-dark' : 'text-slate-400 hover:text-primary'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/10' : 'hover:bg-slate-50'}`}>
                 <div className="relative">
                    <span className="material-symbols-outlined">{tab.icon}</span>
                    {tab.hasBadge && !isActive && (
                        <span className="absolute top-0 right-0 size-2 bg-accent rounded-full border border-white"></span>
                    )}
                 </div>
              </div>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};