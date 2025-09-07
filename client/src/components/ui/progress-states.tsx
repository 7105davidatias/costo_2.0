
import { Progress } from "./progress";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress?: number;
  duration?: number;
}

interface ProgressStatesProps {
  steps: ProcessStep[];
  currentStep?: string;
  className?: string;
}

export function ProgressStates({ steps, currentStep, className }: ProgressStatesProps) {
  const getStepIcon = (step: ProcessStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepTextColor = (step: ProcessStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-700';
      case 'in-progress':
        return 'text-blue-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="relative">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-0.5">
              {getStepIcon(step)}
            </div>
            
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h4 className={cn("font-medium", getStepTextColor(step))}>
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
              
              {step.status === 'in-progress' && step.progress !== undefined && (
                <div className="space-y-1">
                  <Progress value={step.progress} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {step.progress}% הושלם
                    {step.duration && ` • נותרו ${Math.ceil((100 - step.progress) * step.duration / 100)} שניות`}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Connection line */}
          {index < steps.length - 1 && (
            <div className="absolute right-2.5 top-8 w-0.5 h-8 bg-gray-200">
              <div
                className={cn(
                  "w-full transition-all duration-500",
                  step.status === 'completed' ? 'bg-green-500 h-full' : 'h-0'
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function SimpleProgress({ 
  value, 
  label, 
  showPercentage = true,
  className 
}: { 
  value: number;
  label: string;
  showPercentage?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-500">{value}%</span>
        )}
      </div>
      <Progress value={value} className="h-3" />
    </div>
  );
}
