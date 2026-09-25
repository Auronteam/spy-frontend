export type Profile = {
    id: string;
    // Optional — profile-selector.tsx already falls back to `id` when this is
    // missing, and nothing in the codebase relies on it being present.
    name?: string;
    running: boolean;
    is_received: boolean;
    port: undefined | number;
    profile_name: string;
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
