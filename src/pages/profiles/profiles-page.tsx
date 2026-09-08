import { useMemo, useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { Spinner } from '@/components/ui/spinner';
import { QueryPageGuard } from '@/components/errors/query-page-guard';
import { useVisionFolders } from './hooks/useVisionFolders';
import { useVisionProfiles } from './hooks/useVisionProfiles';
import { useActiveProfiles } from './hooks/useActiveProfiles';
import { useScannerStatus } from './hooks/useScannerStatus';
import { useVisionReady } from './hooks/useVisionReady';
import { useProfileActions } from './hooks/useProfileActions';
import { ProfileTableRow } from './components/profile-table-row';

const PAGE_SIZE = 8;

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
    const { startPolling, confirmStopped, isScannerRunning, isScannerPaused, pauseMsLeft } =
        useScannerStatus(profiles);
    const { isVisionReady } = useVisionReady(profiles, isVisionActive);
    const {
        handleRunVision,
        handleRunScanner,
        handleStopScanner,
        handleStopVision,
        startingIds,
        stoppingIds,
        scannerStartingIds,
        scannerStoppingIds,
    } = useProfileActions({
        folderId,
        refreshActiveProfiles,
        startPolling,
        confirmStopped,
        isScannerRunning,
    });

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filteredProfiles = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return profiles;
        return profiles.filter(p => (p.name ?? p.id).toLowerCase().includes(q));
    }, [profiles, search]);

    const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pagedProfiles = filteredProfiles.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const scannersRunningCount = profiles.filter(p => isScannerRunning(p.id)).length;

    const isLoading = foldersLoading || profilesLoading;
    const error = foldersError || profilesError || activeError;

    const handleRefresh = () => {
        refetchProfiles();
        refreshActiveProfiles();
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
                    <Button disabled title="Coming soon">
                        Add profile
                    </Button>
                </div>
            </div>

            {folders.length > 1 && (
                <Select value={folderId ?? ''} onValueChange={setFolderId} className="max-w-xs">
                    {folders.map(folder => (
                        <SelectItem key={folder.id} value={folder.id}>
                            {folder.name ?? folder.id}
                        </SelectItem>
                    ))}
                </Select>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard label="Total profiles" value={profiles.length} />
                <StatCard label="Connected now" value={activeProfileIds.length} dotColor="green" />
                <StatCard label="Scanners running" value={scannersRunningCount} />
            </div>

            <Card className="overflow-hidden p-0">
                <div className="flex gap-2 border-b p-3">
                    <Input
                        placeholder="Search profiles..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-[260px]"
                    />
                </div>

                <QueryPageGuard
                    isLoading={isLoading}
                    loadingFallback={
                        <div className="py-8">
                            <Spinner />
                        </div>
                    }
                    isError={Boolean(error)}
                    error={error}
                    onRetry={handleRefresh}
                    title="Failed to load profiles"
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4">Profile name</TableHead>
                                <TableHead className="px-4">Connection</TableHead>
                                <TableHead className="px-4">Scanner</TableHead>
                                <TableHead className="px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pagedProfiles.map(profile => (
                                <ProfileTableRow
                                    key={profile.id}
                                    profile={profile}
                                    active={isVisionActive(profile.id)}
                                    scanner={isScannerRunning(profile.id)}
                                    paused={isScannerPaused(profile.id)}
                                    pauseMsLeft={pauseMsLeft(profile.id)}
                                    stopping={stoppingIds[profile.id] ?? false}
                                    starting={startingIds[profile.id] ?? false}
                                    scannerStopping={scannerStoppingIds[profile.id] ?? false}
                                    scannerStarting={scannerStartingIds[profile.id] ?? false}
                                    visionReady={isVisionReady(profile.id)}
                                    handleRunVision={handleRunVision}
                                    handleStopVision={handleStopVision}
                                    handleRunScanner={handleRunScanner}
                                    handleStopScanner={handleStopScanner}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
                        <span>
                            {filteredProfiles.length} of {profiles.length} profiles
                        </span>
                        <div className="flex gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </QueryPageGuard>
            </Card>
        </div>
    );
};
