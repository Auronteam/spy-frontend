export type Profile = {
    id: string;
    name: string;
    running: boolean;
    proxy: ProfileProxy | null;
};

export type ProfileProxy = {
    ip: string;
    port: number;
};

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

export type VisionCookie = {
    name: string;
    value: string;
    path: string;
    domain: string;
    expires: number;
};

export type CreateProfileInput = {
    profileName: string;
    proxyString?: string;
    cookies?: VisionCookie[];
};

export type UpdateProfileInput = {
    profileName?: string;
    proxyString?: string | null;
};
