import { Button } from '@/components/ui/button';
import { usePauseCountdown } from '@/pages/profiles/hooks/usePauseCountdown';
import type { VisionState } from '../types';

interface VisionButtonsProps {
    vision: VisionState;
    onRunVision: () => void;
    onStopVision: () => void;
}

export const VisionButtons = ({ vision, onRunVision, onStopVision }: VisionButtonsProps) => {
    const { active, starting, stopping, paused, pauseMsLeft } = vision;
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
            <Button variant="default" size="sm" onClick={onRunVision}>
                Connect
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
        <Button variant="outline" size="sm" onClick={onStopVision}>
            Disconnect
        </Button>
    );
};
