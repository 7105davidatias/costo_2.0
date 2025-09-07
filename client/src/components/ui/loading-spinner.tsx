
import { cn } from "@/lib/utils";
import { Loader2, Calculator, FileText, Search, BarChart3, TrendingUp } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  type?: "default" | "estimation" | "analysis" | "research" | "chart" | "calculation";
}

const spinnerTexts = {
  default: "טוען...",
  estimation: "מחשב אומדן...",
  analysis: "מנתח מסמך...",
  research: "חוקר שוק...",
  chart: "מכין תרשים...",
  calculation: "מעבד נתונים..."
};

const spinnerIcons = {
  default: Loader2,
  estimation: Calculator,
  analysis: FileText,
  research: Search,
  chart: BarChart3,
  calculation: TrendingUp
};

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8"
};

export function LoadingSpinner({ 
  size = "md", 
  className, 
  text, 
  type = "default" 
}: LoadingSpinnerProps) {
  const Icon = spinnerIcons[type];
  const displayText = text || spinnerTexts[type];

  return (
    <div className={cn("flex items-center justify-center space-x-3", className)}>
      <Icon className={cn("animate-spin text-primary", sizeClasses[size])} />
      <span className="text-sm text-muted-foreground animate-pulse">
        {displayText}
      </span>
    </div>
  );
}

export function CenteredLoadingSpinner(props: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <LoadingSpinner {...props} />
    </div>
  );
}

export function FullPageLoader({ type = "default" }: { type?: LoadingSpinnerProps["type"] }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg p-8 shadow-lg">
        <LoadingSpinner size="lg" type={type} />
      </div>
    </div>
  );
}

export function InlineLoader({ type = "default", className }: { 
  type?: LoadingSpinnerProps["type"];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center space-x-2 text-muted-foreground", className)}>
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm">{spinnerTexts[type]}</span>
    </div>
  );
}
