
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Bot, Play, CheckCircle, AlertCircle, Zap, Calculator, ArrowRight, Clock, TrendingUp, Shield, Lightbulb, AlertTriangle, Target, History, Truck } from 'lucide-react';
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

interface CategoryDetection {
  category: string;
  confidence: number;
  subcategory: string;
  reasoning: string[];
}

interface HistoricalComparison {
  similarItems: Array<{
    id: string;
    name: string;
    category: string;
    cost: number;
    date: string;
    supplier: string;
    similarity: number;
  }>;
  priceVariance: number;
  averageCost: number;
  costTrend: 'rising' | 'falling' | 'stable';
}

interface DeliveryPrediction {
  estimatedDays: number;
  confidence: number;
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  supplierAnalysis: Array<{
    supplier: string;
    avgDelivery: number;
    reliability: number;
  }>;
}

interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  riskScore: number;
  risks: Array<{
    category: string;
    level: 'low' | 'medium' | 'high';
    description: string;
    mitigation: string;
  }>;
  warningFlags: string[];
}

interface OptimizationRecommendations {
  costOptimization: Array<{
    type: string;
    description: string;
    potentialSavings: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  timeOptimization: Array<{
    type: string;
    description: string;
    timeSaved: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  qualityOptimization: Array<{
    type: string;
    description: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export default function AIAnalysis({ requestId, specifications }: AIAnalysisProps) {
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [extractedSpecs, setExtractedSpecs] = useState<any>(null);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  
  // New state for enhanced analysis
  const [categoryDetection, setCategoryDetection] = useState<CategoryDetection | null>(null);
  const [historicalComparison, setHistoricalComparison] = useState<HistoricalComparison | null>(null);
  const [deliveryPrediction, setDeliveryPrediction] = useState<DeliveryPrediction | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState<OptimizationRecommendations | null>(null);

  // Fetch extracted data from database
  const { data: extractedData, refetch: refetchExtractedData } = useQuery<ExtractedDataResponse>({
    queryKey: ['/api/procurement-requests', requestId, 'extracted-data'],
    enabled: !!requestId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  // Fetch estimation methods when analysis is completed
  const { data: estimationMethods } = useQuery({
    queryKey: ['/api/estimation-methods', requestId],
    enabled: analysisCompleted || (extractedData?.hasData === true),
  });

  // Initialize state based on extracted data
  useEffect(() => {
    console.log('AIAnalysis - extractedData changed:', extractedData);
    if (extractedData?.hasData && extractedData?.data) {
      console.log('AIAnalysis - Setting up extracted data:', extractedData.data);
      setAnalysisCompleted(true);
      setAnalysisProgress(100);
      setAnalysisStarted(true);
      setExtractedSpecs(extractedData.data);
      setSteps(prevSteps => 
        prevSteps.map(step => ({ ...step, status: 'completed' as const }))
      );
      
      // Load enhanced analysis data
      loadEnhancedAnalysis();
    } else {
      console.log('AIAnalysis - No extracted data available');
    }
  }, [extractedData]);

  const [steps, setSteps] = useState<AnalysisStep[]>([
    {
      id: 'category-detection',
      title: 'זיהוי קטגוריה אוטומטי',
      description: 'ניתוח וסיווג אוטומטי של סוג הרכש',
      status: 'pending',
    },
    {
      id: 'historical-comparison',
      title: 'השוואה היסטורית',
      description: 'השוואה לרכישות דומות מהעבר',
      status: 'pending',
    },
    {
      id: 'delivery-prediction',
      title: 'חיזוי זמני אספקה',
      description: 'הערכת זמני אספקה מבוסס נתוני ספקים',
      status: 'pending',
    },
    {
      id: 'risk-assessment',
      title: 'הערכת סיכונים',
      description: 'ניתוח סיכונים דינמי מקיף',
      status: 'pending',
    },
    {
      id: 'optimization',
      title: 'המלצות אופטימיזציה',
      description: 'זיהוי הזדמנויות לחיסכון ושיפור',
      status: 'pending',
    },
  ]);

  const loadEnhancedAnalysis = () => {
    // Simulate enhanced analysis data based on extracted specs
    if (extractedSpecs) {
      // Category Detection
      setCategoryDetection({
        category: 'ציוד מחשוב',
        confidence: 96,
        subcategory: 'שרתים ותחזוקה',
        reasoning: [
          'זוהו מפרטים טכניים של שרת',
          'מזוהה מעבד Intel Xeon',
          'קיימים נתוני זיכרון ואחסון'
        ]
      });

      // Historical Comparison
      setHistoricalComparison({
        similarItems: [
          {
            id: 'REQ-2023-045',
            name: 'שרתי Dell PowerEdge R750',
            category: 'ציוד מחשוב',
            cost: 180000,
            date: '2023-08-15',
            supplier: 'Dell Technologies',
            similarity: 94
          },
          {
            id: 'REQ-2023-021',
            name: 'שרתי HP ProLiant DL380',
            category: 'ציוד מחשוב',
            cost: 195000,
            date: '2023-05-22',
            supplier: 'HP Enterprise',
            similarity: 87
          },
          {
            id: 'REQ-2023-003',
            name: 'שרתי Lenovo ThinkSystem',
            category: 'ציוד מחשוב',
            cost: 175000,
            date: '2023-02-10',
            supplier: 'Lenovo Israel',
            similarity: 82
          }
        ],
        priceVariance: 8.5,
        averageCost: 183333,
        costTrend: 'stable'
      });

      // Delivery Prediction
      setDeliveryPrediction({
        estimatedDays: 18,
        confidence: 89,
        factors: [
          {
            factor: 'זמינות מלאי',
            impact: -3,
            description: 'מוצרים זמינים במלאי מקומי'
          },
          {
            factor: 'עונתיות',
            impact: +2,
            description: 'עומס גבוה בתקופה נוכחית'
          },
          {
            factor: 'התקנה ותצורה',
            impact: +5,
            description: 'זמן נדרש להתקנה וקונפיגורציה'
          }
        ],
        supplierAnalysis: [
          {
            supplier: 'Dell Technologies',
            avgDelivery: 12,
            reliability: 96
          },
          {
            supplier: 'TechSource',
            avgDelivery: 8,
            reliability: 98
          },
          {
            supplier: 'CompuTrade',
            avgDelivery: 15,
            reliability: 92
          }
        ]
      });

      // Risk Assessment
      setRiskAssessment({
        overallRisk: 'low',
        riskScore: 25,
        risks: [
          {
            category: 'טכנולוגי',
            level: 'low',
            description: 'טכנולוגיה מוכחת ויציבה',
            mitigation: 'בחירת ספקים מובילים'
          },
          {
            category: 'כספי',
            level: 'low',
            description: 'מחיר יציב בהשוואה לשוק',
            mitigation: 'קבלת הצעות מחיר מרובות'
          },
          {
            category: 'זמני',
            level: 'medium',
            description: 'זמני אספקה עלולים להתארך',
            mitigation: 'תיאום מוקדם עם ספקים'
          }
        ],
        warningFlags: []
      });

      // Optimization Recommendations
      setOptimizationRecommendations({
        costOptimization: [
          {
            type: 'הנחת כמות',
            description: 'רכישה של 5 יחידות במקום 3 תזכה להנחה של 8%',
            potentialSavings: 16000,
            priority: 'high'
          },
          {
            type: 'תזמון רכישה',
            description: 'רכישה ברבעון הבא תחסוך 5% בעקבות מחזור מוצרים',
            potentialSavings: 10000,
            priority: 'medium'
          }
        ],
        timeOptimization: [
          {
            type: 'ספק מקומי',
            description: 'בחירה בספק מקומי תקצר זמן אספקה ב-7 ימים',
            timeSaved: 7,
            priority: 'high'
          },
          {
            type: 'הזמנה מוקדמת',
            description: 'הזמנה 2 שבועות מראש תמנע עיכובים',
            timeSaved: 5,
            priority: 'medium'
          }
        ],
        qualityOptimization: [
          {
            type: 'אחריות מורחבת',
            description: 'שדרוג לאחריות 5 שנים במקום 3',
            impact: 'הגנה משופרת על ההשקעה',
            priority: 'medium'
          },
          {
            type: 'שירות התקנה',
            description: 'הוספת שירות התקנה מקצועי',
            impact: 'הפעלה מהירה וללא בעיות',
            priority: 'high'
          }
        ]
      });
    }
  };

  const startAnalysis = async () => {
    setAnalysisStarted(true);
    setAnalysisProgress(0);
    
    const stepDuration = 3000; // 3 seconds per step for enhanced analysis
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i].id);
      
      setSteps(prev => prev.map(step => 
        step.id === steps[i].id 
          ? { ...step, status: 'in-progress', progress: 0 }
          : step
      ));
      
      // Simulate progress for current step with smooth animations
      for (let progress = 0; progress <= 100; progress += 5) {
        await new Promise(resolve => setTimeout(resolve, stepDuration / 20));
        setSteps(prev => prev.map(step => 
          step.id === steps[i].id 
            ? { ...step, progress }
            : step
        ));
        setAnalysisProgress(Math.round((i * 100 + progress) / steps.length));
      }
      
      setSteps(prev => prev.map(step => 
        step.id === steps[i].id 
          ? { ...step, status: 'completed', progress: 100 }
          : step
      ));
    }
    
    // Fetch real results from API
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
        setExtractedSpecs(result);
        loadEnhancedAnalysis();
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
    
    setAnalysisCompleted(true);
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium': return <Target className="w-4 h-4 text-warning" />;
      case 'low': return <Lightbulb className="w-4 h-4 text-info" />;
    }
  };

  return (
    <Card className="bg-card border-success/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-reverse space-x-2">
          <Bot className="text-success w-5 h-5" />
          <span>ניתוח AI מתקדם</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysisStarted ? (
          <div className="text-center py-8">
            <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              מוכן לניתוח AI מתקדם
            </h3>
            <p className="text-muted-foreground mb-6">
              לחץ כדי להתחיל ניתוח חכם הכולל זיהוי אוטומטי, השוואה היסטורית והערכת סיכונים
            </p>
            <Button 
              onClick={startAnalysis}
              className="bg-success text-white hover:bg-success/90 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-4 h-4 ml-2" />
              התחל ניתוח AI מתקדם
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
              <Progress value={analysisProgress} className="h-2 transition-all duration-500" />
            </div>

            {/* Enhanced Step Progress */}
            <ProgressIndicator steps={steps} currentStep={currentStep} />

            {/* Enhanced Analysis Results */}
            {analysisCompleted && (
              <div className="space-y-6 pt-4 border-t border-muted animate-in slide-in-from-bottom duration-500">
                {/* Category Detection */}
                {categoryDetection && (
                  <Card className="bg-primary/5 border-primary/20 transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-reverse space-x-2 text-lg">
                        <Target className="w-5 h-5 text-primary" />
                        <span>זיהוי קטגוריה אוטומטי</span>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {categoryDetection.confidence}% דיוק
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">קטגוריה מזוהה:</p>
                          <p className="text-lg font-semibold text-primary mb-1">{categoryDetection.category}</p>
                          <p className="text-sm text-muted-foreground">{categoryDetection.subcategory}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">בסיס הזיהוי:</p>
                          <ul className="space-y-1">
                            {categoryDetection.reasoning.map((reason, index) => (
                              <li key={index} className="text-sm text-foreground flex items-center">
                                <CheckCircle className="w-3 h-3 text-success ml-2" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Historical Comparison */}
                {historicalComparison && (
                  <Card className="bg-secondary/5 border-secondary/20 transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-reverse space-x-2 text-lg">
                        <History className="w-5 h-5 text-secondary" />
                        <span>השוואה היסטורית</span>
                        <Badge variant="outline" className={`${
                          historicalComparison.costTrend === 'stable' ? 'bg-success/10 text-success' :
                          historicalComparison.costTrend === 'rising' ? 'bg-destructive/10 text-destructive' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {historicalComparison.costTrend === 'stable' ? 'מחירים יציבים' :
                           historicalComparison.costTrend === 'rising' ? 'מחירים עולים' : 'מחירים יורדים'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-3">פריטים דומים מהעבר:</p>
                          <div className="space-y-3">
                            {historicalComparison.similarItems.map((item, index) => (
                              <div key={index} className="bg-muted/10 rounded-lg p-3 border">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {item.similarity}% דמיון
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                  <p>עלות: ₪{item.cost.toLocaleString()}</p>
                                  <p>ספק: {item.supplier}</p>
                                  <p>תאריך: {item.date}</p>
                                  <p>קוד: {item.id}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="space-y-4">
                            <div className="bg-muted/10 rounded-lg p-4 border">
                              <p className="text-sm font-medium text-muted-foreground mb-1">עלות ממוצעת היסטורית</p>
                              <p className="text-2xl font-bold text-secondary">₪{historicalComparison.averageCost.toLocaleString()}</p>
                            </div>
                            <div className="bg-muted/10 rounded-lg p-4 border">
                              <p className="text-sm font-medium text-muted-foreground mb-1">שונות מחירים</p>
                              <p className="text-xl font-semibold text-warning">±{historicalComparison.priceVariance}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Delivery Prediction */}
                {deliveryPrediction && (
                  <Card className="bg-info/5 border-info/20 transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-reverse space-x-2 text-lg">
                        <Truck className="w-5 h-5 text-info" />
                        <span>חיזוי זמני אספקה</span>
                        <Badge variant="outline" className="bg-info/10 text-info">
                          {deliveryPrediction.confidence}% ביטחון
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="text-center mb-4">
                            <p className="text-sm text-muted-foreground mb-1">זמן אספקה צפוי</p>
                            <p className="text-3xl font-bold text-info flex items-center justify-center">
                              <Clock className="w-6 h-6 ml-2" />
                              {deliveryPrediction.estimatedDays} ימים
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-3">גורמים משפיעים:</p>
                            <div className="space-y-2">
                              {deliveryPrediction.factors.map((factor, index) => (
                                <div key={index} className="flex items-center justify-between bg-muted/10 rounded p-2">
                                  <span className="text-sm text-foreground">{factor.factor}</span>
                                  <span className={`text-sm font-medium ${
                                    factor.impact > 0 ? 'text-destructive' : 'text-success'
                                  }`}>
                                    {factor.impact > 0 ? '+' : ''}{factor.impact} ימים
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-3">ניתוח ספקים:</p>
                          <div className="space-y-3">
                            {deliveryPrediction.supplierAnalysis.map((supplier, index) => (
                              <div key={index} className="bg-muted/10 rounded-lg p-3 border">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="text-sm font-medium text-foreground">{supplier.supplier}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {supplier.reliability}% אמינות
                                  </Badge>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>זמן אספקה ממוצע: {supplier.avgDelivery} ימים</span>
                                  <span className={supplier.reliability >= 95 ? 'text-success' : 'text-warning'}>
                                    {supplier.reliability >= 95 ? 'מומלץ' : 'סביר'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Risk Assessment */}
                {riskAssessment && (
                  <Card className={`transition-all duration-300 hover:shadow-md ${
                    riskAssessment.overallRisk === 'high' ? 'bg-destructive/5 border-destructive/20' :
                    riskAssessment.overallRisk === 'medium' ? 'bg-warning/5 border-warning/20' :
                    'bg-success/5 border-success/20'
                  }`}>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-reverse space-x-2 text-lg">
                        <Shield className="w-5 h-5" />
                        <span>הערכת סיכונים</span>
                        <Badge className={getRiskColor(riskAssessment.overallRisk)}>
                          {riskAssessment.overallRisk === 'low' ? 'סיכון נמוך' :
                           riskAssessment.overallRisk === 'medium' ? 'סיכון בינוני' : 'סיכון גבוה'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <div className="text-center mb-4">
                            <p className="text-sm text-muted-foreground mb-1">ציון סיכון כולל</p>
                            <p className={`text-3xl font-bold ${
                              riskAssessment.overallRisk === 'high' ? 'text-destructive' :
                              riskAssessment.overallRisk === 'medium' ? 'text-warning' :
                              'text-success'
                            }`}>
                              {riskAssessment.riskScore}/100
                            </p>
                          </div>
                          {riskAssessment.warningFlags.length > 0 && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                              <p className="text-sm font-medium text-destructive mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 ml-2" />
                                אזהרות חשובות
                              </p>
                              <ul className="space-y-1">
                                {riskAssessment.warningFlags.map((flag, index) => (
                                  <li key={index} className="text-sm text-destructive">• {flag}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-3">פירוט סיכונים:</p>
                          <div className="space-y-3">
                            {riskAssessment.risks.map((risk, index) => (
                              <div key={index} className="bg-muted/10 rounded-lg p-3 border">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="text-sm font-medium text-foreground">{risk.category}</p>
                                  <Badge className={getRiskColor(risk.level)}>
                                    {risk.level === 'low' ? 'נמוך' : risk.level === 'medium' ? 'בינוני' : 'גבוה'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-1">{risk.description}</p>
                                <p className="text-xs text-success">הפחתה: {risk.mitigation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Optimization Recommendations */}
                {optimizationRecommendations && (
                  <Card className="bg-accent/5 border-accent/20 transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-reverse space-x-2 text-lg">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span>המלצות אופטימיזציה</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cost Optimization */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                            <Calculator className="w-4 h-4 ml-2 text-success" />
                            חיסכון בעלויות
                          </h4>
                          <div className="space-y-3">
                            {optimizationRecommendations.costOptimization.map((opt, index) => (
                              <div key={index} className="bg-success/5 border border-success/20 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="text-sm font-medium text-foreground">{opt.type}</p>
                                  {getPriorityIcon(opt.priority)}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{opt.description}</p>
                                <p className="text-sm font-semibold text-success">
                                  חיסכון: ₪{opt.potentialSavings.toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Time Optimization */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                            <Clock className="w-4 h-4 ml-2 text-info" />
                            חיסכון בזמן
                          </h4>
                          <div className="space-y-3">
                            {optimizationRecommendations.timeOptimization.map((opt, index) => (
                              <div key={index} className="bg-info/5 border border-info/20 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="text-sm font-medium text-foreground">{opt.type}</p>
                                  {getPriorityIcon(opt.priority)}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{opt.description}</p>
                                <p className="text-sm font-semibold text-info">
                                  חיסכון: {opt.timeSaved} ימים
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quality Optimization */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                            <Shield className="w-4 h-4 ml-2 text-secondary" />
                            שיפור איכות
                          </h4>
                          <div className="space-y-3">
                            {optimizationRecommendations.qualityOptimization.map((opt, index) => (
                              <div key={index} className="bg-secondary/5 border border-secondary/20 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="text-sm font-medium text-foreground">{opt.type}</p>
                                  {getPriorityIcon(opt.priority)}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{opt.description}</p>
                                <p className="text-sm font-semibold text-secondary">
                                  השפעה: {opt.impact}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Original Extracted Specs */}
                {extractedSpecs?.extractedSpecs && (
                  <Card className="bg-card border-muted/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-reverse space-x-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span>מפרטים שחולצו</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(extractedSpecs.extractedSpecs).map(([key, value]) => (
                          <div key={key} className="bg-muted/10 p-3 rounded-lg border transition-all duration-200 hover:bg-muted/20">
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
                            <p className="text-foreground text-sm font-medium">
                              {typeof value === 'object' && value !== null 
                                ? JSON.stringify(value) 
                                : String(value || 'לא זמין')
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Estimation Methods Section */}
                {estimationMethods && (estimationMethods as any)?.recommendedMethods && (
                  <Card className="bg-card border-muted/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-reverse space-x-2">
                        <Calculator className="w-5 h-5 text-primary" />
                        <span>שיטות אומדן מומלצות</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        {(estimationMethods as any)?.recommendedMethods?.map((method: any) => (
                          <div key={method.id} className="border border-muted/20 rounded-lg p-4 hover:bg-muted/5 transition-all duration-200">
                            <div className="flex items-start space-x-reverse space-x-3">
                              <Checkbox
                                id={method.id}
                                checked={selectedMethods.includes(method.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedMethods([...selectedMethods, method.id]);
                                  } else {
                                    setSelectedMethods(selectedMethods.filter(id => id !== method.id));
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
                            className="border-secondary text-secondary hover:bg-secondary/10 transition-all duration-200"
                            onClick={() => {
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
                              className="bg-success text-white hover:bg-success/90 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                            >
                              <ArrowRight className="w-4 h-4 ml-2" />
                              יצירת אומדן ({selectedMethods.length})
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
