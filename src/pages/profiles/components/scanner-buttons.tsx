import { Button } from '@/components/ui/button';

interface ScannerButtonsProps {
    profileId: string;
    scanner: boolean;
    visionActive: boolean;
    scannerStopping?: boolean;
    scannerStarting?: boolean;
    visionStarting?: boolean;
    visionStopping?: boolean;
    visionReady?: boolean;
    onRunScanner: (profileId: string) => void;
    onStopScanner: (profileId: string) => void;
}

export const ScannerButtons = ({
    profileId,
    scanner,
    visionActive,
    scannerStopping = false,
    scannerStarting = false,
    visionStarting = false,
    visionStopping = false,
    visionReady = false,
    onRunScanner,
    onStopScanner,
}: ScannerButtonsProps) => {
    // Show stopping state
    if (scannerStopping) {
        return (
            <Button variant="secondary" size="sm" disabled>
                Stopping...
            </Button>
        );
    }

    // Show starting state
    if (scannerStarting) {
        return (
            <Button variant="secondary" size="sm" disabled>
                Starting...
            </Button>
        );
    }

    // If scanner is not running, show Start button (enabled only when Vision is active, ready and not transitioning)
    if (!scanner) {
        const disabled = !visionActive || visionStarting || visionStopping || !visionReady;
        return (
            <Button
                variant="default"
                size="sm"
                disabled={disabled}
                onClick={() => onRunScanner(profileId)}
            >
                Start Scanner
            </Button>
        );
    }

    // Scanner is running
    return (
        <Button variant="destructive" size="sm" onClick={() => onStopScanner(profileId)}>
            Stop Scanner
        </Button>
    );
};
