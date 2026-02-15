import React from 'react';
import { RefreshCw } from 'lucide-react';

export const Loader = ({ size = 'default', text = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        default: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <RefreshCw className={`${sizeClasses[size]} animate-spin text-primary`} />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
    );
};