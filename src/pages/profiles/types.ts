export type Profile = {
    id: string;
    name: string;
    running: boolean;
    is_received: boolean;
    port: undefined | number;
    profile_name: string;
};

export type ActiveVisionProfile = {
    folder_id: string;
    profile_id: string;
    pid: number;
    port: number;
};
