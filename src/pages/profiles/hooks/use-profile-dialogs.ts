import { useState } from 'react';
import { useCreateProfile } from './use-create-profile';
import { useUpdateProfile } from './use-update-profile';
import type { CreateProfileInput, Profile, UpdateProfileInput } from '../types';

export function useProfileDialogs(folderId: string | null) {
    const { createProfile, isCreating } = useCreateProfile(folderId);
    const { updateProfile, isUpdating } = useUpdateProfile(folderId);

    const [addProfileOpen, setAddProfileOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

    const handleCreateProfile = async (input: CreateProfileInput) => {
        try {
            await createProfile(input);
            setAddProfileOpen(false);
        } catch {
            // toast already shown by useCreateProfile's onError — keep dialog open to retry
        }
    };

    const handleUpdateProfile = (input: UpdateProfileInput) => {
        if (!editingProfile) return;
        updateProfile(
            { profileId: editingProfile.id, input },
            { onSuccess: () => setEditingProfile(null) }
        );
    };

    const handleEditOpenChange = (open: boolean) => {
        if (!open) setEditingProfile(null);
    };

    return {
        addDialog: {
            open: addProfileOpen,
            onOpenChange: setAddProfileOpen,
            isPending: isCreating,
            onSubmit: handleCreateProfile,
        },
        editDialog: {
            profile: editingProfile,
            onOpenChange: handleEditOpenChange,
            isPending: isUpdating,
            onSubmit: handleUpdateProfile,
        },
        openAddDialog: () => setAddProfileOpen(true),
        openEditDialog: setEditingProfile,
    };
}
