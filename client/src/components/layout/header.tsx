import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, User, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [location] = useLocation();

  const navigationItems = [
    { path: "/dashboard", label: "לוח בקרה", icon: Calculator },
    { path: "/procurement-requests", label: "דרישות רכש", icon: Calculator },
    { path: "/cost-estimation", label: "אומדני עלויות", icon: Calculator },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard" && (location === "/" || location === "/dashboard")) return true;
    if (path === "/procurement-requests" && (location === "/procurement-requests" || location.startsWith("/procurement-request"))) return true;
    return location.startsWith(path);
  };

  return (
    <header className="bg-card shadow-lg border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="bg-primary p-2 rounded-lg glow-effect">
              <Calculator className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">מערכת ניהול אומדני עלויות רכש</h1>
              <p className="text-sm text-muted-foreground">AI Procurement Cost Estimation</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-reverse space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`${
                    isActive(item.path)
                      ? "text-primary border-b-2 border-primary pb-1 bg-primary/10"
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors rounded-none`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center space-x-reverse space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge variant="destructive" className="absolute -top-1 -left-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <User className="text-primary-foreground w-4 h-4" />
              </div>
              <span className="text-sm text-muted-foreground">אהרון כהן</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
