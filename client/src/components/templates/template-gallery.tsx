
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  Download,
  Star,
  Clock,
  Users,
  DollarSign,
  FileText,
  Zap,
  Shield,
  Settings
} from "lucide-react";
import { 
  documentTemplates, 
  categories, 
  departments,
  getPopularTemplates,
  searchTemplates,
  type DocumentTemplate 
} from "@/data/document-templates";

interface TemplateGalleryProps {
  onSelectTemplate?: (template: DocumentTemplate) => void;
  showActions?: boolean;
}

export default function TemplateGallery({ onSelectTemplate, showActions = true }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // פילטור התבניות
  const filteredTemplates = useMemo(() => {
    let templates = searchQuery ? searchTemplates(searchQuery) : documentTemplates;
    
    if (selectedCategory !== "all") {
      templates = templates.filter(t => t.category === selectedCategory);
    }
    
    if (selectedDepartment !== "all") {
      templates = templates.filter(t => t.department === selectedDepartment);
    }
    
    if (selectedComplexity !== "all") {
      templates = templates.filter(t => t.metadata.complexity === selectedComplexity);
    }
    
    return templates;
  }, [searchQuery, selectedCategory, selectedDepartment, selectedComplexity]);

  const popularTemplates = getPopularTemplates(3);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "חומרה - מחשבים":
      case "חומרה - שרתים":
        return <Settings className="h-5 w-5" />;
      case "תוכנה ופיתוח":
        return <FileText className="h-5 w-5" />;
      case "אבטחת מידע":
        return <Shield className="h-5 w-5" />;
      case "שירותים מקצועיים":
        return <Users className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const handleUseTemplate = (template: DocumentTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  return (
    <div className="space-y-6">
      {/* Popular Templates Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">תבניות פופולריות</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularTemplates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(template.category)}
                  <span className="font-medium text-sm">{template.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{template.metadata.usageCount} שימושים</span>
                  <span>{formatCurrency(template.estimatedCost)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש תבניות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="מחלקה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל המחלקות</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="מורכבות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הרמות</SelectItem>
                <SelectItem value="simple">פשוט</SelectItem>
                <SelectItem value="medium">בינוני</SelectItem>
                <SelectItem value="complex">מורכב</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            נמצאו {filteredTemplates.length} תבניות
          </span>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              רשת
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              רשימה
            </Button>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getCategoryIcon(template.category)}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base leading-tight">{template.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{template.requestNumber}</p>
                  </div>
                </div>
                <Badge className={getPriorityColor(template.priority)}>
                  {template.priority}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{formatCurrency(template.estimatedCost)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{template.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span>{template.metadata.accuracy}% דיוק</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{template.metadata.usageCount} שימושים</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              {showActions && (
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 ml-1" />
                        צפייה
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {getCategoryIcon(template.category)}
                          {template.title}
                        </DialogTitle>
                      </DialogHeader>
                      <TemplatePreview template={template} />
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Copy className="h-4 w-4 ml-1" />
                    השתמש
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">לא נמצאו תבניות</h3>
          <p className="text-muted-foreground">נסה לשנות את הפילטרים או את מילות החיפוש</p>
        </div>
      )}
    </div>
  );
}

// רכיב תצוגה מקדימה של תבנית
function TemplatePreview({ template }: { template: DocumentTemplate }) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">פרטים כלליים</h4>
          <div className="space-y-2 text-sm">
            <div><strong>מספר דרישה:</strong> {template.requestNumber}</div>
            <div><strong>קטגוריה:</strong> {template.category}</div>
            <div><strong>מחלקה:</strong> {template.department}</div>
            <div><strong>כמות:</strong> {template.quantity}</div>
            <div><strong>עלות משוערת:</strong> {formatCurrency(template.estimatedCost)}</div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">מטא-דאטה</h4>
          <div className="space-y-2 text-sm">
            <div><strong>דיוק:</strong> {template.metadata.accuracy}%</div>
            <div><strong>מורכבות:</strong> {template.metadata.complexity}</div>
            <div><strong>שיטת אומדן:</strong> {template.metadata.estimationMethod}</div>
            <div><strong>שימושים:</strong> {template.metadata.usageCount}</div>
            <div><strong>חיסכון ממוצע:</strong> {template.metadata.averageSavings}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold mb-2">תיאור</h4>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>

      {/* Specifications */}
      <div>
        <h4 className="font-semibold mb-2">מפרט טכני</h4>
        <div className="bg-muted/50 p-4 rounded-lg">
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(template.specifications, null, 2)}
          </pre>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="font-semibold mb-2">תגיות</h4>
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Attachments */}
      {template.attachments && template.attachments.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">קבצים מצורפים</h4>
          <div className="space-y-1">
            {template.attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                {file}
                <Button variant="ghost" size="sm">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
