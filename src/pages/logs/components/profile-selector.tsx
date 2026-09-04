import { Select, SelectItem } from '@/components/ui/select';
import type { VisionFolder } from '@/pages/profiles/hooks/useVisionFolders';
import type { Profile } from '@/pages/profiles/types';

interface ProfileSelectorProps {
    folders: VisionFolder[];
    folderId: string | null;
    onFolderChange: (folderId: string) => void;
    profiles: Profile[];
    profilesLoading: boolean;
    selectedProfileId: string;
    onProfileChange: (profileId: string) => void;
}

export const ProfileSelector = ({
    folders,
    folderId,
    onFolderChange,
    profiles,
    profilesLoading,
    selectedProfileId,
    onProfileChange,
}: ProfileSelectorProps) => {
    return (
        <div className="mb-6 flex flex-wrap items-center gap-3">
            {folders.length > 1 && (
                <Select value={folderId ?? ''} onValueChange={onFolderChange} className="max-w-xs">
                    {folders.map(folder => (
                        <SelectItem key={folder.id} value={folder.id}>
                            {folder.name ?? folder.id}
                        </SelectItem>
                    ))}
                </Select>
            )}

            <Select
                value={selectedProfileId}
                onValueChange={onProfileChange}
                className="max-w-xs"
                disabled={profilesLoading || profiles.length === 0}
            >
                <SelectItem value="">
                    {profilesLoading ? 'Loading profiles...' : 'Select a profile'}
                </SelectItem>
                {profiles.map(profile => (
                    <SelectItem key={profile.id} value={profile.id}>
                        {profile.name ?? profile.id}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
};
