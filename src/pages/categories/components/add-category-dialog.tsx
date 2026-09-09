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
import { slugify } from '@/pages/categories/utils';

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onSubmit: (values: { title: string; slug: string; protected: boolean }) => void;
}

export const AddCategoryDialog = ({
    open,
    onOpenChange,
    isPending,
    onSubmit,
}: AddCategoryDialogProps) => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [isProtected, setIsProtected] = useState(false);

    useEffect(() => {
        if (!open) {
            setTitle('');
            setSlug('');
            setSlugTouched(false);
            setIsProtected(false);
        }
    }, [open]);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!slugTouched) setSlug(slugify(value));
    };

    const handleSubmit = () => {
        const trimmedTitle = title.trim();
        const trimmedSlug = slug.trim() || slugify(trimmedTitle);

        if (!trimmedTitle) {
            toast.error('Name cannot be empty');
            return;
        }
        if (!trimmedSlug) {
            toast.error('Slug cannot be empty');
            return;
        }

        onSubmit({ title: trimmedTitle, slug: trimmedSlug, protected: isProtected });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add category</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="add-category-title">Name</Label>
                        <Input
                            id="add-category-title"
                            value={title}
                            onChange={e => handleTitleChange(e.target.value)}
                            placeholder="Category name"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-category-slug">Slug</Label>
                        <Input
                            id="add-category-slug"
                            value={slug}
                            onChange={e => {
                                setSlugTouched(true);
                                setSlug(slugify(e.target.value));
                            }}
                            placeholder="unique-category-slug"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={isProtected}
                            onChange={e => setIsProtected(e.target.checked)}
                        />
                        Protected (cannot be deleted)
                    </label>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? 'Adding...' : 'Add'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
