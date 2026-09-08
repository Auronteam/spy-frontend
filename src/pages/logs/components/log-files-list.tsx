import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { formatDateTime, formatFileSize } from '@/lib/utils';
import type { LogFile } from '@/pages/logs/types';

interface LogFilesListProps {
    files: LogFile[];
    filesLoading: boolean;
    selectedFile: string;
    onSelectFile: (fileName: string) => void;
    onRefetch: () => void;
}

export const LogFilesList = ({
    files,
    filesLoading,
    selectedFile,
    onSelectFile,
    onRefetch,
}: LogFilesListProps) => {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Log Files
                    <Button variant="ghost" size="sm" onClick={onRefetch} disabled={filesLoading}>
                        {filesLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {filesLoading ? (
                    <div className="py-4">
                        <Spinner />
                    </div>
                ) : files.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        This profile hasn't run in the last 3 days
                    </p>
                ) : (
                    <div className="space-y-2">
                        {files.map(file => (
                            <button
                                key={file.name}
                                type="button"
                                aria-pressed={selectedFile === file.name}
                                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                    selectedFile === file.name
                                        ? 'border-foreground bg-muted'
                                        : 'border-transparent hover:bg-muted'
                                }`}
                                onClick={() => onSelectFile(file.name)}
                            >
                                <div className="text-sm font-medium">{file.name}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    <div>{formatFileSize(file.size)}</div>
                                    <div>{formatDateTime(file.modified)}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
