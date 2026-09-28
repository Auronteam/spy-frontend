import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { useUpdateVisionToken } from './hooks/use-update-vision-token';
import visionXTokenImg from './assets/vision-x-token.png';

export const SettingsPage = () => {
    const [token, setToken] = useState('');

    const { saveToken, isPending, isSuccess, validUntil } = useUpdateVisionToken();

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
                    <h2 className="text-base font-semibold tracking-tight">
                        Vision Browser X-Token
                    </h2>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
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
                    width={1292}
                    height={932}
                    loading="lazy"
                    className="w-full rounded-md border"
                />

                <div className="flex flex-wrap items-end gap-2.5">
                    <div className="flex min-w-64 flex-1 flex-col gap-1.5">
                        <Label htmlFor="xtoken">X-Token</Label>
                        <Input
                            id="xtoken"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9…"
                            className="font-mono text-xs"
                            disabled={isPending}
                        />
                    </div>
                    <Button onClick={() => saveToken(token)} disabled={!token.trim() || isPending}>
                        {isPending ? 'Saving...' : 'Save token'}
                    </Button>
                </div>

                {isSuccess && (
                    <div
                        role="status"
                        className="rounded-md border border-success-border bg-success-muted px-3 py-2 text-xs text-success-strong"
                    >
                        Token saved.
                        {validUntil && ` Valid until ${formatDate(new Date(validUntil))}.`}
                    </div>
                )}
            </Card>
        </div>
    );
};
