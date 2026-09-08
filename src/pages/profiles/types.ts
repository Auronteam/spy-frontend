export type Profile = {
    id: string;
    // Optional — profile-selector.tsx already falls back to `id` when this is
    // missing, and nothing in the codebase relies on it being present.
    name?: string;
    running: boolean;
    is_received: boolean;
    port: undefined | number;
    profile_name: string;
};
