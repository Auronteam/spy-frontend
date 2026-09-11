import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useVisionActions } from '../hooks/useVisionActions';
import { useScannerActions } from '../hooks/useScannerActions';
import type { Profile } from '../types';
import { VisionButtons } from './vision-buttons';
import { ScannerButtons } from './scanner-buttons';

interface ProfileTableRowProps {
    profile: Profile;
    folderId: string | null;
    active: boolean;
    visionReady: boolean;
    paused: boolean;
    pauseMsLeft: number;
    scannerRunning: boolean;
}

export const ProfileTableRow = ({
    profile,
    folderId,
    active,
    visionReady,
    paused,
    pauseMsLeft,
    scannerRunning,
}: ProfileTableRowProps) => {
    const vision = useVisionActions(profile.id, folderId, scannerRunning);
    const scanner = useScannerActions(profile.id, folderId);

    const visionState = {
        active,
        ready: visionReady,
        starting: vision.isStarting,
        stopping: vision.isStopping,
        paused,
        pauseMsLeft,
    };

    const scannerState = {
        running: scannerRunning,
        starting: scanner.isStarting,
        stopping: scanner.isStopping,
    };

    return (
        <TableRow key={profile.id}>
            <TableCell className="px-4 font-medium">{profile.name ?? profile.id}</TableCell>
            <TableCell className="px-4">
                {paused ? (
                    <Badge variant="warning">On Pause</Badge>
                ) : active ? (
                    <Badge variant="success">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Connected
                    </Badge>
                ) : (
                    <Badge variant="secondary">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                        Disconnected
                    </Badge>
                )}
            </TableCell>
            <TableCell className="px-4">
                {scannerRunning ? (
                    <Badge variant="info">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Running
                    </Badge>
                ) : (
                    <Badge variant="secondary">Stopped</Badge>
                )}
            </TableCell>
            <TableCell className="px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <VisionButtons
                        vision={visionState}
                        onRunVision={vision.runVision}
                        onStopVision={vision.stopVision}
                    />
                    <ScannerButtons
                        vision={visionState}
                        scanner={scannerState}
                        onRunScanner={scanner.runScanner}
                        onStopScanner={scanner.stopScanner}
                    />
                </div>
            </TableCell>
        </TableRow>
    );
};
