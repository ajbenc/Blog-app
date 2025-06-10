import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../../posts/hooks/usePosts';
import PostCard from '../../posts/components/PostCard';
import { useTumblrFeed } from '../../tumblr/hooks/useTumblrFeed';
import { useMemo } from 'react';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('query')?.toLowerCase() || '';
  const { posts, loading } = usePosts();

  // Tumblr search
  const isTag = query.startsWith('#');
  const tag = isTag ? query.replace(/^#/, '') : null;
  const { posts: tumblrPosts, loading: tumblrLoading } = useTumblrFeed(null, tag ? { tag } : {});

  // Local search
  const filtered = useMemo(
    () =>
      isTag
        ? posts.filter(p => p.content?.toLowerCase().includes(tag) || 
            (p.tags && Array.isArray(p.tags) && p.tags.includes(tag)))
        : posts.filter(p => p.content?.toLowerCase().includes(query)),
    [posts, query, tag, isTag]
  );

  // Combine local and Tumblr posts
  const allPosts = [
    ...filtered,
    ...(Array.isArray(tumblrPosts) ? tumblrPosts : []).map(p => ({
      ...p,
      _source: "tumblr",
      createdAt: p.timestamp ? new Date(p.timestamp * 1000).toISOString() : new Date().toISOString()
    }))
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Results for "{query}"
      </h2>
      {loading || tumblrLoading ? (
        <div className="flex justify-center">
          <div className="animate-pulse space-y-4 w-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="h-24 bg-[#252525] rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : allPosts.length ? (
        <div className="space-y-4">
          {allPosts.map(post =>
            post._source === "tumblr" ? (
              <PostCard key={post.id || post._id} post={post} isTumblr />
            ) : (
              <PostCard key={post._id} post={post} />
            )
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#1a1a1a] rounded-lg border border-[#2f2f2f]">
          <p className="text-gray-400">No results found for "{query}"</p>
          <p className="text-gray-500 mt-2 text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  );
}