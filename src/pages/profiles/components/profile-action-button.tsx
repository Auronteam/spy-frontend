import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ProfileActionButtonProps {
    icon: ReactNode;
    label: string;
    lockedHint: string;
    locked: boolean;
    onClick: () => void;
}

export const ProfileActionButton = ({
    icon,
    label,
    lockedHint,
    locked,
    onClick,
}: ProfileActionButtonProps) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                variant="ghost"
                size="sm"
                aria-disabled={locked}
                onClick={locked ? undefined : onClick}
                aria-label={label}
                className={cn(
                    locked &&
                        'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-inherit'
                )}
            >
                {icon}
            </Button>
        </TooltipTrigger>
        <TooltipContent>{locked ? lockedHint : label}</TooltipContent>
    </Tooltip>
);
