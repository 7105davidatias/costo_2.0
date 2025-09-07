import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  ShoppingCart, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Bot,
  Home,
  Settings,
  HelpCircle,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const navigationItems = [
    {
      title: "ראשי",
      items: [
        { 
          path: "/dashboard", 
          label: "לוח בקרה", 
          icon: Home,
          badge: null
        },
      ]
    },
    {
      title: "רכש",
      items: [
        { 
          path: "/procurement-request", 
          label: "בקשות רכש", 
          icon: ShoppingCart,
          badge: "3"
        },
        { 
          path: "/cost-estimation", 
          label: "הערכות עלויות", 
          icon: Calculator,
          badge: null
        },
        { 
          path: "/market-research", 
          label: "מחקר שוק", 
          icon: BarChart3,
          badge: null
        },
        { 
          path: "/sql-runner", 
          label: "SQL Runner (Dev)", 
          icon: Database,
          badge: null
        },
      ]
    },
    {
      title: "כלים",
      items: [
        { 
          path: "/ai-analysis", 
          label: "ניתוח AI", 
          icon: Bot,
          badge: "חדש"
        },
        { 
          path: "/reports", 
          label: "דוחות", 
          icon: FileText,
          badge: null
        },
        { 
          path: "/analytics", 
          label: "אנליטיקה", 
          icon: TrendingUp,
          badge: null
        },
      ]
    }
  ];

  const bottomItems = [
    { path: "/settings", label: "הגדרות", icon: Settings },
    { path: "/help", label: "עזרה", icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard" && (location === "/" || location === "/dashboard")) return true;
    return location.startsWith(path);
  };

  return (
    <div className={cn("flex h-full w-64 flex-col bg-card border-l border-border", className)}>
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard">
          <div className="flex items-center space-x-reverse space-x-3">
            <div className="bg-primary p-2 rounded-lg glow-effect">
              <Calculator className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">מערכת רכש</h2>
              <p className="text-xs text-muted-foreground">AI Cost Estimation</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-6">
          {navigationItems.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start text-right h-10",
                          active && "bg-primary/10 text-primary border-r-2 border-primary"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-reverse space-x-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === "חדש" ? "default" : "secondary"}
                              className={cn(
                                "text-xs",
                                item.badge === "חדש" && "bg-success/20 text-success",
                                typeof item.badge === "string" && item.badge !== "חדש" && "bg-primary/20 text-primary"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border">
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-right h-9",
                    active && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="w-4 h-4 ml-3" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* User Info */}
        <div className="flex items-center space-x-reverse space-x-3 p-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">א</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">אהרון כהן</p>
            <p className="text-xs text-muted-foreground">מנהל רכש</p>
          </div>
        </div>
      </div>
    </div>
  );
}