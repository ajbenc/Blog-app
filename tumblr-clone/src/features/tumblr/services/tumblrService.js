import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // This should be http://localhost:4000/api
});

export const getTumblrBlogPosts = async (blogIdentifier, options = {}) => {
  const url = `/tumblr/blog/${blogIdentifier}/posts`;
  const { data } = await api.get(url, { params: options });
  return data;
};

export const getTumblrTagged = async (tag, options = {}) => {
  const url = `/tumblr/tag/${tag}`;
  const { data } = await api.get(url, { params: options });
  return data;
};
