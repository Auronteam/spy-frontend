import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageErrorProps {
    title: string;
    description?: string;
    onRetry?: () => void;
    buttonLabel?: string;
}

export const PageError = ({
    title,
    description,
    onRetry,
    buttonLabel = 'Retry',
}: PageErrorProps) => {
    return (
        <div className="flex flex-1 items-center justify-center py-16">
            <div className="flex max-w-md flex-col items-center gap-4 text-center">
                <AlertTriangle className="h-10 w-10 text-destructive" />

                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>

                {onRetry && (
                    <Button onClick={onRetry} variant="outline" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        {buttonLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};
