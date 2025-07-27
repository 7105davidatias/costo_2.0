import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Activity, Shield, AlertTriangle } from "lucide-react";

interface SystemStats {
  activeUsers: number;
  totalEstimates: number;
  systemUptime: string;
  securityAlerts: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

export default function SystemAdminDashboard() {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    activeUsers: 12,
    totalEstimates: 156,
    systemUptime: "99.9%",
    securityAlerts: 3
  });

  const [users] = useState<User[]>([
    { id: 1, name: "דוד כהן", email: "admin@company.com", role: "מנהל מערכת", department: "מערכות מידע", status: "פעיל" },
    { id: 2, name: "רחל לוי", email: "economist@company.com", role: "כלכלן", department: "כלכלה", status: "פעיל" },
    { id: 3, name: "משה אברהם", email: "procurement@company.com", role: "איש רכש", department: "רכש", status: "פעיל" },
    { id: 4, name: "שרה דוד", email: "security@company.com", role: "קב\"ט", department: "ביטחון מידע", status: "פעיל" }
  ]);

  const [systemLogs] = useState([
    { message: "משתמש רחל לוי התחבר למערכת", time: "לפני 5 דקות", type: "info" },
    { message: "נוצר אומדן חדש - REQ-2024-017", time: "לפני 15 דקות", type: "info" },
    { message: "התראת ביטחון - ניסיון גישה חשוד", time: "לפני שעה", type: "warning" }
  ]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">דשבורד מנהל מערכת</h1>
          <p className="text-muted-foreground">ניהול ובקרה של מערכת אומדני עלויות הרכש</p>
        </div>

        {/* סטטיסטיקות מערכת */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">משתמשים פעילים</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{systemStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">השבוע</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">סה"כ אומדנים</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.totalEstimates}</div>
              <p className="text-xs text-muted-foreground">החודש</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">זמינות מערכת</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.systemUptime}</div>
              <p className="text-xs text-muted-foreground">החודש</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">התראות ביטחון</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{systemStats.securityAlerts}</div>
              <p className="text-xs text-muted-foreground">פעילות</p>
            </CardContent>
          </Card>
        </div>

        {/* ניהול משתמשים */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>ניהול משתמשים</CardTitle>
              <Button>הוסף משתמש חדש</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3 font-medium">שם משתמש</th>
                    <th className="text-right p-3 font-medium">אימייל</th>
                    <th className="text-right p-3 font-medium">תפקיד</th>
                    <th className="text-right p-3 font-medium">מחלקה</th>
                    <th className="text-right p-3 font-medium">סטטוס</th>
                    <th className="text-right p-3 font-medium">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">{user.department}</td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="outline">ערוך</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* לוגי מערכת */}
        <Card>
          <CardHeader>
            <CardTitle>פעילות מערכת אחרונה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemLogs.map((log, index) => (
                <Alert key={index} className={log.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950' : ''}>
                  <AlertDescription className="flex justify-between items-center">
                    <span>{log.message}</span>
                    <span className="text-sm text-muted-foreground">{log.time}</span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}