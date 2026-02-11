import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutTimer } from './WorkoutTimer';
import { DayPlan, DayType } from '../types';


const mockWorkoutWithSteps: DayPlan = {
    id: 'w1-d2',
    dayNumber: 2,
    type: DayType.Intervals,
    title: 'Speed Work',
    subtitle: '8 x 400m',
    steps: [
        { type: 'warmup', title: 'Warm-up', description: '10 min warm-up jog.' },
        { type: 'main', title: 'Main Set', description: '8 x 400m hard with 90s rest.' },
        { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down jog.' },
    ],
};

const mockWorkoutWithoutSteps: DayPlan = {
    id: 'w1-d1',
    dayNumber: 1,
    type: DayType.EasyRun,
    title: 'Easy Run',
    subtitle: '30 mins • RPE 3-4',
};

describe('WorkoutTimer', () => {
    describe('segment navigation', () => {
        it('displays initial segment from workout steps', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                />
            );

            expect(screen.getByText('Warm-up')).toBeInTheDocument();
            expect(screen.getByText('10 min warm-up jog.')).toBeInTheDocument();
        });

        it('shows segment indicator showing 1 of 3 initially', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                />
            );

            expect(screen.getByText('Segment 1 of 3')).toBeInTheDocument();
        });

        it('skip next button advances to next segment', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                />
            );

            // Initially on Warm-up
            expect(screen.getByText('Warm-up')).toBeInTheDocument();

            // Click skip next
            const skipNextButton = screen.getAllByText('skip_next')[0].closest('button');
            fireEvent.click(skipNextButton!);

            // Should now show Main Set
            expect(screen.getByText('Main Set')).toBeInTheDocument();
            expect(screen.getByText('Segment 2 of 3')).toBeInTheDocument();
        });

        it('skip previous button goes back to previous segment', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                />
            );

            // Advance to segment 2
            const skipNextButton = screen.getAllByText('skip_next')[0].closest('button');
            fireEvent.click(skipNextButton!);

            expect(screen.getByText('Main Set')).toBeInTheDocument();

            // Go back to segment 1
            const skipPrevButton = screen.getAllByText('skip_previous')[0].closest('button');
            fireEvent.click(skipPrevButton!);

            expect(screen.getByText('Warm-up')).toBeInTheDocument();
            expect(screen.getByText('Segment 1 of 3')).toBeInTheDocument();
        });

        it('skip previous is disabled on first segment', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                />
            );

            const skipPrevButton = screen.getAllByText('skip_previous')[0].closest('button');
            expect(skipPrevButton).toBeDisabled();
        });

        it('skip next is disabled on last segment', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                />
            );

            // Advance to last segment
            const skipNextButton = screen.getAllByText('skip_next')[0].closest('button');
            fireEvent.click(skipNextButton!);
            fireEvent.click(skipNextButton!);

            expect(screen.getByText('Cool-down')).toBeInTheDocument();
            expect(skipNextButton).toBeDisabled();
        });

        it('shows "Next Up" preview for next segment', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                />
            );

            expect(screen.getByText('Next Up:')).toBeInTheDocument();
            expect(screen.getByText('8 x 400m hard with 90s rest.')).toBeInTheDocument();
        });

        it('shows "Final Segment" message on last segment', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                />
            );

            // Advance to last segment
            const skipNextButton = screen.getAllByText('skip_next')[0].closest('button');
            fireEvent.click(skipNextButton!);
            fireEvent.click(skipNextButton!);

            expect(screen.getByText('Final Segment!')).toBeInTheDocument();
        });
    });

    describe('default segments', () => {
        it('creates default segments when workout has no steps', () => {
            render(
                <WorkoutTimer
                    workout={mockWorkoutWithoutSteps}
                    onClose={vi.fn()}
                />
            );

            expect(screen.getByText('Warm Up')).toBeInTheDocument();
            expect(screen.getByText('Segment 1 of 3')).toBeInTheDocument();
        });
    });

    describe('complete workout', () => {
        it('calls onComplete when Complete Workout button is clicked', () => {
            const onComplete = vi.fn();

            render(
                <WorkoutTimer
                    workout={mockWorkoutWithSteps}
                    onClose={vi.fn()}
                    onComplete={onComplete}
                />
            );

            const completeButton = screen.getByText('Complete Workout').closest('button');
            fireEvent.click(completeButton!);

            expect(onComplete).toHaveBeenCalledTimes(1);
        });
    });
});
