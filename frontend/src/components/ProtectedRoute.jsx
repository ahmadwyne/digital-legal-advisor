import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LogoSpinner from '@/components/ui/LogoSpinner';

const ProtectedRoute = ({ children, allowAdminAccess = true }) => {
  const { isAuth, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LogoSpinner size={56} />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // If admin and this route doesn't allow admin access, redirect to admin dashboard
  if (! allowAdminAccess && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;