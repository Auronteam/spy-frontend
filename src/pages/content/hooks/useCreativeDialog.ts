import { useState } from 'react';
import type { Post } from '@/pages/content/types';

export type UseCreativeDialogResult = {
    open: boolean;
    selectedPost: Post | null;
    openPost: (post: Post) => void;
    close: () => void;
    setOpen: (v: boolean) => void;
};

export function useCreativeDialog(): UseCreativeDialogResult {
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const openPost = (post: Post) => {
        setSelectedPost(post);
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setSelectedPost(null);
    };

    return { open, selectedPost, openPost, close, setOpen };
}
