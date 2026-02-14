import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast"; // ✅ ADD THIS
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import { MainLayout } from "@/components/adminlayout/MainLayout";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageDatasets from "./pages/ManageDatasets";
import { ManageUsers } from "./pages/ManageUsers";
import FeedbackMonitoring from "./pages/FeedbackMonitoring";

// Public Pages
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";

// User Pages
import Platform from "./pages/Platform";
import DocumentSummarizer from "./pages/DocumentSummarizer";
import LegalPrecedents from "./pages/LegalPrecedents";
import Profile from "./pages/Profile";

// 404
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            {/* ✅ React Hot Toast Toaster */}
            <HotToaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                  zIndex: 9999,
                },
                success: {
                  duration: 3000,
                  style: {
                    background: "#10b981",
                  },
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#10b981",
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: "#ef4444",
                  },
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#ef4444",
                  },
                },
              }}
            />

            {/* ✅ Shadcn Toaster (for other components) */}
            <Toaster />

            {/* ✅ Sonner (for other components) */}
            <Sonner />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<EmailVerification />} />

              {/* Protected Routes - Regular Users (admins redirected to /admin) */}
              <Route
                path="/platform"
                element={
                  <ProtectedRoute allowAdminAccess={false}>
                    <Platform />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/document-summarizer"
                element={
                  <ProtectedRoute allowAdminAccess={false}>
                    <DocumentSummarizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/legal-precedents"
                element={
                  <ProtectedRoute allowAdminAccess={false}>
                    <LegalPrecedents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes - Protected with RoleBasedRoute and MainLayout */}
              <Route
                path="/admin"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/manage-datasets"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <MainLayout>
                      <ManageDatasets />
                    </MainLayout>
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/user-accounts"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <MainLayout>
                      <ManageUsers />
                    </MainLayout>
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/feedback-monitoring"
                element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <MainLayout>
                      <FeedbackMonitoring />
                    </MainLayout>
                  </RoleBasedRoute>
                }
              />
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
