import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVisionFolders } from '@/api/vision-browser';

export type VisionFolder = {
    id: string;
    name?: string;
};

// Stable empty-array reference while loading — `?? []` would create a new
// literal on every render, which could loop the effect below.
const EMPTY_FOLDERS: VisionFolder[] = [];

export const useVisionFolders = () => {
    const [folderId, setFolderId] = useState<string | null>(null);

    const query = useQuery({
        queryKey: ['vision', 'folders'],
        queryFn: fetchVisionFolders,
    });

    const folders = query.data ?? EMPTY_FOLDERS;

    // Auto-select the first folder once after load — after that the user
    // controls the selection via setFolderId.
    useEffect(() => {
        if (folderId === null && folders.length > 0) {
            setFolderId(folders[0].id);
        }
    }, [folders, folderId]);

    return {
        folders,
        folderId,
        setFolderId,
        loading: query.isLoading,
        error: query.error,
    };
};
