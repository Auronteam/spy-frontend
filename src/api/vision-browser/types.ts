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
