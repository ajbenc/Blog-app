import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  useLikePostMutation,
  useCommentPostMutation,
  useRepostPostMutation,
  useEditPostMutation
} from "../../../hooks/usePostsQuery";
import { FaHeart, FaRegCommentDots, FaRetweet, FaPencilAlt, FaTimes } from "react-icons/fa";

function getTumblrSimState(postId) {
  const data = JSON.parse(localStorage.getItem("tumblrSim") || "{}");
  return data[postId] || { likes: 0, likedBy: [], comments: [], reposts: 0, repostedBy: [] };
}
function setTumblrSimState(postId, state) {
  const data = JSON.parse(localStorage.getItem("tumblrSim") || "{}");
  data[postId] = state;
  localStorage.setItem("tumblrSim", JSON.stringify(data));
}

export default function PostCard({
    post,
    isTumblr = false,
}) {
    // Add debug logging
    console.log('Post Data:', {
        id: post._id || post.id,
        type: post.type,
        mediaFiles: post.mediaFiles,
        photos: post.photos,
        media: post.media, // Some Tumblr posts might use this
        isTumblr
    });

    const { token, user } = useAuth();
    const [showComment, setShowComment] = useState(false);
    const commentRef = useRef();

    // Add edit state
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [editTags, setEditTags] = useState(post.tags?.map(t => `#${t}`).join(" ") || "");

    // Simulated state for Tumblr posts
    const [sim, setSim] = useState(isTumblr ? getTumblrSimState(post.id) : {});

    // Like mutation
    const { mutate: likePost, isLoading: liking } = useLikePostMutation(token);
    const { mutate: commentPost } = useCommentPostMutation(token);
    const { mutate: repostPost } = useRepostPostMutation(token);
    const { mutate: editPost } = useEditPostMutation(token);

    // Handlers
    const handleLike = () => {
      if (!isTumblr) likePost(post._id);
      if (isTumblr) {
        const alreadyLiked = sim.likedBy?.includes(user?._id);
        const updated = {
          ...sim,
          likes: alreadyLiked ? sim.likes : sim.likes + 1,
          likedBy: alreadyLiked
            ? sim.likedBy
            : [...(sim.likedBy || []), user?._id]
        };
        setSim(updated);
        setTumblrSimState(post.id, updated);
      } 
    };
    const handleRepost = () => {
      if (!isTumblr) repostPost(post._id);
      if (isTumblr) {
        const alreadyReposted = sim.repostedBy?.includes(user?._id);
        const updated = {
          ...sim,
          reposts: alreadyReposted ? sim.reposts : sim.reposts + 1,
          repostedBy: alreadyReposted
            ? sim.repostedBy
            : [...(sim.repostedBy || []), user?._id]
        };
        setSim(updated);
        setTumblrSimState(post.id, updated);
      } 
    };
    const handleCommentToggle = () => setShowComment(prev => !prev);
    const handleCommentSubmit = (e) => {
      e.preventDefault();
      const text = commentRef.current.value.trim();
      if (text && !isTumblr) {
        commentPost({ postId: post._id, text });
        commentRef.current.value = '';
      }
      if (text && isTumblr) {
        const updated = {
          ...sim,
          comments: [
            ...sim.comments,
            { user: { name: user.name, avatar: user.avatar }, text }
          ]
        };
        setSim(updated);
        setTumblrSimState(post.id, updated);
        commentRef.current.value = '';
      }
    };

    // Edit handlers
    const handleEditSave = () => {
      if (!isTumblr) {
        const tagsArray = editTags
          .split(" ")
          .map(t => t.trim())
          .filter(t => t.startsWith("#"))
          .map(t => t.replace(/^#/, "").toLowerCase());
        editPost({ postId: post._id, data: { content: editContent, tags: tagsArray } });
        setEditing(false);
      }
      if (isTumblr) {
        const tagsArray = editTags
          .split(" ")
          .map(t => t.trim())
          .filter(t => t.startsWith("#"))
          .map(t => t.replace(/^#/, "").toLowerCase());
        onEdit(post._id, { content: editContent, tags: tagsArray });
        setEditing(false);
      }
    };

    // Tumblr post user info
    const tumblrUser = isTumblr
      ? { name: post.blog_name, avatar: post.blog?.avatar_url_64 || "https://ui-avatars.com/api/?name=" + encodeURIComponent(post.blog_name) }
      : post.user;

    // Tumblr post content
    const tumblrContent = isTumblr
      ? post.summary || post.caption?.replace(/<[^>]+>/g, "") || ""
      : post.content;

    // Update the renderMediaContent function for better media handling
    const renderMediaContent = () => {
      console.log('Rendering media for post:', post._id || post.id, {
        mediaUrl: post.mediaUrl, 
        mediaFiles: post.mediaFiles
      });

      // First priority: Check for mediaFiles array
      if (!isTumblr && post.mediaFiles && post.mediaFiles.length > 0) {
        return renderLocalMediaFiles(post.mediaFiles);
      }
      
      // Second priority: Check for single mediaUrl
      if (!isTumblr && post.mediaUrl) {
        return renderSingleMedia(post.mediaUrl);
      }
      
      // Third priority: Check for Tumblr photos
      if (isTumblr && post.photos?.[0]?.original_size?.url) {
        return (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={post.photos[0].original_size.url}
              alt=""
              className="w-full object-contain max-h-[80vh]"
              loading="lazy"
              // eslint-disable-next-line no-unused-vars
              onError={(e) => console.error('Failed to load Tumblr image')}
            />
          </div>
        );
      }
      
      return null;
    };

    // Helper function to render single media
    const renderSingleMedia = (url) => {
      const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      
      return (
        <div className="mb-4 rounded-lg overflow-hidden">
          {isImage ? (
            <img
              src={url}
              alt=""
              className="w-full object-contain max-h-[80vh]"
              loading="lazy"
              onError={(e) => {
                console.error('Media load error:', e);
                e.target.src = "https://via.placeholder.com/400x300?text=Image+Load+Error";
              }}
            />
          ) : (
            <video
              src={url}
              controls
              className="w-full object-contain max-h-[80vh]"
              onError={(e) => console.error('Video load error:', e)}
            />
          )}
        </div>
      );
    };

    // Helper function to render multiple media files
    const renderLocalMediaFiles = (mediaFiles) => {
      return (
        <div className="mb-4">
          {mediaFiles.length === 1 ? (
            renderSingleMedia(mediaFiles[0].url)
          ) : (
            <div className="grid gap-2 grid-cols-2">
              {mediaFiles.map((media, index) => {
                const isImage = media.type?.includes('image') || 
                               media.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                
                return (
                  <div 
                    key={index} 
                    className="relative rounded-lg overflow-hidden"
                  >
                    {isImage ? (
                      <img
                        src={media.url}
                        alt=""
                        className="w-full h-full object-cover rounded-lg aspect-square"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Grid image load error:', e);
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+Load+Error";
                        }}
                      />
                    ) : (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-full object-cover rounded-lg aspect-square"
                        onError={(e) => console.error('Grid video load error:', e)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    };

    // Enhanced debug logging
    useEffect(() => {
      console.log('PostCard rendered:', {
        id: post._id || post.id,
        content: post.content,
        mediaUrl: post.mediaUrl,
        mediaFiles: post.mediaFiles,
        type: post.type,
        isTumblr
      });
    }, [post, isTumblr]);

    return (
        <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-4 mb-4 border border-[#2f2f2f] hover:border-[#363636] transition-all duration-200 group">
            {/* Header with user info */}
            <div className="flex items-center mb-4">
              <img
                src={tumblrUser.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(tumblrUser.name || "User")}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2f2f2f] group-hover:border-[#363636] transition-colors"
              />
              <div className="ml-3">
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">{tumblrUser.name}</div>
                <div className="text-gray-400 text-sm">
                  {new Date(post.createdAt || post.timestamp * 1000).toLocaleString()}
                </div>
              </div>
              {/* Edit button */}
              {!isTumblr && user && post.user && user._id === post.user._id && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="ml-auto text-gray-400 hover:text-blue-400 transition-colors"
                  title="Edit post"
                >
                  <FaPencilAlt />
                </button>
              )}
            </div>

            {/* Edit form */}
            {editing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full bg-[#252525] border border-[#2f2f2f] rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:border-blue-500 hover:border-[#363636] transition-colors"
                  rows={3}
                />
                <input
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  className="w-full bg-[#252525] border border-[#2f2f2f] rounded-lg p-2 text-gray-100 placeholder-gray-400 focus:border-blue-500 hover:border-[#363636] transition-colors"
                  placeholder="#tag1 #tag2"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-[#252525] text-gray-300 px-4 py-2 rounded-lg hover:bg-[#363636] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-100 mb-4">{isTumblr ? tumblrContent : post.content}</p>
                
                {/* Media Display Section */}
                {renderMediaContent()}

                {/* Tags section */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-[#252525] text-gray-300 px-3 py-1 rounded-full text-sm border border-[#2f2f2f] hover:border-[#363636] transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Action buttons */}
            <div className="flex space-x-6 text-gray-400">
              <button onClick={handleLike} 
                className="flex items-center space-x-2 hover:text-pink-500 hover:scale-105 transition-all duration-200"
                disabled={liking}
              >
                <FaHeart className={isTumblr ? (sim.likes > 0 ? "text-pink-500" : "") : (post.likes.includes(user?._id) ? "text-pink-500" : "")} />
                <span>{isTumblr ? sim.likes : (post.likesCount ?? post.likes.length)}</span>
              </button>
              
              <button onClick={handleCommentToggle} 
                className="flex items-center space-x-2 hover:text-blue-500 hover:scale-105 transition-all duration-200">
                <FaRegCommentDots />
                <span>{isTumblr ? sim.comments.length : post.comments.length}</span>
              </button>
              
              <button onClick={handleRepost} 
                className="flex items-center space-x-2 hover:text-green-500 hover:scale-105 transition-all duration-200">
                <FaRetweet />
                <span>{isTumblr ? sim.reposts : (post.repostsCount ?? post.reposts.length)}</span>
              </button>
            </div>

            {/* Comments section */}
            {showComment && (
              <div className="mt-4 space-y-3">
                <form onSubmit={handleCommentSubmit}>
                  <input
                    ref={commentRef}
                    placeholder="Write a comment..."
                    className="w-full bg-[#252525] border border-[#2f2f2f] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-blue-500 hover:border-[#363636] transition-colors"
                  />
                </form>
                
                <div className="space-y-2">
                  {(isTumblr ? sim.comments : post.comments).map((c, i) => (
                    <div key={c._id || i} className="flex items-center space-x-2 p-2 rounded-lg bg-[#252525]">
                      <img
                        src={c.user?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(c.user?.name || "User")}
                        alt="avatar"
                        className="w-6 h-6 rounded-full border border-[#2f2f2f]"
                      />
                      <span className="font-medium text-white">{c.user?.name}</span>
                      <span className="text-gray-300">{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
    );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  isTumblr: PropTypes.bool,
};