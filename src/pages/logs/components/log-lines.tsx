import { memo } from 'react';
import type { LogLine } from '../types';

interface LogLineRowProps {
    line: LogLine;
}

const LogLineRow = memo(({ line }: LogLineRowProps) => {
    return (
        <div className="grid grid-cols-log-line items-start gap-3 border-b px-3.5 py-2 text-xs last:border-0">
            <span className="font-mono text-muted-foreground">{line.time}</span>
            <span className="whitespace-pre-wrap break-words font-mono text-foreground/90">
                {line.message}
            </span>
        </div>
    );
});
LogLineRow.displayName = 'LogLineRow';

interface LogLinesProps {
    lines: readonly LogLine[];
    placeholder: string;
}

export const LogLines = ({ lines, placeholder }: LogLinesProps) => {
    if (lines.length === 0) {
        return (
            <div className="px-3.5 py-8 text-center text-sm text-muted-foreground">
                {placeholder}
            </div>
        );
    }

    return (
        <>
            {lines.map(line => (
                <LogLineRow key={line.id} line={line} />
            ))}
        </>
    );
};
