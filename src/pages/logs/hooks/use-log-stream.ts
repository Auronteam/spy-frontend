import { useCallback, useEffect, useRef, useState } from 'react';
import { withAuthToken } from '@/lib/client-auth';

interface LogStreamMessage {
    type: string;
    content?: string;
}

interface UseLogStreamResult {
    isLiveMode: boolean;
    isConnected: boolean;
    liveLogContent: string;
    toggleLiveMode: () => void;
}

const RECONNECT_DELAY_MS = 3000;
// Caps the buffer by line count — without it liveLogContent grows unbounded
// over a long live session, and the viewer renders one <div> per line with no
// virtualization, so an hours-long watch would gradually hang the tab.
const MAX_LIVE_LOG_LINES = 2000;

function appendCapped(prev: string, addition: string): string {
    const combined = prev + addition;
    const lines = combined.split('\n');
    if (lines.length <= MAX_LIVE_LOG_LINES) return combined;
    return lines.slice(-MAX_LIVE_LOG_LINES).join('\n');
}

export function useLogStream(streamUrl: string): UseLogStreamResult {
    const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [liveLogContent, setLiveLogContent] = useState<string>('');

    const eventSourceRef = useRef<EventSource | null>(null);
    // Mirrors isLiveMode without waiting on batched setState — onerror reads this
    // from inside a setTimeout, where a state closure would be stale.
    const isLiveModeRef = useRef<boolean>(false);

    const connect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(withAuthToken(streamUrl));
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.onmessage = (event: MessageEvent<string>) => {
            try {
                const data: LogStreamMessage = JSON.parse(event.data);
                const content = data.content;
                if (data.type === 'log' && content) {
                    setLiveLogContent(prev => appendCapped(prev, content));
                }
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = () => {
            setIsConnected(false);
            setTimeout(() => {
                if (isLiveModeRef.current) {
                    connect();
                }
            }, RECONNECT_DELAY_MS);
        };
    }, [streamUrl]);

    const disconnect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsConnected(false);
        setLiveLogContent('');
    }, []);

    const toggleLiveMode = useCallback(() => {
        if (!isLiveModeRef.current) {
            isLiveModeRef.current = true;
            setIsLiveMode(true);
            // Buffer is cleared only on an explicit user start, not in onopen —
            // otherwise auto-reconnect after a drop would wipe content already
            // shown before the connection broke.
            setLiveLogContent('');
            connect();
        } else {
            isLiveModeRef.current = false;
            setIsLiveMode(false);
            disconnect();
        }
    }, [connect, disconnect]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return { isLiveMode, isConnected, liveLogContent, toggleLiveMode };
}
