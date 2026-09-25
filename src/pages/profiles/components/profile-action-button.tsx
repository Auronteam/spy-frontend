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
            <span className={cn('inline-flex', locked && 'cursor-not-allowed')}>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={locked}
                    onClick={onClick}
                    aria-label={label}
                >
                    {icon}
                </Button>
            </span>
        </TooltipTrigger>
        <TooltipContent>{locked ? lockedHint : label}</TooltipContent>
    </Tooltip>
);
