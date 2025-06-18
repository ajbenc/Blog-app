import { useState, useMemo } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePostsQuery } from "../../../hooks/usePostsQuery";
import PostTypeBar from "../components/PostTypeBar.jsx";
import PostCard from "../components/PostCard.jsx";
import { useTumblrFeed } from "../../tumblr/hooks/useTumblrFeed";
import ConnectSidebar from "./ConnectSidebar.jsx";

const trendingTags = ["art", "music", "design", "photography", "fashion"];

export default function DashBoardPage () {
    const { token } = useAuth();
    const [selectedTag, setSelectedTag] = useState(null);

    // Fetch local posts with React Query
    const { data: posts = [], isLoading: loading } = usePostsQuery(token);

    // Fetch Tumblr posts
    const { posts: tumblrPosts = [], loading: tumblrLoading } = useTumblrFeed(
        selectedTag ? null : "staff.tumblr.com",
        selectedTag ? { tag: selectedTag } : { limit: 10 }
    );

    // Mix local and Tumblr posts, sorted by date
    const mixedPosts = useMemo(() => {
        const local = posts.map(p => ({ ...p, _source: "local" }));
        const tumblr = (Array.isArray(tumblrPosts) ? tumblrPosts : []).map(p => ({
            ...p,
            _source: "tumblr",
            createdAt: p.timestamp ? new Date(p.timestamp * 1000).toISOString() : new Date().toISOString()
        }));
        return [...local, ...tumblr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [posts, tumblrPosts]);

    return(
        <div className="max-w-4xl mx-auto p-4 flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 hidden md:block">
                <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-4 mb-6 border border-[#2f2f2f] hover:border-[#363636] transition-colors">
                    <h2 className="text-lg font-bold mb-2 text-white">Explore</h2>
                    <div className="flex flex-wrap gap-2">
                        {trendingTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-3 py-1 rounded-full border transition-all duration-200 hover:scale-105 ${
                                    selectedTag === tag
                                        ? "bg-[#303030] text-white border-[#404040]"
                                        : "bg-[#252525] text-gray-300 border-[#2f2f2f] hover:border-[#363636] hover:text-blue-400"
                                }`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>
                
                <ConnectSidebar />
            </aside>
            
            {/* Main Feed */}
            <main className="flex-1">
                <PostTypeBar /* addPost={addPost} (mutations will be added soon) */ />
                
                {loading && tumblrLoading ? (
                    <p className="text-center text-gray-300">Loading...</p>
                ) : (
                    mixedPosts.map(post =>
                        post._source === "local" ? (
                            <PostCard
                                key={post._id}
                                post={post}
                                // onLike, onComment, etc. will be updated with mutations
                            />
                        ) : (
                            <PostCard
                                key={post.id || post._id}
                                post={post}
                                isTumblr={post._source === "tumblr"}
                            />
                        )
                    )
                )}
            </main>
        </div>
    );
}