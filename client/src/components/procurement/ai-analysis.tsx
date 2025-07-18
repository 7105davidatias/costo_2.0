import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import ProgressIndicator from '@/components/ui/progress-indicator';

interface AIAnalysisProps {
  requestId: number;
  specifications?: any;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'error';
  progress?: number;
}

export default function AIAnalysis({ requestId, specifications }: AIAnalysisProps) {
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [extractedSpecs, setExtractedSpecs] = useState<any>(null);

  const [steps, setSteps] = useState<AnalysisStep[]>([
    {
      id: 'document-processing',
      title: 'עיבוד מסמכים',
      description: 'ניתוח וחילוץ טקסט מהמסמכים',
      status: 'pending',
    },
    {
      id: 'spec-extraction',
      title: 'חילוץ מפרטים',
      description: 'זיהוי מפרטים טכניים ודרישות',
      status: 'pending',
    },
    {
      id: 'market-analysis',
      title: 'ניתוח שוק',
      description: 'השוואת מחירים ואיתור ספקים',
      status: 'pending',
    },
    {
      id: 'cost-calculation',
      title: 'חישוב עלויות',
      description: 'הערכת עלות מבוססת AI',
      status: 'pending',
    },
  ]);

  const startAnalysis = async () => {
    setAnalysisStarted(true);
    setAnalysisProgress(0);
    
    // Simulate step-by-step analysis
    const stepDuration = 2000; // 2 seconds per step
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i].id);
      
      // Update current step to in-progress
      setSteps(prev => prev.map(step => 
        step.id === steps[i].id 
          ? { ...step, status: 'in-progress', progress: 0 }
          : step
      ));
      
      // Simulate progress for current step
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, stepDuration / 10));
        setSteps(prev => prev.map(step => 
          step.id === steps[i].id 
            ? { ...step, progress }
            : step
        ));
        setAnalysisProgress(Math.round((i * 100 + progress) / steps.length));
      }
      
      // Mark step as completed
      setSteps(prev => prev.map(step => 
        step.id === steps[i].id 
          ? { ...step, status: 'completed', progress: 100 }
          : step
      ));
    }
    
    // Analysis completed
    setAnalysisCompleted(true);
    setExtractedSpecs({
      processor: "Intel Xeon Silver 4314 (16 cores)",
      memory: "64GB DDR4 ECC",
      storage: "2x 1TB NVMe SSD",
      network: "4x 1GbE + 2x 10GbE",
      powerSupply: "750W Redundant",
      rackUnit: "2U",
      warrantyPeriod: "3 years",
      operatingSystem: "Windows Server 2022 / Linux",
    });
  };

  return (
    <Card className="bg-card border-success/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-reverse space-x-2">
          <Bot className="text-success w-5 h-5" />
          <span>תוצאות ניתוח AI</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysisStarted ? (
          <div className="text-center py-8">
            <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              מוכן לניתוח AI
            </h3>
            <p className="text-muted-foreground mb-6">
              לחץ כדי להתחיל ניתוח מתקדם של המסמכים והמפרטים
            </p>
            <Button 
              onClick={startAnalysis}
              className="bg-success text-white hover:bg-success/90"
            >
              <Play className="w-4 h-4 ml-2" />
              התחל ניתוח AI
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">התקדמות כללית</span>
                <span className="text-sm font-medium text-foreground">
                  {analysisProgress}%
                </span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>

            {/* Step Progress */}
            <ProgressIndicator steps={steps} currentStep={currentStep} />

            {/* Analysis Results */}
            {analysisCompleted && (
              <div className="space-y-4 pt-4 border-t border-muted">
                <div className="flex items-center space-x-reverse space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h4 className="font-medium text-foreground">ניתוח הושלם בהצלחה</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-foreground mb-2">מפרטים שחולצו:</h5>
                    <div className="space-y-2">
                      {extractedSpecs && Object.entries(extractedSpecs).map(([key, value]) => (
                        <div key={key} className="bg-muted/20 p-3 rounded-lg">
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            {key === 'processor' && 'מעבד'}
                            {key === 'memory' && 'זיכרון'}
                            {key === 'storage' && 'אחסון'}
                            {key === 'network' && 'רשת'}
                            {key === 'powerSupply' && 'ספק כוח'}
                            {key === 'rackUnit' && 'יחידות רק'}
                            {key === 'warrantyPeriod' && 'תקופת אחריות'}
                            {key === 'operatingSystem' && 'מערכת הפעלה'}
                          </label>
                          <p className="text-foreground text-sm">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-foreground mb-2">תובנות AI:</h5>
                    <div className="space-y-3">
                      <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                        <div className="flex items-start space-x-reverse space-x-2">
                          <Zap className="w-4 h-4 text-success mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              מפרטים מתקדמים זוהו
                            </p>
                            <p className="text-xs text-muted-foreground">
                              המערכת זיהתה בהצלחה את כל המפרטים הטכניים הנדרשים
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                        <div className="flex items-start space-x-reverse space-x-2">
                          <Bot className="w-4 h-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              רמת ביטחון גבוהה
                            </p>
                            <p className="text-xs text-muted-foreground">
                              94% ביטחון בדיוק הניתוח וחילוץ המפרטים
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                        <div className="flex items-start space-x-reverse space-x-2">
                          <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              המלצות נוספות
                            </p>
                            <p className="text-xs text-muted-foreground">
                              שקול שדרוג זיכרון ל-128GB לביצועים מיטביים
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
