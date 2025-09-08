import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, PiggyBank, TrendingDown, Bot, Plus, Eye, Calculator,
  Coins, TriangleAlert, CheckCircle, Clock, Users, Package, FileText,
  Target, RefreshCw, Download, Brain, Menu, X, Grid3X3,
  BarChart3, PieChart, Activity, Settings, Bell, Search,
  ChevronLeft, ChevronRight, Maximize2, Minimize2
} from "lucide-react";
import CostTrendsChart from "@/components/charts/cost-trends-chart";
import AccuracyChart from "@/components/charts/accuracy-chart";
import { Link } from "wouter";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DashboardSkeleton } from '@/components/ui/enhanced-skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DashboardStats {
  totalEstimatedCosts: number;
  totalSavings: number;
  risingCosts: number;
  accuracyScore: number;
  recentRequests: any[];
  costTrends: { month: string; cost: number }[];
  accuracyBreakdown: { label: string; value: number }[];
  avgSavingsPercentage: number;
  avgDeliveryTime: number;
  supplierSatisfactionScore: number;
  categoryBreakdown: { category: string; amount: number; color: string }[];
  accuracyTrends: { month: string; accuracy: number }[];
  supplierPerformance: { supplier: string; rating: number; orders: number; avgDeliveryTime: number }[];
  requestsCount?: number;
  avgConfidence?: number;
}

interface RealTimeStats {
  totalBudget: number;
  completedProcurements: number;
  activeProcurements: number;
  pendingApprovals: number;
  totalSuppliers: number;
  avgResponseTime: number;
}

// מודול קרד צף עם יכולת גרירה
const FloatingKPICard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
  isExpanded = false,
  onToggleExpand,
  children
}: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <Card
      className={`floating-kpi-card ${color} ${isDragging ? 'dragging' : ''} ${isExpanded ? 'expanded' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging ? 1000 : 'auto'
      }}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        const rect = e.currentTarget.getBoundingClientRect();
        const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setPosition({
            x: e.clientX - parentRect.left - rect.width / 2,
            y: e.clientY - parentRect.top - rect.height / 2
          });
        }
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className={`icon-container ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-sm font-medium text-slate-300">
            {title}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="h-6 w-6 p-0 hover:bg-white/10"
        >
          {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-white neon-glow">
            {value}
          </div>
          {change && (
            <p className="text-xs text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        {isExpanded && children && (
          <div className="mt-4 pt-4 border-t border-white/20">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// סידבר דינמי מתכווץ
const DynamicSidebar = ({ isCollapsed, onToggle }: any) => {
  const navigationItems = [
    { icon: Grid3X3, label: "דשבורד", href: "/", active: true },
    { icon: Package, label: "דרישות רכש", href: "/procurement-requests" },
    { icon: BarChart3, label: "אומדני עלויות", href: "/cost-estimation" },
    { icon: PieChart, label: "מחקר שוק", href: "/market-research" },
    { icon: FileText, label: "דוחות", href: "/reports" },
    { icon: Target, label: "שיטות אומדן", href: "/estimation-methods" },
    { icon: Settings, label: "הגדרות", href: "/settings" }
  ];

  return (
    <div className={`dynamic-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* כותרת סידבר */}
      <div className="sidebar-header">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-white neon-glow">
              מערכת רכש
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-white/10"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* ניווט */}
      <nav className="sidebar-nav">
        <ul className="space-y-2 px-3">
          {navigationItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={`sidebar-nav-item ${item.active ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* אזור מידע מהיר */}
      {!isCollapsed && (
        <div className="sidebar-quick-info">
          <div className="p-4 border-t border-white/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">התראות פעילות</span>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                  3
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">דרישות ממתינות</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  12
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// מפת חום אינטראקטיבית
const InteractiveHeatmap = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [hoveredCell, setHoveredCell] = useState<any>(null);

  const heatmapData = [
    { day: 'א', week1: 85, week2: 92, week3: 78, week4: 95 },
    { day: 'ב', week1: 78, week2: 88, week3: 85, week4: 82 },
    { day: 'ג', week1: 92, week2: 75, week3: 90, week4: 88 },
    { day: 'ד', week1: 88, week2: 95, week3: 87, week4: 91 },
    { day: 'ה', week1: 75, week2: 82, week3: 94, week4: 78 },
    { day: 'ו', week1: 82, week2: 78, week3: 85, week4: 85 },
    { day: 'ש', week1: 68, week2: 85, week3: 82, week4: 88 }
  ];

  const getHeatColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-500/80';
    if (value >= 80) return 'bg-yellow-500/80';
    if (value >= 70) return 'bg-orange-500/80';
    return 'bg-red-500/80';
  };

  return (
    <Card className="interactive-heatmap glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-emerald-400" />
            מפת פעילות מערכת
          </CardTitle>
          <div className="flex space-x-2">
            {['day', 'week', 'month'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {period === 'day' ? 'יום' : period === 'week' ? 'שבוע' : 'חודש'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {heatmapData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center space-x-2">
              <span className="text-sm text-slate-400 w-6">{row.day}</span>
              <div className="flex space-x-1">
                {['week1', 'week2', 'week3', 'week4'].map((week, colIndex) => (
                  <div
                    key={colIndex}
                    className={`heatmap-cell ${getHeatColor(row[week as keyof typeof row] as number)}`}
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex, value: row[week as keyof typeof row] })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && (
                      <div className="heatmap-tooltip">
                        {hoveredCell.value}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <span>פחות</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-slate-600/40 rounded"></div>
            <div className="w-3 h-3 bg-red-500/40 rounded"></div>
            <div className="w-3 h-3 bg-orange-500/40 rounded"></div>
            <div className="w-3 h-3 bg-yellow-500/40 rounded"></div>
            <div className="w-3 h-3 bg-emerald-500/40 rounded"></div>
          </div>
          <span>יותר</span>
        </div>
      </CardContent>
    </Card>
  );
};

// טיימליין זמן אמת
const RealTimeTimeline = () => {
  const [realtimeEvents] = useState([
    { id: 1, time: '14:23', event: 'הגשת דרישת רכש חדשה', type: 'new', user: 'יוסי כהן' },
    { id: 2, time: '14:15', event: 'אישור אומדן עלות', type: 'approved', user: 'מערכת AI' },
    { id: 3, time: '14:08', event: 'עדכון מחיר ספק', type: 'update', user: 'דן לוי' },
    { id: 4, time: '13:45', event: 'השלמת הזמנת רכש', type: 'completed', user: 'רחל אברהם' },
    { id: 5, time: '13:30', event: 'התראת תקציב', type: 'alert', user: 'מערכת' }
  ]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'new': return <Plus className="h-3 w-3 text-blue-400" />;
      case 'approved': return <CheckCircle className="h-3 w-3 text-emerald-400" />;
      case 'update': return <RefreshCw className="h-3 w-3 text-yellow-400" />;
      case 'completed': return <Package className="h-3 w-3 text-green-400" />;
      case 'alert': return <Bell className="h-3 w-3 text-red-400" />;
      default: return <Activity className="h-3 w-3 text-slate-400" />;
    }
  };

  return (
    <Card className="realtime-timeline glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-400" />
          זמן אמת
          <div className="ml-auto">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-400">Live</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {realtimeEvents.map((event) => (
            <div key={event.id} className="timeline-event">
              <div className="flex items-start space-x-3">
                <div className="timeline-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white truncate">
                      {event.event}
                    </p>
                    <span className="text-xs text-slate-400 shrink-0">
                      {event.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {event.user}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard/stats"],
  });

  const { data: realTimeStats } = useQuery<RealTimeStats>({
    queryKey: ["dashboard/realtime"],
    refetchInterval: 30000,
  });

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <DynamicSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="dashboard-main">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const dashboardStats = stats || {
    totalEstimatedCosts: 4250000,
    totalSavings: 361250,
    risingCosts: 150000,
    accuracyScore: 91.2,
    recentRequests: [],
    costTrends: [],
    accuracyBreakdown: [],
    avgSavingsPercentage: 8.5,
    avgDeliveryTime: 45,
    supplierSatisfactionScore: 4.6,
    categoryBreakdown: [],
    accuracyTrends: [],
    supplierPerformance: [],
    requestsCount: 50,
    avgConfidence: 92.5
  };

  return (
    <div className="dashboard-container modern-layout">
      {/* סידבר דינמי */}
      <DynamicSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* תוכן ראשי */}
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        {/* כותרת עליונה */}
        <div className="dashboard-header">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold text-white neon-glow">
                מערכת ניהול רכש חכמה
              </h1>
              <p className="text-slate-400 mt-1">
                ניתוח ואומדן עלויות מתקדם עם בינה מלאכותית
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                חיפוש מהיר
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                התראות
              </Button>
              <Button className="glass-button">
                <Download className="h-4 w-4 mr-2" />
                ייצא נתונים
              </Button>
            </div>
          </div>
        </div>

        {/* אזור KPI קרדים צפים */}
        <div className="floating-cards-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            <FloatingKPICard
              title="עלויות מוערכות"
              value={formatCurrency(dashboardStats.totalEstimatedCosts)}
              change="+12.5% מהחודש הקודם"
              icon={Calculator}
              color="blue"
              isExpanded={expandedCards.has('costs')}
              onToggleExpand={() => toggleCardExpansion('costs')}
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">בעיבוד</span>
                  <span className="text-white">₪2.1M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">מאושר</span>
                  <span className="text-white">₪2.15M</span>
                </div>
              </div>
            </FloatingKPICard>

            <FloatingKPICard
              title="חיסכון כולל"
              value={formatCurrency(dashboardStats.totalSavings)}
              change={`${dashboardStats.avgSavingsPercentage.toFixed(1)}% חיסכון`}
              icon={PiggyBank}
              color="green"
              isExpanded={expandedCards.has('savings')}
              onToggleExpand={() => toggleCardExpansion('savings')}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {dashboardStats.avgSavingsPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">ממוצע חיסכון</div>
              </div>
            </FloatingKPICard>

            <FloatingKPICard
              title="זמן אספקה"
              value={`${dashboardStats.avgDeliveryTime} ימים`}
              change="שיפור של 3 ימים"
              icon={Clock}
              color="amber"
              isExpanded={expandedCards.has('delivery')}
              onToggleExpand={() => toggleCardExpansion('delivery')}
            >
              <div className="space-y-1">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-slate-400 text-center">75% עמידה ביעד</div>
              </div>
            </FloatingKPICard>

            <FloatingKPICard
              title="דיוק AI"
              value={`${dashboardStats.accuracyScore.toFixed(1)}%`}
              change="ביצועים מעולים"
              icon={Bot}
              color="purple"
              isExpanded={expandedCards.has('accuracy')}
              onToggleExpand={() => toggleCardExpansion('accuracy')}
            >
              <div className="text-center space-y-2">
                <div className="text-sm text-slate-300">דירוג איכות</div>
                <div className="flex justify-center space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <div key={star} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  ))}
                </div>
              </div>
            </FloatingKPICard>
          </div>
        </div>

        {/* אזור גרפיקות ומפות */}
        <div className="charts-grid p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* מפת חום אינטראקטיבית */}
            <div className="lg:col-span-1">
              <InteractiveHeatmap />
            </div>

            {/* טיימליין זמן אמת */}
            <div className="lg:col-span-1">
              <RealTimeTimeline />
            </div>

            {/* גרף דיוק מתקדם */}
            <div className="lg:col-span-1">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                    ביצועי מערכת
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <AccuracyChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* גרף מגמות עלויות רחב */}
        <div className="cost-trends-section p-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-400" />
                מגמות עלויות ותחזיות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <CostTrendsChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, PiggyBank, TrendingDown, Bot, Plus, Eye, Calculator, 
  Coins, TriangleAlert, CheckCircle, Clock, Users, Package, FileText, 
  Target, RefreshCw, Download, Brain, Menu, X, Grid3X3, 
  BarChart3, PieChart, Activity, Settings, Bell, Search,
  ChevronLeft, ChevronRight, Maximize2, Minimize2
} from "lucide-react";
import CostTrendsChart from "@/components/charts/cost-trends-chart";
import AccuracyChart from "@/components/charts/accuracy-chart";
import { Link } from "wouter";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DashboardSkeleton } from '@/components/ui/enhanced-skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DashboardStats {
  totalEstimatedCosts: number;
  totalSavings: number;
  risingCosts: number;
  accuracyScore: number;
  recentRequests: any[];
  costTrends: { month: string; cost: number }[];
  accuracyBreakdown: { label: string; value: number }[];
  avgSavingsPercentage: number;
  avgDeliveryTime: number;
  supplierSatisfactionScore: number;
  categoryBreakdown: { category: string; amount: number; color: string }[];
  accuracyTrends: { month: string; accuracy: number }[];
  supplierPerformance: { supplier: string; rating: number; orders: number; avgDeliveryTime: number }[];
  requestsCount?: number;
  avgConfidence?: number;
}

interface RealTimeStats {
  totalBudget: number;
  completedProcurements: number;
  activeProcurements: number;
  pendingApprovals: number;
  totalSuppliers: number;
  avgResponseTime: number;
}

// מודול קרד צף עם יכולת גרירה
const FloatingKPICard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "blue",
  isExpanded = false,
  onToggleExpand,
  children
}: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <Card 
      className={`floating-kpi-card ${color} ${isDragging ? 'dragging' : ''} ${isExpanded ? 'expanded' : ''}`}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging ? 1000 : 'auto'
      }}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        const rect = e.currentTarget.getBoundingClientRect();
        const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setPosition({
            x: e.clientX - parentRect.left - rect.width / 2,
            y: e.clientY - parentRect.top - rect.height / 2
          });
        }
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className={`icon-container ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-sm font-medium text-slate-300">
            {title}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="h-6 w-6 p-0 hover:bg-white/10"
        >
          {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-white neon-glow">
            {value}
          </div>
          {change && (
            <p className="text-xs text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        {isExpanded && children && (
          <div className="mt-4 pt-4 border-t border-white/20">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// סידבר דינמי מתכווץ
const DynamicSidebar = ({ isCollapsed, onToggle }: any) => {
  const navigationItems = [
    { icon: Grid3X3, label: "דשבורד", href: "/", active: true },
    { icon: Package, label: "דרישות רכש", href: "/procurement-requests" },
    { icon: BarChart3, label: "אומדני עלויות", href: "/cost-estimation" },
    { icon: PieChart, label: "מחקר שוק", href: "/market-research" },
    { icon: FileText, label: "דוחות", href: "/reports" },
    { icon: Target, label: "שיטות אומדן", href: "/estimation-methods" },
    { icon: Settings, label: "הגדרות", href: "/settings" }
  ];

  return (
    <div className={`dynamic-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* כותרת סידבר */}
      <div className="sidebar-header">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-white neon-glow">
              מערכת רכש
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-white/10"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* ניווט */}
      <nav className="sidebar-nav">
        <ul className="space-y-2 px-3">
          {navigationItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={`sidebar-nav-item ${item.active ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* אזור מידע מהיר */}
      {!isCollapsed && (
        <div className="sidebar-quick-info">
          <div className="p-4 border-t border-white/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">התראות פעילות</span>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                  3
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">דרישות ממתינות</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  12
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// מפת חום אינטראקטיבית
const InteractiveHeatmap = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [hoveredCell, setHoveredCell] = useState<any>(null);

  const heatmapData = [
    { day: 'א', week1: 85, week2: 92, week3: 78, week4: 95 },
    { day: 'ב', week1: 78, week2: 88, week3: 85, week4: 82 },
    { day: 'ג', week1: 92, week2: 75, week3: 90, week4: 88 },
    { day: 'ד', week1: 88, week2: 95, week3: 87, week4: 91 },
    { day: 'ה', week1: 75, week2: 82, week3: 94, week4: 78 },
    { day: 'ו', week1: 82, week2: 78, week3: 85, week4: 85 },
    { day: 'ש', week1: 68, week2: 85, week3: 82, week4: 88 }
  ];

  const getHeatColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-500/80';
    if (value >= 80) return 'bg-yellow-500/80';
    if (value >= 70) return 'bg-orange-500/80';
    return 'bg-red-500/80';
  };

  return (
    <Card className="interactive-heatmap glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-emerald-400" />
            מפת פעילות מערכת
          </CardTitle>
          <div className="flex space-x-2">
            {['day', 'week', 'month'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {period === 'day' ? 'יום' : period === 'week' ? 'שבוע' : 'חודש'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {heatmapData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center space-x-2">
              <span className="text-sm text-slate-400 w-6">{row.day}</span>
              <div className="flex space-x-1">
                {['week1', 'week2', 'week3', 'week4'].map((week, colIndex) => (
                  <div
                    key={colIndex}
                    className={`heatmap-cell ${getHeatColor(row[week as keyof typeof row] as number)}`}
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex, value: row[week as keyof typeof row] })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && (
                      <div className="heatmap-tooltip">
                        {hoveredCell.value}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <span>פחות</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-slate-600/40 rounded"></div>
            <div className="w-3 h-3 bg-red-500/40 rounded"></div>
            <div className="w-3 h-3 bg-orange-500/40 rounded"></div>
            <div className="w-3 h-3 bg-yellow-500/40 rounded"></div>
            <div className="w-3 h-3 bg-emerald-500/40 rounded"></div>
          </div>
          <span>יותר</span>
        </div>
      </CardContent>
    </Card>
  );
};

// טיימליין זמן אמת
const RealTimeTimeline = () => {
  const [realtimeEvents] = useState([
    { id: 1, time: '14:23', event: 'הגשת דרישת רכש חדשה', type: 'new', user: 'יוסי כהן' },
    { id: 2, time: '14:15', event: 'אישור אומדן עלות', type: 'approved', user: 'מערכת AI' },
    { id: 3, time: '14:08', event: 'עדכון מחיר ספק', type: 'update', user: 'דן לוי' },
    { id: 4, time: '13:45', event: 'השלמת הזמנת רכש', type: 'completed', user: 'רחל אברהם' },
    { id: 5, time: '13:30', event: 'התראת תקציב', type: 'alert', user: 'מערכת' }
  ]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'new': return <Plus className="h-3 w-3 text-blue-400" />;
      case 'approved': return <CheckCircle className="h-3 w-3 text-emerald-400" />;
      case 'update': return <RefreshCw className="h-3 w-3 text-yellow-400" />;
      case 'completed': return <Package className="h-3 w-3 text-green-400" />;
      case 'alert': return <Bell className="h-3 w-3 text-red-400" />;
      default: return <Activity className="h-3 w-3 text-slate-400" />;
    }
  };

  return (
    <Card className="realtime-timeline glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-400" />
          זמן אמת
          <div className="ml-auto">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-400">Live</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {realtimeEvents.map((event) => (
            <div key={event.id} className="timeline-event">
              <div className="flex items-start space-x-3">
                <div className="timeline-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white truncate">
                      {event.event}
                    </p>
                    <span className="text-xs text-slate-400 shrink-0">
                      {event.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {event.user}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard/stats"],
  });

  const { data: realTimeStats } = useQuery<RealTimeStats>({
    queryKey: ["dashboard/realtime"],
    refetchInterval: 30000,
  });

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <DynamicSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="dashboard-main">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const dashboardStats = stats || {
    totalEstimatedCosts: 4250000,
    totalSavings: 361250,
    risingCosts: 150000,
    accuracyScore: 91.2,
    recentRequests: [],
    costTrends: [],
    accuracyBreakdown: [],
    avgSavingsPercentage: 8.5,
    avgDeliveryTime: 45,
    supplierSatisfactionScore: 4.6,
    categoryBreakdown: [],
    accuracyTrends: [],
    supplierPerformance: [],
    requestsCount: 50,
    avgConfidence: 92.5
  };

  return (
    <div className="dashboard-container modern-layout">
      {/* סידבר דינמי */}
      <DynamicSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* תוכן ראשי */}
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        {/* כותרת עליונה */}
        <div className="dashboard-header">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold text-white neon-glow">
                מערכת ניהול רכש חכמה
              </h1>
              <p className="text-slate-400 mt-1">
                ניתוח ואומדן עלויות מתקדם עם בינה מלאכותית
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                חיפוש מהיר
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                התראות
              </Button>
              <Button className="glass-button">
                <Download className="h-4 w-4 mr-2" />
                ייצא נתונים
              </Button>
            </div>
          </div>
        </div>

        {/* אזור KPI קרדים צפים */}
        <div className="floating-cards-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            <FloatingKPICard
              title="עלויות מוערכות"
              value={formatCurrency(dashboardStats.totalEstimatedCosts)}
              change="+12.5% מהחודש הקודם"
              icon={Calculator}
              color="blue"
              isExpanded={expandedCards.has('costs')}
              onToggleExpand={() => toggleCardExpansion('costs')}
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">בעיבוד</span>
                  <span className="text-white">₪2.1M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">מאושר</span>
                  <span className="text-white">₪2.15M</span>
                </div>
              </div>
            </FloatingKPICard>

            <FloatingKPICard
              title="חיסכון כולל"
              value={formatCurrency(dashboardStats.totalSavings)}
              change={`${dashboardStats.avgSavingsPercentage.toFixed(1)}% חיסכון`}
              icon={PiggyBank}
              color="green"
              isExpanded={expandedCards.has('savings')}
              onToggleExpand={() => toggleCardExpansion('savings')}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {dashboardStats.avgSavingsPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">ממוצע חיסכון</div>
              </div>
            </FloatingKPICard>

            <FloatingKPICard
              title="זמן אספקה"
              value={`${dashboardStats.avgDeliveryTime} ימים`}
              change="שיפור של 3 ימים"
              icon={Clock}
              color="amber"
              isExpanded={expandedCards.has('delivery')}
              onToggleExpand={() => toggleCardExpansion('delivery')}
            >
              <div className="space-y-1">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-slate-400 text-center">75% עמידה ביעד</div>
              </div>
            </FloatingKPICard>

            <FloatingKPICard
              title="דיוק AI"
              value={`${dashboardStats.accuracyScore.toFixed(1)}%`}
              change="ביצועים מעולים"
              icon={Bot}
              color="purple"
              isExpanded={expandedCards.has('accuracy')}
              onToggleExpand={() => toggleCardExpansion('accuracy')}
            >
              <div className="text-center space-y-2">
                <div className="text-sm text-slate-300">דירוג איכות</div>
                <div className="flex justify-center space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <div key={star} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  ))}
                </div>
              </div>
            </FloatingKPICard>
          </div>
        </div>

        {/* אזור גרפיקות ומפות */}
        <div className="charts-grid p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* מפת חום אינטראקטיבית */}
            <div className="lg:col-span-1">
              <InteractiveHeatmap />
            </div>

            {/* טיימליין זמן אמת */}
            <div className="lg:col-span-1">
              <RealTimeTimeline />
            </div>

            {/* גרף דיוק מתקדם */}
            <div className="lg:col-span-1">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                    ביצועי מערכת
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <AccuracyChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* גרף מגמות עלויות רחב */}
        <div className="cost-trends-section p-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-400" />
                מגמות עלויות ותחזיות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <CostTrendsChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}