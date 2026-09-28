import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import type { Profile } from '@/types/profile';

interface DeleteProfileDialogProps {
    profile: Profile | null;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onConfirm: () => void;
}

export const DeleteProfileDialog = ({
    profile,
    onOpenChange,
    isPending,
    onConfirm,
}: DeleteProfileDialogProps) => (
    <ConfirmDeleteDialog
        open={profile !== null}
        onOpenChange={onOpenChange}
        title={`Delete profile "${profile?.name ?? ''}"?`}
        isPending={isPending}
        onConfirm={onConfirm}
    />
);
