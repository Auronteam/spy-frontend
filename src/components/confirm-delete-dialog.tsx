import { useState, type ReactNode } from 'react';
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

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    isPending: boolean;
    onConfirm: () => void;
}

export const ConfirmDeleteDialog = ({
    open,
    onOpenChange,
    title,
    description,
    isPending,
    onConfirm,
}: ConfirmDeleteDialogProps) => {
    const [shown, setShown] = useState({ title, description });

    if (open && (shown.title !== title || shown.description !== description)) {
        setShown({ title, description });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{shown.title}</DialogTitle>
                    {shown.description ? (
                        <DialogDescription>{shown.description}</DialogDescription>
                    ) : (
                        <DialogDescription className="sr-only">
                            Confirm or cancel the deletion.
                        </DialogDescription>
                    )}
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
