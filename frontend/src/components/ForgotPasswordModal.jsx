import { useState } from 'react';
import { X, Loader2, Mail, ArrowRight } from 'lucide-react';
import { authApi } from '@/api/authApi';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/errorHandler';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      
      setIsSuccess(true);
      toast({
        title: 'Success',
        description: 'Password reset link sent! Please check your email.',
      });
      
      setTimeout(() => {
        handleClose();
      }, 5000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset state after animation
      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md relative border-2 border-white overflow-hidden">
        
        {/* Top Decorative Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-6 text-gray-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded-full"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {!isSuccess ? (
            <>
              <div className="mb-6">
                <h2
                  className="text-2xl font-black text-gray-800 mb-2"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Forgot Password?
                </h2>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: 'Inter' }}
                >
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-gray-700 text-sm font-bold mb-2"
                    style={{ fontFamily: 'Inter' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="reset-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 text-sm placeholder-gray-400"
                    placeholder="you@example.com"
                    style={{ fontFamily: 'Inter' }}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-base font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg overflow-hidden"
                  style={{ fontFamily: 'Inter' }}
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 animate-fade-in">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-100 shadow-inner">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
              <h3
                className="text-2xl font-black text-gray-800 mb-2"
                style={{ fontFamily: 'Poppins' }}
              >
                Check Your Email
              </h3>
              <p
                className="text-gray-600 text-sm px-4"
                style={{ fontFamily: 'Inter' }}
              >
                We've sent a password reset link to <br />
                <strong className="text-blue-600">{email}</strong>
              </p>
              
              <button 
                onClick={handleClose}
                className="mt-8 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
                style={{ fontFamily: 'Inter' }}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;