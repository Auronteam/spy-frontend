import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/stat-card';
import { useVisionFolders } from '@/hooks/useVisionFolders';
import { useVisionProfiles } from '@/hooks/useVisionProfiles';
import { useActiveProfiles } from './hooks/useActiveProfiles';
import { useScannerStatus } from './hooks/useScannerStatus';
import { useVisionReady } from './hooks/useVisionReady';
import { useProfileDialogs } from './hooks/use-profile-dialogs';
import { ProfilesTableCard } from './components/profiles-table-card';
import { AddProfileDialog } from './components/add-profile-dialog';
import { EditProfileDialog } from './components/edit-profile-dialog';
import { DeleteProfileDialog } from './components/delete-profile-dialog';

export const ProfilesPage = () => {
    const {
        folders,
        folderId,
        setFolderId,
        loading: foldersLoading,
        error: foldersError,
    } = useVisionFolders();
    const {
        profiles,
        loading: profilesLoading,
        error: profilesError,
        refetch: refetchProfiles,
    } = useVisionProfiles(folderId);
    const {
        activeProfileIds,
        error: activeError,
        refreshActiveProfiles,
        isVisionActive,
    } = useActiveProfiles(folderId);
    const { isScannerRunning, isScannerPaused, pauseMsLeft, refreshScannerStatuses } =
        useScannerStatus(profiles);
    const { isVisionReady } = useVisionReady(profiles, isVisionActive);
    const { addDialog, editDialog, deleteDialog, openAddDialog, openEditDialog, openDeleteDialog } =
        useProfileDialogs(folderId);

    const scannersRunningCount = profiles.filter(p => isScannerRunning(p.id)).length;

    const isLoading = foldersLoading || profilesLoading;
    const error = foldersError || profilesError;

    const handleRefresh = () => {
        refetchProfiles();
        refreshActiveProfiles();
        refreshScannerStatuses();
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Profiles</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage browser profiles, connections and scanners.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <Button disabled={!folderId} onClick={openAddDialog}>
                        Add profile
                    </Button>
                </div>
            </div>

            {folders.length > 1 && (
                <Select
                    aria-label="Folder"
                    value={folderId ?? ''}
                    onValueChange={setFolderId}
                    className="max-w-xs"
                >
                    {folders.map(folder => (
                        <SelectItem key={folder.id} value={folder.id}>
                            {folder.name ?? folder.id}
                        </SelectItem>
                    ))}
                </Select>
            )}

            {activeError && (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    Could not refresh active profiles — retrying...
                </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard label="Total profiles" value={profiles.length} />
                <StatCard label="Connected now" value={activeProfileIds.length} dotColor="green" />
                <StatCard label="Scanners running" value={scannersRunningCount} />
            </div>

            <ProfilesTableCard
                profiles={profiles}
                folderId={folderId}
                isLoading={isLoading}
                error={error}
                onRetry={handleRefresh}
                isVisionActive={isVisionActive}
                isVisionReady={isVisionReady}
                isScannerPaused={isScannerPaused}
                pauseMsLeft={pauseMsLeft}
                isScannerRunning={isScannerRunning}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />

            <AddProfileDialog {...addDialog} />
            <EditProfileDialog {...editDialog} />
            <DeleteProfileDialog {...deleteDialog} />
        </div>
    );
};
