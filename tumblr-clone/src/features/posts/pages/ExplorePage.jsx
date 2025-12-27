import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import axios from "axios";
import PostCard from "../components/PostCard";
import { useTumblrFeed } from "../../tumblr/hooks/useTumblrFeed";
import FollowButton from "../../../components/buttons/FollowButton";

const popularTags = ["art", "photography", "design", "music", "fashion", "travel", "food", "nature", "technology"];

export default function ExplorePage() {
  const { token, isUserFollowed } = useAuth();
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState("art");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Get Tumblr posts for the selected tag
  const { posts: taggedPosts, loading: tumblrLoading } = useTumblrFeed(
    null,
    { tag: selectedTag }
  );
  
  // Fetch suggested users
  useEffect(() => {
    if (!token) return;
    
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // Limit to 5 suggested users
        setUsers(res.data.slice(0, 5));
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [token]);
  
  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Explore</h1>
        
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
        
        {/* Display posts - FIXED SYNTAX ERROR IN NESTED TERNARY */}
        <div className="space-y-4">
          {tumblrLoading ? (
            <div className="text-center py-6">
              <p className="text-gray-400">Loading posts...</p>
            </div>
          ) : (taggedPosts?.length ? (
            taggedPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post}
                isTumblr={true}
              />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400">No posts found for #{selectedTag}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="w-full md:w-72">
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2f2f2f] sticky top-4">
          <h3 className="text-lg font-medium mb-4">Suggested Users</h3>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center animate-pulse">
                  <div className="w-10 h-10 bg-[#252525] rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#252525] rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length ? (
            <div className="space-y-4">
              {users.map(user => (
                <div 
                  key={user._id} 
                  className="flex items-center p-2 rounded-lg hover:bg-[#252525] transition-colors"
                >
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm hover:text-blue-400 transition-colors">{user.name}</h4>
                    </div>
                  </div>
                  <FollowButton 
                    userId={user._id}
                    isFollowing={isUserFollowed ? isUserFollowed(user._id) : false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-2">
              No suggestions available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}