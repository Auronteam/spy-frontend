import { useEffect, useRef, useState } from 'react';

// Local ticker for a smooth pause countdown between infrequent pauseMsLeft
// syncs from the backend.
export function usePauseCountdown(pauseMsLeft: number, paused: boolean): number {
    const [localMsLeft, setLocalMsLeft] = useState<number>(Math.max(0, Math.floor(pauseMsLeft)));
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setLocalMsLeft(Math.max(0, Math.floor(pauseMsLeft)));
    }, [pauseMsLeft]);

    useEffect(() => {
        if (!paused) {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        if (!intervalRef.current) {
            intervalRef.current = window.setInterval(() => {
                setLocalMsLeft(prev => Math.max(0, prev - 1000));
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [paused]);

    return localMsLeft;
}
