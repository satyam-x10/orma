import React, { useCallback, useState } from "react";
import NudityFlaggedContext from "./NudityFlaggedContext";
import { deletePost, getFlaggedPosts, updatePost } from "../../components/home/services/homeApi";
import { NudityFlaggedPost, NudityFlaggedProviderProps } from "../../types";
import { ok } from "assert";

export const NudityFlaggedProvider: React.FC<NudityFlaggedProviderProps> = ({ children }) => {

    const [flaggedPosts, setFlaggedPosts] = useState<NudityFlaggedPost[]>([]);

    const approvePost = useCallback(async (event_hash: string, postId: string) => {
        const response = await updatePost(event_hash, postId);
        setFlaggedPosts((prev) => prev.filter((post) => post.id !== Number(postId)));
    }, []);

    const rejectPost = useCallback(async (event_hash: string, postId: string) => {
        const response = await deletePost(event_hash, Number(postId));
        setFlaggedPosts((prev) => prev.filter((post) => post.id !== Number(postId)));
    }, []);

    return (
        <NudityFlaggedContext.Provider value={{ flaggedPosts, setFlaggedPosts, approvePost, rejectPost }}>
            {children}
        </NudityFlaggedContext.Provider>
    )
}