import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Lock } from "lucide-react";

interface SecurityStats {
  securityReviews: number;
  approvedRequests: number;
  pendingReviews: number;
  riskLevel: string;
}

interface SecurityReview {
  id: string;
  title: string;
  category: string;
  riskLevel: 'נמוך' | 'בינוני' | 'גבוה';
  amount: string;
  submittedBy: string;
  date: string;
  status: string;
}

export default function SecurityDashboard() {
  const [securityStats] = useState<SecurityStats>({
    securityReviews: 8,
    approvedRequests: 15,
    pendingReviews: 3,
    riskLevel: 'בינוני'
  });

  const [pendingReviews] = useState<SecurityReview[]>([
    {
      id: 'REQ-2024-016',
      title: 'רכישת שרתי אבטחת מידע',
      category: 'ציוד ביטחון',
      riskLevel: 'גבוה',
      amount: '₪1,200,000',
      submittedBy: 'משה אברהם',
      date: '15/01/2024',
      status: 'ממתין לבדיקת ביטחון'
    },
    {
      id: 'REQ-2024-017',
      title: 'מערכת ניטור ומעקב',
      category: 'מערכות אבטחה',
      riskLevel: 'בינוני',
      amount: '₪800,000',
      submittedBy: 'משה אברהם',
      date: '14/01/2024',
      status: 'ממתין לבדיקת ביטחון'
    },
    {
      id: 'REQ-2024-018',
      title: 'תוכנת אנטי-וירוס ארגונית',
      category: 'תוכנה',
      riskLevel: 'נמוך',
      amount: '₪150,000',
      submittedBy: 'משה אברהם',
      date: '13/01/2024',
      status: 'ממתין לבדיקת ביטחון'
    }
  ]);

  const [securityAlerts] = useState([
    { message: "דרישה חדשה דורשת בדיקת אבטחה - REQ-2024-019", time: "לפני 30 דקות", type: "warning" },
    { message: "הושלמה בדיקת ביטחון לדרישה REQ-2024-015", time: "לפני שעתיים", type: "info" },
    { message: "זוהתה חריגה בתקנות הביטחון - REQ-2024-014", time: "לפני 3 שעות", type: "error" }
  ]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'גבוה':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'בינוני':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'נמוך':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const handleApprove = (id: string) => {
    console.log(`Approving security review for ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting security review for ${id}`);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-card shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">מרכז בקרת ביטחון</h1>
                <p className="text-sm text-muted-foreground">בדיקת ביטחון מידע ואישור דרישות</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <Lock className="h-4 w-4 ml-2" />
              קב"ט
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-2">בדיקות ביטחון ממתינות</h2>
        </div>

        {/* סטטיסטיקות ביטחון */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">בדיקות ביטחון</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{securityStats.securityReviews}</div>
              <p className="text-xs text-muted-foreground">החודש</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">אושרו ביטחונית</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{securityStats.approvedRequests}</div>
              <p className="text-xs text-muted-foreground">דרישות</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ממתינים לבדיקה</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{securityStats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">דרישות</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">רמת סיכון כללית</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{securityStats.riskLevel}</div>
              <p className="text-xs text-muted-foreground">הערכה נוכחית</p>
            </CardContent>
          </Card>
        </div>

        {/* דרישות ממתינות לבדיקת ביטחון */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>דרישות ממתינות לבדיקת ביטחון</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{review.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        מספר בקשה: {review.id} • הוגש על ידי: {review.submittedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">תאריך הגשה: {review.date}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className={getRiskColor(review.riskLevel)}>
                          סיכון {review.riskLevel}
                        </Badge>
                        <Badge variant="outline">
                          {review.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold text-primary">{review.amount}</div>
                      <Badge variant="outline" className="mt-1">
                        {review.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 ml-2" />
                      אשר ביטחונית
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(review.id)}
                    >
                      <AlertTriangle className="h-4 w-4 ml-2" />
                      דחה - סיכון ביטחון
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

        {/* התראות ביטחון ותקנות */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>התראות ביטחון</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts.map((alert, index) => (
                  <Alert 
                    key={index} 
                    className={
                      alert.type === 'error' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' :
                      alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950' : 
                      'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
                    }
                  >
                    <AlertDescription className="flex justify-between items-center">
                      <span>{alert.message}</span>
                      <span className="text-sm text-muted-foreground">{alert.time}</span>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הנחיות ביטחון</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border-r-4 border-red-500 bg-red-50 dark:bg-red-950">
                  <h4 className="font-medium">חובה - תקנות GDPR</h4>
                  <p className="text-sm text-muted-foreground">
                    כל רכישת מערכות שמטפלות במידע אישי דורשת אישור קב"ט מוקדם
                  </p>
                </div>
                <div className="p-3 border-r-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
                  <h4 className="font-medium">התראה - ציוד רשת</h4>
                  <p className="text-sm text-muted-foreground">
                    רכישת ציוד רשת מעל ₪100,000 דורשת בדיקת אבטחת סייבר
                  </p>
                </div>
                <div className="p-3 border-r-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-medium">עדכון - תקנות חדשות</h4>
                  <p className="text-sm text-muted-foreground">
                    תקנות אבטחת מידע חדשות נכנסו לתוקף החודש - עיין במדריך המעודכן
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