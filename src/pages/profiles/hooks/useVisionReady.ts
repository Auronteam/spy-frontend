import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchVisionReady } from '@/api/vision-browser';

interface Profile {
    id: string;
}

type ReadyMap = Record<string, boolean>;

type UseVisionReadyReturn = {
    isVisionReady: (profileId: string) => boolean;
};

// Polls backend readiness for active profiles and exposes readiness map
export function useVisionReady(
    profiles: Profile[],
    isVisionActive: (profileId: string) => boolean
): UseVisionReadyReturn {
    const [readyById, setReadyById] = useState<ReadyMap>({});
    const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

    // Clear timers on unmount
    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach(clearInterval);
            timers.current = {};
        };
    }, []);

    // Start/stop polling per active profile
    useEffect(() => {
        const currentIds = profiles.map(p => p.id);

        // Stop timers for profiles that are no longer present
        Object.keys(timers.current).forEach(id => {
            if (!currentIds.includes(id)) {
                clearInterval(timers.current[id]);
                delete timers.current[id];
            }
        });

        currentIds.forEach(id => {
            const active = isVisionActive(id);

            // Reset readiness when not active
            if (!active) {
                if (readyById[id]) {
                    setReadyById(prev => ({ ...prev, [id]: false }));
                }
                if (timers.current[id]) {
                    clearInterval(timers.current[id]);
                    delete timers.current[id];
                }
                return;
            }

            // If already marked ready, no polling needed
            if (readyById[id]) {
                if (timers.current[id]) {
                    clearInterval(timers.current[id]);
                    delete timers.current[id];
                }
                return;
            }

            // Start polling if not already
            if (!timers.current[id]) {
                const poll = async () => {
                    try {
                        const res = await fetchVisionReady(id);
                        if (res.ready) {
                            setReadyById(prev => ({ ...prev, [id]: true }));
                            if (timers.current[id]) {
                                clearInterval(timers.current[id]);
                                delete timers.current[id];
                            }
                        }
                    } catch {
                        // keep polling; readiness can become true later
                    }
                };

                // first call immediately, then interval (no more frequent than every 2.5s per profile)
                poll();
                timers.current[id] = setInterval(poll, 2500);
            }
        });
    }, [profiles, isVisionActive, readyById]);

    const isVisionReady = useMemo(() => {
        return (profileId: string) => !!readyById[profileId];
    }, [readyById]);

    return { isVisionReady };
}
