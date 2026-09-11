import { Button } from '@/components/ui/button';
import type { ScannerState, VisionState } from '../types';

interface ScannerButtonsProps {
    vision: VisionState;
    scanner: ScannerState;
    onRunScanner: () => void;
    onStopScanner: () => void;
}

export const ScannerButtons = ({
    vision,
    scanner,
    onRunScanner,
    onStopScanner,
}: ScannerButtonsProps) => {
    if (scanner.stopping) {
        return (
            <Button variant="secondary" size="sm" disabled>
                Stopping...
            </Button>
        );
    }

    if (scanner.starting) {
        return (
            <Button variant="secondary" size="sm" disabled>
                Starting...
            </Button>
        );
    }

    // If scanner is not running, show Start button (enabled only when Vision is active, ready and not transitioning)
    if (!scanner.running) {
        const disabled = !vision.active || vision.starting || vision.stopping || !vision.ready;
        return (
            <Button
                size="sm"
                disabled={disabled}
                onClick={onRunScanner}
                className="bg-green-600 text-white hover:bg-green-700"
            >
                Start scanner
            </Button>
        );
    }

    // Scanner is running
    return (
        <Button variant="destructive" size="sm" onClick={onStopScanner}>
            Stop scanner
        </Button>
    );
};
