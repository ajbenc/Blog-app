import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; // {token, user}
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// Updated to handle both API and localStorage
export const updateProfile = async (data, token) => {
    try {
        // Try the API first
        const response = await api.put('/auth/profile', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update localStorage with API response
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (storedUser) {
            const updatedUser = { ...storedUser, ...data, ...response.data };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        
        return response.data;
    } catch (error) {
        // If API fails, update localStorage directly
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        if (storedUser) {
            const updatedUser = { ...storedUser, ...data };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            // Return the updated user as if it came from the API
            return updatedUser;
        }
        
        console.error("Profile update error:", error);
        throw error;
    }
};

// Updated to handle alternative methods if API fails
export const uploadMedia = async (file, token) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await api.post('/auth/avatar', formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' 
            }
        });
        
        return response.data;
    } catch (error) {
        console.warn("Media upload API error - using file reader instead:", error);
        
        // Return a Promise that resolves when the FileReader is done
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve({ url: event.target.result });
            };
            reader.readAsDataURL(file);
        });
    }
};