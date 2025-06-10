import { useAuth } from "../auth/hooks/useAuth.js";
import { useState } from "react";
import { usePosts } from "../posts/hooks/usePosts.js";
import ProfileSettings from "./ProfileSettings.jsx";
import UserPosts from "./UserPosts.jsx";
import { FaPencilAlt, FaChevronRight, FaChevronLeft, FaCog } from "react-icons/fa";
import { useTumblrFeed } from "../tumblr/hooks/useTumblrFeed";
import FollowButton from "../../components/buttons/FollowButton.jsx";

export default function ProfilePage({ viewUser = null }) {
    const { user } = useAuth();
    const { posts, loading } = usePosts();
    const { posts: tumblrPosts } = useTumblrFeed("staff.tumblr.com", { limit: 20 });
    const [tab, setTab] = useState("profile");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Use viewUser (when viewing someone else's profile) or the logged-in user
    const displayUser = viewUser || user;

    if (!displayUser) return <div className="p-4 text-center">Loading profile...</div>;
    
    // Determine if this is the user's own profile
    const isOwnProfile = !viewUser;

    return (
        <div className="relative min-h-screen">
            {/* Settings Sidebar - only show for own profile */}
            {isOwnProfile && (
                <div
                    className={`fixed left-0 top-0 h-full bg-[#1a1a1a] border-r border-[#2f2f2f] transition-all duration-300 ease-in-out transform ${
                        isSettingsOpen ? "translate-x-0 w-96" : "-translate-x-full w-96"
                    } z-20 flex flex-col`}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-[#2f2f2f]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="p-2 hover:bg-[#252525] rounded-full transition-colors"
                            >
                                <FaChevronLeft className="text-gray-400 hover:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-hidden">
                        <ProfileSettings user={user} />
                    </div>
                </div>
            )}

            {/* Settings Toggle Button - only show for own profile */}
            {isOwnProfile && (
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className={`fixed left-0 top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-gray-400 p-3 rounded-r-lg border border-l-0 border-[#2f2f2f] hover:bg-[#252525] hover:text-white transition-all group z-10 ${
                        isSettingsOpen ? "opacity-0" : "opacity-100"
                    }`}
                >
                    <FaCog className="text-xl group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            {/* Main Profile Content */}
            <div className="max-w-2xl mx-auto p-4">
                <div
                    className="rounded-lg shadow"
                    style={{
                        background: displayUser.themeColor || "#23272a",
                        transition: "background 0.3s"
                    }}
                >
                    {/* Header background */}
                    <div
                        className="h-52 w-full rounded-t-lg relative"
                        style={{
                            background: displayUser.profileBg
                                ? `url(${displayUser.profileBg}) center/cover no-repeat`
                                : displayUser.themeColor
                                ? displayUser.themeColor
                                : "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
                        }}
                    >
                        {/* Settings button on profile header - only for own profile */}
                        {isOwnProfile && (
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors group"
                            >
                                <FaCog className="text-white text-xl group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        )}

                        {/* Follow button - only for other users' profiles */}
                        {!isOwnProfile && viewUser && (
                            <div className="absolute top-4 right-4">
                                <FollowButton 
                                    userId={viewUser._id}
                                    isFollowing={false} // This should be determined by the context
                                />
                            </div>
                        )}

                        {/* Floating avatar */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-56px] z-10">
                            <img
                                src={displayUser.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayUser.name || "User")}
                                alt="avatar"
                                className="w-28 h-28 rounded-full object-cover border-4 border-[#1a1a1a] shadow-lg"
                            />
                        </div>
                    </div>
                    {/* User info */}
                    <div className="flex flex-col items-center pt-20 pb-8">
                        <div className="text-2xl font-bold mb-1">{displayUser.name}</div>
                        {displayUser.bio && <div className="text-center text-gray-300 mb-1">{displayUser.bio}</div>}
                        {displayUser.website && (
                            <div className="text-center mb-1">
                                <a href={displayUser.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    {displayUser.website}
                                </a>
                            </div>
                        )}
                        {displayUser.location && <div className="text-center text-gray-400 mb-1">{displayUser.location}</div>}
                    </div>
                    {/* Posts card */}
                    <div
                        className="rounded-lg shadow p-6 mt-4 bg-gray-900"
                        style={{
                            background: displayUser.themeColor || "#23272a",
                            transition: "background 0.3s"
                        }}
                    >
                        <UserPosts user={displayUser} posts={posts} loading={loading} tumblrPosts={tumblrPosts} />
                    </div>
                </div>
            </div>

            {/* Overlay when settings is open */}
            {isSettingsOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                    onClick={() => setIsSettingsOpen(false)}
                />
            )}
        </div>
    );
}