import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useLikeTumblrMutation(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tumblrPostId) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/like-tumblr`, { tumblrPostId }, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    onSuccess: () => queryClient.invalidateQueries(['tumblrActions']),
  });
}

export function useUnlikeTumblrMutation(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tumblrPostId) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/unlike-tumblr`, { tumblrPostId }, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    onSuccess: () => queryClient.invalidateQueries(['tumblrActions']),
  });
}

export function useRepostTumblrMutation(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tumblrPostId) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/repost-tumblr`, { tumblrPostId }, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    onSuccess: () => queryClient.invalidateQueries(['tumblrActions']),
  });
}

export function useUnrepostTumblrMutation(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tumblrPostId) =>
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/unrepost-tumblr`, { tumblrPostId }, {
        headers: { Authorization: `Bearer ${token}` }
      }),
    onSuccess: () => queryClient.invalidateQueries(['tumblrActions']),
  });
}