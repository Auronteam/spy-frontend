import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Profile } from '@/pages/profiles/types';

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
}: DeleteProfileDialogProps) => {
    const [profileName, setProfileName] = useState('');

    useEffect(() => {
        if (profile) {
            setProfileName(profile.name);
        }
    }, [profile]);

    return (
        <Dialog open={profile !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete profile "{profileName}"?</DialogTitle>
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
