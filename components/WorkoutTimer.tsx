import React, { useState, useEffect } from 'react';
import { DayPlan } from '../types';

interface WorkoutTimerProps {
  workout: DayPlan;
  onClose: () => void;
  onComplete?: () => void;
}

// ... playSound function remains same (omitted for brevity in replacement if possible, but replace_file_content needs context.
// actually I'm replacing the whole file content or a large chunk? 
// No, I should use replace_file_content safely. 
// Let's target the interface and the Main Component return. Use MultiReplace? No, Replace is fine if I do chunks or just the specific parts.
// But I need to add onComplete to destracturing too.
// Let's use MultiReplace for safety.


// Simple audio synthesizer for gentle UI sounds
const playSound = (type: 'start' | 'pause' | 'complete') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Master gain for volume control
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.value = 0.2; // Keep it very gentle

    const now = ctx.currentTime;

    if (type === 'start') {
      // Soft rising major third (C5 -> E5) indicating progress
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

      const gain = ctx.createGain();
      gain.connect(masterGain);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.5);
    }
    else if (type === 'pause') {
      // Soft falling (E5 -> C5) indicating pause
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15); // C5

      const gain = ctx.createGain();
      gain.connect(masterGain);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.5);
    }
    else if (type === 'complete') {
      // Soft success chord (C Major Arpeggio: C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const gain = ctx.createGain();
        gain.connect(masterGain);

        const startTime = now + (i * 0.12); // Staggered entrance

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

        osc.connect(gain);
        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ workout, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(300); // Start with 5 min countdown for example
  const [isActive, setIsActive] = useState(false);
  const [currentSegment, setCurrentSegment] = useState('Warm Up');

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playSound('complete');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    playSound(nextState ? 'start' : 'pause');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-[pulse_4s_infinite]"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-intensity-hard/20 rounded-full blur-3xl animate-[pulse_5s_infinite]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between p-6">
        <button onClick={onClose} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500">
          <span className="material-symbols-outlined">expand_more</span>
        </button>
        <span className="font-display font-bold text-text-main">Workout In Progress</span>
        <div className="w-10"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-text-main mb-2">{workout.title}</h2>
          <p className="text-lg text-primary-dark font-medium">{currentSegment}</p>
        </div>

        <div className="relative size-72 flex items-center justify-center">
          {/* Simple circular progress visualization */}
          <svg className="size-full rotate-[-90deg]">
            <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-slate-100 stroke-[12px]" />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="fill-none stroke-primary stroke-[12px] transition-all duration-1000"
              strokeDasharray="283%"
              strokeDashoffset={`${283 - (283 * (300 - timeLeft) / 300)}%`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-display font-bold text-text-main tabular-nums tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-slate-400 font-medium mt-1">remaining</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="size-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">skip_previous</span>
          </button>
          <button
            onClick={toggleTimer}
            className="size-20 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-4xl ml-1">
              {isActive ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button className="size-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">skip_next</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 p-6 pb-12">
        <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100">
          <h4 className="font-bold text-text-main mb-2">Next Up:</h4>
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-intensity-hard/10 text-intensity-hard flex items-center justify-center font-bold text-xs">2</div>
            <p className="text-sm text-text-light flex-1">8 x 400m @ goal 5K pace w/ 90s jog recovery.</p>
          </div>
        </div>

        <div className="flex justify-center w-full mt-6">
          <button
            onClick={() => {
              playSound('complete');
              if (onComplete) onComplete();
            }}
            className="w-full py-4 rounded-xl bg-green-500 text-white font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Complete Workout
          </button>
        </div>
      </div>
    </div>
  );
};