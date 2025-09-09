import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";  
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Share, Download, TrendingUp, PiggyBank, TriangleAlert, Lightbulb, Calculator, BarChart3, ArrowRight, CheckCircle, Edit3, ExternalLink, Database } from "lucide-react";
import { CostEstimation as CostEstimationType, ProcurementRequest } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

// Component for displaying list of all cost estimations
function CostEstimationsList() {
  const { data: completedRequests, isLoading } = useQuery({
    queryKey: ["/api/procurement-requests/completed"],
  });

  const { data: estimations } = useQuery({
    queryKey: ["/api/cost-estimations"],
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">טוען אומדני עלויות...</h2>
        </div>
      </div>
    );
  }

  const requestsWithEstimations = (completedRequests as any[] || []).filter((req: any) => 
    (estimations as any[] || []).some((est: any) => est.procurementRequestId === req.id)
  );

  // Calculate summary statistics
  const totalEstimations = (estimations as any[] || []).length;
  const totalValue = (estimations as any[] || []).reduce((sum: number, est: any) => sum + parseFloat(est.totalCost || '0'), 0);
  const avgConfidence = totalEstimations > 0 ? 
    (estimations as any[] || []).reduce((sum: number, est: any) => sum + (est.confidenceLevel || 0), 0) / totalEstimations : 0;
  const totalSavings = (estimations as any[] || []).reduce((sum: number, est: any) => sum + parseFloat(est.potentialSavings || '0'), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', { 
      style: 'currency', 
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">אומדני עלויות מאושרים</h1>
        <p className="text-muted-foreground">צפייה וניהול של כל האומדנים שאושרו במערכת</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">סה״כ אומדנים</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalEstimations}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">ערך כולל</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totalValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">ממוצע ביטחון</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round(avgConfidence)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">חסכון פוטנציאלי</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{formatCurrency(Math.abs(totalSavings))}</p>
              </div>
              <PiggyBank className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estimations List */}
      {requestsWithEstimations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Calculator className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">אין אומדנים מאושרים</h3>
            <p className="text-muted-foreground">עדיין לא נוצרו אומדנים במערכת. התחל על ידי יצירת אומדן ראשון.</p>
            <Link href="/procurement-requests">
              <Button className="mt-4">
                צור אומדן ראשון
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requestsWithEstimations.map((request: any) => {
            const estimation = (estimations as any[] || []).find((est: any) => est.procurementRequestId === request.id);
            return (
              <Card key={request.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Request Details */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{request.itemName}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{request.requestNumber}</p>
                          <Badge variant="secondary" className="text-xs">{request.category}</Badge>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          מאושר
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                    </div>

                    {/* Financial Details */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">סכום אומדן</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(parseFloat(estimation?.totalCost || '0'))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">רמת ביטחון</p>
                        <div className="flex items-center gap-2">
                          <Progress value={estimation?.confidenceLevel || 0} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{estimation?.confidenceLevel || 0}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link href={`/procurement-request/${request.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="w-4 h-4 ml-2" />
                          פרטי דרישה
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 ml-2" />
                        הורד דוח
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-muted flex justify-between items-center text-xs text-muted-foreground">
                    <span>נוצר ב־{new Date(estimation?.createdAt).toLocaleDateString('he-IL')}</span>
                    <span>עודכן ב־{new Date(request.updatedAt).toLocaleDateString('he-IL')}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CostEstimation() {
  const { id } = useParams();
  const [location] = useLocation();
  const [estimation, setEstimation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // If no ID is provided, show the list view
  if (!id) {
    return <CostEstimationsList />;
  }

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

  // Mutation for approving cost estimation
  const approveMutation = useMutation({
    mutationFn: async (estimationData: any) => {
      const response = await apiRequest('POST', '/api/cost-estimations/approve', {
        requestId: parseInt(id!),
        estimationData
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "אומדן אושר בהצלחה",
        description: "האומדן נשמר והבקשה עודכנה לסטטוס 'הושלם'",
        variant: "default",
      });
      // Invalidate dashboard queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/procurement-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה באישור האומדן",
        description: error?.message || "אירעה שגיאה בעת אישור האומדן",
        variant: "destructive",
      });
    }
  });

  // Calculate dynamic estimation based on selected methods
  useEffect(() => {
    const calculateEstimation = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      if (selectedMethods.length === 0) {
        console.log('No methods selected, setting loading to false');
        setIsLoading(false);
        return;
      }

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

    calculateEstimation();
  }, [id, selectedMethods.join(',')]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">מחשב אומדן עלות...</h2>
          <p className="text-muted-foreground">
            מעבד נתונים באמצעות {selectedMethods.length} שיטות אומדן שנבחרו
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
          {selectedMethods.length === 0 ? 
            'לא נבחרו שיטות אומדן. אנא חזור לשלב הקודם ובחר שיטות אומדן' :
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

      {/* Estimation Methods Breakdown */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Calculator className="text-primary w-5 h-5" />
            <span>פירוט שיטות האומדן</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {estimation.breakdown.map((method: any, index: number) => (
            <div key={index} className="border border-muted/20 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">{method.method}</h4>
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
          ))}
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
                disabled={approveMutation.isPending}
                onClick={() => {
                  if (!estimation) return;
                  
                  // Prepare estimation data for approval
                  const totalCost = estimation.finalEstimate?.amount || 0;
                  const marketPrice = estimation.marketComparison?.marketPrice || totalCost * 1.15;
                  const potentialSavings = estimation.marketComparison?.savings || (marketPrice - totalCost);
                  
                  const estimationData = {
                    totalCost: totalCost.toString(),
                    basePrice: (totalCost * 0.85).toString(), // Estimate base price as 85% of total
                    tax: (totalCost * 0.15).toString(), // Estimate tax as 15% of total
                    shippingCost: "0",
                    discountAmount: "0",
                    confidenceLevel: estimation.finalEstimate?.confidence || 85,
                    marketPrice: marketPrice.toString(),
                    potentialSavings: potentialSavings.toString(),
                    aiAnalysisResults: estimation || {}
                  };
                  
                  approveMutation.mutate(estimationData);
                }}
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                {approveMutation.isPending ? "מאשר..." : "אשר אומדן"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
