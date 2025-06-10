import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Fix: Use useEffect instead of useState for animation
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4">
      <div className={`w-full max-w-sm transition-all duration-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo - Tumblr style with capital B */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-[#3b82f6]">B</span>logMaster
          </h1>
          <p className="text-gray-400 text-sm mt-1">Share your thoughts with the world</p>
        </div>
        
        {/* Card container - More compact */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden">
          {/* Card header - Using gray tones */}
          <div className="bg-[#2a2a2a] p-4">
            <h2 className="text-xl font-bold text-white">Sign In</h2>
            <p className="text-gray-400 text-sm">Welcome back</p>
          </div>
          
          {/* Form */}
          <div className="p-5">
            <LoginForm />
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#3b82f6] hover:text-[#60a5fa] transition">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer - Simplified */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          &copy; 2025 BlogMaster
        </div>
      </div>
    </div>
  );
}