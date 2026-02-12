import React, { useState, useMemo } from 'react';
import { usePlanProgress } from '../hooks/usePlanProgress';
import { DayType, DayPlan } from '../types';

/** Color map for workout types */
const typeColorMap: Record<string, string> = {
    [DayType.Intervals]: '#FF9999',
    [DayType.TempoRun]: '#FFB7B2',
    [DayType.EasyRun]: '#89CFF0',
    [DayType.CrossTraining]: '#C1E1C1',
    [DayType.LongRun]: '#B59AFF',
    [DayType.Rest]: '#E2E8F0',
};

/** Icon map for workout types */
const typeIconMap: Record<string, string> = {
    [DayType.Intervals]: 'speed',
    [DayType.TempoRun]: 'bolt',
    [DayType.EasyRun]: 'directions_run',
    [DayType.CrossTraining]: 'fitness_center',
    [DayType.LongRun]: 'route',
    [DayType.Rest]: 'bedtime',
};

interface CalendarDay {
    date: Date;
    dayOfMonth: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    workout?: DayPlan;
}

function getMonthName(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function buildCalendarGrid(year: number, month: number, workoutMap: Map<string, DayPlan>): CalendarDay[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    const grid: CalendarDay[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const d = new Date(year, month - 1, day);
        const iso = d.toISOString().split('T')[0];
        grid.push({
            date: d,
            dayOfMonth: day,
            isCurrentMonth: false,
            isToday: isSameDay(d, today),
            workout: workoutMap.get(iso),
        });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const iso = d.toISOString().split('T')[0];
        grid.push({
            date: d,
            dayOfMonth: day,
            isCurrentMonth: true,
            isToday: isSameDay(d, today),
            workout: workoutMap.get(iso),
        });
    }

    // Next month padding — fill to complete last row (multiple of 7)
    const remaining = 7 - (grid.length % 7);
    if (remaining < 7) {
        for (let day = 1; day <= remaining; day++) {
            const d = new Date(year, month + 1, day);
            const iso = d.toISOString().split('T')[0];
            grid.push({
                date: d,
                dayOfMonth: day,
                isCurrentMonth: false,
                isToday: isSameDay(d, today),
                workout: workoutMap.get(iso),
            });
        }
    }

    return grid;
}

export const CalendarView: React.FC = () => {
    const { plan, startDate } = usePlanProgress();
    const today = new Date();

    // Determine initial month to show — the start date month if set, else current month
    const initialDate = startDate ? new Date(startDate + 'T00:00:00') : today;
    const [viewYear, setViewYear] = useState(initialDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

    // Build a map of ISO date -> DayPlan for quick lookup
    const workoutMap = useMemo(() => {
        const map = new Map<string, DayPlan>();
        for (const week of plan) {
            for (const day of week.days) {
                if (day.scheduledDate) {
                    map.set(day.scheduledDate, day);
                }
            }
        }
        return map;
    }, [plan]);

    const calendarGrid = useMemo(
        () => buildCalendarGrid(viewYear, viewMonth, workoutMap),
        [viewYear, viewMonth, workoutMap]
    );

    const goToPrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(y => y - 1);
        } else {
            setViewMonth(m => m - 1);
        }
        setSelectedDay(null);
    };

    const goToNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(y => y + 1);
        } else {
            setViewMonth(m => m + 1);
        }
        setSelectedDay(null);
    };

    const goToToday = () => {
        const t = new Date();
        setViewYear(t.getFullYear());
        setViewMonth(t.getMonth());
        setSelectedDay(null);
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (!startDate) {
        return (
            <div className="flex flex-col items-center justify-center p-8 gap-6 min-h-[60vh] animate-[fadeIn_0.5s]">
                <div className="size-20 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-dark text-[40px]">calendar_month</span>
                </div>
                <div className="text-center">
                    <h2 className="text-text-main text-2xl font-display font-bold">No Schedule Yet</h2>
                    <p className="text-text-light text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">
                        Set a start date on the <strong>Plan</strong> tab to see your workouts on the calendar.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-[18px]">arrow_back</span>
                    <span className="text-text-light text-xs font-bold">Go to Plan tab</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-5 gap-5 pb-32 animate-[fadeIn_0.5s]">
            <h2 className="text-text-main text-2xl font-display font-bold px-1">Calendar 📅</h2>

            {/* Month Navigation */}
            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-50">
                    <button
                        onClick={goToPrevMonth}
                        className="size-10 rounded-xl bg-slate-50 hover:bg-primary/10 flex items-center justify-center transition-colors active:scale-95"
                    >
                        <span className="material-symbols-outlined text-text-main text-[20px]">chevron_left</span>
                    </button>

                    <div className="text-center">
                        <h3 className="text-text-main font-display font-bold text-lg">
                            {getMonthName(new Date(viewYear, viewMonth))}
                        </h3>
                        <button
                            onClick={goToToday}
                            className="text-[10px] font-bold text-primary-dark uppercase tracking-wider hover:underline"
                        >
                            Today
                        </button>
                    </div>

                    <button
                        onClick={goToNextMonth}
                        className="size-10 rounded-xl bg-slate-50 hover:bg-primary/10 flex items-center justify-center transition-colors active:scale-95"
                    >
                        <span className="material-symbols-outlined text-text-main text-[20px]">chevron_right</span>
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-0 px-3 pt-3">
                    {weekDays.map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-text-light uppercase tracking-wider py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 p-3">
                    {calendarGrid.map((cell, idx) => {
                        const workout = cell.workout;
                        const bgColor = workout ? typeColorMap[workout.type] || '#E2E8F0' : undefined;
                        const isSelected = selectedDay && isSameDay(cell.date, selectedDay.date);

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDay(cell.workout ? cell : null)}
                                className={`
                  relative flex flex-col items-center justify-center
                  rounded-xl h-12 transition-all
                  ${!cell.isCurrentMonth ? 'opacity-30' : ''}
                  ${cell.isToday ? 'ring-2 ring-primary-dark ring-offset-1' : ''}
                  ${isSelected ? 'scale-110 shadow-lg z-10' : 'hover:scale-105'}
                  ${workout ? 'cursor-pointer' : 'cursor-default'}
                `}
                                style={{
                                    backgroundColor: bgColor
                                        ? isSelected ? bgColor : `${bgColor}40`
                                        : cell.isCurrentMonth ? '#F8FAFC' : 'transparent',
                                }}
                            >
                                <span className={`text-xs font-bold ${workout
                                        ? (workout.isCompleted ? 'text-white' : 'text-text-main')
                                        : 'text-text-light'
                                    }`}>
                                    {cell.dayOfMonth}
                                </span>

                                {/* Completed indicator */}
                                {workout?.isCompleted && (
                                    <div
                                        className="absolute inset-0 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${bgColor}CC` }}
                                    >
                                        <span className="text-xs font-bold text-white">{cell.dayOfMonth}</span>
                                        <span className="material-symbols-outlined text-white text-[12px] absolute bottom-0.5 right-0.5">check_circle</span>
                                    </div>
                                )}

                                {/* Workout type dot for non-completed */}
                                {workout && !workout.isCompleted && (
                                    <div
                                        className="absolute bottom-0.5 size-1.5 rounded-full"
                                        style={{ backgroundColor: bgColor }}
                                    ></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Day Detail */}
            {selectedDay?.workout && (
                <div
                    className="bg-white rounded-3xl shadow-soft border border-slate-100 p-5 animate-[fadeIn_0.2s_ease-out] overflow-hidden relative"
                >
                    <div
                        className="absolute top-0 left-0 w-2 h-full"
                        style={{ backgroundColor: typeColorMap[selectedDay.workout.type] }}
                    ></div>
                    <div className="ml-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="material-symbols-outlined text-[20px]"
                                style={{ color: typeColorMap[selectedDay.workout.type] }}
                            >
                                {typeIconMap[selectedDay.workout.type] || 'circle'}
                            </span>
                            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: typeColorMap[selectedDay.workout.type] }}>
                                {selectedDay.workout.type}
                            </span>
                            {selectedDay.workout.isCompleted && (
                                <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">✓ Done</span>
                            )}
                        </div>
                        <h3 className="text-text-main font-display font-bold text-lg">{selectedDay.workout.title}</h3>
                        <p className="text-text-light text-sm mt-1">{selectedDay.workout.subtitle}</p>
                        {selectedDay.workout.duration && (
                            <div className="flex items-center gap-1 mt-2 text-text-light text-xs">
                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                {selectedDay.workout.duration}
                            </div>
                        )}
                        <p className="text-text-light text-xs mt-2">
                            {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-5">
                <h3 className="text-text-main font-display font-bold text-sm mb-3">Legend</h3>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(typeColorMap).map(([type, color]) => (
                        <div key={type} className="flex items-center gap-2">
                            <div className="size-4 rounded-md" style={{ backgroundColor: color }}></div>
                            <span className="text-text-light text-xs font-medium">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
