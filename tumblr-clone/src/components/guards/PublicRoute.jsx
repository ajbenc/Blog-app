import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import PropTypes from "prop-types";

export default function PublicRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (token) {
    return <Navigate to="/feed" replace />;
  }
  
  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};