/**
 * Get a valid avatar URL with fallback to UI Avatars
 * @param {string} avatarUrl - The user's avatar URL
 * @param {string} name - The user's name for fallback
 * @returns {string} - Valid avatar URL
 */
export const getAvatarUrl = (avatarUrl, name = 'User') => {
  // If avatar exists and is not the old broken default, use it
  if (avatarUrl && avatarUrl !== 'https://example.com/default-avatar.png' && !avatarUrl.includes('example.com')) {
    return avatarUrl;
  }
  
  // Fallback to UI Avatars with proper encoding
  const encodedName = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&size=128`;
};
