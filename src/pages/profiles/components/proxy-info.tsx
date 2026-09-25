import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getCountryName, getFlagEmoji } from '@/lib/country';
import { formatProxy } from '@/pages/profiles/utils/build-profile-update';
import type { ProfileProxy } from '../types';

interface ProxyInfoProps {
    proxy: ProfileProxy | null;
}

interface ProxyCountryProps {
    country: string;
}

const ProxyCountry = ({ country }: ProxyCountryProps) => {
    const flag = getFlagEmoji(country);
    const name = getCountryName(country);
    const label = (
        <span className="inline-flex items-center gap-1.5">
            {flag && <span className="text-base leading-none">{flag}</span>}
            <span className="font-mono">{country.toUpperCase()}</span>
        </span>
    );

    if (!name) return label;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{label}</TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
        </Tooltip>
    );
};

export const ProxyInfo = ({ proxy }: ProxyInfoProps) => {
    if (!proxy) {
        return <span className="text-sm text-muted-foreground">No proxy</span>;
    }

    return (
        <span className="inline-flex items-center gap-1.5 text-sm">
            {proxy.country ? (
                <>
                    <ProxyCountry country={proxy.country} />
                    <span className="text-muted-foreground">·</span>
                </>
            ) : null}
            <span className="font-mono">{formatProxy(proxy)}</span>
            {!proxy.country && <span className="text-muted-foreground">· country unknown</span>}
        </span>
    );
};
