import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://example.com/default-avatar.png' // Default avatar URL
  },
  profileBg: {
  type: String,
  default: ""  
  },
  likedTumblrPosts: [{type: String}],  
  repostedTumblrPosts: [{type: String}],  
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bio: { type: String, default: "" },
  website: { type: String, default: "" },
  location: { type: String, default: "" },
  themeColor: { type: String, default: "#a1c4fd" }
}, {
  timestamps: true
});

// Ensure that all users have an empty array for 'following' if it doesn't exist
userSchema.pre('save', function(next) {
  if (!this.following) {
    this.following = [];
  }
  next();
});

export default mongoose.model('User', userSchema);