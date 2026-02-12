import React, { useState, useEffect } from 'react';
import { DayPlan, WorkoutStep } from '../types';
import { useAudio } from '../hooks/useAudio';
import { useWakeLock } from '../hooks/useWakeLock';
import confetti from 'canvas-confetti';

interface WorkoutTimerProps {
  workout: DayPlan;
  onClose: () => void;
  onComplete?: () => void;
}

interface TimerSegment {
  id: string | number;
  title: string;
  description: string;
  duration: number;
}

const DEFAULT_SEGMENT_DURATION = 300;

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ workout, onClose, onComplete }) => {
  const { playSound, speak } = useAudio();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const segments = React.useMemo(() => buildWorkoutSegments(workout), [workout]);

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(segments[0]?.duration ?? DEFAULT_SEGMENT_DURATION);
  const [isActive, setIsActive] = useState(false);

  const currentSegment = segments[currentSegmentIndex];
  const nextSegment = segments[currentSegmentIndex + 1];
  const totalDuration = segments.reduce((acc, s) => acc + s.duration, 0);

  useEffect(() => {
    setCurrentSegmentIndex(0);
    setTimeLeft(segments[0]?.duration ?? DEFAULT_SEGMENT_DURATION);
    setIsActive(false);
  }, [segments]);

  // Handle Wake Lock based on activity
  useEffect(() => {
    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [isActive, requestWakeLock, releaseWakeLock]);

  // Also release on unmount explicitly just in case (hook does it too)
  useEffect(() => {
      return () => {
          releaseWakeLock();
      }
  }, [releaseWakeLock]);

  const triggerCelebration = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
        // launch a few confetti from the left edge
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FF9AAE', '#B59AFF', '#FFCBA4'] // Primary, Secondary, Accent
        });
        // and launch a few from the right edge
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FF9AAE', '#B59AFF', '#FFCBA4']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);

        // Voice cues for halfway and last minute (if segment > 2 mins)
        if (timeLeft === Math.floor(currentSegment.duration / 2) && currentSegment.duration > 120) {
            speak("Halfway there.");
        }
        if (timeLeft === 61 && currentSegment.duration > 120) {
             speak("One minute remaining.");
        }
        if (timeLeft === 11) {
             speak("Ten seconds.");
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Auto-advance to next segment
      if (currentSegmentIndex < segments.length - 1) {
        handleSkipNext();
      } else {
        setIsActive(false);
        playSound('complete');
        speak("Workout complete! Great job.");
        triggerCelebration();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentSegmentIndex, segments.length, playSound, speak, currentSegment.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    if (nextState) {
        playSound('start');
        // Only speak title if just starting the segment (e.g. paused and resumed)
        if (timeLeft === currentSegment.duration) {
            speak(`Starting ${currentSegment.title}. ${currentSegment.description}`);
        } else {
            speak("Resuming workout.");
        }
    } else {
        playSound('pause');
        speak("Workout paused.");
    }
  };

  const handleSkipPrev = () => {
    if (currentSegmentIndex > 0) {
      const newIndex = currentSegmentIndex - 1;
      const newSegment = segments[newIndex];
      setCurrentSegmentIndex(newIndex);
      setTimeLeft(newSegment.duration);
      setIsActive(false);
      playSound('pause');
      speak(`Back to ${newSegment.title}.`);
    }
  };

  const handleSkipNext = () => {
    if (currentSegmentIndex < segments.length - 1) {
      const newIndex = currentSegmentIndex + 1;
      const newSegment = segments[newIndex];
      setCurrentSegmentIndex(newIndex);
      setTimeLeft(newSegment.duration);
      playSound('start');
      speak(`Next up: ${newSegment.title}. ${newSegment.description}`);
      setIsActive(true);
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
              speak("Workout complete! Congratulations.");
              triggerCelebration();
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
  if (!durationStr) return DEFAULT_SEGMENT_DURATION;

  const values = extractDurationValuesInSeconds(durationStr);
  if (values.length > 0) {
    return values.reduce((sum, value) => sum + value, 0);
  }

  return DEFAULT_SEGMENT_DURATION;
}

function buildWorkoutSegments(workout: DayPlan): TimerSegment[] {
  const stepSegments = (workout.steps ?? []).flatMap((step, index) =>
    buildSegmentsFromStep(step, index)
  );
  if (stepSegments.length > 0) {
    return stepSegments;
  }

  const detailsSegments = inferSegmentsFromText(workout.details, 'details', workout.title);
  if (detailsSegments.length > 1) {
    return detailsSegments;
  }

  if (workout.duration) {
    return [
      {
        id: 'workout-duration',
        title: workout.title || 'Main Workout',
        description: workout.subtitle || 'Complete the workout',
        duration: parseDuration(workout.duration),
      },
    ];
  }

  if (detailsSegments.length === 1) {
    return detailsSegments;
  }

  const subtitleSegments = inferSegmentsFromText(workout.subtitle, 'subtitle', workout.title);
  if (subtitleSegments.length > 0) {
    return subtitleSegments;
  }

  return [
    {
      id: 'default-main',
      title: workout.title || 'Main Workout',
      description: workout.subtitle || 'Complete the workout',
      duration: DEFAULT_SEGMENT_DURATION,
    },
  ];
}

function buildSegmentsFromStep(step: WorkoutStep, index: number): TimerSegment[] {
  if (step.intervals) {
    const intervalSegments: TimerSegment[] = [];
    const sets = Math.max(1, step.intervals.sets);
    const workDuration = step.intervals.workDuration > 0 ? step.intervals.workDuration : DEFAULT_SEGMENT_DURATION;

    for (let i = 0; i < sets; i++) {
      intervalSegments.push({
        id: `${index}-work-${i}`,
        title: `${step.title} (Rep ${i + 1}/${sets})`,
        description: step.description,
        duration: workDuration,
      });

      if (step.intervals.recoveryDuration > 0) {
        intervalSegments.push({
          id: `${index}-rest-${i}`,
          title: `${step.title} (Rest ${i + 1}/${sets})`,
          description: 'Recover',
          duration: step.intervals.recoveryDuration,
        });
      }
    }

    return intervalSegments;
  }

  if (step.duration) {
    return [
      {
        id: index,
        title: step.title,
        description: step.description,
        duration: parseDuration(step.duration),
      },
    ];
  }

  const inferredStepSegments = inferSegmentsFromText(step.description, `step-${index}`, step.title);
  if (inferredStepSegments.length > 0) {
    return inferredStepSegments;
  }

  return [
    {
      id: index,
      title: step.title,
      description: step.description,
      duration: DEFAULT_SEGMENT_DURATION,
    },
  ];
}

function inferSegmentsFromText(
  text: string | undefined,
  idPrefix: string,
  fallbackTitle: string
): TimerSegment[] {
  if (!text) return [];

  const normalizedText = normalizeDurationText(text);
  const chunks = normalizedText
    .split(/\s*(?:\+|;|,|\/|\band then\b|\bthen\b|\bfollowed by\b|\band\b)\s*/i)
    .map(chunk => chunk.trim())
    .filter(Boolean);

  const segments: TimerSegment[] = [];

  chunks.forEach((chunk, index) => {
    const values = extractDurationValuesInSeconds(chunk);
    if (values.length === 0) return;

    const duration = values.length > 1 ? Math.max(...values) : values[0];
    const segmentTitle = inferSegmentTitle(chunk, fallbackTitle);

    segments.push({
      id: `${idPrefix}-${index}`,
      title: segmentTitle,
      description: chunk,
      duration,
    });
  });

  return segments;
}

function inferSegmentTitle(text: string, fallbackTitle: string): string {
  const lower = text.toLowerCase();

  if (/\bwarm[\s-]?up\b/.test(lower)) return 'Warm-up';
  if (/\bcool[\s-]?down\b/.test(lower)) return 'Cool-down';
  if (/\bstride/.test(lower)) return 'Strides';
  if (/\btempo\b/.test(lower)) return 'Tempo';
  if (/\binterval|rep\b/.test(lower)) return 'Intervals';
  if (/\brace\b/.test(lower)) return 'Race';
  if (/\bbike|cycling|cycle\b/.test(lower)) return 'Bike';
  if (/\bstrength\b/.test(lower)) return 'Strength';
  if (/\brecovery|recover|rest\b/.test(lower)) return 'Recovery';
  if (/\brun|jog\b/.test(lower)) return 'Run';

  return fallbackTitle || 'Main Workout';
}

function extractDurationValuesInSeconds(rawText: string): number[] {
  if (!rawText) return [];

  const text = normalizeDurationText(rawText);
  const values: number[] = [];
  const durationRegex =
    /(\d+)(?:\s*(?:-|to)\s*(\d+))?\s*(hours?|hrs?|hr|h|minutes?|mins?|min|seconds?|secs?|sec|s)\b(?!\s*\/)/gi;

  let match: RegExpExecArray | null;
  while ((match = durationRegex.exec(text)) !== null) {
    const start = Number.parseInt(match[1], 10);
    const end = match[2] ? Number.parseInt(match[2], 10) : null;
    const unit = match[3].toLowerCase();
    const duration = end ? Math.max(start, end) : start;

    if (/^h(?:our|ours)?$|^hr|^hrs/.test(unit)) {
      values.push(duration * 3600);
    } else if (/^s(?:ec|ecs|econd|econds)?$/.test(unit)) {
      values.push(duration);
    } else {
      values.push(duration * 60);
    }
  }

  if (values.length > 0) return values;

  const numericOnly = text.trim().match(/^(\d+)$/);
  if (numericOnly) {
    return [Number.parseInt(numericOnly[1], 10) * 60];
  }

  return [];
}

function normalizeDurationText(value: string): string {
  const numberWords: Record<string, string> = {
    zero: '0',
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
    ten: '10',
    eleven: '11',
    twelve: '12',
    thirteen: '13',
    fourteen: '14',
    fifteen: '15',
    sixteen: '16',
    seventeen: '17',
    eighteen: '18',
    nineteen: '19',
    twenty: '20',
    thirty: '30',
    forty: '40',
    fifty: '50',
    sixty: '60',
    seventy: '70',
    eighty: '80',
    ninety: '90',
  };

  return value
    .replace(/[•·]/g, ' ')
    .replace(/([a-z])-(?=[a-z])/gi, '$1 ')
    .replace(/\b(a|an)\s+(?=(?:hour|hr|minute|min|second|sec))/gi, '1 ')
    .replace(
      /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/gi,
      (match) => numberWords[match.toLowerCase()] ?? match
    );
}
