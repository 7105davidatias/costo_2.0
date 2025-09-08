import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, ShoppingCart, Target } from 'lucide-react';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => ({
      totalEstimatedCosts: 7966000,
      totalSavings: 1200000,
      completedProcurements: 145,
      averageAccuracy: 94.5
    })
  });

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">מערכת ניהול אומדני עלויות רכש</h1>
        <p className="text-muted-foreground mt-2">לוח בקרה מרכזי לניהול אומדנים ודרישות רכש</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך עלויות מוערכות</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{stats?.totalEstimatedCosts?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">+12% מהחודש הקודם</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חיסכון כולל</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{stats?.totalSavings?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">+8.2% מהחודש הקודם</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דרישות הושלמו</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedProcurements || 0}</div>
            <p className="text-xs text-muted-foreground">+23 החודש</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דיוק ממוצע</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageAccuracy || 0}%</div>
            <p className="text-xs text-muted-foreground">+2.1% מהחודש הקודם</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>פעולות מהירות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <p>• צור דרישת רכש חדשה</p>
              <p>• הפק דוח אומדנים</p>
              <p>• בדוק סטטוס דרישות</p>
              <p>• נתח מגמות שוק</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>התראות מערכת</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p className="text-green-600">✓ המערכת פועלת תקין</p>
              <p className="text-blue-600">ℹ 3 דרישות ממתינות לאישור</p>
              <p className="text-yellow-600">⚠ עדכון מחירון דרוש</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}