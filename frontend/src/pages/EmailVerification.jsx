import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { authApi } from '@/api/authApi';
import { useToast } from '@/hooks/use-toast.js';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const hasVerified = useRef(false); // ← Prevent double execution

  useEffect(() => {
    const verifyEmail = async () => {
      // ← PREVENT DOUBLE REQUEST
      if (hasVerified.current) return;
      hasVerified.current = true;

      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        toast({
          variant: 'destructive',
          title: 'Invalid Link',
          description: 'Verification token is missing',
        });
        return;
      }

      try {
        await authApi.verifyEmail(token);
        setStatus('success');
        toast({
          title: 'Success',
          description: 'Email verified successfully!',
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: error.response?.data?.message || 'Invalid or expired verification token',
        });
      }
    };

    verifyEmail();
  }, []); // ← Empty dependency array + useRef prevents double call

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-xl p-12 max-w-md w-full text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-[#29473E] mx-auto mb-6" />
              <h1
                className="text-2xl font-bold text-[#44444E] mb-2"
                style={{ fontFamily: 'Roboto Mono' }}
              >
                Verifying Your Email
              </h1>
              <p
                className="text-gray-600"
                style={{ fontFamily: 'Noto Sans' }}
              >
                Please wait while we verify your email address... 
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1
                className="text-2xl font-bold text-[#44444E] mb-2"
                style={{ fontFamily: 'Roboto Mono' }}
              >
                Email Verified!
              </h1>
              <p
                className="text-gray-600 mb-6"
                style={{ fontFamily:  'Noto Sans' }}
              >
                Your email has been successfully verified.  Redirecting to login...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1
                className="text-2xl font-bold text-[#44444E] mb-2"
                style={{ fontFamily: 'Roboto Mono' }}
              >
                Verification Failed
              </h1>
              <p
                className="text-gray-600 mb-6"
                style={{ fontFamily: 'Noto Sans' }}
              >
                The verification link is invalid or has expired. 
              </p>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#29473E] text-white px-6 py-2 rounded-lg hover:bg-[#1f3630] transition-colors"
                style={{ fontFamily: 'Noto Sans' }}
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;