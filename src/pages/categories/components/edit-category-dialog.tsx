import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/api/db/categories';

interface EditCategoryDialogProps {
    category: Category | null;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onSubmit: (title: string) => void;
}

export const EditCategoryDialog = ({
    category,
    onOpenChange,
    isPending,
    onSubmit,
}: EditCategoryDialogProps) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        setTitle(category?.title ?? '');
    }, [category]);

    const handleSubmit = () => {
        const trimmed = title.trim();
        if (!trimmed) {
            toast.error('Name cannot be empty');
            return;
        }
        onSubmit(trimmed);
    };

    return (
        <Dialog open={category !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit category</DialogTitle>
                </DialogHeader>

                <div className="grid gap-2">
                    <Label htmlFor="edit-category-title">Name</Label>
                    <Input
                        id="edit-category-title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Category name"
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
