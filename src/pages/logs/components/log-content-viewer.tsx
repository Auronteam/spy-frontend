import type { RefObject } from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { LogLine } from '../types';
import { LogLines } from './log-lines';

interface LiveStatusDotProps {
    live: boolean;
    label: string;
}

const LiveStatusDot = ({ live, label }: LiveStatusDotProps) => {
    return (
        <span
            className={cn(
                'flex items-center gap-1.5 text-xs font-medium',
                live ? 'text-success-strong' : 'text-muted-foreground'
            )}
        >
            <span
                className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    live ? 'bg-success' : 'bg-muted-foreground/70'
                )}
            />
            {label}
        </span>
    );
};

interface LogContentViewerProps {
    selectedFile: string;
    isLiveMode: boolean;
    isConnected: boolean;
    isScannerRunning: boolean;
    liveLogLines: readonly LogLine[];
    logLines: readonly LogLine[];
    contentLoading: boolean;
    liveLogRef: RefObject<HTMLDivElement | null>;
    staticLogRef: RefObject<HTMLDivElement | null>;
    onScroll: () => void;
    onToggleLiveMode: () => void;
    onDownload: () => void;
}

export const LogContentViewer = ({
    selectedFile,
    isLiveMode,
    isConnected,
    isScannerRunning,
    liveLogLines,
    logLines,
    contentLoading,
    liveLogRef,
    staticLogRef,
    onScroll,
    onToggleLiveMode,
    onDownload,
}: LogContentViewerProps) => {
    const hasContent = (isLiveMode ? liveLogLines : logLines).length > 0;

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
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={onDownload}
                        disabled={!hasContent || contentLoading}
                        aria-label="Download log"
                        title="Download log"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </Button>
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
                        className="max-h-log-viewer overflow-auto"
                    >
                        <LogLines lines={liveLogLines} placeholder="Waiting for live logs..." />
                    </div>
                ) : (
                    <div ref={staticLogRef} className="max-h-log-viewer overflow-auto">
                        <LogLines lines={logLines} placeholder="No content to display" />
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
