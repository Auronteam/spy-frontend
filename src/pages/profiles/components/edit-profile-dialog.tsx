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
import { buildProfileUpdate, formatProxy } from '@/pages/profiles/utils/build-profile-update';
import type { Profile, UpdateProfileInput } from '@/pages/profiles/types';

interface EditProfileDialogProps {
    profile: Profile | null;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    onSubmit: (input: UpdateProfileInput) => void;
}

export const EditProfileDialog = ({
    profile,
    onOpenChange,
    isPending,
    onSubmit,
}: EditProfileDialogProps) => {
    const [current, setCurrent] = useState<Profile | null>(null);
    const [profileName, setProfileName] = useState('');
    const [proxyString, setProxyString] = useState('');

    useEffect(() => {
        if (profile) {
            setCurrent(profile);
            setProfileName(profile.name);
            setProxyString(formatProxy(profile.proxy));
        }
    }, [profile]);

    const currentProxy = formatProxy(current?.proxy ?? null);
    const proxyRemoved = currentProxy !== '' && proxyString.trim() === '';
    const update = buildProfileUpdate(current?.name ?? '', profileName, currentProxy, proxyString);

    const handleSubmit = () => {
        if (!update) return;
        if (update.profileName === '') {
            toast.error('Profile name cannot be empty');
            return;
        }
        onSubmit(update);
    };

    return (
        <Dialog open={profile !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-profile-name">Profile name</Label>
                        <Input
                            id="edit-profile-name"
                            value={profileName}
                            onChange={e => setProfileName(e.target.value)}
                            placeholder="Profile name"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-profile-proxy">Proxy</Label>
                        <div className="flex gap-2">
                            <Input
                                id="edit-profile-proxy"
                                value={proxyString}
                                onChange={e => setProxyString(e.target.value)}
                                placeholder={
                                    proxyRemoved
                                        ? 'Proxy will be removed'
                                        : 'ip:port:username:password'
                                }
                            />
                            {currentProxy && (
                                <Button
                                    variant="outline"
                                    onClick={() => setProxyString(proxyRemoved ? currentProxy : '')}
                                >
                                    {proxyRemoved ? 'Restore proxy' : 'Remove proxy'}
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {proxyRemoved
                                ? 'The current proxy will be detached from this profile.'
                                : currentProxy
                                  ? 'Username and password are not shown. To change the proxy, enter the full ip:port:username:password.'
                                  : 'No proxy. Leave empty to keep it that way.'}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending || !update}>
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
