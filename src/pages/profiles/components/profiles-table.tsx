import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Profile } from '@/types/profile';
import { ProfileTableRow } from './profile-table-row';

interface ProfilesTableProps {
    profiles: Profile[];
    folderId: string | null;
    isVisionActive: (profileId: string) => boolean;
    isVisionReady: (profileId: string) => boolean;
    isScannerPaused: (profileId: string) => boolean;
    pauseMsLeft: (profileId: string) => number;
    isScannerRunning: (profileId: string) => boolean;
    onEdit: (profile: Profile) => void;
    onDelete: (profile: Profile) => void;
}

export const ProfilesTable = ({
    profiles,
    folderId,
    isVisionActive,
    isVisionReady,
    isScannerPaused,
    pauseMsLeft,
    isScannerRunning,
    onEdit,
    onDelete,
}: ProfilesTableProps) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="px-4">Profile name</TableHead>
                <TableHead className="px-4">Proxy</TableHead>
                <TableHead className="px-4">Connection</TableHead>
                <TableHead className="px-4">Scanner</TableHead>
                <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {profiles.map(profile => (
                <ProfileTableRow
                    key={profile.id}
                    profile={profile}
                    folderId={folderId}
                    active={isVisionActive(profile.id)}
                    visionReady={isVisionReady(profile.id)}
                    paused={isScannerPaused(profile.id)}
                    pauseMsLeft={pauseMsLeft(profile.id)}
                    scannerRunning={isScannerRunning(profile.id)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </TableBody>
    </Table>
);
