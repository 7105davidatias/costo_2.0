import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

interface PendingApproval {
  id: string;
  title: string;
  amount: string;
  submittedBy: string;
  date: string;
  status: string;
}

interface EconomicStats {
  pendingApprovals: number;
  approvedThisMonth: number;
  totalSavings: string;
  averageAccuracy: string;
}

export default function EconomistDashboard() {
  const [pendingApprovals] = useState<PendingApproval[]>([
    {
      id: 'REQ-2024-016',
      title: 'רכש 10 רכבי צי',
      amount: '₪2,400,000',
      submittedBy: 'משה אברהם',
      date: '2024-01-15',
      status: 'ממתין לאישור'
    },
    {
      id: 'REQ-2024-017',
      title: 'בניית מחסן חדש',
      amount: '₪5,200,000',
      submittedBy: 'משה אברהם',
      date: '2024-01-14',
      status: 'ממתין לאישור'
    },
    {
      id: 'REQ-2024-018',
      title: 'שדרוג מערכות מחשוב',
      amount: '₪850,000',
      submittedBy: 'משה אברהם',
      date: '2024-01-13',
      status: 'ממתין לאישור'
    }
  ]);

  const [economicStats] = useState<EconomicStats>({
    pendingApprovals: 5,
    approvedThisMonth: 23,
    totalSavings: '₪1,250,000',
    averageAccuracy: '94.2%'
  });

  const handleApprove = (id: string) => {
    console.log(`Approving request ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting request ${id}`);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">דשבורד כלכלן</h1>
          <p className="text-muted-foreground">אישור ובקרת אומדני עלויות</p>
        </div>

        {/* סטטיסטיקות כלכליות */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ממתינים לאישור</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{economicStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">אומדנים</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">אושרו החודש</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{economicStats.approvedThisMonth}</div>
              <p className="text-xs text-muted-foreground">אומדנים</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">חיסכון כולל</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{economicStats.totalSavings}</div>
              <p className="text-xs text-muted-foreground">השנה</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">דיוק ממוצע</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{economicStats.averageAccuracy}</div>
              <p className="text-xs text-muted-foreground">האומדנים</p>
            </CardContent>
          </Card>
        </div>

        {/* אומדנים ממתינים לאישור */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>אומדנים ממתינים לאישור כלכלי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{approval.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        מספר בקשה: {approval.id} • הוגש על ידי: {approval.submittedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">תאריך הגשה: {approval.date}</p>
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold text-primary">{approval.amount}</div>
                      <Badge variant="outline" className="mt-1">
                        {approval.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(approval.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 ml-2" />
                      אשר אומדן
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(approval.id)}
                    >
                      <XCircle className="h-4 w-4 ml-2" />
                      דחה אומדן
                    </Button>
                    <Button size="sm" variant="outline">
                      צפה בפרטים
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ניתוח כלכלי */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ניתוח מגמות עלויות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded">
                  <span>ציוד מחשוב</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    ↓ 5%
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                  <span>שירותי תחזוקה</span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    ↑ 8%
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded">
                  <span>בנייה ותשתיות</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    → יציב
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>המלצות כלכליות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border-r-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-medium">תזמון רכישות</h4>
                  <p className="text-sm text-muted-foreground">
                    מומלץ לדחות רכישת ציוד מחשוב לרבעון הבא - צפויה הנחה של 8%
                  </p>
                </div>
                <div className="p-3 border-r-4 border-green-500 bg-green-50 dark:bg-green-950">
                  <h4 className="font-medium">הזדמנות חיסכון</h4>
                  <p className="text-sm text-muted-foreground">
                    בדוק ספקים חלופיים לשירותי תחזוקה - פוטנציאל חיסכון של ₪200,000
                  </p>
                </div>
                <div className="p-3 border-r-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
                  <h4 className="font-medium">אזהרת תקציב</h4>
                  <p className="text-sm text-muted-foreground">
                    אומדני הבנייה חרגו ב-12% מהתקציב הרבעוני
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