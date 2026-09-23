import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Matches Input's own token classes (no dedicated Textarea primitive in this
// design system yet) — see components/ui/input.tsx.
const textareaClassName =
    'flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono';

interface CookiesDropzoneProps {
    value: string;
    onChange: (value: string) => void;
}

export const CookiesDropzone = ({ value, onChange }: CookiesDropzoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => onChange(String(reader.result ?? ''));
        reader.readAsText(file);
    };

    return (
        <div className="grid gap-2">
            <Label htmlFor="add-profile-cookies">Cookies (optional)</Label>
            <div
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) loadFile(file);
                }}
            >
                <textarea
                    id="add-profile-cookies"
                    className={textareaClassName}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Paste cookies JSON or drop a file here"
                />
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json,.txt"
                className="hidden"
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) loadFile(file);
                }}
            />
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => fileInputRef.current?.click()}
            >
                Browse file
            </Button>
        </div>
    );
};
