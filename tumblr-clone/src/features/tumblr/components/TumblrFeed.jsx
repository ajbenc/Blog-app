import { useTumblrFeed } from '../hooks/useTumblrFeed';

export default function TumblrFeed({ blog, tag }) {
  const { posts, loading } = useTumblrFeed(blog, tag ? { tag } : { limit: 10 });

  if (loading) return <p>Loading Tumblr…</p>;
  if (!Array.isArray(posts)) return <p>No Tumblr posts found.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{tag ? `#${tag}` : blog} posts</h2>
      {posts.map(p => (
        <div key={p.id} className="mb-6 p-4 bg-white rounded shadow">
          <h3 className="font-semibold">{p.summary || p.blog_name}</h3>
          {p.photos?.[0]?.original_size?.url && (
            <img src={p.photos[0].original_size.url} alt="" className="mt-2" />
          )}
          <p className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: p.caption }} />
          <a href={p.post_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            Watch in Tumblr
          </a>
        </div>
      ))}
    </div>
  );
}
