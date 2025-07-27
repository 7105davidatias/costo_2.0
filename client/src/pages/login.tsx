import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { useLocation } from "wouter";
import { Lock, User, Mail, Building, UserCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "סיסמה נדרשת")
});

const registerSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
  firstName: z.string().min(1, "שם פרטי נדרש"),
  lastName: z.string().min(1, "שם משפחה נדרש"),
  role: z.enum(["admin", "procurement_manager", "department_head", "employee"]),
  department: z.string().min(1, "מחלקה נדרשת")
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

const demoUsers = [
  { email: "admin@company.com", password: "demo123", role: "admin", name: "מנהל מערכת", department: "IT" },
  { email: "procurement@company.com", password: "demo123", role: "procurement_manager", name: "מנהל רכש", department: "רכש" },
  { email: "department@company.com", password: "demo123", role: "department_head", name: "ראש מחלקה", department: "כספים" },
  { email: "employee@company.com", password: "demo123", role: "employee", name: "עובד", department: "הנדסה" }
];

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "employee",
      department: ""
    }
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        toast({
          title: "התחברות הצליחה",
          description: `ברוך הבא, ${result.user.firstName}!`
        });
        setLocation('/dashboard');
      } else {
        throw new Error(result.message || "שגיאה בהתחברות");
      }
    } catch (error: any) {
      toast({
        title: "שגיאה בהתחברות",
        description: error.message || "נסה שוב",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        toast({
          title: "הרשמה הצליחה",
          description: `ברוך הבא, ${result.user.firstName}!`
        });
        setLocation('/dashboard');
      } else {
        throw new Error(result.message || "שגיאה בהרשמה");
      }
    } catch (error: any) {
      toast({
        title: "שגיאה בהרשמה",
        description: error.message || "נסה שוב",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (user: typeof demoUsers[0]) => {
    loginForm.setValue('email', user.email);
    loginForm.setValue('password', user.password);
    handleLogin({ email: user.email, password: user.password });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login/Register Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "כניסה למערכת" : "הרשמה למערכת"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "הזן את פרטי ההתחברות שלך" 
                : "צור חשבון חדש במערכת"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>אימייל</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input {...field} type="email" className="pr-10" placeholder="user@company.com" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>סיסמה</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input {...field} type="password" className="pr-10" placeholder="••••••••" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "מתחבר..." : "כניסה"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שם פרטי</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="משה" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שם משפחה</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="כהן" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>אימייל</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input {...field} type="email" className="pr-10" placeholder="user@company.com" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>סיסמה</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input {...field} type="password" className="pr-10" placeholder="••••••••" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>תפקיד</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="employee">עובד</SelectItem>
                              <SelectItem value="department_head">ראש מחלקה</SelectItem>
                              <SelectItem value="procurement_manager">מנהל רכש</SelectItem>
                              <SelectItem value="admin">מנהל מערכת</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>מחלקה</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input {...field} className="pr-10" placeholder="רכש, כספים, הנדסה" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "נרשם..." : "הרשמה"}
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground"
              >
                {isLogin ? "אין לך חשבון? הירשם כאן" : "יש לך חשבון? התחבר כאן"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Users Panel */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              משתמשי דמו - כניסה מהירה
            </CardTitle>
            <CardDescription>
              לחץ על אחד מהמשתמשים להתחברות מהירה למערכת
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {demoUsers.map((user, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.department} • {user.role === 'admin' ? 'מנהל מערכת' : 
                             user.role === 'procurement_manager' ? 'מנהל רכש' :
                             user.role === 'department_head' ? 'ראש מחלקה' : 'עובד'}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => quickLogin(user)}
                        disabled={isLoading}
                        size="sm"
                      >
                        התחבר
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">פרטי התחברות:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div><strong>כל המשתמשים:</strong> סיסמה demo123</div>
                <div><strong>תפקידים זמינים:</strong></div>
                <ul className="list-disc list-inside mr-4 space-y-1">
                  <li><strong>מנהל מערכת:</strong> גישה מלאה לכל המערכת</li>
                  <li><strong>מנהל רכש:</strong> ניהול דרישות רכש ואומדנים</li>
                  <li><strong>ראש מחלקה:</strong> יצירת דרישות וצפייה באומדנים</li>
                  <li><strong>עובד:</strong> יצירת דרישות בסיסיות</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}