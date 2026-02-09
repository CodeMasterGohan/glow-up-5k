import React, { useState, useEffect } from 'react';

interface Race {
    id: string;
    name: string;
    date: string;
    distance: string;
}

export const RacesView: React.FC = () => {
    // Initialize state from local storage or default data
    const [races, setRaces] = useState<Race[]>(() => {
        try {
            const saved = localStorage.getItem('glowUp_races');
            return saved ? JSON.parse(saved) : [
                { id: '1', name: 'Summer Solstice 5K', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0], distance: '5K' }
            ];
        } catch (e) {
            return [];
        }
    });

    const [isAdding, setIsAdding] = useState(false);
    const [newRace, setNewRace] = useState({ name: '', date: '', distance: '5K' });

    // Persist to local storage whenever races change
    useEffect(() => {
        localStorage.setItem('glowUp_races', JSON.stringify(races));
    }, [races]);

    const handleAdd = () => {
        if (!newRace.name || !newRace.date) return;
        setRaces([...races, { ...newRace, id: Date.now().toString() }]);
        setIsAdding(false);
        setNewRace({ name: '', date: '', distance: '5K' });
    };

    const deleteRace = (id: string) => {
        const raceToDelete = races.find(r => r.id === id);
        if (window.confirm(`Are you sure you want to delete "${raceToDelete?.name}"?`)) {
            setRaces(races.filter(r => r.id !== id));
        }
    }

    const getDaysUntil = (dateStr: string) => {
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        return days;
    };

    // Sort races by date: Nearest (earliest date) to Furthest (latest date)
    // We use [...races] to create a shallow copy because .sort() mutates the array in place
    const sortedRaces = [...races].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="flex flex-col p-6 gap-6 pb-32 animate-[fadeIn_0.5s]">
            <div className="flex justify-between items-center">
                <h2 className="text-text-main text-2xl font-display font-bold">Upcoming Races 🏆</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`size-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isAdding ? 'bg-slate-100 text-text-main rotate-45' : 'bg-primary text-white hover:bg-primary-dark'}`}
                >
                    <span className="material-symbols-outlined">add</span>
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-5 rounded-3xl shadow-soft border border-primary/20 animate-[slideDown_0.3s_ease-out]">
                    <h3 className="font-bold text-text-main mb-4">Add New Race</h3>
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Race Name (e.g. Color Run)"
                            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-main placeholder:text-slate-300 font-medium"
                            value={newRace.name}
                            onChange={e => setNewRace({ ...newRace, name: e.target.value })}
                        />
                        <div className="flex gap-3">
                            <input
                                type="date"
                                title="Race Date"
                                aria-label="Race Date"
                                className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-light font-medium"
                                value={newRace.date}
                                onChange={e => setNewRace({ ...newRace, date: e.target.value })}
                            />
                            <div className="relative">
                                <select
                                    title="Race Distance"
                                    aria-label="Race Distance"
                                    className="h-full pl-4 pr-8 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-main font-bold appearance-none"
                                    value={newRace.distance}
                                    onChange={e => setNewRace({ ...newRace, distance: e.target.value })}
                                >
                                    <option>5K</option>
                                    <option>10K</option>
                                    <option>Half</option>
                                    <option>Full</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">expand_more</span>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={!newRace.name || !newRace.date}
                            className="w-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl mt-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">check</span>
                            Save Race
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {races.length === 0 && !isAdding && (
                    <div className="text-center py-20 opacity-50 flex flex-col items-center">
                        <span className="text-6xl mb-4 grayscale">🏁</span>
                        <p className="text-lg font-bold text-text-main">No races planned yet</p>
                        <p className="text-sm text-text-light">Tap the + button to add your goal race!</p>
                    </div>
                )}

                {sortedRaces.map(race => {
                    const days = getDaysUntil(race.date);
                    const isPast = days < 0;

                    return (
                        <div key={race.id} className="group relative overflow-hidden bg-white p-5 rounded-3xl shadow-soft border border-slate-100 hover:border-primary/30 transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:bg-accent/15 transition-colors"></div>

                            <div className="relative z-10 flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${isPast ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary-dark'}`}>
                                            {race.distance}
                                        </span>
                                        {isPast && <span className="text-[10px] font-bold text-slate-400 uppercase">Completed</span>}
                                    </div>
                                    <h3 className={`font-display font-bold text-lg text-text-main ${isPast ? 'line-through opacity-50' : ''}`}>{race.name}</h3>
                                    <p className="text-sm text-text-light flex items-center gap-1 mt-1 font-medium">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                        {new Date(race.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 ml-4">
                                    {!isPast && (
                                        <div className="flex flex-col items-center justify-center bg-white border-2 border-slate-50 p-2 rounded-2xl min-w-[70px] shadow-sm">
                                            <span className="text-2xl font-bold text-primary-dark leading-none">{days}</span>
                                            <span className="text-[9px] font-bold text-text-light uppercase mt-1">Days</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => deleteRace(race.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Delete Race"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};