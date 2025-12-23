import Post from "../models/Post.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = 10;

export async function register(req, res) {
    try{
        const { name, email, password } = req.body;
        // Check if user already exists
        const existing = await User.findOne({email});
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = new User ({ name, email, password: hashed });
        await user.save();

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        res.status(201).json({ token, user: { _id: user._id, name, email } });
      
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function login (req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        console.log("Login: token set, should trigger fetchProfile");
        res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email } }); // <-- use _id
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function updateProfile (req, res) {
    try {
        const { name, email, password, avatar, profileBg, bio, website, location, themeColor } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar) user.avatar = avatar;
        if (profileBg) user.profileBg = profileBg;
        if (bio !== undefined) user.bio = bio;
        if (website !== undefined) user.website = website;
        if (location !== undefined) user.location = location;
        if (themeColor !== undefined) user.themeColor = themeColor;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            profileBg: user.profileBg,
            bio: user.bio,
            website: user.website,
            location: user.location,
            themeColor: user.themeColor
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating the profile" });
    }
}

export async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            profileBg: user.profileBg,
            bio: user.bio,
            website: user.website,
            location: user.location,
            themeColor: user.themeColor
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching the profile" });
    }
}

export async function followUser(req, res) {
    try {
        const user = await User.findById(req.user.id);
        const targetId = req.params.id;
        if (!user.following.includes(targetId)) {
            user.following.push(targetId);
            await user.save();
        }
        res.json({ following: user.following });
    } catch (err) {
        res.status(500).json({ message: "Error following user" });
    }
}

export async function unfollowUser(req, res) {
    try {
        const user = await User.findById(req.user.id);
        const targetId = req.params.id;
        user.following = user.following.filter(id => id.toString() !== targetId);
        await user.save();
        res.json({ following: user.following });
    } catch (err) {
        res.status(500).json({ message: "Error unfollowing user" });
    }
}

// Get posts from followed users
export async function getFollowingPosts(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const following = Array.isArray(user.following) ? user.following : [];
        console.log('Following IDs:', following);
        const posts = await Post.find({ user: { $in: following } })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error('getFollowingPosts error:', err);
        res.status(500).json({ message: "Error fetching following posts" });
    }
}

export async function listUsers(req, res) {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }, "name avatar");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
}

export async function getUserById(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, "name email avatar profileBg bio website location themeColor");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({ message: "Error fetching user" });
    }
}


export const getFollowedUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Get all users that this user follows
        const followedUsers = await User.find(
            { _id: { $in: user.following } },
            'name email avatar profileBg bio'
        );
        
        res.json(followedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Like a Tumblr post
export async function likeTumblrPost(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { tumblrPostId } = req.body;
    if (!user.likedTumblrPosts.includes(tumblrPostId)) {
      user.likedTumblrPosts.push(tumblrPostId);
      await user.save();
    }
    res.json({ likedTumblrPosts: user.likedTumblrPosts });
  } catch (err) {
    res.status(500).json({ message: "Error liking Tumblr post" });
  }
}

// Repost a Tumblr post
export async function repostTumblrPost(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { tumblrPostId } = req.body;
    if (!user.repostedTumblrPosts.includes(tumblrPostId)) {
      user.repostedTumblrPosts.push(tumblrPostId);
      await user.save();
    }
    res.json({ repostedTumblrPosts: user.repostedTumblrPosts });
  } catch (err) {
    res.status(500).json({ message: "Error reposting Tumblr post" });
  }
}

// Get user's Tumblr likes/reposts
export async function getTumblrActions(req, res) {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      likedTumblrPosts: user.likedTumblrPosts || [],
      repostedTumblrPosts: user.repostedTumblrPosts || []
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching Tumblr actions" });
  }
}

// Unlike a Tumblr post
export async function unlikeTumblrPost(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { tumblrPostId } = req.body;
    user.likedTumblrPosts = user.likedTumblrPosts.filter(id => id !== tumblrPostId);
    await user.save();
    res.json({ likedTumblrPosts: user.likedTumblrPosts });
  } catch (err) {
    res.status(500).json({ message: "Error unliking Tumblr post" });
  }
}

// Unrepost a Tumblr post
export async function unrepostTumblrPost(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { tumblrPostId } = req.body;
    user.repostedTumblrPosts = user.repostedTumblrPosts.filter(id => id !== tumblrPostId);
    await user.save();
    res.json({ repostedTumblrPosts: user.repostedTumblrPosts });
  } catch (err) {
    res.status(500).json({ message: "Error unreposting Tumblr post" });
  }
}