import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api', // <-- Add /api here
});

// Get all the posts
export const fetchPosts = (token) =>
  api.get('/posts', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);

//Create new post

export const createPost = ({ type, content, mediaFiles, tags }, token) =>
    api.post('/posts', { 
        type, 
        content, 
        mediaFiles, 
        tags 
    }, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);

//Edit a post
export const editPost = (postId, { content, tags }, token) =>
    api.put(`/posts/${postId}`, { content, tags }, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);

//Like / Unlike a post

export const likePost = (postId, token) =>
  api.put(`/posts/${postId}/like`, null, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);

//Comment on a post

export const commentPost = (postId, text, token) =>
    api.post(`/posts/${postId}/comment`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);

//Repost

export const repostPost = (postId, token) =>
    api.post(`/posts/${postId}/repost`, null, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);