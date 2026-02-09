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
  // Build segments array from workout steps or provide defaults
  const segments = React.useMemo(() => {
    if (workout.steps && workout.steps.length > 0) {
      return workout.steps.map((step, index) => ({
        id: index,
        title: step.title,
        description: step.description,
        duration: step.duration ? parseDuration(step.duration) : 300 // default 5 min
      }));
    }
    // Default segments if no steps defined
    return [
      { id: 0, title: 'Warm Up', description: 'Light jog and dynamic stretches', duration: 300 },
      { id: 1, title: 'Main Workout', description: workout.subtitle || 'Complete the workout', duration: 600 },
      { id: 2, title: 'Cool Down', description: 'Easy jog and stretching', duration: 300 }
    ];
  }, [workout]);

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(segments[0].duration);
  const [isActive, setIsActive] = useState(false);

  const currentSegment = segments[currentSegmentIndex];
  const nextSegment = segments[currentSegmentIndex + 1];
  const totalDuration = segments.reduce((acc, s) => acc + s.duration, 0);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Auto-advance to next segment
      if (currentSegmentIndex < segments.length - 1) {
        handleSkipNext();
      } else {
        setIsActive(false);
        playSound('complete');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentSegmentIndex, segments.length]);

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

  const handleSkipPrev = () => {
    if (currentSegmentIndex > 0) {
      const newIndex = currentSegmentIndex - 1;
      setCurrentSegmentIndex(newIndex);
      setTimeLeft(segments[newIndex].duration);
      setIsActive(false);
      playSound('pause');
    }
  };

  const handleSkipNext = () => {
    if (currentSegmentIndex < segments.length - 1) {
      const newIndex = currentSegmentIndex + 1;
      setCurrentSegmentIndex(newIndex);
      setTimeLeft(segments[newIndex].duration);
      playSound('start');
    }
  };

  // Calculate progress through current segment
  const segmentProgress = currentSegment.duration > 0
    ? ((currentSegment.duration - timeLeft) / currentSegment.duration) * 100
    : 0;

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

      {/* Segment progress indicator */}
      <div className="relative z-10 px-6 pb-2">
        <div className="flex gap-1">
          {segments.map((seg, idx) => (
            <div
              key={seg.id}
              className={`h-1 flex-1 rounded-full transition-colors ${idx < currentSegmentIndex
                  ? 'bg-primary'
                  : idx === currentSegmentIndex
                    ? 'bg-primary/50'
                    : 'bg-slate-200'
                }`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-text-light mt-2">
          Segment {currentSegmentIndex + 1} of {segments.length}
        </p>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-text-main mb-2">{workout.title}</h2>
          <p className="text-lg text-primary-dark font-medium">{currentSegment.title}</p>
          <p className="text-sm text-text-light mt-1 max-w-xs mx-auto">{currentSegment.description}</p>
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
              strokeDashoffset={`${283 - (283 * segmentProgress / 100)}%`}
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
          <button
            onClick={handleSkipPrev}
            disabled={currentSegmentIndex === 0}
            className={`size-14 rounded-full flex items-center justify-center transition-colors ${currentSegmentIndex === 0
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
          >
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
          <button
            onClick={handleSkipNext}
            disabled={currentSegmentIndex >= segments.length - 1}
            className={`size-14 rounded-full flex items-center justify-center transition-colors ${currentSegmentIndex >= segments.length - 1
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
          >
            <span className="material-symbols-outlined">skip_next</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 p-6 pb-12">
        {nextSegment ? (
          <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100">
            <h4 className="font-bold text-text-main mb-2">Next Up:</h4>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-intensity-hard/10 text-intensity-hard flex items-center justify-center font-bold text-xs">
                {currentSegmentIndex + 2}
              </div>
              <p className="text-sm text-text-light flex-1">{nextSegment.description}</p>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 rounded-2xl p-4 shadow-soft border border-green-100">
            <h4 className="font-bold text-green-700 mb-1">Final Segment!</h4>
            <p className="text-sm text-green-600">Complete this to finish your workout</p>
          </div>
        )}

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

// Helper function to parse duration strings like "10 min", "45 mins", etc.
function parseDuration(durationStr: string): number {
  const match = durationStr.match(/(\d+)/);
  if (match) {
    const mins = parseInt(match[1], 10);
    return mins * 60; // Convert to seconds
  }
  return 300; // Default 5 minutes
}