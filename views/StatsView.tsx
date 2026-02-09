import React from 'react';
import { usePlanProgress } from '../hooks/usePlanProgress';

export const StatsView: React.FC = () => {
    const {
        plan: planData,
        completedDaysCount,
        currentStreak,
        currentWeek,
        progressPercent
    } = usePlanProgress();

    // Calculate total distance based on completed workouts
    // Assume a completed day averages 4km for this demo calculation
    const totalKmRun = completedDaysCount * 4;

    // Build weekly volume data from actual plan state
    const weeklyVolume = planData.map((week, index) => {
        const weekNum = index + 1;
        const weekCompletedDays = week.days.filter(d => d.isCompleted).length;
        const totalDays = week.days.length;

        // Estimate km based on week structure (could be more accurate with actual data)
        const basekm = 20 + (index * 3); // Progressive volume
        const actualKm = totalDays > 0
            ? Math.round((weekCompletedDays / totalDays) * basekm)
            : 0;

        let status: 'completed' | 'active' | 'future' = 'future';
        if (weekNum < currentWeek) {
            status = 'completed';
        } else if (weekNum === currentWeek) {
            status = 'active';
        }

        return {
            week: weekNum,
            km: actualKm > 0 ? actualKm : basekm, // Show planned if no progress
            status
        };
    });

    // Calculate this week's km
    const thisWeekKm = weeklyVolume.find(w => w.status === 'active')?.km || 0;

    return (
        <div className="flex flex-col p-6 gap-6 pb-32 animate-[fadeIn_0.5s]">
            <h2 className="text-text-main text-2xl font-display font-bold">Your Progress 📊</h2>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 size-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark mb-1">
                        <span className="material-symbols-outlined">fitness_center</span>
                    </div>
                    <span className="text-3xl font-display font-bold text-text-main">{completedDaysCount}</span>
                    <span className="text-xs text-text-light font-bold uppercase tracking-wider">Workouts Done</span>
                </div>
            </div>

            {/* Weekly Consistency Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Weekly Volume</h3>
                        <p className="text-sm text-text-light">Kilometers planned vs run</p>
                    </div>
                    <span className="text-2xl font-bold text-primary-dark">{thisWeekKm}<span className="text-sm text-text-light font-normal ml-1">km this week</span></span>
                </div>

                <div className="flex items-end justify-between gap-3 h-40 pt-4 border-b border-slate-50 pb-0">
                    {weeklyVolume.map((w) => (
                        <div key={w.week} className="flex flex-col items-center gap-3 flex-1 group h-full justify-end">
                            <div className="w-full bg-slate-50 rounded-t-xl relative w-full max-w-[40px] flex items-end overflow-hidden h-full">
                                <div
                                    className={`w-full rounded-t-xl transition-all duration-1000 ease-out ${w.status === 'completed' ? 'bg-secondary opacity-60' :
                                        w.status === 'active' ? 'bg-gradient-to-t from-primary to-primary-dark' : 'bg-slate-100'
                                        }`}
                                    style={{ height: `${(w.km / 35) * 100}%` }}
                                >
                                    {w.status === 'active' && (
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                            <span className={`text-xs font-bold ${w.status === 'active' ? 'text-primary-dark' : 'text-slate-300'}`}>W{w.week}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total Distance Card */}
            <div className="bg-white p-4 rounded-3xl shadow-soft border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                        <span className="material-symbols-outlined">route</span>
                    </div>
                    <div>
                        <p className="text-text-main font-bold text-lg">Total Distance</p>
                        <p className="text-text-light text-sm">{completedDaysCount > 0 ? 'Keep going!' : 'Start your journey!'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-display font-bold text-text-main">{totalKmRun} <span className="text-sm font-medium text-text-light">km</span></p>
                </div>
            </div>

            {/* Badge/Achievement - Show only if Week 1 completed */}
            {currentWeek > 1 && (
                <div className="bg-gradient-to-r from-secondary to-purple-400 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:translate-x-5 transition-transform"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <span className="text-4xl shadow-sm filter drop-shadow-md">👟</span>
                        <div>
                            <h3 className="font-bold text-lg">Base Builder</h3>
                            <p className="text-white/90 text-sm font-medium">Completed Week 1 successfully!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};