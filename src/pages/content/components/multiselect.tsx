import { useEffect, useMemo, useRef, useState } from 'react';

type MultiSelectProps = {
    options: string[];
    value: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    className?: string;
};

export const MultiSelect = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className,
}: MultiSelectProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    // const [files, setFiles] = useState<any[]>([]);
    //
    // useEffect(() => {
    //     fetchDriveFolder('1sq_SvrMH0vfr2tbDbzspNAMAPRxiCPVe')
    //         .then(setFiles)
    //         .catch(console.error);
    // }, []);

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
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm flex items-center justify-between hover:bg-gray-50"
            >
                <span className="truncate">
                    {value.length === 0
                        ? placeholder
                        : value.length === 1
                          ? value[0]
                          : `${value.length} selected`}
                </span>
                <span className="ml-2 text-gray-400">▾</span>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="p-2 border-b">
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full h-9 rounded-md border border-gray-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="max-h-56 overflow-auto p-1">
                        {filtered.length === 0 && (
                            <div className="px-2 py-3 text-sm text-gray-500">No results</div>
                        )}
                        {filtered.map(opt => {
                            const checked = value.includes(opt);
                            return (
                                <label
                                    key={opt}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
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

                    <div className="flex items-center justify-between gap-2 p-2 border-t bg-gray-50">
                        <button
                            type="button"
                            onClick={allSelected ? clearAll : selectAll}
                            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs hover:bg-white"
                        >
                            {allSelected ? 'Clear all' : 'Select all'}
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={clearAll}
                                className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs hover:bg-white"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-md bg-blue-600 text-white px-2.5 py-1.5 text-xs hover:bg-blue-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
