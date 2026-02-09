import { useState, useEffect, useMemo } from 'react';
import { planData } from '../data/plan';
import { WeekStatus, WeekPlan, DayPlan } from '../types';

export const usePlanProgress = () => {
    const [completedDayIds, setCompletedDayIds] = useState<string[]>(() => {
        const saved = localStorage.getItem('glowUp5k_completedDays');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('glowUp5k_completedDays', JSON.stringify(completedDayIds));
    }, [completedDayIds]);

    const toggleDay = (dayId: string) => {
        setCompletedDayIds(prev =>
            prev.includes(dayId)
                ? prev.filter(id => id !== dayId)
                : [...prev, dayId]
        );
    };

    const resetProgress = () => {
        setCompletedDayIds([]);
    };

    const plan = useMemo(() => {
        return planData.map(week => {
            // Map days to specific week to check status
            // Note: planData days are empty for collapsed weeks in the original file, 
            // but for a real app we'd expect data. 
            // In the current codebase, planData has days populated only for week 2 in the example.
            // We will assume for this logic that we are operating on the provided data structure.

            // Since the original data has empty arrays for some weeks, we can't fully compute status 
            // based on days if they aren't there. However, we will implement the logic 
            // assuming the `days` array WOULD be populated or we just map what is there.

            // Actually, we need to preserve the original structure but update `isCompleted`.
            // If days are empty, we can't really mark them complete.

            const updatedDays = week.days.map(day => ({
                ...day,
                isCompleted: completedDayIds.includes(day.id)
            }));

            const completedDaysCount = updatedDays.filter(d => d.isCompleted).length;
            const totalDaysCount = updatedDays.length;

            let status = WeekStatus.InProgress; // Default to InProgress (Unlocked)

            if (totalDaysCount > 0 && completedDaysCount === totalDaysCount) {
                status = WeekStatus.Completed;
            }

            // We explicitly do NOT set status to Locked per requirements.

            return {
                ...week,
                status,
                days: updatedDays
            };
        });
    }, [completedDayIds]);

    return {
        plan,
        toggleDay,
        resetProgress,
        completedDayIds
    };
};
