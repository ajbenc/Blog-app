import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth.js";
import { useState, useEffect } from "react";
import { FaSearch, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export default function PrivateLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(null); // Initialize as null instead of empty string
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Update avatar URL whenever user changes - with improved fallbacks
    useEffect(() => {
        if (user?.avatar && user.avatar.trim() !== "") {
            setAvatarUrl(user.avatar);
        } else if (user?.name && user.name.trim() !== "") {
            setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`);
        } else {
            setAvatarUrl(`https://ui-avatars.com/api/?name=User`);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const onSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?query=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-black">
            {/* Top Navigation */}
            <nav className="bg-[#131313] border-b border-[#2f2f2f] shadow-lg sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div 
                            className="text-xl sm:text-2xl font-bold cursor-pointer text-white flex-shrink-0" 
                            onClick={() => navigate('/feed')}
                        >
                            BlogMaster
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-4">
                            <NavLink
                                to="/feed"
                                className={({ isActive }) =>
                                    `px-3 py-1 rounded text-gray-300 ${isActive ? 'bg-[#252525] text-white' : 'hover:bg-[#252525]'}`
                                }
                            >
                                For You
                            </NavLink>
                            <NavLink
                                to="/following"
                                className={({ isActive }) =>
                                    `px-3 py-1 rounded text-gray-300 ${isActive ? 'bg-[#252525] text-white' : 'hover:bg-[#252525]'}`
                                }
                            >
                                Following
                            </NavLink>
                            <NavLink
                                to="/explore"
                                className={({ isActive }) =>
                                    `px-3 py-1 rounded text-gray-300 ${isActive ? 'bg-[#252525] text-white' : 'hover:bg-[#252525]'}`
                                }
                            >
                                Explore
                            </NavLink>
                        </div>

                        {/* Desktop Search Bar */}
                        <form onSubmit={onSearchSubmit} className="hidden md:flex flex-1 mx-4 max-w-md">
                            <div className="relative w-full">
                                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search posts..."
                                    className="w-full bg-[#252525] border border-[#2f2f2f] rounded-full px-10 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-[#363636] transition-colors"
                                />
                            </div>
                        </form>

                        {/* Desktop Profile / Logout */}
                        <div className="hidden md:flex items-center space-x-4">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl} 
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-[#2f2f2f] hover:border-[#363636] transition cursor-pointer"
                                    onClick={() => navigate('/profile')}
                                />
                            ) : (
                                <FaUserCircle 
                                    className="w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-300 transition"
                                    onClick={() => navigate('/profile')}
                                />
                            )}
                            <button 
                                onClick={handleLogout} 
                                className="text-gray-300 hover:text-white hover:underline transition"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white text-2xl p-2"
                        >
                            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                    {/* Mobile Search Bar */}
                    <form onSubmit={onSearchSubmit} className="md:hidden mt-3">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search posts..."
                                className="w-full bg-[#252525] border border-[#2f2f2f] rounded-full px-10 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </form>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 pb-3 border-t border-[#2f2f2f] pt-3">
                            <div className="flex flex-col space-y-2">
                                <NavLink
                                    to="/feed"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded text-gray-300 ${isActive ? 'bg-[#252525] text-white' : 'hover:bg-[#252525]'}`
                                    }
                                >
                                    For You
                                </NavLink>
                                <NavLink
                                    to="/following"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded text-gray-300 ${isActive ? 'bg-[#252525] text-white' : 'hover:bg-[#252525]'}`
                                    }
                                >
                                    Following
                                </NavLink>
                                <NavLink
                                    to="/explore"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded text-gray-300 ${isActive ? 'bg-[#252525] text-white' : 'hover:bg-[#252525]'}`
                                    }
                                >
                                    Explore
                                </NavLink>
                                <NavLink
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded text-gray-300 flex items-center gap-2 ${isActive ? 'bg-[#252525] text-white' : 'hover:bg-[#252525]'}`
                                    }
                                >
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl} 
                                            alt="avatar"
                                            className="w-6 h-6 rounded-full object-cover border-2 border-[#2f2f2f]"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-6 h-6" />
                                    )}
                                    Profile
                                </NavLink>
                                <button 
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="px-4 py-2 rounded text-left text-gray-300 hover:bg-[#252525] hover:text-white transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow bg-black text-gray-100">
                <Outlet />
            </main>
        </div>
    );
}