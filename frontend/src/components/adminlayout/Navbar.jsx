import { Menu, User, LogOut, Settings, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Scale } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Admin Navbar Component
 * Top navigation bar with consistent branding from main app
 * Features: Logo, notifications, user menu, logout
 * Matches the styling of main Header component
 */
export const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="admin-navbar fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b-2 border-blue-100/50 h-20 transition-all duration-500">
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Left Section - Mobile Menu + Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-blue-700 hover:text-blue-900 hover:bg-blue-50 transition-all duration-300 hover:scale-110 rounded-xl"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo - EXACT SAME as Header.jsx */}
            <Link
              to="/admin"
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105 flex-shrink-0"
            >
              {/* Logo Icon */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <Scale className="w-7 h-7 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              
              {/* Brand Name */}
              <div className="flex flex-col leading-tight">
                <span
                  className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent"
                  style={{ fontFamily: "Poppins" }}
                >
                  Digital Legal
                </span>
                <span
                  className="text-sm font-semibold text-gray-600 -mt-1"
                  style={{ fontFamily: "Inter" }}
                >
                  Advisor
                </span>
              </div>
            </Link>

            {/* Admin Name Badge */}
            <Link
              to="/admin/profile"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-full hover:shadow-sm transition-all"
            >
              <Shield className="w-4 h-4 text-red-600" />
              <span
                className="text-xs font-bold text-red-700 tracking-wide"
                style={{ fontFamily: "Inter" }}
              >
                {user?.firstName || 'Admin'} {user?.lastName || ''}
              </span>
            </Link>
          </div>

          {/* Right Section - Actions & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Back to Home Button (Desktop) */}
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 glass-effect border-2 border-blue-200 text-blue-700 rounded-xl text-sm font-bold hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
              style={{ fontFamily: "Inter" }}
            >
              <Scale className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            {/* Notifications Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 hover:scale-110 rounded-xl"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {/* Notification Badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-white" />
            </Button>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-all duration-300 hover:scale-105 rounded-xl border-2 border-transparent hover:border-blue-200"
                >
                  {/* User Avatar */}
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* User Info (Desktop) */}
                  <div className="hidden sm:flex flex-col items-start">
                    <span 
                      className="text-sm font-bold text-gray-800 leading-tight" 
                      style={{ fontFamily: "Inter" }}
                    >
                      {user?.firstName || 'Admin'}
                    </span>
                    <span 
                      className="text-xs text-gray-500 -mt-0.5" 
                      style={{ fontFamily: "Inter" }}
                    >
                      Administrator
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-white/95 backdrop-blur-xl border-2 border-blue-100 shadow-2xl rounded-2xl animate-scale-in p-2"
              >
                {/* User Info Header */}
                <div className="px-3 py-3 border-b-2 border-blue-100 mb-2">
                  <p 
                    className="text-sm font-bold text-gray-800 truncate" 
                    style={{ fontFamily: "Poppins" }}
                  >
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p 
                    className="text-xs text-gray-500 truncate" 
                    style={{ fontFamily: "Inter" }}
                  >
                    {user?.email}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 rounded-lg">
                    <Shield className="w-3 h-3 text-red-600" />
                    <span 
                      className="text-xs font-bold text-red-600" 
                      style={{ fontFamily: "Inter" }}
                    >
                      Admin Access
                    </span>
                  </div>
                </div>

                <DropdownMenuLabel 
                  className="text-gray-700 font-bold px-3" 
                  style={{ fontFamily: "Poppins" }}
                >
                  My Account
                </DropdownMenuLabel>
                
                <DropdownMenuItem
                  onClick={() => navigate('/admin/profile')}
                  className="cursor-pointer hover:bg-blue-50 rounded-lg transition-colors duration-300 mx-1 px-3 py-2.5"
                >
                  <User className="mr-3 h-4 w-4 text-blue-600" />
                  <span style={{ fontFamily: "Inter" }} className="font-medium">Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => navigate('/admin/settings')}
                  className="cursor-pointer hover:bg-blue-50 rounded-lg transition-colors duration-300 mx-1 px-3 py-2.5"
                >
                  <Settings className="mr-3 h-4 w-4 text-blue-600" />
                  <span style={{ fontFamily: "Inter" }} className="font-medium">Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 rounded-lg transition-colors duration-300 mx-1 px-3 py-2.5">
                  <Shield className="mr-3 h-4 w-4 text-blue-600" />
                  <span style={{ fontFamily: "Inter" }} className="font-medium">Security</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-blue-100 my-2" />
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer hover:bg-red-50 text-red-600 font-bold rounded-lg transition-all duration-300 mx-1 px-3 py-2.5 group"
                >
                  <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span style={{ fontFamily: "Inter" }}>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};