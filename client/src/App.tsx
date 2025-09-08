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
import Reports from "@/pages/reports";
import NotFound from "@/pages/not-found";
import Templates from "@/pages/templates";
import SqlRunner from "@/pages/sql-runner";
import EstimationMethods from "@/pages/estimation-methods";


function Router() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/procurement-requests" component={ProcurementRequestsList} />
          <Route path="/procurement-request/:id?" component={ProcurementRequest} />
          <Route path="/cost-estimation/:id?" component={CostEstimation} />
          <Route path="/market-research/:category?" component={MarketResearch} />
          <Route path="/reports" component={Reports} />
          <Route path="/templates" component={Templates} />
          <Route path="/sql-runner" component={SqlRunner} />
          <Route path="/estimation-methods" component={EstimationMethods} />
          <Route component={NotFound} />
        </Switch>
      </main>
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