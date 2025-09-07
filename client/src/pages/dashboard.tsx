import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, PiggyBank, TrendingDown, Bot, Plus, Eye, Calculator, Coins, TriangleAlert, CheckCircle } from "lucide-react";
import CostTrendsChart from "@/components/charts/cost-trends-chart";
import AccuracyChart from "@/components/charts/accuracy-chart";
import { Link } from "wouter";

interface DashboardStats {
  totalEstimatedCosts: number;
  totalSavings: number;
  risingCosts: number;
  accuracyScore: number;
  recentRequests: any[];
  costTrends: { month: string; cost: number }[];
  accuracyBreakdown: { label: string; value: number }[];
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'completed': { label: 'הושלם', variant: 'default' as const, className: 'bg-success/20 text-success' },
      'processing': { label: 'בעיבוד', variant: 'secondary' as const, className: 'bg-warning/20 text-warning' },
      'new': { label: 'חדש', variant: 'outline' as const, className: 'bg-primary/20 text-primary' },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.new;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">לוח בקרה</h1>
          <p className="text-muted-foreground">סקירה כללית של פעילות הרכש והערכות העלויות</p>
        </div>
        <Link href="/procurement-request">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 ml-2" />
            אומדן חדש
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-primary/20 card-hover dashboard-kpi-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">סה"כ הוצאה חזויה</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats ? formatCurrency(stats.totalEstimatedCosts) : '₪0'}
                </p>
                <p className="text-success text-sm mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 ml-1" />
                  +12.5% מהחודש הקודם
                </p>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg">
                <TrendingUp className="text-primary w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-secondary/20 card-hover dashboard-kpi-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">חיסכון מצטבר</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats ? formatCurrency(stats.totalSavings) : '₪0'}
                </p>
                <p className="text-success text-sm mt-1 flex items-center">
                  <PiggyBank className="w-3 h-3 ml-1" />
                  15.7% חיסכון ממוצע
                </p>
              </div>
              <div className="bg-secondary/20 p-3 rounded-lg">
                <Coins className="text-secondary w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-warning/20 card-hover dashboard-kpi-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">עליות מחירים</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats ? formatCurrency(stats.risingCosts) : '₪0'}
                </p>
                <p className="text-warning text-sm mt-1 flex items-center">
                  <TriangleAlert className="w-3 h-3 ml-1" />
                  7 פריטים עם עלייה
                </p>
              </div>
              <div className="bg-warning/20 p-3 rounded-lg">
                <TrendingDown className="text-warning w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-success/20 card-hover dashboard-kpi-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">מדד דיוק AI</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats ? `${stats.accuracyScore.toFixed(1)}%` : '0%'}
                </p>
                <p className="text-success text-sm mt-1 flex items-center">
                  <CheckCircle className="w-3 h-3 ml-1" />
                  ביצועים מעולים
                </p>
              </div>
              <div className="bg-success/20 p-3 rounded-lg">
                <Bot className="text-success w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <TrendingUp className="text-primary w-5 h-5" />
              <span>מגמת עלות חזויה לאורך זמן</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <CostTrendsChart data={stats?.costTrends || []} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <Calculator className="text-secondary w-5 h-5" />
              <span>התפלגות סטיות אומדנים</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <AccuracyChart data={stats?.accuracyBreakdown || []} />
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">סטטוס</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">תאריך</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/20">
                {stats?.recentRequests?.map((request) => {
                  const statusConfig = getStatusBadge(request.status);
                  return (
                    <tr key={request.id} className="hover:bg-muted/10">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{request.requestNumber}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{request.itemName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{request.quantity}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {request.estimatedCost ? formatCurrency(parseFloat(request.estimatedCost)) : 'לא הוערך'}
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
    </div>
  );
}
