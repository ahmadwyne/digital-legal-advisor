import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast.js';
import LogoSpinner from '@/components/ui/LogoSpinner';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginWithGoogle } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const error = searchParams.get('error');

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: error.replace(/_/g, ' '),
        });
        navigate('/login');
        return;
      }

      if (token && refreshToken) {
        const result = await loginWithGoogle(token, refreshToken);

        if (result.success) {
          toast({
            title: 'Success',
            description: 'Logged in successfully with Google!',
          });
          navigate(result.user?.role === 'admin' ? '/admin' : '/platform');
        } else {
          toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: 'Could not complete sign in. Please try again.',
          });
          navigate('/login');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Invalid authentication response',
        });
        navigate('/login');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <LogoSpinner size={56} />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">
          Completing authentication...
        </h2>
        <p className="text-gray-500 mt-2">Please wait while we log you in. </p>
      </div>
    </div>
  );
};

export default AuthCallback;