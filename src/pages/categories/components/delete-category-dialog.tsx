import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import type { Category } from '@/api/db/categories';

interface DeleteCategoryDialogProps {
    category: Category | null;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onConfirm: () => void;
}

export const DeleteCategoryDialog = ({
    category,
    onOpenChange,
    isPending,
    onConfirm,
}: DeleteCategoryDialogProps) => (
    <ConfirmDeleteDialog
        open={category !== null}
        onOpenChange={onOpenChange}
        title={`Delete category "${category?.title ?? ''}"?`}
        description={
            <>
                The category will no longer be used for search. Existing content keeps it. To bring
                it back, create a category with the same slug.
            </>
        }
        isPending={isPending}
        onConfirm={onConfirm}
    />
);
