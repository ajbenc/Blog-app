import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.warn("useAuth must be used within an AuthProvider");
    return {
      user: null,
      token: null,
      loading: false,
      // Provide dummy functions that won't crash the app
      isUserFollowed: () => false,
      followUser: () => Promise.resolve(false),
      unfollowUser: () => Promise.resolve(false)
    };
  }
  
  return context;
}