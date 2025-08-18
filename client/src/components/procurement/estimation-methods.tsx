// client/src/components/procurement/estimation-methods.tsx
import React, { useState, useCallback } from 'react';
import { CheckCircle, TrendingUp, Calculator, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EstimationMethod {
  id: string;
  title: string;
  description: string;
  compatibility: number;
  selected: boolean;
  type: 'analogical' | 'parametric' | 'bottom-up' | 'expert-judgment';
}

interface EstimationMethodsProps {
  methods: EstimationMethod[];
  onMethodToggle: (methodId: string) => void;
  onCreateEstimate: () => void;
  isLoading?: boolean;
  className?: string;
}

const EstimationMethods: React.FC<EstimationMethodsProps> = ({
  methods,
  onMethodToggle,
  onCreateEstimate,
  isLoading = false,
  className
}) => {
  const selectedCount = methods.filter(method => method.selected).length;
  
  const getMethodIcon = (type: EstimationMethod['type']) => {
    const iconMap = {
      analogical: TrendingUp,
      parametric: Calculator,
      'bottom-up': BarChart3,
      'expert-judgment': Users,
    };
    const IconComponent = iconMap[type];
    return <IconComponent className="w-5 h-5" />;
  };

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 85) return 'text-green-400 bg-green-400/20';
    if (compatibility >= 70) return 'text-amber-400 bg-amber-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  const handleMethodClick = useCallback((methodId: string) => {
    onMethodToggle(methodId);
  }, [onMethodToggle]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, methodId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMethodClick(methodId);
    }
  }, [handleMethodClick]);

  return (
    <Card className={cn('bg-card border-secondary/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg">
            שיטות אומדן מומלצות
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            {selectedCount} נבחרו
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          בחר שיטה אחת או יותר לחישוב האומדן בהתאם לסוג הרכש ומאפייני הבקשה
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className={cn(
                'estimation-method relative cursor-pointer border-2 rounded-lg p-4 transition-all duration-300',
                'hover:border-primary hover:shadow-lg hover:-translate-y-1',
                'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
                method.selected 
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                  : 'border-muted/30 bg-card'
              )}
              onClick={() => handleMethodClick(method.id)}
              onKeyDown={(e) => handleKeyDown(e, method.id)}
              tabIndex={0}
              role="button"
              aria-pressed={method.selected}
              aria-label={`${method.title} - ${method.compatibility}% התאמה`}
            >
              {/* אינדיקטור בחירה */}
              {method.selected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* כותרת ואייקון */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'p-2 rounded-md',
                    method.selected 
                      ? 'bg-primary text-white' 
                      : 'bg-muted/20 text-muted-foreground'
                  )}>
                    {getMethodIcon(method.type)}
                  </div>
                  <h4 className="text-foreground font-semibold">
                    {method.title}
                  </h4>
                </div>
                
                <Badge 
                  className={cn(
                    'px-2 py-1 text-xs font-semibold',
                    getCompatibilityColor(method.compatibility)
                  )}
                >
                  {method.compatibility}% התאמה
                </Badge>
              </div>
              
              {/* תיאור */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {method.description}
              </p>
              
              {/* אפקט hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />
            </div>
          ))}
        </div>
        
        {/* כפתור יצירת אומדן */}
        <div className="pt-4 border-t border-muted/20">
          <Button
            onClick={onCreateEstimate}
            disabled={selectedCount === 0 || isLoading}
            className={cn(
              'w-full bg-primary text-primary-foreground hover:bg-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isLoading && 'relative'
            )}
            aria-label={
              selectedCount === 0 
                ? 'צור אומדן עלות - יש לבחור לפחות שיטה אחת'
                : `צור אומדן עלות על פי ${selectedCount} שיטות שנבחרו`
            }
          >
            {isLoading ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <span className="opacity-0">מעבד...</span>
              </>
            ) : (
              'צור אומדן עלות'
            )}
          </Button>
          
          {selectedCount === 0 && (
            <p className="text-muted-foreground text-xs text-center mt-2">
              יש לבחור לפחות שיטת אומדן אחת
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimationMethods;