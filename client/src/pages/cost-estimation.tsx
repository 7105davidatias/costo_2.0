import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Share, Download, TrendingUp, PiggyBank, TriangleAlert, Lightbulb, Calculator, BarChart3, ArrowRight } from "lucide-react";
import { CostEstimation as CostEstimationType, ProcurementRequest } from "@shared/schema";

export default function CostEstimation() {
  const { id } = useParams();

  const { data: request } = useQuery<ProcurementRequest>({
    queryKey: ["/api/procurement-requests", id],
    enabled: !!id,
  });

  const { data: estimation, isLoading } = useQuery<CostEstimationType>({
    queryKey: ["/api/cost-estimations/request", id],
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
    </div>
  );
}
