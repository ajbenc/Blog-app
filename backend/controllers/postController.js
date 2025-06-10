import Post from '../models/Post.js';

export async function createPost(req, res) {
    try {
        const { type, content, mediaUrl, mediaFiles, tags } = req.body;
        
        // Create the post object with proper validation
        const postData = {
            user: req.user.id,
            type,
            content,
            tags
        };

        // Only add mediaUrl if it exists
        if (mediaUrl) {
            postData.mediaUrl = mediaUrl;
        }

        // Process mediaFiles properly - ensure it's an array of objects
        if (mediaFiles && Array.isArray(mediaFiles)) {
            postData.mediaFiles = mediaFiles.map(media => ({
                url: media.url,
                type: media.type,
                originalName: media.originalName || ''
            }));
        }

        const newPost = new Post(postData);
        await newPost.save();
        
        // Populate user field with name and avatar before returning
        await newPost.populate("user", "name avatar");
        res.status(201).json(newPost);
    } catch (err) {
        console.error('Create Post Error:', err);
        res.status(500).json({ message: "Error creating the post", error: err.message });
    }
}

export async function getAllPosts(req, res) {
    try{
        const posts = await Post.find()
            .populate("user", "name email avatar") // <-- add avatar here
            .populate("comments.user", "name avatar")
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching posts" });
    }
}

export async function likePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user.id)) {
            post.likes.push(req.user.id);
        } else {
            post.likes = post.likes.filter(userId => userId.toString() !== req.user.id.toString());
        }
        await post.save();
        res.json({ likes: post.likes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error liking the post" });
    }
}

export async function editPost(req, res) {
    try {
        const { content, tags } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.user.toString() !== req.user.id){
            return res.status(403).json({ message: "You are not authorized to edit this post" });
        }
        if (content) post.content = content;
        if (tags) post.tags = tags;
        await post.save();
        await post.populate("user", "name avatar");
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error editing the post" });
    }
}

export async function commentPost (req, res) {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        post.comments.push({
            user: req.user.id,
            text
        });
        await post.save();
        // Populate user fields for the latest comments
        await post.populate("comments.user", "name avatar");
        res.status(201).json(post.comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error commenting on the post" });
    }
}

export async function repostPost (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        // Prevent users from reposting their own posts
        if (post.user.toString() === req.user.id.toString()) {
            return res.status(400).json({ message: "You cannot repost your own post." });
        }
        if(!post.reposts.includes(req.user.id)) {
            post.reposts.push(req.user.id);
            await post.save();
        } 
        res.json({ reposts: post.reposts.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error reposting the post" });
    }
}