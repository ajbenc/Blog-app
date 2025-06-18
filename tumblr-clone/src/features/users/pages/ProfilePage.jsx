import { useAuth } from "../../auth/hooks/useAuth.js";
import { useState, useEffect } from "react";
import { usePostsQuery } from "../../../hooks/usePostsQuery";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { useTumblrFeed } from "../../tumblr/hooks/useTumblrFeed";
import {
  useLikeTumblrMutation,
  useUnlikeTumblrMutation,
  useRepostTumblrMutation,
  useUnrepostTumblrMutation
} from '../../tumblr/hooks/useTumblrActions';

// Import the actual profile page component
import UserProfile from "../../user/ProfilePage.jsx";


export default function ProfilePage() {
  const { userId } = useParams();
  const { token } = useAuth();
  const { data: posts = [], isLoading: loading } = usePostsQuery(token); 
  const { posts: tumblrPosts } = useTumblrFeed("staff.tumblr.com", { limit: 10 });
  const [viewedUser, setViewedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState(null);
  
  const likeTumblr = useLikeTumblrMutation(token);
  const unlikeTumblr = useUnlikeTumblrMutation(token);
  const repostTumblr = useRepostTumblrMutation(token);
  const unrepostTumblr = useUnrepostTumblrMutation(token);

  // If we have a userId param, we're viewing someone else's profile
  // Otherwise, we're viewing our own
  const isOwnProfile = !userId;
  
  // Fetch user data if viewing someone else's profile
  useEffect(() => {
    if (!isOwnProfile && userId) {
      setLoadingUser(true);
      setError(null);
      
      // Fetch the user details
      axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setViewedUser(response.data);
      })
      .catch(err => {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load user profile");
      })
      .finally(() => {
        setLoadingUser(false);
      });
    }
  }, [userId, token, isOwnProfile]);
  
  // If loading the user's profile
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mr-2" />
        <span className="text-gray-300">Loading profile...</span>
      </div>
    );
  }
  
  // If there was an error loading the profile
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="bg-red-500/10 rounded-lg p-8 border border-red-500/20">
          <h2 className="text-xl text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }
  
  // Render the profile
  return (
    <div className="max-w-4xl mx-auto p-4">
      {isOwnProfile ? (
        // Own profile
        <UserProfile />
      ) : (
        // Someone else's profile
        <UserProfile viewUser={viewedUser} />
      )}
    </div>
  );
}