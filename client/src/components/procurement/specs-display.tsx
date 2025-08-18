// client/src/components/procurement/specs-display.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ProcurementSpec {
  id: string;
  label: string;
  value: string;
  type: 'essential' | 'advanced';
  category: 'quantity' | 'processor' | 'memory' | 'storage' | 'graphics' | 'network' | 'warranty' | 'os' | 'form-factor' | 'power';
  confidence?: number;
}

interface SpecsDisplayProps {
  specs: ProcurementSpec[];
  className?: string;
}

const SpecsDisplay: React.FC<SpecsDisplayProps> = ({ specs, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const essentialSpecs = specs.filter(spec => spec.type === 'essential');
  const advancedSpecs = specs.filter(spec => spec.type === 'advanced');
  
  const getCategoryColor = (category: ProcurementSpec['category']) => {
    const colorMap = {
      quantity: 'bg-green-500/20 border-green-500 text-green-400',
      processor: 'bg-blue-500/20 border-blue-500 text-blue-400',
      memory: 'bg-amber-500/20 border-amber-500 text-amber-400',
      storage: 'bg-pink-500/20 border-pink-500 text-pink-400',
      graphics: 'bg-purple-500/20 border-purple-500 text-purple-400',
      network: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
      warranty: 'bg-green-500/20 border-green-500 text-green-400',
      os: 'bg-blue-500/20 border-blue-500 text-blue-400',
      'form-factor': 'bg-gray-500/20 border-gray-500 text-gray-400',
      power: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    };
    return colorMap[category] || 'bg-muted/20 border-muted text-muted-foreground';
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-muted-foreground';
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-amber-400';
    return 'text-red-400';
  };

  const renderSpec = (spec: ProcurementSpec) => (
    <div 
      key={spec.id} 
      className="spec-item group transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-foreground">
          {spec.label}
        </label>
        {spec.confidence && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1">
                  <Info className="w-3 h-3 text-muted-foreground" />
                  <span className={cn(
                    'text-xs font-medium',
                    getConfidenceColor(spec.confidence)
                  )}>
                    {spec.confidence}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>רמת ביטחון בזיהוי המפרט</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className={cn(
        'border rounded-md px-3 py-2 transition-all duration-200',
        getCategoryColor(spec.category),
        'group-hover:shadow-md'
      )}>
        <span className="font-semibold">{spec.value}</span>
      </div>
    </div>
  );

  return (
    <Card className={cn('bg-card border-secondary/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg">
            מפרטים שחולצו
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-muted-foreground">
              {specs.length} מפרטים
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/90 hover:bg-primary/10"
              aria-expanded={isExpanded}
              aria-controls="advanced-specs"
            >
              <span className="mr-2">
                {isExpanded ? 'הצג פחות' : 'הצג הכל'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 transition-transform duration-300" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* מפרטים בסיסיים */}
        <div>
          <h4 className="text-foreground text-sm mb-3 font-semibold">
            מפרטים בסיסיים
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {essentialSpecs.map(renderSpec)}
          </div>
        </div>
        
        {/* מפרטים מתקדמים */}
        {advancedSpecs.length > 0 && (
          <div 
            id="advanced-specs"
            className={cn(
              'transition-all duration-500 ease-in-out overflow-hidden',
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="pt-4 border-t border-muted/20">
              <h4 className="text-foreground text-sm mb-3 font-semibold">
                מפרטים מתקדמים
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advancedSpecs.map(renderSpec)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpecsDisplay;