import PostCard from "../posts/components/PostCard.jsx";

// Helper to get Tumblr sim state
function getTumblrSimState(postId) {
  const data = JSON.parse(localStorage.getItem("tumblrSim") || "{}");
  return data[postId] || { likes: 0, likedBy: [], comments: [], reposts: 0, repostedBy: [] };
}

export default function UserPosts({ user, posts, loading, tumblrPosts = [] }) {
    // Local posts
    const myPosts = posts.filter(
        p =>
            (typeof p.user === "object" && p.user._id === user?._id) ||
            (typeof p.user === "string" && p.user === user?._id)
    );
    const likedPosts = posts.filter(p => Array.isArray(p.likes) && p.likes.includes(user?._id));
    const repostedPosts = posts.filter(p => Array.isArray(p.reposts) && p.reposts.includes(user?._id));

    // Tumblr posts: check localStorage for likes/reposts by this user
    const tumblrLiked = tumblrPosts.filter(p => {
      const sim = getTumblrSimState(p.id);
      // For backward compatibility, treat likes as a count, but you can extend to store likedBy array
      return sim.likedBy?.includes(user?._id);
    });
    const tumblrReposted = tumblrPosts.filter(p => {
      const sim = getTumblrSimState(p.id);
      return sim.repostedBy?.includes(user?._id);
    });

    return (
        <>
            <h3 className="text-xl font-semibold mb-2">My Posts</h3>
            {loading ? (
                <p>Loading...</p>
            ) : myPosts.length ? (
                myPosts.map(post => <PostCard key={post._id} post={post} />)
            ) : (
                <p className="text-gray-500">You haven't posted anything yet.</p>
            )}

            <h3 className="text-xl font-semibold mt-6 mb-2">Liked Posts</h3>
            {[...likedPosts, ...tumblrLiked].length ? (
                [...likedPosts, ...tumblrLiked].map(post =>
                  <PostCard key={post._id || post.id} post={post} isTumblr={!!post.id} />
                )
            ) : (
                <p className="text-gray-500">No liked posts yet.</p>
            )}

            <h3 className="text-xl font-semibold mt-6 mb-2">Reposted Posts</h3>
            {[...repostedPosts, ...tumblrReposted].length ? (
                [...repostedPosts, ...tumblrReposted].map(post =>
                  <PostCard key={post._id || post.id} post={post} isTumblr={!!post.id} />
                )
            ) : (
                <p className="text-gray-500">No reposted posts yet.</p>
            )}
        </>
    );
}