import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { authApi } from "@/api/authApi";
import { showToast, validationMessages } from "@/utils/toast";
import { getErrorMessage, getErrorStatus } from "@/utils/errorHandler";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useAuthRedirect('/platform');

  /**
   * Validate email format
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Basic validation before sending to backend
   */
  const validateForm = () => {
    // Check if email is empty
    if (!email. trim()) {
      showToast. error(validationMessages.email. required);
      return false;
    }

    // Check if email format is valid
    if (!validateEmail(email. trim())) {
      showToast.error(validationMessages. email.invalid);
      return false;
    }

    // Check if password is empty
    if (!password) {
      showToast.error(validationMessages.password.required);
      return false;
    }

    return true;
  };

  /**
   * Handle different types of login errors from backend
   */
  const handleLoginError = (error) => {
    const errorMessage = getErrorMessage(error);
    const errorStatus = getErrorStatus(error);
    const errorLower = errorMessage?. toLowerCase() || '';

    console.log('🔴 Login Error:', {
      status: errorStatus,
      message:  errorMessage,
      fullError: error
    });

    // Priority 1: Check for "Invalid credentials" message
    if (errorLower. includes('invalid credentials')) {
      showToast.error('Invalid email or password.  Please check your credentials and try again.');
      return;
    }

    // Priority 2: Handle by status code
    switch (errorStatus) {
      case 400:
        // Bad Request - validation errors
        if (errorLower.includes('email') && errorLower.includes('valid')) {
          showToast. error(validationMessages.email.invalid);
        } else if (errorLower.includes('email') && errorLower.includes('required')) {
          showToast. error(validationMessages.email. required);
        } else if (errorLower.includes('password') && errorLower.includes('required')) {
          showToast.error(validationMessages.password.required);
        } else {
          showToast.error(errorMessage || 'Invalid request.  Please check your inputs.');
        }
        break;

      case 401:
        // Unauthorized
        if (errorLower.includes('inactive') || errorLower.includes('no longer exists')) {
          showToast. error('Your account has been deactivated. Please contact support.');
        } else {
          showToast.error('Invalid email or password. Please try again.');
        }
        break;

      case 403:
        // Forbidden
        showToast.error('Your account has been suspended. Please contact support.');
        break;

      case 404:
        // Not Found
        showToast.error('No account found with this email address.');
        break;

      case 500:
      case 502:
      case 503:
        // Server errors
        showToast.error(validationMessages.general.serverError);
        break;

      default:
        // Handle by message content
        if (errorLower. includes('please sign in with')) {
          const provider = errorMessage. match(/with (\w+)/)?.[1] || 'Google';
          showToast.error(`This account uses ${provider} sign-in. Please use the "Continue with ${provider}" button.`);
        } else if (errorLower.includes('network') || errorLower.includes('fetch failed') || error?. code === 'ERR_NETWORK') {
          showToast.error(validationMessages.general.networkError);
        } else if (errorMessage) {
          showToast.error(errorMessage);
        } else {
          showToast.error(validationMessages.auth.loginFailed);
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email. trim(), password);

      if (result.success) {
        showToast.success(validationMessages.auth.loginSuccess);
        
        // Small delay for toast to show
        setTimeout(() => {
          // Redirect based on user role
          if (result.user?. role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/platform');
          }
        }, 500);
      } else {
        // Handle error from AuthContext
        handleLoginError(result.error);
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      authApi.googleLogin();
    } catch (error) {
      showToast.error('Failed to initiate Google login.  Please try again.');
    }
  };

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content - Split Screen */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-95px)] mt-[75px]">
        {/* Left Panel - Login Form */}
        <div className="w-full lg:w-[50%] flex items-center justify-center bg-gray-50 px-4 sm:px-8 py-4">
          <div className="w-full max-w-md">
            {/* Login Title */}
            <h1
              className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-[#44444E] text-center mb-3"
              style={{ fontFamily: "Roboto Mono" }}
            >
              Login
            </h1>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 lg:gap-4 mb-5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span
                  className="text-[#44444E] text-sm sm:text-base lg:text-lg font-normal whitespace-nowrap"
                  style={{ fontFamily: "Ropa Sans" }}
                >
                  AI Legal Help
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span
                  className="text-[#44444E] text-sm sm:text-base lg:text-lg font-normal whitespace-nowrap"
                  style={{ fontFamily: "Ropa Sans" }}
                >
                  24/7 Support
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span
                  className="text-[#44444E] text-sm sm:text-base lg:text-lg font-normal whitespace-nowrap"
                  style={{ fontFamily: "Ropa Sans" }}
                >
                  Data Privacy
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[#666666] text-sm lg:text-md font-semibold mb-1. 5"
                  style={{ fontFamily: "Noto Sans" }}
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full lg:w-[95%] px-3.5 py-2.5 bg-white border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:ring-2 focus:ring-[#29473E]/10 focus:outline-none transition-all text-gray-700 text-sm placeholder-gray-400"
                  placeholder="Enter email"
                  style={{ fontFamily: "Noto Sans" }}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[#666666] text-sm lg:text-md font-semibold mb-1.5"
                  style={{ fontFamily: "Noto Sans" }}
                >
                  Password
                </label>
                <div className="relative w-full lg:w-[95%]">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:ring-2 focus:ring-[#29473E]/10 focus:outline-none transition-all text-gray-700 text-sm placeholder-gray-400"
                    placeholder="Enter Password"
                    style={{ fontFamily: "Noto Sans" }}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#29473E] transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ?  (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end pt-0.5 w-full lg:w-[95%]">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[#666666] text-sm lg:text-md font-semibold hover:text-[#29473E] transition-colors"
                  style={{ fontFamily:  "Noto Sans" }}
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full lg:w-[95%] bg-[#29473E] text-white py-2.5 rounded-lg text-base font-medium hover:bg-[#1f3630] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: "Noto Sans" }}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4 w-full lg:w-[95%]">
              <div className="flex-1 border-t-2 border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full lg:w-[95%] bg-white border-2 border-gray-800 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Inter" }}
              disabled={isLoading}
            >
              <img 
                src="/google-logo.png" 
                alt="Google" 
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?  {' '}
              <Link 
                to="/signUp" 
                className="text-[#29473E] font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div className="hidden lg:flex w-full lg:w-[41%] relative items-center justify-center bg-white">
          <img
            src="/auth. png"
            alt="Legal Justice Illustration"
            className="w-full h-full object-cover p-8"
            onError={(e) => {
              e.target.src = "/auth.png";
            }}
          />
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />
    </div>
  );
};

export default Login;
