import { useState } from 'react';
import { BACKEND_BASE } from '@/config';
import { useVisionFolders } from '@/pages/profiles/hooks/useVisionFolders';
import { useVisionProfiles } from '@/pages/profiles/hooks/useVisionProfiles';
import { useLogStream } from './hooks/use-log-stream';
import { useProfileLogFiles } from './hooks/use-profile-log-files';
import { useLogAutoScroll } from './hooks/use-log-auto-scroll';
import { useSelectedProfileScanner } from './hooks/use-selected-profile-scanner';
import { ProfileSelector } from './components/profile-selector';
import { LogFilesList } from './components/log-files-list';
import { LogContentViewer } from './components/log-content-viewer';

export const LogsPage = () => {
    const { folders, folderId, setFolderId } = useVisionFolders();
    const { profiles, loading: profilesLoading } = useVisionProfiles(folderId);

    const [selectedProfileId, setSelectedProfileId] = useState('');

    const streamUrl = selectedProfileId
        ? `${BACKEND_BASE}/api/logs/stream?profileId=${encodeURIComponent(selectedProfileId)}`
        : '';
    const { isLiveMode, isConnected, liveLogContent, toggleLiveMode } = useLogStream(streamUrl);
    const { isRunning: isScannerRunning } = useSelectedProfileScanner(selectedProfileId);

    const handleProfileChange = (value: string) => {
        // Stream is tied to the URL at the moment toggleLiveMode was called —
        // switching profiles mid-stream would otherwise leave it running
        // against a profile that's no longer selected.
        if (isLiveMode) {
            toggleLiveMode();
        }
        setSelectedProfileId(value);
    };

    const {
        files: logFiles,
        filesLoading,
        selectedFile,
        setSelectedFile,
        content: logContent,
        contentLoading,
        refetchFiles,
    } = useProfileLogFiles(selectedProfileId || null, isLiveMode);

    const { liveLogRef, staticLogRef, handleScroll } = useLogAutoScroll({
        isLiveMode,
        liveLogContent,
        logContent,
    });

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Logs</h1>
                <p className="mt-1 text-sm text-muted-foreground">Log files are kept for 3 days.</p>
            </div>

            <ProfileSelector
                folders={folders}
                folderId={folderId}
                onFolderChange={setFolderId}
                profiles={profiles}
                profilesLoading={profilesLoading}
                selectedProfileId={selectedProfileId}
                onProfileChange={handleProfileChange}
            />

            {!selectedProfileId ? (
                <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">
                    Select a profile above to view its logs.
                </div>
            ) : !filesLoading && logFiles.length === 0 ? (
                <div className="rounded-lg border bg-card px-6 py-14 text-center">
                    <p className="text-sm font-medium">No logs for {selectedProfileId}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        This profile has not been started in the last 3 days. Logs are stored for 3
                        days only.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[264px_minmax(0,1fr)]">
                    <LogFilesList
                        files={logFiles}
                        filesLoading={filesLoading}
                        selectedFile={selectedFile}
                        onSelectFile={setSelectedFile}
                        onRefetch={() => refetchFiles()}
                    />
                    <LogContentViewer
                        selectedFile={selectedFile}
                        isLiveMode={isLiveMode}
                        isConnected={isConnected}
                        isScannerRunning={isScannerRunning}
                        liveLogContent={liveLogContent}
                        logContent={logContent}
                        contentLoading={contentLoading}
                        liveLogRef={liveLogRef}
                        staticLogRef={staticLogRef}
                        onScroll={handleScroll}
                        onToggleLiveMode={toggleLiveMode}
                    />
                </div>
            )}
        </div>
    );
};
