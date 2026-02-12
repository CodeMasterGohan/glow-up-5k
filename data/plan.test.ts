import { describe, it, expect } from 'vitest';
import { planData } from './plan';
import { DayType, WeekStatus } from '../types';

describe('Workout Plan Data Integrity', () => {
  it('should have 5 weeks of data', () => {
    expect(planData.length).toBe(5);
  });

  planData.forEach((week) => {
    describe(`Week ${week.id}`, () => {
      it('should have a valid title and status', () => {
        expect(week.title).toBeTruthy();
        expect(Object.values(WeekStatus)).toContain(week.status);
      });

      it('should have 7 days', () => {
        expect(week.days.length).toBe(7);
      });

      week.days.forEach((day) => {
        describe(`Day ${day.dayNumber}: ${day.title}`, () => {
          it('should have valid day type', () => {
            expect(Object.values(DayType)).toContain(day.type);
          });

          if (day.type !== DayType.Rest) {
            it('should have steps defined (except maybe simple runs which default to one)', () => {
                // We standardized that all days should have steps now, or at least a duration string
                if (!day.steps || day.steps.length === 0) {
                    // If no steps, it must rely on default or just be a placeholder.
                    // But in our refactor we aimed to add steps to everything relevant.
                    // Let's check if it at least has a duration string at the top level.
                    expect(day.duration).toBeTruthy();
                }
            });

            if (day.steps && day.steps.length > 0) {
                it('all steps should have a duration string or interval details', () => {
                    day.steps!.forEach((step, index) => {
                        const hasDuration = !!step.duration;
                        const hasIntervals = !!step.intervals;
                        if (!hasDuration && !hasIntervals) {
                             // Fail if neither exists
                             console.error(`Week ${week.id} Day ${day.dayNumber} Step ${index} ("${step.title}") missing duration/intervals`);
                        }
                        expect(hasDuration || hasIntervals).toBe(true);
                    });
                });

                it('interval steps should have valid configuration', () => {
                    day.steps!.forEach((step) => {
                        if (step.intervals) {
                            expect(step.intervals.sets).toBeGreaterThan(0);
                            expect(step.intervals.workDuration).toBeGreaterThan(0);
                            expect(step.intervals.recoveryDuration).toBeGreaterThanOrEqual(0);
                        }
                    });
                });
            }
          }
        });
      });
    });
  });
});
