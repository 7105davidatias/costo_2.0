import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Info, Upload, Bot, Play, Download, Share, FileText, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";
import AIAnalysis from "@/components/procurement/ai-analysis";
import { ProcurementRequest as ProcurementRequestType } from "@shared/schema";

export default function ProcurementRequest() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: request, isLoading } = useQuery<ProcurementRequestType>({
    queryKey: ["/api/procurement-requests", id],
    enabled: !!id,
  });

  const { data: documents } = useQuery({
    queryKey: ["/api/documents/request", id],
    enabled: !!id,
  });

  const aiAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/ai-analysis/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to start AI analysis');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "ניתוח AI הושלם",
        description: "תוצאות הניתוח זמינות לצפייה",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/request", id] });
    },
    onError: () => {
      toast({
        title: "שגיאה",
        description: "נכשל בביצוע ניתוח AI",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">בקשת רכש לא נמצאה</h2>
        <Link href="/dashboard">
          <Button>חזור ללוח הבקרה</Button>
        </Link>
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      'high': { label: 'גבוהה', className: 'bg-destructive/20 text-destructive' },
      'medium': { label: 'בינונית', className: 'bg-warning/20 text-warning' },
      'low': { label: 'נמוכה', className: 'bg-success/20 text-success' },
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'completed': { label: 'הושלם', className: 'bg-success/20 text-success' },
      'processing': { label: 'בעיבוד', className: 'bg-warning/20 text-warning' },
      'new': { label: 'חדש', className: 'bg-primary/20 text-primary' },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.new;
  };

  const priorityConfig = getPriorityBadge(request.priority);
  const statusConfig = getStatusBadge(request.status);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            פרטי בקשת רכש - {request.requestNumber}
          </h1>
          <p className="text-muted-foreground">{request.itemName}</p>
        </div>
        <div className="flex space-x-reverse space-x-4">
          <Link href={`/market-research/${encodeURIComponent(request.category)}`}>
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
              <FileText className="w-4 h-4 ml-2" />
              מחקר שוק
            </Button>
          </Link>
          <Link href={`/cost-estimation/${request.id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Bot className="w-4 h-4 ml-2" />
              צור הערכת עלות
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Info className="text-primary w-5 h-5" />
                <span>מידע בסיסי</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">שם הפריט</label>
                  <p className="text-foreground font-medium">{request.itemName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">כמות</label>
                  <p className="text-foreground font-medium">{request.quantity} יחידות</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">קטגוריה</label>
                  <p className="text-foreground font-medium">{request.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">עדיפות</label>
                  <Badge className={priorityConfig.className}>{priorityConfig.label}</Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">תאריך יעד</label>
                  <p className="text-foreground font-medium">
                    {request.targetDate ? new Date(request.targetDate).toLocaleDateString('he-IL') : 'לא צוין'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">מבקש</label>
                  <p className="text-foreground font-medium">{request.requestedBy} - {request.department}</p>
                </div>
              </div>
              {request.description && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">תיאור</label>
                  <p className="text-foreground">{request.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="bg-card border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Upload className="text-secondary w-5 h-5" />
                <span>מסמכים</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload requestId={request.id} />
              
              {/* Uploaded Files */}
              {documents && documents.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="font-medium text-foreground">קבצים שהועלו:</h4>
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-reverse space-x-3">
                        <FileText className="text-destructive w-5 h-5" />
                        <span className="text-foreground">{doc.fileName}</span>
                      </div>
                      <div className="flex items-center space-x-reverse space-x-2">
                        {doc.isAnalyzed ? (
                          <Badge className="bg-success/20 text-success">נותח</Badge>
                        ) : (
                          <Badge variant="outline">ממתין לניתוח</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          <AIAnalysis requestId={request.id} specifications={request.specifications} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle>פעולות מהירות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => aiAnalysisMutation.mutate()}
                disabled={aiAnalysisMutation.isPending}
              >
                <Play className="w-4 h-4 ml-2" />
                {aiAnalysisMutation.isPending ? 'מפעיל ניתוח...' : 'התחל ניתוח AI'}
              </Button>
              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/10">
                <Download className="w-4 h-4 ml-2" />
                ייצא דוח
              </Button>
              <Button variant="outline" className="w-full">
                <Share className="w-4 h-4 ml-2" />
                שתף
              </Button>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card className="bg-card border-warning/20">
            <CardHeader>
              <CardTitle>סטטוס בקשה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <div>
                    <p className="text-sm text-foreground font-medium">בקשה נוצרה</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.createdAt!).toLocaleString('he-IL')}
                    </p>
                  </div>
                </div>
                
                {documents && documents.length > 0 && (
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <div>
                      <p className="text-sm text-foreground font-medium">מסמכים הועלו</p>
                      <p className="text-xs text-muted-foreground">
                        {documents.length} קבצים
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-reverse space-x-3">
                  <div className={`w-3 h-3 rounded-full ${request.status === 'processing' ? 'bg-warning animate-pulse' : 'bg-muted'}`}></div>
                  <div>
                    <p className="text-sm text-foreground font-medium">ניתוח AI</p>
                    <p className="text-xs text-muted-foreground">
                      {request.status === 'processing' ? 'בתהליך' : 'ממתין'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-reverse space-x-3">
                  <div className={`w-3 h-3 rounded-full ${request.status === 'completed' ? 'bg-success' : 'bg-muted'}`}></div>
                  <div>
                    <p className="text-sm text-muted-foreground">הערכת עלות</p>
                    <p className="text-xs text-muted-foreground">
                      {request.status === 'completed' ? 'הושלם' : 'ממתין'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="text-center">
                <Badge className={statusConfig.className} variant="outline">
                  {statusConfig.label}
                </Badge>
                {request.estimatedCost && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">עלות מוערכת</p>
                    <p className="text-2xl font-bold text-foreground">
                      {new Intl.NumberFormat('he-IL', {
                        style: 'currency',
                        currency: 'ILS',
                        minimumFractionDigits: 0,
                      }).format(parseFloat(request.estimatedCost))}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
