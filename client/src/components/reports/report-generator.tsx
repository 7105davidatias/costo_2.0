
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Share2, 
  Settings, 
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Target,
  Clock
} from "lucide-react";
import { DateRange } from "react-day-picker";

interface ReportGeneratorProps {
  reportType: string;
  data: {
    savings?: any;
    suppliers?: any;
    accuracy?: any;
    trends?: any;
  };
  filters: {
    dateRange?: DateRange;
    category: string;
    supplier: string;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  format: 'summary' | 'detailed' | 'executive';
  icon: any;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'executive-summary',
    name: 'סיכום מנהלים',
    description: 'סיכום קצר עם עיקרי הממצאים והמלצות',
    sections: ['תקציר', 'KPIs עיקריים', 'המלצות'],
    format: 'summary',
    icon: TrendingUp
  },
  {
    id: 'detailed-analysis',
    name: 'ניתוח מפורט',
    description: 'דוח מקיף עם כל הנתונים והתרשימים',
    sections: ['רקע', 'ניתוח נתונים', 'תרשימים', 'מסקנות', 'המלצות'],
    format: 'detailed',
    icon: BarChart3
  },
  {
    id: 'performance-dashboard',
    name: 'דשבורד ביצועים',
    description: 'תצוגה ויזואלית עם KPIs ותרשימים',
    sections: ['מדדי ביצועים', 'תרשימים', 'השוואות'],
    format: 'summary',
    icon: PieChart
  },
  {
    id: 'supplier-scorecard',
    name: 'כרטיס ביצועי ספקים',
    description: 'דירוג וניתוח ביצועי ספקים',
    sections: ['דירוג ספקים', 'מטריקות ביצועים', 'המלצות שיפור'],
    format: 'detailed',
    icon: Users
  }
];

export default function ReportGenerator({ reportType, data, filters }: ReportGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('executive-summary');
  const [reportTitle, setReportTitle] = useState<string>('');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [includeRawData, setIncludeRawData] = useState<boolean>(false);
  const [includeRecommendations, setIncludeRecommendations] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'savings': return 'דוח חיסכון';
      case 'suppliers': return 'דוח ביצועי ספקים';
      case 'accuracy': return 'דוח דיוק אומדנים';
      case 'trends': return 'דוח מגמות עלויות';
      default: return 'דוח כללי';
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = REPORT_TEMPLATES.find(t => t.id === selectedTemplate);
    
    const report = {
      id: `report-${Date.now()}`,
      title: reportTitle || `${getReportTypeLabel(reportType)} - ${new Date().toLocaleDateString('he-IL')}`,
      description: reportDescription,
      type: reportType,
      template: template,
      createdAt: new Date(),
      sections: generateReportSections(),
      metadata: {
        dateRange: filters.dateRange,
        category: filters.category,
        supplier: filters.supplier,
        includeCharts,
        includeRawData,
        includeRecommendations
      }
    };
    
    setGeneratedReport(report);
    setIsGenerating(false);
  };

  const generateReportSections = () => {
    const template = REPORT_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return [];

    const sections = [];

    if (template.sections.includes('תקציר')) {
      sections.push({
        title: 'תקציר מנהלים',
        content: generateExecutiveSummary(),
        type: 'text'
      });
    }

    if (template.sections.includes('KPIs עיקריים')) {
      sections.push({
        title: 'מדדי ביצועים עיקריים',
        content: generateKPIs(),
        type: 'kpis'
      });
    }

    if (includeCharts && template.sections.includes('תרשימים')) {
      sections.push({
        title: 'ניתוח ויזואלי',
        content: generateChartsSummary(),
        type: 'charts'
      });
    }

    if (includeRecommendations && template.sections.includes('המלצות')) {
      sections.push({
        title: 'המלצות לפעולה',
        content: generateRecommendations(),
        type: 'recommendations'
      });
    }

    if (includeRawData && template.sections.includes('ניתוח נתונים')) {
      sections.push({
        title: 'נתונים גולמיים',
        content: data,
        type: 'raw-data'
      });
    }

    return sections;
  };

  const generateExecutiveSummary = () => {
    switch (reportType) {
      case 'savings':
        return `בחודשים האחרונים השגנו חיסכון משמעותי של ${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(data.savings?.totalSavings || 0)} שמהווה עלייה של ${data.savings?.yearlyGrowth || 0}% לעומת השנה שעברה. הקטגוריה המובילה בחיסכון היא טכנולוגיה עם ${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(data.savings?.topCategories?.[0]?.savings || 0)}.`;
      
      case 'suppliers':
        return `ניתוח ביצועי הספקים מראה כי יש לנו ${data.suppliers?.suppliers?.length || 0} ספקים פעילים. הספק המוביל הוא ${data.suppliers?.suppliers?.[0]?.name || 'לא זמין'} עם דירוג של ${data.suppliers?.suppliers?.[0]?.rating || 0} כוכבים ואחוז עמידה בזמני אספקה של ${data.suppliers?.suppliers?.[0]?.onTimeDelivery || 0}%.`;
      
      case 'accuracy':
        return `דיוק האומדנים שלנו עומד על ${data.accuracy?.overallAccuracy || 0}% עם שיפור של ${data.accuracy?.improvementTrend || 0}% לעומת התקופה הקודמת. הקטגוריה עם הדיוק הגבוה ביותר היא ${data.accuracy?.byCategory?.[0]?.category || 'לא זמין'} עם ${data.accuracy?.byCategory?.[0]?.accuracy || 0}%.`;
      
      case 'trends':
        return `סך ההוצאות עומד על ${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(data.trends?.totalSpend || 0)} עם ערך הזמנה ממוצע של ${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(data.trends?.avgOrderValue || 0)}. רוב הקטגוריות מציגות מגמה יציבה או ירידה בעלויות.`;
      
      default:
        return 'סיכום הדוח יוצג כאן לאחר עיבוד הנתונים.';
    }
  };

  const generateKPIs = () => {
    switch (reportType) {
      case 'savings':
        return [
          { label: 'חיסכון כולל', value: new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(data.savings?.totalSavings || 0), trend: '+18.5%' },
          { label: 'חיסכון חודשי ממוצע', value: new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format((data.savings?.totalSavings || 0) / 10), trend: '+12.3%' },
          { label: 'קטגוריות פעילות', value: data.savings?.topCategories?.length || 0, trend: 'יציב' },
          { label: 'אחוז חיסכון', value: '15.8%', trend: '+2.1%' }
        ];
      
      case 'suppliers':
        return [
          { label: 'מספר ספקים פעילים', value: data.suppliers?.suppliers?.length || 0, trend: 'יציב' },
          { label: 'דירוג ממוצע', value: (data.suppliers?.suppliers?.reduce((acc: number, s: any) => acc + s.rating, 0) / (data.suppliers?.suppliers?.length || 1)).toFixed(1), trend: '+0.3' },
          { label: 'אחוז עמידה בזמנים', value: `${Math.round(data.suppliers?.suppliers?.reduce((acc: number, s: any) => acc + s.onTimeDelivery, 0) / (data.suppliers?.suppliers?.length || 1))}%`, trend: '+5%' },
          { label: 'ערך הזמנות כולל', value: new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(data.suppliers?.suppliers?.reduce((acc: number, s: any) => acc + s.totalValue, 0) || 0), trend: '+8.2%' }
        ];
      
      default:
        return [];
    }
  };

  const generateChartsSummary = () => {
    return [
      'תרשים מגמות זמן מציג עלייה עקבית בביצועים',
      'תרשים השוואה מראה עליונות בקטגוריות מרכזיות',
      'תרשים התפלגות מדגים איזון טוב בין הקטגוריות',
      'גרפים אלה מאפשרים זיהוי מהיר של מגמות ופערים'
    ];
  };

  const generateRecommendations = () => {
    switch (reportType) {
      case 'savings':
        return [
          'המשך פיתוח יכולות החיסכון בקטגוריית הטכנולוגיה',
          'חיפוש הזדמנויות חיסכון נוספות בקטגוריות אחרות',
          'שיפור תהליכי המשא ומתן עם ספקים',
          'הטמעת כלים דיגיטליים לניטור חיסכון'
        ];
      
      case 'suppliers':
        return [
          'שיפור תקשורת עם ספקים בעלי ביצועים נמוכים',
          'חיפוש ספקים חלופיים לגיוון סיכונים',
          'פיתוח מערכת תמריצים לשיפור ביצועים',
          'קביעת KPIs ברורים לכל ספק'
        ];
      
      case 'accuracy':
        return [
          'שיפור מודלי הניבוי באמצעות נתונים נוספים',
          'הטמעת בדיקות איכות נוספות',
          'עדכון תדיר של בסיסי הנתונים',
          'הכשרת הצוות על כלי הערכה מתקדמים'
        ];
      
      default:
        return ['המלצות יוצגו כאן לאחר ניתוח הנתונים'];
    }
  };

  const exportToPDF = () => {
    // Mock PDF export
    const blob = new Blob([JSON.stringify(generatedReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedReport.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Mock Excel export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "סוג דוח,כותרת,תאריך יצירה\n" +
      `${getReportTypeLabel(reportType)},${generatedReport.title},${generatedReport.createdAt.toLocaleDateString('he-IL')}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${generatedReport.title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareReport = () => {
    // Mock sharing functionality
    if (navigator.share) {
      navigator.share({
        title: generatedReport.title,
        text: generatedReport.description,
        url: window.location.href
      });
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('קישור הדוח הועתק ללוח');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 ml-2" />
          מחולל דוחות
        </CardTitle>
        <CardDescription>
          צור דוח מותאם אישית עם הגדרות מתקדמות
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">בחירת תבנית דוח</Label>
            <div className="grid grid-cols-1 gap-3">
              {REPORT_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start space-x-reverse space-x-3">
                    <template.icon className="w-5 h-5 mt-0.5 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {template.sections.map((section) => (
                          <Badge key={section} variant="secondary" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Settings */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">הגדרות דוח</Label>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="report-title">כותרת הדוח</Label>
                <Input
                  id="report-title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder={`${getReportTypeLabel(reportType)} - ${new Date().toLocaleDateString('he-IL')}`}
                />
              </div>

              <div>
                <Label htmlFor="report-description">תיאור הדוח</Label>
                <Textarea
                  id="report-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="הוסף תיאור קצר לדוח..."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-charts">כלול תרשימים</Label>
                  <Switch
                    id="include-charts"
                    checked={includeCharts}
                    onCheckedChange={setIncludeCharts}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-recommendations">כלול המלצות</Label>
                  <Switch
                    id="include-recommendations"
                    checked={includeRecommendations}
                    onCheckedChange={setIncludeRecommendations}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-raw-data">כלול נתונים גולמיים</Label>
                  <Switch
                    id="include-raw-data"
                    checked={includeRawData}
                    onCheckedChange={setIncludeRawData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={generateReport} 
            disabled={isGenerating}
            size="lg"
            className="min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <Clock className="w-4 h-4 ml-2 animate-spin" />
                יוצר דוח...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 ml-2" />
                צור דוח
              </>
            )}
          </Button>
        </div>

        {/* Generated Report Preview */}
        {generatedReport && (
          <div className="mt-6 border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{generatedReport.title}</h3>
                <p className="text-sm text-muted-foreground">
                  נוצר ב-{generatedReport.createdAt.toLocaleString('he-IL')}
                </p>
              </div>
              <div className="flex space-x-reverse space-x-2">
                <Button variant="outline" size="sm" onClick={() => setGeneratedReport(null)}>
                  <Eye className="w-4 h-4 ml-2" />
                  תצוגה מקדימה
                </Button>
                <Button variant="outline" size="sm" onClick={exportToPDF}>
                  <Download className="w-4 h-4 ml-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={exportToExcel}>
                  <FileSpreadsheet className="w-4 h-4 ml-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={shareReport}>
                  <Share2 className="w-4 h-4 ml-2" />
                  שתף
                </Button>
              </div>
            </div>

            {/* Report Summary */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">תקציר הדוח:</h4>
                <p className="text-sm text-muted-foreground">{generatedReport.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">חלקי הדוח:</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedReport.sections.map((section: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {section.title}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">סוג דוח: </span>
                  <span className="font-medium">{getReportTypeLabel(generatedReport.type)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">תבנית: </span>
                  <span className="font-medium">{generatedReport.template.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">כולל תרשימים: </span>
                  <span className="font-medium">{generatedReport.metadata.includeCharts ? 'כן' : 'לא'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">כולל המלצות: </span>
                  <span className="font-medium">{generatedReport.metadata.includeRecommendations ? 'כן' : 'לא'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
