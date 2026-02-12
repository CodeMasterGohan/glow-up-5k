import React, { useRef } from 'react';

interface StartDatePickerProps {
    startDate: string | null;
    onSetStartDate: (date: string | null) => void;
}

/**
 * Format an ISO date string to a human-readable format, e.g. "Wednesday, Feb 12, 2026"
 */
function formatDateLong(iso: string): string {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Compute the end date given a start date and 35 days (5 weeks × 7 days).
 */
function computeEndDate(iso: string): string {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + 34); // 0-indexed: day 0 to day 34 = 35 days
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export const StartDatePicker: React.FC<StartDatePickerProps> = ({ startDate, onSetStartDate }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            onSetStartDate(value);
        }
    };

    const handleClear = () => {
        onSetStartDate(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    if (!startDate) {
        // No start date set – show the prompt
        return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-white/60 p-6 border border-white/60 shadow-soft backdrop-blur-md group transition-all hover:shadow-lg">
                {/* Decorative blurs */}
                <div className="absolute -right-8 -top-8 size-28 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                <div className="absolute -left-8 -bottom-8 size-28 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors"></div>

                <div className="relative flex flex-col items-center gap-4">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined text-white text-[28px]">event</span>
                    </div>

                    <div className="text-center">
                        <h3 className="text-text-main font-display font-bold text-lg">Set Your Start Date</h3>
                        <p className="text-text-light text-sm mt-1">Choose when to begin your 5-week journey</p>
                    </div>

                    <label className="relative w-full cursor-pointer">
                        <input
                            ref={inputRef}
                            type="date"
                            onChange={handleDateChange}
                            title="Select your program start date"
                            placeholder="Select a date"
                            className="w-full bg-white border-2 border-primary/20 rounded-2xl px-5 py-3.5 text-text-main font-display font-bold text-center text-base focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm hover:border-primary/40 appearance-none"
                            style={{ colorScheme: 'light' }}
                        />
                    </label>
                </div>
            </div>
        );
    }

    // Start date is set – show summary
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-white/60 p-5 border border-white/60 shadow-soft backdrop-blur-md group transition-all">
            {/* Decorative blurs */}
            <div className="absolute -right-6 -top-6 size-24 bg-primary/8 rounded-full blur-xl"></div>
            <div className="absolute -left-6 -bottom-6 size-24 bg-secondary/8 rounded-full blur-xl"></div>

            <div className="relative flex items-start gap-4">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                    <span className="material-symbols-outlined text-white text-[22px]">event_available</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold tracking-widest text-primary-dark uppercase">Program Schedule</p>
                        <button
                            onClick={handleClear}
                            className="text-[10px] font-bold text-text-light hover:text-primary-dark transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
                        >
                            Change
                        </button>
                    </div>
                    <p className="text-text-main font-display font-bold text-base mt-1 truncate">
                        {formatDateLong(startDate)}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="material-symbols-outlined text-text-light text-[14px]">arrow_forward</span>
                        <p className="text-text-light text-xs font-medium">
                            Ends {computeEndDate(startDate)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
