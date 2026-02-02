import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Scale, ArrowRight, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { authApi } from "@/api/authApi";
import { showToast, validationMessages } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useAuthRedirect('/platform');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password) {
      showToast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      showToast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      showToast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({ firstName, lastName, email, password });

      if (result.success) {
        showToast.success("Account created successfully!");
        setTimeout(() => {
          navigate(result.user?.role === 'admin' ? '/admin' : '/platform');
        }, 500);
      } else {
        showToast.error(getErrorMessage(result.error));
      }
    } catch (error) {
      showToast.error("An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    authApi.googleLogin();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      {/* Animated Background - Identical to Login */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
            `,
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
            
            {/* LEFT SIDE - Welcome Section (Matched to Login) */}
            <div className="hidden lg:block animate-fade-in">
              <div className="space-y-6 max-w-md">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "Poppins" }}>
                    Join the <br />
                    <span className="bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-700 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">
                      Digital Legal Advisor
                    </span>
                  </h1>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Shield, title: "Secure Account", desc: "Your data is protected with 256-bit encryption", color: "from-blue-500 to-indigo-600" },
                    { icon: Zap, title: "Instant Access", desc: "Get immediate legal guidance powered by AI", color: "from-amber-500 to-orange-600" },
                    { icon: Scale, title: "Expert Accuracy", desc: "Trained on Pakistani financial laws", color: "from-indigo-500 to-purple-600" }
                  ].map((feature, idx) => (
                    <div key={idx} className="group flex items-start gap-3 p-3 glass-effect rounded-2xl border-2 border-white/50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <feature.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-800 mb-0.5" style={{ fontFamily: "Poppins" }}>{feature.title}</h3>
                        <p className="text-sm text-gray-600" style={{ fontFamily: "Inter" }}>{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Sign Up Form */}
            <div className="w-full max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="glass-effect p-6 sm:p-7 rounded-[2.5rem] shadow-2xl border-2 border-white/50 backdrop-blur-xl">
                

                <form onSubmit={handleSubmit} className="space-y-2">
                  {/* First & Last Name Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 hover:border-gray-300"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 hover:border-gray-300"
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 hover:border-gray-300"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  {/* Passwords Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pr-10 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 text-sm"
                        placeholder="••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-blue-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>Confirm</label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pr-10 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 text-sm"
                        placeholder="••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-blue-600">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign Up Button - 75% width & Centered */}
                  <button
                    type="submit"
                    className="group relative w-[65%] mx-auto flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-base font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 shadow-lg overflow-hidden !mt-8"
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                      {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </button>
                </form>

                <div className="flex items-center my-3">
                  <div className="flex-1 border-t-2 border-blue-600"></div>
                  <span className="px-3 text-gray-400 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "Inter" }}>OR</span>
                  <div className="flex-1 border-t-2 border-blue-600"></div>
                </div>

                {/* Google Button - 75% width & Centered */}
                <button
                  onClick={handleGoogleSignUp}
                  type="button"
                  className="w-[65%] mx-auto bg-white border-2 border-gray-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 shadow-sm"
                  disabled={isLoading}
                >
                  <img src="/google-logo.png" alt="Google" className="w-4 h-4" />
                  <span className="text-gray-700" style={{ fontFamily: "Inter" }}>Continue with Google</span>
                </button>

                <p className="text-center text-sm text-gray-600 mt-4" style={{ fontFamily: "Inter" }}>
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;