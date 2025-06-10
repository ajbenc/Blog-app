import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FaExclamationTriangle className="text-red-400 text-6xl mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/feed"
          className="px-6 py-3 bg-[#454545] text-white rounded-full hover:bg-[#505050] transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}