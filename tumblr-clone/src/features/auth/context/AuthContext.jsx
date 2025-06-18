import { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext();

// Improved helper function that doesn't log errors to console
const checkEndpointExists = async (url, token, method = 'get') => {
  try {
    // Use axios with interceptor to prevent logging to console
    const source = axios.CancelToken.source();
    const silentAxios = axios.create();
    
    // Intercept requests to prevent console errors for expected failures
    silentAxios.interceptors.request.use(config => {
      config.cancelToken = source.token;
      return config;
    });
    
    // Make the request based on method
    if (method === 'get') {
      await silentAxios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 2000
      });
    } else if (method === 'options') {
      // Options is safer for testing endpoints without side effects
      await silentAxios.options(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 2000
      });
    }
    
    return true;
  } catch (error) {
    // Don't log the error
    if (axios.isCancel(error)) {
      return false;
    }
    
    // Return true only for valid responses (not 404)
    return error.response && error.response.status !== 404;
  }
};

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
    const [loading, setLoading] = useState(true);
    const [followedUsers, setFollowedUsers] = useState([]);
    const [availableEndpoints, setAvailableEndpoints] = useState({
        me: null, // null = unchecked, true = available, false = unavailable
        profile: null,
        follow: null,
        unfollow: null
    });
    
    // Memoize the update user function to prevent it from causing re-renders
    const updateUser = useCallback((userData) => {
        const currentUser = JSON.parse(localStorage.getItem("user") || "null") || user;
        const updatedUser = { ...currentUser, ...userData };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Update the profile cache
        const profileData = JSON.parse(localStorage.getItem("userProfileCache") || "null") || {};
        const updatedCache = { 
            ...profileData,
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            profileBg: updatedUser.profileBg,
            bio: updatedUser.bio,
            website: updatedUser.website,
            location: updatedUser.location,
            themeColor: updatedUser.themeColor,
            name: updatedUser.name
        };
        localStorage.setItem("userProfileCache", JSON.stringify(updatedCache));
        
        return updatedUser;
    }, []);
    
    // Load saved profile from cache on startup - FIX: Run only once on mount, not when user changes
    useEffect(() => {
        const cachedProfile = JSON.parse(localStorage.getItem("userProfileCache") || "null");
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        
        if (cachedProfile && storedUser && storedUser._id === cachedProfile._id) {
            // Only apply cached profile if we haven't already
            const hasAppliedCache = localStorage.getItem("profileCacheApplied");
            
            if (!hasAppliedCache) {
                const mergedUser = { 
                    ...storedUser,
                    avatar: storedUser.avatar || cachedProfile.avatar,
                    profileBg: storedUser.profileBg || cachedProfile.profileBg,
                    bio: storedUser.bio || cachedProfile.bio,
                    website: storedUser.website || cachedProfile.website,
                    location: storedUser.location || cachedProfile.location,
                    themeColor: storedUser.themeColor || cachedProfile.themeColor
                };
                
                // Update state and localStorage without triggering re-renders
                localStorage.setItem("user", JSON.stringify(mergedUser));
                setUser(mergedUser);
                
                // Mark as applied to prevent duplicate operations
                localStorage.setItem("profileCacheApplied", "true");
            }
        }
    }, []); // Empty dependency array - only run once on mount
    
    // Clean up profileCacheApplied flag when component unmounts
    useEffect(() => {
        return () => {
            localStorage.removeItem("profileCacheApplied");
        };
    }, []);
    
    // Check API availability without console errors
    useEffect(() => {
        const checkApiAvailability = async () => {
            if (!token) return;
            
            // Use OPTIONS method for checking endpoint existence without errors
            const baseUrl = import.meta.env.VITE_API_URL;
            
            // Check endpoints in a way that doesn't generate console errors
            const results = {
                // For GET endpoints, use the real endpoint
                me: await checkEndpointExists(`${baseUrl}/api/auth/me`, token, 'get'),
                profile: await checkEndpointExists(`${baseUrl}/api/auth/profile`, token, 'options'),
                // For mutation endpoints, just check if the base path exists
                follow: await checkEndpointExists(`${baseUrl}/api/auth`, token, 'options'),
                unfollow: await checkEndpointExists(`${baseUrl}/api/auth`, token, 'options')
            };
            
            setAvailableEndpoints(results);
            console.info("API availability detected:", results);
        };
        
        if (token) {
            checkApiAvailability();
        }
    }, [token]);
    
    // Initialize auth state from localStorage
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user") || "null");
            const cachedProfile = JSON.parse(localStorage.getItem("userProfileCache") || "null");
            
            if (storedToken && storedUser) {
                try {
                    // Check if the /me endpoint exists before trying to use it
                    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/me`;
                    const endpointExists = await checkEndpointExists(apiUrl, storedToken);
                    
                    setAvailableEndpoints(prev => ({...prev, me: endpointExists}));
                    
                    // Only try to verify token if endpoint exists
                    if (endpointExists) {
                        try {
                            const response = await axios.get(apiUrl, {
                                headers: { Authorization: `Bearer ${storedToken}` }
                            });
                            
                            // Only update if we got valid data back
                            if (response.data) {
                                // Merge with storedUser and cachedProfile
                                const mergedUser = { 
                                    ...storedUser, 
                                    ...response.data,
                                    avatar: response.data.avatar || storedUser.avatar || (cachedProfile?.avatar),
                                    profileBg: response.data.profileBg || storedUser.profileBg || (cachedProfile?.profileBg),
                                    bio: response.data.bio ?? storedUser.bio ?? (cachedProfile?.bio),
                                    website: response.data.website ?? storedUser.website ?? (cachedProfile?.website),
                                    location: response.data.location ?? storedUser.location ?? (cachedProfile?.location),
                                    themeColor: response.data.themeColor || storedUser.themeColor || (cachedProfile?.themeColor || "#a1c4fd")
                                };
                                
                                setUser(mergedUser);
                                localStorage.setItem("user", JSON.stringify(mergedUser));
                                
                                // Update the userProfileCache
                                localStorage.setItem("userProfileCache", JSON.stringify({
                                    _id: mergedUser._id,
                                    avatar: mergedUser.avatar,
                                    profileBg: mergedUser.profileBg,
                                    bio: mergedUser.bio,
                                    website: mergedUser.website,
                                    location: mergedUser.location,
                                    themeColor: mergedUser.themeColor,
                                    name: mergedUser.name
                                }));
                            }
                        } catch (error) {
                            // Use fallback without logging errors
                            console.log('====================================');
                            console.log(error);
                            console.log('====================================');
                            console.info("API validation failed, using stored user data");
                            handleUserFallback(storedUser, cachedProfile);
                        }
                    } else {
                        // Use localStorage without logging errors
                        console.info("API endpoint '/api/auth/me' not available, using local data");
                        handleUserFallback(storedUser, cachedProfile);
                    }
                    
                    setToken(storedToken);
                    
                    // Load followed users from localStorage
                    const savedFollowedIds = JSON.parse(localStorage.getItem("followedUserIds") || "[]");
                    if (savedFollowedIds.length) {
                        setFollowedUsers(savedFollowedIds.map(id => ({ _id: id })));
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        
        // Helper function for when we need to fall back to localStorage
        const handleUserFallback = (storedUser, cachedProfile) => {
            if (cachedProfile && cachedProfile._id === storedUser._id) {
                const mergedUser = { 
                    ...storedUser,
                    avatar: storedUser.avatar || cachedProfile.avatar,
                    profileBg: storedUser.profileBg || cachedProfile.profileBg,
                    bio: storedUser.bio ?? cachedProfile.bio,
                    website: storedUser.website ?? cachedProfile.website,
                    location: storedUser.location ?? cachedProfile.location,
                    themeColor: storedUser.themeColor || cachedProfile.themeColor
                };
                setUser(mergedUser);
                localStorage.setItem("user", JSON.stringify(mergedUser));
            } else {
                setUser(storedUser);
            }
        };
        
        checkAuth();
    }, []);
    
    // Complete implementation of updateProfile function
    const updateProfile = async (data) => {
        try {
            // Skip API call if endpoint not available
            if (availableEndpoints.profile === false) {
                console.info("Profile API not available, using local storage only");
                return updateUser(data);
            }
            
            // Try the API
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/profile`;
            try {
                const response = await axios.put(apiUrl, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Update local storage with response data
                const updatedUser = {...response.data, ...data};
                return updateUser(updatedUser);
            } catch (apiError) {
                console.log('====================================');
                console.log(apiError);
                console.log('====================================');
                console.info("API profile update failed, using local storage");
                return updateUser(data);
            }
        } catch (error) {
            // Fallback to local update
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            console.info("Profile update error, using local storage fallback");
            return updateUser(data);
        }
    };
    
    // Login function
    const login = async (tokenOrCredentials, userData = null) => {
        try {
            let authToken, userObject;
            
            if (typeof tokenOrCredentials === 'string') {
                authToken = tokenOrCredentials;
                userObject = userData || user;
            } else {
                const { email, password } = tokenOrCredentials;
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, 
                    { email, password }
                );
                
                authToken = response.data.token;
                userObject = response.data.user;
                
                // Get cached profile data
                const cachedProfile = JSON.parse(localStorage.getItem("userProfileCache") || "null");
                
                // Merge with cached profile if available
                if (cachedProfile && cachedProfile._id === userObject._id) {
                    userObject = {
                        ...userObject,
                        avatar: userObject.avatar || cachedProfile.avatar,
                        profileBg: userObject.profileBg || cachedProfile.profileBg,
                        bio: userObject.bio ?? cachedProfile.bio,
                        website: userObject.website ?? cachedProfile.website,
                        location: userObject.location ?? cachedProfile.location,
                        themeColor: userObject.themeColor || cachedProfile.themeColor
                    };
                }
                
                // Update the profile cache
                const updatedCache = {
                    _id: userObject._id,
                    avatar: userObject.avatar,
                    profileBg: userObject.profileBg,
                    bio: userObject.bio,
                    website: userObject.website,
                    location: userObject.location,
                    themeColor: userObject.themeColor,
                    name: userObject.name
                };
                localStorage.setItem("userProfileCache", JSON.stringify(updatedCache));
            }
            
            // Save auth state
            localStorage.setItem("token", authToken);
            localStorage.setItem("user", JSON.stringify(userObject));
            
            setToken(authToken);
            setUser(userObject);
            
            // Reset profile cache flag on new login
            localStorage.removeItem("profileCacheApplied");
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Login failed" 
            };
        }
    };
    
    // Logout function
    const logout = () => {
        if (user) {
            const profileData = {
                _id: user._id,
                avatar: user.avatar,
                profileBg: user.profileBg,
                bio: user.bio,
                website: user.website,
                location: user.location,
                themeColor: user.themeColor,
                name: user.name
            };
            
            localStorage.setItem("userProfileCache", JSON.stringify(profileData));
        }
        
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("followedUserIds");
        localStorage.removeItem("profileCacheApplied");
        setToken(null);
        setUser(null);
        setFollowedUsers([]);
    };

    // Follow a user function
    const followUser = async (userId) => {
        if (!token || !userId) return false;
        
        try {
            if (availableEndpoints.follow) {
                try {
                    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/follow/${userId}`;
                    await axios.post(apiUrl, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {
                    console.log('====================================');
                    console.log(error);
                    console.log('====================================');
                    // Silently continue with localStorage approach
                    console.info("API follow failed, using local storage");
                }
            }
            
            // Update localStorage
            const followedIds = JSON.parse(localStorage.getItem("followedUserIds") || "[]");
            if (!followedIds.includes(userId)) {
                followedIds.push(userId);
                localStorage.setItem("followedUserIds", JSON.stringify(followedIds));
            }
            
            // Update in-memory state
            if (!followedUsers.some(u => u._id === userId)) {
                setFollowedUsers([...followedUsers, { _id: userId }]);
            }
            
            return true;
        } catch (error) {
            console.log(error);       
            console.info("Follow user error, using local storage fallback");
            return false;
        }
    };
    
    // Unfollow a user function
    const unfollowUser = async (userId) => {
        if (!token || !userId) return false;
        
        try {
            if (availableEndpoints.unfollow) {
                try {
                    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/unfollow/${userId}`;
                    await axios.post(apiUrl, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {
                    console.log(error);
                    // Silently continue with localStorage approach
                    console.info("API unfollow failed, using local storage");
                }
            }
            
            // Update localStorage
            const followedIds = JSON.parse(localStorage.getItem("followedUserIds") || "[]");
            const updatedIds = followedIds.filter(id => id !== userId);
            localStorage.setItem("followedUserIds", JSON.stringify(updatedIds));
            
            // Update in-memory state
            setFollowedUsers(followedUsers.filter(u => u._id !== userId));
            
            return true;
        } catch (error) {
            console.log(error);       
            console.info("Unfollow user error, using local storage fallback");
            return false;
        }
    };
    
    // Check if a user is followed
    const isUserFollowed = (userId) => {
        try {
            // First check in-memory state
            if (followedUsers && followedUsers.some(u => u._id === userId)) {
                return true;
            }
            
            // Then check localStorage as fallback
            const followedIds = JSON.parse(localStorage.getItem("followedUserIds") || "[]");
            return followedIds.includes(userId);
        } catch (e) {
            console.error("Error checking if user is followed:", e);
            return false;
        }
    };
    
    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            loading, 
            login, 
            logout,
            updateUser,
            updateProfile,
            isUserFollowed,
            followUser,
            unfollowUser,
            followedUsers,
            apiAvailable: availableEndpoints
        }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};