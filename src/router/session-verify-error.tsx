import { PageError } from '@/components/errors/page-error';

interface SessionVerifyErrorProps {
    description: string;
    onRetry: () => void;
}

export const SessionVerifyError = ({ description, onRetry }: SessionVerifyErrorProps) => (
    <div className="flex min-h-screen">
        <PageError
            title="Could not verify your session"
            description={description}
            onRetry={onRetry}
        />
    </div>
);
