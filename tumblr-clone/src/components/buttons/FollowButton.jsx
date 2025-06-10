import { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import PropTypes from "prop-types";

export default function FollowButton({ userId, isFollowing: initialIsFollowing, onFollowChange }) {
    const auth = useAuth();
    const [following, setFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const [hovering, setHovering] = useState(false);

    // Safely check if the user is followed using the auth context
    useEffect(() => {
        // Make sure auth.isUserFollowed exists and is a function before calling it
        if (auth && typeof auth.isUserFollowed === 'function') {
            setFollowing(auth.isUserFollowed(userId) || initialIsFollowing);
        } else {
            // Fallback to the prop if the function doesn't exist
            setFollowing(initialIsFollowing);
        }
    }, [userId, initialIsFollowing, auth]);

    const handleFollow = async () => {
        setLoading(true);
        try {
            // Safely call followUser if it exists
            if (auth && typeof auth.followUser === 'function') {
                await auth.followUser(userId);
                setFollowing(true);
                if (onFollowChange) onFollowChange(true);
            }
        } catch (error) {
            console.error("Failed to follow:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async () => {
        setLoading(true);
        try {
            // Safely call unfollowUser if it exists
            if (auth && typeof auth.unfollowUser === 'function') {
                await auth.unfollowUser(userId);
                setFollowing(false);
                if (onFollowChange) onFollowChange(false);
            }
        } catch (error) {
            console.error("Failed to unfollow:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={following ? handleUnfollow : handleFollow}
            disabled={loading}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${following 
                    ? (hovering 
                        ? 'bg-red-900/30 text-red-400' 
                        : 'bg-[#454545] text-gray-300')
                    : 'bg-[#454545] text-white hover:bg-[#505050]'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
        >
            {loading 
                ? '...' 
                : (following 
                    ? (hovering ? 'Unfollow' : 'Following') 
                    : 'Follow')
            }
        </button>
    );
}

FollowButton.propTypes = {
    userId: PropTypes.string.isRequired,
    isFollowing: PropTypes.bool,
    onFollowChange: PropTypes.func
};

FollowButton.defaultProps = {
    isFollowing: false,
    onFollowChange: () => {}
};

