import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
}: DeleteCategoryDialogProps) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (category) {
            setTitle(category.title);
        }
    }, [category]);

    return (
        <Dialog open={category !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete category "{title}"?</DialogTitle>
                    <DialogDescription>
                        This also deletes every post in it. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
                        {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
