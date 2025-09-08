
import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'ultra-light' | 'light' | 'medium' | 'heavy';
  glow?: 'none' | 'cyan' | 'green' | 'pink';
  interactive?: boolean;
  float?: boolean;
}

const GlassContainer = React.forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ className, variant = 'medium', glow = 'none', interactive = false, float = false, children, ...props }, ref) => {
    const glassClasses = {
      'ultra-light': 'glass-ultra-light',
      'light': 'glass-light', 
      'medium': 'glass-panel',
      'heavy': 'glass-heavy'
    };

    const glowClasses = {
      'none': '',
      'cyan': 'shadow-[0_0_20px_rgba(0,255,255,0.3)]',
      'green': 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
      'pink': 'shadow-[0_0_20px_rgba(255,0,128,0.3)]'
    };

    return (
      <div
        ref={ref}
        className={cn(
          glassClasses[variant],
          glowClasses[glow],
          interactive && 'glass-interactive cursor-pointer',
          float && 'animate-glass-float',
          'rounded-glass',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassContainer.displayName = 'GlassContainer';

export { GlassContainer };
