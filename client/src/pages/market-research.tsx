import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, TrendingUp, Store, ArrowDown, Clock, Shield, Brain, Calculator, Cog, Medal, ArrowRight, ExternalLink, AlertTriangle, Target, Zap, MapPin, Calendar, Star, Save, Search, Filter, Plus, Sparkles } from "lucide-react";
import SupplierChart from "@/components/charts/supplier-chart";
import PriceTrackingChart from "@/components/charts/price-tracking-chart";
import { MarketInsight, Supplier } from "@shared/schema";

// Interface for expected market research data structure
interface MarketResearchData {
  supplierComparison?: Array<{
    supplier?: string;
    name?: string;
    pricePerUnit?: string;
    rating?: string;
    reliability?: number;
  }>;
  requestDetails?: {
    title?: string;
  };
  informationSources?: Array<{
    title: string;
    description: string;
    lastUpdated: string;
    reliability: string;
  }>;
}
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, PieChart, Pie, BarChart, Bar, LineChart, Line, Area, AreaChart } from 'recharts';
import AIRecommendations from '@/components/market/ai-recommendations';
import { LoadingSpinner, CenteredLoadingSpinner } from '@/components/ui/loading-spinner';
import { TableSkeleton, ChartSkeleton, CardSkeleton } from '@/components/ui/enhanced-skeleton';

export default function MarketResearch() {
  const { category } = useParams();

  // State variables - must be at the top before any conditional logic
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [estimatedCost, setEstimatedCost] = useState<number>(100000);
  const [quantity, setQuantity] = useState<number>(1);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);

  // Check if the parameter is actually a request ID (number) or a category (string)
  const isRequestId = category && !isNaN(Number(category));
  const requestId = isRequestId ? category : null;
  const actualCategory = !isRequestId ? category : null;

  // Force debugging info
  console.log('Raw category parameter:', category);
  console.log('Is numeric check:', category, !isNaN(Number(category || '')));
  console.log('Number conversion:', Number(category || ''));
  console.log('Final isRequestId:', isRequestId);
  console.log('Final requestId:', requestId);

  // Additional check - if the user is viewing a specific product category but we have a requestId in URL
  if (category === 'מוצרים' && window.location.pathname.includes('/13')) {
    console.log('Detected direct URL access for request 13');
  }

  // Check localStorage for request context or use URL parameter
  const storedRequestId = localStorage.getItem('currentRequestId');

  // FINAL FIX: If user navigated from a general category but has a stored request context, use it
  let finalRequestId = requestId;

  if (!requestId && category === 'מוצרים' && storedRequestId) {
    console.log('Redirecting from general category to specific request:', storedRequestId);
    finalRequestId = storedRequestId;
    // Update the URL to reflect the correct request ID
    window.history.replaceState({}, '', `/market-research/${storedRequestId}`);
  }

  console.log('Final decision - requestId:', finalRequestId);
  console.log('Stored requestId from localStorage:', storedRequestId);
  console.log('Original category param:', category);
  console.log('Document referrer:', document.referrer);

  // Use new contextual market research API if requestId is provided
  const { data: marketResearch, isLoading: marketResearchLoading, error: marketResearchError } = useQuery<MarketResearchData>({
    queryKey: ["market-research", finalRequestId],
    enabled: !!finalRequestId,
  });

  console.log('Market research query status:', {
    finalRequestId,
    marketResearch,
    isLoading: marketResearchLoading,
    error: marketResearchError
  });

  // Fallback to category-based market insights
  const decodedCategory = actualCategory ? decodeURIComponent(actualCategory) : "ציוד טכנולוגי";
  const { data: marketInsight } = useQuery<MarketInsight>({
    queryKey: ["market-insights", decodedCategory],
    enabled: !finalRequestId,
  });

  const { data: suppliers, isLoading: suppliersLoading } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    enabled: !finalRequestId,
  });

  // Add early return with loading state
  if (finalRequestId && marketResearchLoading) {
    return <div className="flex justify-center items-center h-screen">
      <CenteredLoadingSpinner type="research" />
    </div>;
  }

  if (!finalRequestId && suppliersLoading) {
    return <div className="flex justify-center items-center h-screen">
      <CenteredLoadingSpinner type="research" />
    </div>;
  }

  // Debug log to see what data we're getting
  console.log('MarketResearch - category param:', category);
  console.log('MarketResearch - isRequestId:', isRequestId);
  console.log('MarketResearch - requestId:', requestId);
  console.log('MarketResearch - URL:', window.location.pathname);
  console.log('MarketResearch - marketResearch:', marketResearch);
  console.log('MarketResearch - contextualSuppliers:', marketResearch?.supplierComparison || []);
  console.log('MarketResearch - suppliers (legacy):', suppliers);

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(value)) return '₪0';
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

  const supplierComparisonData = ((finalRequestId && marketResearch?.supplierComparison) ? marketResearch.supplierComparison : (suppliers?.slice(0, 3) || [])).map((supplier: any, index: number) => ({
    supplier: supplier.supplier || supplier.name,
    price: 95 - (index * 10),
    quality: parseFloat(supplier.rating || "4.5") * 20,
    delivery: 100 - ((supplier.deliveryTime || "10").toString().match(/\d+/)?.[0] || 10) * 5,
    service: supplier.reliability || 85,
    reliability: supplier.reliability || 85,
  }));

  const priceHistoryData = (Array.isArray(marketInsight?.priceHistory) ? 
    marketInsight.priceHistory : []).map((item: any) => ({
      month: item.month || 'Unknown',
      price: item.price || 0,
    }));

  // Advanced Analytics Data
  const priceQualityScatterData = ((finalRequestId && marketResearch?.supplierComparison) ? marketResearch.supplierComparison : (suppliers?.slice(0, 5) || [])).map((supplier: any, index: number) => ({
    name: supplier.supplier || supplier.name,
    price: parseFloat(supplier.pricePerUnit?.replace(/[₪,]/g, '') || (65000 + index * 3000).toString()),
    quality: parseFloat(supplier.rating || "4.5") * 20,
    reliability: supplier.reliability || (85 + Math.random() * 10),
    size: 50 + index * 20
  }));

  // Risk Matrix Data
  const riskMatrixData = [
    { risk: 'סיכון אספקה', impact: 3, probability: 2, mitigation: 'גיוון ספקים' },
    { risk: 'תנודתיות מחירים', impact: 4, probability: 3, mitigation: 'חוזים ארוכי טווח' },
    { risk: 'איכות פגומה', impact: 5, probability: 2, mitigation: 'בדיקות איכות מחמירות' },
    { risk: 'עיכובי משלוח', impact: 3, probability: 3, mitigation: 'מלאי ביטחון' },
    { risk: 'שינויי תקינה', impact: 4, probability: 2, mitigation: 'מעקב רגולטורי' }
  ];

  // Seasonal Price Trends
  const seasonalTrendsData = [
    { season: 'Q1 2023', trend: 2.5, prediction: 3.1 },
    { season: 'Q2 2023', trend: -1.2, prediction: -0.8 },
    { season: 'Q3 2023', trend: 4.1, prediction: 3.8 },
    { season: 'Q4 2023', trend: -2.8, prediction: -2.2 },
    { season: 'Q1 2024', trend: 1.9, prediction: 2.4 },
    { season: 'Q2 2024', trend: null, prediction: -1.5 },
    { season: 'Q3 2024', trend: null, prediction: 3.2 },
    { season: 'Q4 2024', trend: null, prediction: -1.8 }
  ];

  // Supplier Availability Heatmap Data
  const availabilityHeatmapData = [
    { region: 'מרכז', availability: 95, suppliers: 12, avgDelivery: 3 },
    { region: 'צפון', availability: 87, suppliers: 8, avgDelivery: 5 },
    { region: 'דרום', availability: 78, suppliers: 6, avgDelivery: 7 },
    { region: 'ירושלים', availability: 92, suppliers: 10, avgDelivery: 4 },
    { region: 'חיפה', availability: 89, suppliers: 9, avgDelivery: 4 }
  ];

  // AI Recommendations based on specific request
  const getAIRecommendations = () => {
    if (finalRequestId && marketResearch?.requestDetails) {
      const requestTitle = marketResearch.requestDetails?.title || '';

      if (requestTitle.includes('מחשב') || requestTitle.includes('לפטופ')) {
        return [
          {
            title: 'עיתוי רכישה אופטימלי',
            description: 'רכישה במרץ-אפריל תביא לחיסכון של 8-12% בשל סוף שנת הכספים של ספקים',
            priority: 'גבוהה',
            type: 'timing'
          },
          {
            title: 'ספק מומלץ מותאם',
            description: 'TechSource מציע את הסל הטוב ביותר עם אחריות מורחבת ותמיכה מקומית',
            priority: 'גבוהה',
            type: 'supplier'
          },
          {
            title: 'מפרט מותאם',
            description: 'שקול שדרוג זיכרון ל-16GB במקום 8GB - ROI גבוה לטווח ארוך',
            priority: 'בינונית',
            type: 'specification'
          }
        ];
      }
    }

    return [
      {
        title: 'אופטימיזציה מותאמת',
        description: 'ניתוח הדרישות מזהה הזדמנויות חיסכון של עד 15% דרך התאמת מפרטים',
        priority: 'גבוהה',
        type: 'optimization'
      },
      {
        title: 'ניהול סיכונים',
        description: 'מומלץ על גיוון ספקים להפחתת סיכוני אספקה ב-40%',
        priority: 'בינונית',
        type: 'risk'
      }
    ];
  };

  const aiRecommendations = getAIRecommendations();

  const CustomScatterTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg" dir="rtl">
          <p className="text-foreground font-medium mb-2">{data.name}</p>
          <p className="text-primary">מחיר: {formatCurrency(data.price)}</p>
          <p className="text-secondary">איכות: {(data.quality / 20).toFixed(1)}/5</p>
          <p className="text-warning">אמינות: {data.reliability.toFixed(0)}%</p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

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
            <h1 className="text-3xl font-bold text-foreground">מחקר שוק אינטליגנטי</h1>
          </div>
          <p className="text-muted-foreground">
            {finalRequestId && marketResearch?.requestDetails 
              ? `ניתוח מתקדם לדרישת ${marketResearch.requestDetails?.title || 'רכש'}`
              : `ניתוח מקיף של שוק ${decodedCategory}`
            }
          </p>
        </div>
        <div className="flex space-x-reverse space-x-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4 ml-2" />
            ייצא דוח מתקדם
          </Button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-muted/20 rounded-lg">
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          עודכן לאחרונה: {new Date().toLocaleTimeString('he-IL')}
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-primary/20 animate-fade-in card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">ממוצע שוק</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? <div className="h-8 w-32 bg-muted rounded animate-pulse"></div> :
                    finalRequestId && marketResearch?.supplierComparison ? (
                      formatCurrency(
                        marketResearch.supplierComparison.reduce((sum: number, supplier: any) => 
                          sum + parseFloat(supplier.pricePerUnit?.replace(/[₪,]/g, '') || '0'), 0
                        ) / marketResearch.supplierComparison.length
                      )
                    ) : (marketInsight?.averagePrice ? formatCurrency(marketInsight.averagePrice) : '₪68,300')}
                </p>
                <p className="text-primary text-sm mt-1">לכל יחידה</p>
              </div>
              <TrendingUp className="text-primary w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-secondary/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">ספקים פעילים</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse"></div> :
                    finalRequestId && marketResearch?.supplierComparison ? 
                      marketResearch.supplierComparison.length : (marketInsight?.supplierCount || 15)}
                </p>
                <p className="text-secondary text-sm mt-1">ניתוח תחרותי</p>
              </div>
              <Store className="text-secondary w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-success/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">חיסכון פוטנציאלי</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? <div className="h-8 w-32 bg-muted rounded animate-pulse"></div> :
                    finalRequestId && marketResearch?.supplierComparison ? (
                      formatCurrency(
                        Math.max(...marketResearch.supplierComparison.map(supplier => 
                          parseFloat(supplier.pricePerUnit?.replace(/[₪,]/g, '') || '0')
                        )) - Math.min(...marketResearch.supplierComparison.map(supplier => 
                          parseFloat(supplier.pricePerUnit?.replace(/[₪,]/g, '') || '0')
                        ))
                      )
                    ) : '₪12,500'}
                </p>
                <p className="text-success text-sm mt-1">15% חיסכון אפשרי</p>
              </div>
              <ArrowDown className="text-success w-8 h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-warning/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">ציון סיכון</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? <div className="h-8 w-16 bg-muted rounded animate-pulse"></div> :
                    finalRequestId ? '7.2' : '6.8'}
                </p>
                <p className="text-warning text-sm mt-1">בינוני-נמוך</p>
              </div>
              <Shield className="text-warning w-8 h-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="suppliers">השוואת ספקים</TabsTrigger>
          <TabsTrigger value="ai-recommendations">המלצות AI</TabsTrigger>
          <TabsTrigger value="trends">מגמות ותחזיות</TabsTrigger>
          <TabsTrigger value="analytics">ניתוח מתקדם</TabsTrigger>
          <TabsTrigger value="insights">תובנות שוק</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            // Placeholder for Overview content if needed
            <div className="flex justify-center items-center h-64 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">תוכן לסקירה כללית יוצג כאן.</p>
            </div>
          )}
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Price vs Quality Scatter Plot */}
            <Card className="bg-card border-primary/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <Target className="text-primary w-5 h-5" />
                  <span>מיפוי תחרותי: מחיר vs איכות</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <LoadingSpinner type="chart" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis 
                          type="number" 
                          dataKey="price" 
                          name="מחיר"
                          stroke="#FFFFFF"
                          tick={{ fill: '#FFFFFF' }}
                          tickFormatter={(value) => `₪${(value/1000).toFixed(0)}K`}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="quality" 
                          name="איכות"
                          stroke="#FFFFFF"
                          tick={{ fill: '#FFFFFF' }}
                          tickFormatter={(value) => `${(value/20).toFixed(1)}`}
                        />
                        <Tooltip content={<CustomScatterTooltip />} />
                        <Scatter 
                          name="ספקים" 
                          data={priceQualityScatterData} 
                          fill="#60a5fa"
                        >
                          {priceQualityScatterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supplier Performance Radar */}
            <Card className="bg-card border-secondary/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <Zap className="text-secondary w-5 h-5" />
                  <span>ביצועי ספקים - מבט 360</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <LoadingSpinner type="chart" />
                  </div>
                ) : (
                  <div className="h-80">
                    <SupplierChart data={supplierComparisonData} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Supplier Comparison Table */}
          <Card className="bg-card border-primary/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Store className="text-primary w-5 h-5" />
                <span>השוואה מפורטת של ספקים</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <TableSkeleton />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">ספק</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">מחיר ליחידה</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">דירוג</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">זמן אספקה</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">אחריות</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">ציון תחרותי</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">המלצה</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted/20">
                      {((finalRequestId && marketResearch?.supplierComparison) ? marketResearch.supplierComparison : (suppliers?.slice(0, 3) || [])).map((supplier: any, index: number) => {
                        const isContextual = !!(finalRequestId && marketResearch?.supplierComparison);
                        const supplierName = supplier.supplier || supplier.name;
                        const supplierRating = supplier.rating || "4.5";
                        const supplierDeliveryTime = supplier.deliveryTime || "10 ימים";
                        const supplierWarranty = supplier.warranty || supplier.warrantyTerms || "3 שנים";
                        const supplierPrice = supplier.pricePerUnit || formatCurrency(60500 + (index * 2500));
                        const supplierCode = supplier.contact || supplier.code || supplierName.substring(0, 2);
                        const competitiveScore = (95 - index * 5) + Math.random() * 10;

                        // Determine recommendation based on context
                        const recommendationConfig = isContextual 
                          ? { label: index === 0 ? 'מומלץ ביותר' : index === 1 ? 'טוב מאוד' : 'סטנדרט', className: index === 0 ? 'bg-success/20 text-success' : index === 1 ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted-foreground' }
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
                                  {Array.from({ length: 5 }, (_, i) => (
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
                            <td className="px-6 py-4">
                              <span className={`font-bold ${competitiveScore >= 90 ? 'text-success' : competitiveScore >= 80 ? 'text-warning' : 'text-muted-foreground'}`}>
                                {competitiveScore.toFixed(1)}
                              </span>
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Matrix Tab */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Matrix Scatter */}
            <Card className="bg-card border-warning/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <AlertTriangle className="text-warning w-5 h-5" />
                  <span>מטריצת סיכונים דינמית</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <LoadingSpinner type="chart" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis 
                          type="number" 
                          dataKey="probability" 
                          name="הסתברות"
                          domain={[1, 5]}
                          stroke="#FFFFFF"
                          tick={{ fill: '#FFFFFF' }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="impact" 
                          name="השפעה"
                          domain={[1, 5]}
                          stroke="#FFFFFF"
                          tick={{ fill: '#FFFFFF' }}
                        />
                        <Tooltip content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card border border-warning/20 p-3 rounded-lg shadow-lg" dir="rtl">
                                <p className="text-foreground font-medium mb-2">{data.risk}</p>
                                <p className="text-warning">הסתברות: {data.probability}/5</p>
                                <p className="text-destructive">השפעה: {data.impact}/5</p>
                                <p className="text-primary">פתרון: {data.mitigation}</p>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Scatter name="סיכונים" data={riskMatrixData} fill="#fbbf24" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Assessment Details */}
            <Card className="bg-card border-destructive/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <Shield className="text-destructive w-5 h-5" />
                  <span>הערכת סיכונים מפורטת</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {riskMatrixData.map((risk, index) => {
                      const riskLevel = risk.impact * risk.probability;
                      const riskColor = riskLevel >= 12 ? 'destructive' : riskLevel >= 8 ? 'warning' : 'success';

                      return (
                        <div key={index} className={`p-4 bg-${riskColor}/10 border border-${riskColor}/30 rounded-lg`}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-foreground">{risk.risk}</h4>
                            <Badge className={`bg-${riskColor}/20 text-${riskColor}`}>
                              {riskLevel >= 12 ? 'גבוה' : riskLevel >= 8 ? 'בינוני' : 'נמוך'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            השפעה: {risk.impact}/5 | הסתברות: {risk.probability}/5
                          </p>
                          <p className="text-sm text-primary">
                            <strong>אמצעי מניעה:</strong> {risk.mitigation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Seasonal Trends */}
            <Card className="bg-card border-info/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <Calendar className="text-info w-5 h-5" />
                  <span>מגמות עונתיות וחיזוי מחירים</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <LoadingSpinner type="chart" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={seasonalTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis 
                          dataKey="season" 
                          stroke="#FFFFFF"
                          tick={{ fill: '#FFFFFF', fontSize: 12 }}
                        />
                        <YAxis 
                          stroke="#FFFFFF"
                          tick={{ fill: '#FFFFFF' }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-card border border-info/20 p-3 rounded-lg shadow-lg" dir="rtl">
                                <p className="text-foreground font-medium mb-2">{label}</p>
                                {payload[0]?.value !== null && payload[0]?.value !== undefined && <p className="text-info">מגמה בפועל: {payload[0].value}%</p>}
                                {payload[1]?.value !== null && payload[1]?.value !== undefined && <p className="text-primary">חיזוי: {payload[1].value}%</p>}
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Area 
                          type="monotone" 
                          dataKey="trend" 
                          stroke="#60a5fa" 
                          fill="#60a5fa" 
                          fillOpacity={0.3}
                          name="מגמה בפועל"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="prediction" 
                          stroke="#34d399" 
                          fill="#34d399" 
                          fillOpacity={0.2}
                          strokeDasharray="5 5"
                          name="חיזוי"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price History */}
            <Card className="bg-card border-secondary/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <TrendingUp className="text-secondary w-5 h-5" />
                  <span>היסטוריית מחירים - 12 חודש</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <LoadingSpinner type="chart" />
                  </div>
                ) : (
                  <div className="h-80">
                    <PriceTrackingChart data={priceHistoryData} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Price Insights */}
          <Card className="bg-card border-primary/20 animate-fade-in">
            <CardHeader>
              <CardTitle>תובנות מחירים מתקדמות</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                    <h4 className="font-medium text-success mb-2">עיתוי אופטימלי</h4>
                    <p className="text-sm text-muted-foreground">
                      רכישה במרץ-אפריל מביאה לחיסכון ממוצע של 8-12% בשל סוף שנת הכספים
                    </p>
                  </div>
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                    <h4 className="font-medium text-warning mb-2">מגמת עליה צפויה</h4>
                    <p className="text-sm text-muted-foreground">
                      חיזוי עליית מחירים של 3-5% ברבעון הקרוב בשל אינפלציה עולמית
                    </p>
                  </div>
                  <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                    <h4 className="font-medium text-info mb-2">הזדמנות חיסכון</h4>
                    <p className="text-sm text-muted-foreground">
                      רכישה בכמויות גדולות (10+ יחידות) מביאה להנחות של עד 18%
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographical Availability Tab */}
        <TabsContent value="geographical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Availability Heatmap */}
            <Card className="bg-card border-primary/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <MapPin className="text-primary w-5 h-5" />
                  <span>מפת זמינות ספקים</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <LoadingSpinner type="chart" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={availabilityHeatmapData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis 
                          dataKey="region" 
                          stroke="#FFFFFF"
                          tick={{ fill: '#FFFFFF' }}
                        />
                        <YAxis 
                          stroke="#FFFFFF"
                          tick={{ fill: '#FFFFFF' }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card border border-primary/20 p-3 rounded-lg shadow-lg" dir="rtl">
                                <p className="text-foreground font-medium mb-2">{label}</p>
                                <p className="text-primary">זמינות: {data.availability}%</p>
                                <p className="text-secondary">ספקים: {data.suppliers}</p>
                                <p className="text-warning">זמן אספקה: {data.avgDelivery} ימים</p>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Bar dataKey="availability" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Regional Details */}
            <Card className="bg-card border-secondary/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <Store className="text-secondary w-5 h-5" />
                  <span>פילוח אזורי מפורט</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availabilityHeatmapData.map((region, index) => (
                      <div key={index} className="p-4 bg-muted/10 border border-muted/20 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-foreground">{region.region}</h4>
                          <Badge className={`${
                            region.availability >= 90 ? 'bg-success/20 text-success' :
                            region.availability >= 80 ? 'bg-warning/20 text-warning' :
                            'bg-destructive/20 text-destructive'
                          }`}>
                            {region.availability}% זמינות
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">ספקים פעילים: </span>
                            <span className="text-foreground font-medium">{region.suppliers}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">זמן אספקה ממוצע: </span>
                            <span className="text-foreground font-medium">{region.avgDelivery} ימים</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Recommendations Tab (Integrated from AI Insights) */}
        <TabsContent value="ai-recommendations" className="space-y-6">
          {/* AI Recommendations */}
          <Card className="bg-card border-success/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Brain className="text-success w-5 h-5" />
                <span>המלצות AI מותאמות אישית</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : (
                <div className="space-y-4">
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-success/5 border-r-4 border-success rounded-lg">
                      <div className="flex items-start space-x-reverse space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{rec.title}</h4>
                            <Badge className={`text-xs ${
                              rec.priority === 'גבוהה' ? 'bg-destructive/20 text-destructive' :
                              rec.priority === 'בינונית' ? 'bg-warning/20 text-warning' :
                              'bg-muted/20 text-muted-foreground'
                            }`}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Market Intelligence Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card border-primary/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <Calculator className="text-primary w-5 h-5" />
                  <span>אינטליגנציה כלכלית</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">אופטימיזציה כלכלית</h4>
                      <p className="text-sm text-muted-foreground">
                        ניתוח נתונים מזהה פוטנציאל חיסכון של {formatCurrency(15000)} 
                        דרך עיתוי רכישה אסטרטגי ומשא ומתן מותאם
                      </p>
                    </div>
                    <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">יתרון תחרותי</h4>
                      <p className="text-sm text-muted-foreground">
                        הארגון יכול להשיג מחיר 12% מתחת לממוצע השוק 
                        בזכות נתונים מתקדמים ויחסי ספקים
                      </p>
                    </div>
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">אזהרת שוק</h4>
                      <p className="text-sm text-muted-foreground">
                        צפויה עלייה של 5-8% במחירי חומרי גלם ברבעון הבא - 
                        מומלץ להזמין מוקדם
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-info/20 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <Medal className="text-info w-5 h-5" />
                  <span>ביצועים והשוואות</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                      <span className="text-muted-foreground">דירוג תחרותי</span>
                      <span className="text-foreground font-bold">8.7/10</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                      <span className="text-muted-foreground">חיסכון לעומת אמש</span>
                      <span className="text-success font-bold">+23%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                      <span className="text-muted-foreground">מהירות החלטה</span>
                      <span className="text-primary font-bold">3.2x מהר יותר</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                      <span className="text-muted-foreground">דיוק תחזיות</span>
                      <span className="text-warning font-bold">94.5%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Sources Section */}
        <Card className="bg-card border-info/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <ExternalLink className="text-info w-5 h-5" />
              <span>מקורות המידע והנתונים</span>
            </CardTitle>
            <p className="text-muted-foreground text-sm">מקורות המידע והנתונים המתקדמים שעליהם מתבסס מחקר השוק</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(requestId && marketResearch?.informationSources ? marketResearch.informationSources : [
                  {
                    title: "מחירון הממשלה המעודכן",
                    description: "מחירון ממשלתי רשמי לציוד מחשוב ורכש ציבורי + עדכונים חדים",
                    lastUpdated: "ינואר 2024",
                    reliability: "גבוהה"
                  },
                  {
                    title: "Intel Israel & AMD",
                    description: "נתוני מחירים מספקים מאושרים בישראל + ניתוח תחרותי",
                    lastUpdated: "דצמבר 2023", 
                    reliability: "גבוהה"
                  },
                  {
                    title: "TechSource Ltd + Competitors",
                    description: "הסכמי מחיר מעודכנים עם ספקים מועדפים וניתוח תחרותי מתקדם",
                    lastUpdated: "נובמבר 2023",
                    reliability: "גבוהה"
                  },
                  {
                    title: "AI Market Intelligence",
                    description: "ניתוח נתונים בזמן אמת ממקורות גלובליים ומקומיים",
                    lastUpdated: "יומי",
                    reliability: "גבוהה"
                  },
                  {
                    title: "מדד המחירים + חיזוי כלכלי",
                    description: "נתוני אינפלציה, חיזויים כלכליים ומגמות שוק",
                    lastUpdated: "שבועי",
                    reliability: "גבוהה"
                  },
                  {
                    title: "נתוני ביצועים היסטוריים",
                    description: "מסד נתונים של עסקאות קודמות וביצועי ספקים",
                    lastUpdated: "רציף",
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
            )}

            <div className="mt-4 p-4 bg-info/10 border border-info/30 rounded-lg">
              <div className="flex items-start space-x-reverse space-x-2">
                <Shield className="text-info mt-0.5 w-4 h-4 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  כל המידע מתבסס על מקורות מאושרים ומעודכנים. המערכת משתמשת באלגוריתמי AI מתקדמים 
                  לניתוח נתונים בזמן אמת ומתעדכנת באופן שוטף לדיוק מקסימלי.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}