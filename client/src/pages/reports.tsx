
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Calendar as CalendarIcon,
  Filter,
  RefreshCw,
  Award,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ReportGenerator from "@/components/reports/report-generator";
import CostTrendsChart from "@/components/charts/cost-trends-chart";
import AccuracyChart from "@/components/charts/accuracy-chart";
import SupplierChart from "@/components/charts/supplier-chart";

// Types for report data
interface SavingsData {
  totalSavings: number;
  yearlyGrowth: number;
  topCategories: { category: string; savings: number }[];
  monthlyTrend: { month: string; savings: number }[];
}

interface SupplierPerformanceData {
  suppliers: {
    name: string;
    rating: number;
    onTimeDelivery: number;
    costEfficiency: number;
    qualityScore: number;
    totalOrders: number;
    totalValue: number;
  }[];
}

interface AccuracyData {
  overallAccuracy: number;
  byCategory: { category: string; accuracy: number }[];
  monthlyTrend: { month: string; accuracy: number }[];
  improvementTrend: number;
}

interface CostTrendsData {
  categories: {
    category: string;
    currentQuarter: number;
    previousQuarter: number;
    yearOverYear: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  totalSpend: number;
  avgOrderValue: number;
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState("savings");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1), // January 1, 2024
    to: new Date()
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");

  // Fetch report data
  const { data: savingsData, isLoading: savingsLoading } = useQuery<SavingsData>({
    queryKey: ["reports", "savings", dateRange, selectedCategory],
    queryFn: async () => {
      // Mock data based on historical procurement data
      return {
        totalSavings: 2450000,
        yearlyGrowth: 18.5,
        topCategories: [
          { category: "טכנולוגיה", savings: 890000 },
          { category: "שירותים", savings: 650000 },
          { category: "ציוד משרדי", savings: 520000 },
          { category: "אחזקה", savings: 390000 }
        ],
        monthlyTrend: [
          { month: "ינואר", savings: 180000 },
          { month: "פברואר", savings: 220000 },
          { month: "מרץ", savings: 195000 },
          { month: "אפריל", savings: 240000 },
          { month: "מאי", savings: 285000 },
          { month: "יוני", savings: 310000 },
          { month: "יולי", savings: 295000 },
          { month: "אוגוסט", savings: 330000 },
          { month: "ספטמבר", savings: 275000 },
          { month: "אוקטובר", savings: 320000 }
        ]
      };
    }
  });

  const { data: supplierData, isLoading: supplierLoading } = useQuery<SupplierPerformanceData>({
    queryKey: ["reports", "suppliers", dateRange, selectedSupplier],
    queryFn: async () => {
      return {
        suppliers: [
          {
            name: "חברת פיתוח Alpha-Tech",
            rating: 4.8,
            onTimeDelivery: 96,
            costEfficiency: 92,
            qualityScore: 94,
            totalOrders: 24,
            totalValue: 2850000
          },
          {
            name: "Beta Solutions Ltd",
            rating: 4.6,
            onTimeDelivery: 88,
            costEfficiency: 89,
            qualityScore: 91,
            totalOrders: 18,
            totalValue: 1950000
          },
          {
            name: "Gamma Consulting",
            rating: 4.4,
            onTimeDelivery: 92,
            costEfficiency: 85,
            qualityScore: 88,
            totalOrders: 15,
            totalValue: 1450000
          }
        ]
      };
    }
  });

  const { data: accuracyData, isLoading: accuracyLoading } = useQuery<AccuracyData>({
    queryKey: ["reports", "accuracy", dateRange, selectedCategory],
    queryFn: async () => {
      return {
        overallAccuracy: 87.5,
        byCategory: [
          { category: "טכנולוגיה", accuracy: 92 },
          { category: "שירותים", accuracy: 88 },
          { category: "ציוד משרדי", accuracy: 85 },
          { category: "אחזקה", accuracy: 82 }
        ],
        monthlyTrend: [
          { month: "ינואר", accuracy: 78 },
          { month: "פברואר", accuracy: 81 },
          { month: "מרץ", accuracy: 83 },
          { month: "אפריל", accuracy: 85 },
          { month: "מאי", accuracy: 87 },
          { month: "יוני", accuracy: 89 },
          { month: "יולי", accuracy: 88 },
          { month: "אוגוסט", accuracy: 90 },
          { month: "ספטמבר", accuracy: 89 },
          { month: "אוקטובר", accuracy: 92 }
        ],
        improvementTrend: 14.2
      };
    }
  });

  const { data: costTrendsData, isLoading: trendsLoading } = useQuery<CostTrendsData>({
    queryKey: ["reports", "cost-trends", dateRange, selectedCategory],
    queryFn: async () => {
      return {
        categories: [
          {
            category: "טכנולוגיה",
            currentQuarter: 3200000,
            previousQuarter: 2950000,
            yearOverYear: 12.5,
            trend: 'up' as const
          },
          {
            category: "שירותים",
            currentQuarter: 2100000,
            previousQuarter: 2250000,
            yearOverYear: -4.2,
            trend: 'down' as const
          },
          {
            category: "ציוד משרדי",
            currentQuarter: 850000,
            previousQuarter: 830000,
            yearOverYear: 2.1,
            trend: 'stable' as const
          }
        ],
        totalSpend: 8950000,
        avgOrderValue: 285000
      };
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">דוחות וניתוחים</h1>
          <p className="text-muted-foreground mt-2">
            ניתוח מקיף של ביצועי הרכש וחיסכון ארגוני
          </p>
        </div>
        <div className="flex space-x-reverse space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן נתונים
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            ייצא PDF
          </Button>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4 ml-2" />
            ייצא Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 ml-2" />
            סינונים מתקדמים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Picker */}
            <div className="space-y-2">
              <Label>טווח תאריכים</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-right">
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "d/M/yyyy", { locale: he })} -{" "}
                          {format(dateRange.to, "d/M/yyyy", { locale: he })}
                        </>
                      ) : (
                        format(dateRange.from, "d/M/yyyy", { locale: he })
                      )
                    ) : (
                      "בחר טווח תאריכים"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={he}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>קטגוריה</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  <SelectItem value="technology">טכנולוגיה</SelectItem>
                  <SelectItem value="services">שירותים</SelectItem>
                  <SelectItem value="office">ציוד משרדי</SelectItem>
                  <SelectItem value="maintenance">אחזקה</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Supplier Filter */}
            <div className="space-y-2">
              <Label>ספק</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר ספק" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הספקים</SelectItem>
                  <SelectItem value="alpha">Alpha-Tech</SelectItem>
                  <SelectItem value="beta">Beta Solutions</SelectItem>
                  <SelectItem value="gamma">Gamma Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Report Period */}
            <div className="space-y-2">
              <Label>תקופת דוח</Label>
              <Select defaultValue="quarterly">
                <SelectTrigger>
                  <SelectValue placeholder="בחר תקופה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">חודשי</SelectItem>
                  <SelectItem value="quarterly">רבעוני</SelectItem>
                  <SelectItem value="yearly">שנתי</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="savings">דוח חיסכון</TabsTrigger>
          <TabsTrigger value="suppliers">ביצועי ספקים</TabsTrigger>
          <TabsTrigger value="accuracy">דיוק אומדנים</TabsTrigger>
          <TabsTrigger value="trends">מגמות עלויות</TabsTrigger>
        </TabsList>

        {/* Savings Report */}
        <TabsContent value="savings" className="space-y-4">
          {savingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">חיסכון כולל</p>
                        <p className="text-2xl font-bold text-green-400">
                          {formatCurrency(savingsData?.totalSavings || 0)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="mt-2 flex items-center text-xs">
                      <TrendingUp className="h-3 w-3 text-green-400 ml-1" />
                      <span className="text-green-400">
                        +{formatPercentage(savingsData?.yearlyGrowth || 0)} מהשנה שעברה
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">חיסכון חודשי ממוצע</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {formatCurrency((savingsData?.totalSavings || 0) / 10)}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">קטגוריה מובילה</p>
                        <p className="text-2xl font-bold text-purple-400">טכנולוגיה</p>
                      </div>
                      <Award className="h-8 w-8 text-purple-400" />
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary">
                        {formatCurrency(savingsData?.topCategories?.[0]?.savings || 0)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">אחוז חיסכון</p>
                        <p className="text-2xl font-bold text-orange-400">15.8%</p>
                      </div>
                      <Target className="h-8 w-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>מגמת חיסכון חודשית</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <CostTrendsChart data={savingsData?.monthlyTrend || []} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>חיסכון לפי קטגוריה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savingsData?.topCategories.map((category, index) => (
                        <div key={category.category} className="flex items-center justify-between">
                          <div className="flex items-center space-x-reverse space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-green-400' : 
                              index === 1 ? 'bg-blue-400' : 
                              index === 2 ? 'bg-purple-400' : 'bg-orange-400'
                            }`} />
                            <span className="font-medium">{category.category}</span>
                          </div>
                          <div className="text-left">
                            <span className="font-bold">{formatCurrency(category.savings)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Supplier Performance Report */}
        <TabsContent value="suppliers" className="space-y-4">
          {supplierLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>השוואת ביצועי ספקים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <SupplierChart data={supplierData?.suppliers.map(s => ({
                        supplier: s.name,
                        price: s.costEfficiency,
                        quality: s.qualityScore,
                        delivery: s.onTimeDelivery,
                        service: s.rating * 20,
                        reliability: (s.onTimeDelivery + s.qualityScore) / 2
                      })) || []} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>סיכום ביצועים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {supplierData?.suppliers.map((supplier, index) => (
                        <div key={supplier.name} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{supplier.name}</h4>
                            <div className="flex items-center">
                              {supplier.rating >= 4.5 ? (
                                <CheckCircle className="w-5 h-5 text-green-400 ml-1" />
                              ) : supplier.rating >= 4.0 ? (
                                <AlertTriangle className="w-5 h-5 text-yellow-400 ml-1" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-red-400 ml-1" />
                              )}
                              <span className="font-bold">{supplier.rating}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>זמן אספקה: {formatPercentage(supplier.onTimeDelivery)}</div>
                            <div>יעילות עלויות: {formatPercentage(supplier.costEfficiency)}</div>
                            <div>ציון איכות: {formatPercentage(supplier.qualityScore)}</div>
                            <div>סה"כ הזמנות: {supplier.totalOrders}</div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            ערך כולל: {formatCurrency(supplier.totalValue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Accuracy Report */}
        <TabsContent value="accuracy" className="space-y-4">
          {accuracyLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          ) : (
            <>
              {/* Accuracy KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">דיוק כולל</p>
                        <p className="text-2xl font-bold text-green-400">
                          {formatPercentage(accuracyData?.overallAccuracy || 0)}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">שיפור השנה</p>
                        <p className="text-2xl font-bold text-blue-400">
                          +{formatPercentage(accuracyData?.improvementTrend || 0)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">קטגוריה טובה ביותר</p>
                        <p className="text-2xl font-bold text-purple-400">טכנולוגיה</p>
                      </div>
                      <Award className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Accuracy Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>מגמת דיוק חודשית</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <CostTrendsChart data={accuracyData?.monthlyTrend.map(item => ({
                        month: item.month,
                        cost: item.accuracy
                      })) || []} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>דיוק לפי קטגוריה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <AccuracyChart data={accuracyData?.byCategory.map(item => ({
                        label: item.category,
                        value: item.accuracy
                      })) || []} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Cost Trends Report */}
        <TabsContent value="trends" className="space-y-4">
          {trendsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          ) : (
            <>
              {/* Cost Trends KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">סך הוצאות</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {formatCurrency(costTrendsData?.totalSpend || 0)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ערך הזמנה ממוצע</p>
                        <p className="text-2xl font-bold text-green-400">
                          {formatCurrency(costTrendsData?.avgOrderValue || 0)}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">קטגוריות פעילות</p>
                        <p className="text-2xl font-bold text-purple-400">
                          {costTrendsData?.categories.length || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Trends Table */}
              <Card>
                <CardHeader>
                  <CardTitle>מגמות עלויות לפי קטגוריה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {costTrendsData?.categories.map((category) => (
                      <div key={category.category} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{category.category}</h4>
                          <div className="flex items-center">
                            {category.trend === 'up' ? (
                              <TrendingUp className="w-5 h-5 text-red-400 ml-1" />
                            ) : category.trend === 'down' ? (
                              <TrendingDown className="w-5 h-5 text-green-400 ml-1" />
                            ) : (
                              <div className="w-5 h-5 bg-yellow-400 rounded-full ml-1" />
                            )}
                            <span className={`font-bold ${
                              category.trend === 'up' ? 'text-red-400' : 
                              category.trend === 'down' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {category.yearOverYear > 0 ? '+' : ''}{formatPercentage(category.yearOverYear)}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">רבעון נוכחי: </span>
                            <span className="font-medium">{formatCurrency(category.currentQuarter)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">רבעון קודם: </span>
                            <span className="font-medium">{formatCurrency(category.previousQuarter)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Report Generator */}
      <ReportGenerator 
        reportType={activeTab}
        data={{
          savings: savingsData,
          suppliers: supplierData,
          accuracy: accuracyData,
          trends: costTrendsData
        }}
        filters={{
          dateRange,
          category: selectedCategory,
          supplier: selectedSupplier
        }}
      />
    </div>
  );
}
