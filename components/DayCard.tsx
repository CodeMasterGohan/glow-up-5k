import React, { useState } from 'react';
import { DayPlan, DayType } from '../types';

/** Format ISO date to short display, e.g. "Mon, Feb 12" */
function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

interface DayCardProps {
  day: DayPlan;
  onStartWorkout: (day: DayPlan) => void;
  onToggleComplete?: (dayId: string) => void;
}

const getIntensityColor = (type: DayType) => {
  switch (type) {
    case DayType.Intervals: return 'intensity-hard';
    case DayType.TempoRun: return 'intensity-tempo';
    case DayType.EasyRun: return 'intensity-easy';
    case DayType.CrossTraining: return 'intensity-cross';
    case DayType.LongRun: return 'secondary';
    case DayType.Rest: return 'text-light';
    default: return 'intensity-easy';
  }
};

const getIcon = (type: DayType) => {
  switch (type) {
    case DayType.Intervals: return 'speed';
    case DayType.TempoRun: return 'bolt';
    case DayType.EasyRun: return 'directions_run';
    case DayType.CrossTraining: return 'fitness_center';
    case DayType.LongRun: return 'route';
    case DayType.Rest: return 'bedtime';
    default: return 'circle';
  }
};

export const DayCard: React.FC<DayCardProps> = ({ day, onStartWorkout, onToggleComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const color = getIntensityColor(day.type);
  const icon = getIcon(day.type);

  // Helper for dynamic Tailwind classes based on the 'color' string isn't straightforward in standard Tailwind without safelisting.
  // We'll use style maps for the dynamic colors to ensure reliability since we can't fully control the tailwind build process here.
  const colorMap: Record<string, string> = {
    'intensity-hard': '#FF9999',
    'intensity-tempo': '#FFB7B2',
    'intensity-easy': '#89CFF0',
    'intensity-cross': '#C1E1C1',
    'secondary': '#B59AFF',
    'text-light': '#9696B5'
  };

  const activeColor = colorMap[color];

  // Specific Layout for "Today/Featured" day
  if (day.isToday) {
    return (
      <div className="relative flex flex-col rounded-3xl bg-white overflow-hidden border-2 shadow-lg transform scale-[1.02] transition-transform"
        style={{ borderColor: activeColor, boxShadow: `0 10px 25px -5px ${activeColor}40` }}>
        <div className="absolute top-0 right-0 text-white text-[11px] font-bold px-3 py-1 rounded-bl-2xl z-10 shadow-sm" style={{ backgroundColor: activeColor }}>
          TODAY
        </div>

        <div className="flex items-stretch bg-gradient-to-r from-slate-50 to-transparent">
          <div className="w-2" style={{ backgroundColor: activeColor }}></div>
          <div className="p-5 flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-sm" style={{ color: activeColor }}>
                <span className="size-2 rounded-full animate-ping" style={{ backgroundColor: activeColor }}></span>
                {day.type} • Day {day.dayNumber}{day.scheduledDate ? ` • ${formatShortDate(day.scheduledDate)}` : ''}
              </span>
            </div>
            <h4 className="text-text-main font-display font-bold text-xl flex items-center gap-2">
              {day.title}
              {day.type === DayType.Intervals && <span>🔥</span>}
            </h4>
            <div className="flex gap-3 text-xs text-text-light font-medium flex-wrap">
              {day.duration && (
                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-100">
                  <span className="material-symbols-outlined text-[14px]">schedule</span> {day.duration}
                </span>
              )}
              <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-100">
                <span className="material-symbols-outlined text-[14px]" style={{ color: activeColor }}>{icon}</span>
                {day.subtitle}
              </span>
            </div>
          </div>
          <div className="w-20 flex flex-col items-center justify-center gap-1 opacity-80" style={{ color: activeColor }}>
            <span className="material-symbols-outlined text-[32px]">timer</span>
          </div>
        </div>

        {/* Expanded Details always visible for Today */}
        <div className="p-5 bg-white border-t border-slate-100 flex flex-col gap-4">
          {day.steps?.map((step, idx) => (
            <div key={idx} className="flex gap-4 items-start group/step">
              <div className="mt-1 size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border transition-colors group-hover/step:text-white"
                style={{
                  backgroundColor: `${activeColor}15`,
                  color: activeColor,
                  borderColor: `${activeColor}30`,
                }}>
                <span className="group-hover/step:hidden">{idx + 1}</span>
                <div className="hidden group-hover/step:block size-full rounded-full" style={{ backgroundColor: activeColor }}></div>
              </div>
              <div>
                <p className="text-text-main text-sm font-bold">{step.title}</p>
                <p className="text-text-light text-sm">{step.description}</p>
              </div>
            </div>
          ))}

          <button
            onClick={() => onStartWorkout(day)}
            className="mt-3 w-full text-white font-bold py-3.5 rounded-2xl text-base transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:brightness-110"
            style={{
              background: `linear-gradient(to right, ${activeColor}, #FF7592)`,
              boxShadow: `0 10px 20px -5px ${activeColor}50`
            }}
          >
            <span className="material-symbols-outlined">play_arrow</span>
            Start Workout
          </button>
        </div>
      </div>
    );
  }

  // Layout for Completed Days
  if (day.isCompleted) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="w-full sm:w-2 bg-intensity-easy/40" style={{ backgroundColor: `${activeColor}60` }}></div>
        <div className="p-4 flex-1 flex flex-col gap-1 relative">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-opacity-10 px-2 py-0.5 rounded-full" style={{ color: activeColor, backgroundColor: `${activeColor}15` }}>
              {day.type} • Day {day.dayNumber}{day.scheduledDate ? ` • ${formatShortDate(day.scheduledDate)}` : ''}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete?.(day.id);
              }}
              className="flex items-center justify-center size-6 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
              title="Mark as incomplete"
            >
              <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
            </button>
          </div>
          <h4 className="text-text-main font-display font-bold text-base mt-1">{day.title}</h4>
          <p className="text-text-light text-sm">{day.subtitle}</p>
        </div>
        <div className="w-full sm:w-16 bg-opacity-10 flex items-center justify-center py-2 sm:py-0" style={{ backgroundColor: `${activeColor}10` }}>
          <span className="material-symbols-outlined text-[28px] opacity-80" style={{ color: activeColor }}>{icon}</span>
        </div>
      </div>
    );
  }

  // Layout for Rest Days (Simple)
  if (day.type === DayType.Rest) {
    return (
      <div className="flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-100/50 shadow-inner">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete?.(day.id);
          }}
          className={`size-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all ${day.isCompleted
            ? 'bg-green-100 border-green-400'
            : 'bg-white border-slate-300 hover:border-primary'
            }`}
          title={day.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {day.isCompleted && (
            <span className="material-symbols-outlined text-green-500 text-[16px]">check</span>
          )}
        </button>
        <div className="size-12 rounded-full bg-white shadow-sm flex items-center justify-center mr-4 border border-slate-100">
          <span className="material-symbols-outlined text-secondary/60">{icon}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-widest text-text-light uppercase">{day.type} • Day {day.dayNumber}{day.scheduledDate ? ` • ${formatShortDate(day.scheduledDate)}` : ''}</span>
          <h4 className="text-text-main font-display font-bold text-base">{day.title}</h4>
        </div>
      </div>
    );
  }

  // Default Expandable Layout for Future Days (Tempo, Cross, etc.)
  return (
    <div className={`rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-100 transition-all ${isExpanded ? 'ring-2 ring-primary/20' : ''}`}>
      <div
        className="flex items-stretch cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-2" style={{ backgroundColor: activeColor }}></div>
        <div className="p-4 flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete?.(day.id);
              }}
              className={`size-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${day.isCompleted
                ? 'bg-green-100 border-green-400'
                : 'bg-white border-slate-300 hover:border-primary'
                }`}
              title={day.isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
              {day.isCompleted && (
                <span className="material-symbols-outlined text-green-500 text-[14px]">check</span>
              )}
            </button>
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: activeColor }}>{day.type} • Day {day.dayNumber}{day.scheduledDate ? ` • ${formatShortDate(day.scheduledDate)}` : ''}</span>
          </div>
          <h4 className="text-text-main font-display font-bold text-base">{day.title}</h4>
          <p className="text-text-light text-sm">{day.subtitle}</p>
        </div>
        <div className="w-16 flex items-center justify-center" style={{ color: activeColor }}>
          <span className={`material-symbols-outlined text-[24px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            {isExpanded ? 'expand_less' : icon}
          </span>
        </div>
      </div>
      {isExpanded && day.details && (
        <div className="p-4 text-sm font-medium animate-[fadeIn_0.2s_ease-out]" style={{ backgroundColor: `${activeColor}15`, color: '#5D5D81' }}>
          {day.details}
        </div>
      )}
    </div>
  );
};