export type LogLine = {
    readonly id: number;
    readonly raw: string;
    readonly time: string;
    readonly message: string;
};

export type LiveLogBuffer = {
    readonly lines: readonly LogLine[];
    readonly nextId: number;
    readonly lastLineOpen: boolean;
};
