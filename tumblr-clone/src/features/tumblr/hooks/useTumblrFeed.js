import { useEffect, useState } from "react";
import { getTumblrBlogPosts, getTumblrTagged } from "../services/tumblrService";

export function useTumblrFeed(blog, options = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    let fetch;
    if (options.tag) {
      // Remove tag from options before passing as params
      const { tag, ...rest } = options;
      fetch = getTumblrTagged(tag, rest);
    } else {
      fetch = getTumblrBlogPosts(blog, options);
    }
    fetch
      .then(data => {
        setPosts(Array.isArray(data.posts) ? data.posts : data); // tagged returns array directly
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [blog, JSON.stringify(options)]);

  return { posts, loading, error };
}