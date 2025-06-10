import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4">
      <div className={`w-full max-w-sm transition-all duration-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Tumblr-style logo */}
        <div className="text-center mb-6">

          <h1 className="text-2xl font-bold text-white">
            <span className="text-[#3b82f6]">B</span>logMaster
          </h1>
          <p className="text-gray-400 text-sm mt-1">Join our creative community</p>
        </div>
        
        {/* Card container */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden">
          {/* Card header */}
          <div className="bg-[#2a2a2a] p-4">
            <h2 className="text-xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 text-sm">Start your journey</p>
          </div>
          
          {/* Form */}
          <div className="p-5">
            <RegisterForm />
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-[#3b82f6] hover:text-[#60a5fa] transition">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Features - More compact */}
        <div className="mt-6 flex gap-3 text-xs">
          <div className="flex-1 bg-[#1a1a1a] p-3 rounded-md">
            <h3 className="font-medium text-[#3b82f6]">📝 Express Yourself</h3>
            <p className="text-gray-400">Share your thoughts</p>
          </div>
          <div className="flex-1 bg-[#1a1a1a] p-3 rounded-md">
            <h3 className="font-medium text-[#3b82f6]">🌐 Connect</h3>
            <p className="text-gray-400">Follow others</p>
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
