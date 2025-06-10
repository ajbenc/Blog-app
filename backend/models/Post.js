import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String // optional for images or videos
  },
  mediaFiles: [
    {
      url: { type: String },
      type: { type: String },
      originalName: { type: String }
    }
  ],
  tags: [
    {type: String}
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);
