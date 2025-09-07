
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartTooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function SmartTooltip({ content, children, className, side = "top" }: SmartTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("inline-flex items-center gap-1 cursor-help", className)}>
            {children}
            <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function QuickHelp({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">{title}</h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
