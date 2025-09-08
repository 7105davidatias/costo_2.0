import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, PiggyBank, TrendingDown, Bot, Plus, Eye, Calculator, Coins, TriangleAlert, CheckCircle, Clock, Users, Package, FileText, Target, RefreshCw, Download, Brain } from "lucide-react";
import CostTrendsChart from "@/components/charts/cost-trends-chart";
import AccuracyChart from "@/components/charts/accuracy-chart";
import { Link } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
  // New KPIs
  avgSavingsPercentage: number;
  avgDeliveryTime: number;
  supplierSatisfactionScore: number;
  categoryBreakdown: { category: string; amount: number; color: string }[];
  accuracyTrends: { month: string; accuracy: number }[];
  supplierPerformance: { supplier: string; rating: number; orders: number; avgDeliveryTime: number }[];
  requestsCount?: number; // Added for new KPI
  avgConfidence?: number; // Added for new KPI
}

interface RealTimeStats {
  totalBudget: number;
  completedProcurements: number;
  activeProcurements: number;
  pendingApprovals: number;
  totalSuppliers: number;
  avgResponseTime: number;
}

// Placeholder components for charts that were not provided
const PriceTrackingChart = () => <div className="text-center text-muted-foreground">Price Tracking Chart Placeholder</div>;
const SupplierChart = () => <div className="text-center text-muted-foreground">Supplier Chart Placeholder</div>;


export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard/stats"],
  });

  // Fetch additional real-time data
  const { data: realTimeStats } = useQuery<RealTimeStats>({
    queryKey: ["dashboard/realtime"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'completed': { label: 'הושלם', variant: 'default' as const, className: 'bg-success/20 text-success' },
      'processing': { label: 'בעיבוד', variant: 'secondary' as const, className: 'bg-warning/20 text-warning' },
      'new': { label: 'חדש', variant: 'outline' as const, className: 'bg-primary/20 text-primary' },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.new;
  };

  // Category colors for pie chart
  const CATEGORY_COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#82CA9D', '#FFC658', '#FF7C7C'];

  // Mock data for KPIs if stats is not yet available
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
    requestsCount: 50, // Mock value
    avgConfidence: 92.5 // Mock value
  };

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="text-center glass-panel p-8 animate-glass-float">
        <h1 className="text-4xl font-bold text-primary mb-4">
          מערכת ניהול אומדני עלויות רכש
        </h1>
        <p className="text-lg text-white">
          ניתוח ואומדן עלויות מתקדם עם בינה מלאכותית
        </p>
        {/* Removed the redundant 'ניתוח AI' button */}
        <div className="flex space-x-reverse space-x-4 justify-center mt-6">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן נתונים
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-none">
            <Download className="w-4 h-4 ml-2" />
            ייצא דוח מתקדם
          </Button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="dashboard-kpi-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">
                  סה"כ עלויות מוערכות
                </p>
                <p className="text-3xl font-bold text-slate-200">
                  {formatCurrency(dashboardStats.totalEstimatedCosts)}
                </p>
                <p className="text-success text-sm mt-2 flex items-center">
                  <TrendingUp className="w-3 h-3 ml-1" />
                  +12.5% מהחודש הקודם
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-procurement-primary-neon/20 flex items-center justify-center border border-procurement-primary-neon/40 pulse-neon">
                <Calculator className="h-8 w-8 text-procurement-primary-neon" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-kpi-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">
                  חיסכון כולל
                </p>
                <p className="text-3xl font-bold text-slate-200">
                  {formatCurrency(dashboardStats.totalSavings)}
                </p>
                <p className="text-success text-sm mt-2 flex items-center">
                  <PiggyBank className="w-3 h-3 ml-1" />
                  {dashboardStats.avgSavingsPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-procurement-secondary-neon/20 flex items-center justify-center border border-procurement-secondary-neon/40 pulse-neon">
                <Coins className="text-secondary w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-kpi-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">
                  זמן אספקה ממוצע
                </p>
                <p className="text-3xl font-bold text-slate-200">
                  {dashboardStats.avgDeliveryTime} ימים
                </p>
                <p className="text-info text-sm mt-2 flex items-center">
                  <Clock className="w-3 h-3 ml-1" />
                  שיפור של 3 ימים
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-procurement-info-neon/20 flex items-center justify-center border border-procurement-info-neon/40 pulse-neon">
                <Package className="text-info w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-kpi-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">
                  שביעות רצון ספקים
                </p>
                <p className="text-3xl font-bold text-slate-200">
                  {dashboardStats.supplierSatisfactionScore.toFixed(1)}/5
                </p>
                <p className="text-success text-sm mt-2 flex items-center">
                  <CheckCircle className="w-3 h-3 ml-1" />
                  מעל הממוצע התעשייתי
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-procurement-success-neon/20 flex items-center justify-center border border-procurement-success-neon/40 pulse-neon">
                <Users className="text-success w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="dashboard-kpi-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">
                  דיוק אומדנים
                </p>
                <p className="text-3xl font-bold text-slate-200">
                  {dashboardStats.accuracyScore.toFixed(1)}%
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-procurement-warning-neon/20 flex items-center justify-center border border-procurement-warning-neon/40 pulse-neon">
                <Bot className="text-warning w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-kpi-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">
                  דרישות פעילות
                </p>
                <p className="text-3xl font-bold text-slate-200">
                  {realTimeStats?.activeProcurements || 12}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-procurement-primary-neon/20 flex items-center justify-center border border-procurement-primary-neon/40 pulse-neon">
                <TrendingUp className="text-primary w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-kpi-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">
                  ספקים פעילים
                </p>
                <p className="text-3xl font-bold text-slate-200">
                  {realTimeStats?.totalSuppliers || 23}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-procurement-secondary-neon/20 flex items-center justify-center border border-procurement-secondary-neon/40 pulse-neon">
                <Users className="text-secondary w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Pie Chart - Glassmorphism Style */}
        <Card className="chart-container relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-slate-200 text-xl flex items-center space-x-reverse space-x-2">
              <Package className="text-primary w-5 h-5" />
              <span>פילוח עלויות לפי קטגוריה</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="h-96 flex items-center justify-center relative">
              {/* Background Glass Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20 backdrop-blur-sm rounded-lg"></div>

              {/* Pie Chart Container */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                <ResponsiveContainer width="60%" height="60%">
                  <PieChart>
                    <defs>
                      <linearGradient id="pieGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.9} />
                      </linearGradient>
                      <linearGradient id="pieGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
                      </linearGradient>
                      <linearGradient id="pieGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#D97706" stopOpacity={0.9} />
                      </linearGradient>
                      <linearGradient id="pieGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#DC2626" stopOpacity={0.9} />
                      </linearGradient>
                      <linearGradient id="pieGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={dashboardStats?.categoryBreakdown.length > 0 ? dashboardStats.categoryBreakdown : [
                        { category: 'ציוד מחשוב', amount: 3030000, color: 'url(#pieGradient1)' },
                        { category: 'שירותים', amount: 1891000, color: 'url(#pieGradient2)' },
                        { category: 'רכבים', amount: 750000, color: 'url(#pieGradient3)' },
                        { category: 'ריהוט', amount: 125000, color: 'url(#pieGradient4)' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={90}
                      dataKey="amount"
                      stroke="none"
                    >
                      {(dashboardStats?.categoryBreakdown.length > 0 ? dashboardStats.categoryBreakdown : [
                        { category: 'ציוד מחשוב', amount: 3030000, color: 'url(#pieGradient1)' },
                        { category: 'שירותים', amount: 1891000, color: 'url(#pieGradient2)' },
                        { category: 'רכבים', amount: 750000, color: 'url(#pieGradient3)' },
                        { category: 'ריהוט', amount: 125000, color: 'url(#pieGradient4)' }
                      ]).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || `url(#pieGradient${index + 1})`}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* External Labels with Glass Effect */}
                {(dashboardStats?.categoryBreakdown.length > 0 ? dashboardStats.categoryBreakdown : [
                  { category: 'ציוד מחשוב', amount: 3030000, color: '#3B82F6' },
                  { category: 'שירותים', amount: 1891000, color: '#10B981' },
                  { category: 'רכבים', amount: 750000, color: '#F59E0B' },
                  { category: 'ריהוט', amount: 125000, color: '#EF4444' }
                ]).map((entry, index, array) => {
                  const angle = (index * 360) / array.length - 90;
                  const radian = (angle * Math.PI) / 180;
                  const radius = 140;
                  const x = Math.cos(radian) * radius;
                  const y = Math.sin(radian) * radius;

                  return (
                    <div
                      key={entry.category}
                      className="absolute backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-3 py-2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        minWidth: '120px',
                        textAlign: 'center'
                      }}
                    >
                      <div className="text-white text-sm font-medium mb-1">
                        {entry.category}
                      </div>
                      <div className="text-white/80 text-xs">
                        {formatCurrency(entry.amount)}
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full mx-auto mt-1"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Trends Chart - Glassmorphism Columns */}
        <Card className="chart-container relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-slate-200 text-xl flex items-center space-x-reverse space-x-2">
              <TrendingUp className="text-secondary w-5 h-5" />
              <span>מגמות דיוק אומדנים</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {/* Background Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-blue-900/20 backdrop-blur-sm rounded-lg"></div>

            <div className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={dashboardStats?.accuracyTrends.length > 0 ? dashboardStats.accuracyTrends : [
                    { month: 'ינואר', accuracy: 89 },
                    { month: 'פברואר', accuracy: 91 },
                    { month: 'מרץ', accuracy: 88 },
                    { month: 'אפריל', accuracy: 93 },
                    { month: 'מאי', accuracy: 90 },
                    { month: 'יוני', accuracy: 95 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    {/* Glass Column Gradients */}
                    <linearGradient id="columnGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.9} />
                      <stop offset="50%" stopColor="#0891B2" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#0E7490" stopOpacity={0.8} />
                    </linearGradient>

                    {/* Glass Reflection Effect */}
                    <linearGradient id="reflectionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                      <stop offset="30%" stopColor="rgba(255,255,255,0.2)" />
                      <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                    </linearGradient>

                    {/* Glow Filter */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <CartesianGrid 
                    strokeDasharray="2 4" 
                    stroke="rgba(6, 182, 212, 0.3)" 
                    strokeWidth={1}
                  />

                  <XAxis 
                    dataKey="month" 
                    tick={{ 
                      fill: '#E2E8F0', 
                      fontSize: 12, 
                      fontWeight: 500 
                    }}
                    stroke="rgba(226, 232, 240, 0.4)"
                    axisLine={{ stroke: 'rgba(6, 182, 212, 0.5)' }}
                  />

                  <YAxis 
                    domain={[80, 100]} 
                    tick={{ 
                      fill: '#E2E8F0', 
                      fontSize: 12, 
                      fontWeight: 500 
                    }}
                    stroke="rgba(226, 232, 240, 0.4)"
                    axisLine={{ stroke: 'rgba(6, 182, 212, 0.5)' }}
                    tickFormatter={(value) => `${value}%`}
                  />

                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      color: '#E2E8F0',
                      direction: 'rtl'
                    }}
                    formatter={(value) => [`${value}%`, 'דיוק']}
                    labelStyle={{ color: '#06B6D4', fontWeight: 600 }}
                  />

                  <Bar 
                    dataKey="accuracy" 
                    fill="url(#columnGradient)"
                    radius={[6, 6, 0, 0]}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={1}
                    filter="url(#glow)"
                  />

                  {/* Glass Reflection Overlay */}
                  <Bar 
                    dataKey="accuracy" 
                    fill="url(#reflectionGradient)"
                    radius={[6, 6, 0, 0]}
                    strokeWidth={0}
                    opacity={0.6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Performance Chart - Enhanced Glassmorphism */}
      <Card className="chart-container relative overflow-hidden">
        <CardHeader>
          <CardTitle className="text-slate-200 text-xl flex items-center space-x-reverse space-x-2">
            <Users className="text-info w-5 h-5" />
            <span>ביצועי ספקים מובילים</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative flex items-center justify-center">
          {/* Multi-layer Background Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-emerald-900/20 backdrop-blur-sm rounded-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-800/10 via-transparent to-cyan-800/10 backdrop-blur-sm rounded-lg"></div>

          <div className="h-80 w-full relative flex items-center justify-center">
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
                  {/* Rating Columns Gradient */}
                  <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#1D4ED8" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#1E3A8A" stopOpacity={0.8} />
                  </linearGradient>

                  {/* Orders Columns Gradient */}
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#059669" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
                  </linearGradient>

                  {/* Enhanced Glow Filter */}
                  <filter id="supplierGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  {/* Glass Reflection */}
                  <linearGradient id="supplierReflection" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                    <stop offset="40%" stopColor="rgba(255,255,255,0.2)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="2 6" 
                  stroke="rgba(59, 130, 246, 0.3)" 
                  strokeWidth={1}
                />

                <XAxis 
                  dataKey="supplier" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ 
                    fill: '#E2E8F0', 
                    fontSize: 11, 
                    fontWeight: 500 
                  }}
                  stroke="rgba(226, 232, 240, 0.4)"
                  axisLine={{ stroke: 'rgba(59, 130, 246, 0.5)' }}
                />

                <YAxis 
                  yAxisId="rating" 
                  orientation="left" 
                  domain={[0, 5]}
                  tick={{ 
                    fill: '#3B82F6', 
                    fontSize: 12, 
                    fontWeight: 500 
                  }}
                  stroke="rgba(59, 130, 246, 0.6)"
                  axisLine={{ stroke: 'rgba(59, 130, 246, 0.5)' }}
                />

                <YAxis 
                  yAxisId="orders" 
                  orientation="right"
                  tick={{ 
                    fill: '#10B981', 
                    fontSize: 12, 
                    fontWeight: 500 
                  }}
                  stroke="rgba(16, 185, 129, 0.6)"
                  axisLine={{ stroke: 'rgba(16, 185, 129, 0.5)' }}
                />

                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                    color: '#E2E8F0',
                    direction: 'rtl',
                    padding: '12px'
                  }}
                  formatter={(value, name) => [
                    name === 'rating' ? `${value}/5` : value,
                    name === 'rating' ? 'דירוג' : 'הזמנות'
                  ]}
                  labelStyle={{ color: '#06B6D4', fontWeight: 600, marginBottom: '8px' }}
                />

                <Legend 
                  wrapperStyle={{
                    direction: 'rtl',
                    paddingTop: '20px',
                    color: '#E2E8F0'
                  }}
                />

                {/* Rating Bars with Glass Effect */}
                <Bar 
                  yAxisId="rating" 
                  dataKey="rating" 
                  fill="url(#ratingGradient)"
                  name="דירוג (1-5)"
                  radius={[4, 4, 0, 0]}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={1.5}
                  filter="url(#supplierGlow)"
                />

                {/* Orders Bars with Glass Effect */}
                <Bar 
                  yAxisId="orders" 
                  dataKey="orders" 
                  fill="url(#ordersGradient)"
                  name="מספר הזמנות"
                  radius={[4, 4, 0, 0]}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={1.5}
                  filter="url(#supplierGlow)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Trends Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="text-slate-200 text-xl flex items-center space-x-reverse space-x-2">
            <TrendingUp className="text-primary w-5 h-5" />
            <span>מגמת עלות חזויה לאורך זמן</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <CostTrendsChart />
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests Table */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Calculator className="text-primary w-5 h-5" />
            <span>דרישות רכש אחרונות</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">מספר בקשה</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">תיאור פריט</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">כמות</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">עלות מוערכת</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">דיוק אומדן</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">תאריך</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/20">
                {(stats?.recentRequests || []).slice(0, 10).map((request) => {
                  const statusConfig = getStatusBadge(request.status);
                  return (
                    <tr key={request.id} className="hover:bg-muted/10">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{request.requestNumber}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{request.itemName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{request.quantity}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {request.estimatedCost ? formatCurrency(parseFloat(request.estimatedCost)) : 'לא הוערך'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {request.confidenceLevel ? (
                          <Badge variant={request.confidenceLevel > 90 ? 'default' : 'secondary'}>
                            {request.confidenceLevel}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusConfig.variant} className={statusConfig.className}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString('he-IL')}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/procurement-request/${request.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Section - To be refined based on further instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="chart-container glass-panel">
          <CardHeader>
            <CardTitle className="text-slate-200 text-xl flex items-center space-x-reverse space-x-2">
              <Bot className="text-primary w-5 h-5" />
              <span>ניתוח AI חכם</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ניתוח נתונים מתקדם לצורך אופטימיזציה של תהליכי רכש.
            </p>
            <Button variant="outline" className="text-slate-200 border-blue-500/40">
              <Bot className="w-4 h-4 ml-2" />
              הפעל ניתוח AI
            </Button>
          </CardContent>
        </Card>

        <Card className="chart-container glass-panel">
          <CardHeader>
            <CardTitle className="text-slate-200 text-xl flex items-center space-x-reverse space-x-2">
              <Target className="text-secondary w-5 h-5" />
              <span>שיטות אומדן מומלצות</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              הצגת שיטות אומדן יעילות בהתאם לנתוני השוק והדרישות.
            </p>
            <Link href="/estimation-methods">
              <Button variant="outline" className="text-slate-200 border-blue-500/40">
                <FileText className="w-4 h-4 ml-2" />
                לצפייה בשיטות
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}