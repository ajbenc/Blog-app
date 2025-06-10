import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/hooks/useAuth";
import FollowButton from "../../../components/buttons/FollowButton.jsx";
import { Link } from "react-router-dom";

// Demo users for portfolio
const MOCK_USERS = [
  { _id: "demo1", name: "Demo User 1", avatar: "https://ui-avatars.com/api/?name=Demo+User+1" },
  { _id: "demo2", name: "Demo User 2", avatar: "https://ui-avatars.com/api/?name=Demo+User+2" },
];

export default function ConnectSidebar() {
    const { token, user } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("/api/auth/users", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (Array.isArray(res.data) && res.data.length > 0) {
                setUsers(res.data);
            } else {
                setUsers(MOCK_USERS);
            }
        })
        .catch(() => setUsers(MOCK_USERS));
    }, [token]);

    // If user is not loaded yet, don't render the sidebar
    if (!user) return null;

    return (
        <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-4 mt-6 border border-[#2f2f2f] hover:border-[#363636] transition-colors">
            <h2 className="text-lg font-bold mb-6 text-[#ffffff]">Connect with them!</h2>
            <div className="space-y-4">
                {users.map(u => (
                    <div 
                        key={u._id} 
                        className="flex items-center justify-between group p-2 rounded-lg hover:bg-[#252525] transition-colors"
                    >
                        <div className="flex items-center">
                            <Link to={`/profile/${u._id}`} className="flex items-center">
                                <img
                                    src={u.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name)}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#2f2f2f] group-hover:border-[#363636] transition-colors"
                                />
                                <span className="ml-3 text-[#ffffff] font-medium group-hover:text-blue-400 transition-colors">
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
        </div>
    );
}
