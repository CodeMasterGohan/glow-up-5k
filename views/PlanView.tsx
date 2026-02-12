import React, { useState, useEffect } from 'react';
import { usePlanProgress } from '../hooks/usePlanProgress';
import { WeekCard } from '../components/WeekCard';
import { Header } from '../components/Header';
import { StartDatePicker } from '../components/StartDatePicker';
import { WorkoutTimer } from '../components/WorkoutTimer';
import { DayPlan } from '../types';

const MOTIVATIONAL_QUOTES = [
  { text: "Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God?", author: "1 Corinthians 6:19" },
  { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary.", author: "Isaiah 40:31" },
  { text: "I pray that you may enjoy good health and that all may go well with you, even as your soul is getting along well.", author: "3 John 1:2" },
  { text: "She sets about her work vigorously; her arms are strong for her tasks.", author: "Proverbs 31:17" },
  { text: "Let us run with perseverance the race marked out for us.", author: "Hebrews 12:1" },
  { text: "Do you not know that in a race all the runners run, but only one gets the prize? Run in such a way as to get the prize.", author: "1 Corinthians 9:24" },
  { text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.", author: "Psalm 139:14" },
  { text: "For physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come.", author: "1 Timothy 4:8" }
];

export const PlanView: React.FC = () => {
  const {
    plan: planData,
    toggleDay,
    resetProgress,
    currentWeek,
    totalWeeks,
    progressPercent,
    startDate,
    setStartDate
  } = usePlanProgress();
  const [openWeekId, setOpenWeekId] = useState<string | null>('week-1');
  const [activeWorkout, setActiveWorkout] = useState<DayPlan | null>(null);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  const handleReset = () => {
    resetProgress();
    setOpenWeekId('week-1');
    setActiveWorkout(null);
  };

  useEffect(() => {
    // Select a random quote on mount
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  const handleToggleWeek = (id: string) => {
    setOpenWeekId(prev => prev === id ? null : id);
  };

  const handleStartWorkout = (day: DayPlan) => {
    setActiveWorkout(day);
  };

  const handleWorkoutComplete = (dayId: string) => {
    toggleDay(dayId);
    setActiveWorkout(null);
  };

  return (
    <>
      <Header
        onReset={handleReset}
        currentWeek={currentWeek}
        totalWeeks={totalWeeks}
        progressPercent={progressPercent}
      />
      <div className="flex flex-col p-5 gap-5 pb-32 z-10">
        <h2 className="text-text-main text-2xl font-display font-bold px-1">Let's Run! 🏃‍♀️</h2>

        {/* Motivational Quote Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/40 p-5 border border-white/60 shadow-sm backdrop-blur-sm group transition-all hover:shadow-soft">
          <div className="absolute -right-6 -top-6 size-24 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-colors"></div>
          <div className="absolute -left-6 -bottom-6 size-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>

          <div className="relative flex gap-3">
            <span className="material-symbols-outlined text-primary/60 text-3xl shrink-0 rotate-180 mt-[-4px]">format_quote</span>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-text-main font-display font-medium text-sm italic leading-relaxed opacity-90">
                "{quote.text}"
              </p>
              <div className="flex items-center justify-end gap-2">
                <div className="h-[1px] w-8 bg-primary/20"></div>
                <p className="text-text-light text-[10px] font-bold uppercase tracking-wider">
                  {quote.author}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Date Picker */}
        <StartDatePicker startDate={startDate} onSetStartDate={setStartDate} />

        {planData.map(week => (
          <WeekCard
            key={week.id}
            week={week}
            isOpen={openWeekId === week.id}
            onToggle={() => handleToggleWeek(week.id)}
            onStartWorkout={handleStartWorkout}
            onToggleComplete={toggleDay}
          />
        ))}
      </div>

      {activeWorkout && (
        <WorkoutTimer
          workout={activeWorkout}
          onClose={() => setActiveWorkout(null)}
          onComplete={() => handleWorkoutComplete(activeWorkout.id)}
        />
      )}
    </>
  );
};