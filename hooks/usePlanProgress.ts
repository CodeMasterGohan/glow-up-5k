import { useState, useEffect, useMemo } from 'react';
import { planData } from '../data/plan';
import { WeekStatus, WeekPlan, DayPlan } from '../types';

/**
 * Given a start date string (ISO), compute the scheduled date for a specific
 * day within the plan. Day indices are 0-based (weekIndex * 7 + dayIndex).
 */
function computeScheduledDate(startDate: string, weekIndex: number, dayIndex: number): string {
    const start = new Date(startDate + 'T00:00:00');
    const offset = weekIndex * 7 + dayIndex;
    const d = new Date(start);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
}

export const usePlanProgress = () => {
    const [completedDayIds, setCompletedDayIds] = useState<string[]>(() => {
        const saved = localStorage.getItem('glowUp5k_completedDays');
        return saved ? JSON.parse(saved) : [];
    });

    const [startDate, setStartDateState] = useState<string | null>(() => {
        return localStorage.getItem('glowUp5k_startDate');
    });

    useEffect(() => {
        localStorage.setItem('glowUp5k_completedDays', JSON.stringify(completedDayIds));
    }, [completedDayIds]);

    useEffect(() => {
        if (startDate) {
            localStorage.setItem('glowUp5k_startDate', startDate);
        } else {
            localStorage.removeItem('glowUp5k_startDate');
        }
    }, [startDate]);

    const setStartDate = (date: string | null) => {
        setStartDateState(date);
    };

    const toggleDay = (dayId: string) => {
        setCompletedDayIds(prev =>
            prev.includes(dayId)
                ? prev.filter(id => id !== dayId)
                : [...prev, dayId]
        );
    };

    const resetProgress = () => {
        setCompletedDayIds([]);
        setStartDateState(null);
        localStorage.removeItem('glowUp5k_completedDays');
        localStorage.removeItem('glowUp5k_startDate');
    };

    const plan = useMemo(() => {
        let firstIncompleteFound = false;

        return planData.map((week, weekIndex) => {
            const updatedDays = week.days.map((day, dayIndex) => {
                const isCompleted = completedDayIds.includes(day.id);
                let isToday = false;

                // The first incomplete day of the entire plan is considered "Today"
                if (!isCompleted && !firstIncompleteFound) {
                    isToday = true;
                    firstIncompleteFound = true;
                }

                // Compute scheduled date if start date is set
                const scheduledDate = startDate
                    ? computeScheduledDate(startDate, weekIndex, dayIndex)
                    : undefined;

                return {
                    ...day,
                    isCompleted,
                    isToday,
                    scheduledDate
                };
            });

            const completedDaysCount = updatedDays.filter(d => d.isCompleted).length;
            const totalDaysCount = updatedDays.length;

            let status = WeekStatus.InProgress;

            if (totalDaysCount > 0 && completedDaysCount === totalDaysCount) {
                status = WeekStatus.Completed;
            }

            return {
                ...week,
                status,
                days: updatedDays
            };
        });
    }, [completedDayIds, startDate]);

    // Computed stats for StatsView and Header
    const stats = useMemo(() => {
        const allDays = plan.flatMap(w => w.days);
        const totalDaysCount = allDays.length;
        const completedDaysCount = allDays.filter(d => d.isCompleted).length;

        // Current week: first week that is not fully completed
        let currentWeek = 1;
        for (let i = 0; i < plan.length; i++) {
            const week = plan[i];
            const weekCompleted = week.days.length > 0 &&
                week.days.every(d => d.isCompleted);
            if (!weekCompleted) {
                currentWeek = i + 1;
                break;
            }
            // If all weeks completed, stay on last week
            if (i === plan.length - 1) {
                currentWeek = plan.length;
            }
        }

        const totalWeeks = plan.length;
        const progressPercent = totalDaysCount > 0
            ? Math.round((completedDaysCount / totalDaysCount) * 100)
            : 0;

        return {
            currentWeek,
            totalWeeks,
            completedDaysCount,
            totalDaysCount,
            progressPercent
        };
    }, [plan]);

    return {
        plan,
        toggleDay,
        resetProgress,
        completedDayIds,
        startDate,
        setStartDate,
        ...stats
    };
};
