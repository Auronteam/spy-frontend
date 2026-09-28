export type VisionState = {
    active: boolean;
    ready: boolean;
    starting: boolean;
    stopping: boolean;
    paused: boolean;
    pauseMsLeft: number;
};

export type ScannerState = {
    running: boolean;
    starting: boolean;
    stopping: boolean;
};
