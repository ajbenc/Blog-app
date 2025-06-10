import { useRef, useState } from 'react';
import { FaImage, FaVideo, FaLink, FaFont, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

export default function PostForm({ onCreate }) {
  const [type, setType] = useState("text");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState(""); 

  const imageInputRef = useRef();
  const videoInputRef = useRef();

  // Handle file upload to backend and preview
  const handleFileChange = async (e, fileType) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    
    if (!files.length) return;
    
    setType(fileType); // Set the post type based on uploaded file type

    // Show local previews for all files
    const localUrls = files.map(file => URL.createObjectURL(file));
    console.log('Local preview URLs:', localUrls);
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
                if (!res.ok) {
                    throw new Error('Upload failed');
                }
                return res.json();
            });
        });

        const results = await Promise.all(uploadPromises);
        console.log('Upload results:', results);
        
        setMediaFiles(prev => {
            const newFiles = [...prev, ...results.map(r => ({
                url: r.url,
                type: fileType,
                originalName: r.originalName
            }))];
            console.log('Updated mediaFiles:', newFiles);
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

  // Use this for text content changes
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Fix the handleSubmit function
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
      
      // Create post data structure
      const postData = {
        type: mediaFiles.length > 0 ? mediaFiles[0].type : "text",
        content,
        tags: tagsArray
      };

      // IMPORTANT: Send mediaUrl as string (for backward compatibility)
      if (mediaFiles.length > 0) {
        postData.mediaUrl = mediaFiles[0].url;
        
        // Send mediaFiles properly (not as a string)
        postData.mediaFiles = mediaFiles;
      }

      console.log('Submitting post data:', postData);
      await onCreate(postData);

      // Reset form after successful creation
      setContent("");
      setMediaFiles([]);
      setPreviews([]);
      setType("text");
      setTags("");
      setError("");
    } catch (err) {
      console.error('Error creating post:', err);
      setError("Failed to create post: " + (err.message || "Unknown error"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-lg shadow-lg p-4 mb-6 border border-[#2f2f2f] hover:border-[#363636] transition-colors">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex space-x-4 mb-4">
        {/* Post type buttons */}
        <button
          type="button"
          className="p-2 rounded-full hover:bg-[#252525] text-gray-400 hover:text-blue-400 transition-colors"
          onClick={() => setType("text")}
        >
          <FaFont size={24} />
        </button>
        <button
          type="button"
          title="Upload Image"
          className="text-gray-500 hover:text-blue-500 transition"
          onClick={() => imageInputRef.current.click()}
        >
          <FaImage className="text-2xl" />
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
          title="Upload Video"
          className="text-gray-500 hover:text-purple-500 transition"
          onClick={() => videoInputRef.current.click()}
        >
          <FaVideo className="text-2xl" />
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
      
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="What's on your mind?"
        className="w-full bg-[#252525] border border-[#2f2f2f] rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 hover:border-[#363636] transition-colors"
        rows={3}
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
      {/* Enhanced Tags Input */}
      <div className="mt-4 mb-4">
        <div className="relative">
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Add tags with # (e.g. #art #music)"
            className="w-full bg-[#252525] border border-[#2f2f2f] rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:border-blue-500 hover:border-[#363636] transition-colors"
          />
          {tags.trim() && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button 
                type="button"
                onClick={() => setTags('')}
                className="text-gray-400 hover:text-gray-200 p-1"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
        </div>
        
        {/* Tag Preview - now in normal flow instead of absolute positioning */}
        {tags.trim() && (
          <div className="mt-2 p-2 bg-[#252525] rounded-lg border border-[#2f2f2f] animate-fadeIn">
            <div className="flex items-center mb-1">
              <p className="text-xs text-gray-400 mr-2">Tags Preview:</p>
              <p className="text-xs text-blue-400">{tags.split(/\s+/).filter(t => t.startsWith('#') && t.length > 1).length} tags</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.split(/\s+/).map((tag, i) => {
                if (tag.startsWith('#') && tag.length > 1) {
                  return (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-[#363636] text-blue-400 rounded-full text-xs flex items-center group cursor-pointer hover:bg-[#404040] transition-colors"
                      onClick={() => {
                        // Remove this tag
                        const newTags = tags
                          .split(/\s+/)
                          .filter((_, index) => index !== i)
                          .join(' ');
                        setTags(newTags);
                      }}
                    >
                      {tag}
                      <FaTimes size={8} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Click a tag to remove it</p>
          </div>
        )}
      </div>
      {/* Submit Button - now always visible */}
      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 w-full"
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
          ) : "Post"}
        </button>
      </div>
    </form>
  );
}

PostForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
};
