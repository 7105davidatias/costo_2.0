import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CostTrendsChart from '@/components/charts/cost-trends-chart';
import AccuracyChart from '@/components/charts/accuracy-chart';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  ShoppingCart, 
  Calendar,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Users,
  Package,
  Settings,
  Maximize2,
  Minimize2,
  Move,
  RotateCcw,
  Sun,
  Moon,
  Menu,
  X,
  Eye,
  EyeOff,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingDown
} from 'lucide-react';

// Hook מותאם לניהול layout
function useDashboardLayout() {
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('dashboard-layout');
    return saved ? JSON.parse(saved) : {
      kpiCards: [
        { id: 'total-cost', x: 0, y: 0, width: 1, height: 1, visible: true },
        { id: 'accuracy', x: 1, y: 0, width: 1, height: 1, visible: true },
        { id: 'requests', x: 2, y: 0, width: 1, height: 1, visible: true },
        { id: 'savings', x: 3, y: 0, width: 1, height: 1, visible: true }
      ],
      modules: [
        { id: 'cost-trends', x: 0, y: 1, width: 2, height: 2, visible: true },
        { id: 'accuracy-chart', x: 2, y: 1, width: 2, height: 2, visible: true },
        { id: 'timeline', x: 0, y: 3, width: 4, height: 1, visible: true },
        { id: 'requests-table', x: 0, y: 4, width: 4, height: 2, visible: true }
      ]
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const updateLayout = useCallback((newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
  }, []);

  const resetLayout = useCallback(() => {
    const defaultLayout = {
      kpiCards: [
        { id: 'total-cost', x: 0, y: 0, width: 1, height: 1, visible: true },
        { id: 'accuracy', x: 1, y: 0, width: 1, height: 1, visible: true },
        { id: 'requests', x: 2, y: 0, width: 1, height: 1, visible: true },
        { id: 'savings', x: 3, y: 0, width: 1, height: 1, visible: true }
      ],
      modules: [
        { id: 'cost-trends', x: 0, y: 1, width: 2, height: 2, visible: true },
        { id: 'accuracy-chart', x: 2, y: 1, width: 2, height: 2, visible: true },
        { id: 'timeline', x: 0, y: 3, width: 4, height: 1, visible: true },
        { id: 'requests-table', x: 0, y: 4, width: 4, height: 2, visible: true }
      ]
    };
    updateLayout(defaultLayout);
  }, [updateLayout]);

  return {
    layout,
    updateLayout,
    resetLayout,
    isDragging,
    setIsDragging,
    draggedItem,
    setDraggedItem
  };
}

// רכיב KPI Card צף
function FloatingKPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description, 
  color = 'cyan',
  onToggleVisibility,
  isVisible = true,
  isDraggable = false,
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const colorClasses = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-400',
    pink: 'from-pink-500/20 to-rose-500/20 border-pink-500/40 text-pink-400',
    purple: 'from-purple-500/20 to-violet-500/20 border-purple-500/40 text-purple-400'
  };

  if (!isVisible) return null;

  return (
    <Card
      className={cn(
        "card-glass transition-all duration-500 group relative overflow-hidden cursor-pointer",
        "hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:scale-105",
        "animate-glass-float",
        isMaximized && "fixed inset-4 z-50",
        isDraggable && "cursor-move",
        colorClasses[color]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      {/* Header controls */}
      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {isDraggable && <Move className="w-4 h-4 text-cyan-400/60 cursor-grab" />}
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsMaximized(!isMaximized);
          }}
        >
          {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility?.();
          }}
        >
          {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </Button>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className={cn("w-5 h-5", `text-${color}-400`)} />
            {title}
          </CardTitle>
          {trend && (
            <Badge 
              variant={trend > 0 ? "default" : "destructive"}
              className="animate-pulse"
            >
              {trend > 0 ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
              {Math.abs(trend)}%
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold neon-text-primary mb-2">
          {value}
        </div>

        {isHovered && (
          <div className="animate-slide-in-up space-y-2">
            <Separator className="bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-cyan-400/80">היום:</div>
              <div className="text-cyan-300 font-medium">₪{(Math.random() * 10000).toFixed(0)}</div>
              <div className="text-cyan-400/80">השבוע:</div>
              <div className="text-cyan-300 font-medium">₪{(Math.random() * 50000).toFixed(0)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// רכיב Timeline בזמן אמת
function RealTimeTimeline() {
  const [events, setEvents] = useState([
    { id: 1, time: '10:30', title: 'בקשת רכש חדשה', type: 'info', icon: ShoppingCart },
    { id: 2, time: '11:15', title: 'ניתוח AI הושלם', type: 'success', icon: CheckCircle },
    { id: 3, time: '12:00', title: 'אזהרת תקציב', type: 'warning', icon: AlertTriangle },
  ]);

  // סימולציית עדכונים בזמן אמת
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        title: `עדכון בזמן אמת - ${Math.random() > 0.5 ? 'בקשה חדשה' : 'עדכון מחיר'}`,
        type: Math.random() > 0.7 ? 'warning' : 'info',
        icon: Math.random() > 0.5 ? ShoppingCart : Activity
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getEventStyles = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400 bg-green-500/20 border-green-500/40';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/40';
      default:
        return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
    }
  };

  return (
    <Card className="card-glass h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          ציר זמן בזמן אמת
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-glass border transition-all duration-300",
                "hover:scale-105 hover:shadow-lg",
                "animate-slide-in-right",
                getEventStyles(event.type)
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <event.icon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs opacity-70">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// רכיב טבלת דרישות מודרני
function ModernRequestsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const requests = [
    { id: 1, title: 'מחשבים ניידים', status: 'בעיבוד', amount: '₪50,000', date: '2024-01-15' },
    { id: 2, title: 'ציוד משרדי', status: 'הושלם', amount: '₪12,000', date: '2024-01-14' },
    { id: 3, title: 'תוכנות רישוי', status: 'ממתין', amount: '₪25,000', date: '2024-01-13' },
  ];

  const filteredRequests = requests.filter(req => 
    req.title.includes(searchTerm) && 
    (filter === 'all' || req.status === filter)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'הושלם': return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'בעיבוד': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'ממתין': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <Card className="card-glass h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            דרישות רכש אחרונות
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
              <input
                type="text"
                placeholder="חיפוש דרישות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-glass pr-10 w-48"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-glass"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="בעיבוד">בעיבוד</option>
              <option value="הושלם">הושלם</option>
              <option value="ממתין">ממתין</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredRequests.map((request, index) => (
            <div
              key={request.id}
              className={cn(
                "p-4 rounded-glass border border-cyan-500/20 transition-all duration-300",
                "hover:border-cyan-400/40 hover:shadow-lg hover:scale-102",
                "bg-gradient-to-r from-cyan-500/5 to-blue-500/5",
                "animate-slide-in-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-cyan-300 mb-1">{request.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>#{request.id}</span>
                    <span>{request.date}</span>
                    <span className="font-medium text-cyan-400">{request.amount}</span>
                  </div>
                </div>
                <Badge className={cn("border", getStatusColor(request.status))}>
                  {request.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// רכיב Sidebar מתכווץ
function CollapsibleSidebar({ isCollapsed, onToggle, isDark, onThemeToggle }) {
  const menuItems = [
    { icon: BarChart3, label: 'דשבורד', active: true },
    { icon: ShoppingCart, label: 'בקשות רכש' },
    { icon: PieChart, label: 'מחקר שוק' },
    { icon: DollarSign, label: 'הערכת עלויות' },
    { icon: Users, label: 'ספקים' },
    { icon: Settings, label: 'הגדרות' }
  ];

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full bg-black/40 backdrop-blur-xl border-l border-cyan-500/30",
      "transition-all duration-500 z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-cyan-400 neon-text-primary">
              Procurement AI
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hover:bg-cyan-500/20"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-3 rounded-glass transition-all duration-300",
                "hover:bg-cyan-500/20 hover:border-cyan-400/40 cursor-pointer",
                "border border-transparent",
                item.active && "bg-cyan-500/20 border-cyan-500/40"
              )}
            >
              <item.icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-cyan-300 font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2">
            {!isCollapsed && <Sun className="w-4 h-4 text-yellow-400" />}
            <Switch
              checked={isDark}
              onCheckedChange={onThemeToggle}
              className="data-[state=checked]:bg-cyan-500"
            />
            {!isCollapsed && <Moon className="w-4 h-4 text-blue-400" />}
          </div>
          {!isCollapsed && (
            <Label className="text-xs text-slate-400 mt-2 block">
              מצב {isDark ? 'כהה' : 'בהיר'}
            </Label>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isDark, setIsDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { layout, updateLayout, resetLayout } = useDashboardLayout();

  // שליפת נתונים
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Simulate fetching data
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        totalCost: 2847000,
        accuracy: 94.2,
        activeRequests: 47,
        savings: 341000,
        costTrends: [
          { month: 'ינואר', cost: 2847000 }, { month: 'פברואר', cost: 2900000 },
          { month: 'מרץ', cost: 2880000 }, { month: 'אפריל', cost: 3000000 },
          { month: 'מאי', cost: 3100000 }, { month: 'יוני', cost: 3050000 }
        ],
        accuracyBreakdown: [
          { label: 'דיוק אומדן', value: 94.2 }, { label: 'דיוק מחיר', value: 91.5 },
          { label: 'דיוק אספקה', value: 96.0 }
        ]
      };
    },
    refetchInterval: 30000 // עדכון כל 30 שניות
  });

  // עדכון theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const kpiData = useMemo(() => [
    {
      id: 'total-cost',
      title: 'סה"כ עלויות',
      value: `₪${stats?.totalCost?.toLocaleString() || '2,847,000'}`,
      icon: DollarSign,
      trend: 12.5,
      description: 'עלויות חודש זה',
      color: 'cyan'
    },
    {
      id: 'accuracy',
      title: 'דיוק AI',
      value: `${stats?.accuracy || '94.2'}%`,
      icon: Target,
      trend: 3.2,
      description: 'דיוק ניתוח אחרון',
      color: 'green'
    },
    {
      id: 'requests',
      title: 'בקשות פעילות',
      value: stats?.activeRequests || '47',
      icon: ShoppingCart,
      trend: -8.1,
      description: 'בקשות בעיבוד',
      color: 'pink'
    },
    {
      id: 'savings',
      title: 'חיסכון חודשי',
      value: `₪${stats?.savings?.toLocaleString() || '341,000'}`,
      icon: TrendingUp,
      trend: 15.7,
      description: 'חיסכון מול תקציב',
      color: 'purple'
    }
  ], [stats]);

  return (
    <div className={cn("min-h-screen transition-all duration-500", isDark ? "dark" : "")}>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,0,128,0.05),transparent_50%)]" />
      </div>

      {/* Sidebar */}
      <CollapsibleSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isDark={isDark}
        onThemeToggle={setIsDark}
      />

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-500 relative z-10",
        sidebarCollapsed ? "mr-16" : "mr-64"
      )}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 neon-text-primary mb-2">
                דשבורד מתקדם
              </h1>
              <p className="text-slate-400">
                ניהול רכש חכם עם AI • עדכון אחרון: {new Date().toLocaleTimeString('he-IL')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={resetLayout}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                איפוס Layout
              </Button>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 font-mono">
                  {new Date().toLocaleTimeString('he-IL')}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi) => (
              <FloatingKPICard
                key={kpi.id}
                {...kpi}
                isDraggable={true}
              />
            ))}
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {/* Cost Trends - עיצוב cyberpunk */}
            <Card className="lg:col-span-2 card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  מגמות עלויות
                  <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CostTrendsChart />
              </CardContent>
            </Card>

            {/* Accuracy Chart - אנימציות מתקדמות */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  דיוק AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AccuracyChart />
              </CardContent>
            </Card>
          </div>

          {/* Timeline & Requests */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RealTimeTimeline />
            <ModernRequestsTable />
          </div>
        </div>
      </div>
    </div>
  );
}