import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Activity, Shield, AlertTriangle, Settings, UserPlus, CheckCircle, Server } from "lucide-react";

interface SystemStats {
  activeUsers: number;
  totalEstimates: number;
  systemUptime: string;
  securityAlerts: number;
  totalUsers: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
}

export default function SystemAdminDashboard() {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    activeUsers: 8,
    totalEstimates: 12,
    systemUptime: "99.9%",
    securityAlerts: 2,
    totalUsers: 12
  });

  const [users] = useState<User[]>([
    { id: 1, name: "דוד כהן", email: "admin@company.com", role: "מנהל מערכת", department: "מערכות מידע", status: "פעיל", lastLogin: "2024-01-15 14:30" },
    { id: 2, name: "רחל לוי", email: "economist@company.com", role: "כלכלן", department: "כלכלה", status: "פעיל", lastLogin: "2024-01-15 14:25" },
    { id: 3, name: "משה אברהם", email: "procurement@company.com", role: "איש רכש", department: "רכש", status: "פעיל", lastLogin: "2024-01-15 13:45" },
    { id: 4, name: "שרה דוד", email: "security@company.com", role: "קב\"ט", department: "ביטחון מידע", status: "פעיל", lastLogin: "2024-01-15 12:30" }
  ]);

  const [systemLogs] = useState([
    { message: "משתמש רחל לוי התחבר למערכת", time: "לפני 5 דקות", type: "info" },
    { message: "נוצר אומדן חדש - REQ-2024-017", time: "לפני 15 דקות", type: "info" },
    { message: "התראת ביטחון - ניסיון גישה חשוד", time: "לפני שעה", type: "warning" }
  ]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-card shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">מרכז בקרת מנהל מערכת</h1>
                <p className="text-sm text-muted-foreground">ניהול משתמשים ובקרת המערכת</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Users className="h-4 w-4 ml-2" />
              מנהל מערכת
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-2">סטטיסטיקות מערכת</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">משתמשים במערכת</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600">{systemStats.activeUsers}</div>
              <p className="text-sm text-muted-foreground">מתוך {systemStats.totalEstimates} כולל</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <Server className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">זמינות מערכת</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600">{systemStats.systemUptime}</div>
              <p className="text-sm text-muted-foreground">עומס: 45%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">התראות ביטחון</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-red-600">{systemStats.securityAlerts}</div>
              <p className="text-sm text-muted-foreground">דורשות טיפול</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">אומדנים כולל</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600">156</div>
              <p className="text-sm text-muted-foreground">החודש</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ניהול משתמשים */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  ניהול משתמשים
                </CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 ml-2" />
                  הוסף משתמש
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.role}</div>
                      <div className="text-xs text-muted-foreground">כניסה אחרונה: {user.lastLogin}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{user.status}</Badge>
                      <Button size="sm" variant="outline">ערוך</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* פעילות מערכת */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                פעילות מערכת אחרונה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemLogs.map((log, index) => (
                  <Alert key={index} className={log.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950' : ''}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {log.type === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <AlertDescription className="flex justify-between items-center w-full">
                        <span>{log.message}</span>
                        <span className="text-sm text-muted-foreground">{log.time}</span>
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* כלי ניהול מערכת */}
        <Card>
          <CardHeader>
            <CardTitle>כלי ניהול מערכת</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col justify-center">
                <Server className="h-6 w-6 mb-2" />
                <span className="font-medium">ניטור שרתים</span>
                <span className="text-xs text-muted-foreground">בדיקת ביצועים</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col justify-center">
                <Shield className="h-6 w-6 mb-2" />
                <span className="font-medium">הגדרות אבטחה</span>
                <span className="text-xs text-muted-foreground">מדיניות ביטחון</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col justify-center">
                <Activity className="h-6 w-6 mb-2" />
                <span className="font-medium">לוגי מערכת</span>
                <span className="text-xs text-muted-foreground">ביקורת פעילות</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}