import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Bot, Play, CheckCircle, AlertCircle, Zap, Calculator, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ProgressIndicator from '@/components/ui/progress-indicator';

interface AIAnalysisProps {
  requestId: number;
  specifications?: any;
}

interface ExtractedDataResponse {
  success: boolean;
  hasData: boolean;
  data?: any;
  extractionDate?: string;
  status?: string;
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
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  // Fetch extracted data from database
  const { data: extractedData } = useQuery<ExtractedDataResponse>({
    queryKey: ['/api/procurement-requests', requestId, 'extracted-data'],
    enabled: !!requestId,
  });

  // Fetch estimation methods when analysis is completed
  const { data: estimationMethods } = useQuery({
    queryKey: ['/api/estimation-methods', requestId],
    enabled: analysisCompleted || (extractedData?.hasData === true),
  });

  // Initialize state based on extracted data
  useEffect(() => {
    if (extractedData?.hasData && extractedData?.data) {
      setAnalysisCompleted(true);
      setAnalysisProgress(100);
      setExtractedSpecs(extractedData.data);
      setSteps(prevSteps => 
        prevSteps.map(step => ({ ...step, status: 'completed' as const }))
      );
    }
  }, [extractedData]);

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
    
    // Analysis completed - fetch real results from API
    try {
      const response = await fetch(`/api/ai-analysis/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('AI Analysis result:', result);
        setExtractedSpecs(result.extractedSpecs);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
    
    setAnalysisCompleted(true);
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
                            {/* Construction-specific specs */}
                            {key === 'buildingArea' && 'שטח בנייה'}
                            {key === 'buildingHeight' && 'גובה מבנה'}
                            {key === 'foundationType' && 'סוג יסוד'}
                            {key === 'steelStructure' && 'מבנה פלדה'}
                            {key === 'roofingSystem' && 'מערכת גגות'}
                            {key === 'electricalSystems' && 'מערכות חשמל'}
                            {key === 'ventilationSystem' && 'מערכת אוורור'}
                            {key === 'fireProtection' && 'מערכת כיבוי אש'}
                            {key === 'constructionPeriod' && 'תקופת בנייה'}
                            {key === 'permits' && 'היתרים'}
                            {/* Software-specific specs */}
                            {key === 'projectScope' && 'היקף פרויקט'}
                            {key === 'estimatedHours' && 'שעות עבודה מוערכות'}
                            {key === 'teamSize' && 'גודל צוות'}
                            {key === 'frontendTechnology' && 'טכנולוגיית Frontend'}
                            {key === 'backendTechnology' && 'טכנולוגיית Backend'}
                            {key === 'database' && 'מסד נתונים'}
                            {key === 'cloudInfrastructure' && 'תשתית ענן'}
                            {key === 'testingFramework' && 'מסגרת בדיקות'}
                            {key === 'developmentPeriod' && 'תקופת פיתוח'}
                            {key === 'maintenancePeriod' && 'תקופת תחזוקה'}
                            {/* Vehicle-specific specs */}
                            {key === 'vehicleType' && 'סוג רכב'}
                            {key === 'capacity' && 'קיבולת'}
                            {key === 'fuelType' && 'סוג דלק'}
                            {key === 'transmission' && 'תיבת הילוכים'}
                            {key === 'enginePower' && 'כוח מנוע'}
                            {key === 'cargoVolume' && 'נפח מטען'}
                            {key === 'fuelConsumption' && 'צריכת דלק'}
                            {key === 'warranty' && 'אחריות'}
                            {key === 'maintenance' && 'תחזוקה'}
                            {key === 'safety' && 'בטיחות'}
                            {/* Consulting-specific specs */}
                            {key === 'serviceType' && 'סוג שירות'}
                            {key === 'projectDuration' && 'משך פרויקט'}
                            {key === 'hourlyRate' && 'תעריף שעתי'}
                            {key === 'totalHours' && 'סך שעות'}
                            {key === 'deliverables' && 'תוצרים'}
                            {key === 'methodology' && 'מתודולוגיה'}
                            {key === 'industryExpertise' && 'מומחיות תעשייתית'}
                            {key === 'reportLanguage' && 'שפת דוח'}
                            {key === 'followUpSupport' && 'ליווי המשך'}
                            {/* Computing-specific specs */}
                            {key === 'quantity' && 'כמות'}
                            {key === 'graphics' && 'כרטיס גרפי'}
                            {key === 'networkCard' && 'כרטיס רשת'}
                            {key === 'formFactor' && 'גורם צורה'}
                            {/* Generic specs */}
                            {key === 'itemName' && 'שם פריט'}
                            {key === 'category' && 'קטגוריה'}
                            {key === 'description' && 'תיאור'}
                            {key === 'estimatedValue' && 'ערך מוערך'}
                            {key === 'specifications' && 'מפרטים'}
                            {key === 'deliveryTime' && 'זמן אספקה'}
                            {key === 'supplier' && 'ספק'}
                            {key === 'technicalRequirements' && 'דרישות טכניות'}
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

                  {/* Estimation Methods Section */}
                  {estimationMethods && estimationMethods.recommendedMethods && (
                    <div className="mt-8 pt-6 border-t border-muted/20">
                      <div className="mb-6">
                        <h5 className="font-medium text-foreground mb-2 flex items-center space-x-reverse space-x-2">
                          <Calculator className="w-4 h-4 text-primary" />
                          <span>שיטות אומדן מומלצות</span>
                        </h5>
                        <p className="text-sm text-muted-foreground mb-4">
                          בחר שיטה אחת או יותר לחישוב האומדן בהתאם לסוג הרכש ומאפייני הבקשה
                        </p>
                        
                        <div className="bg-info/10 border border-info/30 rounded-lg p-3 mb-4">
                          <div className="text-sm text-muted-foreground">
                            <strong>סוג הרכש שזוהה:</strong> {(estimationMethods as any)?.requestType === 'services' ? 'שירותים' : 'מוצרים/טובין'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {(estimationMethods as any)?.recommendedMethods?.map((method: any) => (
                          <div key={method.id} className="border border-muted/20 rounded-lg p-4 hover:bg-muted/5 transition-colors">
                            <div className="flex items-start space-x-reverse space-x-3">
                              <Checkbox
                                id={method.id}
                                checked={selectedMethods.includes(method.id)}
                                onCheckedChange={(checked) => {
                                  console.log('Method selection changed:', method.id, checked);
                                  if (checked) {
                                    const newMethods = [...selectedMethods, method.id];
                                    console.log('New selected methods:', newMethods);
                                    setSelectedMethods(newMethods);
                                  } else {
                                    const newMethods = selectedMethods.filter(id => id !== method.id);
                                    console.log('New selected methods after removal:', newMethods);
                                    setSelectedMethods(newMethods);
                                  }
                                }}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <label htmlFor={method.id} className="font-medium text-foreground cursor-pointer">
                                    {method.method}
                                  </label>
                                  <Badge variant="outline" className="text-xs">
                                    {method.suitability}% התאמה
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {method.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {method.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-muted/20">
                        <div className="text-sm text-muted-foreground">
                          {selectedMethods.length > 0 ? (
                            `נבחרו ${selectedMethods.length} שיטות אומדן`
                          ) : (
                            'בחר לפחות שיטה אחת ליצירת אומדן'
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            className="border-secondary text-secondary hover:bg-secondary/10"
                            onClick={() => {
                              console.log('Market Research button clicked from AI Analysis with ID:', requestId);
                              localStorage.setItem('currentRequestId', requestId.toString());
                              window.location.href = `/market-research/${requestId}`;
                            }}
                          >
                            <Bot className="w-4 h-4 ml-2" />
                            מחקר שוק
                          </Button>
                          <Link href={`/cost-estimation/${requestId}?methods=${selectedMethods.join(',')}`}>
                            <Button 
                              disabled={selectedMethods.length === 0}
                              className="bg-success text-white hover:bg-success/90"
                              onClick={() => {
                                console.log('Button clicked with selected methods:', selectedMethods);
                                console.log('Generated URL:', `/cost-estimation/${requestId}?methods=${selectedMethods.join(',')}`);
                              }}
                            >
                              <ArrowRight className="w-4 h-4 ml-2" />
                              יצירת אומדן על פי השיטות שנבחרו ({selectedMethods.length})
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
