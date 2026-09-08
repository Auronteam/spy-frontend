import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
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
        <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b px-3 py-2.5 text-xs font-medium text-muted-foreground">
                Log files · {files.length}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onRefetch}
                    disabled={filesLoading}
                >
                    {filesLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                    )}
                </Button>
            </div>
            <div className="flex flex-col gap-0.5 p-1.5">
                {files.map(file => (
                    <button
                        key={file.name}
                        type="button"
                        aria-pressed={selectedFile === file.name}
                        className={`flex flex-col gap-0.5 rounded-md px-2.5 py-2 text-left transition-colors ${
                            selectedFile === file.name ? 'bg-muted' : 'hover:bg-muted/60'
                        }`}
                        onClick={() => onSelectFile(file.name)}
                    >
                        <span className="font-mono text-xs font-medium">{file.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                            {formatFileSize(file.size)} · {formatDateTime(file.modified)}
                        </span>
                    </button>
                ))}
            </div>
        </Card>
    );
};
