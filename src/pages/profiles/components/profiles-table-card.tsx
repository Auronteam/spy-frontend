import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { QueryPageGuard } from '@/components/errors/query-page-guard';
import type { Profile } from '@/types/profile';
import { useProfilesTable } from '../hooks/use-profiles-table';
import { ProfilesTable } from './profiles-table';
import { ProfilesPagination } from './profiles-pagination';

interface ProfilesTableCardProps {
    profiles: Profile[];
    folderId: string | null;
    isLoading: boolean;
    error: Error | null;
    onRetry: () => void;
    isVisionActive: (profileId: string) => boolean;
    isVisionReady: (profileId: string) => boolean;
    isScannerPaused: (profileId: string) => boolean;
    pauseMsLeft: (profileId: string) => number;
    isScannerRunning: (profileId: string) => boolean;
    onEdit: (profile: Profile) => void;
    onDelete: (profile: Profile) => void;
}

export const ProfilesTableCard = ({
    profiles,
    isLoading,
    error,
    onRetry,
    ...rowProps
}: ProfilesTableCardProps) => {
    const { search, setSearch, pagedProfiles, currentPage, totalPages, summary, goPrev, goNext } =
        useProfilesTable(profiles);

    return (
        <Card className="overflow-hidden p-0">
            <div className="flex gap-2 border-b p-3">
                <Input
                    placeholder="Search profiles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
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
                onRetry={onRetry}
                title="Failed to load profiles"
            >
                <ProfilesTable profiles={pagedProfiles} {...rowProps} />
                <ProfilesPagination
                    summary={summary}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrev={goPrev}
                    onNext={goNext}
                />
            </QueryPageGuard>
        </Card>
    );
};
