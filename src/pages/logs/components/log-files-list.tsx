import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
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
                    <p className="text-gray-500 text-sm">
                        This profile hasn't run in the last 3 days
                    </p>
                ) : (
                    <div className="space-y-2">
                        {files.map(file => (
                            <button
                                key={file.name}
                                type="button"
                                aria-pressed={selectedFile === file.name}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                    selectedFile === file.name
                                        ? 'bg-blue-50 border border-blue-200'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                                onClick={() => onSelectFile(file.name)}
                            >
                                <div className="font-medium text-sm">{file.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
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
