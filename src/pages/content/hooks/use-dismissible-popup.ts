import {
    useEffect,
    useRef,
    useState,
    type FocusEvent,
    type KeyboardEvent,
    type RefObject,
} from 'react';

type UseDismissiblePopupResult = {
    open: boolean;
    toggle: () => void;
    close: () => void;
    containerRef: RefObject<HTMLDivElement | null>;
    triggerRef: RefObject<HTMLButtonElement | null>;
    handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
    handleBlur: (e: FocusEvent<HTMLDivElement>) => void;
};

export const useDismissiblePopup = (): UseDismissiblePopupResult => {
    const [open, setOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const onDocMouseDown = (e: MouseEvent): void => {
            if (!containerRef.current) return;
            if (e.target instanceof Node && containerRef.current.contains(e.target)) return;
            setOpen(false);
        };

        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, []);

    const toggle = (): void => setOpen(o => !o);
    const close = (): void => {
        setOpen(false);
        triggerRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
        if (e.key !== 'Escape' || !open) return;
        e.preventDefault();
        close();
    };

    const handleBlur = (e: FocusEvent<HTMLDivElement>): void => {
        const next = e.relatedTarget;
        if (next instanceof Node && !e.currentTarget.contains(next)) setOpen(false);
    };

    return { open, toggle, close, containerRef, triggerRef, handleKeyDown, handleBlur };
};
