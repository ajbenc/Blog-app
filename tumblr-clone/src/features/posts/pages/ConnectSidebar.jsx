import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/hooks/useAuth";
import FollowButton from "../../../components/buttons/FollowButton.jsx";
import { Link } from "react-router-dom";
import { getAvatarUrl } from "../../../utils/avatarUtils";

export default function ConnectSidebar() {
    const { token, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            // Only show real users from the database
            if (Array.isArray(res.data) && res.data.length > 0) {
                // Limit to 5 users for the sidebar
                setUsers(res.data.slice(0, 5));
            } else {
                setUsers([]);
            }
        })
        .catch(err => {
            console.error("Error fetching users:", err);
            setUsers([]);
        })
        .finally(() => setLoading(false));
    }, [token]);

    // If user is not loaded yet, don't render the sidebar
    if (!user) return null;

    return (
        <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-4 mt-6 border border-[#2f2f2f] hover:border-[#363636] transition-colors">
            <h2 className="text-lg font-bold mb-6 text-[#ffffff]">Connect with them!</h2>
            
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
            ) : users.length > 0 ? (
                <div className="space-y-4">
                    {users.map(u => (
                        <div 
                            key={u._id} 
                            className="flex items-center justify-between group p-2 rounded-lg hover:bg-[#252525] transition-colors"
                        >
                            <div className="flex items-center flex-1 min-w-0">
                                <Link to={`/profile/${u._id}`} className="flex items-center flex-1 min-w-0">
                                    <img
                                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                                        alt={u.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-[#2f2f2f] group-hover:border-[#363636] transition-colors flex-shrink-0"
                                    />
                                    <span className="ml-3 text-[#ffffff] font-medium group-hover:text-blue-400 transition-colors truncate">
                                        {u.name}
                                    </span>
                                </Link>
                            </div>
                            <FollowButton
                                userId={u._id}
                                isFollowing={user?.following?.includes(u._id)}
                                token={token}
                                onFollowChange={() => {}}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                    No users to connect with yet
                </p>
            )}
        </div>
    );
}
