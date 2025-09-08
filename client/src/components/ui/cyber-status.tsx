
import React from 'react';
import { cn } from '@/lib/utils';

interface CyberStatusProps {
  status: 'online' | 'processing' | 'error' | 'idle';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  online: { 
    color: 'bg-green-400', 
    glow: 'shadow-[0_0_10px_rgba(34,197,94,0.6)]',
    text: 'מקוון'
  },
  processing: { 
    color: 'bg-cyan-400', 
    glow: 'shadow-[0_0_10px_rgba(6,182,212,0.6)]',
    text: 'מעבד...'
  },
  error: { 
    color: 'bg-red-400', 
    glow: 'shadow-[0_0_10px_rgba(239,68,68,0.6)]',
    text: 'שגיאה'
  },
  idle: { 
    color: 'bg-gray-400', 
    glow: 'shadow-[0_0_5px_rgba(156,163,175,0.4)]',
    text: 'במתנה'
  }
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3', 
  lg: 'w-4 h-4'
};

export const CyberStatus: React.FC<CyberStatusProps> = ({ 
  status, 
  label, 
  size = 'md' 
}) => {
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-2 text-procurement-text-secondary">
      <div className={cn(
        "rounded-full animate-pulse",
        sizeConfig[size],
        config.color,
        config.glow
      )} />
      <span className="text-sm font-medium neon-text-muted">
        {label || config.text}
      </span>
    </div>
  );
};
