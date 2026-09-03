import { Button } from '@/components/ui/button';
import { usePauseCountdown } from '@/pages/profiles/hooks/usePauseCountdown';

interface VisionButtonsProps {
    profileId: string;
    active: boolean;
    starting: boolean;
    stopping: boolean;
    paused?: boolean;
    pauseMsLeft?: number;
    onRunVision: (profileId: string) => void;
    onStopVision: (profileId: string) => void;
}

export const VisionButtons = ({
    profileId,
    active,
    starting,
    stopping,
    paused = false,
    pauseMsLeft = 0,
    onRunVision,
    onStopVision,
}: VisionButtonsProps) => {
    const localMsLeft = usePauseCountdown(pauseMsLeft, paused);

    const formatMs = (ms: number) => {
        const total = Math.max(0, Math.floor(ms / 1000));
        const mm = Math.floor(total / 60)
            .toString()
            .padStart(2, '0');
        const ss = (total % 60).toString().padStart(2, '0');
        return `${mm}:${ss}`;
    };

    // Checked before `active` — pause overrides both the connect and stop states.
    if (paused) {
        return (
            <Button variant="secondary" size="sm" disabled>
                On Pause{` ${formatMs(localMsLeft)}`}
            </Button>
        );
    }

    if (!active) {
        if (starting) {
            return (
                <Button variant="secondary" size="sm" disabled>
                    Connecting...
                </Button>
            );
        }
        return (
            <Button variant="default" size="sm" onClick={() => onRunVision(profileId)}>
                Vision Connect
            </Button>
        );
    }

    if (stopping) {
        return (
            <Button variant="secondary" size="sm" disabled>
                Disconnecting...
            </Button>
        );
    }

    return (
        <Button variant="destructive" size="sm" onClick={() => onStopVision(profileId)}>
            Stop Vision
        </Button>
    );
};
