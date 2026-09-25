import { useState } from 'react';
import { useCreateProfile } from './use-create-profile';
import { useUpdateProfile } from './use-update-profile';
import { useDeleteProfile } from './use-delete-profile';
import { isApiError } from '@/lib/errors/api-error';
import type { CreateProfileInput, Profile, UpdateProfileInput } from '../types';

export function useProfileDialogs(folderId: string | null) {
    const { createProfile, isCreating } = useCreateProfile(folderId);
    const { updateProfile, isUpdating } = useUpdateProfile(folderId);
    const { deleteProfile, isDeleting } = useDeleteProfile(folderId);

    const [addProfileOpen, setAddProfileOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null);

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

    const handleDeleteOpenChange = (open: boolean) => {
        if (!open) setDeletingProfile(null);
    };

    const handleDeleteProfile = () => {
        if (!deletingProfile) return;
        const profileId = deletingProfile.id;
        const closeDialogs = () => {
            setDeletingProfile(null);
            setEditingProfile(prev => (prev?.id === profileId ? null : prev));
        };
        deleteProfile(profileId, {
            onSuccess: closeDialogs,
            onError: e => {
                if (isApiError(e) && (e.status === 404 || e.status === 409)) closeDialogs();
            },
        });
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
        deleteDialog: {
            profile: deletingProfile,
            onOpenChange: handleDeleteOpenChange,
            isPending: isDeleting,
            onConfirm: handleDeleteProfile,
        },
        openAddDialog: () => setAddProfileOpen(true),
        openEditDialog: setEditingProfile,
        openDeleteDialog: setDeletingProfile,
    };
}
