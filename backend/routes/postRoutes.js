import express from 'express';
import {
    createPost,
    getAllPosts,
    likePost,
    commentPost,
    repostPost,    
    editPost
} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadAvatar } from '../uploads/uploadController.js';


const router = express.Router();

// Route to create a new post

router.post('/', protect, createPost);

// Route to get all posts

router.get('/', protect, getAllPosts);

// Route to edit a post
router.put('/:id', protect, editPost);

// Route to like a post

router.put('/:id/like', protect, likePost);

// Route to comment on a post

router.post('/:id/comment', protect, commentPost);

// Route to report a post

router.post('/:id/repost', protect, repostPost);

// For post media uploads
router.post('/upload', uploadAvatar);

export default router;