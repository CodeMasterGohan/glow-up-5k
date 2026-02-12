import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WorkoutTimer } from './WorkoutTimer';
import { DayPlan, DayType } from '../types';

// Mock audio hook
vi.mock('../hooks/useAudio', () => ({
  useAudio: () => ({
    playSound: vi.fn(),
    speak: vi.fn(),
  }),
}));

// Mock wake lock hook
vi.mock('../hooks/useWakeLock', () => ({
  useWakeLock: () => ({
    requestWakeLock: vi.fn(),
    releaseWakeLock: vi.fn(),
  }),
}));

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));


const mockWorkoutWithSteps: DayPlan = {
    id: 'w1-d2',
    dayNumber: 2,
    type: DayType.Intervals,
    title: 'Speed Work',
    subtitle: '8 x 400m',
    steps: [
        { type: 'warmup', title: 'Warm-up', description: '10 min warm-up jog.', duration: '10 mins' },
        {
            type: 'main',
            title: 'Main Set',
            description: 'Intervals',
            intervals: { sets: 2, workDuration: 120, recoveryDuration: 60 }
        },
        { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down jog.', duration: '10 mins' },
    ],
};

const mockWorkoutSimple: DayPlan = {
    id: 'w1-d1',
    dayNumber: 1,
    type: DayType.EasyRun,
    title: 'Easy Run',
    subtitle: '30 mins',
    steps: [
        { type: 'main', title: 'Run', description: 'Just run', duration: '30 mins' }
    ]
};

const mockWorkoutNoDuration: DayPlan = {
    id: 'w1-d3',
    dayNumber: 3,
    type: DayType.Rest,
    title: 'Rest',
    subtitle: 'Rest',
    steps: [
        { type: 'main', title: 'Stretch', description: 'Stretch it out' }
    ]
};

const mockWorkoutInferredFromText: DayPlan = {
    id: 'w1-custom',
    dayNumber: 1,
    type: DayType.EasyRun,
    title: 'Custom Day 1',
    subtitle: 'Workout from notes',
    details: 'Five minute warmup and then a 30 minute run.',
};

const mockWorkoutDurationOnly: DayPlan = {
    id: 'w1-duration',
    dayNumber: 1,
    type: DayType.EasyRun,
    title: 'Duration Only',
    subtitle: 'Simple run',
    duration: '35 mins',
};

describe('WorkoutTimer', () => {
    describe('Segment Parsing & Duration', () => {
        it('parses "10 mins" correctly to 600 seconds', () => {
            render(<WorkoutTimer workout={mockWorkoutWithSteps} onClose={vi.fn()} />);
            // Initial segment is 10 mins = 600s. Format m:ss -> 10:00
            expect(screen.getByText('10:00')).toBeInTheDocument();
        });

        it('defaults to 5 mins (300s) if no duration provided', () => {
            render(<WorkoutTimer workout={mockWorkoutNoDuration} onClose={vi.fn()} />);
            expect(screen.getByText('5:00')).toBeInTheDocument();
        });

        it('infers warmup + run segments from workout text when steps are missing', () => {
            render(<WorkoutTimer workout={mockWorkoutInferredFromText} onClose={vi.fn()} />);

            expect(screen.getByText('Warm-up')).toBeInTheDocument();
            expect(screen.getByText('5:00')).toBeInTheDocument();

            const nextBtn = screen.getByText('skip_next').closest('button');
            fireEvent.click(nextBtn!);

            expect(screen.getByText('Run')).toBeInTheDocument();
            expect(screen.getByText('30:00')).toBeInTheDocument();
        });

        it('uses workout duration when steps are missing and no timed segments are in details', () => {
            render(<WorkoutTimer workout={mockWorkoutDurationOnly} onClose={vi.fn()} />);
            expect(screen.getByText('35:00')).toBeInTheDocument();
        });

        it('handles intervals by creating work/rest segments', () => {
            render(<WorkoutTimer workout={mockWorkoutWithSteps} onClose={vi.fn()} />);

            // Initial Warmup
            expect(screen.getByText('Warm-up')).toBeInTheDocument();

            // Skip to Interval 1 Work
            const nextBtn = screen.getByText('skip_next').closest('button');
            fireEvent.click(nextBtn!);

            expect(screen.getByText(/Main Set \(Rep 1\/2\)/)).toBeInTheDocument();
            expect(screen.getByText('2:00')).toBeInTheDocument(); // 120s

            // Skip to Interval 1 Rest
            fireEvent.click(nextBtn!);
            expect(screen.getByText(/Main Set \(Rest 1\/2\)/)).toBeInTheDocument();
            expect(screen.getByText('1:00')).toBeInTheDocument(); // 60s

            // Skip to Interval 2 Work
            fireEvent.click(nextBtn!);
            expect(screen.getByText(/Main Set \(Rep 2\/2\)/)).toBeInTheDocument();

            // Skip to Interval 2 Rest
            fireEvent.click(nextBtn!);
            expect(screen.getByText(/Main Set \(Rest 2\/2\)/)).toBeInTheDocument();

            // Skip to Cool-down
            fireEvent.click(nextBtn!);
            expect(screen.getByText('Cool-down')).toBeInTheDocument();
        });
    });

    describe('Timer Logic', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });

        it('decrements time when active', () => {
            render(<WorkoutTimer workout={mockWorkoutSimple} onClose={vi.fn()} />);

            // Start timer
            const playBtn = screen.getByText('play_arrow').closest('button');
            fireEvent.click(playBtn!);

            expect(screen.getByText('30:00')).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(screen.getByText('29:59')).toBeInTheDocument();
        });

        it('auto-advances segment when time reaches 0', () => {
             render(<WorkoutTimer workout={mockWorkoutWithSteps} onClose={vi.fn()} />);

             // Start timer
             const playBtn = screen.getByText('play_arrow').closest('button');
             fireEvent.click(playBtn!);

             // Advance 10 mins (600s)
             act(() => {
                 vi.advanceTimersByTime(600 * 1000);
             });

             // Should now be on next segment (Interval 1)
             expect(screen.getByText(/Main Set \(Rep 1\/2\)/)).toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        it('prevents skipping previous on first segment', () => {
            render(<WorkoutTimer workout={mockWorkoutWithSteps} onClose={vi.fn()} />);
            const prevBtn = screen.getByText('skip_previous').closest('button');
            expect(prevBtn).toBeDisabled();
        });

        it('prevents skipping next on last segment', () => {
             render(<WorkoutTimer workout={mockWorkoutSimple} onClose={vi.fn()} />);
             const nextBtn = screen.getByText('skip_next').closest('button');
             // Single segment workout -> already at end? No, segments length is 1.
             // current index 0. length 1. 0 >= 0 is true.
             expect(nextBtn).toBeDisabled();
        });
    });
});
