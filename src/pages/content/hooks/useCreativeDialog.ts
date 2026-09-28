import { useState } from 'react';
import type { Post } from '@/api/db/types';

export type UseCreativeDialogResult = {
    open: boolean;
    selectedPost: Post | null;
    openPost: (post: Post) => void;
    setOpen: (v: boolean) => void;
};

export function useCreativeDialog(): UseCreativeDialogResult {
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const openPost = (post: Post) => {
        setSelectedPost(post);
        setOpen(true);
    };

    return { open, selectedPost, openPost, setOpen };
}
