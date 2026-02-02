// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { Eye, EyeOff, Loader2 } from "lucide-react";
// // import Header from "@/components/Header";
// // import ForgotPasswordModal from "@/components/ForgotPasswordModal";
// // import { useAuth } from "@/hooks/useAuth";
// // import { useAuthRedirect } from "@/hooks/useAuthRedirect";
// // import { authApi } from "@/api/authApi";
// // import { showToast, validationMessages } from "@/utils/toast";
// // import { getErrorMessage, getErrorStatus } from "@/utils/errorHandler";

// // const Login = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showForgotModal, setShowForgotModal] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);

// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   // Redirect if already authenticated
// //   useAuthRedirect('/platform');

// //   /**
// //    * Validate email format
// //    */
// //   const validateEmail = (email) => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     return emailRegex.test(email);
// //   };

// //   /**
// //    * Basic validation before sending to backend
// //    */
// //   const validateForm = () => {
// //     // Check if email is empty
// //     if (!email. trim()) {
// //       showToast. error(validationMessages.email. required);
// //       return false;
// //     }

// //     // Check if email format is valid
// //     if (!validateEmail(email. trim())) {
// //       showToast.error(validationMessages. email.invalid);
// //       return false;
// //     }

// //     // Check if password is empty
// //     if (!password) {
// //       showToast.error(validationMessages.password.required);
// //       return false;
// //     }

// //     return true;
// //   };

// //   /**
// //    * Handle different types of login errors from backend
// //    */
// //   const handleLoginError = (error) => {
// //     const errorMessage = getErrorMessage(error);
// //     const errorStatus = getErrorStatus(error);
// //     const errorLower = errorMessage?. toLowerCase() || '';

// //     console.log('🔴 Login Error:', {
// //       status: errorStatus,
// //       message:  errorMessage,
// //       fullError: error
// //     });

// //     // Priority 1: Check for "Invalid credentials" message
// //     if (errorLower. includes('invalid credentials')) {
// //       showToast.error('Invalid email or password.  Please check your credentials and try again.');
// //       return;
// //     }

// //     // Priority 2: Handle by status code
// //     switch (errorStatus) {
// //       case 400:
// //         // Bad Request - validation errors
// //         if (errorLower.includes('email') && errorLower.includes('valid')) {
// //           showToast. error(validationMessages.email.invalid);
// //         } else if (errorLower.includes('email') && errorLower.includes('required')) {
// //           showToast. error(validationMessages.email. required);
// //         } else if (errorLower.includes('password') && errorLower.includes('required')) {
// //           showToast.error(validationMessages.password.required);
// //         } else {
// //           showToast.error(errorMessage || 'Invalid request.  Please check your inputs.');
// //         }
// //         break;

// //       case 401:
// //         // Unauthorized
// //         if (errorLower.includes('inactive') || errorLower.includes('no longer exists')) {
// //           showToast. error('Your account has been deactivated. Please contact support.');
// //         } else {
// //           showToast.error('Invalid email or password. Please try again.');
// //         }
// //         break;

// //       case 403:
// //         // Forbidden
// //         showToast.error('Your account has been suspended. Please contact support.');
// //         break;

// //       case 404:
// //         // Not Found
// //         showToast.error('No account found with this email address.');
// //         break;

// //       case 500:
// //       case 502:
// //       case 503:
// //         // Server errors
// //         showToast.error(validationMessages.general.serverError);
// //         break;

// //       default:
// //         // Handle by message content
// //         if (errorLower. includes('please sign in with')) {
// //           const provider = errorMessage. match(/with (\w+)/)?.[1] || 'Google';
// //           showToast.error(`This account uses ${provider} sign-in. Please use the "Continue with ${provider}" button.`);
// //         } else if (errorLower.includes('network') || errorLower.includes('fetch failed') || error?. code === 'ERR_NETWORK') {
// //           showToast.error(validationMessages.general.networkError);
// //         } else if (errorMessage) {
// //           showToast.error(errorMessage);
// //         } else {
// //           showToast.error(validationMessages.auth.loginFailed);
// //         }
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // Validate form
// //     if (!validateForm()) {
// //       return;
// //     }

// //     setIsLoading(true);

// //     try {
// //       const result = await login(email. trim(), password);

// //       if (result.success) {
// //         showToast.success(validationMessages.auth.loginSuccess);

// //         // Small delay for toast to show
// //         setTimeout(() => {
// //           // Redirect based on user role
// //           if (result.user?. role === 'admin') {
// //             navigate('/admin');
// //           } else {
// //             navigate('/platform');
// //           }
// //         }, 500);
// //       } else {
// //         // Handle error from AuthContext
// //         handleLoginError(result.error);
// //       }
// //     } catch (error) {
// //       console.error('Unexpected login error:', error);
// //       handleLoginError(error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleGoogleLogin = () => {
// //     try {
// //       authApi.googleLogin();
// //     } catch (error) {
// //       showToast.error('Failed to initiate Google login.  Please try again.');
// //     }
// //   };

// //   return (
// //     <div className="relative w-full h-screen bg-white overflow-hidden">
// //       {/* Header */}
// //       <Header />

// //       {/* Main Content - Split Screen */}
// //       <div className="flex flex-col lg:flex-row h-[calc(100vh-95px)] mt-[75px]">
// //         {/* Left Panel - Login Form */}
// //         <div className="w-full lg:w-[50%] flex items-center justify-center bg-gray-50 px-4 sm:px-8 py-4">
// //           <div className="w-full max-w-md">
// //             {/* Login Title */}
// //             <h1
// //               className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-[#44444E] text-center mb-3"
// //               style={{ fontFamily: "Roboto Mono" }}
// //             >
// //               Login
// //             </h1>

// //             {/* Feature Badges */}
// //             <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 lg:gap-4 mb-5">
// //               <div className="flex items-center gap-1.5">
// //                 <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
// //                   <svg
// //                     className="w-3 h-3 text-white"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={3}
// //                       d="M5 13l4 4L19 7"
// //                     />
// //                   </svg>
// //                 </div>
// //                 <span
// //                   className="text-[#44444E] text-sm sm:text-base lg:text-lg font-normal whitespace-nowrap"
// //                   style={{ fontFamily: "Ropa Sans" }}
// //                 >
// //                   AI Legal Help
// //                 </span>
// //               </div>

// //               <div className="flex items-center gap-1.5">
// //                 <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
// //                   <svg
// //                     className="w-3 h-3 text-white"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={3}
// //                       d="M5 13l4 4L19 7"
// //                     />
// //                   </svg>
// //                 </div>
// //                 <span
// //                   className="text-[#44444E] text-sm sm:text-base lg:text-lg font-normal whitespace-nowrap"
// //                   style={{ fontFamily: "Ropa Sans" }}
// //                 >
// //                   24/7 Support
// //                 </span>
// //               </div>

// //               <div className="flex items-center gap-1.5">
// //                 <div className="w-5 h-5 bg-[#317249] rounded-full flex items-center justify-center flex-shrink-0">
// //                   <svg
// //                     className="w-3 h-3 text-white"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={3}
// //                       d="M5 13l4 4L19 7"
// //                     />
// //                   </svg>
// //                 </div>
// //                 <span
// //                   className="text-[#44444E] text-sm sm:text-base lg:text-lg font-normal whitespace-nowrap"
// //                   style={{ fontFamily: "Ropa Sans" }}
// //                 >
// //                   Data Privacy
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Login Form */}
// //             <form onSubmit={handleSubmit} className="space-y-2">
// //               {/* Email Field */}
// //               <div>
// //                 <label
// //                   htmlFor="email"
// //                   className="block text-[#666666] text-sm lg:text-md font-semibold mb-1. 5"
// //                   style={{ fontFamily: "Noto Sans" }}
// //                 >
// //                   Email
// //                 </label>
// //                 <input
// //                   type="text"
// //                   id="email"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   className="w-full lg:w-[95%] px-3.5 py-2.5 bg-white border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:ring-2 focus:ring-[#29473E]/10 focus:outline-none transition-all text-gray-700 text-sm placeholder-gray-400"
// //                   placeholder="Enter email"
// //                   style={{ fontFamily: "Noto Sans" }}
// //                   disabled={isLoading}
// //                   autoComplete="email"
// //                 />
// //               </div>

// //               {/* Password Field */}
// //               <div>
// //                 <label
// //                   htmlFor="password"
// //                   className="block text-[#666666] text-sm lg:text-md font-semibold mb-1.5"
// //                   style={{ fontFamily: "Noto Sans" }}
// //                 >
// //                   Password
// //                 </label>
// //                 <div className="relative w-full lg:w-[95%]">
// //                   <input
// //                     type={showPassword ? "text" : "password"}
// //                     id="password"
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     className="w-full px-3.5 py-2.5 pr-10 bg-white border-2 border-gray-300 rounded-lg focus:border-[#29473E] focus:ring-2 focus:ring-[#29473E]/10 focus:outline-none transition-all text-gray-700 text-sm placeholder-gray-400"
// //                     placeholder="Enter Password"
// //                     style={{ fontFamily: "Noto Sans" }}
// //                     disabled={isLoading}
// //                     autoComplete="current-password"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#29473E] transition-colors"
// //                     disabled={isLoading}
// //                     tabIndex={-1}
// //                   >
// //                     {showPassword ?  (
// //                       <EyeOff className="w-5 h-5" />
// //                     ) : (
// //                       <Eye className="w-5 h-5" />
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Forgot Password */}
// //               <div className="flex justify-end pt-0.5 w-full lg:w-[95%]">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowForgotModal(true)}
// //                   className="text-[#666666] text-sm lg:text-md font-semibold hover:text-[#29473E] transition-colors"
// //                   style={{ fontFamily:  "Noto Sans" }}
// //                   disabled={isLoading}
// //                 >
// //                   Forgot password?
// //                 </button>
// //               </div>

// //               {/* Login Button */}
// //               <button
// //                 type="submit"
// //                 className="w-full lg:w-[95%] bg-[#29473E] text-white py-2.5 rounded-lg text-base font-medium hover:bg-[#1f3630] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// //                 style={{ fontFamily: "Noto Sans" }}
// //                 disabled={isLoading}
// //               >
// //                 {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
// //                 {isLoading ? "Logging in..." : "Login"}
// //               </button>
// //             </form>

// //             {/* Divider */}
// //             <div className="flex items-center my-4 w-full lg:w-[95%]">
// //               <div className="flex-1 border-t-2 border-gray-300"></div>
// //               <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
// //               <div className="flex-1 border-t-2 border-gray-300"></div>
// //             </div>

// //             {/* Google Login */}
// //             <button
// //               onClick={handleGoogleLogin}
// //               type="button"
// //               className="w-full lg:w-[95%] bg-white border-2 border-gray-800 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
// //               style={{ fontFamily: "Inter" }}
// //               disabled={isLoading}
// //             >
// //               <img
// //                 src="/google-logo.png"
// //                 alt="Google"
// //                 className="w-5 h-5"
// //               />
// //               <span>Continue with Google</span>
// //             </button>

// //             {/* Sign Up Link */}
// //             <p className="text-center text-sm text-gray-600 mt-4">
// //               Don't have an account?  {' '}
// //               <Link
// //                 to="/signUp"
// //                 className="text-[#29473E] font-semibold hover:underline"
// //               >
// //                 Sign Up
// //               </Link>
// //             </p>
// //           </div>
// //         </div>

// //         {/* Right Panel - Image */}
// //         <div className="hidden lg:flex w-full lg:w-[41%] relative items-center justify-center bg-white">
// //           <img
// //             src="/auth. png"
// //             alt="Legal Justice Illustration"
// //             className="w-full h-full object-cover p-8"
// //             onError={(e) => {
// //               e.target.src = "/auth.png";
// //             }}
// //           />
// //         </div>
// //       </div>

// //       {/* Forgot Password Modal */}
// //       <ForgotPasswordModal
// //         isOpen={showForgotModal}
// //         onClose={() => setShowForgotModal(false)}
// //       />
// //     </div>
// //   );
// // };

// // export default Login;

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Eye, EyeOff, Loader2, Scale, ArrowRight, Sparkles } from "lucide-react";
// import Header from "@/components/Header";
// import ForgotPasswordModal from "@/components/ForgotPasswordModal";
// import { useAuth } from "@/hooks/useAuth";
// import { useAuthRedirect } from "@/hooks/useAuthRedirect";
// import { authApi } from "@/api/authApi";
// import { showToast, validationMessages } from "@/utils/toast";
// import { getErrorMessage, getErrorStatus } from "@/utils/errorHandler";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   useAuthRedirect('/platform');

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validateForm = () => {
//     if (!email.trim()) {
//       showToast.error(validationMessages.email.required);
//       return false;
//     }

//     if (!validateEmail(email.trim())) {
//       showToast.error(validationMessages.email.invalid);
//       return false;
//     }

//     if (!password) {
//       showToast.error(validationMessages.password.required);
//       return false;
//     }

//     return true;
//   };

//   const handleLoginError = (error) => {
//     const errorMessage = getErrorMessage(error);
//     const errorStatus = getErrorStatus(error);
//     const errorLower = errorMessage?.toLowerCase() || '';

//     if (errorLower.includes('invalid credentials')) {
//       showToast.error('Invalid email or password. Please check your credentials and try again.');
//       return;
//     }

//     switch (errorStatus) {
//       case 400:
//         if (errorLower.includes('email') && errorLower.includes('valid')) {
//           showToast.error(validationMessages.email.invalid);
//         } else if (errorLower.includes('email') && errorLower.includes('required')) {
//           showToast.error(validationMessages.email.required);
//         } else if (errorLower.includes('password') && errorLower.includes('required')) {
//           showToast.error(validationMessages.password.required);
//         } else {
//           showToast.error(errorMessage || 'Invalid request. Please check your inputs.');
//         }
//         break;

//       case 401:
//         if (errorLower.includes('inactive') || errorLower.includes('no longer exists')) {
//           showToast.error('Your account has been deactivated. Please contact support.');
//         } else {
//           showToast.error('Invalid email or password. Please try again.');
//         }
//         break;

//       case 403:
//         showToast.error('Your account has been suspended. Please contact support.');
//         break;

//       case 404:
//         showToast.error('No account found with this email address.');
//         break;

//       case 500:
//       case 502:
//       case 503:
//         showToast.error(validationMessages.general.serverError);
//         break;

//       default:
//         if (errorLower.includes('please sign in with')) {
//           const provider = errorMessage.match(/with (\w+)/)?.[1] || 'Google';
//           showToast.error(`This account uses ${provider} sign-in. Please use the "Continue with ${provider}" button.`);
//         } else if (errorLower.includes('network') || errorLower.includes('fetch failed') || error?.code === 'ERR_NETWORK') {
//           showToast.error(validationMessages.general.networkError);
//         } else if (errorMessage) {
//           showToast.error(errorMessage);
//         } else {
//           showToast.error(validationMessages.auth.loginFailed);
//         }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const result = await login(email.trim(), password);

//       if (result.success) {
//         showToast.success(validationMessages.auth.loginSuccess);

//         setTimeout(() => {
//           if (result.user?.role === 'admin') {
//             navigate('/admin');
//           } else {
//             navigate('/platform');
//           }
//         }, 500);
//       } else {
//         handleLoginError(result.error);
//       }
//     } catch (error) {
//       console.error('Unexpected login error:', error);
//       handleLoginError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     try {
//       authApi.googleLogin();
//     } catch (error) {
//       showToast.error('Failed to initiate Google login. Please try again.');
//     }
//   };

//   return (
//     <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
//       <Header />

//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.02]"
//           style={{
//             backgroundImage: `
//               linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
//               linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
//             `,
//             backgroundSize: '60px 60px',
//           }}
//         ></div>

//         <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float"></div>
//         <div className="absolute bottom-20 -right-20 w-72 h-72 bg-gradient-to-br from-amber-300/15 to-orange-400/15 rounded-full blur-3xl animate-float-slow"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
//       </div>

//       {/* Main Content - Fixed Height Container */}
//       <div className="absolute inset-x-0 top-[80px] bottom-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-6xl">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

//             {/* LEFT SIDE - Animated Illustration */}
//             <div className="hidden lg:flex flex-col items-center justify-center animate-fade-in">
//               <div className="relative w-full max-w-md">
//                 {/* Main Scale Icon - Animated */}
//                 <div className="relative z-10 mx-auto w-56 h-56 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-float">
//                   <Scale className="w-28 h-28 text-white" strokeWidth={1.5} />
//                   <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
//                 </div>

//                 {/* Floating Icons - Smaller */}
//                 <div className="absolute top-8 -left-8 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
//                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>

//                 <div className="absolute top-16 -right-10 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-xl animate-bounce-slow" style={{ animationDelay: "0.5s" }}>
//                   <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>

//                 <div className="absolute bottom-14 -left-6 w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-xl animate-bounce-slow" style={{ animationDelay: "1s" }}>
//                   <Sparkles className="w-7 h-7 text-white" />
//                 </div>

//                 <div className="absolute bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow" style={{ animationDelay: "1.5s" }}>
//                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                   </svg>
//                 </div>

//                 {/* Text Below Illustration */}
//                 <div className="text-center mt-6">
//                   <h3 className="text-xl font-black text-gray-800 mb-1" style={{ fontFamily: "Poppins" }}>
//                     AI-Powered Legal Guidance
//                   </h3>
//                   <p className="text-sm text-gray-600" style={{ fontFamily: "Inter" }}>
//                     Secure access to your legal assistant
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT SIDE - Compact Login Form */}
//             <div className="w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
//               <div className="glass-effect p-2 rounded-3xl shadow-2xl border-2 border-white/50 backdrop-blur-xl">

//                 {/* Compact Header */}
//                 <div className="text-center mb-5">

//                   <span>
//                     <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-2 shadow-lg">
//                     <Scale className="w-6 h-6 text-white" strokeWidth={2.5} />
//                   </div>
//                     <h2 className="text-2xl font-black text-gray-800" style={{ fontFamily: "Poppins" }}>
//                     Welcome Back
//                   </h2>
//                   </span>

//                 </div>

//                 {/* Login Form - Compact Spacing */}
//                 <form onSubmit={handleSubmit} className="space-y-3.5">
//                   {/* Email Field */}
//                   <div>
//                     <label htmlFor="email" className="block text-gray-700 text-xs font-bold mb-1.5" style={{ fontFamily: "Inter" }}>
//                       Email
//                     </label>
//                     <input
//                       type="text"
//                       id="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full px-3.5 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 text-sm"
//                       placeholder="you@example.com"
//                       style={{ fontFamily: "Inter" }}
//                       disabled={isLoading}
//                       autoComplete="email"
//                     />
//                   </div>

//                   {/* Password Field */}
//                   <div>
//                     <label htmlFor="password" className="block text-gray-700 text-xs font-bold mb-1.5" style={{ fontFamily: "Inter" }}>
//                       Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-3.5 py-2 pr-10 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 text-sm"
//                         placeholder="••••••••"
//                         style={{ fontFamily: "Inter" }}
//                         disabled={isLoading}
//                         autoComplete="current-password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
//                         disabled={isLoading}
//                         tabIndex={-1}
//                       >
//                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Forgot Password */}
//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotModal(true)}
//                       className="text-blue-600 text-xs font-semibold hover:text-blue-700 hover:underline transition-colors"
//                       style={{ fontFamily: "Inter" }}
//                       disabled={isLoading}
//                     >
//                       Forgot password?
//                     </button>
//                   </div>

//                   {/* Login Button */}
//                   <button
//                     type="submit"
//                     className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
//                     style={{ fontFamily: "Inter" }}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Logging in...
//                       </>
//                     ) : (
//                       <>
//                         Login
//                         <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </button>
//                 </form>

//                 {/* Divider */}
//                 <div className="flex items-center my-3.5">
//                   <div className="flex-1 border-t-2 border-gray-200"></div>
//                   <span className="px-3 text-gray-500 text-xs font-semibold" style={{ fontFamily: "Inter" }}>OR</span>
//                   <div className="flex-1 border-t-2 border-gray-200"></div>
//                 </div>

//                 {/* Google Login */}
//                 <button
//                   onClick={handleGoogleLogin}
//                   type="button"
//                   className="w-full bg-white border-2 border-gray-300 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ fontFamily: "Inter" }}
//                   disabled={isLoading}
//                 >
//                   <img src="/google-logo.png" alt="Google" className="w-4 h-4" />
//                   <span className="text-gray-700">Continue with Google</span>
//                 </button>

//                 {/* Sign Up Link */}
//                 <p className="text-center text-xs text-gray-600 mt-3" style={{ fontFamily: "Inter" }}>
//                   Don't have an account?{' '}
//                   <Link to="/signUp" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors">
//                     Sign Up
//                   </Link>
//                 </p>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Forgot Password Modal */}
//       <ForgotPasswordModal
//         isOpen={showForgotModal}
//         onClose={() => setShowForgotModal(false)}
//       />
//     </div>
//   );
// };

// export default Login;

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Eye, EyeOff, Loader2, Scale, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
// import Header from "@/components/Header";
// import ForgotPasswordModal from "@/components/ForgotPasswordModal";
// import { useAuth } from "@/hooks/useAuth";
// import { useAuthRedirect } from "@/hooks/useAuthRedirect";
// import { authApi } from "@/api/authApi";
// import { showToast, validationMessages } from "@/utils/toast";
// import { getErrorMessage, getErrorStatus } from "@/utils/errorHandler";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   useAuthRedirect('/platform');

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validateForm = () => {
//     if (!email.trim()) {
//       showToast.error(validationMessages.email.required);
//       return false;
//     }
//     if (!validateEmail(email.trim())) {
//       showToast.error(validationMessages.email.invalid);
//       return false;
//     }
//     if (!password) {
//       showToast.error(validationMessages.password.required);
//       return false;
//     }
//     return true;
//   };

//   const handleLoginError = (error) => {
//     const errorMessage = getErrorMessage(error);
//     const errorStatus = getErrorStatus(error);
//     const errorLower = errorMessage?.toLowerCase() || '';

//     if (errorLower.includes('invalid credentials')) {
//       showToast.error('Invalid email or password. Please check your credentials and try again.');
//       return;
//     }

//     switch (errorStatus) {
//       case 400:
//         if (errorLower.includes('email') && errorLower.includes('valid')) {
//           showToast.error(validationMessages.email.invalid);
//         } else if (errorLower.includes('email') && errorLower.includes('required')) {
//           showToast.error(validationMessages.email.required);
//         } else if (errorLower.includes('password') && errorLower.includes('required')) {
//           showToast.error(validationMessages.password.required);
//         } else {
//           showToast.error(errorMessage || 'Invalid request. Please check your inputs.');
//         }
//         break;
//       case 401:
//         if (errorLower.includes('inactive') || errorLower.includes('no longer exists')) {
//           showToast.error('Your account has been deactivated. Please contact support.');
//         } else {
//           showToast.error('Invalid email or password. Please try again.');
//         }
//         break;
//       case 403:
//         showToast.error('Your account has been suspended. Please contact support.');
//         break;
//       case 404:
//         showToast.error('No account found with this email address.');
//         break;
//       case 500:
//       case 502:
//       case 503:
//         showToast.error(validationMessages.general.serverError);
//         break;
//       default:
//         if (errorLower.includes('please sign in with')) {
//           const provider = errorMessage.match(/with (\w+)/)?.[1] || 'Google';
//           showToast.error(`This account uses ${provider} sign-in. Please use the "Continue with ${provider}" button.`);
//         } else if (errorLower.includes('network') || errorLower.includes('fetch failed') || error?.code === 'ERR_NETWORK') {
//           showToast.error(validationMessages.general.networkError);
//         } else if (errorMessage) {
//           showToast.error(errorMessage);
//         } else {
//           showToast.error(validationMessages.auth.loginFailed);
//         }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       const result = await login(email.trim(), password);
//       if (result.success) {
//         showToast.success(validationMessages.auth.loginSuccess);
//         setTimeout(() => {
//           if (result.user?.role === 'admin') {
//             navigate('/admin');
//           } else {
//             navigate('/platform');
//           }
//         }, 500);
//       } else {
//         handleLoginError(result.error);
//       }
//     } catch (error) {
//       console.error('Unexpected login error:', error);
//       handleLoginError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     try {
//       authApi.googleLogin();
//     } catch (error) {
//       showToast.error('Failed to initiate Google login. Please try again.');
//     }
//   };

//   return (
//     <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       <Header />

//       {/* Animated Background */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: `
//               linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
//               linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
//             `,
//             backgroundSize: '60px 60px',
//           }}
//         ></div>
//         <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float"></div>
//         <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-300/15 to-orange-400/15 rounded-full blur-3xl animate-float-slow"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
//       </div>

//       {/* Main Content - Scrollable */}
//       <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

//             {/* LEFT SIDE - Welcome Section */}
//             <div className="hidden lg:block animate-fade-in lg:sticky lg:top-24">
//               <div className="space-y-6">

//                 {/* Main Heading */}
//                 <div>
//                   <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "Poppins" }}>
//                     Welcome to <br/>
//                     <span className="bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-700 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">
//                       Digital Legal Advisor
//                     </span>
//                   </h1>
//                 </div>

//                 {/* Feature Cards */}
//                 <div className="space-y-3">
//                   {[
//                     { icon: Shield, title: "Bank-Level Security", desc: "Your data is protected with 256-bit encryption", color: "from-blue-500 to-indigo-600" },
//                     { icon: Zap, title: "Instant Answers", desc: "Get immediate legal guidance powered by AI", color: "from-amber-500 to-orange-600" },
//                     { icon: Scale, title: "Expert Knowledge", desc: "Trained on Pakistani financial laws", color: "from-indigo-500 to-purple-600" }
//                   ].map((feature, idx) => (
//                     <div
//                       key={idx}
//                       className="group flex items-start gap-3 p-3 glass-effect rounded-2xl border-2 border-white/50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-slide-up"
//                       style={{ animationDelay: `${idx * 100}ms` }}
//                     >
//                       <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
//                         <feature.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-bold text-gray-800 mb-0.5" style={{ fontFamily: "Poppins" }}>{feature.title}</h3>
//                         <p className="text-sm text-gray-600" style={{ fontFamily: "Inter" }}>{feature.desc}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT SIDE - Login Form */}
//             <div className="w-full max-w-md mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
//               <div className="glass-effect p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white/50 backdrop-blur-xl">

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-2">
//                   {/* Email */}
//                   <div>
//                     <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 hover:border-gray-300"
//                       placeholder="you@example.com"
//                       style={{ fontFamily: "Inter" }}
//                       disabled={isLoading}
//                       autoComplete="email"
//                     />
//                   </div>

//                   {/* Password */}
//                   <div>
//                     <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>
//                       Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-4 py-2 pr-12 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-gray-800 placeholder-gray-400 hover:border-gray-300"
//                         placeholder="Enter your password"
//                         style={{ fontFamily: "Inter" }}
//                         disabled={isLoading}
//                         autoComplete="current-password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
//                         disabled={isLoading}
//                         tabIndex={-1}
//                       >
//                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Forgot Password */}
//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotModal(true)}
//                       className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline transition-colors"
//                       style={{ fontFamily: "Inter" }}
//                       disabled={isLoading}
//                     >
//                       Forgot password?
//                     </button>
//                   </div>

//                   {/* Login Button */}
//                   <button
//                     type="submit"
//                     className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-base font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg overflow-hidden"
//                     style={{ fontFamily: "Inter" }}
//                     disabled={isLoading}
//                   >
//                     <span className="relative z-10 flex items-center gap-2">
//                       {isLoading ? (
//                         <>
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                           Signing in...
//                         </>
//                       ) : (
//                         <>
//                           Sign In
//                           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                         </>
//                       )}
//                     </span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
//                   </button>
//                 </form>

//                 {/* Divider */}
//                 <div className="flex items-center my-5">
//                   <div className="flex-1 border-t-2 border-gray-200"></div>
//                   <span className="px-4 text-gray-500 text-sm font-semibold" style={{ fontFamily: "Inter" }}>OR</span>
//                   <div className="flex-1 border-t-2 border-gray-200"></div>
//                 </div>

//                 {/* Google Login */}
//                 <button
//                   onClick={handleGoogleLogin}
//                   type="button"
//                   className="group w-full bg-white border-2 border-gray-300 py-3 rounded-xl text-base font-semibold hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ fontFamily: "Inter" }}
//                   disabled={isLoading}
//                 >
//                   <img src="/google-logo.png" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                   <span className="text-gray-700">Continue with Google</span>
//                 </button>

//                 {/* Sign Up Link */}
//                 <p className="text-center text-sm text-gray-600 mt-5" style={{ fontFamily: "Inter" }}>
//                   Don't have an account?{' '}
//                   <Link to="/signUp" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors">
//                     Create Account
//                   </Link>
//                 </p>

//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       <ForgotPasswordModal
//         isOpen={showForgotModal}
//         onClose={() => setShowForgotModal(false)}
//       />
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Scale,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
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

  useAuthRedirect("/platform");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
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
  };

  const handleLoginError = (error) => {
    const errorMessage = getErrorMessage(error);
    const errorStatus = getErrorStatus(error);
    const errorLower = errorMessage?.toLowerCase() || "";

    if (errorLower.includes("invalid credentials")) {
      showToast.error(
        "Invalid email or password. Please check your credentials and try again.",
      );
      return;
    }

    switch (errorStatus) {
      case 400:
        if (errorLower.includes("email") && errorLower.includes("valid")) {
          showToast.error(validationMessages.email.invalid);
        } else if (
          errorLower.includes("email") &&
          errorLower.includes("required")
        ) {
          showToast.error(validationMessages.email.required);
        } else if (
          errorLower.includes("password") &&
          errorLower.includes("required")
        ) {
          showToast.error(validationMessages.password.required);
        } else {
          showToast.error(
            errorMessage || "Invalid request. Please check your inputs.",
          );
        }
        break;
      case 401:
        if (
          errorLower.includes("inactive") ||
          errorLower.includes("no longer exists")
        ) {
          showToast.error(
            "Your account has been deactivated. Please contact support.",
          );
        } else {
          showToast.error("Invalid email or password. Please try again.");
        }
        break;
      case 403:
        showToast.error(
          "Your account has been suspended. Please contact support.",
        );
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
          showToast.error(
            `This account uses ${provider} sign-in. Please use the "Continue with ${provider}" button.`,
          );
        } else if (
          errorLower.includes("network") ||
          errorLower.includes("fetch failed") ||
          error?.code === "ERR_NETWORK"
        ) {
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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        showToast.success(validationMessages.auth.loginSuccess);
        setTimeout(() => {
          if (result.user?.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/platform");
          }
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
  };

  const handleGoogleLogin = () => {
    try {
      authApi.googleLogin();
    } catch (error) {
      showToast.error("Failed to initiate Google login. Please try again.");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      {/* Animated Background */}
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
            {/* LEFT SIDE - Welcome Section */}
            <div className="hidden lg:block animate-fade-in">
              {/* 1. UPDATED: Added max-w-md to reduce width of the text block */}
              <div className="space-y-6 max-w-md">
                {/* Main Heading */}
                <div>
                  <h1
                    className="text-4xl lg:text-5xl font-black mb-4 leading-tight"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Welcome to <br />
                    <span className="bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-700 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">
                      Digital Legal Advisor
                    </span>
                  </h1>
                </div>

                {/* Feature Cards */}
                <div className="space-y-3">
                  {[
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
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-3 p-3 glass-effect rounded-2xl border-2 border-white/50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-slide-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                      >
                        <feature.icon
                          className="w-5 h-5 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                      <div>
                        <h3
                          className="text-base font-bold text-gray-800 mb-0.5"
                          style={{ fontFamily: "Poppins" }}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "Inter" }}
                        >
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div
              className="w-full max-w-md mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="glass-effect p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white/50 backdrop-blur-xl">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-bold mb-2"
                      style={{ fontFamily: "Inter" }}
                    >
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
                    <label
                      htmlFor="password"
                      className="block text-gray-700 text-sm font-bold mb-2"
                      style={{ fontFamily: "Inter" }}
                    >
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
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                        disabled={isLoading}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end !mt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline transition-colors"
                      style={{ fontFamily: "Inter" }}
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Button */}
                  {/* 2. UPDATED: Reduced width (w-10/12) and centered (mx-auto block) */}
                  <button
                    type="submit"
                    className="group relative w-[75%] mx-auto flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-base font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg overflow-hidden !mt-6"
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
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <div className="flex-1 border-t-2 border-gray-200"></div>
                  <span
                    className="px-4 text-gray-500 text-sm font-semibold"
                    style={{ fontFamily: "Inter" }}
                  >
                    OR
                  </span>
                  <div className="flex-1 border-t-2 border-gray-200"></div>
                </div>

                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="group w-[75%] mx-auto bg-white border-2 border-gray-300 py-3 rounded-xl text-base font-semibold hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Inter" }}
                  disabled={isLoading}
                >
                  <img
                    src="/google-logo.png"
                    alt="Google"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-gray-700">Continue with Google</span>
                </button>

                {/* Sign Up Link */}
                <p
                  className="text-center text-sm text-gray-600 mt-5"
                  style={{ fontFamily: "Inter" }}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/signUp"
                    className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};

export default Login;
