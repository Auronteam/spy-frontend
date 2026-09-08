import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { VisionButtons } from './vision-buttons';
import { ScannerButtons } from './scanner-buttons';

interface Profile {
    id: string;
    name?: string;
}

interface ProfileTableRowProps {
    profile: Profile;
    active: boolean;
    scanner: boolean;
    paused?: boolean;
    pauseMsLeft?: number;
    stopping: boolean;
    starting: boolean;
    scannerStopping: boolean;
    scannerStarting?: boolean;
    visionReady?: boolean;
    handleRunVision: (profileId: string) => void;
    handleStopVision: (profileId: string) => void;
    handleRunScanner: (profileId: string) => void;
    handleStopScanner: (profileId: string) => void;
}

export const ProfileTableRow = ({
    profile,
    active,
    scanner,
    paused = false,
    pauseMsLeft = 0,
    stopping,
    starting,
    scannerStopping,
    scannerStarting = false,
    visionReady = false,
    handleRunVision,
    handleStopVision,
    handleRunScanner,
    handleStopScanner,
}: ProfileTableRowProps) => {
    return (
        <TableRow key={profile.id}>
            <TableCell className="font-medium">{profile.name ?? profile.id}</TableCell>
            <TableCell>
                {paused ? (
                    <Badge variant="warning">On Pause</Badge>
                ) : active ? (
                    <Badge variant="success">Active</Badge>
                ) : (
                    <Badge variant="secondary">Idle</Badge>
                )}
            </TableCell>
            <TableCell className="text-center">
                {scanner ? (
                    <Badge variant="success">Running</Badge>
                ) : (
                    <Badge variant="secondary">Idle</Badge>
                )}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <VisionButtons
                        profileId={profile.id}
                        active={active}
                        starting={starting}
                        stopping={stopping}
                        paused={paused}
                        pauseMsLeft={pauseMsLeft}
                        onRunVision={handleRunVision}
                        onStopVision={handleStopVision}
                    />
                    <ScannerButtons
                        profileId={profile.id}
                        scanner={scanner}
                        visionActive={active}
                        scannerStopping={scannerStopping}
                        scannerStarting={scannerStarting}
                        visionStarting={starting}
                        visionStopping={stopping}
                        visionReady={visionReady}
                        onRunScanner={handleRunScanner}
                        onStopScanner={handleStopScanner}
                    />
                </div>
            </TableCell>
        </TableRow>
    );
};
