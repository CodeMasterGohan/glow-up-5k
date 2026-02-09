import React from 'react';
import { WeekPlan, WeekStatus, DayPlan } from '../types';
import { DayCard } from './DayCard';

interface WeekCardProps {
  week: WeekPlan;
  isOpen: boolean;
  onToggle: () => void;
  onStartWorkout: (day: DayPlan) => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({ week, isOpen, onToggle, onStartWorkout }) => {
  const isLocked = week.status === WeekStatus.Locked;
  const isCompleted = week.status === WeekStatus.Completed;

  if (isCompleted) {
    return (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-soft overflow-hidden transition-all duration-300">
            <button 
                onClick={onToggle}
                className="w-full flex cursor-pointer items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white hover:from-primary/5 hover:to-white transition-colors"
            >
                <div className="flex items-center gap-4 text-left">
                    <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 shadow-inner">
                        <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                    </div>
                    <div>
                        <p className="text-text-main text-lg font-display font-bold">{week.title}</p>
                        <p className="text-text-light text-sm font-medium">{week.subtitle}</p>
                    </div>
                </div>
                <span className={`material-symbols-outlined text-text-light transition-transform duration-300 bg-slate-100 rounded-full p-1 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {isOpen && (
                <div className="p-5 border-t border-slate-50 bg-slate-50/50 animate-[fadeIn_0.3s_ease-out]">
                    <p className="text-text-light text-sm text-center font-medium">Week completed. You're amazing! 💖</p>
                </div>
            )}
        </div>
    );
  }

  if (isLocked) {
      return (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm opacity-70 grayscale-[0.5]">
             <button className="w-full flex cursor-pointer items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 text-left">
                    <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <div>
                        <p className="text-text-main text-lg font-display font-bold">{week.title}</p>
                        <p className="text-text-light text-sm">{week.subtitle}</p>
                    </div>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
        </div>
      );
  }

  // Active Week
  return (
    <div className={`rounded-3xl bg-white border-2 overflow-hidden shadow-soft transition-all duration-500 ${isOpen ? 'border-primary/20 ring-4 ring-primary/5' : 'border-transparent'}`}>
        <button 
            onClick={onToggle}
            className="w-full sticky top-0 z-10 flex cursor-pointer items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors border-b border-slate-100"
        >
            <div className="flex items-center gap-4 text-left">
                <div className="size-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-[20px] font-bold animate-pulse">priority_high</span>
                </div>
                <div>
                    <p className="text-text-main text-lg font-display font-bold">{week.title}</p>
                    <p className="text-primary-dark text-sm font-bold">{week.subtitle}</p>
                </div>
            </div>
            <span className={`material-symbols-outlined text-text-light transition-transform duration-300 bg-slate-100 rounded-full p-1 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
        </button>
        
        {isOpen && (
             <div className="flex flex-col gap-4 p-4 bg-background-soft/50 animate-[fadeIn_0.3s_ease-out]">
                {week.days.map(day => (
                    <DayCard key={day.id} day={day} onStartWorkout={onStartWorkout} />
                ))}
             </div>
        )}
    </div>
  );
};