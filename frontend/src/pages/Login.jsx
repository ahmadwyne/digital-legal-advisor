import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Scale,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { authApi } from "@/api/authApi";
import { showToast, validationMessages } from "@/utils/toast";
import { getErrorMessage, getErrorStatus } from "@/utils/errorHandler";

// Lazy load components
const Header = lazy(() => import("@/components/Header"));
const ForgotPasswordModal = lazy(() => import("@/components/ForgotPasswordModal"));

// Loading fallback
const LoadingFallback = () => (
  <div className="w-full h-20 bg-gradient-to-r from-blue-50 to-indigo-50 animate-pulse" />
);

// Memoized feature card component
const FeatureCard = ({ feature, idx }) => (
  <div
    className="group flex items-start gap-3 p-3 glass-effect rounded-2xl border-2 border-white/50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-700 hover:-translate-y-1 animate-slide-up"
    style={{ animationDelay: `${idx * 150}ms`, willChange: 'transform, opacity' }}
  >
    <div
      className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-700`}
    >
      <feature.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
    </div>
    <div>
      <h3 className="text-base font-bold text-gray-800 mb-0.5" style={{ fontFamily: "Poppins" }}>
        {feature.title}
      </h3>
      <p className="text-sm text-gray-600" style={{ fontFamily: "Inter" }}>
        {feature.desc}
      </p>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useAuthRedirect("/platform");

  // Memoize features data
  const features = useMemo(() => [
    {
      icon: Shield,
      title: "Bank-Level Security",
      desc: "Your data is protected with 256-bit encryption",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Zap,
      title: "Instant Answers",
      desc: "Get immediate legal guidance powered by AI",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Scale,
      title: "Expert Knowledge",
      desc: "Trained on Pakistani financial laws",
      color: "from-indigo-500 to-purple-600",
    },
  ], []);

  // Memoize validation function
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateForm = useCallback(() => {
    if (!email.trim()) {
      showToast.error(validationMessages.email.required);
      return false;
    }
    if (!validateEmail(email.trim())) {
      showToast.error(validationMessages.email.invalid);
      return false;
    }
    if (!password) {
      showToast.error(validationMessages.password.required);
      return false;
    }
    return true;
  }, [email, password, validateEmail]);

  const handleLoginError = useCallback((error) => {
    const errorMessage = getErrorMessage(error);
    const errorStatus = getErrorStatus(error);
    const errorLower = errorMessage?.toLowerCase() || "";

    if (errorLower.includes("invalid credentials")) {
      showToast.error("Invalid email or password. Please check your credentials and try again.");
      return;
    }

    switch (errorStatus) {
      case 400:
        if (errorLower.includes("email") && errorLower.includes("valid")) {
          showToast.error(validationMessages.email.invalid);
        } else if (errorLower.includes("email") && errorLower.includes("required")) {
          showToast.error(validationMessages.email.required);
        } else if (errorLower.includes("password") && errorLower.includes("required")) {
          showToast.error(validationMessages.password.required);
        } else {
          showToast.error(errorMessage || "Invalid request. Please check your inputs.");
        }
        break;
      case 401:
        if (errorLower.includes("inactive") || errorLower.includes("no longer exists")) {
          showToast.error("Your account has been deactivated. Please contact support.");
        } else {
          showToast.error("Invalid email or password. Please try again.");
        }
        break;
      case 403:
        showToast.error("Your account has been suspended. Please contact support.");
        break;
      case 404:
        showToast.error("No account found with this email address.");
        break;
      case 500:
      case 502:
      case 503:
        showToast.error(validationMessages.general.serverError);
        break;
      default:
        if (errorLower.includes("please sign in with")) {
          const provider = errorMessage.match(/with (\w+)/)?.[1] || "Google";
          showToast.error(`This account uses ${provider} sign-in. Please use the "Continue with ${provider}" button.`);
        } else if (errorLower.includes("network") || errorLower.includes("fetch failed") || error?.code === "ERR_NETWORK") {
          showToast.error(validationMessages.general.networkError);
        } else if (errorMessage) {
          showToast.error(errorMessage);
        } else {
          showToast.error(validationMessages.auth.loginFailed);
        }
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        showToast.success(validationMessages.auth.loginSuccess);
        setTimeout(() => {
          navigate(result.user?.role === "admin" ? "/admin" : "/platform");
        }, 500);
      } else {
        handleLoginError(result.error);
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, validateForm, login, navigate, handleLoginError]);

  const handleGoogleLogin = useCallback(() => {
    try {
      authApi.googleLogin();
    } catch (error) {
      showToast.error("Failed to initiate Google login. Please try again.");
    }
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Suspense fallback={<LoadingFallback />}>
        <Header />
      </Suspense>

      {/* Optimized Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none" style={{ willChange: 'transform' }}>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-300/15 to-orange-400/15 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            
            {/* LEFT SIDE */}
            <div className="hidden lg:block animate-fade-in">
              <div className="space-y-6 max-w-md">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "Poppins" }}>
                    Welcome to <br />
                    <span className="bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-700 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">
                      Digital Legal Advisor
                    </span>
                  </h1>
                </div>

                <div className="space-y-3">
                  {features.map((feature, idx) => (
                    <FeatureCard key={idx} feature={feature} idx={idx} />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="glass-effect p-6 sm:p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/50 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 hover:border-gray-300"
                      placeholder="you@example.com"
                      style={{ fontFamily: "Inter" }}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-12 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 hover:border-gray-300"
                        placeholder="Enter your password"
                        style={{ fontFamily: "Inter" }}
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                        disabled={isLoading}
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end !mt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline transition-colors duration-300"
                      style={{ fontFamily: "Inter" }}
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="group relative w-[65%] mx-auto flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-base font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg overflow-hidden !mt-6"
                    style={{ fontFamily: "Inter" }}
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <div className="flex-1 border-t-2 border-gray-200"></div>
                  <span className="px-4 text-gray-500 text-sm font-semibold" style={{ fontFamily: "Inter" }}>OR</span>
                  <div className="flex-1 border-t-2 border-gray-200"></div>
                </div>

                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="group w-[65%] mx-auto bg-white border-2 border-gray-300 py-3 rounded-xl text-base font-semibold hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Inter" }}
                  disabled={isLoading}
                >
                  <img src="/google-logo.png" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-gray-700">Continue with Google</span>
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600 mt-5" style={{ fontFamily: "Inter" }}>
                  Don't have an account?{" "}
                  <Link to="/signUp" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors duration-300">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />
      </Suspense>
    </div>
  );
};

export default Login;