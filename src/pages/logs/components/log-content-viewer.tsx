import type { RefObject } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const TIMESTAMP_PATTERN = /^\[\d{4}-\d{2}-\d{2} (\d{2}:\d{2}:\d{2})\]\s?(.*)$/;

function splitLogLine(line: string): { time: string; message: string } {
    const match = line.match(TIMESTAMP_PATTERN);
    return match ? { time: match[1], message: match[2] } : { time: '', message: line };
}

function LiveStatusDot({ live, label }: { live: boolean; label: string }) {
    return (
        <span
            className={`flex items-center gap-1.5 text-xs font-medium ${live ? 'text-green-700' : 'text-muted-foreground'}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-green-600' : 'bg-zinc-400'}`} />
            {label}
        </span>
    );
}

function LogLines({ content, placeholder }: { content: string; placeholder: string }) {
    const lines = content.split('\n').filter(line => line.length > 0);

    if (lines.length === 0) {
        return (
            <div className="px-3.5 py-8 text-center text-sm text-muted-foreground">
                {placeholder}
            </div>
        );
    }

    return (
        <>
            {lines.map((line, idx) => {
                const { time, message } = splitLogLine(line);
                return (
                    <div
                        key={idx}
                        className="grid grid-cols-[80px_1fr] items-start gap-3 border-b px-3.5 py-2 text-xs last:border-0"
                    >
                        <span className="font-mono text-muted-foreground">{time}</span>
                        <span className="whitespace-pre-wrap break-words font-mono text-foreground/90">
                            {message}
                        </span>
                    </div>
                );
            })}
        </>
    );
}

interface LogContentViewerProps {
    selectedFile: string;
    isLiveMode: boolean;
    isConnected: boolean;
    isScannerRunning: boolean;
    liveLogContent: string;
    logContent: string;
    contentLoading: boolean;
    liveLogRef: RefObject<HTMLDivElement | null>;
    staticLogRef: RefObject<HTMLDivElement | null>;
    onScroll: () => void;
    onToggleLiveMode: () => void;
}

export const LogContentViewer = ({
    selectedFile,
    isLiveMode,
    isConnected,
    isScannerRunning,
    liveLogContent,
    logContent,
    contentLoading,
    liveLogRef,
    staticLogRef,
    onScroll,
    onToggleLiveMode,
}: LogContentViewerProps) => {
    return (
        <Card className="overflow-hidden p-0">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 border-b px-3.5 py-2.5">
                <span className="truncate font-mono text-xs font-medium">
                    {isLiveMode ? 'live-stream' : selectedFile || '—'}
                </span>
                <div className="flex items-center gap-3">
                    {isLiveMode && (
                        <LiveStatusDot
                            live={isConnected}
                            label={isConnected ? 'Live' : 'Connecting...'}
                        />
                    )}
                    {!isScannerRunning && !isLiveMode && (
                        <span className="text-xs text-muted-foreground">Scanner is off</span>
                    )}
                    <Button
                        variant={isLiveMode ? 'outline' : 'default'}
                        size="sm"
                        onClick={onToggleLiveMode}
                        disabled={!isLiveMode && !isScannerRunning}
                    >
                        {isLiveMode ? 'Stop live stream' : 'Start live stream'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {contentLoading ? (
                    <div className="py-8">
                        <Spinner />
                    </div>
                ) : isLiveMode ? (
                    <div
                        ref={liveLogRef}
                        onScroll={onScroll}
                        className="max-h-[460px] overflow-auto"
                    >
                        <LogLines content={liveLogContent} placeholder="Waiting for live logs..." />
                    </div>
                ) : (
                    <div ref={staticLogRef} className="max-h-[460px] overflow-auto">
                        <LogLines content={logContent} placeholder="No content to display" />
                    </div>
                )}
            </CardContent>
            {isLiveMode && isConnected && (
                <div className="flex items-center gap-2 border-t bg-muted/50 px-3.5 py-2.5">
                    <LiveStatusDot live label="Streaming live" />
                </div>
            )}
        </Card>
    );
};
