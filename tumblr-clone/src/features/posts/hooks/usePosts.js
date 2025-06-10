import { useState, useEffect, useCallback } from 'react';
import * as service from '../services/postService.js';
import { useAuth } from '../../auth/hooks/useAuth.js';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Initial Fetch
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await service.fetchPosts(token); // pass token here
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Create Post
  const addPost = async (postData) => {
    const newPost = await service.createPost(postData, token); // pass token here
    setPosts(prev => [newPost, ...prev]);
  };

  // Likes
  const toggleLike = async (postId) => {
    const { likes } = await service.likePost(postId, token);
    setPosts(prev =>
      prev.map(p => (p._id === postId ? { ...p, likesCount: likes.length, likes } : p))
    );
  };

  // Comments
  const addComment = async (postId, text) => {
    const comments = await service.commentPost(postId, text, token);
    setPosts(prev =>
      prev.map(p =>
        p._id === postId ? { ...p, comments } : p
      )
    );
  };

  // Repost
  const doRepost = async (postId) => {
    const { reposts } = await service.repostPost(postId, token);
    setPosts(prev =>
      prev.map(p =>
        p._id === postId ? { ...p, repostsCount: reposts } : p
      )
    );
  };

  // Edit Post
  const editPost = async (postId, data) => {
    const updated = await service.editPost(postId, data, token);
    setPosts(prev => prev.map(p => (p._id === postId ? updated : p)));
  };

  return {
    posts,
    loading,
    addPost,
    toggleLike,
    addComment,
    doRepost,
    editPost,
  };
}
