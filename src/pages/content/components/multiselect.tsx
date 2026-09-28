import { useId, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDismissiblePopup } from '../hooks/use-dismissible-popup';

export type MultiSelectOption = {
    value: string;
    label: string;
};

interface MultiSelectProps {
    id?: string;
    options: MultiSelectOption[];
    value: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    className?: string;
}

export const MultiSelect = ({
    id,
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
}: MultiSelectProps) => {
    const [query, setQuery] = useState<string>('');
    const {
        open,
        toggle: togglePopup,
        close,
        containerRef,
        triggerRef,
        handleKeyDown,
        handleBlur,
    } = useDismissiblePopup();
    const popupId = useId();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter(o => o.label.toLowerCase().includes(q));
    }, [options, query]);

    const allSelected = value.length > 0 && value.length === options.length;

    const toggle = (opt: string) => {
        if (value.includes(opt)) onChange(value.filter(v => v !== opt));
        else onChange([...value, opt]);
    };

    const selectAll = () => onChange(options.map(o => o.value));
    const clearAll = () => onChange([]);

    return (
        <div
            ref={containerRef}
            className={cn('relative', className)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        >
            <button
                ref={triggerRef}
                id={id}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? popupId : undefined}
                onClick={togglePopup}
                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                <span className="truncate">
                    {value.length === 0
                        ? placeholder
                        : value.length === 1
                          ? (options.find(o => o.value === value[0])?.label ?? value[0])
                          : `${value.length} selected`}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </button>

            {open && (
                <div
                    id={popupId}
                    className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
                >
                    <div className="border-b p-2">
                        <input
                            aria-label="Search options"
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
                            const checked = value.includes(opt.value);
                            return (
                                <label
                                    key={opt.value}
                                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={checked}
                                        onChange={() => toggle(opt.value)}
                                    />
                                    <span className="truncate">{opt.label}</span>
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
                                onClick={close}
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
