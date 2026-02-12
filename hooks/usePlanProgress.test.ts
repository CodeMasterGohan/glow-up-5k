import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlanProgress } from './usePlanProgress';

describe('usePlanProgress', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('resetProgress', () => {
        it('clears all completed days from state', () => {
            // Setup: Add some completed days first
            localStorage.setItem('glowUp5k_completedDays', JSON.stringify(['w1-d1', 'w1-d2']));

            const { result } = renderHook(() => usePlanProgress());

            // Verify initial state has completed days
            expect(result.current.completedDayIds).toHaveLength(2);
            expect(result.current.completedDaysCount).toBe(2);

            // Act: Reset progress
            act(() => {
                result.current.resetProgress();
            });

            // Assert: All progress cleared
            expect(result.current.completedDayIds).toHaveLength(0);
            expect(result.current.completedDaysCount).toBe(0);
            expect(result.current.currentWeek).toBe(1);
        });

        it('removes localStorage key when reset', () => {
            localStorage.setItem('glowUp5k_completedDays', JSON.stringify(['w1-d1']));

            const { result } = renderHook(() => usePlanProgress());

            act(() => {
                result.current.resetProgress();
            });

            // Note: useEffect re-saves empty array after reset
            const stored = JSON.parse(localStorage.getItem('glowUp5k_completedDays') || '[]');
            expect(stored).toHaveLength(0);
        });

        it('stats show initial values after reset', () => {
            localStorage.setItem('glowUp5k_completedDays', JSON.stringify(['w1-d1', 'w1-d2', 'w1-d3']));

            const { result } = renderHook(() => usePlanProgress());

            act(() => {
                result.current.resetProgress();
            });

            expect(result.current.completedDaysCount).toBe(0);
            expect(result.current.progressPercent).toBe(0);
            expect(result.current.currentWeek).toBe(1);
        });
    });

    describe('toggleDay', () => {
        it('adds day to completedDayIds when not completed', () => {
            const { result } = renderHook(() => usePlanProgress());

            expect(result.current.completedDayIds).not.toContain('w1-d1');

            act(() => {
                result.current.toggleDay('w1-d1');
            });

            expect(result.current.completedDayIds).toContain('w1-d1');
        });

        it('removes day from completedDayIds when already completed', () => {
            localStorage.setItem('glowUp5k_completedDays', JSON.stringify(['w1-d1']));

            const { result } = renderHook(() => usePlanProgress());

            expect(result.current.completedDayIds).toContain('w1-d1');

            act(() => {
                result.current.toggleDay('w1-d1');
            });

            expect(result.current.completedDayIds).not.toContain('w1-d1');
        });

        it('updates completedDaysCount when toggling', () => {
            const { result } = renderHook(() => usePlanProgress());

            const initialCount = result.current.completedDaysCount;

            act(() => {
                result.current.toggleDay('w1-d1');
            });

            expect(result.current.completedDaysCount).toBe(initialCount + 1);

            act(() => {
                result.current.toggleDay('w1-d1');
            });

            expect(result.current.completedDaysCount).toBe(initialCount);
        });

        it('persists to localStorage when toggling', () => {
            const { result } = renderHook(() => usePlanProgress());

            act(() => {
                result.current.toggleDay('w1-d1');
            });

            const stored = JSON.parse(localStorage.getItem('glowUp5k_completedDays') || '[]');
            expect(stored).toContain('w1-d1');
        });
    });

    describe('computed stats', () => {
        it('calculates currentWeek based on completed weeks', () => {
            const { result } = renderHook(() => usePlanProgress());

            // Initially should be week 1
            expect(result.current.currentWeek).toBe(1);
        });

        it('progressPercent increases when days are completed', () => {
            const { result } = renderHook(() => usePlanProgress());

            const initialPercent = result.current.progressPercent;

            act(() => {
                result.current.toggleDay('w1-d1');
            });

            expect(result.current.progressPercent).toBeGreaterThan(initialPercent);
        });
    });

    describe('isToday logic', () => {
        it('sets the first incomplete day as isToday', () => {
             const { result } = renderHook(() => usePlanProgress());

             // First day should be today
             const w1d1 = result.current.plan[0].days[0];
             expect(w1d1.id).toBe('w1-d1');
             expect(w1d1.isToday).toBe(true);

             // Second day should not be today
             const w1d2 = result.current.plan[0].days[1];
             expect(w1d2.isToday).toBe(false);
        });

        it('moves isToday to next day when previous is completed', () => {
             const { result } = renderHook(() => usePlanProgress());

             act(() => {
                 result.current.toggleDay('w1-d1');
             });

             // First day completed, not today
             const w1d1 = result.current.plan[0].days[0];
             expect(w1d1.isCompleted).toBe(true);
             expect(w1d1.isToday).toBe(false);

             // Second day is now today
             const w1d2 = result.current.plan[0].days[1];
             expect(w1d2.isToday).toBe(true);
        });
    });
});
