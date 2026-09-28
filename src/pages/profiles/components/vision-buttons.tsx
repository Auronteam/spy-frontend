import { Button } from '@/components/ui/button';
import { usePauseCountdown } from '@/pages/profiles/hooks/usePauseCountdown';
import type { VisionState } from '../types';
import { formatMs } from '../utils/format-ms';

interface VisionButtonsProps {
    vision: VisionState;
    onRunVision: () => void;
    onStopVision: () => void;
}

export const VisionButtons = ({ vision, onRunVision, onStopVision }: VisionButtonsProps) => {
    const { active, starting, stopping, paused, pauseMsLeft } = vision;
    const localMsLeft = usePauseCountdown(pauseMsLeft, paused);

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
        <Button variant="destructive" size="sm" onClick={onStopVision}>
            Disconnect
        </Button>
    );
};
