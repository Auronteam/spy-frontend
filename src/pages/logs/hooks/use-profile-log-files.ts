import { useEffect, useState } from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { fetchProfileLogFiles } from '@/api/logs';
import { apiFetchText } from '@/lib/api-fetch';
import { notifyError } from '@/lib/errors/notify-error';
import type { LogFile } from '../types';

const CONTENT_LINES = '1000';
const CONTENT_TAIL = true;

// Stable empty-array reference — `?? []` would create a new literal on every
// render while the query hasn't resolved yet.
const EMPTY_FILES: LogFile[] = [];

type UseProfileLogFilesResult = {
    files: LogFile[];
    filesLoading: boolean;
    selectedFile: string;
    setSelectedFile: (fileName: string) => void;
    content: string;
    contentLoading: boolean;
    refetchFiles: () => void;
};

export function useProfileLogFiles(
    profileId: string | null,
    isLiveMode: boolean
): UseProfileLogFilesResult {
    const filesQuery = useQuery({
        queryKey: ['logs', 'files', profileId],
        queryFn: profileId ? () => fetchProfileLogFiles(profileId) : skipToken,
    });
    const files = filesQuery.data?.files ?? EMPTY_FILES;

    const [selectedFile, setSelectedFile] = useState<string>('');

    // Reset file selection on profile change — otherwise the previous profile's
    // filename would stay selected even though it's not in the new list.
    useEffect(() => {
        setSelectedFile('');
    }, [profileId]);

    useEffect(() => {
        if (!selectedFile && files.length > 0) {
            setSelectedFile(files[0].name);
        }
    }, [files, selectedFile]);

    // queryKey includes profileId and selectedFile, so quickly switching files
    // can't show a stale response — each file has its own cache entry instead of
    // shared state a late race could overwrite.
    const contentQuery = useQuery({
        queryKey: ['logs', 'content', profileId, selectedFile],
        queryFn:
            selectedFile && !isLiveMode
                ? ({ signal }: { signal: AbortSignal }) => {
                      const params = new URLSearchParams({
                          lines: CONTENT_LINES,
                          tail: String(CONTENT_TAIL),
                      });
                      return apiFetchText(`/api/logs/${selectedFile}?${params}`, { signal });
                  }
                : skipToken,
    });

    useEffect(() => {
        if (contentQuery.isError) {
            notifyError(contentQuery.error, 'Failed to load log content');
        }
    }, [contentQuery.isError, contentQuery.error]);

    return {
        files,
        filesLoading: filesQuery.isLoading,
        selectedFile,
        setSelectedFile,
        content: contentQuery.data ?? '',
        contentLoading: contentQuery.isLoading,
        refetchFiles: filesQuery.refetch,
    };
}
