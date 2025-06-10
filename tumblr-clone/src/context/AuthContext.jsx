import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token") || '');

    // Fetch user profile from backend
    const fetchProfile = async (jwt) => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/auth/profile`,
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            setUser(data);
            console.log("AuthContext: fetched user profile", data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile(token);
            localStorage.setItem("token", token);
        } else {
            setUser(null);
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };
    const logout = () => setToken('');
    const updateUser = (userData) => {
        console.log("AuthContext: updateUser called", userData);
        setUser(userData);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}