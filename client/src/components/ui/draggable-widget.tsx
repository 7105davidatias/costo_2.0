
import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Maximize2, 
  Minimize2, 
  X, 
  Eye, 
  EyeOff,
  Settings 
} from 'lucide-react';

interface DraggableWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isVisible: boolean;
  canResize?: boolean;
  canDrag?: boolean;
  isFloating?: boolean;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onVisibilityToggle?: () => void;
  className?: string;
}

export function DraggableWidget({
  id,
  title,
  children,
  position,
  size,
  isVisible,
  canResize = true,
  canDrag = true,
  isFloating = false,
  onPositionChange,
  onSizeChange,
  onVisibilityToggle,
  className
}: DraggableWidgetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canDrag) return;
    
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  }, [canDrag]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !canDrag) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    
    onPositionChange?.(newPosition);
  }, [isDragging, canDrag, dragOffset, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      onSizeChange?.({ width: window.innerWidth - 100, height: window.innerHeight - 100 });
    } else {
      onSizeChange?.(size);
    }
  }, [isMaximized, size, onSizeChange]);

  if (!isVisible) return null;

  return (
    <Card
      ref={widgetRef}
      className={cn(
        "widget-glass relative overflow-hidden transition-all duration-300",
        isDragging && "cursor-grabbing shadow-[0_0_40px_rgba(0,255,255,0.6)] scale-105",
        isFloating && "fixed z-50",
        !isFloating && "absolute",
        isMaximized && "fixed inset-4 z-50",
        className
      )}
      style={{
        left: isFloating || isMaximized ? undefined : position.x,
        top: isFloating || isMaximized ? undefined : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
        transform: isDragging ? 'rotateX(5deg) rotateY(2deg)' : 'none'
      }}
    >
      {/* Header with Controls */}
      <div className="widget-header flex items-center justify-between p-3 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80">
        <div className="flex items-center space-x-reverse space-x-3">
          {canDrag && (
            <button
              onMouseDown={handleMouseDown}
              className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-cyan-500/10 transition-colors"
            >
              <GripVertical className="w-4 h-4 text-cyan-400" />
            </button>
          )}
          <h3 className="font-semibold text-cyan-400 text-sm neon-text-primary">
            {title}
          </h3>
          <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-300">
            {id}
          </Badge>
        </div>

        <div className="flex items-center space-x-reverse space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVisibilityToggle}
            className="w-6 h-6 p-0 hover:bg-cyan-500/10"
          >
            {isVisible ? (
              <Eye className="w-3 h-3 text-cyan-400" />
            ) : (
              <EyeOff className="w-3 h-3 text-slate-400" />
            )}
          </Button>
          
          {canResize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMaximize}
              className="w-6 h-6 p-0 hover:bg-cyan-500/10"
            >
              {isMaximized ? (
                <Minimize2 className="w-3 h-3 text-cyan-400" />
              ) : (
                <Maximize2 className="w-3 h-3 text-cyan-400" />
              )}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 hover:bg-red-500/20"
          >
            <Settings className="w-3 h-3 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="widget-content p-4 h-full overflow-auto">
        {children}
      </div>

      {/* Resize Handle */}
      {canResize && !isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-transparent via-cyan-400/30 to-cyan-400/60 rounded-tl-lg" />
        </div>
      )}

      {/* Glass Effect Overlay */}
      <div className="widget-glow absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 rounded-lg" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      </div>
    </Card>
  );
}
