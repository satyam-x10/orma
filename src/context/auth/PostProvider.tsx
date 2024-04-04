import React, { useState } from 'react';
import PostContext from './PostContext';
import { PostsResponse, PostProviderProps, Post } from '../../types';

const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<PostsResponse>({ error: null, posts: [] });
  const [processingPost, setProcessingPost] = useState<PostsResponse>({ error: null, posts: [] });

  const setPost = (post: PostsResponse | null) => {
    if (post) {
      setPosts({
        error: post?.error,
        posts: post?.posts
      })
    }
  }

  const addPost = (post: Post) => {
    setPosts((prevPosts) => ({
      ...prevPosts,
      posts: prevPosts.posts ? [post, ...prevPosts.posts] : [post]
    }));
  };


  const addMorePosts = (newposts: PostsResponse) => {
    const newPostsArray = newposts.posts || [];
    const existingPostsArray = posts.posts || [];
    let combined = [...existingPostsArray, ...newPostsArray];
    setPosts((prevPosts) => ({
      ...prevPosts,
      posts: combined // Using the combined array here
    }));
  };

  const setProcessing = (post: PostsResponse) => {
    setProcessingPost({
      error: post?.error,
      posts: post?.posts
    })
  }

  const addProcessingPost = (post: Post) => {
    setProcessingPost((prevPosts) => ({
      ...prevPosts,
      posts: prevPosts.posts ? [post, ...prevPosts.posts] : [post]
    }));
  };

  const removeProcessingPost = (id: Number) => {
    if (processingPost?.posts && processingPost?.posts.length > 0) {

      let remove = processingPost?.posts.filter((post) => post.id !== id);
      setProcessing({
        posts: remove,
        error: null,
      });

    }
  }

  return (
    <PostContext.Provider value={{ posts, setPost, addPost, processingPost, setProcessing, addProcessingPost, removeProcessingPost, addMorePosts }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;