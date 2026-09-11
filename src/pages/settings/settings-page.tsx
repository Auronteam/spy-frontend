import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateVisionToken } from '@/api/settings';
import { notifyError } from '@/lib/errors/notify-error';
import visionXTokenImg from './assets/vision-x-token.png';

const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const SettingsPage = () => {
    const [token, setToken] = useState('');

    const mutation = useMutation({
        mutationFn: updateVisionToken,
        onError: e => notifyError(e),
    });

    const handleSave = () => {
        const trimmed = token.trim();
        if (!trimmed) return;
        mutation.mutate(trimmed);
    };

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Scanner defaults and account options.
                </p>
            </div>

            <Card className="flex flex-col gap-4 p-5">
                <div>
                    <h2 className="text-[15px] font-semibold tracking-tight">
                        Vision Browser X-Token
                    </h2>
                    <p className="mt-1.5 max-w-[680px] text-sm leading-relaxed text-muted-foreground">
                        Once a month, and every time you sign in, you need to refresh the X-Token of
                        your Vision Browser. Open Vision Browser settings, find{' '}
                        <strong className="font-semibold text-foreground">X-Token</strong> in the{' '}
                        <strong className="font-semibold text-foreground">Additional</strong> block
                        at the bottom right, and copy it. Paste it into the field below and save.
                    </p>
                </div>

                <img
                    src={visionXTokenImg}
                    alt="Vision Browser settings — X-Token field in the Additional block"
                    className="w-full rounded-md border"
                />

                <div className="flex flex-wrap items-end gap-2.5">
                    <div className="flex min-w-[260px] flex-1 flex-col gap-1.5">
                        <Label htmlFor="xtoken">X-Token</Label>
                        <Input
                            id="xtoken"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9…"
                            className="font-mono text-xs"
                            disabled={mutation.isPending}
                        />
                    </div>
                    <Button onClick={handleSave} disabled={!token.trim() || mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Save token'}
                    </Button>
                </div>

                {mutation.isSuccess && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-[12.5px] text-green-700">
                        Token saved.
                        {mutation.data.validUntil &&
                            ` Valid until ${formatDate(mutation.data.validUntil)}.`}
                    </div>
                )}
            </Card>
        </div>
    );
};
