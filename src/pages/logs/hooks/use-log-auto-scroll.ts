import { useEffect, useRef, type RefObject } from 'react';

interface UseLogAutoScrollParams {
    isLiveMode: boolean;
    liveLogContent: string;
    logContent: string;
}

interface UseLogAutoScrollResult {
    liveLogRef: RefObject<HTMLDivElement | null>;
    staticLogRef: RefObject<HTMLDivElement | null>;
    handleScroll: () => void;
}

export function useLogAutoScroll({
    isLiveMode,
    liveLogContent,
    logContent,
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
    }, [liveLogContent, isLiveMode]);

    useEffect(() => {
        if (!isLiveMode && staticLogRef.current && logContent) {
            staticLogRef.current.scrollTop = staticLogRef.current.scrollHeight;
        }
    }, [logContent, isLiveMode]);

    return { liveLogRef, staticLogRef, handleScroll };
}
