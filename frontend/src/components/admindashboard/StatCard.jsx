import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * StatCard Component
 * Displays a metric card with icon, value, and trend indicator
 * 
 * @param {string} title - Card title (e.g., "Total Users")
 * @param {string|number} value - Main metric value
 * @param {string} change - Percentage change text (e.g., "+12%")
 * @param {Component} icon - Lucide icon component
 * @param {string} trend - Trend direction: "up" or "down"
 * 
 * Optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Smooth hover animations
 * - Gradient backgrounds matching theme
 */
export const StatCard = memo(({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === 'up';
  
  return (
    <Card className="group relative overflow-hidden p-6 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
      
      {/* Animated background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative space-y-3">
        {/* Title */}
        <p 
          className="text-xs font-bold text-gray-600 uppercase tracking-wider" 
          style={{ fontFamily: "Inter" }}
        >
          {title}
        </p>
        
        {/* Value and Icon Row */}
        <div className="flex items-center justify-between">
          {/* Main Value */}
          <h3 
            className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent" 
            style={{ fontFamily: "Poppins" }}
          >
            {value}
          </h3>
          
          {/* Icon Container */}
          {Icon && (
            <div className="relative p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
              {/* Pulse effect */}
              <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
            </div>
          )}
        </div>
        
        {/* Trend Indicator */}
        {change && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold transition-colors duration-300",
              isPositive 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            )}>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span style={{ fontFamily: "Inter" }}>{change}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium" style={{ fontFamily: "Inter" }}>
              from last month
            </span>
          </div>
        )}
      </div>

      {/* Bottom decorative bar */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 transition-all duration-500",
        isPositive 
          ? "bg-gradient-to-r from-green-500 to-emerald-500" 
          : "bg-gradient-to-r from-red-500 to-rose-500",
        "opacity-0 group-hover:opacity-100"
      )} />
    </Card>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;