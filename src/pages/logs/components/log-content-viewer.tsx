import type { RefObject } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

interface LogContentViewerProps {
    selectedFile: string;
    isLiveMode: boolean;
    isConnected: boolean;
    liveLogContent: string;
    logContent: string;
    contentLoading: boolean;
    liveLogRef: RefObject<HTMLDivElement>;
    staticLogRef: RefObject<HTMLDivElement>;
    onScroll: () => void;
    onToggleLiveMode: () => void;
    onDownload: () => void;
}

export const LogContentViewer = ({
    selectedFile,
    isLiveMode,
    isConnected,
    liveLogContent,
    logContent,
    contentLoading,
    liveLogRef,
    staticLogRef,
    onScroll,
    onToggleLiveMode,
    onDownload,
}: LogContentViewerProps) => {
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        {selectedFile ? `Log Content: ${selectedFile}` : 'Select a log file'}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={isLiveMode ? 'default' : 'outline'}
                            size="sm"
                            onClick={onToggleLiveMode}
                        >
                            {isLiveMode ? 'Stop stream' : 'Start stream'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDownload}
                            disabled={
                                !selectedFile || (!logContent && !liveLogContent) || contentLoading
                            }
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {contentLoading ? (
                    <div className="py-8">
                        <Spinner />
                    </div>
                ) : isLiveMode ? (
                    <div
                        ref={liveLogRef}
                        onScroll={onScroll}
                        className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96"
                    >
                        <div role="status" aria-live="polite" className="mb-2 text-xs text-gray-400">
                            {isConnected ? '🟢 Live stream active' : '🔴 Connecting...'}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            {(liveLogContent
                                ? liveLogContent.split('\n')
                                : ['Waiting for live logs...']
                            )
                                .filter(line => line.length > 0)
                                .map((line, idx) => (
                                    <div key={idx} className="whitespace-pre-wrap">
                                        {line}
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : selectedFile ? (
                    <div
                        ref={staticLogRef}
                        className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96"
                    >
                        <div className="flex flex-col gap-0.5">
                            {(logContent ? logContent.split('\n') : ['No content to display'])
                                .filter(line => line.length > 0)
                                .map((line, idx) => (
                                    <div key={idx} className="whitespace-pre-wrap">
                                        {line}
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {isLiveMode
                            ? 'Live log streaming mode'
                            : 'Select a log file to view its content'}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
