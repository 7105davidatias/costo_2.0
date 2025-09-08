import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, Upload, Bot, Play, Download, Share, FileText, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import FileUpload from "@/components/ui/file-upload";
import AIAnalysis from "@/components/procurement/ai-analysis";
import { ProcurementRequest as ProcurementRequestType } from "@shared/schema";

export default function ProcurementRequest() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  const { data: request, isLoading } = useQuery<ProcurementRequestType>({
    queryKey: ["/api/procurement-requests", id],
    enabled: !!id,
  });

  const { data: documents } = useQuery({
    queryKey: ["/api/documents/request", id],
    enabled: !!id,
  });

  const { data: extractedData, refetch: refetchExtractedData } = useQuery({
    queryKey: ["/api/procurement-requests", id, "extracted-data"],
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
      queryClient.invalidateQueries({ queryKey: ["/api/procurement-requests", id, "extracted-data"] });
      refetchExtractedData(); // רענון מיידי של הנתונים שחולצו
    },
    onError: () => {
      toast({
        title: "שגיאה",
        description: "נכשל בביצוע ניתוח AI",
        variant: "destructive",
      });
    },
  });

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setDocumentDialogOpen(true);
  };

  const getDocumentContent = (doc: any) => {
    // Sample document content based on the document from the requirements
    const documentContents: { [key: string]: string } = {
      "מפרט טכני - Dell Latitude 5520.pdf": `
# מפרט טכני - מחשבים ניידים Dell Latitude 5520

## דרישות כלליות
- כמות: 25 יחידות
- יעד: עובדי משרד
- תקופת אחריות: 3 שנים

## מפרט טכני מפורט

### מעבד
- Intel Core i7-1165G7 (דור 11)
- 4 ליבות, 8 threads
- תדירות בסיס: 2.8GHz
- תדירות מקסימלית: 4.7GHz

### זיכרון
- 16GB DDR4-3200
- 2 חריצי זיכרון
- ניתן להרחבה עד 64GB

### אחסון
- SSD NVMe 512GB
- מהירות קריאה: עד 3,500 MB/s
- מהירות כתיבה: עד 2,900 MB/s

### מסך
- 15.6 אינץ' Full HD (1920x1080)
- טכנולוגיה IPS
- בהירות: 250 nits
- כיסוי צבע: 45% NTSC

### כרטיס מסך
- Intel Iris Xe Graphics
- זיכרון משותף עם זיכרון המערכת
- תמיכה ב-4K external display

### קישוריות
- 2x USB 3.2 Gen 1
- 1x USB-C עם Thunderbolt 4
- 1x HDMI 1.4
- 1x RJ45 Ethernet
- 1x כניסת אוזניות/מיקרופון
- Wi-Fi 6 (802.11ax)
- Bluetooth 5.1

### סוללה
- 4-cell 54Wh
- חיי סוללה: עד 8 שעות
- טעינה מהירה: 80% תוך שעה

### מערכת הפעלה
- Windows 11 Pro
- רישיון מקורי
- תמיכה בעדכונים אוטומטיים

### אבטחה
- TPM 2.0
- קורא טביעות אצבע
- מצלמה עם תריס פרטיות
- הצפנת דיסק BitLocker

## דרישות נוספות
- מקלדת בעברית ואנגלית
- עכבר אופטי אלחוטי
- תיק נשיאה מקורי
- הדרכה למשתמשים

## תנאי אחריות
- אחריות יצרן: 3 שנים
- תמיכה טכנית: 24/7
- שירות באתר הלקוח
- החלפת חלקים מקוריים
      `,
      "תרשים רשת ותשתיות.pdf": `
# תרשים רשת ותשתיות - פריסת מחשבים ניידים

## סקירה כללית
תרשים זה מציג את התכנון לפריסת 25 מחשבים ניידים חדשים ברחבי המשרד, כולל חיבור לרשת הארגונית ותשתיות התמיכה הנדרשות.

## מבנה הרשת הקיים

### שרת מרכזי
- Windows Server 2019
- Active Directory Domain Services
- DNS ו-DHCP Services
- File Server עם 10TB אחסון

### תשתית רשת
- Switch מרכזי: Cisco Catalyst 2960-X
- 48 פורטים Gigabit Ethernet
- 4 פורטים SFP+ 10Gb
- Wi-Fi: Cisco Meraki MR46

### אבטחת רשת
- Firewall: Fortinet FortiGate 100F
- Antivirus: Symantec Endpoint Protection
- VPN: SSL-VPN לגישה מרחוק

## פריסת המחשבים החדשים

### קומה 1 - מחלקת הנהלה
- 5 מחשבים ניידים
- חיבור אלחוטי Wi-Fi 6
- גישה ליישומי ERP
- הדפסה ברשת

### קומה 2 - מחלקת פיתוח
- 15 מחשבים ניידים
- חיבור Ethernet + Wi-Fi
- גישה לשרתי פיתוח
- כלי פיתוח וגיט

### קומה 3 - מחלקת שיווק
- 5 מחשבים ניידים
- חיבור אלחוטי בלבד
- גישה לכלי עיצוב
- שיתוף קבצים גדולים

## דרישות אבטחה
- הצפנת כונן קשיח מלאה
- הזדהות דו-שלבית
- ניטור פעילות משתמשים
- גיבוי אוטומטי יומי

## לוח זמנים ליישום
- שבוע 1: הגדרת תשתיות
- שבוע 2: התקנת מחשבים
- שבוע 3: הדרכת משתמשים
- שבוע 4: מעבר מלא למערכת
      `,
      "מפרט שרתי Dell PowerEdge R750.pdf": `
# מפרט שרתי Dell PowerEdge R750

## סקירה כללית
שרתי Dell PowerEdge R750 לדרישת רכש מס' REQ-2024-003
כמות: 3 יחידות עבור מרכז הנתונים

## מפרט טכני מפורט

### מעבדים
- Intel Xeon Silver 4314 (16 cores, 32 threads)
- תדירות בסיס: 2.4GHz
- תדירות מקסימלית: 3.4GHz
- זיכרון מטמון: 24MB
- TDP: 135W

### זיכרון
- 64GB DDR4-3200 ECC RDIMM
- 8 חריצי זיכרון (8x 8GB)
- תמיכה עד 4TB זיכרון
- הגנת ECC מתקדמת

### אחסון
- 2x NVMe SSD 1TB Dell EMC
- מהירות קריאה: 6,000 MB/s
- מהירות כתיבה: 4,200 MB/s
- עמידות: 3 DWPD (Drive Writes Per Day)
- Hot-Swap support

### רשת
- 4x Gigabit Ethernet onboard
- 2x 10GbE SFP+ (PCIe card)
- Intel i350 Network Controller
- Wake-on-LAN support

### ניהול
- iDRAC9 Enterprise
- IPMI 2.0 support
- Redfish API
- ניטור מרחוק מלא
- Virtual Console

### ספק כוח
- 750W Redundant Power Supply
- 80+ Platinum efficiency
- Hot-Plug capability
- Power redundancy N+1

### מבנה פיזי
- Form Factor: 2U Rack Mount
- ממדים: 482 x 87 x 660 mm
- משקל: 28.5 ק"ג (בקירוב)
- 19" standard rack mount

### קישוריות
- 8x USB 3.0 (4 קדמי, 4 אחורי)
- 2x USB 2.0 (פנימי)
- 1x VGA (אחורי)
- 1x Serial port
- 1x PCIe x16 Gen4
- 2x PCIe x8 Gen4

### מערכת הפעלה נתמכות
- Windows Server 2019/2022
- Red Hat Enterprise Linux 8/9
- VMware vSphere 7/8
- Ubuntu Server LTS

### אחריות ותמיכה
- אחריות יצרן: 3 שנים
- ProSupport Plus 24/7
- Next Business Day onsite
- Mission Critical 4-hour response

## דרישות סביבה

### חשמל
- מתח כניסה: 100-240V AC
- תדירות: 50/60 Hz
- צריכת חשמל מקסימלית: 750W
- BTU/hr מקסימלי: 2,559

### טמפרטורה
- טמפרטורת הפעלה: 10-35°C
- טמפרטורת אחסון: -40-70°C
- לחות יחסית: 20-80% (לא מתעבה)

### רעש
- רמת רעש: 6.8 Bels (כ-68 dB)
- במצב Idle: 6.1 Bels (כ-61 dB)

## תכנון התקנה

### מיקום במרכז הנתונים
- Rack 1: שרת ראשי (Production)
- Rack 2: שרת גיבוי (Backup)
- Rack 3: שרת פיתוח (Development)

### רשת ותקשורת
- חיבור לרשת ייצור: 10Gb
- רשת ניהול נפרדת: 1Gb
- רשת גיבוי: 10Gb על Fiber

### גיבוי ו-DR
- גיבוי יומי מלא
- גיבוי מצטבר שבועי
- DR site במרכז הנתונים השני
- RTO: 4 שעות, RPO: 1 שעה
      `
    };

    return documentContents[doc.fileName] || "תוכן המסמך לא זמין להצגה";
  };

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
      'high': { label: 'דחופה', className: 'bg-destructive/20 text-destructive' },
      'medium': { label: 'רגילה', className: 'bg-primary/20 text-primary' },
      'low': { label: 'רגילה', className: 'bg-primary/20 text-primary' },
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
          <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-4 h-4 ml-1 rotate-180" />
                חזרה
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              פרטי דרישת רכש - {request.requestNumber}
            </h1>
          </div>
          <p className="text-muted-foreground">{request.itemName}</p>
        </div>
        <div className="flex space-x-reverse space-x-4">
          <Link href={`/market-research/${encodeURIComponent(request.category)}`}>
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
              <FileText className="w-4 h-4 ml-2" />
              מחקר שוק
            </Button>
          </Link>
          <Link href={`/cost-estimation/${request?.id || id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Bot className="w-4 h-4 ml-2" />
              צור אומדן עלות
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
              <FileUpload requestId={request?.id || parseInt(id || '0')} />
              
              {/* Uploaded Files */}
              {documents && Array.isArray(documents) && documents.length > 0 ? (
                <div className="mt-6 space-y-2">
                  <h4 className="font-medium text-foreground">קבצים שהועלו:</h4>
                  {(documents as any[]).map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-reverse space-x-3">
                        <FileText className="text-destructive w-5 h-5" />
                        <div className="flex flex-col">
                          <span className="text-foreground">{doc.fileName || ''}</span>
                          <span className="text-xs text-muted-foreground">
                            {doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB` : ''} • {doc.fileType?.toUpperCase() || ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-reverse space-x-2">
                        {doc.isAnalyzed ? (
                          <Badge className="bg-success/20 text-success">נותח</Badge>
                        ) : (
                          <Badge variant="outline">ממתין לניתוח</Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDocument(doc)}
                        >
                          צפה
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          <AIAnalysis requestId={request.id} specifications={request.specifications} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Combined Cost Overview Card */}
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">סקירת עלויות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* EMF Section */}
              <div className="text-center p-4 bg-info/10 rounded-lg border border-info/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">EMF (תקציב מוקצה)</h4>
                <span className="text-xl font-bold text-info">
                  {request.emf ? `₪${parseFloat(request.emf).toLocaleString()}` : 'לא צוין'}
                </span>
              </div>
              
              {/* Estimated Cost Section */}
              <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">אומדן עלות (מערכת)</h4>
                {request.estimatedCost ? (
                  <span className="text-xl font-bold text-success">
                    ₪{parseFloat(request.estimatedCost).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-lg text-muted-foreground">טרם נוצר</span>
                )}
              </div>

              {/* Cost Comparison */}
              {request.emf && request.estimatedCost && (
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">השוואה</h4>
                  {(() => {
                    const emf = parseFloat(request.emf);
                    const estimated = parseFloat(request.estimatedCost);
                    const difference = estimated - emf;
                    const percentage = ((difference / emf) * 100).toFixed(1);
                    
                    if (difference > 0) {
                      return (
                        <div className="text-warning">
                          <span className="text-sm">חריגה: +₪{difference.toLocaleString()} ({percentage}%)</span>
                        </div>
                      );
                    } else if (difference < 0) {
                      return (
                        <div className="text-success">
                          <span className="text-sm">חיסכון: ₪{Math.abs(difference).toLocaleString()} ({Math.abs(parseFloat(percentage))}%)</span>
                        </div>
                      );
                    } else {
                      return <span className="text-sm text-muted-foreground">תואם לתקציב</span>;
                    }
                  })()}
                </div>
              )}
            </CardContent>
          </Card>

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
                
                {documents && Array.isArray(documents) && documents.length > 0 ? (
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <div>
                      <p className="text-sm text-foreground font-medium">מסמכים הועלו</p>
                      <p className="text-xs text-muted-foreground">
                        {(documents as any[]).length} קבצים
                      </p>
                    </div>
                  </div>
                ) : null}

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

      {/* Document Viewing Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-right">
              {selectedDocument?.fileName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center space-x-reverse space-x-2">
                <span>גודל: {selectedDocument?.fileSize ? `${(selectedDocument.fileSize / 1024 / 1024).toFixed(1)} MB` : 'לא ידוע'}</span>
                <span>•</span>
                <span>סוג: {selectedDocument?.fileType?.toUpperCase()}</span>
              </div>
              {selectedDocument?.isAnalyzed && (
                <Badge className="bg-success/20 text-success">נותח</Badge>
              )}
            </div>
            <div className="bg-muted/20 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm text-right">
                {selectedDocument ? getDocumentContent(selectedDocument) : ''}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
