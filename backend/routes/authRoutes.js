import express from 'express';
import { register, login, updateProfile, getProfile, followUser, unfollowUser, getFollowingPosts, listUsers } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadAvatar } from '../uploads/uploadController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', protect, updateProfile);
router.post('/avatar', uploadAvatar);
router.get('/profile', protect, getProfile);
router.get('/me', protect, getProfile);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);
router.get('/following/posts', protect, getFollowingPosts);
router.get('/users', protect, listUsers);

export default router;