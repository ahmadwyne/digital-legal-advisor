import { useState, useEffect } from 'react';
import { Navbar } from '@/components/adminlayout/Navbar';
import { Sidebar } from '@/components/adminlayout/Sidebar';
import { AdminThemeProvider } from '@/context/AdminThemeContext';
import { useAdminTheme } from '@/hooks/useAdminTheme';

/**
 * Main Admin Layout Component
 * Provides responsive layout with sidebar and navbar
 * Handles sidebar state and animations
 */
const AdminLayoutContent = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useAdminTheme();

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); // Close mobile menu on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when route changes (mobile only)
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [children, isMobile]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen, isMobile]);

  return (
    <div
      className={
        theme === "dark"
          ? "admin-shell admin-theme dark admin-dark min-h-screen"
          : "admin-shell admin-theme min-h-screen"
      }
    >
      {/* Navbar - Fixed at top */}
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex pt-16">
        {/* Sidebar - Collapsible on mobile */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* Main Content Area */}
        <main className="admin-content flex-1 p-4 sm:p-6 md:p-8 lg:p-10 w-full min-w-0 md:ml-64 transition-all duration-300">
          {/* Animated content container */}
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export const MainLayout = ({ children }) => {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminThemeProvider>
  );
};