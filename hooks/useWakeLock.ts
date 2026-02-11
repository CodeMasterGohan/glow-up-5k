import { useRef, useEffect, useCallback } from 'react';

export const useWakeLock = () => {
    // Use any because WakeLockSentinel might not be in the TS lib yet depending on version
    const wakeLockRef = useRef<any>(null);

    const requestWakeLock = useCallback(async () => {
        if ('wakeLock' in navigator) {
            try {
                // @ts-ignore - navigator.wakeLock is part of the Screen Wake Lock API
                wakeLockRef.current = await navigator.wakeLock.request('screen');
            } catch (err: any) {
                console.warn(`Wake Lock request failed: ${err.name}, ${err.message}`);
            }
        }
    }, []);

    const releaseWakeLock = useCallback(async () => {
        if (wakeLockRef.current) {
            try {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
            } catch (err: any) {
                console.warn(`Wake Lock release failed: ${err.name}, ${err.message}`);
            }
        }
    }, []);

    useEffect(() => {
        // Re-request wake lock if visibility changes (e.g. user switches tab and comes back)
        const handleVisibilityChange = async () => {
            if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            releaseWakeLock();
        };
    }, [requestWakeLock, releaseWakeLock]);

    return { requestWakeLock, releaseWakeLock };
};
