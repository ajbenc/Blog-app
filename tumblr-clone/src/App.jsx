import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { lazy, Suspense } from "react";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import PrivateLayout from "./components/layout/PrivateLayout";

// Auth guards
import PrivateRoute from "./components/guards/PrivateRoute";
import PublicRoute from "./components/guards/PublicRoute";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const DashboardPage = lazy(() => import("./features/posts/pages/DashboardPage"));
const FollowingPage = lazy(() => import("./features/posts/pages/FollowingPage"));
const ExplorePage = lazy(() => import("./features/posts/pages/ExplorePage"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage"));
const SearchPage = lazy(() => import("./features/posts/pages/SearchPage"));
const NotFoundPage = lazy(() => import("./components/common/NotFoundPage"));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            </Route>

            {/* Private routes - always check authentication first */}
            <Route path="/" element={<PrivateRoute><PrivateLayout /></PrivateRoute>}>
              <Route path="feed" element={<DashboardPage />} />
              <Route path="following" element={<FollowingPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/:userId" element={<ProfilePage />} />
              <Route path="search" element={<SearchPage />} />
            </Route>

            {/* Redirect / to /feed if logged in, otherwise to /login */}
            <Route path="/" element={<Navigate to="/feed" replace />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}