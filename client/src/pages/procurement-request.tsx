import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Upload, Bot, Play, Download, Share, FileText, Clock, CheckCircle2, ArrowRight, Search, Filter, Star, Save, Sparkles, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback, useEffect } from "react";
import FileUpload from "@/components/ui/file-upload";
import AIAnalysis from "@/components/procurement/ai-analysis";
import WorkflowProgress from "@/components/ui/workflow-progress";
import SpecsDisplay from "@/components/procurement/specs-display";
import EstimationMethods from "@/components/procurement/estimation-methods";
import TemplateGallery from "@/components/templates/template-gallery";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ProcurementRequest as ProcurementRequestType } from "@shared/schema";
import { documentTemplates, searchTemplates, getTemplatesByCategory, categories, type DocumentTemplate } from "@/data/document-templates";
import { LoadingSpinner, CenteredLoadingSpinner } from '@/components/ui/loading-spinner';
import { CardSkeleton, FormSkeleton } from '@/components/ui/enhanced-skeleton';

export default function ProcurementRequest() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMobile();

  // Template selection states
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFormMode, setIsFormMode] = useState(false);
  const [saveTemplateModalOpen, setSaveTemplateModalOpen] = useState(false);

  // Form states for template creation/editing
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    category: "",
    quantity: 1,
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    department: "",
    targetDate: "",
    emf: "",
    specifications: {} as Record<string, any>
  });

  const { data: request, isLoading: requestLoading, error: requestError } = useQuery<ProcurementRequestType>({
    queryKey: ["/api/procurement-requests", id],
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const { data: documents, error: documentsError } = useQuery({
    queryKey: ["/api/documents/request", id],
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const { data: extractedData, refetch: refetchExtractedData, error: extractedDataError } = useQuery({
    queryKey: ["/api/procurement-requests", id, "extracted-data"],
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const aiAnalysisMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/ai-analysis/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`AI analysis failed: ${response.status} - ${errorText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('AI Analysis error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "ניתוח AI הושלם",
        description: "תוצאות הניתוח זמינות לצפייה",
      });
      // רענון עם await כדי להבטיח שהנתונים יטענו
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/documents/request", id] }),
        queryClient.invalidateQueries({ queryKey: ["/api/procurement-requests", id, "extracted-data"] }),
        refetchExtractedData()
      ]).catch(error => {
        console.error('Error refreshing data after AI analysis:', error);
      });
    },
    onError: (error: Error) => {
      console.error('AI Analysis mutation error:', error);
      toast({
        title: "שגיאה בניתוח AI",
        description: error.message || "נכשל בביצוע ניתוח AI. נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    },
  });

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setDocumentDialogOpen(true);
  };

  const handleMethodToggle = useCallback((methodId: string) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  }, []);

  const handleCreateEstimate = useCallback(async () => {
    if (!id) {
      toast({
        title: "שגיאה",
        description: "מזהה הבקשה חסר",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethods.length === 0) {
      toast({
        title: "בחר שיטות אומדן",
        description: "יש לבחור לפחות שיטת אומדן אחת",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating estimate with methods:', selectedMethods);

      const response = await fetch('/api/cost-estimations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          procurementRequestId: parseInt(id),
          methods: selectedMethods,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create estimate: ${response.status}`);
      }

      const result = await response.json();
      console.log('Estimate created successfully:', result);

      toast({
        title: "אומדן נוצר בהצלחה",
        description: "האומדן נוצר וזמין לצפייה",
      });

      // ניווט לדף אומדן עלות
      window.location.href = `/cost-estimation/${id}`;
    } catch (error) {
      console.error('Error creating estimate:', error);
      toast({
        title: "שגיאה ביצירת אומדן",
        description: "נכשל ביצירת האומדן. נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedMethods, id, toast]);

  // Template handling functions
  const handleSelectTemplate = useCallback((template: DocumentTemplate) => {
    setSelectedTemplate(template);

    // Auto-fill form data from template
    setFormData({
      itemName: template.title,
      description: template.description,
      category: template.category,
      quantity: template.quantity,
      priority: template.priority,
      department: template.department,
      targetDate: "",
      emf: template.estimatedCost,
      specifications: template.specifications
    });

    setIsFormMode(true);
    setTemplateModalOpen(false);

    toast({
      title: "תבנית נטענה בהצלחה",
      description: `התבנית "${template.title}" נטענה. ניתן לערוך ולהתאים את הפרטים.`, 
    });
  }, [toast]);

  const handleSaveAsTemplate = useCallback(async () => {
    if (!formData.itemName || !formData.category) {
      toast({
        title: "שדות חסרים",
        description: "יש למלא את שם הפריט והקטגוריה לפחות",
        variant: "destructive",
      });
      return;
    }

    try {
      // יצירת תבנית חדשה
      const newTemplate: DocumentTemplate = {
        id: `TEMP-${Date.now()}`,
        requestNumber: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        title: formData.itemName,
        category: formData.category,
        description: formData.description,
        estimatedCost: formData.emf,
        quantity: formData.quantity,
        department: formData.department,
        priority: formData.priority,
        specifications: formData.specifications,
        metadata: {
          accuracy: 85,
          complexity: "medium" as const,
          estimationMethod: "User Generated",
          lastUpdated: new Date().toISOString().split('T')[0],
          usageCount: 0,
          averageSavings: "0%"
        },
        tags: [formData.category, formData.department, "מותאם אישית"]
      };

      // שמירה ב-localStorage (לדמו - באפליקציה אמיתית נשמור בשרת)
      try {
        const existingTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
        existingTemplates.push(newTemplate);
        localStorage.setItem('customTemplates', JSON.stringify(existingTemplates));
      } catch (storageError) {
        console.error('LocalStorage error:', storageError);
        throw new Error('שגיאה בשמירה המקומית');
      }

      setSaveTemplateModalOpen(false);
      toast({
        title: "תבנית נשמרה בהצלחה",
        description: "התבנית החדשה נוספה למאגר ותהיה זמינה לשימוש עתידי.",
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "שגיאה בשמירת התבנית",
        description: error instanceof Error ? error.message : "אירעה שגיאה בשמירת התבנית. נסה שוב.",
        variant: "destructive",
      });
    }
  }, [formData, toast]);

  const filteredTemplates = searchQuery 
    ? searchTemplates(searchQuery)
    : selectedCategory !== "all" 
      ? getTemplatesByCategory(selectedCategory)
      : documentTemplates;

  // נתוני שלבי התהליך
  const workflowSteps = [
    { id: 1, title: 'בקשה נוצרה', status: 'completed' as const, description: request?.createdAt ? new Date(request.createdAt).toLocaleDateString('he-IL') : '' },
    { id: 2, title: 'מסמכים הועלו', status: (documents && Array.isArray(documents) && (documents as any[]).length > 0) ? 'completed' as const : 'pending' as const, description: documents && Array.isArray(documents) ? `${(documents as any[]).length} קבצים` : 'ממתין' },
    { id: 3, title: 'ניתוח AI', status: (request?.status === 'processing' ? 'active' as const : (request?.status === 'completed' ? 'completed' as const : 'pending' as const)), description: request?.status === 'processing' ? 'בתהליך' : (request?.status === 'completed' ? 'הושלם' : 'ממתין') },
    { id: 4, title: 'הערכת עלות', status: (request?.status === 'completed' ? 'completed' as const : 'pending' as const), description: request?.status === 'completed' ? 'הושלם' : 'ממתין' }
  ];

  // חישוב אחוז התקדמות
  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
  const activeSteps = workflowSteps.filter(step => step.status === 'active').length;
  const workflowProgress = ((completedSteps + (activeSteps * 0.5)) / workflowSteps.length) * 100;

  // נתוני מפרטים לדוגמה
  const procurementSpecs = [
    { id: '1', label: 'כמות', value: '25 יחידות', type: 'essential' as const, category: 'quantity' as const, confidence: 100 },
    { id: '2', label: 'מעבד', value: 'Intel Core i7-13700 (16 cores)', type: 'essential' as const, category: 'processor' as const, confidence: 95 },
    { id: '3', label: 'זיכרון RAM', value: '32GB DDR4', type: 'essential' as const, category: 'memory' as const, confidence: 90 },
    { id: '4', label: 'אחסון', value: '1TB NVMe SSD', type: 'essential' as const, category: 'storage' as const, confidence: 92 },
    { id: '5', label: 'כרטיס גרפי', value: 'Intel UHD Graphics', type: 'advanced' as const, category: 'graphics' as const, confidence: 85 },
    { id: '6', label: 'כרטיס רשת', value: 'Gigabit Ethernet', type: 'advanced' as const, category: 'network' as const, confidence: 88 },
    { id: '7', label: 'אחריות', value: '3 שנות אחריות', type: 'advanced' as const, category: 'warranty' as const, confidence: 95 },
    { id: '8', label: 'מערכת הפעלה', value: 'Windows 11 Pro', type: 'advanced' as const, category: 'os' as const, confidence: 93 },
    { id: '9', label: 'גורם צורה', value: 'Desktop Tower', type: 'advanced' as const, category: 'form-factor' as const, confidence: 87 },
    { id: '10', label: 'ספק כוח', value: '650W 80+ Gold', type: 'advanced' as const, category: 'power' as const, confidence: 80 }
  ];

  // נתוני שיטות אומדן
  const estimationMethods = [
    {
      id: 'analogical',
      title: 'אומדן אנלוגי',
      description: 'השוואה לרכישות דומות שבוצעו בעבר עם התאמה למפרטים הנוכחיים',
      compatibility: 92,
      type: 'analogical' as const
    },
    {
      id: 'parametric',
      title: 'אומדן פרמטרי',
      description: 'חישוב מבוסס נוסחאות מתמטיות ומאגר מחירים עדכני',
      compatibility: 88,
      type: 'parametric' as const
    },
    {
      id: 'market-based',
      title: 'אומדן מבוסס מחיר שוק',
      description: 'ניתוח מחירי שוק נוכחיים מספקים מובילים וממוצעי תעשייה',
      compatibility: 95,
      type: 'market-based' as const
    },
    {
      id: 'bottom-up',
      title: 'אומדן מלמטה למעלה',
      description: 'פירוק המוצר לרכיבים בסיסיים וחישוב עלות כל רכיב בנפרד',
      compatibility: 75,
      type: 'bottom-up' as const
    },
    {
      id: 'expert-judgment',
      title: 'שיפוט מומחה',
      description: 'הערכה מבוססת ניסיון של מומחים בתחום ומאגר ידע מקצועי',
      compatibility: 85,
      type: 'expert-judgment' as const
    }
  ];

  // עדכון השיטות עם סטטוס הבחירה
  const estimationMethodsWithSelection = estimationMethods.map(method => ({
    ...method,
    selected: selectedMethods.includes(method.id)
  }));

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

  // Error handling
  if (requestError || documentsError || extractedDataError) {
    console.error('API Errors:', { requestError, documentsError, extractedDataError });
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 text-destructive">שגיאה בטעינת הנתונים</h2>
        <p className="text-muted-foreground mb-4">
          אירעה שגיאה בטעינת פרטי הבקשה. נסה לרענן את הדף.
        </p>
        <div className="space-x-reverse space-x-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            רענן דף
          </Button>
          <Link href="/dashboard">
            <Button>חזור ללוח הבקרה</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Skeleton loader for the request data itself
  if (requestLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowRight className="w-4 h-4 ml-1 rotate-180" />
                  חזרה
                </Button>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center md:text-right">
                פרטי דרישת רכש
              </h1>
            </div>
            <div className="flex space-x-reverse space-x-4">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <FileText className="w-4 h-4 ml-2" />
                מחקר שוק
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Bot className="w-4 h-4 ml-2" />
                צור אומדן עלות
              </Button>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className={cn(
              "grid gap-4 md:gap-8",
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
            )}>
              <div className="lg:col-span-2 space-y-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
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
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        {/* Page Header */}
        <div className={cn(
          "flex items-center justify-between",
          isMobile ? "flex-col space-y-2" : "flex-row"
        )}>
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-4 h-4 ml-1 rotate-180" />
                חזרה
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center md:text-right">
              פרטי דרישת רכש {requestLoading ? '' : ` - ${request.requestNumber}`}
            </h1>
          </div>
          {requestLoading ? (
            <p className="h-6 w-1/2 bg-muted rounded animate-pulse"></p>
          ) : (
            <p className="text-muted-foreground">{request.itemName}</p>
          )}
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

      {/* Workflow Progress */}
      {requestLoading ? (
        <div className="animate-pulse h-20 bg-muted rounded w-full"></div>
      ) : (
        <WorkflowProgress 
          steps={workflowSteps}
          currentProgress={workflowProgress}
        />
      )}

        <div className={cn(
          "grid gap-4 md:gap-8",
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
        )}>
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Template Selection & Form */}
          {!isFormMode ? (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-reverse space-x-2">
                  <FileText className="text-primary w-5 h-5" />
                  <span>התחל עם תבנית או צור חדש</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  חסוך זמן והשתמש בתבנית קיימת או התחל עם בקשה חדשה
                </p>

                <div className="flex gap-3">
                  <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        <FileText className="w-4 h-4 ml-2" />
                        בחר תבנית
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          בחירת תבנית דרישת רכש
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        {/* Search and Filter */}
                        <div className="flex gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="חפש תבניות..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pr-10"
                            />
                          </div>
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
                        </div>

                        {/* Templates Grid */}
                        <div className="max-h-96 overflow-y-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTemplates.map((template) => (
                              <Card 
                                key={template.id} 
                                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                                onClick={() => handleSelectTemplate(template)}
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-sm leading-tight">{template.title}</CardTitle>
                                    <Badge variant="outline" className="text-xs">
                                      {template.metadata.accuracy}%
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{template.requestNumber}</p>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {template.description}
                                  </p>
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-medium">
                                      {new Intl.NumberFormat('he-IL', {
                                        style: 'currency',
                                        currency: 'ILS',
                                        minimumFractionDigits: 0,
                                      }).format(Number(template.estimatedCost))}
                                    </span>
                                    <span className="text-muted-foreground">{template.quantity} יח׳</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Badge variant="secondary" className="text-xs">
                                      {template.department}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      <span className="text-xs">{template.metadata.usageCount}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="flex-1 border-primary text-primary hover:bg-primary/10"
                    onClick={() => setIsFormMode(true)}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    התחל מאפס
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Info className="text-primary w-5 h-5" />
                    <span>פרטי דרישת רכש</span>
                    {selectedTemplate && (
                      <Badge variant="secondary" className="mr-2">
                        מבוסס על: {selectedTemplate.title}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSaveTemplateModalOpen(true)}
                    >
                      <Save className="w-4 h-4 ml-1" />
                      שמור כתבנית
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFormMode(false)}
                    >
                      חזור לבחירת תבנית
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemName">שם הפריט *</Label>
                    <Input
                      id="itemName"
                      value={formData.itemName}
                      onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                      placeholder="הזן שם הפריט"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">כמות *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">קטגוריה *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">מחלקה *</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מחלקה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="משאבי אנוש">משאבי אנוש</SelectItem>
                        <SelectItem value="הנהלה">הנהלה</SelectItem>
                        <SelectItem value="כספים">כספים</SelectItem>
                        <SelectItem value="תפעול">תפעול</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">עדיפות</Label>
                    <Select value={formData.priority} onValueChange={(value: "low" | "medium" | "high" | "urgent") => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">נמוכה</SelectItem>
                        <SelectItem value="medium">בינונית</SelectItem>
                        <SelectItem value="high">גבוהה</SelectItem>
                        <SelectItem value="urgent">דחוף</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emf">תקציב מוקצה (EMF)</Label>
                    <Input
                      id="emf"
                      value={formData.emf}
                      onChange={(e) => setFormData(prev => ({ ...prev, emf: e.target.value }))}
                      placeholder="הזן תקציב בש״ח"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">תיאור הדרישה</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="פרט את הדרישה ומפרטים נוספים..."
                    rows={4}
                  />
                </div>

                {/* Specifications Editor */}
                {Object.keys(formData.specifications).length > 0 && (
                  <div>
                    <Label>מפרטים טכניים (מהתבנית)</Label>
                    <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{key}:</span>
                          <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Save className="w-4 h-4 ml-2" />
                    שמור דרישת רכש
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Bot className="w-4 h-4 ml-2" />
                    בדיקת AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show existing components only if we have a request */}
          {request && isFormMode && (
            <>
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
            </>
          )}

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
                          <span className="text-foreground">{doc.fileName}</span>
                          <span className="text-xs text-muted-foreground">
                            {doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB` : ''} • {doc.fileType?.toUpperCase()}
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

          {/* Specifications Display */}
          {requestLoading ? (
            <CardSkeleton />
          ) : (
            <SpecsDisplay 
              specs={procurementSpecs}
              className="mb-6"
            />
          )}

          {/* Estimation Methods */}
          {requestLoading ? (
            <CardSkeleton />
          ) : (
            <EstimationMethods
              methods={estimationMethodsWithSelection}
              onMethodToggle={handleMethodToggle}
              onCreateEstimate={handleCreateEstimate}
              isLoading={isLoading}
              className="mb-6"
            />
          )}

          {/* AI Analysis Results */}
          {requestLoading ? (
            <CardSkeleton />
          ) : (
            <AIAnalysis requestId={request.id} specifications={request.specifications} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* EMF and Cost Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* EMF Card */}
            <Card className="bg-card border-info/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">EMF (תקציב מוקצה)</h3>
                  <p className="text-muted-foreground text-sm mb-3">התקציב המוקצה למימוש הדרישה</p>
                  {requestLoading ? (
                    <span className="text-2xl font-bold text-info h-8 w-1/2 bg-muted rounded animate-pulse inline-block"></span>
                  ) : (
                    <span className="text-2xl font-bold text-info">
                      {request.emf ? `₪${parseFloat(request.emf).toLocaleString()}` : 'לא צוין'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Estimated Cost Card */}
            <Card className="bg-card border-success/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">אומדן עלות</h3>
                  <p className="text-muted-foreground text-sm mb-3">אומדן שנוצר במערכת</p>
                  {requestLoading ? (
                    <span className="text-2xl font-bold text-success h-8 w-1/2 bg-muted rounded animate-pulse inline-block"></span>
                  ) : (
                    <span className="text-2xl font-bold text-success">
                      {request.estimatedCost ? `₪${parseFloat(request.estimatedCost).toLocaleString()}` : 'טרם נוצר'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle>פעולות מהירות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => aiAnalysisMutation.mutate()}
                disabled={aiAnalysisMutation.isPending || requestLoading}
              >
                {requestLoading ? (
                  <CenteredLoadingSpinner size="sm" color="text-primary-foreground" />
                ) : (
                  <>
                    <Play className="w-4 h-4 ml-2" />
                    {aiAnalysisMutation.isPending ? 'מפעיל ניתוח...' : 'התחל ניתוח AI'}
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-secondary text-secondary hover:bg-secondary/10"
                onClick={() => {
                  console.log('Market Research button clicked with ID:', id);
                  // Store the request ID in localStorage for context
                  localStorage.setItem('currentRequestId', (id || '').toString());
                  // Navigate directly with the ID in the URL
                  window.location.href = `/market-research/${id || ''}`;
                }}
                disabled={requestLoading}
              >
                <Bot className="w-4 h-4 ml-2" />
                מחקר שוק
              </Button>
              <Button variant="outline" className="w-full" disabled={requestLoading}>
                <Download className="w-4 h-4 ml-2" />
                ייצא דוח
              </Button>
              <Button variant="outline" className="w-full" disabled={requestLoading}>
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
                      {requestLoading ? '...טוען' : new Date(request.createdAt!).toLocaleString('he-IL')}
                    </p>
                  </div>
                </div>

                {documents && Array.isArray(documents) && documents.length > 0 ? (
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <div>
                      <p className="text-sm text-foreground font-medium">מסמכים הועלו</p>
                      <p className="text-xs text-muted-foreground">
                        {documents.length} קבצים
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
                    {requestLoading ? (
                      <span className="text-2xl font-bold text-foreground h-8 w-1/2 bg-muted rounded animate-pulse inline-block"></span>
                    ) : (
                      <p className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat('he-IL', {
                          style: 'currency',
                          currency: 'ILS',
                          minimumFractionDigits: 0,
                        }).format(parseFloat(request.estimatedCost))}
                      </p>
                    )}
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

      {/* Save Template Dialog */}
      <Dialog open={saveTemplateModalOpen} onOpenChange={setSaveTemplateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              שמירת תבנית חדשה
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">שם התבנית</Label>
              <Input
                id="templateName"
                value={formData.itemName}
                onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                placeholder="הזן שם לתבנית"
              />
            </div>

            <div>
              <Label htmlFor="templateDescription">תיאור התבנית</Label>
              <Textarea
                id="templateDescription"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="תאר את התבנית והשימושים המומלצים"
                rows={3}
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">פרטי התבנית</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>קטגוריה: {formData.category}</div>
                <div>מחלקה: {formData.department}</div>
                <div>עלות משוערת: {formData.emf ? `₪${Number(formData.emf).toLocaleString()}` : 'לא צוין'}</div>
                <div>מפרטים: {Object.keys(formData.specifications).length} פריטים</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveAsTemplate} className="flex-1">
                <Save className="w-4 h-4 ml-2" />
                שמור תבנית
              </Button>
              <Button variant="outline" onClick={() => setSaveTemplateModalOpen(false)} className="flex-1">
                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}