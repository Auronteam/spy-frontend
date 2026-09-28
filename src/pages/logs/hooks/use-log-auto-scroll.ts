import { useEffect, useRef, type RefObject } from 'react';
import type { LogLine } from '../types';

type UseLogAutoScrollParams = {
    isLiveMode: boolean;
    liveLogLines: readonly LogLine[];
    logLines: readonly LogLine[];
};

type UseLogAutoScrollResult = {
    liveLogRef: RefObject<HTMLDivElement | null>;
    staticLogRef: RefObject<HTMLDivElement | null>;
    handleScroll: () => void;
};

export function useLogAutoScroll({
    isLiveMode,
    liveLogLines,
    logLines,
}: UseLogAutoScrollParams): UseLogAutoScrollResult {
    const liveLogRef = useRef<HTMLDivElement>(null);
    const staticLogRef = useRef<HTMLDivElement>(null);
    const shouldAutoScrollRef = useRef<boolean>(true);

    const handleScroll = () => {
        if (liveLogRef.current) {
            const el = liveLogRef.current;
            const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
            shouldAutoScrollRef.current = isAtBottom;
        }
    };

    useEffect(() => {
        if (isLiveMode && liveLogRef.current && shouldAutoScrollRef.current) {
            requestAnimationFrame(() => {
                if (liveLogRef.current) {
                    liveLogRef.current.scrollTop = liveLogRef.current.scrollHeight;
                }
            });
        }
    }, [liveLogLines, isLiveMode]);

    useEffect(() => {
        if (!isLiveMode && staticLogRef.current && logLines.length > 0) {
            staticLogRef.current.scrollTop = staticLogRef.current.scrollHeight;
        }
    }, [logLines, isLiveMode]);

    return { liveLogRef, staticLogRef, handleScroll };
}
