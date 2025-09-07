
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock,
  BarChart3,
  Download,
  Upload,
  Star,
  Filter
} from "lucide-react";
import TemplateGallery from "@/components/templates/template-gallery";
import { 
  documentTemplates, 
  getPopularTemplates,
  getTemplatesByCategory,
  categories,
  type DocumentTemplate 
} from "@/data/document-templates";

export default function Templates() {
  const [, setLocation] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  // סטטיסטיקות תבניות
  const totalTemplates = documentTemplates.length;
  const totalUsage = documentTemplates.reduce((sum, t) => sum + t.metadata.usageCount, 0);
  const avgAccuracy = Math.round(
    documentTemplates.reduce((sum, t) => sum + t.metadata.accuracy, 0) / totalTemplates
  );
  const totalEstimatedValue = documentTemplates.reduce(
    (sum, t) => sum + Number(t.estimatedCost), 0
  );

  // פילוח לפי קטגוריות
  const categoryStats = categories.map(category => {
    const templates = getTemplatesByCategory(category);
    const usage = templates.reduce((sum, t) => sum + t.metadata.usageCount, 0);
    return {
      category,
      count: templates.length,
      usage,
      avgCost: templates.reduce((sum, t) => sum + Number(t.estimatedCost), 0) / templates.length
    };
  }).sort((a, b) => b.usage - a.usage);

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    // Create new procurement request based on template
    setLocation(`/procurement-request/new?templateId=${template.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">תבניות מסמכים</h1>
          <p className="text-muted-foreground">
            ניהול ושימוש בתבניות דרישות רכש מוכנות מראש
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="ml-2 h-4 w-4" />
            ייבא תבנית
          </Button>
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            צור תבנית חדשה
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך הכל תבניות</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              +2 מהחודש שעבר
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך שימושים</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              +15.3% מהחודש שעבר
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דיוק ממוצע</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% מהחודש שעבר
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ערך כולל</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalEstimatedValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              כל התבניות יחד
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gallery">גלריית תבניות</TabsTrigger>
          <TabsTrigger value="analytics">אנליטיקס</TabsTrigger>
          <TabsTrigger value="manage">ניהול</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <TemplateGallery onSelectTemplate={handleSelectTemplate} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                ביצועי קטגוריות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{stat.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.count} תבניות • {stat.usage} שימושים
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{formatCurrency(stat.avgCost)}</div>
                      <div className="text-xs text-muted-foreground">עלות ממוצעת</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                התבניות הפופולריות ביותר
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getPopularTemplates(5).map((template, index) => (
                  <div key={template.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{template.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {template.department} • {template.metadata.usageCount} שימושים
                      </div>
                    </div>
                    <div className="text-left">
                      <Badge className="mb-1">{template.metadata.accuracy}% דיוק</Badge>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(Number(template.estimatedCost))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  פעולות ניהול
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="ml-2 h-4 w-4" />
                  צור תבנית חדשה
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="ml-2 h-4 w-4" />
                  ייבא תבניות מקובץ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="ml-2 h-4 w-4" />
                  ייצא תבניות לקובץ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="ml-2 h-4 w-4" />
                  ניהול קטגוריות
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  הגדרות מערכת
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">עדכון אוטומטי של דיוק התבניות</label>
                  <p className="text-xs text-muted-foreground">
                    המערכת תעדכן אוטומטית את רמת הדיוק של התבניות על בסיס שימושים בפועל
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ארכיון תבניות ישנות</label>
                  <p className="text-xs text-muted-foreground">
                    תבניות שלא נעשה בהן שימוש במשך 6 חודשים יועברו לארכיון
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">התראות על שינויי שוק</label>
                  <p className="text-xs text-muted-foreground">
                    קבל התראות כשמחירי השוק משתנים משמעותית
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
