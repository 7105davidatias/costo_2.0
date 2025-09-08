
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Info, Search, Filter, Zap, Eye, EyeOff, Settings, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

type ViewMode = 'compact' | 'detailed' | 'grid';
type FilterMode = 'all' | 'essential' | 'advanced' | 'high-confidence';

const SpecsDisplay: React.FC<SpecsDisplayProps> = ({ specs, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  
  // Progressive disclosure states
  const [expandedSpecs, setExpandedSpecs] = useState<Set<string>>(new Set());
  const [hoveredSpec, setHoveredSpec] = useState<string | null>(null);

  const essentialSpecs = specs.filter(spec => spec.type === 'essential');
  const advancedSpecs = specs.filter(spec => spec.type === 'advanced');
  
  // Enhanced filtering and search
  const filteredSpecs = useMemo(() => {
    let filtered = specs;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(spec => 
        spec.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spec.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterMode !== 'all') {
      if (filterMode === 'essential') {
        filtered = filtered.filter(spec => spec.type === 'essential');
      } else if (filterMode === 'advanced') {
        filtered = filtered.filter(spec => spec.type === 'advanced');
      } else if (filterMode === 'high-confidence') {
        filtered = filtered.filter(spec => spec.confidence && spec.confidence >= 90);
      }
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(spec => spec.category === selectedCategory);
    }

    return filtered;
  }, [specs, searchQuery, filterMode, selectedCategory]);

  const categories = useMemo(() => {
    const allCategories = [...new Set(specs.map(spec => spec.category))];
    return allCategories.sort();
  }, [specs]);

  const getCategoryColor = (category: ProcurementSpec['category']) => {
    const colorMap = {
      quantity: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
      processor: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      memory: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
      storage: 'bg-pink-500/20 border-pink-500/50 text-pink-400',
      graphics: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
      network: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
      warranty: 'bg-green-500/20 border-green-500/50 text-green-400',
      os: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400',
      'form-factor': 'bg-gray-500/20 border-gray-500/50 text-gray-400',
      power: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    };
    return colorMap[category] || 'bg-muted/20 border-muted/50 text-muted-foreground';
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-muted-foreground';
    if (confidence >= 95) return 'text-emerald-400';
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-amber-400';
    if (confidence >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    let label = '';
    
    if (confidence >= 95) {
      variant = 'default';
      label = 'מעולה';
    } else if (confidence >= 90) {
      variant = 'secondary';
      label = 'גבוה';
    } else if (confidence >= 75) {
      variant = 'outline';
      label = 'טוב';
    } else {
      variant = 'destructive';
      label = 'נמוך';
    }

    return (
      <Badge variant={variant} className="text-xs">
        {confidence}% {label}
      </Badge>
    );
  };

  const toggleSpecExpansion = (specId: string) => {
    setExpandedSpecs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(specId)) {
        newSet.delete(specId);
      } else {
        newSet.add(specId);
      }
      return newSet;
    });
  };

  const renderSpec = (spec: ProcurementSpec, index: number) => {
    const isExpanded = expandedSpecs.has(spec.id);
    const isHovered = hoveredSpec === spec.id;
    
    return (
      <div 
        key={spec.id} 
        className={cn(
          'spec-item group transition-all duration-300 transform',
          'hover:scale-[1.02] hover:z-10',
          isHovered && 'scale-[1.02] z-10'
        )}
        style={{ animationDelay: `${index * 50}ms` }}
        onMouseEnter={() => setHoveredSpec(spec.id)}
        onMouseLeave={() => setHoveredSpec(null)}
      >
        <div className={cn(
          'relative overflow-hidden border rounded-glass transition-all duration-300',
          'bg-card/80 backdrop-blur-sm',
          getCategoryColor(spec.category),
          isHovered && 'shadow-[0_0_20px_rgba(0,255,255,0.2)] border-cyan-400/50',
          isExpanded && 'ring-2 ring-cyan-400/30'
        )}>
          {/* Animated background */}
          <div className={cn(
            'absolute inset-0 opacity-0 transition-opacity duration-300',
            'bg-gradient-to-r from-transparent via-white/5 to-transparent',
            isHovered && 'opacity-100'
          )} />

          <div className="relative z-10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <label className="block text-sm font-medium text-foreground">
                  {spec.label}
                </label>
                {spec.type === 'essential' && (
                  <Zap className="w-3 h-3 text-amber-400" />
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {spec.confidence && getConfidenceBadge(spec.confidence)}
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSpecExpansion(spec.id)}
                        className="h-6 w-6 p-0 hover:bg-cyan-500/20"
                      >
                        {isExpanded ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isExpanded ? 'הסתר פרטים' : 'הצג פרטים'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className={cn(
                'p-3 rounded-md transition-all duration-300',
                getCategoryColor(spec.category),
                'group-hover:shadow-inner'
              )}>
                <span className="font-semibold text-sm">{spec.value}</span>
              </div>

              {/* Progressive Disclosure */}
              {isExpanded && (
                <div className={cn(
                  'mt-3 p-3 bg-muted/10 rounded-md border border-muted/20',
                  'animate-in slide-in-from-top-2 duration-300'
                )}>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">קטגוריה:</span>
                      <span className="mr-1 font-medium">{spec.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">סוג:</span>
                      <span className="mr-1 font-medium">
                        {spec.type === 'essential' ? 'בסיסי' : 'מתקדם'}
                      </span>
                    </div>
                    {spec.confidence && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">רמת ביטחון:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                'h-full transition-all duration-500',
                                spec.confidence >= 90 ? 'bg-green-400' :
                                spec.confidence >= 75 ? 'bg-amber-400' : 'bg-red-400'
                              )}
                              style={{ width: `${spec.confidence}%` }}
                            />
                          </div>
                          <span className={cn(
                            'text-xs font-medium',
                            getConfidenceColor(spec.confidence)
                          )}>
                            {spec.confidence}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn('bg-card/90 backdrop-blur-md border-secondary/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg flex items-center">
            <Sparkles className="w-5 h-5 ml-2 text-primary animate-pulse" />
            מפרטים שחולצו
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-muted-foreground">
              {filteredSpecs.length} מתוך {specs.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-primary hover:text-primary/90 hover:bg-primary/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Controls */}
        {showSettings && (
          <div className={cn(
            'space-y-4 p-4 bg-muted/10 rounded-glass border border-muted/20',
            'animate-in slide-in-from-top-2 duration-300'
          )}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חפש מפרטים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-card/50 border-muted/30"
                />
              </div>

              {/* Filter by type */}
              <Select value={filterMode} onValueChange={(value: FilterMode) => setFilterMode(value)}>
                <SelectTrigger className="bg-card/50 border-muted/30">
                  <SelectValue placeholder="סנן לפי סוג" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המפרטים</SelectItem>
                  <SelectItem value="essential">בסיסיים</SelectItem>
                  <SelectItem value="advanced">מתקדמים</SelectItem>
                  <SelectItem value="high-confidence">ביטחון גבוה</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter by category */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-card/50 border-muted/30">
                  <SelectValue placeholder="סנן לפי קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">תצוגה:</span>
              <div className="flex space-x-1">
                {['compact', 'detailed', 'grid'].map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode(mode as ViewMode)}
                    className="text-xs"
                  >
                    {mode === 'compact' && 'קומפקטי'}
                    {mode === 'detailed' && 'מפורט'}
                    {mode === 'grid' && 'רשת'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {filteredSpecs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">לא נמצאו מפרטים התואמים לחיפוש</p>
          </div>
        ) : (
          <>
            {/* Essential Specs */}
            {filteredSpecs.some(spec => spec.type === 'essential') && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-foreground text-sm font-semibold flex items-center">
                    <Zap className="w-4 h-4 ml-2 text-amber-400" />
                    מפרטים בסיסיים
                  </h4>
                  <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                    {filteredSpecs.filter(spec => spec.type === 'essential').length}
                  </Badge>
                </div>
                
                <div className={cn(
                  'grid gap-4',
                  viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3' :
                  viewMode === 'compact' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                  'grid-cols-1 md:grid-cols-2'
                )}>
                  {filteredSpecs
                    .filter(spec => spec.type === 'essential')
                    .map((spec, index) => renderSpec(spec, index))}
                </div>
              </div>
            )}

            {/* Advanced Specs */}
            {filteredSpecs.some(spec => spec.type === 'advanced') && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-foreground text-sm font-semibold flex items-center">
                    <Settings className="w-4 h-4 ml-2 text-cyan-400" />
                    מפרטים מתקדמים
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400/50">
                      {filteredSpecs.filter(spec => spec.type === 'advanced').length}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-primary hover:text-primary/90 hover:bg-primary/10"
                    >
                      <span className="mr-2">
                        {isExpanded ? 'הסתר' : 'הצג הכל'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div 
                  className={cn(
                    'transition-all duration-500 ease-in-out overflow-hidden',
                    isExpanded ? 'max-h-none opacity-100' : 'max-h-48 opacity-60'
                  )}
                >
                  <div className={cn(
                    'grid gap-4',
                    viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3' :
                    viewMode === 'compact' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                    'grid-cols-1 md:grid-cols-2'
                  )}>
                    {filteredSpecs
                      .filter(spec => spec.type === 'advanced')
                      .map((spec, index) => renderSpec(spec, index))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SpecsDisplay;
