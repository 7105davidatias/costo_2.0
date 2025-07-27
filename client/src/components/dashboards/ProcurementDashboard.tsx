import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calculator, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface ProcurementStats {
  activeRequests: number;
  pendingEstimates: number;
  completedThisMonth: number;
  averageProcessingTime: string;
}

interface RecentRequest {
  id: string;
  title: string;
  category: string;
  status: string;
  estimatedCost: string;
  date: string;
}

export default function ProcurementDashboard() {
  const [procurementStats] = useState<ProcurementStats>({
    activeRequests: 12,
    pendingEstimates: 5,
    completedThisMonth: 18,
    averageProcessingTime: "3.2 ימים"
  });

  const [recentRequests] = useState<RecentRequest[]>([
    {
      id: 'REQ-2024-016',
      title: 'רכש 10 רכבי צי',
      category: 'רכב',
      status: 'ממתין לאישור כלכלן',
      estimatedCost: '₪2,400,000',
      date: '15/01/2024'
    },
    {
      id: 'REQ-2024-017', 
      title: 'שדרוג מערכות מחשוב',
      category: 'טכנולוגיה',
      status: 'בתהליך אומדן',
      estimatedCost: '₪850,000',
      date: '14/01/2024'
    },
    {
      id: 'REQ-2024-018',
      title: 'ציוד משרדי חדש',
      category: 'משרד',
      status: 'הושלם',
      estimatedCost: '₪125,000',
      date: '13/01/2024'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'הושלם':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'בתהליך אומדן':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'ממתין לאישור כלכלן':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">דשבורד איש רכש</h1>
            <p className="text-muted-foreground">יצירה וניהול של דרישות רכש ואומדני עלויות</p>
          </div>
          <Link href="/procurement-request">
            <Button size="lg">
              <Plus className="h-5 w-5 ml-2" />
              יצירת דרישת רכש חדשה
            </Button>
          </Link>
        </div>

        {/* סטטיסטיקות רכש */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">דרישות פעילות</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{procurementStats.activeRequests}</div>
              <p className="text-xs text-muted-foreground">בטיפול</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">אומדנים ממתינים</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{procurementStats.pendingEstimates}</div>
              <p className="text-xs text-muted-foreground">לאישור</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">הושלמו החודש</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{procurementStats.completedThisMonth}</div>
              <p className="text-xs text-muted-foreground">דרישות</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">זמן טיפול ממוצע</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{procurementStats.averageProcessingTime}</div>
              <p className="text-xs text-muted-foreground">מהגשה לאישור</p>
            </CardContent>
          </Card>
        </div>

        {/* דרישות רכש אחרונות */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>דרישות הרכש שלי</CardTitle>
              <Link href="/procurement-requests">
                <Button variant="outline">צפה בכל הדרישות</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        מספר דרישה: {request.id} • קטגוריה: {request.category}
                      </p>
                      <p className="text-xs text-muted-foreground">תאריך יצירה: {request.date}</p>
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold text-primary">{request.estimatedCost}</div>
                      <Badge className={`mt-1 ${getStatusColor(request.status)}`}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/cost-estimation/${request.id.split('-').pop()}`}>
                      <Button size="sm">
                        <Calculator className="h-4 w-4 ml-2" />
                        צפה באומדן
                      </Button>
                    </Link>
                    <Link href={`/procurement-request/${request.id.split('-').pop()}`}>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 ml-2" />
                        ערוך דרישה
                      </Button>
                    </Link>
                    <Link href={`/market-research/${encodeURIComponent(request.category)}`}>
                      <Button size="sm" variant="outline">
                        מחקר שוק
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* כלים מהירים */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>כלים מהירים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/procurement-request">
                  <Button className="w-full h-20 flex flex-col items-center justify-center">
                    <Plus className="h-6 w-6 mb-2" />
                    דרישה חדשה
                  </Button>
                </Link>
                <Link href="/cost-estimation">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Calculator className="h-6 w-6 mb-2" />
                    אומדן מהיר
                  </Button>
                </Link>
                <Link href="/market-research">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    מחקר שוק
                  </Button>
                </Link>
                <Link href="/procurement-requests">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    הדרישות שלי
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>טיפים ועדכונים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border-r-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-medium">עדכון מחירים</h4>
                  <p className="text-sm text-muted-foreground">
                    מחירי הציוד הטכנולוגי ירדו ב-5% החודש - הזדמנות לחיסכון
                  </p>
                </div>
                <div className="p-3 border-r-4 border-green-500 bg-green-50 dark:bg-green-950">
                  <h4 className="font-medium">ספק מומלץ</h4>
                  <p className="text-sm text-muted-foreground">
                    TechSource מציע הנחה של 10% על הזמנות מעל ₪500,000
                  </p>
                </div>
                <div className="p-3 border-r-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <h4 className="font-medium">תזכורת</h4>
                  <p className="text-sm text-muted-foreground">
                    3 דרישות ממתינות לאישור כלכלן מעל 5 ימים
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}