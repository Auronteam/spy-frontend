import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { withAuthToken } from '@/lib/client-auth';
import { appendLogChunk, EMPTY_LIVE_LOG_BUFFER } from '../utils';
import type { LiveLogBuffer, LogLine } from '../types';

type LogStreamMessage = {
    type: string;
    content?: string;
};

type UseLogStreamOptions = {
    onGiveUp?: () => void;
};

type UseLogStreamResult = {
    isLiveMode: boolean;
    isConnected: boolean;
    liveLogLines: readonly LogLine[];
    toggleLiveMode: () => void;
};

const RECONNECT_BASE_DELAY_MS = 3000;
const RECONNECT_MAX_DELAY_MS = 30_000;
const MAX_CONSECUTIVE_FAILURES = 5;
// Caps the buffer by line count — without it the live buffer grows unbounded
// over a long live session, and the viewer renders one <div> per line with no
// virtualization, so an hours-long watch would gradually hang the tab.
const MAX_LIVE_LOG_LINES = 2000;

function isLogStreamMessage(value: unknown): value is LogStreamMessage {
    if (typeof value !== 'object' || value === null) return false;
    if (!('type' in value) || typeof value.type !== 'string') return false;
    return (
        !('content' in value) || value.content === undefined || typeof value.content === 'string'
    );
}

function getReconnectDelay(failures: number): number {
    return Math.min(RECONNECT_BASE_DELAY_MS * 2 ** (failures - 1), RECONNECT_MAX_DELAY_MS);
}

export function useLogStream(
    streamUrl: string,
    { onGiveUp }: UseLogStreamOptions = {}
): UseLogStreamResult {
    const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [liveLogBuffer, setLiveLogBuffer] = useState<LiveLogBuffer>(EMPTY_LIVE_LOG_BUFFER);

    const eventSourceRef = useRef<EventSource | null>(null);
    // Mirrors isLiveMode without waiting on batched setState — onerror reads this
    // from inside a setTimeout, where a state closure would be stale.
    const isLiveModeRef = useRef<boolean>(false);
    const reconnectTimerRef = useRef<number | null>(null);
    const failureCountRef = useRef<number>(0);
    const onGiveUpRef = useRef<(() => void) | undefined>(onGiveUp);

    useEffect(() => {
        onGiveUpRef.current = onGiveUp;
    }, [onGiveUp]);

    const clearReconnectTimer = useCallback(() => {
        if (reconnectTimerRef.current !== null) {
            window.clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    }, []);

    const disconnect = useCallback(() => {
        clearReconnectTimer();
        failureCountRef.current = 0;
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsConnected(false);
        setLiveLogBuffer(EMPTY_LIVE_LOG_BUFFER);
    }, [clearReconnectTimer]);

    const giveUp = useCallback(() => {
        isLiveModeRef.current = false;
        setIsLiveMode(false);
        disconnect();
        toast.error('Live logs connection lost. Live mode turned off.');
        onGiveUpRef.current?.();
    }, [disconnect]);

    const connect = useCallback(() => {
        clearReconnectTimer();
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(withAuthToken(streamUrl));
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            if (eventSourceRef.current !== eventSource) return;
            failureCountRef.current = 0;
            setIsConnected(true);
        };

        eventSource.onmessage = (event: MessageEvent<string>) => {
            failureCountRef.current = 0;
            try {
                const parsed: unknown = JSON.parse(event.data);
                if (!isLogStreamMessage(parsed)) return;
                const content = parsed.content;
                if (parsed.type === 'log' && content) {
                    setLiveLogBuffer(prev => appendLogChunk(prev, content, MAX_LIVE_LOG_LINES));
                }
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = () => {
            if (eventSourceRef.current !== eventSource) return;
            eventSource.close();
            eventSourceRef.current = null;
            setIsConnected(false);
            clearReconnectTimer();
            failureCountRef.current += 1;
            if (failureCountRef.current >= MAX_CONSECUTIVE_FAILURES) {
                giveUp();
                return;
            }
            reconnectTimerRef.current = window.setTimeout(() => {
                reconnectTimerRef.current = null;
                if (isLiveModeRef.current) {
                    connect();
                }
            }, getReconnectDelay(failureCountRef.current));
        };
    }, [streamUrl, clearReconnectTimer, giveUp]);

    const toggleLiveMode = useCallback(() => {
        if (!isLiveModeRef.current) {
            isLiveModeRef.current = true;
            setIsLiveMode(true);
            // Buffer is cleared only on an explicit user start, not in onopen —
            // otherwise auto-reconnect after a drop would wipe content already
            // shown before the connection broke.
            setLiveLogBuffer(EMPTY_LIVE_LOG_BUFFER);
            connect();
        } else {
            isLiveModeRef.current = false;
            setIsLiveMode(false);
            disconnect();
        }
    }, [connect, disconnect]);

    useEffect(() => {
        return () => {
            isLiveModeRef.current = false;
            disconnect();
        };
    }, [disconnect]);

    return {
        isLiveMode,
        isConnected,
        liveLogLines: liveLogBuffer.lines,
        toggleLiveMode,
    };
}
