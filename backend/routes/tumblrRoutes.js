import express from 'express';
import { fetchBlogPosts, fetchTaggedPosts } from '../services/tumblrService.js';

const router = express.Router();

// GET /api/tumblr/blog/:blogIdentifier/posts
router.get('/blog/:blogIdentifier/posts', async (req, res) => {
  try {
    const posts = await fetchBlogPosts(req.params.blogIdentifier, {
      limit: req.query.limit,
      offset: req.query.offset,
      type: req.query.type
    });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: 'Error at obtaining tumblr posts' });
  }
});

// GET /api/tumblr/tag/:tag
router.get('/tag/:tag', async (req, res) => {
  try {
    const posts = await fetchTaggedPosts(req.params.tag, {
      limit: req.query.limit,
      before: req.query.before
    });
    res.json(posts);
  } catch (e) {
    console.error('Error fetching tagged posts:', e);
    // Log the error for debugging purposes
    res.status(500).json({ message: 'Error at obtaining tag posts' });
  }
});

export default router;
