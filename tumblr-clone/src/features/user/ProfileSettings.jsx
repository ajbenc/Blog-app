import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import axios from "axios";
import { uploadMedia } from "../auth/services/authService";

export default function ProfileSettings({ user }) {
    const { token, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        website: "",
        location: "",
        themeColor: "#a1c4fd",
        avatar: "",
        profileBg: "",
    });
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef();
    const bgInputRef = useRef();

    // Initialize form from user prop when it changes
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                password: "",
                bio: user.bio || "",
                website: user.website || "",
                location: user.location || "",
                themeColor: user.themeColor || "#a1c4fd",
                avatar: user.avatar || "",
                profileBg: user.profileBg || "",
            });
            console.log("ProfileSettings: initialized with user data", user);
        }
    }, [user]);

    // Avatar upload handler with improved data handling
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            // Try using the service function
            const result = await uploadMedia(file, token);
            if (result && result.url) {
                // Update local form state
                setForm(f => ({ ...f, avatar: result.url }));
                // Update user context immediately to ensure avatar shows up in navbar
                updateUser({ avatar: result.url });
                return;
            }
            
            // Fallback to direct file handling if the service fails
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                // Update local form state
                setForm(f => ({ ...f, avatar: dataUrl }));
                // Update user context immediately to ensure avatar shows up in navbar
                updateUser({ avatar: dataUrl });
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("Error uploading avatar", err);
            setError("Error uploading avatar");
        }
    };

    // Profile background upload handler with immediate update
    const handleBgChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            // Try using the service function
            const result = await uploadMedia(file, token);
            if (result && result.url) {
                // Update local form state
                setForm(f => ({ ...f, profileBg: result.url }));
                // Update user context immediately
                updateUser({ profileBg: result.url });
                return;
            }
            
            // Fallback to direct file handling if the service fails
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                // Update local form state
                setForm(f => ({ ...f, profileBg: dataUrl }));
                // Update user context immediately 
                updateUser({ profileBg: dataUrl });
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("Error uploading background", err);
            setError("Error uploading background");
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // Immediately update theme color for real-time preview
        if (name === 'themeColor') {
            updateUser({ themeColor: value });
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(""); 
        setSuccess("");
        
        if (form.password && form.password !== passwordConfirm) {
            setError("Passwords do not match.");
            return;
        }
        
        try {
            // Only include non-empty fields in the update
            const updateData = {};
            Object.entries(form).forEach(([key, value]) => {
                // Include empty string values for bio, website, location to allow clearing them
                // Include avatar, profileBg, themeColor even if they're empty
                if (
                    value !== "" || 
                    key === "avatar" || 
                    key === "profileBg" || 
                    key === "themeColor" ||
                    key === "bio" ||
                    key === "website" ||
                    key === "location"
                ) {
                    updateData[key] = value;
                }
            });

            // Don't send empty password
            if (!updateData.password) {
                delete updateData.password;
            }

            try {
                // Try to update via API
                const response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/auth/profile`, 
                    updateData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("API update successful:", response.data);
            } catch (apiError) {
                console.warn("API profile update failed, using local storage only", apiError);
            }
            
            // Always update user in context, even if API fails
            updateUser(updateData);
            
            setSuccess("Settings updated!");
            setForm(prev => ({ ...prev, password: "" })); // Clear password field
            setPasswordConfirm("");
            
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data?.message || "Error updating profile");
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
                {/* Notifications */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-fadeIn">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 animate-fadeIn">
                        <p className="text-green-400 text-sm">{success}</p>
                    </div>
                )}

                {/* Header background preview and upload */}
                <div className="group relative">
                    <label className="block mb-2 text-gray-300 font-medium">Header Background</label>
                    <div
                        className="h-32 w-full rounded-lg mb-3 overflow-hidden"
                        style={{
                            background: form.profileBg
                                ? `url(${form.profileBg}) center/cover no-repeat`
                                : form.themeColor
                                ? form.themeColor
                                : "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
                        }}
                    >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center h-full bg-black/50">
                            <button
                                type="button"
                                className="bg-[#252525] text-gray-200 px-4 py-2 rounded-lg hover:bg-[#363636] hover:scale-105 transition-all duration-200"
                                onClick={() => bgInputRef.current.click()}
                            >
                                Change Background
                            </button>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={bgInputRef}
                        onChange={handleBgChange}
                        className="hidden"
                    />
                </div>

                {/* Avatar preview and upload */}
                <div className="flex items-center group relative">
                    <div className="relative">
                        <img
                            src={form.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(form.name || "User")}
                            alt="avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-[#252525] shadow-lg group-hover:border-[#363636] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <span className="text-white text-sm">Change</span>
                        </button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="space-y-4">
                        {[
                            { label: "Username", name: "name", type: "text" },
                            { label: "Email", name: "email", type: "email" },
                            { label: "New Password", name: "password", type: "password" },
                            { label: "Confirm Password", name: "passwordConfirm", type: "password", value: passwordConfirm, onChange: e => setPasswordConfirm(e.target.value) },
                            { label: "Bio", name: "bio", type: "textarea" },
                            { label: "Website", name: "website", type: "text" },
                            { label: "Location", name: "location", type: "text" }
                        ].map(field => (
                            <div key={field.name}>
                                <label className="block mb-1.5 text-gray-300 text-sm font-medium">
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        name={field.name}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full bg-[#252525] border border-[#2f2f2f] rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:border-blue-500 hover:border-[#363636] transition-colors"
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={field.value !== undefined ? field.value : form[field.name]}
                                        onChange={field.onChange || handleChange}
                                        className="w-full bg-[#252525] border border-[#2f2f2f] rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:border-blue-500 hover:border-[#363636] transition-colors"
                                    />
                                )}
                            </div>
                        ))}

                        {/* Theme Color picker */}
                        <div>
                            <label className="block mb-1.5 text-gray-300 text-sm font-medium">
                                Theme Color
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    name="themeColor"
                                    value={form.themeColor}
                                    onChange={handleChange}
                                    className="h-10 w-20 bg-[#252525] border border-[#2f2f2f] rounded-lg cursor-pointer hover:border-[#363636] transition-colors"
                                />
                                <div 
                                    className="h-10 w-10 rounded-lg border border-[#2f2f2f]"
                                    style={{ backgroundColor: form.themeColor }}
                                />
                                <span className="text-gray-400 text-sm">Preview</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 hover:scale-105 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}