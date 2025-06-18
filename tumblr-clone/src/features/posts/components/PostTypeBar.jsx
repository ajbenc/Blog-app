import { useState } from 'react';
import { FaFont, FaImage, FaVideo, FaLink, FaQuoteLeft, FaCode } from 'react-icons/fa';
import PostFormModal from './PostFormModal';
import PropTypes from 'prop-types';

export default function PostTypeBar() {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("text");

  const handleTypeClick = (type) => {
    setSelectedType(type);
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-4 mb-6 border border-[#2f2f2f] hover:border-[#363636] transition-colors">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => handleTypeClick("text")}
            className="flex flex-col items-center p-4 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-[#252525]"
          >
            <FaFont size={24} />
            <span className="text-xs mt-1">Text</span>
          </button>
          
          <button 
            onClick={() => handleTypeClick("image")}
            className="flex flex-col items-center p-4 text-gray-400 hover:text-green-400 transition-colors rounded-lg hover:bg-[#252525]"
          >
            <FaImage size={24} />
            <span className="text-xs mt-1">Photo</span>
          </button>
          
          <button 
            onClick={() => handleTypeClick("video")}
            className="flex flex-col items-center p-4 text-gray-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-[#252525]"
          >
            <FaVideo size={24} />
            <span className="text-xs mt-1">Video</span>
          </button>
          
          <button 
            onClick={() => handleTypeClick("link")}
            className="flex flex-col items-center p-4 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-[#252525]"
          >
            <FaLink size={24} />
            <span className="text-xs mt-1">Link</span>
          </button>
          
          <button 
            onClick={() => handleTypeClick("quote")}
            className="flex flex-col items-center p-4 text-gray-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-[#252525]"
          >
            <FaQuoteLeft size={24} />
            <span className="text-xs mt-1">Quote</span>
          </button>
          
          <button 
            onClick={() => handleTypeClick("code")}
            className="flex flex-col items-center p-4 text-gray-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-[#252525]"
          >
            <FaCode size={24} />
            <span className="text-xs mt-1">Code</span>
          </button>
        </div>
      </div>
      
      {showModal && (
        <PostFormModal 
          initialType={selectedType}
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}

PostTypeBar.propTypes = {
  addPost: PropTypes.func.isRequired
};