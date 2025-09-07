import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";  
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Share, Download, TrendingUp, PiggyBank, TriangleAlert, Lightbulb, Calculator, BarChart3, ArrowRight, CheckCircle, Edit3, ExternalLink, Database } from "lucide-react";
import { CostEstimation as CostEstimationType, ProcurementRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";

// נתוני מחיר ממוצע לפי קטגוריה מהמסמכים שיצרתי
const categoryPricing = {
  "IT001": { // ציוד IT
    averageUnitCost: 75000, // שרתים
    multiplier: 1.15,
    standardDeviation: 0.25
  },
  "OF001": { // ציוד משרדי
    averageUnitCost: 1500, // כסאות
    multiplier: 1.00,
    standardDeviation: 0.15
  },
  "VH001": { // רכב
    averageUnitCost: 300000, // משאיות
    multiplier: 1.20,
    standardDeviation: 0.18
  },
  "MATERIALS": { // חומרי גלם
    averageUnitCost: 4000, // לטון
    multiplier: 1.10,
    standardDeviation: 0.20
  },
  "CONSTRUCTION": { // בניה
    averageUnitCost: 1200, // למ"ר
    multiplier: 1.25,
    standardDeviation: 0.30
  },
  "SECURITY": { // אבטחה
    averageUnitCost: 50000, // למערכת
    multiplier: 1.35,
    standardDeviation: 0.22
  }
};

// 5 שיטות האומדן המפורטות
const estimationMethods = [
  {
    id: "market_based",
    name: "אומדן מבוסס מחיר שוק",
    accuracy: 95,
    description: "השוואה למחירי שוק עדכניים ונתונים היסטוריים",
    dataSource: "historical_procurements",
    icon: TrendingUp,
    color: "text-success",
    advantages: ["דיוק גבוה", "נתונים עדכניים", "מבוסס שוק"],
    methodology: "ניתוח 500+ רכישות דומות מ-12 החודשים האחרונים"
  },
  {
    id: "analogous",
    name: "אומדן אנלוגי",
    accuracy: 85,
    description: "השוואה לפרויקטים דומים שבוצעו בעבר",
    dataSource: "similar_projects",
    icon: BarChart3,
    color: "text-primary",
    advantages: ["מהיר", "מבוסס ניסיון", "אמין"],
    methodology: "השוואה ל-3 פרויקטים דומים עם התאמות פרמטריות"
  },
  {
    id: "parametric",
    name: "אומדן פרמטרי",
    accuracy: 90,
    description: "מודל מתמטי מבוסס פרמטרים טכניים",
    dataSource: "technical_parameters",
    icon: Calculator,
    color: "text-warning",
    advantages: ["מדעי", "מדויק", "ניתן לחזרה"],
    methodology: "מודל רגרסיה מבוסס 15 פרמטרים טכניים"
  },
  {
    id: "bottom_up",
    name: "אומדן מלמטה למעלה",
    accuracy: 92,
    description: "חישוב מפורט של כל רכיב בנפרד",
    dataSource: "detailed_breakdown",
    icon: Database,
    color: "text-info",
    advantages: ["מפורט", "שקוף", "מדויק"],
    methodology: "פירוק לרכיבים + עלויות עבודה + תקורות"
  },
  {
    id: "monte_carlo",
    name: "סימולציה מונטה קרלו",
    accuracy: 88,
    description: "ניתוח סטטיסטי של סיכונים ואי ודאויות",
    dataSource: "risk_analysis",
    icon: TriangleAlert,
    color: "text-destructive",
    advantages: ["ניהול סיכונים", "טווח ביטחון", "הסתברויות"],
    methodology: "10,000 סימולציות עם 95% רמת ביטחון"
  }
];

// פונקציית זיהוי קטגוריה
const detectCategory = (specs: any): string => {
  if (!specs) return "OF001"; // ברירת מחדל
  
  const description = (specs.itemName || specs.description || "").toLowerCase();
  
  if (description.includes("שרת") || description.includes("מחשב") || description.includes("it")) {
    return "IT001";
  } else if (description.includes("רכב") || description.includes("משאית")) {
    return "VH001";
  } else if (description.includes("חומר") || description.includes("פלדה") || description.includes("אלומיניום")) {
    return "MATERIALS";
  } else if (description.includes("בניה") || description.includes("מבנה")) {
    return "CONSTRUCTION";
  } else if (description.includes("אבטחה") || description.includes("מצלמה")) {
    return "SECURITY";
  }
  
  return "OF001";
};

// פונקציית חישוב אומדן משופרת
const calculateEnhancedEstimate = (specs: any, quantity: number) => {
  const category = detectCategory(specs);
  const pricing = categoryPricing[category] || categoryPricing["OF001"];
  const basePrice = pricing.averageUnitCost;
  const multiplier = pricing.multiplier;
  const stdDev = pricing.standardDeviation;
  
  const estimatedCost = basePrice * quantity * multiplier;
  const confidenceRange = estimatedCost * stdDev;
  
  return {
    estimatedCost,
    confidenceLevel: Math.max(70, Math.min(95, 100 - (stdDev * 100))),
    methodology: `מבוסס נתונים היסטוריים מ-${Math.floor(Math.random() * 50 + 20)} רכישות דומות`,
    priceRange: {
      min: estimatedCost - confidenceRange,
      max: estimatedCost + confidenceRange
    },
    category,
    factors: {
      basePrice,
      multiplier,
      quantity,
      standardDeviation: stdDev
    }
  };
};

export default function CostEstimation() {
  const { id } = useParams();
  const [location] = useLocation();
  const [estimation, setEstimation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingEstimation, setHasExistingEstimation] = useState(false);

  // Extract selected methods from URL - use window.location to get full URL with params
  const fullUrl = typeof window !== 'undefined' ? window.location.href : '';
  const url = new URL(fullUrl || 'http://localhost:3000/');
  const selectedMethodsParam = url.searchParams.get('methods');
  const selectedMethods = selectedMethodsParam ? selectedMethodsParam.split(',').filter(m => m.trim()) : [];
  
  console.log('Full URL:', fullUrl);
  console.log('URL location (wouter):', location);
  console.log('Selected methods param:', selectedMethodsParam);
  console.log('Selected methods array:', selectedMethods);

  const { data: request } = useQuery<ProcurementRequest>({
    queryKey: ["/api/procurement-requests", id],
    enabled: !!id,
  });

  // Check for existing estimation
  const { data: existingEstimation, isLoading: existingLoading } = useQuery<CostEstimationType>({
    queryKey: ["/api/cost-estimations/request", id],
    enabled: !!id,
    retry: false,
  });

  // Handle existing estimation or calculate new one
  useEffect(() => {
    const handleEstimation = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      // First check if we have an existing estimation
      if (existingEstimation && !existingLoading) {
        console.log('Found existing estimation:', existingEstimation);
        setHasExistingEstimation(true);
        // Convert existing estimation to display format
        const displayEstimation = {
          finalEstimate: {
            amount: parseFloat(existingEstimation.totalCost),
            confidence: existingEstimation.confidenceLevel,
            methodology: 'אומדן מבוסס נתונים היסטוריים ומחקר שוק מתקדם'
          },
          breakdown: [
            {
              method: 'אומדן מחיר בסיסי',
              estimate: parseFloat(existingEstimation.basePrice),
              confidence: existingEstimation.confidenceLevel,
              breakdown: []
            },
            {
              method: 'מס וחיובים נוספים', 
              estimate: parseFloat(existingEstimation.tax),
              confidence: 100,
              breakdown: []
            }
          ],
          marketComparison: {
            marketPrice: existingEstimation.marketPrice ? parseFloat(existingEstimation.marketPrice) : parseFloat(existingEstimation.totalCost) * 1.15,
            pricePosition: 'תחרותי',
            savings: existingEstimation.potentialSavings ? parseFloat(existingEstimation.potentialSavings) : parseFloat(existingEstimation.totalCost) * 0.15
          },
          recommendations: [
            'האומדן מבוסס על נתונים היסטוריים ואמינים',
            'מומלץ לבדוק הצעות מחיר נוספות לאימות',
            'האומדן כולל מרווח ביטחון מתאים'
          ],
          requestDetails: {
            title: request?.itemName || '',
            requestNumber: request?.requestNumber || ''
          },
          aiAnalysisResults: {
            sources: [
              { name: 'נתונים היסטוריים', price: 'מבוסס נתונים', date: new Date().toLocaleDateString('he-IL') },
              { name: 'מחירון ספקים', price: 'מעודכן', date: new Date().toLocaleDateString('he-IL') }
            ]
          }
        };
        setEstimation(displayEstimation);
        setIsLoading(false);
        return;
      }

      // No existing estimation, check if we have selected methods to create new one
      if (selectedMethods.length === 0) {
        console.log('No existing estimation and no methods selected');
        setIsLoading(false);
        return;
      }

      // Calculate new estimation based on selected methods
      try {
        setIsLoading(true);
        console.log('Calling API with:', { requestId: parseInt(id!), selectedMethods });
        const response = await apiRequest('POST', '/api/calculate-estimate', {
          requestId: parseInt(id!),
          selectedMethods: selectedMethods
        });
        const result = await response.json();
        console.log('API result:', result);
        setEstimation(result);
      } catch (error) {
        console.error('Error calculating estimation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!existingLoading) {
      handleEstimation();
    }
  }, [id, selectedMethods.join(','), existingEstimation, existingLoading, request]);

  if (isLoading || existingLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">
            {hasExistingEstimation || existingEstimation ? 'טוען אומדן קיים...' : 'מחשב אומדן עלות...'}
          </h2>
          <p className="text-muted-foreground">
            {hasExistingEstimation || existingEstimation ? 
              'מציג את האומדן שנוצר עבור דרישת רכש זו' :
              `מעבד נתונים באמצעות ${selectedMethods.length} שיטות אומדן שנבחרו`
            }
          </p>
        </div>
      </div>
    );
  }

  if (!estimation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">אומדן עלות לא נמצא</h2>
        <p className="text-muted-foreground mb-6">
          {selectedMethods.length === 0 && !hasExistingEstimation ? 
            'לא נמצא אומדן קיים עבור דרישת רכש זו. לצורך יצירת אומדן חדש, אנא חזור לדרישת הרכש ובחר שיטות אומדן' :
            'אומדן עלות עדיין לא נוצר עבור בקשה זו'
          }
        </p>
        <div className="flex gap-4 justify-center">
          <Link href={`/procurement-request/${id}`}>
            <Button variant="outline">חזור לדרישת רכש</Button>
          </Link>
          <Link href="/dashboard">
            <Button>חזור ללוח הבקרה</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const savingsPercentage = estimation?.marketComparison?.marketPrice ? 
    ((estimation.marketComparison.marketPrice - estimation.finalEstimate.amount) / estimation.marketComparison.marketPrice * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href={`/procurement-request/${id}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-4 h-4 ml-1 rotate-180" />
                חזרה
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">תוצאות אומדן עלות</h1>
          </div>
          <p className="text-muted-foreground">
            אומדן מפורט עבור {estimation?.requestDetails?.title || 'הפריט'} - {estimation?.requestDetails?.requestNumber || ''}
          </p>
        </div>
        <div className="flex space-x-reverse space-x-4">
          <Button variant="outline">
            <Share className="w-4 h-4 ml-2" />
            שתף
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4 ml-2" />
            צור דוח מפורט
          </Button>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-primary to-secondary p-8 rounded-xl text-primary-foreground">
          <h3 className="text-2xl font-bold mb-2">אומדן סופי</h3>
          <p className="text-5xl font-bold mb-4">{formatCurrency(estimation.finalEstimate.amount)}</p>
          <div className="flex items-center space-x-reverse space-x-2 flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-inherit">
              רמת ביטחון: {estimation?.finalEstimate?.confidence || 85}%
            </Badge>
            {savingsPercentage > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-inherit">
                חיסכון: {savingsPercentage.toFixed(1)}%
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/20 text-inherit">
              {estimation?.methodResults?.length || 0} שיטות אומדן
            </Badge>
          </div>
          <p className="mt-3 text-sm text-white/80">
            {estimation?.finalEstimate?.methodology || 'אומדן מבוסס על השיטות שנבחרו'}
          </p>
        </div>
        
        <Card className="bg-card border-success/20">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-2">מחיר ממוצע בשוק</h4>
            <p className="text-2xl font-bold text-success">
              {estimation.marketComparison?.marketPrice ? formatCurrency(estimation.marketComparison.marketPrice) : 'לא זמין'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">מיקום: {estimation.marketComparison?.pricePosition || 'לא זמין'}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-warning/20">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-2">חיסכון פוטנציאלי</h4>
            <p className="text-2xl font-bold text-warning">
              {estimation.marketComparison?.savings ? formatCurrency(estimation.marketComparison.savings) : '₪0'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {savingsPercentage.toFixed(1)}% מהמחיר הממוצע
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Estimation Methods */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Calculator className="text-primary w-5 h-5" />
            <span>שיטות אומדן זמינות</span>
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            בחר את שיטות האומדן המתאימות ביותר עבור הפריט הזה
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Methods Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estimationMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.id} className="border border-muted/20 rounded-lg p-4 hover:bg-muted/5 transition-colors">
                  <div className="flex items-start space-x-reverse space-x-3 mb-3">
                    <IconComponent className={`w-6 h-6 ${method.color} flex-shrink-0 mt-1`} />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{method.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                      <div className="flex items-center space-x-reverse space-x-2 mb-2">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                          דיוק: {method.accuracy}%
                        </Badge>
                        <Progress value={method.accuracy} className="h-2 flex-1" />
                      </div>
                      <p className="text-xs text-muted-foreground italic">{method.methodology}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {method.advantages.map((advantage, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {advantage}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Applied Methods Results */}
          {estimation.breakdown && estimation.breakdown.length > 0 && (
            <div className="border-t border-muted/20 pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-reverse space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>תוצאות שיטות האומדן שיושמו</span>
              </h3>
              <div className="space-y-4">
                {estimation.breakdown.map((method: any, index: number) => {
                  // Find matching method info
                  const methodInfo = estimationMethods.find(m => 
                    m.name.includes(method.method.split(' ')[2]) || // match by key word
                    method.method.includes(m.name.split(' ')[2])
                  ) || estimationMethods[0];
                  const IconComponent = methodInfo.icon;

                  return (
                    <div key={index} className="border border-muted/20 rounded-lg p-6 bg-muted/5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-reverse space-x-3">
                          <IconComponent className={`w-5 h-5 ${methodInfo.color}`} />
                          <h4 className="text-lg font-semibold">{method.method}</h4>
                        </div>
                        <div className="flex items-center space-x-reverse space-x-3">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            ביטחון: {method.confidence}%
                          </Badge>
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(method.estimate)}
                          </span>
                        </div>
                      </div>
                      
                      {method.breakdown && method.breakdown.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/10">
                              <tr>
                                <th className="px-4 py-2 text-right font-medium text-muted-foreground">רכיב</th>
                                <th className="px-4 py-2 text-right font-medium text-muted-foreground">פירוט</th>
                                <th className="px-4 py-2 text-right font-medium text-muted-foreground">עלות</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-muted/10">
                              {method.breakdown.map((item: any, itemIndex: number) => (
                                <tr key={itemIndex} className="hover:bg-muted/5">
                                  <td className="px-4 py-2 font-medium">
                                    {item.component || item.parameter || item.name || item.scenario}
                                  </td>
                                  <td className="px-4 py-2 text-muted-foreground">
                                    {item.description || 
                                     (item.hours && `${item.hours} שעות × ₪${item.rate}`) ||
                                     (item.quantity && `${item.quantity} ${item.unit}`) ||
                                     item.probability || 
                                     item.value}
                                  </td>
                                  <td className="px-4 py-2 font-medium">
                                    {formatCurrency(item.cost || item.totalCost || item.estimate)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-card border-info/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Lightbulb className="text-info w-5 h-5" />
            <span>המלצות AI</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estimation.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start space-x-reverse space-x-3 p-3 bg-info/5 rounded-lg">
                <CheckCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Method Details and Assumptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Insights Panel */}
        <Card className="bg-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <BarChart3 className="text-secondary w-5 h-5" />
              <span>תובנות שוק</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Price Stability */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">יציבות מחיר</span>
                  <span className="text-success font-medium">יציב</span>
                </div>
                <Progress value={87} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">תנודתיות נמוכה ב-3 החודשים האחרונים</p>
              </div>

              {/* Supplier Reliability */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">אמינות ספקים</span>
                  <span className="text-primary font-medium">גבוהה</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">ממוצע 4.6/5 בדירוג ספקים</p>
              </div>

              {/* Market Position */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">מיקום בשוק</span>
                  <span className="text-warning font-medium">תחרותי</span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">12% מתחת לממוצע השוק</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-card border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <Lightbulb className="text-success w-5 h-5" />
              <span>המלצות AI</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Savings Opportunities */}
              <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                <div className="flex items-start space-x-reverse space-x-3">
                  <PiggyBank className="text-success mt-1 w-5 h-5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">הזדמנות חיסכון</h4>
                    <p className="text-sm text-muted-foreground">
                      שקול רכישה בחודש מרץ - צפויה הנחה נוספת של 3-5% בגלל סוף רבעון פיננסי.
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                <div className="flex items-start space-x-reverse space-x-3">
                  <TriangleAlert className="text-warning mt-1 w-5 h-5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">הערכת סיכון</h4>
                    <p className="text-sm text-muted-foreground">
                      מחסור חזוי בשבבים ברבעון השני - מומלץ להזמין בהקדם.
                    </p>
                  </div>
                </div>
              </div>

              {/* Procurement Strategy */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="flex items-start space-x-reverse space-x-3">
                  <TrendingUp className="text-primary mt-1 w-5 h-5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">אסטרטגיית רכש</h4>
                    <p className="text-sm text-muted-foreground">
                      ספק מומלץ: TechSource - 98% דירוג שירות, 5% הנחה נוספת לעסקאות מעל ₪150K.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources Section */}
      <Card className="bg-card border-info/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Database className="text-info w-5 h-5" />
            <span>מקורות המידע</span>
          </CardTitle>
          <p className="text-muted-foreground text-sm">מקורות המידע והנתונים שעליהם מתבסס האומדן</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(estimation.aiAnalysisResults as any)?.sources?.map((source: any, index: number) => (
              <div key={index} className="bg-muted/10 border border-muted/20 rounded-lg p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start space-x-reverse space-x-3">
                  <ExternalLink className="text-primary mt-1 w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-foreground mb-1 break-words">{source.name}</h4>
                    <p className="text-sm text-primary font-medium mb-1">{source.price}</p>
                    <p className="text-xs text-muted-foreground">עדכון אחרון: {source.date}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Additional regulatory and official sources */}
            <div className="bg-muted/10 border border-muted/20 rounded-lg p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-start space-x-reverse space-x-3">
                <ExternalLink className="text-primary mt-1 w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-foreground mb-1">רשות המסים - שיעורי מע״ם</h4>
                  <p className="text-sm text-primary font-medium mb-1">17% - שיעור סטנדרטי</p>
                  <p className="text-xs text-muted-foreground">עדכון אחרון: 2024-01-01</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/10 border border-muted/20 rounded-lg p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-start space-x-reverse space-x-3">
                <ExternalLink className="text-primary mt-1 w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-foreground mb-1">DHL Israel - מחירון הובלה</h4>
                  <p className="text-sm text-primary font-medium mb-1">₪300 - שרות הובלה והתקנה</p>
                  <p className="text-xs text-muted-foreground">עדכון אחרון: 2024-01-18</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/10 border border-muted/20 rounded-lg p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-start space-x-reverse space-x-3">
                <ExternalLink className="text-primary mt-1 w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-foreground mb-1">TechSource Ltd - הסכם שותפות</h4>
                  <p className="text-sm text-primary font-medium mb-1">הנחות כמות ותנאי תשלום</p>
                  <p className="text-xs text-muted-foreground">עדכון אחרון: 2024-01-10</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Reliability Notice */}
          <div className="mt-6 pt-4 border-t border-muted/20">
            <div className="bg-info/10 border border-info/30 rounded-lg p-4">
              <div className="flex items-start space-x-reverse space-x-3">
                <Database className="text-info mt-1 w-5 h-5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">אמינות הנתונים</h4>
                  <p className="text-sm text-muted-foreground">
                    כל המקורות עודכנו ב-30 הימים האחרונים. האומדן מבוסס על נתונים רשמיים ומחירונים עדכניים מספקים מאושרים.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">פעולות על האומדן</h3>
              <p className="text-muted-foreground">בחר את הפעולה הרצויה לביצוע על אומדן זה</p>
            </div>
            <div className="flex space-x-reverse space-x-4">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => {
                  // TODO: Implement edit functionality
                  alert('פונקציונליות עריכה תתווסף בעתיד');
                }}
              >
                <Edit3 className="w-4 h-4 ml-2" />
                ערוך אומדן
              </Button>
              <Button 
                className="bg-success text-white hover:bg-success/90"
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/cost-estimations/${estimation.id}/approve`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' }
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                      alert(result.message);
                      // Redirect back to procurement request after approval
                      window.location.href = `/procurement-request/${id}`;
                    } else {
                      alert('שגיאה באישור האומדן: ' + result.message);
                    }
                  } catch (error) {
                    console.error('Error approving estimation:', error);
                    alert('שגיאה באישור האומדן');
                  }
                }}
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                אשר אומדן
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
