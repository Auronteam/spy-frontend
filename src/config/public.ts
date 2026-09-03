// src/config/public.ts
// Public (browser-safe) configuration

function validateEnvVar(name: string, value: string | undefined): string {
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

export const BACKEND_BASE = validateEnvVar('VITE_API_URL', import.meta.env.VITE_API_URL);
