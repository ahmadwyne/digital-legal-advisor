import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Scale,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RoleBasedComponent from "./RoleBasedComponent";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, user, logout } = useAuth();
  
  // Add ref for dropdown timer
  const dropdownTimerRef = useRef(null);

  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Handle dropdown with delay
  const handleMouseEnter = (itemName) => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 200ms delay before closing
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    {
      name: "Features",
      path: "/platform",
      dropdown: [
        { name: "AI Legal Advisor", path: "/platform#ai" },
        { name: "Document Analysis", path: "/platform#documents" },
        { name: "Case Precedents", path: "/platform#precedents" },
      ],
    },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105 flex-shrink-0 z-50"
            >
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <Scale className="w-7 h-7 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </div>
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

            {/* Desktop Navigation */}
            <nav
              className={`hidden ${isAuth ? "xl:flex" : "lg:flex"} items-center gap-2 xl:gap-4 flex-1 justify-center mx-8`}
            >
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.path}
                    className="relative text-gray-700 text-[16px] xl:text-[17px] font-semibold hover:text-blue-600 transition-all duration-300 flex items-center gap-1 px-3 xl:px-4 py-2"
                    style={{ fontFamily: "Inter" }}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-60 glass-effect rounded-2xl shadow-2xl py-3 animate-fade-in-up overflow-hidden"
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.dropdown.map((subItem, index) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-5 py-3 text-[15px] text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-200 font-medium"
                          style={{
                            fontFamily: "Inter",
                            animation: `fadeInUp 0.3s ease-out ${index * 50}ms both`,
                          }}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div
              className={`hidden ${isAuth ? "xl:flex" : "lg:flex"} items-center gap-3 flex-shrink-0`}
            >
              {isAuth ? (
                <>
                  <RoleBasedComponent allowedRoles={["admin"]}>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl text-[15px] font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      style={{ fontFamily: "Inter" }}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  </RoleBasedComponent>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-5 py-2.5 glass-effect border-2 border-blue-200 text-blue-700 rounded-xl text-[15px] font-bold hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 shadow-md"
                    style={{ fontFamily: "Inter" }}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl text-[15px] font-bold hover:from-blue-800 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse-glow"
                    style={{ fontFamily: "Inter" }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {!isLoginPage && (
                    <Link
                      to="/login"
                      className="px-6 py-2.5 glass-effect border-2 border-blue-300 text-blue-700 rounded-xl text-[15px] font-bold hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
                      style={{ fontFamily: "Inter" }}
                    >
                      Login
                    </Link>
                  )}

                  {!isSignUpPage && (
                    <Link
                      to="/signup"
                      className="group relative px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl text-[15px] font-bold hover:from-blue-800 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse-glow overflow-hidden flex items-center gap-2"
                      style={{ fontFamily: "Inter" }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="relative z-10">Get Started</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-800 hover:text-blue-600 transition-colors z-50 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] glass-effect shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="text-lg font-extrabold gradient-text-blue"
                style={{ fontFamily: "Poppins" }}
              >
                Digital Legal
              </span>
              <span
                className="text-xs font-semibold text-gray-600 -mt-1"
                style={{ fontFamily: "Inter" }}
              >
                Advisor
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 hover:text-blue-600 transition-colors"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-6">
          {navItems.map((item, index) => (
            <div key={item.name}>
              <Link
                to={item.path}
                onClick={() => !item.dropdown && setIsMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-4 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 font-semibold transition-all duration-300 text-[17px]"
                style={{
                  fontFamily: "Inter",
                  animation: `slideIn 0.3s ease-out ${index * 50}ms both`,
                }}
              >
                {item.name}
                {item.dropdown && <ChevronDown className="w-4 h-4 ml-auto" />}
              </Link>
              {item.dropdown && (
                <div className="pl-8 mt-2 space-y-1">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-[15px] text-gray-600 hover:text-blue-600 transition-colors"
                      style={{ fontFamily: "Inter" }}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isAuth ? (
            <div className="flex flex-col gap-3 mt-6 border-t border-blue-100 pt-6">
              <div
                className="px-5 py-3 glass-effect rounded-xl border border-blue-100"
                style={{ fontFamily: "Inter" }}
              >
                <p className="font-bold text-gray-800 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
              </div>

              <RoleBasedComponent allowedRoles={["admin"]}>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold shadow-lg"
                  style={{ fontFamily: "Inter" }}
                >
                  <Shield className="w-5 h-5" />
                  Admin Dashboard
                </Link>
              </RoleBasedComponent>

              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 glass-effect border-2 border-blue-300 text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all"
                style={{ fontFamily: "Inter" }}
              >
                <User className="w-5 h-5" />
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl font-bold shadow-lg"
                style={{ fontFamily: "Inter" }}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-6">
              {!isLoginPage && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-5 py-3 glass-effect border-2 border-blue-300 text-blue-700 rounded-xl font-bold text-center hover:bg-blue-50 transition-all"
                  style={{ fontFamily: "Inter" }}
                >
                  Login
                </Link>
              )}

              {!isSignUpPage && (
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-5 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl font-bold text-center shadow-lg"
                  style={{ fontFamily: "Inter" }}
                >
                  Get Started
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Header;