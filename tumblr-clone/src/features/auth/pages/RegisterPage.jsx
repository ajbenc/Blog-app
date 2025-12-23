import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
      {/* Pixel-art background originally used on LoginPage */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Top navigation bar, mirroring login */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 sm:px-10 py-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-white flex items-center justify-center font-bold text-[#1f2937] text-lg">
            B
          </div>
          <span className="hidden sm:inline text-white font-semibold tracking-tight">BlogMaster</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-3 py-1 rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
          >
            Log in
          </Link>
          <span className="px-3 py-1 rounded-full bg-[#00cf35] text-black font-semibold">
            Sign up
          </span>
        </div>
      </header>

      {/* Center content */}
      <main className="relative z-10 w-full px-4">
        <div
          className={`mx-auto max-w-xl text-center transition-all duration-700 ${
            showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            <span className="text-[#3b82f6]">B</span>logMaster
          </h1>
          <p className="text-gray-200 text-sm sm:text-base max-w-md mx-auto mb-8">
            Join a cyber-styled space to share your ideas, follow inspiring creators, and build your own corner of the web.
          </p>

          {/* Translucent signup panel */}
          <section className="mx-auto max-w-md bg-white/5 border border-white/10 rounded-xl px-6 py-6 sm:px-8 sm:py-7 backdrop-blur-md shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
            <h2 className="text-xl font-semibold text-white mb-4 text-left">Create your account</h2>
            <RegisterForm />

            <div className="mt-5 text-center text-sm">
              <p className="text-gray-200">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#60a5fa] hover:text-[#93c5fd] font-medium transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </section>

          <footer className="mt-8 text-gray-400 text-[11px]">
            &copy; {new Date().getFullYear()} BlogMaster
          </footer>
        </div>
      </main>
    </div>
  );
}
