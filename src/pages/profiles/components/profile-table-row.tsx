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
                {scanner ? (
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
