import { useState } from 'react';
import { useCreateProfile } from './use-create-profile';
import { useUpdateProfile } from './use-update-profile';
import { useDeleteProfile } from './use-delete-profile';
import { isApiError } from '@/lib/errors/api-error';
import type { CreateProfileInput, UpdateProfileInput } from '@/api/vision-browser/types';
import type { Profile } from '@/types/profile';

type AddDialogState = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onSubmit: (input: CreateProfileInput) => Promise<void>;
};

type EditDialogState = {
    profile: Profile | null;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onSubmit: (input: UpdateProfileInput) => void;
};

type DeleteDialogState = {
    profile: Profile | null;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onConfirm: () => void;
};

type UseProfileDialogsResult = {
    addDialog: AddDialogState;
    editDialog: EditDialogState;
    deleteDialog: DeleteDialogState;
    openAddDialog: () => void;
    openEditDialog: (profile: Profile) => void;
    openDeleteDialog: (profile: Profile) => void;
};

export function useProfileDialogs(folderId: string | null): UseProfileDialogsResult {
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
            // toast already shown by the default mutation onError — keep dialog open to retry
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
