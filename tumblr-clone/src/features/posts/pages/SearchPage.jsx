import { useSearchParams } from 'react-router-dom';
import { usePostsQuery } from '../../../hooks/usePostsQuery';
import { useAuth } from "../../auth/hooks/useAuth";
import PostCard from '../components/PostCard';
import { useTumblrFeed } from '../../tumblr/hooks/useTumblrFeed';
import { useMemo, useState } from 'react';

const popularTags = ["art", "photography", "design", "music", "fashion", "travel", "food", "nature", "technology"];

export default function SearchPage() {
  const [params] = useSearchParams();
  const [selectedTag, setSelectedTag] = useState("");
  // Remove # if present, Tumblr API expects just the tag name
  const query = (params.get('query') || '').replace(/^#/, '').toLowerCase();
  const { token } = useAuth();

  // Fetch all local posts
  const { data: posts = [], isLoading: loading } = usePostsQuery(token);

  // Only fetch Tumblr posts if query or selectedTag is not empty
  const tumblrFeed = (query || selectedTag)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ? useTumblrFeed(null, { tag: selectedTag || query })
    : { posts: [], loading: false };

  const { posts: tumblrPosts = [], loading: tumblrLoading } = tumblrFeed;

  // Filter local posts by content or tags
  const filteredLocalPosts = useMemo(
    () =>
      posts.filter(
        post =>
          post.content?.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query))
      ),
    [posts, query]
  );

  // Optionally filter Tumblr posts if needed
  const filteredTumblrPosts = useMemo(
    () =>
      tumblrPosts.filter(
        post =>
          post.summary?.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query))
      ),
    [tumblrPosts, query]
  );

  // Combine results
  const allResults = [...filteredLocalPosts, ...filteredTumblrPosts];

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        
        {/* Tag selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full border transition-all duration-200 ${
                selectedTag === tag
                  ? "bg-[#303030] text-white border-[#404040]"
                  : "bg-[#252525] text-gray-300 border-[#2f2f2f] hover:border-[#363636]"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Display posts */}
        <div className="space-y-4">
          {(loading || tumblrLoading) ? (
            <div className="text-center py-6">
              <p className="text-gray-400">Loading posts...</p>
            </div>
          ) : (allResults.length ? (
            allResults.map(post => (
              <PostCard 
                key={post._id || post.id} 
                post={post}
                isTumblr={!!post.id && !post._id}
              />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400">No posts found.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
