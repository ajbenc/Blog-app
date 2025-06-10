import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(form);
      
      if (result.success) {
        navigate('/feed');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-2 text-sm">
          <p className="text-red-400 flex items-center">
            <span className="mr-2">❌</span>
            {error}
          </p>
        </div>
      )}
      
      <div className="space-y-1">
        <label className="block text-gray-300 text-sm pl-1">Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaEnvelope className="text-gray-500" />
          </div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className="w-full bg-[#252525] border border-[#333] rounded-md pl-10 pr-3 py-2 text-gray-200 placeholder-gray-500 focus:border-[#444] focus:outline-none focus:ring-1 focus:ring-[#444]"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <label className="block text-gray-300 text-sm pl-1">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaLock className="text-gray-500" />
          </div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full bg-[#252525] border border-[#333] rounded-md pl-10 pr-3 py-2 text-gray-200 placeholder-gray-500 focus:border-[#444] focus:outline-none focus:ring-1 focus:ring-[#444]"
          />
        </div>
        <div className="flex justify-end">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-300">Forgot password?</a>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[#333] hover:bg-[#444] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center mt-2 ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </>
        ) : (
          <>
            <FaSignInAlt className="mr-2" />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}
