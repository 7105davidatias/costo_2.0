import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'error';
  progress?: number;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep?: string;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'in-progress':
        return (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        );
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-primary';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectorColor = (index: number) => {
    if (index === steps.length - 1) return '';
    const currentStepIndex = steps.findIndex(s => s.id === currentStep);
    return index < currentStepIndex ? 'bg-success' : 'bg-muted';
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="relative">
          {/* Step Content */}
          <div className="flex items-start space-x-reverse space-x-4">
            <div className="flex-shrink-0 mt-1">
              {getStepIcon(step)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${getStepColor(step)}`}>
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>
              {step.status === 'in-progress' && step.progress !== undefined && (
                <div className="mt-2">
                  <Progress value={step.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.progress}% הושלם
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="absolute right-2 top-8 w-0.5 h-8 bg-muted">
              <div
                className={`w-full transition-all duration-300 ${getConnectorColor(index)}`}
                style={{
                  height: step.status === 'completed' ? '100%' : '0%',
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
