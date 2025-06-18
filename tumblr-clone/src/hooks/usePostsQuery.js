import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import * as postService from '../features/posts/services/postService';

/**
 * Custom hook to fetch posts using React Query.
 * @param {string} token - The user's auth token.
 * @returns {object} - { data, isLoading, isError, error }
 */
export function usePostsQuery(token) {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    },
    enabled: !!token, // Only run if token exists
  });
}

/**
 * Custom hook to create a post using React Query.
 * @param {string} token - The user's auth token.
 * @returns {object} - { mutate, isLoading, isError, error }
 */
export function useCreatePostMutation(token) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        postData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch posts after a new post is created
      queryClient.invalidateQueries(['posts']);
    },
  });
}

// Like/Unlike a post
export function useLikePostMutation(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => postService.likePost(postId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });
}

// Comment on a post
export function useCommentPostMutation(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, text }) => postService.commentPost(postId, text, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });
}

// Repost a post
export function useRepostPostMutation(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => postService.repostPost(postId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });
}

// Edit a post
export function useEditPostMutation(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }) => postService.editPost(postId, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });
}