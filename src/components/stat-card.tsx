import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: ReactNode;
    dotColor?: 'green';
}

const DOT_COLOR_CLASSES: Record<NonNullable<StatCardProps['dotColor']>, string> = {
    green: 'bg-green-600',
};

export const StatCard = ({ label, value, dotColor }: StatCardProps) => (
    <Card className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 flex items-center gap-1.5 text-2xl font-bold">
            {dotColor && (
                <span className={cn('h-2 w-2 rounded-full', DOT_COLOR_CLASSES[dotColor])} />
            )}
            {value}
        </p>
    </Card>
);
