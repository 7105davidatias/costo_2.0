import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import ProcurementRequest from "@/pages/procurement-request";
import ProcurementRequestsList from "@/pages/procurement-requests-list";
import CostEstimation from "@/pages/cost-estimation";
import MarketResearch from "@/pages/market-research";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import SystemAdminDashboard from "@/components/dashboards/SystemAdminDashboard";
import EconomistDashboard from "@/components/dashboards/EconomistDashboard";
import ProcurementDashboard from "@/components/dashboards/ProcurementDashboard";
import SecurityDashboard from "@/components/dashboards/SecurityDashboard";
import { useState, useEffect } from "react";

function Router() {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const getRoleDashboard = () => {
    if (!user) return Dashboard;
    
    switch (user.role) {
      case 'system_admin':
        return SystemAdminDashboard;
      case 'economist':
        return EconomistDashboard;
      case 'procurement':
        return ProcurementDashboard;
      case 'security':
        return SecurityDashboard;
      default:
        return Dashboard;
    }
  };

  const UserDashboard = getRoleDashboard();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {isLoggedIn && <Header />}
      {isLoggedIn ? (
        <main className={isLoggedIn ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={UserDashboard} />
            <Route path="/dashboard" component={UserDashboard} />
            <Route path="/procurement-requests" component={ProcurementRequestsList} />
            <Route path="/procurement-request/:id?" component={ProcurementRequest} />
            <Route path="/cost-estimation/:id?" component={CostEstimation} />
            <Route path="/market-research/:category?" component={MarketResearch} />
            <Route component={NotFound} />
          </Switch>
        </main>
      ) : (
        <Switch>
          <Route path="/login" component={Login} />
          <Route component={Login} />
        </Switch>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
