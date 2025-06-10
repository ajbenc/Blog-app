import { useRef, useState, useEffect } from 'react';
import { FaImage, FaVideo, FaLink, FaFont, FaTimes, FaChevronDown } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useAuth } from '../../auth/hooks/useAuth';

export default function PostFormModal({ initialType, onClose, addPost }) {
  const { user } = useAuth();
  
  const [type, setType] = useState(initialType || "text");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState(""); 
  const [privacy, setPrivacy] = useState("everyone");

  const modalRef = useRef();
  const imageInputRef = useRef();
  const videoInputRef = useRef();

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // File upload handler
  const handleFileChange = async (e, fileType) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setType(fileType);
    
    const localUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...localUrls]);

    setUploading(true);
    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('avatar', file);
        return fetch(`${import.meta.env.VITE_API_URL}/api/posts/upload`, {
          method: 'POST',
          body: formData,
        }).then(res => {
          if (!res.ok) throw new Error('Upload failed');
          return res.json();
        });
      });

      const results = await Promise.all(uploadPromises);
      
      setMediaFiles(prev => {
        const newFiles = [...prev, ...results.map(r => ({
          url: r.url,
          type: fileType,
          originalName: r.originalName
        }))];
        return newFiles;
      });
    } catch (err) {
      console.error('Error uploading files:', err);
      setError("Upload failed: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (type === "text" && !content.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    try {
      const tagsArray = tags
        .split(/\s+/)
        .map(t => t.trim())
        .filter(t => t.startsWith("#") || t.length > 0)
        .map(t => t.startsWith("#") ? t.replace(/^#/, "") : t)
        .filter(t => t.length > 0);
      
      const postData = {
        type: mediaFiles.length > 0 ? mediaFiles[0].type : "text",
        content,
        tags: tagsArray
      };

      if (mediaFiles.length > 0) {
        postData.mediaUrl = mediaFiles[0].url;
        postData.mediaFiles = mediaFiles;
      }

      await addPost(postData);
      onClose();
    } catch (err) {
      console.error('Error creating post:', err);
      setError("Failed to create post: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-[#1a1a1a] rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-[#2f2f2f]">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || "User"}`} 
              alt={user?.name || "User"} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white font-medium">{user?.name || "User"}</div>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
            
            {/* Post type bar */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`p-2 rounded-full ${type === "text" ? "text-blue-400" : "text-gray-500 hover:text-blue-400"} transition-colors`}
                onClick={() => setType("text")}
              >
                <FaFont size={24} />
              </button>
              <button
                type="button"
                className={`p-2 rounded-full ${type === "image" ? "text-green-400" : "text-gray-500 hover:text-green-400"} transition-colors`}
                onClick={() => imageInputRef.current.click()}
              >
                <FaImage size={24} />
              </button>
              <input
                type="file"
                accept="image/*,.gif"
                multiple
                ref={imageInputRef}
                className="hidden"
                onChange={e => handleFileChange(e, "image")}
              />
              <button
                type="button"
                className={`p-2 rounded-full ${type === "video" ? "text-purple-400" : "text-gray-500 hover:text-purple-400"} transition-colors`}
                onClick={() => videoInputRef.current.click()}
              >
                <FaVideo size={24} />
              </button>
              <input
                type="file"
                accept="video/*"
                multiple
                ref={videoInputRef}
                className="hidden"
                onChange={e => handleFileChange(e, "video")}
              />
            </div>
            
            {/* Content input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Go ahead, put anything."
              className="w-full bg-transparent border-none outline-none text-gray-100 placeholder-gray-500 text-lg min-h-[120px] resize-none"
              autoFocus
            />
            
            {/* Preview grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    {mediaFiles[index]?.type === "image" ? (
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full rounded-lg object-contain max-h-96"
                      />
                    ) : (
                      <video
                        src={preview}
                        controls
                        className="w-full rounded-lg object-contain max-h-96"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Tags input */}
            <div className="mt-4 py-2 border-t border-[#2f2f2f]">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="#add tags"
                className="w-full bg-transparent border-none outline-none text-gray-400 text-sm"
              />
              
              {tags.trim() && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.split(/\s+/).map((tag, i) => {
                    if (tag.startsWith('#') && tag.length > 1) {
                      return (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-[#252525] text-blue-400 rounded-full text-xs flex items-center group cursor-pointer hover:bg-[#303030]"
                          onClick={() => {
                            const newTags = tags
                              .split(/\s+/)
                              .filter((_, index) => index !== i)
                              .join(' ');
                            setTags(newTags);
                          }}
                        >
                          {tag}
                          <FaTimes size={8} className="ml-1 opacity-0 group-hover:opacity-100" />
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Footer with actions */}
          <div className="p-3 flex items-center justify-between border-t border-[#2f2f2f]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#252525] text-gray-300 hover:bg-[#303030]"
            >
              Close
            </button>
            
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-[#252525] text-gray-300 hover:bg-[#303030] flex items-center"
                >
                  <span>For {privacy === "everyone" ? "Everyone" : "Following"}</span>
                  <FaChevronDown size={12} className="ml-2" />
                </button>
                
                <div className="absolute bottom-full mb-2 right-0 bg-[#252525] rounded-lg shadow-xl p-2 hidden group-hover:block">
                  <button 
                    type="button"
                    onClick={() => setPrivacy("everyone")}
                    className={`block w-full text-left px-3 py-2 rounded ${privacy === "everyone" ? "bg-[#303030]" : "hover:bg-[#303030]"}`}
                  >
                    Everyone
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPrivacy("following")}
                    className={`block w-full text-left px-3 py-2 rounded ${privacy === "following" ? "bg-[#303030]" : "hover:bg-[#303030]"}`}
                  >
                    Following
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#454545] text-white hover:bg-[#555555] flex items-center gap-1"
                disabled={uploading}
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <>
                    Post now <FaChevronDown size={10} className="ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

PostFormModal.propTypes = {
  initialType: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired
};