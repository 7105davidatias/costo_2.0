import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, User, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Header() {
  const { pathname } = useLocation();

  const navigationItems = [
    { path: "/dashboard", label: "לוח בקרה" },
    { path: "/procurement-requests", label: "דרישות רכש" },
    { path: "/cost-estimation", label: "אומדני עלויות" },
    { path: "/market-research", label: "מחקר שוק" },
    { path: "/reports", label: "דוחות" },
    { path: "/templates", label: "תבניות" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard" && (pathname === "/" || pathname === "/dashboard")) return true;
    if (path === "/procurement-requests" && (pathname === "/procurement-requests" || pathname.startsWith("/procurement-request"))) return true;
    return pathname.startsWith(path);
  };

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-3 neon-text-primary hover:animate-neon-glow transition-all duration-300"
          >
            <Calculator className="h-8 w-8" />
            <span className="font-bold text-xl neon-text-primary">מערכת רכש</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/dashboard"
            className={cn(
              "text-base font-medium transition-all duration-300 hover:neon-text-primary hover:shadow-neon px-3 py-2 rounded-lg",
              pathname === "/dashboard" ? "neon-text-primary bg-procurement-primary-neon/10 border border-procurement-primary-neon/30" : "neon-text-muted hover:bg-procurement-background-glass"
            )}
          >
            לוח בקרה
          </Link>
          <Link
            href="/procurement-requests"
            className={cn(
              "text-base font-medium transition-all duration-300 hover:neon-text-primary hover:shadow-neon px-3 py-2 rounded-lg",
              pathname === "/procurement-requests" ? "neon-text-primary bg-procurement-primary-neon/10 border border-procurement-primary-neon/30" : "neon-text-muted hover:bg-procurement-background-glass"
            )}
          >
            דרישות רכש
          </Link>
          <Link
            href="/market-research"
            className={cn(
              "text-base font-medium transition-all duration-300 hover:text-purple-400 hover:shadow-neon px-3 py-2 rounded-lg",
              pathname === "/market-research" ? "text-purple-400 bg-purple-400/10 border border-purple-400/30" : "neon-text-muted hover:bg-procurement-background-glass"
            )}
          >
            מחקר שוק
          </Link>
          <Link
            href="/reports"
            className={cn(
              "text-base font-medium transition-all duration-300 hover:neon-text-primary hover:shadow-neon px-3 py-2 rounded-lg",
              pathname === "/reports" ? "neon-text-primary bg-procurement-primary-neon/10 border border-procurement-primary-neon/30" : "neon-text-muted hover:bg-procurement-background-glass"
            )}
          >
            דוחות
          </Link>
          <Link
            href="/templates"
            className={cn(
              "text-base font-medium transition-all duration-300 hover:neon-text-primary hover:shadow-neon px-3 py-2 rounded-lg",
              pathname === "/templates" ? "neon-text-primary bg-procurement-primary-neon/10 border border-procurement-primary-neon/30" : "neon-text-muted hover:bg-procurement-background-glass"
            )}
          >
            תבניות
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="w-5 h-5 neon-text-primary" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full bg-red-500 text-white border-0">
              3
            </Badge>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center shadow-glow">
              <User className="text-white w-5 h-5" />
            </div>
            <span className="text-base font-medium neon-text-primary whitespace-nowrap">אהרון כהן</span>
          </div>
        </div>
      </div>
    </header>
  );
}