import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useAuth } from "../../auth/hooks/useAuth";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import FollowButton from "../../../components/buttons/FollowButton";
import { getAvatarUrl } from "../../../utils/avatarUtils";

export default function FollowingPage() {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [localFollowedUsers, setLocalFollowedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Fetch posts from followed users
    useEffect(() => {
        if (!token || !user) return;
        
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/following/posts`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setPosts(res.data);
            
            // Extract author information from posts
            // This is a more reliable way to get followed users
            if (res.data && res.data.length > 0) {
                const uniqueAuthors = [];
                const authorIds = new Set();
                
                for (const post of res.data) {
                    if (post.author && post.author._id && !authorIds.has(post.author._id)) {
                        uniqueAuthors.push(post.author);
                        authorIds.add(post.author._id);
                    }
                }
                
                if (uniqueAuthors.length > 0) {
                    console.log(`Found ${uniqueAuthors.length} authors from posts`, uniqueAuthors);
                    // Set followed users directly from post authors
                    setLocalFollowedUsers(uniqueAuthors);
                    setLoadingUsers(false);
                } else {
                    // If no authors found in posts, fall back to standard user fetch
                    fetchFollowedUsersFromApi();
                }
            } else {
                fetchFollowedUsersFromApi();
            }
        })
        .catch(err => {
            console.error("Error fetching following posts:", err);
            setPosts([]);
            fetchFollowedUsersFromApi();
        })
        .finally(() => setLoading(false));
    }, [token, user]);
    
    // Backup method to fetch followed users directly from API
    const fetchFollowedUsersFromApi = () => {
        if (!token || !user) {
            setLoadingUsers(false);
            return;
        }
        
        setLoadingUsers(true);
        
        // Get followed user IDs from localStorage
        const followedIds = JSON.parse(localStorage.getItem("followedUserIds") || "[]");
        console.log("Followed IDs from localStorage:", followedIds);
        
        if (followedIds.length === 0) {
            setLocalFollowedUsers([]);
            setLoadingUsers(false);
            return;
        }
        
        // Fetch followed users directly - the most reliable approach
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/following/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.data && res.data.length > 0) {
                console.log("Successfully fetched followed users from API:", res.data);
                setLocalFollowedUsers(res.data);
            } else {
                console.log("No users returned from API, falling back to all users");
                fallbackToAllUsers(followedIds);
            }
        })
        .catch(err => {
            console.error("Error fetching followed users:", err);
            fallbackToAllUsers(followedIds);
        })
        .finally(() => setLoadingUsers(false));
    };
    
    // Last resort: fetch all users and filter locally
    const fallbackToAllUsers = (followedIds) => {
        if (!token || followedIds.length === 0) {
            setLoadingUsers(false);
            return;
        }
        
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            const allUsers = res.data || [];
            console.log(`Filtering ${allUsers.length} users against ${followedIds.length} IDs`);
            
            // Find matching users by ID
            const matchedUsers = [];
            for (const id of followedIds) {
                const foundUser = allUsers.find(u => u._id === id);
                if (foundUser) {
                    matchedUsers.push(foundUser);
                }
            }
            
            console.log(`Found ${matchedUsers.length} matching users`);
            if (matchedUsers.length > 0) {
                setLocalFollowedUsers(matchedUsers);
            } else {
                // Last resort: create minimal user objects
                const minimalUsers = followedIds.map(id => ({
                    _id: id,
                    name: "User",
                    avatar: null
                }));
                setLocalFollowedUsers(minimalUsers);
            }
        })
        .catch(() => {
            // Create minimal user objects as last resort
            const minimalUsers = followedIds.map(id => ({
                _id: id,
                name: "User",
                avatar: null
            }));
            setLocalFollowedUsers(minimalUsers);
        })
        .finally(() => setLoadingUsers(false));
    };

    // Handle follow/unfollow
    const handleFollowChange = (userId, isNowFollowing) => {
        if (!isNowFollowing) {
            setLocalFollowedUsers(prev => prev.filter(u => u._id !== userId));
            // After unfollowing, refresh the posts as well
            if (token && user) {
                axios.get(`${import.meta.env.VITE_API_URL}/api/auth/following/posts`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => setPosts(res.data))
                .catch(() => setPosts([]));
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
            {/* Main posts column */}
            <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4">Following Feed</h2>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-[#1a1a1a] rounded-lg p-4 animate-pulse">
                                <div className="h-24 bg-[#252525] rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length ? (
                    posts.map(post => (
                        <PostCard 
                            key={post._id} 
                            post={post}
                        />
                    ))
                ) : (
                    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2f2f2f] text-center">
                        <FaUserPlus className="mx-auto text-4xl text-gray-500 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No posts from followed users</h3>
                        <p className="text-gray-400 mb-4">
                            Follow some users to see their posts in your feed.
                        </p>
                        <Link 
                            to="/explore" 
                            className="px-4 py-2 bg-[#454545] text-white rounded-full hover:bg-[#505050] transition"
                        >
                            Discover Users
                        </Link>
                    </div>
                )}
            </div>
            
            {/* Following sidebar */}
            <div className="w-full md:w-72">
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2f2f2f] sticky top-4">
                    <h3 className="text-lg font-medium mb-4">Users You Follow</h3>
                    
                    {loadingUsers ? (
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
                    ) : localFollowedUsers.length > 0 ? (
                        <div className="space-y-4">
                            {localFollowedUsers.map(followedUser => (
                                <div key={followedUser._id} className="flex items-center">
                                    <Link to={`/profile/${followedUser._id}`} className="flex items-center flex-1">
                                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                            <img 
                                                src={getAvatarUrl(followedUser.avatar, followedUser.name)} 
                                                alt={followedUser.name || 'User'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(followedUser.name || 'User')}&background=random`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{followedUser.name || 'User'}</h4>
                                        </div>
                                    </Link>
                                    <FollowButton 
                                        userId={followedUser._id}
                                        isFollowing={true}
                                        onFollowChange={(isFollowing) => handleFollowChange(followedUser._id, isFollowing)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-2">
                            You're not following anyone yet
                        </p>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-[#2f2f2f] text-center">
                        <Link 
                            to="/explore" 
                            className="text-blue-400 text-sm hover:underline"
                        >
                            Discover more users
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}