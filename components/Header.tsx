import React from 'react';

interface HeaderProps {
  onReset?: () => void;
  currentWeek?: number;
  totalWeeks?: number;
  progressPercent?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  currentWeek = 1,
  totalWeeks = 5,
  progressPercent = 0
}) => {
  const handleSettingsClick = () => {
    if (onReset) {
      if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
        onReset();
      }
    }
  };

  return (
    // Changed 'sticky' to 'relative' and added paddingTop for safe area (notch)
    <div className="relative z-20 bg-white/80 backdrop-blur-md border-b border-primary/10 shadow-sm pt-[env(safe-area-inset-top)]">
      <div className="flex items-center p-5 justify-between">
        <button className="text-text-main flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white hover:bg-primary/10 hover:text-primary transition-all shadow-sm border border-slate-100">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-text-main text-xl font-display font-bold leading-tight flex-1 text-center bg-gradient-to-r from-primary-dark to-secondary bg-clip-text text-transparent">
          Glow Up 5K Plan
        </h2>
        <button
          onClick={handleSettingsClick}
          className="flex size-12 items-center justify-center rounded-2xl bg-white hover:bg-red-50 transition-all shadow-sm border border-red-200 hover:border-red-300 group"
          title="Reset Progress"
        >
          <span className="material-symbols-outlined text-red-500 group-hover:text-red-600 group-hover:rotate-180 transition-all duration-300">restart_alt</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6 pt-0">
        <div className="flex justify-between items-end">
          <p className="text-text-light text-xs font-bold uppercase tracking-widest">Your Journey</p>
          <p className="text-primary-dark font-display font-bold">Week {currentWeek} of {totalWeeks}</p>
        </div>
        <div className="h-4 w-full rounded-full bg-slate-100 shadow-inner overflow-hidden ring-1 ring-white">
          <div
            className="h-full rounded-full bg-gradient-to-r from-secondary to-primary shadow-[0_0_15px_rgba(255,154,174,0.5)] transition-all duration-500 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9zdmc+')]"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1 bg-white/60 p-2 rounded-xl w-fit self-center border border-white shadow-sm">
          <span className="material-symbols-outlined text-primary-dark text-[18px]">favorite</span>
          <p className="text-text-light text-xs font-semibold">Goal: <span className="text-text-main">Sub-25 min</span> ✨</p>
        </div>
      </div>
    </div>
  );
};