import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
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
        ? posts.filter(p => p.content.toLowerCase().includes(tag))
        : posts.filter(p => p.content.toLowerCase().includes(query)),
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
        Results for “{query}”
      </h2>
      {loading || tumblrLoading ? (
        <p>Loading...</p>
      ) : allPosts.length ? (
        allPosts.map(post =>
          post._source === "tumblr" ? (
            <PostCard key={post.id || post._id} post={post} isTumblr />
          ) : (
            <PostCard key={post._id} post={post} />
          )
        )
      ) : (
        <p>Posts not found.</p>
      )}
    </div>
  );
}
