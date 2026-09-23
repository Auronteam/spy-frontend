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
import { CookiesDropzone } from '@/pages/profiles/components/cookies-dropzone';
import { parseCookiesJson } from '@/pages/profiles/utils/parse-cookies';
import type { CreateProfileInput } from '@/pages/profiles/types';

interface AddProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onSubmit: (input: CreateProfileInput) => void;
}

export const AddProfileDialog = ({
    open,
    onOpenChange,
    isPending,
    onSubmit,
}: AddProfileDialogProps) => {
    const [profileName, setProfileName] = useState('');
    const [proxyString, setProxyString] = useState('');
    const [cookiesText, setCookiesText] = useState('');

    useEffect(() => {
        if (!open) {
            setProfileName('');
            setProxyString('');
            setCookiesText('');
        }
    }, [open]);

    const handleSubmit = () => {
        const trimmedName = profileName.trim();
        if (!trimmedName) {
            toast.error('Profile name cannot be empty');
            return;
        }

        let cookies: CreateProfileInput['cookies'];
        try {
            cookies = parseCookiesJson(cookiesText);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Invalid cookies JSON');
            return;
        }

        onSubmit({
            profileName: trimmedName,
            proxyString: proxyString.trim() || undefined,
            cookies: cookies && cookies.length > 0 ? cookies : undefined,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add profile</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="add-profile-name">Profile name</Label>
                        <Input
                            id="add-profile-name"
                            value={profileName}
                            onChange={e => setProfileName(e.target.value)}
                            placeholder="Profile name"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="add-profile-proxy">Proxy (optional)</Label>
                        <Input
                            id="add-profile-proxy"
                            value={proxyString}
                            onChange={e => setProxyString(e.target.value)}
                            placeholder="ip:port:username:password"
                        />
                    </div>

                    <CookiesDropzone value={cookiesText} onChange={setCookiesText} />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
