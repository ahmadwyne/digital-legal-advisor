// import React from 'react';
// import { Card } from '@/components/ui/card';
// import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
// import { cn } from '@/lib/utils';

// export const AlertCard = ({ type, title, description, time }) => {
//   const config = {
//     info: {
//       icon: AlertCircle,
//       bgColor: 'bg-chart-1/10',
//       textColor: 'text-chart-1',
//       borderColor: 'border-chart-1/20',
//     },
//     warning: {
//       icon: AlertTriangle,
//       bgColor: 'bg-warning-light',
//       textColor: 'text-warning',
//       borderColor: 'border-warning/20',
//     },
//     success: {
//       icon: CheckCircle,
//       bgColor: 'bg-success-light',
//       textColor: 'text-success',
//       borderColor: 'border-success/20',
//     },
//   };

//   const { icon: Icon, bgColor, textColor, borderColor } = config[type] || config.info;

//   return (
//     <Card className={cn('p-4 border-l-4', bgColor, borderColor)}>
//       <div className="flex gap-3">
//         <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', textColor)} />
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2">
//             <div className="flex-1">
//               <h4 className="text-sm font-semibold text-foreground">{title}</h4>
//               <p className="text-sm text-muted-foreground mt-1">{description}</p>
//             </div>
//             {time && (
//               <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
//             )}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

import { Card } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * AlertCard Component
 * Displays system alerts with different types (info/warning/success)
 * 
 * @param {string} type - Alert type: "info", "warning", or "success"
 * @param {string} title - Alert title
 * @param {string} description - Alert description
 * @param {string} time - Time ago text (e.g., "2 hours ago")
 * @param {function} onDismiss - Optional dismiss callback
 * 
 * Features:
 * - Color-coded by type
 * - Animated entrance
 * - Optional dismiss button
 * - Theme-matched styling
 */
export const AlertCard = ({ type, title, description, time, onDismiss }) => {
  // Configuration for different alert types
  const config = {
    info: {
      icon: AlertCircle,
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-l-amber-500',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-l-green-500',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
    },
  };

  const { icon: Icon, bgColor, iconColor, titleColor, borderColor } = config[type] || config.info;

  return (
    <Card className={cn(
      'group p-4 border-l-4 border-2 border-gray-100 hover:shadow-lg transition-all duration-300',
      bgColor,
      borderColor
    )}>
      <div className="flex gap-3">
        
        {/* Icon Container */}
        <div className={cn(
          "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
          bgColor
        )}>
          <Icon className={cn('h-5 w-5 flex-shrink-0', iconColor)} strokeWidth={2.5} />
        </div>
        
        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {/* Alert Title */}
              <h4 
                className={cn("text-sm font-bold mb-1", titleColor)} 
                style={{ fontFamily: "Poppins" }}
              >
                {title}
              </h4>
              {/* Alert Description */}
              <p 
                className="text-sm text-gray-600 leading-relaxed" 
                style={{ fontFamily: "Inter" }}
              >
                {description}
              </p>
            </div>
            
            {/* Time and Dismiss Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {time && (
                <span 
                  className="text-xs text-gray-500 whitespace-nowrap font-medium" 
                  style={{ fontFamily: "Inter" }}
                >
                  {time}
                </span>
              )}
              
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Dismiss alert"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AlertCard;