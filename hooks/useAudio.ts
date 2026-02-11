import { useRef, useEffect, useCallback } from 'react';

type SoundType = 'start' | 'pause' | 'complete';

export const useAudio = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);

    // Initialize AudioContext on first user interaction or when needed
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                const ctx = new AudioContextClass();
                const gain = ctx.createGain();
                gain.connect(ctx.destination);
                gain.gain.value = 0.2; // Keep it very gentle

                audioContextRef.current = ctx;
                masterGainRef.current = gain;
            }
        }

        // Ensure context is running (browsers might suspend it)
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(console.error);
        }
    }, []);

    const playSound = useCallback((type: SoundType) => {
        // Ensure context is initialized/resumed
        initAudio();

        const ctx = audioContextRef.current;
        const masterGain = masterGainRef.current;

        if (!ctx || !masterGain) return;

        const now = ctx.currentTime;

        try {
            if (type === 'start') {
                // Soft rising major third (C5 -> E5) indicating progress
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

                const gain = ctx.createGain();
                gain.connect(masterGain);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                osc.connect(gain);
                osc.start(now);
                osc.stop(now + 0.5);
            }
            else if (type === 'pause') {
                // Soft falling (E5 -> C5) indicating pause
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(659.25, now); // E5
                osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15); // C5

                const gain = ctx.createGain();
                gain.connect(masterGain);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                osc.connect(gain);
                osc.start(now);
                osc.stop(now + 0.5);
            }
            else if (type === 'complete') {
                // Soft success chord (C Major Arpeggio: C5, E5, G5, C6)
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = freq;

                    const gain = ctx.createGain();
                    gain.connect(masterGain);

                    const startTime = now + (i * 0.12); // Staggered entrance

                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

                    osc.connect(gain);
                    osc.start(startTime);
                    osc.stop(startTime + 1.3);
                });
            }
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }, [initAudio]);

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            // Try to use a native voice if possible
            // const voices = window.speechSynthesis.getVoices();
            // const preferredVoice = voices.find(v => v.lang.startsWith('en-US'));
            // if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(console.error);
                audioContextRef.current = null;
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return { playSound, speak };
};
