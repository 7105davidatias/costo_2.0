import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DraggableWidget } from "@/components/ui/draggable-widget";
import { RealTimeTimeline } from "@/components/ui/real-time-timeline";
import { useDashboardLayout } from "@/hooks/use-dashboard-layout";
import { 
  TrendingUp, 
  PiggyBank, 
  TrendingDown, 
  Bot, 
  Plus, 
  Eye, 
  Calculator, 
  Coins, 
  TriangleAlert, 
  CheckCircle, 
  Clock, 
  Users, 
  Package, 
  FileText, 
  Target, 
  RefreshCw, 
  Download, 
  Brain,
  Layout,
  Grid3X3,
  List,
  Maximize2,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Settings
} from "lucide-react";
import CostTrendsChart from "@/components/charts/cost-trends-chart";
import AccuracyChart from "@/components/charts/accuracy-chart";
import { Link } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DashboardSkeleton } from '@/components/ui/enhanced-skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from "@/lib/utils";

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

// Enhanced KPI Card Component
const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = "cyan", 
  isFloating = false,
  onClick 
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: { value: number; label: string };
  color?: string;
  isFloating?: boolean;
  onClick?: () => void;
}) => (
  <Card 
    className={cn(
      "kpi-card-enhanced cursor-pointer transition-all duration-300 hover:scale-105",
      "bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-20",
      "border border-cyan-500/30 hover:border-cyan-400/60",
      "hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]",
      isFloating && "fixed z-40"
    )}
    onClick={onClick}
  >
    <CardContent className="p-6 text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Icon */}
        <div className={cn(
          "w-16 h-16 mx-auto rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40",
          "shadow-[0_0_20px_rgba(0,255,255,0.3)]",
          "animate-pulse"
        )}>
          <Icon className="w-8 h-8 text-cyan-400" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-sm text-slate-400 font-medium">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-200 neon-text-primary">
            {value}
          </p>
          {trend && (
            <div className="flex items-center justify-center text-sm">
              <span className={cn(
                "flex items-center",
                trend.value > 0 ? "text-green-400" : "text-red-400"
              )}>
                {trend.value > 0 ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                {trend.label}
              </span>
            </div>
          )}
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 pointer-events-none" />
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { 
    layout, 
    updateWidgetPosition, 
    updateWidgetSize, 
    toggleWidgetVisibility, 
    toggleSidebar, 
    toggleTheme,
    changeViewMode,
    resetLayout 
  } = useDashboardLayout();

  const [showFloatingWidgets, setShowFloatingWidgets] = useState(false);

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
  });

  const { data: realTimeStats } = useQuery<RealTimeStats>({
    queryKey: ["dashboard/realtime"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

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

  // KPI Data
  const kpiData = useMemo(() => [
    {
      id: 'total-costs',
      title: 'סה"כ עלויות מוערכות',
      value: formatCurrency(dashboardStats.totalEstimatedCosts),
      subtitle: 'מעודכן לפני 5 דקות',
      icon: Calculator,
      trend: { value: 12.5, label: '+12.5% מהחודש הקודם' },
      color: 'cyan'
    },
    {
      id: 'total-savings',
      title: 'חיסכון כולל',
      value: formatCurrency(dashboardStats.totalSavings),
      subtitle: `${dashboardStats.avgSavingsPercentage.toFixed(1)}% חיסכון ממוצע`,
      icon: PiggyBank,
      trend: { value: 8.5, label: 'חיסכון משמעותי' },
      color: 'green'
    },
    {
      id: 'avg-delivery',
      title: 'זמן אספקה ממוצע',
      value: `${dashboardStats.avgDeliveryTime} ימים`,
      subtitle: 'שיפור של 3 ימים',
      icon: Clock,
      trend: { value: -6.5, label: 'שיפור בזמנים' },
      color: 'blue'
    },
    {
      id: 'supplier-satisfaction',
      title: 'שביעות רצון ספקים',
      value: `${dashboardStats.supplierSatisfactionScore.toFixed(1)}/5`,
      subtitle: 'מעל הממוצע התעשייתי',
      icon: Users,
      trend: { value: 4.2, label: 'ביצועים מעולים' },
      color: 'purple'
    },
    {
      id: 'accuracy-score',
      title: 'דיוק אומדנים',
      value: `${dashboardStats.accuracyScore.toFixed(1)}%`,
      subtitle: 'מערכת AI מתקדמת',
      icon: Bot,
      color: 'yellow'
    },
    {
      id: 'active-requests',
      title: 'דרישות פעילות',
      value: realTimeStats?.activeProcurements || 12,
      subtitle: 'בתהליך עיבוד',
      icon: Package,
      color: 'orange'
    }
  ], [dashboardStats, realTimeStats]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
          <LoadingSpinner type="calculation" />
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="dashboard-container min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Header */}
      <div className="dashboard-header sticky top-0 z-30 backdrop-blur-20 bg-slate-900/80 border-b border-cyan-500/20">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-reverse space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-cyan-400"
            >
              {layout.sidebarCollapsed ? 
                <ChevronRight className="w-4 h-4" /> : 
                <ChevronLeft className="w-4 h-4" />
              }
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-cyan-400 neon-text-primary">
                מערכת ניהול רכש AI
              </h1>
              <p className="text-sm text-slate-400">
                ניתוח ואומדן עלויות בזמן אמת
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-reverse space-x-3">
            {/* View Mode Controls */}
            <div className="flex bg-slate-800/50 rounded-lg p-1">
              <Button
                variant={layout.viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => changeViewMode('grid')}
                className="px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={layout.viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => changeViewMode('list')}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={layout.viewMode === 'compact' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => changeViewMode('compact')}
                className="px-3"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-cyan-400"
            >
              {layout.activeTheme === 'dark' ? 
                <Sun className="w-4 h-4" /> : 
                <Moon className="w-4 h-4" />
              }
            </Button>

            {/* Layout Controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFloatingWidgets(!showFloatingWidgets)}
              className="border-cyan-500/30 text-cyan-400"
            >
              <Layout className="w-4 h-4 ml-2" />
              {showFloatingWidgets ? 'נעל רכיבים' : 'רכיבים צפים'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetLayout}
              className="text-slate-400"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              אפס פריסה
            </Button>

            <Button
              variant="default"
              size="sm"
              className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
            >
              <Download className="w-4 h-4 ml-2" />
              ייצא דוח
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content p-6 space-y-8">
        {/* Floating KPI Cards */}
        {showFloatingWidgets && (
          <div className="floating-widgets">
            {kpiData.slice(0, 4).map((kpi, index) => (
              <DraggableWidget
                key={kpi.id}
                id={kpi.id}
                title={kpi.title}
                position={{ x: 100 + index * 20, y: 100 + index * 20 }}
                size={{ width: 300, height: 200 }}
                isVisible={true}
                isFloating={true}
                onPositionChange={(pos) => updateWidgetPosition(kpi.id, pos)}
                onSizeChange={(size) => updateWidgetSize(kpi.id, size)}
                onVisibilityToggle={() => toggleWidgetVisibility(kpi.id)}
              >
                <KPICard {...kpi} isFloating={true} />
              </DraggableWidget>
            ))}
          </div>
        )}

        {/* Grid Layout KPI Cards */}
        {!showFloatingWidgets && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kpiData.map((kpi) => (
              <KPICard key={kpi.id} {...kpi} />
            ))}
          </div>
        )}

        {/* Real-time Timeline and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real-time Timeline */}
          <div className="lg:col-span-1">
            <DraggableWidget
              id="real-time-timeline"
              title="ציר זמן בזמן אמת"
              position={{ x: 0, y: 0 }}
              size={{ width: 400, height: 600 }}
              isVisible={true}
              canDrag={showFloatingWidgets}
              canResize={showFloatingWidgets}
              onPositionChange={(pos) => updateWidgetPosition('real-time-timeline', pos)}
              onSizeChange={(size) => updateWidgetSize('real-time-timeline', size)}
              className="h-[600px]"
            >
              <RealTimeTimeline />
            </DraggableWidget>
          </div>

          {/* Enhanced Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cost Trends - Enhanced */}
            <Card className="chart-container-enhanced relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-cyan-400 text-xl flex items-center space-x-reverse space-x-3">
                  <TrendingUp className="text-primary w-5 h-5" />
                  <span>מגמות עלויות מתקדמות</span>
                  <Badge variant="outline" className="border-cyan-500/30">
                    עדכון חי
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {/* Multi-layer glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-blue-900/10 backdrop-blur-sm rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-tl from-purple-900/5 via-transparent to-pink-900/5 backdrop-blur-sm rounded-lg" />

                <div className="h-80 relative z-10">
                  <CostTrendsChart />
                </div>

                {/* Interactive overlay */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge className="bg-cyan-500/20 text-cyan-300">
                    דיוק: 94.2%
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300">
                    חיסכון: +15.3%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Accuracy Chart - Enhanced */}
            <Card className="chart-container-enhanced relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-cyan-400 text-xl flex items-center space-x-reverse space-x-3">
                  <Bot className="text-secondary w-5 h-5" />
                  <span>ניתוח דיוק AI מתקדם</span>
                  <div className="flex space-x-reverse space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">פעיל</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {/* Enhanced glass backdrop */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-emerald-900/10 backdrop-blur-sm rounded-lg" />

                <div className="h-80 relative z-10">
                  <AccuracyChart />
                </div>

                {/* AI Insights Overlay */}
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-reverse space-x-2 text-xs">
                    <Brain className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">AI Insight:</span>
                  </div>
                  <p className="text-slate-300 text-xs mt-1">
                    דיוק משתפר ב-3.2% השבוע
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Supplier Performance */}
        <Card className="chart-container-enhanced relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-cyan-400 text-xl flex items-center space-x-reverse space-x-3">
              <Users className="text-info w-5 h-5" />
              <span>ביצועי ספקים - ניתוח מתקדם</span>
              <Button variant="ghost" size="sm" className="text-xs">
                <Settings className="w-3 h-3 ml-1" />
                הגדרות
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {/* Multi-layer glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-indigo-900/10 backdrop-blur-sm rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-800/5 via-transparent to-cyan-800/5 backdrop-blur-sm rounded-lg" />

            <div className="h-80 relative z-10 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={dashboardStats?.supplierPerformance.length > 0 ? dashboardStats.supplierPerformance : [
                    { supplier: 'Dell Technologies', rating: 4.7, orders: 15, avgDeliveryTime: 12 },
                    { supplier: 'TechSource', rating: 4.8, orders: 12, avgDeliveryTime: 8 },
                    { supplier: 'אלקטרה', rating: 4.5, orders: 8, avgDeliveryTime: 35 },
                    { supplier: 'ריהוט ישראלי', rating: 4.6, orders: 6, avgDeliveryTime: 21 },
                    { supplier: 'מטריקס IT', rating: 4.4, orders: 10, avgDeliveryTime: 7 }
                  ]}
                  margin={{ top: 20, right: 60, left: 20, bottom: 100 }}
                >
                  <defs>
                    <linearGradient id="ratingGradientEnhanced" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
                      <stop offset="50%" stopColor="#0891B2" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#0E7490" stopOpacity={0.9} />
                    </linearGradient>
                    <linearGradient id="ordersGradientEnhanced" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                      <stop offset="50%" stopColor="#059669" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 6" stroke="rgba(6, 182, 212, 0.2)" />
                  <XAxis 
                    dataKey="supplier" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: '#E2E8F0', fontSize: 11, fontWeight: 500 }}
                    stroke="rgba(226, 232, 240, 0.3)"
                  />
                  <YAxis 
                    yAxisId="rating" 
                    orientation="left" 
                    domain={[0, 5]}
                    tick={{ fill: '#06B6D4', fontSize: 12, fontWeight: 500 }}
                    stroke="rgba(6, 182, 212, 0.4)"
                  />
                  <YAxis 
                    yAxisId="orders" 
                    orientation="right"
                    tick={{ fill: '#10B981', fontSize: 12, fontWeight: 500 }}
                    stroke="rgba(16, 185, 129, 0.4)"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      color: '#E2E8F0',
                      direction: 'rtl'
                    }}
                  />
                  <Legend wrapperStyle={{ direction: 'rtl', paddingTop: '20px' }} />
                  <Bar 
                    yAxisId="rating" 
                    dataKey="rating" 
                    fill="url(#ratingGradientEnhanced)"
                    name="דירוג"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="orders" 
                    dataKey="orders" 
                    fill="url(#ordersGradientEnhanced)"
                    name="הזמנות"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Insights */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-slate-900/80 backdrop-blur-10 border border-cyan-500/30 rounded-lg p-2">
                <div className="text-xs text-cyan-400 font-medium">ביצועים מובילים</div>
                <div className="text-xs text-slate-300">TechSource - 4.8/5</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Recent Requests Table */}
        <Card className="enhanced-table-card relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-3">
                <FileText className="text-primary w-5 h-5" />
                <span className="text-cyan-400">דרישות רכש אחרונות</span>
                <Badge variant="outline" className="border-cyan-500/30">
                  {dashboardStats.recentRequests?.length || 0} דרישות
                </Badge>
              </div>
              <div className="flex space-x-reverse space-x-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4 ml-1" />
                  רענן
                </Button>
                <Button variant="outline" size="sm" className="border-cyan-500/30">
                  <Plus className="w-4 h-4 ml-1" />
                  דרישה חדשה
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full enhanced-table">
                <thead className="bg-gradient-to-r from-slate-800/80 to-slate-700/80">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-cyan-400">מספר בקשה</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-cyan-400">תיאור פריט</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-cyan-400">עלות מוערכת</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-cyan-400">סטטוס</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-cyan-400">תאריך</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-cyan-400">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {(stats?.recentRequests || []).slice(0, 8).map((request, index) => (
                    <tr 
                      key={request.id} 
                      className="hover:bg-slate-800/30 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 text-sm text-cyan-300 font-medium group-hover:text-cyan-200">
                        {request.requestNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300 group-hover:text-slate-200">
                        {request.itemName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-200 font-medium">
                        {request.estimatedCost ? formatCurrency(parseFloat(request.estimatedCost)) : (
                          <span className="text-slate-500">בעיבוד...</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={request.status === 'completed' ? 'default' : 'secondary'}
                          className={cn(
                            request.status === 'completed' && 'bg-green-500/20 text-green-400',
                            request.status === 'processing' && 'bg-yellow-500/20 text-yellow-400',
                            request.status === 'new' && 'bg-cyan-500/20 text-cyan-400'
                          )}
                        >
                          {request.status === 'completed' && 'הושלם'}
                          {request.status === 'processing' && 'בעיבוד'}
                          {request.status === 'new' && 'חדש'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(request.createdAt).toLocaleDateString('he-IL')}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/procurement-request/${request.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-cyan-500/10 hover:text-cyan-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}