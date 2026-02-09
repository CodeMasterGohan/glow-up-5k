import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-[pulse_6s_infinite]"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-[pulse_8s_infinite]"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-[pulse_7s_infinite]"></div>
      </div>

      <div className="relative flex h-full w-full max-w-md mx-auto flex-col min-h-screen bg-white/50 backdrop-blur-sm border-x border-white/50 shadow-2xl shadow-indigo-100">
        <div className="flex-1 pb-24">
            {children}
        </div>
        
        <Navbar activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </>
  );
};