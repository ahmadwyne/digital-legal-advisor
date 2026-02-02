// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
// import Header from "@/components/Header";
// import { useAuth } from "@/hooks/useAuth";
// import { useAuthRedirect } from "@/hooks/useAuthRedirect";
// import { authApi } from "@/api/authApi";
// import { useToast } from "@/hooks/use-toast";
// import { getErrorMessage } from "@/utils/errorHandler";

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password:  "",
//     confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // Redirect if already authenticated
//   useAuthRedirect('/platform');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target. name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast({
//         variant: "destructive",
//         title: "Validation Error",
//         description: "Passwords do not match! ",
//       });
//       return;
//     }

//     if (password.length < 6) {
//       toast({
//         variant:  "destructive",
//         title:  "Validation Error",
//         description: "Password must be at least 6 characters long",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const nameParts = name.trim().split(' ');
//       const firstName = nameParts[0] || '';
//       const lastName = nameParts.slice(1).join(' ') || nameParts[0];

//       const result = await register({
//         firstName,
//         lastName,
//         email,
//         password,
//       });

//       if (result.success) {
//         toast({
//           title: "Success",
//           description: "Account created successfully!",
//         });
        
//         // Redirect based on user role
//         if (result.user?.role === 'admin') {
//           navigate('/admin');
//         } else {
//           navigate('/platform');
//         }
//       } else {
//         toast({
//           variant: "destructive",
//           title: "Registration Failed",
//           description: getErrorMessage(result.error),
//         });
//       }
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "An unexpected error occurred",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignUp = () => {
//     authApi.googleLogin();
//   };

//   return (
//     <div className="relative w-full h-screen bg-white overflow-hidden">
//       {/* Header */}
//       <Header />

//       {/* Main Content - Split Screen */}
//       <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)] mt-[65px]">
//         {/* Left Panel - SignUp Form */}
//         <div className="w-full lg:w-[50%] flex items-center justify-center bg-gray-50 px-4 sm:px-8 py-1 overflow-y-auto">
//           <div className="w-full max-w-md my-auto">
//             {/* SignUp Title */}
//             <h1
//               className="text-[22px] sm:text-[24px] lg:text-[28px] font-bold text-[#44444E] text-center mb-1"
//               style={{ fontFamily:  "Roboto Mono" }}
//             >
//               Sign Up
//             </h1>

//             {/* Feature Badges - All in One Line */}
//             <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 lg:gap-4 mb-3">
//               <div className="flex items-center gap-1.5">
//                 <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
//                   <svg
//                     className="w-3 h-3 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={3}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//                 <span
//                   className="text-[#44444E] text-sm sm:text-base lg:text-md font-normal whitespace-nowrap"
//                   style={{ fontFamily: "Ropa Sans" }}
//                 >
//                   AI Legal Help
//                 </span>
//               </div>

//               <div className="flex items-center gap-1.5">
//                 <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
//                   <svg
//                     className="w-3 h-3 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={3}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//                 <span
//                   className="text-[#44444E] text-sm sm:text-base lg:text-md font-normal whitespace-nowrap"
//                   style={{ fontFamily: "Ropa Sans" }}
//                 >
//                   24/7 Support
//                 </span>
//               </div>

//               <div className="flex items-center gap-1.5">
//                 <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
//                   <svg
//                     className="w-3 h-3 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={3}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//                 <span
//                   className="text-[#44444E] text-sm sm:text-base lg:text-md font-normal whitespace-nowrap"
//                   style={{ fontFamily: "Ropa Sans" }}
//                 >
//                   Data Privacy
//                 </span>
//               </div>
//             </div>

//             {/* SignUp Form */}
//             <form onSubmit={handleSubmit} className="space-y-2">
//               {/* Full Name Field */}
//               <div>
//                 <label
//                   htmlFor="firstName"
//                   className="block text-[#666666] text-sm font-semibold mb-1"
//                   style={{ fontFamily: "Noto Sans" }}
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="firstName"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   className="w-full lg:w-[95%] px-2 py-1.5 bg-white border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:ring-2 focus:ring-[#29473E]/10 focus:outline-none transition-all text-gray-700 text-sm placeholder-gray-400"
//                   placeholder="Enter Full Name"
//                   style={{ fontFamily: "Noto Sans" }}
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-[#666666] text-sm font-semibold mb-1"
//                   style={{ fontFamily: "Noto Sans" }}
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full lg:w-[95%] px-2 py-1.5 bg-white border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:ring-2 focus:ring-[#29473E]/10 focus:outline-none transition-all text-gray-700 text-sm placeholder-gray-400"
//                   placeholder="Enter email"
//                   style={{ fontFamily: "Noto Sans" }}
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* Password Field with Eye Icon */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-[#666666] text-sm font-semibold mb-1"
//                   style={{ fontFamily: "Noto Sans" }}
//                 >
//                   Password
//                 </label>
//                 <div className="relative w-full lg:w-[95%]">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     value={formData. password}
//                     onChange={handleChange}
//                     className="w-full px-2 py-1.5 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:ring-2 focus:ring-[#29473E]/10 focus:outline-none transition-all text-gray-700 text-sm placeholder-gray-400"
//                     placeholder="Enter Password"
//                     style={{ fontFamily: "Noto Sans" }}
//                     required
//                     disabled={isLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#29473E] transition-colors"
//                     disabled={isLoading}
//                   >
//                     {showPassword ?  (
//                       <EyeOff className="w-4 h-4" />
//                     ) : (
//                       <Eye className="w-4 h-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password Field with Eye Icon */}
//               <div>
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block text-[#666666] text-sm font-semibold mb-1"
//                   style={{ fontFamily: "Noto Sans" }}
//                 >
//                   Confirm Password
//                 </label>
//                 <div className="relative w-full lg:w-[95%] mb-2">
//                   <input
//                     type={showConfirmPassword ?  "text" : "password"}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="w-full px-2 py-1.5 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:ring-2 focus:ring-[#29473E]/10 focus:outline-none transition-all text-gray-700 text-sm placeholder-gray-400"
//                     placeholder="Enter Password Again"
//                     style={{ fontFamily: "Noto Sans" }}
//                     required
//                     disabled={isLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#29473E] transition-colors"
//                     disabled={isLoading}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="w-4 h-4" />
//                     ) : (
//                       <Eye className="w-4 h-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* SignUp Button */}
//               <button
//                 type="submit"
//                 className="w-full lg:w-[95%] bg-[#29473E] text-white py-1.5 rounded-lg text-base font-medium hover:bg-[#1f3630] hover: shadow-lg transition-all duration-300 mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 style={{ fontFamily: "Noto Sans" }}
//                 disabled={isLoading}
//               >
//                 {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {isLoading ? "Creating Account..." : "Sign Up"}
//               </button>
//             </form>

//             {/* Divider Line with OR */}
//             <div className="flex items-center my-2 w-full lg:w-[95%]">
//               <div className="flex-1 border-t-2 border-gray-300"></div>
//               <span className="px-3 text-gray-500 text-xs font-medium">OR</span>
//               <div className="flex-1 border-t-2 border-gray-300"></div>
//             </div>

//             {/* Continue with Google */}
//             <button
//               onClick={handleGoogleSignUp}
//               className="w-[95%]  bg-white border-2 border-gray-800 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{ fontFamily: "Inter" }}
//               disabled={isLoading}
//             >
//               <img
//                 src="/google-logo.png"
//                 alt="Google"
//                 className="w-5 h-5"
//               />
//               <span>Continue with Google</span>
//             </button>

//             {/* Login Link */}
//             <p className="text-center text-sm text-gray-600 mt-2">
//               Already have an account? {' '}
//               <Link 
//                 to="/login" 
//                 className="text-[#29473E] font-semibold hover:underline"
//               >
//                 Login
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Right Panel - Large Image */}
//         <div className="hidden lg:flex w-full lg:w-[41%] relative items-center justify-center bg-white">
//           <img
//             src="/auth.png"
//             alt="Legal Justice Illustration"
//             className="w-full h-full object-cover p-8"
//             onError={(e) => {
//               e.target.src = "/auth.png";
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

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