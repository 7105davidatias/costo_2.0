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
        <p className="text-lg text-muted">
          ניתוח ואומדן עלויות מתקדם עם בינה מלאכותית
        </p>
        {/* Removed the redundant 'ניתוח AI' button */}
        <div className="flex space-x-reverse space-x-4 justify-center mt-6">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן נתונים
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                <p className="text-sm font-medium neon-text-muted mb-2">
                  סה"כ עלויות מוערכות
                </p>
                <p className="text-3xl font-bold neon-text-primary">
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
                <p className="text-sm font-medium neon-text-muted mb-2">
                  חיסכון כולל
                </p>
                <p className="text-3xl font-bold neon-text-secondary">
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
                <p className="text-sm font-medium neon-text-muted mb-2">
                  זמן אספקה ממוצע
                </p>
                <p className="text-3xl font-bold neon-text-info">
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
                <p className="text-sm font-medium neon-text-muted mb-2">
                  שביעות רצון ספקים
                </p>
                <p className="text-3xl font-bold neon-text-success">
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
                <p className="text-sm font-medium neon-text-muted mb-2">
                  דיוק אומדנים
                </p>
                <p className="text-3xl font-bold neon-text-warning">
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
                <p className="text-sm font-medium neon-text-muted mb-2">
                  דרישות פעילות
                </p>
                <p className="text-3xl font-bold neon-text-primary">
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
                <p className="text-sm font-medium neon-text-muted mb-2">
                  ספקים פעילים
                </p>
                <p className="text-3xl font-bold neon-text-secondary">
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
        {/* Category Breakdown Pie Chart */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="neon-text-primary text-xl flex items-center space-x-reverse space-x-2">
              <Package className="text-primary w-5 h-5" />
              <span>פילוח עלויות לפי קטגוריה</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats?.categoryBreakdown.length > 0 ? dashboardStats.categoryBreakdown : [
                      { category: 'ציוד מחשוב', amount: 1200000, color: '#0088FE' },
                      { category: 'שירותים', amount: 950000, color: '#00C49F' },
                      { category: 'רכבים', amount: 850000, color: '#FFBB28' },
                      { category: 'ריהוט', amount: 650000, color: '#FF8042' },
                      { category: 'תחזוקה', amount: 600000, color: '#8884D8' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ category, amount }) => `${category}: ${formatCurrency(amount)}`}
                  >
                    {(dashboardStats?.categoryBreakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Trends Chart */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="neon-text-primary text-xl flex items-center space-x-reverse space-x-2">
              <TrendingUp className="text-secondary w-5 h-5" />
              <span>מגמות דיוק אומדנים</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats?.accuracyTrends.length > 0 ? dashboardStats.accuracyTrends : [
                  { month: 'ינואר', accuracy: 89 },
                  { month: 'פברואר', accuracy: 91 },
                  { month: 'מרץ', accuracy: 88 },
                  { month: 'אפריל', accuracy: 93 },
                  { month: 'מאי', accuracy: 90 },
                  { month: 'יוני', accuracy: 95 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="accuracy" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Performance Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="neon-text-primary text-xl flex items-center space-x-reverse space-x-2">
            <Users className="text-info w-5 h-5" />
            <span>ביצועי ספקים מובילים</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardStats?.supplierPerformance.length > 0 ? dashboardStats.supplierPerformance : [
                { supplier: 'Dell Technologies', rating: 4.7, orders: 15, avgDeliveryTime: 12 },
                { supplier: 'TechSource', rating: 4.8, orders: 12, avgDeliveryTime: 8 },
                { supplier: 'אלקטרה', rating: 4.5, orders: 8, avgDeliveryTime: 35 },
                { supplier: 'ריהוט ישראלי', rating: 4.6, orders: 6, avgDeliveryTime: 21 },
                { supplier: 'מטריקס IT', rating: 4.4, orders: 10, avgDeliveryTime: 7 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="supplier" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="rating" orientation="left" domain={[0, 5]} />
                <YAxis yAxisId="orders" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="rating" dataKey="rating" fill="#0088FE" name="דירוג (1-5)" />
                <Bar yAxisId="orders" dataKey="orders" fill="#00C49F" name="מספר הזמנות" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Trends Chart */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="neon-text-primary text-xl flex items-center space-x-reverse space-x-2">
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
            <CardTitle className="neon-text-primary text-xl flex items-center space-x-reverse space-x-2">
              <Bot className="text-primary w-5 h-5" />
              <span>ניתוח AI חכם</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ניתוח נתונים מתקדם לצורך אופטימיזציה של תהליכי רכש.
            </p>
            <Button variant="outline" className="neon-text-primary border-procurement-primary-neon/40">
              <Bot className="w-4 h-4 ml-2" />
              הפעל ניתוח AI
            </Button>
          </CardContent>
        </Card>

        <Card className="chart-container glass-panel">
          <CardHeader>
            <CardTitle className="neon-text-primary text-xl flex items-center space-x-reverse space-x-2">
              <Target className="text-secondary w-5 h-5" />
              <span>שיטות אומדן מומלצות</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              הצגת שיטות אומדן יעילות בהתאם לנתוני השוק והדרישות.
            </p>
            <Link href="/estimation-methods">
              <Button variant="outline" className="neon-text-secondary border-procurement-secondary-neon/40">
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