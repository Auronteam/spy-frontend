import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MultiSelectProps {
    options: string[];
    value: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    className?: string;
}

export const MultiSelect = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
}: MultiSelectProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const containerRef = useRef<HTMLDivElement | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter(o => o.toLowerCase().includes(q));
    }, [options, query]);

    // close on outside click
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!containerRef.current) return;
            if (e.target instanceof Node && containerRef.current.contains(e.target)) return;
            setOpen(false);
        }

        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const allSelected = value.length > 0 && value.length === options.length;

    const toggle = (opt: string) => {
        if (value.includes(opt)) onChange(value.filter(v => v !== opt));
        else onChange([...value, opt]);
    };

    const selectAll = () => onChange(options);
    const clearAll = () => onChange([]);

    return (
        <div ref={containerRef} className={`relative ${className ?? ''}`}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm hover:bg-accent hover:text-accent-foreground"
            >
                <span className="truncate">
                    {value.length === 0
                        ? placeholder
                        : value.length === 1
                          ? value[0]
                          : `${value.length} selected`}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="border-b p-2">
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search..."
                            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="max-h-56 overflow-auto p-1">
                        {filtered.length === 0 && (
                            <div className="px-2 py-3 text-sm text-muted-foreground">
                                No results
                            </div>
                        )}
                        {filtered.map(opt => {
                            const checked = value.includes(opt);
                            return (
                                <label
                                    key={opt}
                                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={checked}
                                        onChange={() => toggle(opt)}
                                    />
                                    <span className="truncate">{opt}</span>
                                </label>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t bg-muted/50 p-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 text-xs"
                            onClick={allSelected ? clearAll : selectAll}
                        >
                            {allSelected ? 'Clear all' : 'Select all'}
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                onClick={clearAll}
                            >
                                Clear
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                onClick={() => setOpen(false)}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
