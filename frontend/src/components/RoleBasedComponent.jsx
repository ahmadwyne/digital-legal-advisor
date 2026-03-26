import { useAuth } from '@/hooks/useAuth';

const RoleBasedComponent = ({ allowedRoles = [], children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }

  return children;
};

export default RoleBasedComponent;