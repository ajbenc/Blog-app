import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE = 'https://api.tumblr.com/v2';

export async function fetchBlogPosts(blogIdentifier, options = {}) {
  const { limit = 20, offset = 0, type } = options;
  const params = {
    api_key: process.env.TUMBLR_API_KEY,
    limit,
    offset,
  };
  if (type) params.type = type;

  const url = `${BASE}/blog/${blogIdentifier}/posts`;
  const { data } = await axios.get(url, { params });
  return data.response.posts;
}

export async function fetchTaggedPosts(tag, options = {}) {
  const { before, limit = 20 } = options;
  const params = {
    api_key: process.env.TUMBLR_API_KEY,
    tag,
    limit
  };
  if (before) params.before = before; // timestamp
  const url = `${BASE}/tagged`;
  const { data } = await axios.get(url, { params });
  return data.response;
}
