export type Profile = {
    id: string;
    name: string;
    running: boolean;
    proxy: ProfileProxy | null;
};

export type ProfileProxy = {
    ip: string;
    port: number;
    country: string | null;
};
