// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { X } from 'lucide-react';
// import {
//   LayoutDashboard,
//   Users,
//   Database,
//   MessageSquare,
// } from 'lucide-react';

// const navItems = [
//   {
//     title: 'Dashboard',
//     href: '/admin',
//     icon: LayoutDashboard,
//   },
//   {
//     title: 'Manage Legal Datasets',
//     href:  '/manage-datasets',
//     icon: Database,
//   },
//   {
//     title: 'User Accounts Management',
//     href:  '/user-accounts',
//     icon: Users,
//   },
//   {
//     title: 'Feedback Monitoring',
//     href:  '/feedback-monitoring',
//     icon: MessageSquare,
//   },
// ];

// export const Sidebar = ({ isOpen, onClose }) => {
//   const location = useLocation();

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 md:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={cn(
//           'fixed left-0 top-16 bottom-0 w-64 bg-primary border-r border-primary-hover z-40 transition-transform duration-300 ease-in-out overflow-y-auto',
//           isOpen ? 'translate-x-0' : '-translate-x-full',
//           'md:translate-x-0'
//         )}
//       >
//         {/* Mobile Close Button */}
//         <div className="md:hidden flex items-center justify-between p-4 border-b border-primary-hover">
//           <span className="text-primary-foreground font-semibold">Menu</span>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-primary-foreground hover:bg-primary-hover"
//             onClick={onClose}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </div>

//         <nav className="py-6 px-3">
//           <ul className="space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.href;

//               return (
//                 <li key={item.href}>
//                   <Link
//                     to={item.href}
//                     onClick={onClose}
//                     className={cn(
//                       'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
//                       isActive
//                         ?  'bg-primary-foreground/10 text-primary-foreground'
//                         : 'text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground'
//                     )}
//                   >
//                     <Icon className="h-5 w-5 flex-shrink-0" />
//                     <span>{item. title}</span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </aside>
//     </>
//   );
// };
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, ChevronRight } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Database,
  MessageSquare,
} from 'lucide-react';

/**
 * Navigation items configuration
 * Add new menu items here
 */
const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview & Analytics',
  },
  {
    title: 'Legal Datasets',
    href: '/admin/manage-datasets',
    icon: Database,
    description: 'Manage Database',
  },
  {
    title: 'User Management',
    href: '/admin/user-accounts',
    icon: Users,
    description: 'Account Control',
  },
  {
    title: 'Feedback',
    href: '/admin/feedback-monitoring',
    icon: MessageSquare,
    description: 'User Responses',
  },
];

/**
 * Admin Sidebar Component
 * Responsive navigation sidebar with smooth animations
 * Mobile: Slide-in overlay | Desktop: Fixed sidebar below navbar
 * ✅ FIXED: Removed overlapping footer issue on mobile
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay - Dark backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          // Base styles - ✅ FIXED: Changed to flex column layout
          'fixed left-0 top-20 bottom-0 w-64 z-[48] transition-all duration-500 ease-out',
          'flex flex-col',  // ✅ NEW: Flex layout to prevent overlap
          
          // Gradient background with glass effect
          'bg-gradient-to-b from-white via-blue-50/50 to-indigo-50/50',
          'backdrop-blur-xl border-r-2 border-blue-100/50 shadow-2xl',
          
          // Mobile: Slide animation
          isOpen ? 'translate-x-0' : '-translate-x-full',
          
          // Desktop: Always visible
          'md:translate-x-0'
        )}
      >
        {/* Mobile Header with Close Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b-2 border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
          <span className="text-white font-bold text-lg" style={{ fontFamily: "Poppins" }}>
            Menu
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Menu - ✅ FIXED: Scrollable content area */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <li 
                  key={item.href}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      // Base styles
                      'group relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden',
                      
                      // Active state
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                        : 'text-gray-700 hover:bg-white hover:shadow-md hover:scale-102',
                      
                      // Hover effects
                      !isActive && 'hover:translate-x-1'
                    )}
                    style={{ fontFamily: "Inter" }}
                  >
                    {/* Animated background on hover */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    )}
                    
                    {/* Icon with animation */}
                    <div className={cn(
                      "relative z-10 p-2 rounded-lg transition-all duration-300",
                      isActive 
                        ? "bg-white/20" 
                        : "bg-blue-100 group-hover:bg-blue-200 group-hover:rotate-12"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5 flex-shrink-0 transition-all duration-300",
                        isActive ? "text-white" : "text-blue-600 group-hover:scale-110"
                      )} />
                    </div>
                    
                    {/* Text content */}
                    <div className="relative z-10 flex-1">
                      <span className="block font-bold text-sm">
                        {item.title}
                      </span>
                      <span className={cn(
                        "text-xs transition-colors duration-300",
                        isActive ? "text-blue-100" : "text-gray-500 group-hover:text-gray-700"
                      )}>
                        {item.description}
                      </span>
                    </div>
                    
                    {/* Chevron indicator */}
                    <ChevronRight className={cn(
                      "relative z-10 h-4 w-4 transition-all duration-300",
                      isActive 
                        ? "text-white opacity-100 translate-x-0" 
                        : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    )} />
                    
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-white rounded-r-full animate-pulse" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer - ✅ FIXED: Static position at bottom */}
        <div className="flex-shrink-0 p-2 border-t-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "Poppins" }}>
                DLA
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-700 truncate" style={{ fontFamily: "Inter" }}>
                Admin Panel 
              </p>
              <p className="text-xs text-gray-500 truncate" style={{ fontFamily: "Inter" }}>
                © 2025 All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #93c5fd;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #60a5fa;
        }
      `}</style>
    </>
  );
};