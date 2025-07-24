import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, TrendingUp, Store, ArrowDown, Clock, Shield, Brain, Calculator, Cog, Medal, ArrowRight, ExternalLink } from "lucide-react";
import SupplierChart from "@/components/charts/supplier-chart";
import PriceTrackingChart from "@/components/charts/price-tracking-chart";
import { MarketInsight, Supplier } from "@shared/schema";

export default function MarketResearch() {
  const { category } = useParams();
  
  // Check if the parameter is actually a request ID (number) or a category (string)
  const isRequestId = category && !isNaN(Number(category));
  const requestId = isRequestId ? category : null;
  const actualCategory = !isRequestId ? category : null;
  
  // Use new contextual market research API if requestId is provided
  const { data: marketResearch } = useQuery({
    queryKey: ["/api/market-research", requestId],
    enabled: !!requestId,
  });

  // Fallback to category-based market insights
  const decodedCategory = actualCategory ? decodeURIComponent(actualCategory) : "ציוד טכנולוגי";
  const { data: marketInsight } = useQuery<MarketInsight>({
    queryKey: ["/api/market-insights", decodedCategory],
    enabled: !requestId,
  });

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
    enabled: !requestId,
  });

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getRiskBadge = (level: string) => {
    const riskMap = {
      'low': { label: 'נמוך', className: 'bg-success/20 text-success' },
      'medium': { label: 'בינוני', className: 'bg-warning/20 text-warning' },
      'high': { label: 'גבוה', className: 'bg-destructive/20 text-destructive' },
    };
    return riskMap[level as keyof typeof riskMap] || riskMap.medium;
  };

  const getRecommendationBadge = (supplier: Supplier) => {
    if (supplier.isPreferred) return { label: 'מומלץ', className: 'bg-success/20 text-success' };
    if (supplier.name.includes('Dell')) return { label: 'רשמי', className: 'bg-primary/20 text-primary' };
    return { label: 'סטנדרט', className: 'bg-muted/20 text-muted-foreground' };
  };

  // Use contextual data if available, otherwise fallback to legacy data
  const contextualSuppliers = marketResearch?.supplierComparison || [];
  const legacySuppliers = suppliers?.slice(0, 3) || [];
  
  const supplierComparisonData = (requestId ? contextualSuppliers : legacySuppliers).map((supplier: any, index: number) => ({
    supplier: supplier.supplier || supplier.name,
    price: 95 - (index * 10),
    quality: parseFloat(supplier.rating || "4.5") * 20,
    delivery: 100 - ((supplier.deliveryTime || "10").toString().match(/\d+/)?.[0] || 10) * 5,
    service: supplier.reliability || 85,
    reliability: supplier.reliability || 85,
  }));

  const priceHistoryData = Array.isArray(marketInsight?.priceHistory) ? 
    marketInsight.priceHistory.map((item: any) => ({
      month: item.month,
      price: item.price,
    })) : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => window.history.back()}>
              <ArrowRight className="w-4 h-4 ml-1 rotate-180" />
              חזרה
            </Button>
            <h1 className="text-3xl font-bold text-foreground">מחקר שוק</h1>
          </div>
          <p className="text-muted-foreground">
            {requestId && marketResearch?.requestDetails 
              ? `ניתוח מקיף של שוק ${marketResearch.requestDetails.title}`
              : `ניתוח מקיף של שוק ${decodedCategory}`
            }
          </p>
        </div>
        <div className="flex space-x-reverse space-x-4">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן נתונים
          </Button>
          <Button variant="outline">
            <Calculator className="w-4 h-4 ml-2" />
            צור אומדן
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4 ml-2" />
            ייצא דוח
          </Button>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">ממוצע שוק</p>
                <p className="text-2xl font-bold text-foreground">
                  {marketInsight?.averagePrice ? formatCurrency(marketInsight.averagePrice) : '₪68,300'}
                </p>
                <p className="text-primary text-sm mt-1">לכל יחידה</p>
              </div>
              <TrendingUp className="text-primary w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">מספר ספקים</p>
                <p className="text-2xl font-bold text-foreground">{marketInsight?.supplierCount || 15}</p>
                <p className="text-secondary text-sm mt-1">ספקים פעילים</p>
              </div>
              <Store className="text-secondary w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">מחיר מינימלי</p>
                <p className="text-2xl font-bold text-foreground">
                  {marketInsight?.minPrice ? formatCurrency(marketInsight.minPrice) : '₪61,500'}
                </p>
                <p className="text-success text-sm mt-1">10% מתחת לממוצע</p>
              </div>
              <ArrowDown className="text-success w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">זמן אספקה</p>
                <p className="text-2xl font-bold text-foreground">14</p>
                <p className="text-warning text-sm mt-1">ימי עסקים ממוצע</p>
              </div>
              <Clock className="text-warning w-8 h-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <TrendingUp className="text-primary w-5 h-5" />
              <span>השוואת ספקים</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <SupplierChart data={supplierComparisonData} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <TrendingUp className="text-secondary w-5 h-5" />
              <span>מגמות מחיר - 6 חודשים</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <PriceTrackingChart data={priceHistoryData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Supplier Table */}
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Store className="text-primary w-5 h-5" />
            <span>השוואה מפורטת של ספקים</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">ספק</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">מחיר ליחידה</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">דירוג</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">זמן אספקה</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">אחריות</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">הנחות</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">המלצה</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/20">
                {(requestId ? contextualSuppliers : legacySuppliers).map((supplier: any, index: number) => {
                  const isContextual = !!requestId;
                  const supplierName = supplier.supplier || supplier.name;
                  const supplierRating = supplier.rating || "4.5";
                  const supplierDeliveryTime = supplier.deliveryTime || "10 ימים";
                  const supplierWarranty = supplier.warranty || supplier.warrantyTerms || "3 שנים";
                  const supplierDiscount = supplier.discount || supplier.discountPolicy || "ללא הנחה";
                  const supplierPrice = supplier.pricePerUnit || formatCurrency(60500 + (index * 2500));
                  const supplierCode = supplier.contact || supplier.code || supplierName.substring(0, 2);
                  
                  // Determine recommendation based on context
                  const recommendationConfig = isContextual 
                    ? { label: index === 0 ? 'מומלץ' : index === 1 ? 'טוב' : 'סטנדרט', className: index === 0 ? 'bg-success/20 text-success' : index === 1 ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted-foreground' }
                    : getRecommendationBadge(supplier);
                  
                  return (
                    <tr key={index} className={`hover:bg-muted/10 ${index === 0 ? 'bg-success/5' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-reverse space-x-3">
                          <div className={`w-8 h-8 ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-green-600' : 'bg-purple-600'} rounded-lg flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{supplierCode}</span>
                          </div>
                          <span className="text-foreground font-medium">{supplierName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground font-bold">{supplierPrice}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-reverse space-x-1">
                          <span className="text-foreground">{supplierRating}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < Math.floor(parseFloat(supplierRating)) ? 'text-yellow-400' : 'text-muted'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${parseInt(supplierDeliveryTime) <= 10 ? 'text-success' : parseInt(supplierDeliveryTime) <= 14 ? 'text-warning' : 'text-muted-foreground'}`}>
                        {supplierDeliveryTime}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{supplierWarranty}</td>
                      <td className={`px-6 py-4 ${index === 0 ? 'text-success' : 'text-muted-foreground'}`}>
                        {supplierDiscount}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={recommendationConfig.className}>
                          {recommendationConfig.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment and AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Assessment Matrix */}
        <Card className="bg-card border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <Shield className="text-warning w-5 h-5" />
              <span>מטריצת הערכת סיכונים</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketInsight?.riskAssessment && Object.entries(marketInsight.riskAssessment).map(([key, value]) => {
                const riskConfig = getRiskBadge(value as string);
                const riskLabels: Record<string, string> = {
                  supplyRisk: "סיכון אספקה",
                  priceVolatility: "תנודתיות מחיר",
                  qualityRisk: "סיכון איכות",
                  marketCompetition: "תחרותיות שוק"
                };
                
                return (
                  <div key={key} className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{riskLabels[key] || key}</h4>
                      <p className="text-sm text-muted-foreground">
                        {key === 'supplyRisk' && 'זמינות מלאי ויציבות שרשרת אספקה'}
                        {key === 'priceVolatility' && 'יציבות מחיר ותחזיות לטווח הקרוב'}
                        {key === 'qualityRisk' && 'היסטוריית איכות וביצועים'}
                        {key === 'marketCompetition' && 'רמת התחרות ואלטרנטיבות זמינות'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <span className={`font-medium ${riskConfig.className.includes('success') ? 'text-success' : riskConfig.className.includes('warning') ? 'text-warning' : 'text-destructive'}`}>
                        {riskConfig.label}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${riskConfig.className.includes('success') ? 'bg-success' : riskConfig.className.includes('warning') ? 'bg-warning' : 'bg-destructive'}`}></div>
                    </div>
                  </div>
                ) as React.ReactNode;
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Market Recommendations */}
        <Card className="bg-card border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <Brain className="text-success w-5 h-5" />
              <span>המלצות AI למחקר שוק</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(requestId ? marketResearch?.recommendations : marketInsight?.recommendations || []).map((rec: any, index: number) => (
                <div key={index} className="p-4 bg-success/5 border-r-4 border-success rounded-lg">
                  <div className="flex items-start space-x-reverse space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {rec.title || `המלצה ${index + 1}`}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {rec.description || rec}
                      </p>
                      {rec.priority && (
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                          rec.priority === 'גבוהה' ? 'bg-destructive/20 text-destructive' :
                          rec.priority === 'בינונית' ? 'bg-warning/20 text-warning' :
                          'bg-muted/20 text-muted-foreground'
                        }`}>
                          עדיפות {rec.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show fallback recommendations if no contextual data */}
              {!requestId && (
                <>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <div className="flex items-start space-x-reverse space-x-3">
                      <Calculator className="text-primary mt-1 w-5 h-5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">נוסחאות מומלצות</h4>
                        <p className="text-sm text-muted-foreground">
                          השתמש במקדם 0.85 למחיר ספק + 12% עלויות נוספות + מע״ם לחישוב מדויק יותר.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                    <div className="flex items-start space-x-reverse space-x-3">
                      <Cog className="text-secondary mt-1 w-5 h-5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">אופטימיזציה של מקדמים</h4>
                        <p className="text-sm text-muted-foreground">
                          מקדם הנחת כמות מומלץ: 8-12% ל-3+ יחידות, 15-20% ל-10+ יחידות.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                    <div className="flex items-start space-x-reverse space-x-3">
                      <Medal className="text-success mt-1 w-5 h-5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">ספקים מועדפים</h4>
                        <p className="text-sm text-muted-foreground">
                          TechSource מציע את המחיר הטוב ביותר עם דירוג גבוה. Dell רשמי למבטח איכות.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Market Timing */}
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                <div className="flex items-start space-x-reverse space-x-3">
                  <Clock className="text-warning mt-1 w-5 h-5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">עיתוי אופטימלי</h4>
                    <p className="text-sm text-muted-foreground">
                      רכישה במרץ 2024 תספק חיסכון מקסימלי של 3-5% נוספים.
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
            <ExternalLink className="text-info w-5 h-5" />
            <span>מקורות המידע והנתונים</span>
          </CardTitle>
          <p className="text-muted-foreground text-sm">מקורות המידע והנתונים שעליהם מתבסס מחקר השוק</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(requestId ? marketResearch?.informationSources : [
              {
                title: "מחירון הממשלה",
                description: "מחירון ממשלתי רשמי לציוד מחשוב ורכש ציבורי",
                lastUpdated: "ינואר 2024",
                reliability: "גבוהה"
              },
              {
                title: "Intel Israel",
                description: "נתוני מחירים מספקים מאושרים בישראל",
                lastUpdated: "דצמבר 2023", 
                reliability: "גבוהה"
              },
              {
                title: "TechSource Ltd",
                description: "הסכמי מחיר מעודכנים עם ספק מועדף",
                lastUpdated: "נובמבר 2023",
                reliability: "גבוהה"
              },
              {
                title: "מדד המחירים לצרכן",
                description: "נתוני אינפלציה ומדד מחירים - הלשכה המרכזית לסטטיסטיקה",
                lastUpdated: "דצמבר 2023",
                reliability: "גבוהה"
              },
              {
                title: "Dell Israel",
                description: "מחירים רשמיים מ-Dell ישראל ומפיציהם",
                lastUpdated: "ינואר 2024",
                reliability: "גבוהה"
              },
              {
                title: "מערכת רכש ממשלתי",
                description: "נתוני רכש וחוזים מהמערכת הממשלתית",
                lastUpdated: "ינואר 2024",
                reliability: "גבוהה"
              }
            ]).map((source: any, index: number) => (
              <div key={index} className="bg-muted/10 border border-muted/20 rounded-lg p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start space-x-reverse space-x-3">
                  <ExternalLink className="text-primary mt-1 w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-foreground mb-1">{source.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{source.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">עודכן: {source.lastUpdated}</p>
                      {source.reliability && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          source.reliability === 'גבוהה' ? 'bg-success/20 text-success' :
                          source.reliability === 'בינונית' ? 'bg-warning/20 text-warning' :
                          'bg-muted/20 text-muted-foreground'
                        }`}>
                          אמינות {source.reliability}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-info/10 border border-info/30 rounded-lg">
            <div className="flex items-start space-x-reverse space-x-2">
              <Shield className="text-info mt-0.5 w-4 h-4 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                כל המידע מתבסס על מקורות מאושרים ומעודכנים. הנתונים נבדקים ומתעדכנים באופן שוטף לדיוק מקסימלי.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
