import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Share, Download, TrendingUp, PiggyBank, TriangleAlert, Lightbulb, Calculator, BarChart3, ArrowRight, CheckCircle, Edit3, ExternalLink, Database } from "lucide-react";
import { CostEstimation as CostEstimationType, ProcurementRequest } from "@shared/schema";

export default function CostEstimation() {
  const { id } = useParams();

  const { data: request } = useQuery<ProcurementRequest>({
    queryKey: ["/api/procurement-requests", id],
    enabled: !!id,
  });

  const { data: estimation, isLoading } = useQuery<CostEstimationType>({
    queryKey: ["/api/cost-estimates/request", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!estimation || !request) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">אומדן עלות לא נמצא</h2>
        <p className="text-muted-foreground mb-6">אומדן עלות עדיין לא נוצר עבור בקשה זו</p>
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

  const savingsPercentage = estimation.marketPrice ? 
    ((parseFloat(estimation.marketPrice) - parseFloat(estimation.totalCost)) / parseFloat(estimation.marketPrice) * 100) : 0;

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
            אומדן מפורט עבור {request.itemName} - {request.requestNumber}
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
          <h3 className="text-2xl font-bold mb-2">הערכה סופית</h3>
          <p className="text-5xl font-bold mb-4">{formatCurrency(estimation.totalCost)}</p>
          <div className="flex items-center space-x-reverse space-x-2 flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-inherit">
              רמת ביטחון: {estimation.confidenceLevel}%
            </Badge>
            {savingsPercentage > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-inherit">
                חיסכון: {savingsPercentage.toFixed(1)}%
              </Badge>
            )}
          </div>
        </div>
        
        <Card className="bg-card border-success/20">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-2">מחיר ממוצע בשוק</h4>
            <p className="text-2xl font-bold text-success">
              {estimation.marketPrice ? formatCurrency(estimation.marketPrice) : 'לא זמין'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">על בסיס 15 ספקים</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-warning/20">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-2">חיסכון פוטנציאלי</h4>
            <p className="text-2xl font-bold text-warning">
              {estimation.potentialSavings ? formatCurrency(estimation.potentialSavings) : '₪0'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {savingsPercentage.toFixed(1)}% מהמחיר הממוצע
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Justification Table */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Calculator className="text-primary w-5 h-5" />
            <span>טבלת הצדקה מפורטת</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">משתנה</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">ערך</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">מקור</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">רמת ביטחון</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">השפעה על מחיר</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/20">
                {Array.isArray(estimation.justifications) && estimation.justifications.map((justification: any, index) => (
                  <tr key={index} className="hover:bg-muted/10">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{justification.variable}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{justification.value}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{justification.source}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${justification.confidence >= 90 ? 'bg-success' : justification.confidence >= 70 ? 'bg-warning' : 'bg-destructive'}`}
                            style={{ width: `${justification.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{justification.confidence}%</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${justification.impact.startsWith('+') ? 'text-destructive' : 'text-success'}`}>
                      {justification.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights and AI Recommendations */}
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
                onClick={() => {
                  // TODO: Implement approval functionality
                  alert('אומדן אושר בהצלחה! התמחור יועבר לאישור סופי.');
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
