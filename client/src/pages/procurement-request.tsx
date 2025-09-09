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
      `,
      "מפרט טכני Dell Latitude 5520.pdf": `
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
      "דרישות אבטחה ותוכנה.pdf": `
# דרישות אבטחה ותוכנה - מחשבים ניידים Dell Latitude

## סקירה כללית
מסמך זה מגדיר את דרישות האבטחה והתוכנה עבור 25 מחשבים ניידים חדשים

## דרישות אבטחה חומרה

### אבטחה פיזית
- TPM 2.0 chip מובנה
- קורא טביעות אצבע מובנה
- Smart Card Reader (אופציונלי)
- Kensington Lock מובנה
- מצלמה עם LED נורית
- תריס פרטיות למצלמה

### הצפנה ואחסון
- הצפנת דיסק מלאה BitLocker
- תמיכה ב-FIPS 140-2 Level 1
- Secure Boot enabled
- UEFI Firmware

## דרישות תוכנה

### מערכת הפעלה
- Windows 11 Pro (21H2 ומעלה)
- Domain join capability
- Group Policy support
- Windows Update for Business

### תוכנות אבטחה
- Microsoft Defender Enterprise
- BitLocker Drive Encryption
- Windows Hello for Business
- Azure AD Integration

### יישומי משרד
- Microsoft Office 365 Pro Plus
- Project Professional 2021
- Visio Professional 2021
- Adobe Acrobat Pro DC

### כלי פיתוח
- Visual Studio 2022 Professional
- SQL Server Management Studio
- Git for Windows
- Windows Subsystem for Linux

### רשת ואבטחת מידע
- Cisco AnyConnect VPN Client
- FortiClient Endpoint Protection
- Chrome Enterprise
- Edge for Business

## מדיניות אבטחה

### זיהוי ואימות
- רב-גורמי באמצעות:
  - טביעת אצבע + PIN
  - Smart Card + PIN
  - Windows Hello face recognition

### גישה ל-Domain
- חיבור אוטומטי ל-Active Directory
- Group Policy enforcement
- Certificate-based authentication
- LDAP over SSL

### הגבלות משתמש
- Standard User Account (לא Admin)
- UAC (User Account Control) enabled
- AppLocker policies
- PowerShell execution policy: Restricted

## ניטור ולוגים

### Event Logging
- Windows Event Log forwarding
- Security audit logging
- Login/logout tracking
- Application usage monitoring

### SIEM Integration
- Forward logs to Splunk SIEM
- Real-time threat detection
- Behavioral analysis
- Incident response automation

## גיבוי והתאוששות

### גיבוי נתונים
- OneDrive for Business sync
- Shadow Copy enabled
- System Image backup weekly
- User Profile backup

### התאוששות
- Windows Recovery Environment
- System Restore points
- BitLocker recovery key escrow
- Remote wipe capability

## Compliance ותקנות

### תקנים נדרשים
- ISO 27001 compliance
- GDPR requirements
- SOC 2 Type II
- NIST Cybersecurity Framework

### הכשרה ומודעות
- Security awareness training
- Phishing simulation tests
- Password policy enforcement
- Incident reporting procedures
      `,
      "תכנית פריסה ותמיכה.pdf": `
# תכנית פריסה ותמיכה - מחשבים ניידים Dell Latitude

## סקירה כללית
תכנית מפורטת לפריסת 25 מחשבים ניידים חדשים כולל לוח זמנים, שלבי יישום ותמיכה שוטפת

## לוח זמנים כללי

### שלב 1: הכנה ותכנון (שבועות 1-2)
- הזמנת ציוד
- הכנת תשתיות IT
- הכנת תוכנות ורישיונות
- אימות קישוריות רשת

### שלב 2: הגדרה ובדיקות (שבועות 3-4)
- קבלת ציוד ובדיקת איכות
- התקנת מערכות הפעלה
- הגדרת אבטחה ומדיניות
- בדיקות פונקציונליות

### שלב 3: פריסה (שבועות 5-6)
- החלפה הדרגתית
- הגדרת פרופילי משתמשים
- העברת נתונים
- הדרכת משתמשים

### שלב 4: יציבות ותמיכה (שבועות 7-8)
- ניטור ביצועים
- תיקון בעיות
- אופטימיזציה
- מעבר למצב production

## פירות שלבי הפריסה

### פריסה לפי מחלקות

#### מחלקת IT (5 מחשבים) - שבוע 5
- פריסה ראשונה לצוות הטכני
- בדיקת תאימות מערכות
- איתור ותיקון בעיות
- יצירת documentation

#### מחלקת הנהלה (8 מחשבים) - שבוע 5
- פריסה במקביל למחלקת IT
- הדרכה אישית למנהלים
- הגדרת גישות מיוחדות
- תמיכה צמודה

#### מחלקת פיתוח (7 מחשבים) - שבוע 6
- התקנת כלי פיתוח
- הגדרת סביבות עבודה
- חיבור לשרתי פיתוח
- בדיקת ביצועים

#### מחלקת שיווק (5 מחשבים) - שבוע 6
- התקנת תוכנות עיצוב
- הגדרת הרשאות שיתוף
- חיבור למדפסות גרפיות
- הדרכה על כלים חדשים

## תמיכה טכנית

### צוות תמיכה פנימי
- טכנאי IT ראשי: אחראי כללי
- 2 טכנאי תמיכה: תמיכה יומיומית
- מנהל מערכות: ניטור ותחזוקה
- מתאם אבטחה: מדיניות ואבטחה

### תמיכה חיצונית - Dell
- ProSupport Plus 24/7
- Next Business Day onsite
- Remote technical support
- Hardware replacement

### כלי תמיכה ונטור
- Microsoft System Center
- Remote Desktop Services
- Windows Admin Center
- PowerShell DSC

## הכשרה והדרכה

### הדרכת משתמשים
- כל משתמש: 2 שעות הדרכה אישית
- מנהלים: 4 שעות הדרכה מתקדמת
- צוות IT: 8 שעות הדרכה טכנית
- חומרי הדרכה דיגיטליים

### נושאי הדרכה
- שימוש במערכת החדשה
- אבטחה ומדיניות
- יישומים חדשים
- פתרון בעיות בסיסיות

## ניהול שינויים

### תקשורת ועדכונים
- הודעה כללית לעובדים
- עדכונים שבועיים להנהלה
- FAQ ומדריכים online
- ערוץ תמיכה ייעודי

### ניטור ומדידה
- זמני השבתה
- רמת שביעות רצון משתמשים
- מספר קריאות תמיכה
- זמני פתרון בעיות

## תחזוקה שוטפת

### עדכונים וטלאים
- Windows Updates אוטומטיים
- עדכוני תוכנה חודשיים
- עדכוני אבטחה שבועיים
- בדיקת performance רבעונית

### גיבויים ו-DR
- גיבוי נתונים יומי
- System image חודשי
- בדיקת התאוששות רבעונית
- תיעוד procedures

## מדדי הצלחה

### KPIs טכניים
- זמינות מערכת: >99%
- זמן תגובה ממוצע: <2 שניות
- זמן פתרון תקלות: <4 שעות
- רמת אבטחה: אפס incidents

### KPIs עסקיים
- שביעות רצון משתמשים: >90%
- פרודוקטיביות: עליה של 15%
- עלויות תמיכה: ירידה של 20%
- זמן הטמעה: <8 שבועות
      `,
      "מפרט ארגונומי ואיכות.pdf": `
# מפרט ארגונומי ואיכות - כסאות משרד

## סקירה כללית
מפרט מפורט עבור 50 כסאות משרד ארגונומיים איכותיים לחדרי הישיבות והמשרדים החדשים

## דרישות ארגונומיות

### תמיכה גופנית
- תמיכה מלאה בעמוד השדרה הטבעי (S-curve)
- כרית גב מתכווננת עם תמיכה לאזור הלומבאר
- גובה מושב מתכוונן (42-55 ס"מ מהרצפה)
- זווית גב מתכווננת (90-130 מעלות)
- תמיכה לצוואר ולראש (מתכווננת)

### מנגנוני התאמה
- מנגנון נטייה עם בקרת מתח
- כוונון עצמאי של גובה משענת גב
- כריות משענות זרועות מתכווננות
- בסיס עם 5 גלגלים איכותיים
- מנגנון פנאומטי איכותי

### מידות וממדים
- רוחב מושב: 48-52 ס"מ
- עומק מושב: 45-50 ס"מ
- גובה כללי מקסימלי: 125 ס"מ
- רוחב בסיס: 65 ס"מ
- משקל נתמך: עד 120 ק"ג

## דרישות איכות וחומרים

### חומרי ריפוד
- בד נושם איכותי עמיד לבלאי
- צפיפות קצף: 45-50 ק"ג למ"ר
- עמידות לדהייה (Grade 4 minimum)
- עמידות לשחיקה (>100,000 cycles)
- התנגדות לכתמים ולחות

### מבנה וחיזוק
- מסגרת פנימית מפלדה מחוזקת
- בסיס מאלומיניום או פלסטיק מחוזק
- גלגלים עם בלמים אוטומטיים
- צירים וברגים בציפוי אנטי קורוזיה
- ריתוכים מחוזקים בנקודות מתח

### מנגנונים
- ציליקה פנאומטי של יצרן אירופאי מוביל
- מנגנון נטייה עם 3 עמדות נעילה
- מנגנוני כוונון חלקים ושקטים
- הברגה עמידה לשימוש כבד
- חלקי חילוף זמינים למינימום 10 שנים

## תקנים ובדיקות איכות

### תקנים נדרשים
- EN 1335 (European Standard for Office Chairs)
- ANSI/BIFMA X5.1 (American Standards)
- ISO 9001 Quality Management
- ISO 14001 Environmental Management
- GREENGUARD Low Chemical Emissions

### בדיקות חובה
- בדיקת עמידות (1,000,000 cycles)
- בדיקת יציבות וביטחון
- בדיקת מנגנונים ותפקוד
- בדיקות כימיות לפליטות
- בדיקת עמידות אש (BS 5852)

## דרישות אסתטיות ועיצוב

### צבעים וגימורים
- צבע בסיסי: שחור או אפור כהה
- אופציות נוספות: אפור בהיר, כחול כהה
- גימור מט ללא ברק
- התאמה לעיצוב המשרד הקיים
- אלמנטי מתכת בגימור כרום מאט

### אלמנטי נוחות
- משענות זרועות רכות ונוחות
- קצוות מעוגלים לבטיחות
- מרקם נעים למגע
- אוורור טבעי של הבד
- עיצוב נקי ומינימליסטי

## דרישות התקנה ואחזקה

### הרכבה והתקנה
- הרכבה קלה עם כלים סטנדרטיים
- מדריך הרכבה בעברית
- זמן הרכבה מקסימלי: 30 דקות
- אריזה ידידותית לסביבה
- רכיבים מסומנים בבירור

### אחזקה שוטפת
- ניקוי קל עם חומרי ניקוי סטנדרטיים
- עמידות לניקוי עם אלכוהול (COVID)
- משטחים עמידים לכתמים
- אחזקה מינימלית נדרשת
- חלפים זמינים מהיצרן

## אחריות ושירות

### תנאי אחריות
- אחריות מלאה: 5 שנים
- אחריות מנגנונים: 7 שנים
- אחריות בסיס וגלגלים: 5 שנים
- אחריות בד וריפוד: 3 שנים
- שירות ותמיכה: 10 שנים

### שירות לקוחות
- תמיכה טכנית בעברית
- זמן תגובה: תוך 48 שעות
- החלפת חלקים פגומים חינם
- אפשרות שדרוג ושיפור
- הדרכה על שימוש נכון
      `,
      "דרישות עמידות ואחריות.pdf": `
# דרישות עמידות ואחריות - כסאות משרד ארגונומיים

## סקירה כללית
מסמך זה מגדיר את דרישות העמידות, האמינות והאחריות עבור 50 כסאות משרד ארגונומיים

## דרישות עמידות ואמינות

### בדיקות עמידות חובה
- בדיקת עמידות מושב: 200,000 cycles בעומס 135 ק"ג
- בדיקת עמידות משענת גב: 25,000 cycles
- בדיקת עמידות משענות זרועות: 30,000 cycles
- בדיקת מנגנון גובה: 200,000 cycles
- בדיקת מנגנון נטייה: 60,000 cycles

### בדיקות יציבות ובטיחות
- בדיקת יציבות סטטית (לא יתהפך)
- בדיקת עמידות רגליים בעומס 1,136 ק"ג
- בדיקת עמידות משענת גב לדחיפה
- בדיקת בטיחות גלגלים ובלמים
- בדיקת חדות קצוות ופינות

### בדיקות חומרים
- עמידות לבלאי בד (Martindale test): >100,000 rubs
- עמידות לדהייה (Light fastness): Grade 4 minimum
- עמידות לכתמים נוזליים: Grade 4
- בדיקת עמידות אש: BS 5852 Crib 5
- בדיקות פליטות (GREENGUARD Gold)

## תקנים בינלאומיים נדרשים

### תקני בטיחות
- EN 1335-1: Dimensions
- EN 1335-2: Safety requirements  
- EN 1335-3: Test methods
- ANSI/BIFMA X5.1: Tests
- ISO 9001: Quality management

### תקני סביבה ובריאות
- GREENGUARD Gold: Low emissions
- Cradle to Cradle: Sustainability
- ISO 14001: Environmental management
- REACH: Chemical safety
- Forest Stewardship Council (FSC)

## דרישות אחריות מקיפה

### אחריות מבנית - 5 שנים
- מסגרת פנימית ורכיבי חיזוק
- בסיס כסא וגלגלים
- נקודות חיבור וריתוך
- יציבות כללית
- בטיחות מבנית

### אחריות מנגנונים - 7 שנים
- מנגנון פנאומטי לכוונון גובה
- מנגנון נטייה ובקרת מתח
- מנגנוני כוונון משענות זרועות
- מנגנוני כוונון גב ותמיכה לומבארית
- כל המנגנונים הנעים

### אחריות ריפוד ובד - 3 שנים
- בלאי רגיל של הבד
- דהייה וויתור צבע
- חוזק התפרים
- שלמות קצף הריפוד
- עמידות בפני כתמים

### אחריות חלקי חילוף - 10 שנים
- זמינות חלקים מהיצרן
- מחירים קבועים לחלפים
- זמן אספקה מקסימלי: 14 יום
- תמיכה טכנית זמינה
- מדריכי החלפה בעברית

## תנאי אחריות מיוחדים

### שימוש מסחרי כבד
- אחריות מלאה לשימוש 8 שעות ביום
- כיסוי לשימוש במשמרות (עד 16 שעות)
- אחריות בסביבות office מגוונות
- עמידות לשימוש אינטנסיבי
- כיסוי לשימוש מרובה משתמשים

### תנאים סביבתיים
- טמפרטורות: 5-40 מעלות צלזיוס
- לחות יחסית: 20-80%
- עמידות לקרינת UV
- עמידות לאזורי מזוג אוויר
- עמידות לסביבות משרדיות רגילות

## תהליך תביעות אחריות

### דיווח ותגובה
- קבלת דיווח תוך 24 שעות
- בדיקה טכנית תוך 48 שעות
- החלטה על תיקון/החלפה תוך 72 שעות
- ביצוע תיקון תוך 5 ימי עבודה
- מעקב ושביעות רצון

### סוגי פתרונות
- תיקון באתר הלקוח
- החלפת חלקים פגומים
- החלפת כסא שלם (במקרים קיצוניים)
- פיצוי בעד אי נוחות
- שדרוג לדגם חדש יותר

## דרישות שירות וטכנית

### תמיכה טכנית
- קו תמיכה בעברית
- זמינות: א'-ה' 08:00-17:00
- מענה טלפוני תוך 3 צלצולים
- תמיכה מקוונת ו-WhatsApp
- בנק ידע ו-FAQ מקיף

### הדרכה ותחזוקה
- הדרכת עובדים על שימוש נכון
- מדריכי תחזוקה מונעת
- טיפים לשמירה על הכסא
- זיהוי מוקדם של בעיות
- ביקורי תחזוקה מונעת (אופציונלי)

## מדדי ביצוע ואיכות

### יעדי זמינות
- זמינות מעל 99.5% (פחות מ-18 שעות השבתה בשנה)
- זמן תגובה ממוצע: < 24 שעות
- זמן פתרון ממוצע: < 48 שעות
- שביעות רצון לקוחות: > 95%
- אחוז תיקונים מוצלחים בפעם הראשונה: > 90%

### מדדי איכות
- אחוז כסאות ללא תקלות בשנה הראשונה: > 98%
- אחוז כסאות ללא תקלות בשנתיים הראשונות: > 95%
- אורך חיים ממוצע: > 12 שנים
- שביעות רצון משתמשים: > 90%
- המלצה לאחרים: > 85%
      `,
      "דרישות מרכז נתונים ותשתיות.pdf": `
# דרישות מרכז נתונים ותשתיות - שרתי Dell PowerEdge R750

## סקירה כללית
מסמך זה מגדיר את הדרישות הטכניות למרכז הנתונים והתשתיות הנדרשות עבור 3 שרתי Dell PowerEdge R750

## דרישות מרכז נתונים

### דרישות חשמל ואנרגיה
- אספקת חשמל יציבה: 220V-240V AC
- תדירות: 50Hz ±1%
- הפרעות מתח: < ±10%
- UPS עם זמן גיבוי: מינימום 30 דקות
- מערכת גנראטור לגיבוי ארוך טווח
- צריכת חשמל מקסימלית: 2.25KW (3 שרתים)

### בקרת טמפרטורה ולחות
- טמפרטורה: 18-25°C (±2°C)
- לחות יחסית: 40-60% (±5%)
- זרימת אוויר: Hot/Cold aisle design
- מערכת HVAC עם גיבוי (N+1)
- ניטור טמפרטורה 24/7
- מערכת התרעות אוטומטית

### תשתית רשת ותקשורת
- חיבורי רשת: 4x 1GbE + 2x 10GbE לכל שרת
- Switch מרכזי: Cisco Catalyst 9300 (48 ports)
- Uplink: 2x 40Gb לרשת המטה
- VLAN separation: Management, Production, Backup
- Firewall: Fortinet FortiGate 200F
- רשת אלחוטית מנוהלת למטרות ניהול

## דרישות Rack ומיקום

### מפרט Rack
- Rack גובה: 42U standard 19"
- עומק: מינימום 1000mm
- רוחב פנימי: 482.6mm (19")
- חיבורי חשמל: 16A per rack
- Cable management מתקדם
- דלתות מחוררות לאוורור

### פריסת שרתים
- Rack 1 (Production): PowerEdge R750 #1
- Rack 1 (Slot 10U): UPS rack-mount
- Rack 2 (Backup): PowerEdge R750 #2  
- Rack 2 (Slot 15U): Network switches
- Rack 3 (Development): PowerEdge R750 #3
- Rack 3 (Slot 20U): Monitoring equipment

### Cable Management
- Structured cabling Cat6A/7
- Fiber optic לחיבורי 10Gb+
- Cable trays עם הפרדת חשמל/נתונים
- תיוג מלא של כל הכבלים
- Cable testing ואישור ביצועים
- תיעוד מלא במערכת DCIM

## תשתיות גיבוי ו-DR

### מערכת גיבוי מרכזית
- Backup server: Dell PowerEdge R650
- Storage: Dell EMC PowerVault ME484
- Tape library: Dell PowerVault TL1000
- Software: Veeam Backup & Replication
- Retention: 30 ימים disk, 7 שנים tape
- RPO: 15 דקות, RTO: 2 שעות

### אתר DR משני
- Mirror site במיקום גיאוגרפי נפרד
- Replication real-time עבור Critical data
- Standby equipment מוכן להפעלה
- Network connection: Dedicated fiber 1Gb
- Testing חודשי של יכולות התאוששות
- Documented procedures ו-runbooks

## ניטור ומערכות ניהול

### DCIM (Data Center Infrastructure Management)
- ניטור צריכת חשמל real-time
- מדידת טמפרטורה ולחות בנקודות מרובות
- ניטור זרימת אוויר ואפקטיביות קירור
- מעקב אחר capacity וניצול משאבים
- התרעות proactive על חריגות
- Dashboard מרכזי עם KPIs

### Network Monitoring
- SNMP monitoring כל הציוד
- Bandwidth utilization tracking
- Network topology mapping
- Performance metrics ו-SLA monitoring
- Security event correlation
- Automated backup verification

### Environmental Monitoring  
- מערכת חיישנים מבוזרת
- Water leak detection
- Smoke detection מתקדם
- Motion sensors ובקרת גישה
- Video surveillance 24/7
- Integration עם מערכות בניין

## אבטחה ובקרת גישה

### Physical Security
- Badge access system עם audit trail
- Biometric access לאזורים קריטיים
- Video recording עם retention 90 יום
- 24/7 security monitoring
- Visitor management system
- Asset tracking עם RFID tags

### Network Security
- Network segmentation עם VLANs
- Firewall rules מובנים
- IDS/IPS deployment
- VPN access למנהלים בלבד
- Certificate-based authentication
- Regular security audits וpen-testing

## סטנדרטים ותקנים

### תקני אמינות
- Tier III uptime requirement (99.982%)
- Concurrent maintainability
- Multiple power paths
- N+1 redundancy לכל מערכות קריטיות
- 72 hours power outage protection
- Mean Time Between Failures: >50,000 hours

### Compliance ותקנות
- ISO 27001 Information Security
- SOC 2 Type II compliance
- GDPR data protection requirements
- PCI DSS (אם רלוונטי)
- Local fire safety regulations
- Environmental compliance (ISO 14001)

## תכנון קיבולת וצמיחה

### Capacity Planning
- Power: 40% reserve capacity
- Cooling: 30% reserve capacity  
- Network: 50% available bandwidth
- Storage: 25% free space maintained
- Rack space: 20% availability
- Growth projection: 3 שנים forward

### Future Expansion
- תכנון לתוספת 2 racks נוספים
- Power infrastructure מוכנה ל-150% צמיחה
- Network backbone מוכן ל-100Gb upgrades
- Modular design לקלות הרחבה
- Standardized procedures ותיעוד
- Vendor relationships לתמיכה ארוכת טווח
      `,
      "SOW פיתוח מערכת HR.pdf": `
# SOW פיתוח מערכת ניהול משאבי אנוש - Statement of Work

## מבוא ומטרות הפרויקט

### רקע
החברה זקוקה למערכת HR מקיפה החלפת מערכות ישנות מרובות ויצירת פלטפורמה אחודה לניהול כל תהליכי משאבי האנוש

### מטרות עיקריות
- פיתוח מערכת HR מקיפה וחדישה
- אינטגרציה עם מערכות קיימות (שכר, נוכחות)
- שיפור יעילות תהליכי HR בעד 40%
- הטמעת תהליכי דיגיטציה ואוטומציה
- שמירה על compliance ותקנות עבודה

## היקף הפרויקט

### מודולים עיקריים

#### 1. ניהול עובדים (Employee Management)
- מאגר עובדים מרכזי עם פרופילים מלאים
- מעקב היסטוריית קריירה ותפקידים
- ניהול מסמכים אישיים ותעודות
- מעקב אחר הכשרות וקורסים
- דירוגים ובדיקות ביצועים שנתיות

#### 2. מערכת גיוס (Recruitment)
- פרסום משרות ופיזור ברשתות חברתיות
- קבלת קורות חיים ומיון אוטומטי
- מערכת מתן ציונים למועמדים
- תיאום ראיונות והזמנות
- מעקב תהליך גיוס end-to-end

#### 3. ניהול נוכחות ושעות
- רישום נוכחות ויציאות
- ניהול חופשות ומחלות
- אישור שעות נוספות
- אינטגרציה עם מערכת שכר
- דוחות נוכחות מנהלים

#### 4. ניהול ביצועים (Performance Management)
- יעדים שנתיים ומעקב ביצועים
- משוב 360 מעלות
- תכניות הכשרה ופיתוח
- תכניות קריירה אישיות
- מערכת תגמולים ובונוסים

#### 5. שכר ותגמולים
- אינטגרציה עם מערכת שכר קיימת
- ניהול תגמולים, בונוסים וגמלאות
- דוחות שכר מפורטים
- ניהול הטבות נלוות
- ניהול הלוואות ומקדמות

### דרישות טכניות

#### ארכיטקטורה
- פלטפורמה ענן (Cloud-native)
- ארכיטקטורה microservices
- API-first design
- Mobile-responsive interface
- Real-time notifications

#### טכנולוגיות מומלצות
- Frontend: React.js או Vue.js
- Backend: Node.js או .NET Core
- Database: PostgreSQL או SQL Server
- Authentication: Azure AD / SAML
- Hosting: Microsoft Azure או AWS

#### אינטגרציות נדרשות
- מערכת שכר קיימת (Priority)
- מערכת נוכחות (Biotime)
- Active Directory
- מערכת מייל (Outlook)
- מערכות דיווח חיצוניות

## לוח זמנים מפורט

### שלב 1: אנליזה ותכנון (4 שבועות)
- Week 1-2: איסוף דרישות ואנליזה
- Week 3: עיצוב מערכת וארכיטקטורה
- Week 4: תכנון UX/UI ואישור עיצובים

### שלב 2: פיתוח ליבה (12 שבועות)
- Week 5-8: פיתוח ניהול עובדים ואישומים
- Week 9-12: פיתוח מערכת גיוס
- Week 13-16: פיתוח ניהול נוכחות ושעות

### שלב 3: פיתוח מתקדם (12 שבועות)
- Week 17-20: פיתוח ניהול ביצועים
- Week 21-24: אינטגרציה עם מערכות קיימות
- Week 25-28: פיתוח דוחות ו-Analytics

### שלב 4: בדיקות והשקה (4 שבועות)
- Week 29-30: בדיקות QA מקיפות
- Week 31: הכשרת משתמשים
- Week 32: השקה והעלייה לאוויר

## צוות הפרויקט

### צוות הפיתוח (6 חברים)
- 1 Project Manager / Technical Lead
- 2 Full-Stack Developers (Senior)
- 1 Frontend Developer (React specialist)
- 1 Backend Developer (.NET/Node.js)
- 1 QA Engineer

### צוות לקוח
- 1 Product Owner (מצד החברה)
- 1 Business Analyst 
- 1 IT Manager
- משתמשי קצה לבדיקות

## תוצרים (Deliverables)

### מסמכים
- מסמך דרישות מפורט (BRD)
- מסמך עיצוב טכני (TDD)
- מדריכי משתמש
- מסמכי API documentation
- תכניות הכשרה

### קוד ומערכת
- קוד מקור מלא
- מסד נתונים והגדרות
- סביבות פיתוח ובדיקות
- מערכת production מוכנה
- כלי deployment ואוטומציה

## מדדי הצלחה ו-KPIs

### מדדים טכניים
- זמן טעינה דפים: < 2 שניות
- זמינות מערכת: > 99.5%
- זמן תגובה API: < 500ms
- Mobile responsiveness: 100%
- Browser compatibility: IE11+

### מדדים עסקיים
- הפחתת זמן תהליכי HR ב-40%
- שיפור דיוק נתונים ל-99%+
- עלייה בשביעות רצון עובדים
- הפחתת עלויות תפעול
- זמן הטמעה מהיר (< 8 שבועות)

## תנאים כספיים

### מחיר פרויקט: ₪960,000
- שלב 1 (אנליזה): ₪120,000 (12.5%)
- שלב 2 (פיתוח ליבה): ₪360,000 (37.5%) 
- שלב 3 (פיתוח מתקדם): ₪360,000 (37.5%)
- שלב 4 (בדיקות והשקה): ₪120,000 (12.5%)

### תנאי תשלום
- 20% במועד חתימת חוזה
- 30% בסיום שלב אנליזה ותכנון
- 30% בסיום פיתוח ליבה
- 20% בהשקה ואישור סופי

## תמיכה ואחזקה

### תמיכה ראשונית (3 חודשים)
- תמיכה טכנית מלאה 24/7
- תיקון באגים ובעיות ללא עלות
- הכשרות נוספות לפי הצורך
- שדרוגים קלים ושיפורים

### אחזקה שוטפת (אופציונלית)
- חוזה אחזקה שנתי: ₪120,000
- תמיכה רגילה: א'-ה' 08:00-18:00
- SLA: תגובה תוך 4 שעות
- עדכונים ושדרוגים רבעוניים
      `,
      "דרישות פונקציונליות מפורטות.pdf": `
# דרישות פונקציונליות מפורטות - מערכת ניהול משאבי אנוש

## מבוא ומתודולוגיה

### גישת פיתוח
מסמך זה מגדיר דרישות פונקציונליות מפורטות עבור מערכת HR חדישה בגישת Agile/Scrum

### סטנדרט דרישות
כל דרישה מוגדרת בפורמט:
- מזהה ייחודי (REQ-XXX)
- תיאור הדרישה
- קריטריונים לקבלה (Acceptance Criteria)
- עדיפות (High/Medium/Low)

## מודול ניהול עובדים

### REQ-001: פרופיל עובד מקיף
**תיאור:** המערכת תאפשר ניהול פרופיל מלא לכל עובד
**עדיפות:** High
**קריטריונים לקבלה:**
- שדות אישיים: שם, ת.ז., תאריך לידה, כתובת, טלפון, מייל
- שדות תעסוקה: תאריך קבלה, תפקיד, מחלקה, ממונה ישיר
- השכלה: תארים, קורסים, הסמכות
- ניסיון קודם: מקומות עבודה, תפקידים
- מסמכים: קורות חיים, תעודות, חוזה עבודה

### REQ-002: ניהול היסטוריית קריירה
**תיאור:** מעקב אחר שינויים בתפקיד, שכר, מחלקה
**עדיפות:** High
**קריטריונים לקבלה:**
- רישום כל שינוי עם תאריך ואישור
- השוואת מצב נוכחי למצב קודם
- גרפים ויזואליים של התקדמות
- התרעות לממונים על שינויים
- Export היסטוריה לדוחות

### REQ-003: ניהול מסמכים דיגיטליים
**תיאור:** העלאה ואחסון מסמכים קשורים לעובד
**עדיפות:** Medium
**קריטריונים לקבלה:**
- תמיכה בפורמטים: PDF, DOC, JPG, PNG
- קטגוריות: אישי, משפטי, הכשרות, רפואי
- הרשאות צפייה לפי תפקיד
- גירסאות של מסמכים עם tracking
- חיפוש בתוכן מסמכים

## מודול גיוס ותפעול

### REQ-004: פרסום משרות אוטומטי
**תיאור:** פרסום משרות פנויות באתרי דרושים
**עדיפות:** High  
**קריטריונים לקבלה:**
- פרסום אוטומטי ב: AllJobs, Drushim, LinkedIn
- תבנית משרה אחידה וניתנת לעריכה
- מעקב אחר מספר צפיות ופניות
- תאריך אוטומטי לסגירת משרה
- אינטגרציה עם רשתות חברתיות

### REQ-005: מיון קורות חיים אוטומטי
**תיאור:** מיון וציון אוטומטי של קורות חיים
**עדיפות:** Medium
**קריטריונים לקבלה:**
- זיהוי מילות מפתח רלוונטיות
- ציון התאמה למשרה (0-100)
- סינון לפי קריטריונים: ניסיון, השכלה, מיקום
- דירוג אוטומטי של מועמדים
- המלצות למועמדים מובילים

### REQ-006: ניהול תהליך ראיונות
**תיאור:** תיאום וניהול ראיונות עבודה
**עדיפות:** High
**קריטריונים לקבלה:**
- יומן משותף למראיינים
- הזמנות אוטומטיות למועמדים (מייל + SMS)
- שאלונים מובנים לפי תפקיד
- רישום הערות וציונים
- החלטה סופית ומשוב למועמד

## מודול נוכחות ושעות

### REQ-007: רישום נוכחות מרובה ערוצים
**תיאור:** רישום נוכחות בדרכים מרובות
**עדיפות:** High
**קריטריונים לקבלה:**
- אפליקציה נייד עם GPS verification
- כרטיס מגנטי או RFID
- קוד QR באפליקציה
- אינטגרציה עם מערכת נוכחות קיימת
- רישום manual למקרי חירום

### REQ-008: ניהול חופשות ומחלות
**תיאור:** בקשות חופשה ואישורים אוטומטיים
**עדיפות:** High
**קריטריונים לקבלה:**
- בקשת חופשה באפליקציה/מערכת
- אישור אוטומטי של ממונה ישיר
- בדיקת זכאות ויתרת ימים
- התראות לצוות על חופשות
- לוח חופשות צוותי למנהלים

### REQ-009: מעקב שעות נוספות
**תיאור:** רישום ואישור שעות נוספות
**עדיפות:** Medium
**קריטריונים לקבלה:**
- רישום שעות בזמן אמת
- אישור מוקדם ומאוחר של ממונה
- חישוב אוטומטי של תוספות שכר
- הגבלות לפי חוזה ועבודה
- דוחות חודשיים לשכר

## מודול ניהול ביצועים

### REQ-010: יעדים שנתיים ומעקב
**תיאור:** הגדרת יעדים ומעקב אחר ביצועים
**עדיפות:** High
**קריטריונים לקבלה:**
- הגדרת יעדים SMART עם ממונה
- מעקב רבעוני ועדכון סטטוס
- גרפים של התקדמות לעומת יעד
- התרעות על חריגות או עיכובים
- קישור בין יעדים אישיים לארגוניים

### REQ-011: משוב 360 מעלות
**תיאור:** אסיפת משוב מ-360 מעלות לעובד
**עדיפות:** Medium
**קריטריונים לקבלה:**
- שאלונים אנונימיים לעמיתים
- משוב מממונה ישיר
- הערכה עצמית של העובד
- דוח מסכם עם תובנות
- תכנית פיתוח בהתבסס על תוצאות

### REQ-012: תכניות הכשרה ופיתוח
**תיאור:** ניהול הכשרות קורסים ופיתוח מקצועי
**עדיפות:** Medium
**קריטריונים לקבלה:**
- קטלוג קורסים פנימיים וחיצוניים
- הרשמה אוטומטית והתרעות
- מעקב אחר השתתפות והעברה
- תעודות ואישורים דיגיטליים
- הערכת אפקטיביות של הכשרות

## מודול שכר ותגמולים

### REQ-013: אינטגרציה עם מערכת שכר
**תיאור:** חיבור מלא למערכת השכר הקיימת
**עדיפות:** High
**קריטריונים לקבלה:**
- העברת נתוני נוכחות אוטומטית
- עדכון שינויים בשכר ותפקיד
- טיפול בבונוסים ותוספות
- סינכרון דו-כיווני של נתונים
- רישום שגיאות וטיפול בהן

### REQ-014: ניהול הטבות נלוות
**תיאור:** מעקב אחר הטבות נלוות לעובד
**עדיפות:** Medium
**קריטריונים לקבלה:**
- רשימת הטבות לפי תפקיד ותק
- בחירת הטבות על ידי העובד
- חישוב ערך כספי של הטבות
- דוחות לרשויות מס (106, 101)
- הטבות חליפיות ומותאמות אישית

### REQ-015: דוחות שכר מפורטים
**תיאור:** דוחות שכר ותגמולים מפורטים
**עדיפות:** Medium
**קריטריונים לקבלה:**
- פירוט מלא של רכיבי שכר
- עלות מעסיק מלאה
- השוואות תקופתיות וגידולים
- Export לאקסל ו-PDF
- דוחות רכזיים לצורכי ניהול

## דרישות UI/UX

### REQ-016: ממשק ידידותי למשתמש
**תיאור:** עיצוב נקי ואינטואיטיבי
**עדיפות:** High
**קריטריונים לקבלה:**
- עיצוב responsive לכל הגדלים
- זמן טעינה: < 3 שניות
- ניווט חד משמעי וברור
- תמיכה בעברית ואנגלית
- נגישות לבעלי מוגבלויות

### REQ-017: אפליקציה ניידת
**תיאור:** אפליקציה ניידת לפונקציות בסיסיות
**עדיפות:** Medium
**קריטריונים לקבלה:**
- זמינות ל-iOS ו-Android
- רישום נוכחות ועיתים
- בקשת חופשות ואישורים
- צפייה בשכר ובדפי שכר
- התראות חכמות (Push notifications)

## דרישות אבטחה ופרטיות

### REQ-018: אבטחת מידע מתקדמת
**תיאור:** הגנה מלאה על מידע אישי ורגיש
**עדיפות:** High
**קריטריונים לקבלה:**
- הצפנת נתונים במנוחה ובתנועה
- גישה מבוססת תפקידים (RBAC)
- רישום כל פעילות במערכת
- אימות דו-שלבי למנהלים
- עמידה בתקן GDPR ו-ISO27001

### REQ-019: גיבוי והתאוששות
**תיאור:** מנגנוני גיבוי והתאוששות אמינים
**עדיפות:** High
**קריטריונים לקבלה:**
- גיבוי אוטומטי יומי לענן
- בדיקת שלמות גיבויים
- Recovery תוך פחות מ-4 שעות
- גיבוי מתמיד עם נקודות שחזור
- בדיקות התאוששות רבעוניות
      `,
      "מפרט טכני ואינטגרציה.pdf": `
# מפרט טכני ואינטגרציה - מערכת ניהול משאבי אנוש

## ארכיטקטורה כללית

### גישה טכנית
הארכיטקטורה מבוססת microservices עם API-first design להבטחת מדרגיות, אמינות ואינטגרציה קלה

### רכיבי מערכת עיקריים

#### Frontend (Client-Side)
- **טכנולוגיה:** React.js 18+ עם TypeScript
- **Framework UI:** Material-UI או Ant Design
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Build Tool:** Vite או Webpack 5
- **Mobile:** React Native או PWA

#### Backend (Server-Side)  
- **Framework:** Node.js עם Express.js או .NET 6 Core
- **Architecture:** RESTful API + GraphQL
- **Authentication:** JWT + OAuth 2.0
- **API Documentation:** Swagger/OpenAPI 3.0
- **Rate Limiting:** Redis-based throttling
- **Caching:** Redis עם TTL policies

#### Database Layer
- **Primary DB:** PostgreSQL 14+ או SQL Server 2019
- **Schema:** Normalized design עם Foreign Keys
- **Indexing:** מותאם לquery patterns
- **Backup:** Point-in-time recovery
- **Analytics:** DataWarehouse עם ETL processes
- **Cache:** Redis למטמון שאילתות מהירות

## אינטגרציות מערכת

### מערכת שכר קיימת (Priority)

#### סוג אינטגרציה
- **Protocol:** REST API או SOAP (לפי יכולות)
- **Format:** JSON או XML
- **Authentication:** API Key + Basic Auth
- **Frequency:** Real-time + Batch overnight
- **Error Handling:** Retry logic עם exponential backoff

#### נתונים משותפים
- **Employee Master Data:** ת.ז., שם, מחלקה, תפקיד
- **Salary Components:** בסיס, תוספות, ניכויים
- **Time & Attendance:** שעות עבודה, נוספות, חופשות
- **Benefits:** הטבות, פנסיה, ביטוח
- **Payroll Results:** פדי שכר, דוחות שנתיים

### מערכת נוכחות (Biotime)

#### פרוטוקול תקשורת
- **Connection:** TCP/IP socket או HTTP API
- **Data Format:** Custom protocol או JSON
- **Real-time:** WebSocket לעדכונים מיידיים
- **Backup:** File-based import במקרה של תקלה
- **Monitoring:** Health checks כל 60 שניות

#### מיפוי נתונים
- **Employee ID Mapping:** מיפוי ת.ז. למספר עובד
- **Clock Events:** כניסה, יציאה, הפסקות
- **Leave Requests:** חופשות, מחלות, נסיעות
- **Overtime:** אישור שעות נוספות
- **Exceptions:** איחורים, עזיבות מוקדמות

### Active Directory

#### SSO Integration
- **Protocol:** SAML 2.0 או OIDC
- **Identity Provider:** Azure AD או On-Premises AD
- **Claims Mapping:** יוזר, תפקיד, מחלקה, הרשאות
- **Session Management:** Idle timeout + forced logout
- **Group Sync:** סינכרון קבוצות AD עם הרשאות מערכת

#### User Provisioning
- **Auto-Provisioning:** יצירת משתמש אוטומטית מ-AD
- **De-Provisioning:** השבתת גישה בעת עזיבה
- **Role Mapping:** תפקיד AD → הרשאות במערכת
- **Attribute Sync:** עדכון נתונים אישיים
- **Audit Trail:** רישום כל שינויי גישה

### מערכת מייל (Outlook/Exchange)

#### Email Notifications
- **SMTP Integration:** שרת Exchange או Office 365
- **Templates:** תבניות מייל מותאמות אישית
- **Automated Emails:** גירסה, אישור, תזכורות
- **Calendar Integration:** אירועי HR בלוח שנה
- **Distribution Lists:** רשימות תפוצה מנוהלות

#### Calendar Integration
- **Meeting Scheduling:** תיאום ראיונות עבודה
- **Leave Calendar:** חופשות צוותיות
- **Training Events:** הכשרות וקורסים
- **Company Events:** אירועי חברה והכרזות
- **Resource Booking:** חדרי ישיבות וציוד

## אפיונים טכניים מתקדמים

### מנגנון דוחות מתקדם

#### Report Engine
- **Technology:** Telerik Reporting או Crystal Reports
- **Export Formats:** PDF, Excel, Word, CSV, JSON
- **Scheduled Reports:** דוחות אוטומטיים בזמנים קבועים
- **Custom Reports:** בונה דוחות עם drag & drop
- **Parameters:** פילטרים דינמיים וטווחי תאריכים

#### Analytics Dashboard
- **Visualization:** Chart.js או D3.js
- **KPIs:** מדדי ביצוע עיקריים
- **Drill-Down:** ניתוח מפורט בכל רמה
- **Real-Time:** עדכונים חיים של נתונים
- **Mobile Optimized:** תצוגה מותאמת נייד

### מנגנון Workflow ואישורים

#### Approval Engine
- **Rules Engine:** הגדרת כללי אישור מתקדמים
- **Multi-Level:** אישורים מרובים ברצף
- **Substitution:** מחליפים בזמן חופשה
- **Escalation:** העברה אוטומטית באיחור
- **Notifications:** התראות SMS, מייל, אפליקציה

#### Business Rules
- **Configurable Rules:** כללים ניתנים להגדרה
- **Validation:** בדיקות תקינות דינמיות
- **Automation:** פעולות אוטומטיות בתנאים
- **Exception Handling:** טיפול במצבים חריגים
- **Version Control:** ניהול גירסאות של כללים

### Performance ו-Scalability

#### Database Optimization
- **Query Optimization:** שאילתות מותאמות עם indexes
- **Connection Pooling:** ניהול חיבורי DB יעיל
- **Read Replicas:** העתקים לקריאה בלבד
- **Partitioning:** חלוקת טבלאות גדולות
- **Archiving:** ארכוב נתונים ישנים

#### Application Performance
- **Caching Strategy:** מטמון רב-שכבתי
- **CDN:** רשת הפצת תוכן לקבצים סטטיים
- **Lazy Loading:** טעינה דינמית של רכיבים
- **Code Splitting:** חלוקת קוד לחבילות קטנות
- **Image Optimization:** דחיסה אוטומטית של תמונות

#### Monitoring ו-Logging
- **APM:** Application Performance Monitoring
- **Log Aggregation:** ELK Stack או Splunk
- **Health Checks:** בדיקות תקינות מתמשכות
- **Alerting:** התראות על תקלות וביצועים
- **Metrics:** מטריקות ביצוע מפורטות

## אבטחה ו-Compliance

### Security Framework

#### Authentication & Authorization
- **Multi-Factor Authentication:** SMS, Email, Authenticator app
- **Role-Based Access Control:** הרשאות לפי תפקיד
- **Permission Granularity:** הרשאות מפורטות לכל פונקציה
- **Session Security:** מגבלת זמן וזיהוי מכשיר
- **API Security:** Rate limiting + Token validation

#### Data Protection
- **Encryption at Rest:** AES-256 למסד נתונים
- **Encryption in Transit:** TLS 1.3 לכל התקשורת
- **Data Masking:** הסתרת נתונים רגישים בלוגים
- **Field-Level Encryption:** הצפנה של שדות רגישים
- **Key Management:** ניהול מפתחות הצפנה מאובטח

### Compliance Requirements

#### GDPR Compliance
- **Data Minimization:** איסוף מינימלי של נתונים
- **Right to be Forgotten:** מחיקת נתונים לפי בקשה
- **Data Portability:** ייצוא נתונים אישיים
- **Consent Management:** ניהול הסכמות למעקב
- **Privacy by Design:** אבטחה ופרטיות מובנית

#### Audit ו-Compliance
- **Audit Trail:** רישום כל פעילות במערכת
- **Change Tracking:** מעקב אחר שינויים בנתונים
- **Compliance Reports:** דוחות לרגולטורים
- **Data Retention:** מדיניות שמירת נתונים
- **Regular Audits:** ביקורות אבטחה תקופתיות

## Deployment ו-DevOps

### Infrastructure

#### Cloud Architecture
- **Platform:** Microsoft Azure או AWS
- **Compute:** Container-based (Docker + Kubernetes)
- **Database:** Managed SQL Database Service
- **Storage:** Blob storage לקבצים ומסמכים
- **CDN:** Azure CDN או CloudFront
- **Load Balancer:** Application Gateway עם SSL termination

#### CI/CD Pipeline
- **Source Control:** Git עם GitFlow methodology
- **Build:** Azure DevOps או GitHub Actions
- **Testing:** Automated unit + integration tests
- **Deployment:** Blue-Green או Rolling deployment
- **Monitoring:** Real-time monitoring post-deployment
- **Rollback:** יכולת חזרה מהירה לגירסה קודמת

### Environment Strategy

#### Development Lifecycle
- **Development:** סביבת פיתוח עם mock data
- **Testing:** QA environment עם נתונים מאובטחים
- **Staging:** סביבה זהה לproduction לבדיקות סופיות
- **Production:** סביבה חיה עם גיבויים ומעקב
- **Disaster Recovery:** אתר DR במיקום גיאוגרפי נפרד

#### Data Management
- **Database Migrations:** Flyway או Entity Framework Migrations
- **Seed Data:** נתונים ראשוניים לסביבות חדשות
- **Test Data:** כלים ליצירת נתוני בדיקה
- **Data Sync:** סינכרון נתונים בין סביבות
- **Backup Strategy:** גיבויים אוטומטיים עם retention policy
      `,
      "SOW ייעוץ ושיפור תהליכים.pdf": `
# SOW ייעוץ אסטרטגי ושיפור תהליכים עסקיים - Statement of Work

## מטרת הפרויקט ורקע

### צרכים עסקיים
החברה נדרשת לשיפור תהליכי העבודה הפנימיים, אופטימיזציה של עלויות ושיפור יעילות התפעול הארגוני

### מטרות מרכזיות
- ניתוח מקיף של תהליכים עסקיים קיימים
- זיהוי צווארי בקבוק וחוסר יעילות
- הגדרת תהליכים משופרים ובסטנדרט עולמי
- פיתוח תכנית יישום ואופטימיזציה
- הדרכה והטמעה בארגון

## היקף העבודה המפורט

### שלב 1: אבחון וניתוח מצב קיים (4 שבועות)

#### מיפוי תהליכים עסקיים
- איסוף מידע מפורט על תהליכי הליבה
- ראיונות עם מנהלים ועובדי מפתח
- צפייה ותיעוד תהליכי עבודה
- מיפוי זרימת מידע ומסמכים
- זיהוי נקודות החלטה קריטיות

#### ניתוח נתונים וביצועים
- איסוף מדדי ביצוע קיימים (KPIs)
- ניתוח זמני ביצוע ועלויות
- זיהוי חוסר יעילות וחריגות
- השוואה לסטנדרטים עילמיים (Benchmarking)
- ניתוח השפעה כלכלית של בעיות

#### זיהוי הזדמנויות שיפור
- קטלוג נקודות כאב ובעיות מרכזיות
- דירוג לפי חומרת ההשפעה העסקית
- הערכת פוטנציאל החיסכון והשיפור
- זיהוי quick wins לשיפור מהיר
- הגדרת יעדי שיפור מדידים

### שלב 2: עיצוב תהליכים משופרים (6 שבועות)

#### תכנון תהליכים חדשים
- עיצוב תהליכי עבודה אופטימליים
- הגדרת נקודות בקרה ואישור
- יצירת תרשימי זרימה מפורטים
- תכנון אינטגרציה בין מחלקות
- הגדרת תפקידים ואחריות

#### תכנון טכנולוגי
- הגדרת דרישות טכנולוגיות
- המלצות על כלים ומערכות
- תכנית אוטומציה של תהליכים
- אינטגרציה עם מערכות קיימות
- הערכת עלויות טכנולוגיות

#### פיתוח מדדי ביצוע
- הגדרת KPIs חדשים למעקב
- יצירת לוחות מחוונים (Dashboards)
- תכנון דוחות ביצועים
- מנגנוני מעקב ובקרה
- תהליכי שיפור מתמיד

### שלב 3: תכנית יישום והטמעה (4 שבועות)

#### אסטרטגיית שינוי
- תכנית change management מפורטת
- זיהוי מקדימי התנגדויות צפויות
- אסטרטגיית תקשורת ועלמות מודעות
- הכשרת מובילי שינוי
- תכנית תמריצים להטמעה

#### לוח זמנים מפורט
- חלוקה לשלבי יישום
- milestone ונקודות בקרה
- ניהול סיכונים וחירום
- תיאום עם פעילות שוטפת
- תכנון משאבים נדרשים

#### תכנית הדרכה
- זיהוי צרכי הכשרה לפי תפקיד
- פיתוח חומרי הדרכה מותאמים
- תכנית workshop ימי עיון
- מדריכים ונהלים כתובים
- תמיכה שוטפת בתקופת מעבר

## צוות יועצים מומחים

### ייעוץ אסטרטגי ותהליכים
- **ראש הצוות:** יועץ בכיר עם 15+ שנות ניסיון
- **מומחה תהליכים:** מומחה ב-Lean & Six Sigma
- **אנליסט עסקי:** מתמחה בניתוח נתונים וKPIs
- **יועץ שינוי ארגוני:** מומחה change management

### התמחויות נושאיות
- מומחה טכנולוגיה ודיגיטציה
- יועץ כספים ובקרת עלויות
- מומחה ניהול סיכונים
- יועץ משאבי אנוש ותרבות ארגונית

## מתודולוגיית עבודה

### גישות מובילות
- **Lean Management:** חיסכון ויעילות מקסימלית
- **Six Sigma:** איכות וצמצום שגיאות
- **Business Process Reengineering:** עיצוב מחדש של תהליכים
- **Agile Implementation:** יישום מהיר ואיטרטיבי
- **Change Management:** ניהול שינוי מובנה

### כלי עבודה מתקדמים
- Process mapping software (Visio, Lucidchart)
- Data analytics tools (Power BI, Tableau)
- Project management (MS Project, Asana)
- Survey tools לאיסוף משוב
- Workshop facilitation tools

## תוצרים צפויים (Deliverables)

### מסמכי אנליזה
- דוח ממצאים מקיף עם המלצות
- מיפוי תהליכים קיימים מפורט
- ניתוח פערים ו-gap analysis
- תכנית שיפור אסטרטגית
- הערכת ROI ותועלות כלכליות

### מסמכי יישום
- תהליכי עבודה חדשים מפורטים
- נהלים וטפסים מעודכנים
- תכנית הטמעה שלב-שלב
- חומרי הדרכה וワークשופים
- מדדי בקרה ומעקב

### כלי ניהול
- Dashboard ביצועים אינטראקטיבי
- תבניות דוחות ומעקב
- מערכת alerts והתראות
- כלי מעקב אחר יעדים
- מערכת משוב והערכות

## מדדי הצלחה ו-KPIs

### מדדים כמותיים
- הפחתת זמני ביצוע ב-30-50%
- שיפור שביעות רצון לקוחות ב-25%
- חיסכון בעלויות תפעול: 15-25%
- הפחתת שגיאות ב-40%
- שיפור זמני תגובה ושירות

### מדדים איכותיים
- שיפור מורל ושביעות רצון עובדים
- בהירות תפקידים ואחריות
- שיפור תקשורת בין-מחלקתית
- עלייה ביכולת הסתגלות לשינויים
- חיזוק תרבות של שיפור מתמיד

## מבנה עלויות

### עלות פרויקט כוללת: ₪480,000

#### פילוח לפי שלבים:
- **שלב 1 (אבחון):** ₪144,000 (30%)
- **שלב 2 (עיצוב):** ₪192,000 (40%)  
- **שלב 3 (יישום):** ₪144,000 (30%)

#### פילוח לפי רכיבים:
- עבודת יועצים: ₪360,000 (75%)
- כלים וטכנולוגיה: ₪48,000 (10%)
- הדרכות ו-workshops: ₪72,000 (15%)

### תנאי תשלום
- 25% במועד חתימת החוזה
- 35% בסיום שלב אבחון ואנליזה
- 25% בסיום שלב עיצוב תהליכים
- 15% בסיום יישום והטמעה מוצלחת

## תמיכה ומעקב

### תקופת הטמעה (3 חודשים)
- ליווי צמוד לבאירורת תהליכים
- פתרון בעיות ואתגרים שוטפים
- adjustments לתהליכים לפי הצורך
- מדידה ומעקב אחר שיפורים
- דוחות התקדמות חודשיים

### תמיכה ארוכת טווח (אופציונלי)
- ביקורים רבעוניים למעקב
- עדכון תהליכים לפי שינויים
- הכשרות מתמשכות לעובדים חדשים
- ייעוץ בשיפורים נוספים
- תמיכה בפרויקטי שיפור עתידיים
      `,
      "תחומי עבודה ותוצרים.pdf": `
# תחומי עבודה ותוצרים - ייעוץ אסטרטגי ושיפור תהליכים

## סקירה כללית של תחומי העבודה

### תחום 1: ניתוח תהליכי ליבה עסקיים

#### 1.1 תהליכי מכירות ושיווק
- מיפוי customer journey מקיף
- ניתוח ערוצי מכירה וקשר לקוח
- אופטימיזציה של lead generation
- שיפור תהליכי conversion ונאמנות
- אינטגרציה CRM ומערכות מכירה

#### 1.2 תהליכי ייצור ותפעול
- ניתוח שרשרת ייצור ואספקה
- מיפוי bottlenecks וצווארי בקבוק
- שיפור זמני cycle ותפוקה
- ניהול מלאי ואופטימיזציה לוגיסטית
- בקרת איכות וצמצום פגמים

#### 1.3 תהליכי שירות לקוחות
- ניתוח customer experience מקיף
- שיפור זמני תגובה ופתרון בעיות
- אוטומציה של שירותים בסיסיים
- ניהול תלונות ומשוב לקוחות
- מדידת שביעות רצון ו-NPS

### תחום 2: אופטימיזציה פיננסית ותפעולית

#### 2.1 ניהול עלויות וביצועים
- ניתוח מבנה עלויות פרטני
- זיהוי הזדמנויות חיסכון
- אופטימיזציה של תקציבים
- שיפור margins ורווחיות
- ניהול cash flow יעיל יותר

#### 2.2 ניהול משאבי אנוש
- אופטימיזציה של מבנה ארגוני
- שיפור תהליכי גיוס וחניכה
- פיתוח מערכת ביצועים
- תכניות הכשרה ופיתוח
- ניהול נאמנות ועוזבים

#### 2.3 ניהול טכנולוגיה ומידע
- הערכת תשתיות IT קיימות
- תכנון מדיניות דיגיטציה
- שיפור מערכות מידע וביצועים
- ניהול אבטחת מידע
- אוטומציה של תהליכים ידניים

### תחום 3: רואלציית צמיחה והרחבה

#### 3.1 אסטרטגיה עסקית
- פיתוח תכנית אסטרטגית 3-5 שנים
- ניתוח תחרות ומיצוב שוק
- זיהוי הזדמנויות צמיחה חדשות
- פיתוח מודל עסקי חדשני
- תכנון מקורות מימון והשקעה

#### 3.2 פיתוח שווקים חדשים
- מחקר שוק ופוטנציאל צמיחה
- אסטרטגיית כניסה לשווקים חדשים
- פיתוח מוצרים ושירותים חדשים
- בניית שותפויות אסטרטגיות
- תכנון international expansion

#### 3.3 חדשנות ופיתוח עסקי
- הקמת יחידת חדשנות פנימית
- תהליכי R&D ופיתוח מוצר
- ניהול פורטפוליו פרויקטים
- שיתופי פעולה עם חוץ וסטארט-אפים
- מדידת ROI של חדשנות

## תוצרים ו-Deliverables מפורטים

### תוצרי שלב האבחון

#### A1: דוח מצב עסקי מקיף
- **היקף:** 50-70 עמודים
- **תוכן:** ניתוח כל תהליכי הליבה העסקיים
- **כולל:** גרפים, טבלאות, מדדי ביצוע נוכחיים
- **מטרה:** תמונת מצב מלאה ואובייקטיבית
- **פורמט:** PDF + מצגת executive summary

#### A2: מפות תהליכים מפורטות
- **כמות:** 15-20 תרשימי תהליך מרכזיים
- **פרטי:** כל שלב, גורם אחראי, זמנים
- **כלים:** Visio Professional + גרסה מודפסת
- **רמת פירוט:** עד לרמת sub-process
- **תועלת:** בסיס לשיפורים מדוייקים

#### A3: ניתוח פערים (Gap Analysis)
- **תוכן:** השוואה מפורטת למתחרים ובדsטiקים
- **מדדים:** 25-30 KPIs מרכזיים
- **בנצ'מרקינג:** סטנדרטים בינלאומיים בענף
- **זיהוי:** נקודות חולשה ועוצמה יחסיות
- **ממלצות:** quick wins ועדיפויות

#### A4: הערכה כלכלית
- **ניתוח עלויות:** פירוט מלא של עלויות תהליכים
- **פוטנציאל חיסכון:** הערכה כמותית של שיפורים
- **ROI צפוי:** החזר השקעה לכל המלצה
- **תזמון תועלות:** לוח זמנים לקבלת תועלות
- **ניתוח סיכונים:** הערכת סיכונים ומיטיגציה

### תוצרי שלב העיצוב

#### B1: תהליכי עבודה משופרים
- **כמות:** 15-20 תהליכים מעוצבים מחדש
- **פורמט:** תרשימי זרימה מקצועיים
- **רמת פירוט:** הוראות עבודה מפורטות
- **בקרות:** נקודות בדיקה ואישור
- **זמנים:** לוחות זמנים משופרים

#### B2: מטריקס תפקידים ואחריות (RACI)
- **כיסוי:** כל התפקידים במסגרת התהליכים
- **פירוט:** Responsible, Accountable, Consulted, Informed
- **מטרה:** הבהרת אחריות ומניעת כפילויות
- **עדכון:** הגדרות תפקיד מעודכנות
- **integration:** קישור למערכות HR

#### B3: מדדי ביצוע וKPIs חדשים
- **כמות:** 40-50 מדדים מרכזיים
- **סוגים:** תפעוליים, אסטרטגיים, איכותיים
- **targets:** יעדים נומריים ברורים
- **מדידה:** תדירות ומתודת מדידה
- **דוחות:** templates לדוחות תקופתיים

#### B4: תכנית טכנולוגית
- **מערכות:** המלצות על כלים וטכנולוגיות
- **אינטגרציה:** תכנון חיבור מערכות קיימות
- **השקעה:** אומדן עלויות והטמעה
- **לו"ז:** לוח זמנים ליישום טכנולוגי
- **ROI:** החזר השקעה טכנולוגית

### תוצרי שלב ההטמעה

#### C1: תכנית יישום מפורטת
- **משך:** תכנית ל-12-18 חודשים
- **שלבים:** פרפדיקה ל-5-7 שלבי יישום
- **משאבים:** הערכת כוח אדם ותקציב נדרש
- **ניהול סיכונים:** תכניות מילוט ובדybackup
- **מעקב:** milestones ונקודות החלטה

#### C2: חומרי הכשרה מותאמים
- **מדריכים:** נהלים כתובים לכל תפקיד
- **מצגות:** חומרי הדרכה אינטראקטיביים
- **E-learning:** מודולי למידה דיגיטליים
- **workshops:** תכניות הכשרה מעשיות
- **certification:** תעודות גמר להכשרות

#### C3: מערכת ניטור ובקרה
- **Dashboard:** לוח מחוונים אינטראקטיבי
- **דוחות:** תבניות דוחות אוטומטיים
- **alerts:** מערכת התראות על חריגות
- **קאליברציה:** כלי כוונון וסיכוכים
- **improvement:** מנגנון שיפור מתמיד

#### C4: תכנית change management
- **תקשורת:** אסטרטגיית הודעות ועדכונים
- **sponsorship:** זיהוי וחיזוק מנהיגות שינוי
- **resistance:** זיהוי והתמודדות עם התנגדות
- **engagement:** תכניות לעידוד השתתפות
- **feedback:** מנגנוני משוב ושיפור

## מדדי איכות ומסדי הצלחה

### בקרת איכות תוצרים
- סקירת איכות על ידי senior partners
- אישור לקוח בכל שלב מרכזי
- עמידה בסטנדרטים בינלאומיים
- הקפדה על לוחות זמנים
- מעקב אחר שביעות רצון הלקוח

### מדדי הצלחה עסקיים
- שיפור ביצועים מדידים תוך 6 חודשים
- חיסכון בעלויות תוך 12 חודש
- עליה בשביעות רצון לקוחות ועובדים
- קיצור זמני ביצוע תהליכים
- הפחתת שגיאות ועיכובים

### Value Creation מוכח
- תועלת כלכלית נמוכה פי 3 מהשקעה
- שיפור KPIs בחתרת 25-50%
- חיזוק מיצוב תחרותי בשוק
- הכנת הארגון לצמיחה עתידית
- בניית יכולות פנימיות לשיפור עצמי

### תמיכה לאחר הטמעה
- ליווי 90 יום לאחר הטמעה
- תיקון בעיות ו-fine tuning
- הכשרות נוספות לפי הצורך
- מדידת השפעה ארוכת טווח
- תכנון שלבי שיפור נוספים
      `,
      "SOW שירותי אבטחה 24-7.pdf": `
# SOW שירותי אבטחה מתקדמים 24/7 - Statement of Work

## מטרת השירותים

### רקע ועמדת המוצא
הארגון זקוק לשירותי cyber security מתקדמים, מעקב חיוני ותגובה מהירה לאירועי אבטחה במסגרת שירות 24/7/365

### מטרות מרכזיות
- הגנה מתקדמת על תשתיות IT והנתונים הארגוניים
- זיהוי מוקדם של איומי אבטחה ופרצות פוטנציאליות
- תגובה מיידית לאירועי אבטחה וקבלת החלטות
- ניהול סיכוני אבטחה וטכנולוגי מקיף
- עמידה בתקני אבטחה ותקנות מחמירות

## היקף שירותי אבטחה

### שירותי SOC (Security Operations Center)

#### ניטור אבטחה 24/7
- מעקב רציף אחר פעילות רשת ומערכות
- זיהוי וניתוח אירועי אבטחה בזמן אמת
- מתאם עם מערכות SIEM מתקדמות
- ניתוח behavioral patterns וחריגות
- זיהוי מוקדם של malware ופעילות חשודה

#### Threat Intelligence
- איסוף מידע על איומים חדשים ומתפתחים
- ניתוח דפוסי תקיפה ו-TTPs של תוקפים
- התאמת אסטרטגיות הגנה לאיומים עדכניים
- פרסום דוחות איומים שבועיים
- תיאום עם גופי ממשל ורשויות אבטחה

#### Incident Response (IR)
- תגובה מיידית לאירועי אבטחה תוך 15 דקות
- ניתוח עומק של פרצות ופעילות זדונית
- החזקת Chain of Custody לצרכים משפטיים
- ביצוע Forensic Analysis מתקדם
- תכנון ויישום remediation מהירה

### Vulnerability Management

#### סריקות אבטחה תקופתיות
- סריקת רגועה מתמדת של תשתיות IT
- בדיקות חדירה מדמה תקיפות אמתיות
- הערכת חשופה לפי CVSS scoring
- תאימוי רישומי חולשה ובעדכונים
- דירוג ופרקטיזציה של תאגים

#### Patch Management
- זיהוי מהיר של עדכוני אבטחה חירומיים
- תכנון והפצה מבוקרת של patches
- בדיקות תאימות לפני הטמעה production
- מעקב אחר הצלחת עדכונים
- דיווח compliance ועמידה בתקנים

### Security Awareness

#### הכשרת עובדים
- תכניות הדרכה בטאטחה דיגיטלית
- סימולציות תאיפות phishing תקופתיות
- workshop בנושאי אבטחה רלוונטיים
- מדידת רמת מודעות ושיפור מתמיד
- אישורים ובחינות הכשרה

## מרכיבי טכנולוגיים מתקדמים

### SIEM ו-Analytics

#### פלטפורמת SIEM מתקדמת
- אינטגרציה עם כל מערכות הארגון
- מתאם logs מכל הרכיבים הרשת
- ניתוח behavioral ו-machine learning
- יצירת dashboards מותאמים אישית
- דוחות automated ותגובות מוגדרות מראש

#### BI אבטחה ו-Risk Analytics
- מודל risk scoring מתמד למערכות
- ניתוח trends וסטטיסטיקות אבטחה
- זיהוי WEAK POINTS בתשתית
- חיזוי aigorים עתידיים בעזרת AI
- חיווים ביזואליים למפעט חידויים

### Endpoint Protection

#### EDR (Endpoint Detection Response)
- הגנה מתקדמת על workstations ו-servers
- זיהוי מתקדם של malware ו-APTs
- מניעה של data exfiltration
- ניתוח behavioral של processes
- בידוד ותגובה אוטומטית לאיומים

#### DLP (Data Loss Prevention)
- מניעת הדלפת מידע רגיש
- בקרת גישה ל datasets חסויים
- ניטור פעילות משתמשים חשודה
- הצפנה אוטומטית של נתונים רגישים
- אכיפת מדיניות Security policies
      `,
      "מפרט ציוד ומערכות.pdf": `
# מפרט ציוד ומערכות אבטחה מתקדמות

## סקירה כללית

### רקע ומטרות
מסמך זה מגדיר את המפרט הטכני המפורט עבור ציוד ומערכות אבטחה מתקדמות לשירותי SOC 24/7

### תחומי כיסוי
- ציוד רשת ואבטחת תקשורת  
- מערכות ניטור וגילוי חדירות
- כלי ניתוח וחקירה דיגיטלית
- תשתיות אחסון ועיבוד נתונים
- מערכות גיבוי והתאוששות

## ציוד רשת ואבטחה

### Firewalls מתקדמים

#### Next-Generation Firewall (NGFW)
- **דגם מומלץ:** Palo Alto Networks PA-5220
- **תפוקה:** 52 Gbps firewall, 18.5 Gbps threat prevention
- **Session capacity:** 64M concurrent sessions
- **New sessions/sec:** 2.24M
- **IPSec VPN:** 6 Gbps, 10,000 tunnels
- **SSL Decryption:** 4 Gbps

#### מפרט טכני מפורט
- **Interfaces:** 16x 10Gb SFP+, 4x 40Gb QSFP+
- **Management:** Dedicated management port
- **Console:** RJ45 console port
- **Power:** Dual redundant 1400W PSU
- **Rack:** 2U 19" rack mountable
- **Operating System:** PAN-OS 10.2+

#### תכונות אבטחה מתקדמות
- Application identification ו-control
- User identification באמצעות Active Directory
- URL filtering עם real-time updates
- WildFire malware analysis
- DNS Security ו-IoT Security
- GlobalProtect VPN client support

### Intrusion Prevention Systems (IPS)

#### מערכת IPS מרכזית
- **דגם:** Cisco Firepower 4150
- **תפוקה:** 32 Gbps inspection
- **Latency:** < 250 microseconds
- **Rule capacity:** 50,000+ signatures
- **Custom rules:** יכולת יצירת חוקים מותאמים
- **Integration:** SIEM ו-orchestration platforms

#### יכולות גילוי מתקדמות
- Zero-day exploit detection
- Advanced Malware Protection (AMP)
- Behavioral analysis ו-anomaly detection
- Encrypted traffic analysis (ETA)
- Network-based anti-malware
- File trajectory ו-retrospective security

### Network Access Control (NAC)

#### פלטפורמת NAC
- **פתרון:** Cisco ISE (Identity Services Engine)
- **Capacity:** 100,000 concurrent endpoints
- **Authentication:** 802.1X, MAB, WebAuth
- **Policy enforcement:** Dynamic VLAN assignment
- **Guest access:** Self-service portal
- **BYOD support:** Device onboarding ו-profiling

#### אינטגרציות נדרשות
- Active Directory ו-LDAP integration
- Certificate authority (CA) integration
- MDM (Mobile Device Management) integration
- Vulnerability assessment integration
- SIEM platform integration
- Firewall ו-switch integration

## מערכות ניטור וגילוי

### SIEM Platform

#### פלטפורמה מרכזית
- **פתרון:** Splunk Enterprise Security
- **License:** 500 GB/day ingestion
- **Users:** 50 concurrent users
- **Apps:** ES app, ITSI, UBA
- **Retention:** 2 years hot, 5 years warm
- **Search performance:** < 10 seconds typical

#### חומרה נדרשת
- **Indexers:** 6x Dell PowerEdge R750
- **Search heads:** 3x Dell PowerEdge R650  
- **Master node:** 1x Dell PowerEdge R650
- **Storage:** Dell EMC PowerVault ME484
- **Network:** 25Gb connectivity minimum
- **Backup:** Dell EMC PowerProtect DD6900

### Network Detection and Response (NDR)

#### פלטפורמת NDR
- **פתרון:** ExtraHop Reveal(x) 360
- **Network visibility:** East-west ו-north-south traffic
- **ML algorithms:** 25+ advanced detection algorithms
- **Decryption:** SSL/TLS traffic analysis
- **Integration:** SIEM, SOAR, ticketing systems
- **Deployment:** Virtual או physical appliances

#### חיישני רשת
- **EXA 5200:** Core network monitoring
- **EXA 3150:** Branch office deployment  
- **EXA 1150:** Small network segments
- **Cloud sensors:** AWS, Azure, GCP
- **Packet capture:** Full PCAP capability
- **Metadata extraction:** L2-L7 visibility

### Endpoint Detection and Response (EDR)

#### פלטפורמת EDR
- **פתרון:** CrowdStrike Falcon Complete
- **Endpoints:** 1,000 protected endpoints
- **OS Support:** Windows, macOS, Linux
- **Cloud delivery:** SaaS model
- **Response time:** < 1 minute to isolation
- **Integration:** SIEM, SOAR, vulnerability management

#### יכולות מתקדמות
- Real-time process monitoring
- File integrity monitoring (FIM)
- Registry monitoring
- Network traffic analysis
- USB device control
- Application control ו-whitelisting

## כלי ניתוח וחקירה

### Digital Forensics Platform

#### סט כלי חקירה
- **Primary:** Cellebrite UFED Premium
- **Mobile forensics:** iOS ו-Android extraction
- **Computer forensics:** EnCase Forensic v21
- **Network forensics:** Wireshark Professional
- **Malware analysis:** Hybrid Analysis sandbox
- **Memory analysis:** Volatility Framework

#### תחנות עבודה מיוחדות
- **Forensic workstations:** 4x custom builds
- **CPU:** Intel Core i9-12900K
- **Memory:** 128GB DDR4-3200
- **Storage:** 2TB NVMe SSD + 8TB HDD
- **Write blockers:** Hardware-based prevention
- **Imaging tools:** Multi-format support

### Threat Intelligence Platform

#### פלטפורמת Threat Intelligence
- **פתרון:** Recorded Future Intelligence Cloud
- **Data sources:** 1000+ technical sources
- **OSINT collection:** Social media, forums, blogs
- **Dark web monitoring:** Criminal marketplaces
- **Vulnerability intelligence:** CVE enrichment
- **IOC management:** Automated indicator processing

#### Security Orchestration (SOAR)

#### פלטפורמת SOAR
- **פתרון:** Splunk Phantom
- **Playbooks:** 200+ pre-built automation
- **Integrations:** 300+ security tools
- **Case management:** Incident lifecycle management
- **Analytics:** MTTR ו-efficiency metrics
- **Custom development:** Python-based scripting

## תשתיות אחסון ועיבוד

### Storage Infrastructure

#### Primary Storage
- **Array:** Dell EMC PowerStore 7000T
- **Capacity:** 500TB effective (2:1 compression)
- **Performance:** 4M IOPS, 150GB/s bandwidth
- **Connectivity:** 32Gb Fibre Channel
- **Redundancy:** RAID-6 protection
- **Snapshots:** Point-in-time recovery

#### Archive Storage
- **Solution:** Dell EMC PowerProtect DD9900
- **Capacity:** 2.5PB logical (up to 55:1 dedup)
- **Throughput:** 32TB/hour backup speed
- **Retention:** 7 years compliance
- **Encryption:** FIPS 140-2 Level 1
- **Cloud tier:** AWS S3 integration

### Compute Infrastructure

#### Virtualization Platform
- **Hypervisor:** VMware vSphere 7.0 U3
- **Hosts:** 8x Dell PowerEdge R750xs
- **CPU:** 2x Intel Xeon Gold 6338
- **Memory:** 512GB DDR4 per host
- **Network:** 4x 25Gb NICs
- **Management:** vCenter Server Appliance

#### Container Platform
- **Orchestration:** Kubernetes 1.24
- **Container runtime:** containerd
- **Ingress:** NGINX Ingress Controller
- **Service mesh:** Istio for microservices
- **Monitoring:** Prometheus + Grafana
- **Security:** Falco runtime security

## מערכות גיבוי והתאוששות

### Backup Infrastructure

#### Backup Software
- **Solution:** Veeam Backup & Replication v12
- **VMs protected:** 200 virtual machines
- **Databases:** SQL Server, Oracle, MongoDB
- **Applications:** Exchange, SharePoint, Teams
- **Cloud backup:** Azure ו-AWS integration
- **Instant recovery:** < 15 minutes RTO

#### Backup Storage
- **Primary:** Dell EMC PowerProtect DD6900
- **Capacity:** 1PB logical capacity
- **Deduplication:** Up to 30:1 ratio
- **Replication:** Cross-site replication
- **Encryption:** AES-256 at rest and in flight
- **Compliance:** SEC, HIPAA, GDPR ready

### Disaster Recovery

#### DR Site Configuration
- **Location:** Geographic separation > 100km
- **Connectivity:** Dedicated 10Gb fiber link
- **Compute:** 50% of production capacity
- **Storage:** Real-time replication
- **Network:** Identical VLAN configuration
- **Testing:** Monthly DR testing schedule

#### Recovery Objectives
- **RTO:** 4 hours for critical systems
- **RPO:** 15 minutes data loss maximum
- **Availability:** 99.9% annual uptime SLA
- **Testing frequency:** Monthly failover tests
- **Documentation:** Detailed runbooks
- **Training:** Quarterly DR drills

## דרישות רישוי ותמיכה

### Software Licensing

#### אבטחה ומניעה
- Palo Alto Networks Threat Prevention
- Cisco Firepower Threat Defense
- CrowdStrike Falcon Complete
- ExtraHop Reveal(x) Enterprise
- Splunk Enterprise Security
- Recorded Future Enterprise

#### Management ו-Compliance
- VMware vSphere Enterprise Plus
- Veeam Universal License (VUL)
- Microsoft System Center
- Red Hat OpenShift Container Platform
- Cisco ISE Plus licenses
- SSL certificate management

### תמיכה טכנית

#### רמות תמיכה נדרשות
- **Tier 1:** 24x7x365 phone support
- **Response time:** 4 hours critical issues
- **Remote access:** Secure vendor access
- **On-site support:** Next business day
- **Software updates:** Automatic delivery
- **Health checks:** Proactive monitoring

#### Professional Services
- Design ו-implementation services
- Migration ו-integration assistance  
- Training ו-knowledge transfer
- Custom development ו-scripting
- Performance optimization
- Security assessment ו-hardening
      `,
      "SOW תחזוקה שנתית.pdf": `
# SOW תחזוקה שנתית למערכות IT - Statement of Work

## תכנית תחזוקה שנתית מקיפה

### היקף התחזוקה
מסמך זה מגדיר את היקף שירותי התחזוקה השנתית עבור כל מערכות IT הארגון - חומרה, תוכנה ותשתיות רשת

### מטרות עיקריות
- הבטחת פעילות רציפה של כל מערכות IT
- מניעת תקלות באמצעות תחזוקה מונעת
- שמירה על ביצועים אופטימליים
- עמידה בדרישות אבטחה ועדכונים
- מינימום זמני השבתה ו-downtime

## שרותי תחזוקה מרכזיים

### תחזוקת שרתים ותשתיות

#### שרתי Dell PowerEdge (3 יחידות)
- **בדיקות תקופתיות:** ביקורים חודשיים באתר
- **עדכוני BIOS ו-Firmware:** רבעוניים או לפי הצורך
- **תחזוקת קירור:** ניקוי מאווררים ובדיקת טמפרטורות
- **בדיקת דיסקים:** מעקב SMART ו-RAID status
- **תחזוקת UPS:** בדיקת סוללות ומערכות גיבוי
- **זמינות תמיכה:** 24/7 עם SLA של 4 שעות

#### תשתיות רשת ותקשורת
- **מתגי Cisco:** עדכוני IOS ותצורה
- **נתבים וFirewalls:** בדיקות אבטחה ותכולת כללים
- **נקודות WiFi:** אופטימיזציה וכיסוי
- **כבלי רשת:** בדיקות תקינות ותיוג
- **ציוד רשת:** ניקוי ובדיקת קישורים
- **מעקב תעבורה:** ניטור bandwidth וביצועים

### תחזוקת תוכנה ומערכות הפעלה

#### Windows Server Environment
- **Windows Updates:** התקנה מבוקרת חודשית
- **Active Directory:** תחזוקת accounts ומדיניות
- **DNS ו-DHCP:** אופטימיזציה ובדיקות תקינות
- **File Servers:** ניקוי ארכוב קבצים ישנים
- **Print Servers:** עדכוני drivers ובדיקות
- **Backup Systems:** בדיקת תקינות גיבויים

#### בסיסי נתונים
- **SQL Server:** אופטימיזציה של שאילתות ו-indexes
- **Database Backups:** בדיקת שלמות ותקינות
- **Performance Tuning:** ניטור ושיפור ביצועים
- **Security Updates:** עדכוני אבטחה קריטיים
- **User Management:** ניהול הרשאות וגישות
- **Storage Management:** ניקוי לוגים וארכוב

### תחזוקת תחנות עבודה

#### מחשבים שולחניים ולפטופים (70 יחידות)
- **ביקורי תחזוקה:** רבעוניים לכל תחנה
- **עדכוני Windows:** אוטומטיים עם WSUS
- **Software Updates:** Office, Adobe, תוכנות ייעודיות
- **Antivirus Management:** עדכונים ובדיקות
- **Hardware Diagnostics:** בדיקת דיסקים וזיכרון
- **ניקוי פיזי:** ניקוי מקלדות, מסכים ויחידות

#### תוכנות Office ויישומים
- **Microsoft Office 365:** ניהול רישיונות ועדכונים
- **Adobe Creative Suite:** תמיכה ועדכונים
- **תוכנות ייעודיות:** לפי רשימת מערכות מאושרת
- **Browser Management:** Chrome, Edge, Firefox
- **Security Software:** Windows Defender ו-3rd party
- **Backup Agents:** Veeam ומערכות גיבוי

## תכנית תחזוקה מונעת

### לוח זמנים שנתי

#### תחזוקה חודשית
- בדיקת שרתים ותשתיות קריטיות
- עדכוני אבטחה לכל המערכות
- דוח ביצועים ומעקב KPIs
- בדיקת מערכות גיבוי ו-DR
- ניטור capacity ושימוש משאבים

#### תחזוקה רבעונית  
- עדכוני firmware לכל הציוד
- בדיקות security comprehensive
- אופטימיזציה של מערכות ובסיסי נתונים
- ביקורת רישיונות תוכנה
- תרגילי התאוששות (DR drills)

#### תחזוקה שנתית
- החלפת UPS batteries
- ניקוי עמוק של server rooms
- ביקורת אבטחה מלאה
- תכנון שדרוגים לשנה הבאה
- הערכת End-of-Life למערכות

### דוחות ומעקב

#### דוחות תקופתיים
- **דוח חודשי:** סטטוס מערכות ו-SLA compliance
- **דוח רבעוני:** ניתוח טרנדים ותחזיות
- **דוח שנתי:** סקירה מקיפה והמלצות
- **דוחות תקלות:** real-time alerts ועדכונים
- **Performance Reports:** מדדי ביצוע ואופטימיזציה

## SLA ואחריות

### רמות שירות מובטחות
- **Critical Systems Uptime:** 99.5% minimum
- **Response Time:** תוך 4 שעות לתקלות קריטיות
- **Resolution Time:** 24 שעות לבעיות לא קריטיות
- **Planned Downtime:** מקסימום 8 שעות בשנה
- **Data Recovery:** RPO של 4 שעות מקסימום

### תנאי החוזה
- **משך חוזה:** 12 חודשים
- **חידוש אוטומטי:** בהעדר הודעה אחרת
- **עלות שנתית:** ₪180,000 (כולל חלקי חילוף)
- **תשלומים:** רבעוניים מראש
- **ביטוח:** כיסוי מלא לציוד ומערכות
      `,
      "רשימת מערכות ומדריכים.pdf": `
# רשימת מערכות ומדריכי תחזוקה

## מערכות IT מרכזיות

### שרתים ותשתיות

#### שרתי Dell PowerEdge R750
1. **SRV-DC01** - Domain Controller Primary
   - Windows Server 2022 Standard
   - Active Directory, DNS, DHCP
   - 64GB RAM, 2TB Storage
   - מדריך: "AD_Maintenance_Guide_2024.pdf"

2. **SRV-APP01** - Application Server
   - Windows Server 2022 Standard  
   - IIS, .NET Framework, Applications
   - 32GB RAM, 1TB Storage
   - מדריך: "IIS_Management_Guide.pdf"

3. **SRV-DB01** - Database Server
   - Windows Server 2022 Standard
   - SQL Server 2022 Enterprise
   - 128GB RAM, 4TB Storage
   - מדריך: "SQL_Maintenance_Procedures.pdf"

#### ציוד רשת Cisco
- **SW-CORE-01:** Catalyst 3850 Core Switch
- **SW-ACCESS-01-05:** Catalyst 2960X Access Switches  
- **RTR-WAN-01:** ISR 4431 Router
- **FW-01:** ASA 5516-X Firewall
- **WAP-01-12:** Aironet 3802I Access Points

### מערכות תוכנה ויישומים

#### מערכות הפעלה
- Windows 11 Pro (50 תחנות)
- Windows 10 Pro (20 תחנות)
- Windows Server 2022 (3 שרתים)
- VMware vSphere 7.0 (Virtualization)

#### יישומי Office ועסקיים
- Microsoft Office 365 E3 (70 רישיונות)
- Adobe Creative Suite (10 רישיונות)
- AutoCAD 2024 (5 רישיונות)
- Project Professional 2021 (15 רישיונות)
- Visio Professional 2021 (10 רישיונות)

#### מערכות אבטחה
- Windows Defender ATP (All endpoints)
- Cisco ASA Firewall Management
- Symantec Endpoint Protection (Backup)
- Veeam Backup & Replication

## מדריכי תחזוקה מפורטים

### מדריך 1: תחזוקת Active Directory
**קובץ:** AD_Maintenance_Guide_2024.pdf
**תוכן:**
- ניקוי accounts לא פעילים
- בדיקת Group Policy Objects
- תחזוקת DNS records
- ביקורת הרשאות משתמשים
- גיבוי וSysvol ו-NTDS
- מעקב Event Logs

### מדריך 2: תחזוקת SQL Server
**קובץ:** SQL_Maintenance_Procedures.pdf
**תוכן:**
- Database integrity checks (DBCC)
- Index maintenance ו-statistics update
- Transaction log management
- Backup verification procedures
- Performance monitoring queries
- User access auditing

### מדריך 3: ניהול מערכות Cisco
**קובץ:** Cisco_Network_Maintenance.pdf
**תוכן:**
- IOS update procedures
- Configuration backup scripts
- VLAN management
- Port security configuration
- SNMP monitoring setup
- Troubleshooting common issues

### מדריך 4: תחזוקת VMware
**קובץ:** VMware_vSphere_Guide.pdf
**תוכן:**
- VM template management
- Resource pool optimization
- Snapshot management
- ESXi host maintenance mode
- vCenter Server backup
- Performance monitoring

### מדריך 5: Veeam Backup Operations
**קובץ:** Veeam_Backup_Procedures.pdf
**תוכן:**
- Backup job configuration
- Restore procedures testing
- Repository maintenance
- Tape rotation schedules
- Cloud backup setup
- Monitoring ו-alerting

### מדריך 6: Office 365 Management
**קובץ:** O365_Admin_Guide.pdf
**תוכן:**
- User provisioning ו-deprovisioning
- License management
- Security ו-compliance center
- Exchange Online management
- SharePoint administration
- Teams administration

### מדריך 7: Network Security
**קובץ:** Network_Security_Guide.pdf
**תוכן:**
- Firewall rule management
- VPN configuration
- Access control lists (ACLs)
- Intrusion detection setup
- Log analysis procedures
- Incident response steps

### מדריך 8: Endpoint Management
**קובץ:** Endpoint_Maintenance.pdf
**תוכן:**
- Windows Update management (WSUS)
- Software deployment procedures
- Hardware inventory tracking
- Remote troubleshooting tools
- Security compliance scanning
- Performance optimization

## סקריפטים ואוטומציה

### PowerShell Scripts
1. **UserCleanup.ps1** - ניקוי אוטומטי של users לא פעילים
2. **DiskSpaceReport.ps1** - דוח שטח דיסק לכל השרתים  
3. **BackupVerification.ps1** - בדיקת תקינות גיבויים
4. **SecurityAudit.ps1** - ביקורת אבטחה בסיסית
5. **NetworkScan.ps1** - סריקת רשת ו-port scanning

### Batch Scripts
1. **SystemReboot.bat** - restart מתוכנן לשרתים
2. **LogCleanup.bat** - ניקוי log files ישנים
3. **ServiceRestart.bat** - restart שירותים קריטיים
4. **TempCleanup.bat** - ניקוי temp files

### Python Scripts
1. **network_monitor.py** - ניטור רציף של רשת
2. **performance_collector.py** - איסוף מטריקות ביצוע
3. **log_analyzer.py** - ניתוח לוגים אוטומטי
4. **alert_sender.py** - שליחת התראות

## כלי ניטור ובדיקה

### כלי חינמיים
- **PingPlotter:** ניתוח רשת ו-latency
- **CrystalDiskInfo:** בדיקת בריאות דיסקים
- **HWiNFO:** מידע מפורט על חומרה
- **Process Monitor:** מעקב אחר תהליכים
- **Wireshark:** ניתוח תעבורת רשת

### כלי מסחריים
- **PRTG:** ניטור תשתיות מקיף
- **SolarWinds NPM:** ניהול ביצועי רשת
- **Lansweeper:** asset management
- **ManageEngine:** IT service management
- **Nagios XI:** Infrastructure monitoring

## נהלי תחזוקה שגרתיים

### יומיים
- בדיקת backup logs
- מעקב אחר disk space
- סקירת security alerts
- ניטור system performance
- בדיקת service availability

### שבועיים  
- עדכוני אבטחה קריטיים
- ניקוי temporary files
- בדיקת user accounts חדשים
- דוח utilization למערכות
- תיעוד תקלות ופתרונות

### חודשיים
- Windows Updates testing ו-deployment
- ביקורת software licenses
- performance baselines update
- security compliance scan
- documentation updates

### רבעוניים
- firmware updates לציוד רשת
- database maintenance מקיף
- disaster recovery testing
- hardware inventory update
- vendor relationship review

## אנשי קשר טכניים

### ספקים ותמיכה חיצונית
- **Dell Support:** 1-800-WWW-DELL
- **Microsoft Premier:** Case portal online  
- **Cisco TAC:** 1-800-553-2447
- **VMware Support:** Online portal + phone
- **Veeam Support:** 24/7 online portal

### צוות פנימי
- **IT Manager:** אחראי כללי על תשתיות
- **Network Admin:** ניהול רשת ואבטחה
- **System Admin:** שרתים ומערכות הפעלה
- **Desktop Support:** תחנות עבודה ומשתמשים
- **Database Admin:** בסיסי נתונים ו-applications
      `,
      "מפרט תחנות עבודה סטנדרטיות.pdf": `
# מפרט תחנות עבודה סטנדרטיות

## סקירה כללית
מסמך זה מגדיר את המפרט הטכני עבור 15 תחנות עבודה שולחניות חדשות עם דרישות ביצועים גבוהות

## מפרט חומרה מפורט

### יחידת עיבוד מרכזית (CPU)
- **דגם:** Intel Core i7-13700K
- **ליבות:** 16 ליבות (8 P-cores + 8 E-cores)
- **תדירות בסיס:** P-cores: 3.4GHz, E-cores: 2.5GHz  
- **תדירות מקסימלית:** P-cores: 5.4GHz, E-cores: 4.2GHz
- **זיכרון מטמון:** 30MB Intel Smart Cache
- **כוח:** 125W TDP
- **תמיכה:** DDR4-3200/DDR5-5600, PCIe 5.0

### זיכרון ראשי (RAM)
- **קיבולת:** 32GB (2x 16GB)
- **סוג:** DDR4-3200 CL16
- **מהירות:** 3200 MT/s
- **אופן עבודה:** Dual Channel
- **יצרן:** Corsair Vengeance LPX
- **אפשרות הרחבה:** עד 128GB (4 slots)

### כרטיס מסך
- **דגם:** NVIDIA GeForce RTX 4060 Ti 16GB
- **זיכרון וידאו:** 16GB GDDR6
- **רוחב פס:** 288 GB/s
- **CUDA Cores:** 4,352
- **תדירות בסיס:** 2,310 MHz
- **תדירות boost:** 2,535 MHz
- **יציאות:** 3x DisplayPort 1.4a, 1x HDMI 2.1a

### אחסון ראשי
- **דיסק SSD ראשי:** 1TB NVMe PCIe 4.0
- **דגם:** Samsung 980 PRO
- **מהירות קריאה:** עד 7,000 MB/s
- **מהירות כתיבה:** עד 5,000 MB/s
- **אחריות:** 5 שנים
- **פקטור צורה:** M.2 2280

### אחסון משני
- **דיסק קשיח:** 2TB SATA III 7200 RPM
- **דגם:** Western Digital Black
- **מטמון:** 256MB
- **MTBF:** 2,000,000 שעות
- **אחריות:** 5 שנים
- **מהירות העברה:** עד 272 MB/s

### לוח אם (Motherboard)
- **דגם:** ASUS PRIME Z790-P WIFI
- **שבבים:** Intel Z790 Chipset
- **Socket:** LGA 1700
- **Form Factor:** ATX
- **זיכרון נתמך:** עד 128GB DDR4/DDR5
- **חריצי PCIe:** 3x PCIe 5.0 x16, 1x PCIe 4.0 x16

### ספק כוח (PSU)
- **הספק:** 750W 80+ Gold
- **דגם:** Corsair RM750x
- **יעילות:** >90% ביעילות
- **מודולרי:** מלא (modular cables)
- **אחריות:** 10 שנים
- **הגנות:** OCP, OVP, UVP, OTP, SCP

### מעטפת (Case)
- **דגם:** Fractal Design Define 7
- **גודל:** Full Tower
- **חומר:** פלדה עם panel זכוכית מחוסמת
- **מאווררים:** 3x 140mm כלולים
- **פילטרי אבק:** מגנטיים לפירוק קל
- **מיקום כוננים:** 6x 3.5", 4x 2.5"

## ציוד היקפי נדרש

### מסכים
- **מסך ראשי:** 27" 4K IPS Monitor
- **דגם:** Dell UltraSharp U2723QE
- **רזולוציה:** 3840x2160 pixels
- **טכנולוגיה:** IPS Black
- **זמן תגובה:** 5ms (gray-to-gray)
- **תדירות רענון:** 60Hz
- **כיסוי צבע:** 95% DCI-P3, 99% sRGB

- **מסך משני:** 24" Full HD Monitor  
- **דגם:** ASUS ProArt PA248QV
- **רזולוציה:** 1920x1080 pixels
- **טכנולוגיה:** IPS
- **זמן תגובה:** 5ms
- **זוויות צפייה:** 178°/178°
- **עמדה:** גובה מתכוונן, pivot, tilt

### מקלדת ועכבר
- **מקלדת:** Logitech MX Keys S
- **סוג:** Wireless, מקשים במגע נמוך
- **תאורה:** LED backlight מתכווננת
- **סוללה:** עד 10 ימים (עם תאורה)
- **חיבור:** USB-C charging, Bluetooth LE

- **עכבר:** Logitech MX Master 3S
- **סוג:** Wireless optical mouse
- **DPI:** עד 8,000 DPI
- **סוללה:** עד 70 ימים לשימוש
- **תכונות:** גלילה היפר-מהירה, 7 לחצנים

### אוזניות ומיקרופון
- **אוזניות:** Jabra Evolve2 65
- **סוג:** Over-ear, noise cancelling
- **מיקרופון:** Boom mic מתקפל
- **חיבור:** USB-A dongle + Bluetooth
- **סוללה:** עד 37 שעות talk time
- **הסמכה:** Microsoft Teams ו-Zoom certified

### רמקולים
- **דגם:** Logitech Z313 2.1 System
- **הספק:** 25W RMS total
- **תגובת תדר:** 48Hz – 20kHz
- **חיבור:** 3.5mm jack
- **בקרה:** Volume ו-bass על הלוח

## מפרט רשת ותקשורת

### חיבור רשת קווי
- **Ethernet:** Gigabit LAN (10/100/1000)
- **מחבר:** RJ45
- **תקן:** IEEE 802.3ab
- **כבלים:** Cat6 UTP
- **מהירות מלאה:** 1 Gbps full duplex

### חיבור WiFi
- **תקן:** Wi-Fi 6E (802.11ax)
- **תדרים:** 2.4GHz, 5GHz, 6GHz
- **מהירות תיאורטית:** עד 2.4 Gbps
- **אנטנות:** 2x2 MIMO
- **אבטחה:** WPA3, WPA2

### Bluetooth
- **גירסה:** Bluetooth 5.3
- **טווח:** עד 10 מטרים
- **פרופילים נתמכים:** A2DP, HFP, HID, AVRCP
- **צריכת חשמל:** Low Energy (LE)

## תכונות אבטחה

### הצפנה וגנה מובנית
- **TPM:** TPM 2.0 מובנה בלוח אם
- **Secure Boot:** תמיכה ב-UEFI Secure Boot
- **BitLocker:** הצפנת כונן מלאה
- **Windows Hello:** תמיכה בזיהוי ביומטרי
- **מעטפת נעילה:** Kensington lock slot

### גיבוי ושחזור
- **System Restore:** נקודות שחזור אוטומטיות
- **File History:** גיבוי קבצים ל-network drive
- **Windows Backup:** גיבוי system image
- **Cloud Backup:** OneDrive for Business sync
- **Recovery Media:** USB recovery drive

## בדיקות איכות ואמינות

### בדיקות חומרה
- **Burn-in Test:** 48 שעות לא פסק
- **Memory Test:** MemTest86+ בדיקה מלאה
- **Storage Test:** CrystalDiskMark ביצועים
- **Graphics Test:** 3DMark stress test
- **Thermal Test:** בדיקת טמפרטורות תחת עומס

### תקני איכות
- **ISO 9001:** תעודת איכות מהיצרן
- **Energy Star:** תעודת יעילות אנרגטית
- **EPEAT Gold:** תקן ידידותיות סביבתית
- **RoHS Compliant:** ללא חומרים מסוכנים
- **CE Marking:** עמידה בתקני האיחוד האירופי

## אחריות ותמיכה

### תנאי אחריות
- **אחריות חומרה:** 3 שנים on-site
- **אחריות תוכנה:** 1 שנה תמיכה מלאה
- **זמן תגובה:** next business day
- **החלפת רכיבים:** חלקים מקוריים בלבד
- **תמיכה טכנית:** טלפונית ו-remote

### שירותי תמיכה מורחבים
- **ProSupport Plus:** אחריות מורחבת זמינה
- **Accidental Damage:** כיסוי לנזקים מקריים
- **Data Recovery:** שירותי שחזור נתונים
- **Migration Service:** העברת נתונים ממחשב ישן
- **Configuration Service:** הגדרה והתקנה באתר

## ציוד נוסף כלול

### כבלים וחיבורים
- כבל חשמל 1.8 מטר
- כבל HDMI 2.1 באורך 2 מטר
- כבל DisplayPort 1.4 באורך 2 מטר
- כבל USB-C לUSB-A באורך 1 מטר
- כבל Ethernet Cat6 באורך 3 מטר

### תוכנות בסיסיות כלולות
- Windows 11 Pro (רישיון מקורי)
- Microsoft Office 365 Apps
- Windows Defender Antivirus
- Adobe Acrobat Reader DC
- VLC Media Player
- 7-Zip Archive Manager

### אביזרי התקנה
- ברגים ודביקים לכל הרכיבים
- מדריכי התקנה והפעלה
- תוויות זיהוי ונפוח מערכת
- כלי התקנה בסיסיים
- קשתות להלצגת כבלים
      `,
      "דרישות תוכנה ורשיונות.pdf": `
# דרישות תוכנה ורשיונות - תחנות עבודה סטנדרטיות

## סקירה כללית
מסמך זה מפרט את כל דרישות התוכנה והרישיונות עבור 15 תחנות העבודה החדשות

## מערכות הפעלה

### Windows 11 Pro
- **גירסה:** Windows 11 Pro 22H2 ומעלה
- **ארכיטקטורה:** x64 (64-bit)
- **רישיון:** Volume License Key (VLK)
- **הפעלה:** Key Management Service (KMS)
- **תמיכה:** 10 שנים מיצרן Microsoft
- **עדכונים:** Windows Update for Business

#### דרישות מערכת מינימליות
- RAM: מינימום 4GB (מומלץ 8GB+)
- Storage: 64GB (למען יש 1TB)
- TPM: גירסה 2.0 נדרשת
- Secure Boot: הפעלה חובה
- UEFI Firmware: תמיכה מלאה

#### תכונות מפתח מופעלות
- BitLocker Drive Encryption
- Windows Hello for Business
- Remote Desktop Protocol (RDP)
- Group Policy Management
- Domain Join capabilities
- Hyper-V (אם נדרש)

## חבילת Office ופרודוקטיביות

### Microsoft Office 365 Apps for Enterprise
- **רישיונות:** 15 user licenses
- **יישומים כלולים:**
  - Word, Excel, PowerPoint, Outlook
  - OneNote, Publisher, Access
  - Skype for Business, Microsoft Teams
  - OneDrive for Business (1TB per user)

#### רישיונות נוספים
- **Microsoft Project Professional 2021:** 5 רישיונות
- **Microsoft Visio Professional 2021:** 10 רישיונות
- **Power BI Pro:** 15 רישיונות משתמש
- **SharePoint Online:** כלול עם Office 365

### תוכנות עיצוב גרפי ומולטימדיה

#### Adobe Creative Cloud for Teams
- **רישיונות:** 5 named user licenses
- **יישומים כלולים:**
  - Photoshop, Illustrator, InDesign
  - Premiere Pro, After Effects
  - Acrobat Pro DC, Bridge
  - XD, Dimension, Dreamweaver

#### תוכנות עיצוב נוספות
- **CorelDRAW Graphics Suite 2023:** 3 רישיונות
- **SketchUp Pro 2023:** 2 רישיונות
- **Autodesk AutoCAD 2024:** 3 רישיונות
- **SolidWorks Standard 2023:** 2 רישיונות

## תוכנות פיתוח וטכניות

### פלטפורמות פיתוח
- **Visual Studio Professional 2022:** 5 רישיונות
- **JetBrains IntelliJ IDEA Ultimate:** 3 רישיונות
- **Git for Windows:** רישיון חופשי (כל התחנות)
- **Node.js LTS:** רישיון חופשי
- **Python 3.11:** רישיון חופשי

### כלי ניהול מסדי נתונים
- **SQL Server Management Studio:** חופשי מMicrosoft
- **MySQL Workbench:** רישיון חופשי
- **Oracle SQL Developer:** רישיון חופשי
- **PostgreSQL + pgAdmin:** רישיון חופשי
- **MongoDB Compass:** רישיון חופשי

## תוכנות אבטחה ואנטי-וירוס

### הגנה מתקדמת
- **Microsoft Defender for Business:** 15 רישיונות
- **Malwarebytes Premium:** 15 רישיונות (גיבוי)
- **Bitdefender GravityZone:** 5 רישיונות (עמדות קריטיות)

#### תכונות אבטחה נוספות
- Windows Defender Application Guard
- Windows Defender Credential Guard  
- Windows Defender Device Guard
- Windows Information Protection (WIP)
- Microsoft Defender SmartScreen

### כלי אבטחה נוספים
- **1Password Business:** 15 רישיונות
- **Authy Desktop:** דו-גורמי authentication
- **OpenVPN Connect:** VPN client
- **WinSCP:** SFTP/SCP client מאובטח

## תוכנות תקשורת ושיתוף

### פלטפורמות תקשורת
- **Microsoft Teams:** כלול עם Office 365
- **Zoom Pro:** 5 רישיונות למפגשים חיצוניים
- **Slack Standard:** 15 רישיונות משתמש
- **WhatsApp Desktop:** רישיון חופשי

### כלי שיתוף ועבודה צוותית
- **SharePoint Online:** כלול עם Office 365
- **OneDrive for Business:** כלול עם Office 365
- **Google Workspace:** 5 רישיונות לשיתוף חיצוני
- **Dropbox Business:** 10 רישיונות

## תוכנות ניהול פרויקטים

### כלי ניהול פרויקטים
- **Microsoft Project Professional 2021:** 5 רישיונות
- **Jira Software:** 15 user licenses
- **Trello Power-Ups:** 15 user licenses
- **Asana Premium:** 10 user licenses

### כלי תכנון וניתוח
- **Lucidchart Professional:** 10 רישיונות
- **draw.io (Diagrams.net):** רישיון חופשי
- **MindMeister Pro:** 5 רישיונות
- **Notion Team:** 15 רישיונות

## תוכנות מולטימדיה ובידור

### נגני מדיה
- **VLC Media Player:** רישיון חופשי
- **Windows Media Player:** כלול עם Windows
- **Adobe Flash Player:** legacy support
- **K-Lite Codec Pack:** רישיון חופשי

### עריכת וידאו בסיסית
- **Adobe Premiere Pro:** כלול עם Creative Cloud
- **DaVinci Resolve:** רישיון חופשי
- **OBS Studio:** streaming וrecording
- **Handbrake:** video conversion

## כלי שירות ותחזוקה

### כלי מערכת
- **CCleaner Professional:** 15 רישיונות
- **WinRAR:** 15 רישיונות מסחריים
- **7-Zip:** רישיון חופשי
- **TreeSize Professional:** 5 רישיונות
- **Process Monitor:** רישיון חופשי מMicrosoft

### כלי רשת ואבחון
- **Wireshark:** רישיון חופשי
- **PuTTY:** SSH/Telnet client חופשי
- **Advanced IP Scanner:** רישיון חופשי
- **Nmap:** network scanner חופשי
- **iperf3:** network performance testing

## תוכנות התקנה וניהול

### Deployment ו-Management
- **Microsoft Deployment Toolkit (MDT):** חופשי
- **Windows Assessment and Deployment Kit:** חופשי
- **System Center Configuration Manager:** רישיון נפרד
- **Group Policy Management Console:** כלול עם Windows

### Virtual Machines
- **VMware Workstation Pro:** 5 רישיונות
- **Oracle VirtualBox:** רישיון חופשי
- **Hyper-V:** כלול עם Windows 11 Pro
- **Docker Desktop:** רישיון מסחרי לארגונים

## רישיונות ותמחור

### סיכום עלויות שנתיות

#### Microsoft Licenses
- Office 365 Apps for Enterprise: $12/user/month × 15 = $2,160/year
- Project Professional 2021: $1,030 × 5 = $5,150 one-time
- Visio Professional 2021: $580 × 10 = $5,800 one-time
- Windows 11 Pro VLK: $199 × 15 = $2,985 one-time

#### Adobe Licenses  
- Creative Cloud for Teams: $84/month × 5 = $5,040/year
- Acrobat Pro DC: $23/month × 10 = $2,760/year

#### Security Software
- Microsoft Defender for Business: $3/user/month × 15 = $540/year
- Malwarebytes Premium: $40/device/year × 15 = $600/year
- 1Password Business: $8/user/month × 15 = $1,440/year

#### Development Tools
- Visual Studio Professional: $1,199 × 5 = $5,995/year (subscription)
- JetBrains IntelliJ Ultimate: $649/year × 3 = $1,947/year

### סך הכל עלות רישיונות
- **עלות שנתית מתמשכת:** ~$18,000
- **עלות חד-פעמית:** ~$14,000
- **סך הכל שנה ראשונה:** ~$32,000

## ניהול רישיונות

### מעקב ואכיפה
- רישום כל הרישיונות במאגר מרכזי
- מעקב תקופות תפוגה והתחדשות
- ביקורות compliance תקופתיות
- כלי Software Asset Management (SAM)
- דוחות שימוש והתאמה לצרכים

### תהליכי רכישה
- רכישה מרכזית דרך Volume License
- ניהול חוזים עם ספקים מרכזיים
- תיאום עם Microsoft CSP Partner
- תהליכי אישור רכישות תוכנה חדשה
- תכנון תקציב שנתי לרישיונות
      `,
      "מפרט רכבים מסחריים.pdf": `
# מפרט רכבים מסחריים לצי החברה

## סקירה כללית
הצעת מחיר לרכישת 8 רכבים מסחריים לצי החברה עם דרישות איכות גבוהות ויעילות תפעולית

## מפרט רכב בסיסי

### דגם ויצרן
- **יצרן:** Ford Transit Connect או שווה ערך
- **דגם:** Transit Connect Cargo Van L2
- **שנת ייצור:** 2024 דגם חדש
- **תקופת אחריות:** 3 שנים או 100,000 ק"מ
- **מוצא:** יבוא מורשה עם תווית תקן ישראלי

### מפרט מנוע ורכב
- **נפח מנוע:** 1.5L EcoBoost Turbo
- **כוח:** 120 כ"ס @ 6,000 RPM
- **מומנט:** 240 Nm @ 1,400-4,500 RPM
- **תיבת הילוכים:** SelectShift 8-Speed Automatic
- **צריכת דלק:** 7.2L/100km (ממוצע משולב)
- **תקן זיהום:** Euro 6d-TEMP

### מידות וקיבולת
- **אורך חיצוני:** 4,848 מ"מ
- **רוחב חיצוני:** 1,986 מ"מ
- **גובה חיצוני:** 1,861 מ"מ
- **בסיס גלגלים:** 3,062 מ"מ
- **נפח מטען:** 3.7 מ"ק (מקסימלי)
- **משקל עצמי:** 1,678 ק"ג
- **משקל כולל מותר:** 2,800 ק"ג

## אבזור ותכונות בטיחות

### בטיחות פעילה
- **ABS + EBD:** מערכת בלמים אנטי-נעילה
- **ESP:** מערכת ייצוב אלקטרונית
- **TCS:** בקרת גזירה
- **Hill Start Assist:** סיוע עלייה בעומק
- **Trailer Sway Control:** בקרת נדנוד נגרר
- **Roll Stability Control:** בקרת יציבות התהפכות

### בטיחות פסיבית
- **6 כריות אוויר:** נהג, נוסע קדמי, צד, וילון
- **כלוב בטיחות:** מבנה קשיח עם אזורי ריסוק
- **חגורות בטיחות:** 3 נקודות לכל המושבים
- **ISOFIX:** נקודות עיגון לכסאות בטיחות לילדים
- **מערכת התרעה:** חגירת חגורות

### מערכות סיוע לנהג
- **Ford Co-Pilot360:** חבילת בטיחות מקיפה
- **Pre-Collision Assist:** מניעת התנגשות קדמית
- **Blind Spot Monitor:** ניטור נקודות עיוורות
- **Lane Keep Assist:** סיוע שמירת נתיב
- **Auto High Beam:** קרן רחוקה אוטומטית
- **Reverse Camera:** מצלמת נסיעה לאחור

## אבזור פנימי ונוחות

### תא הנהג
- **מושב נהג:** מתכוונן חשמלית 8 כיוונים
- **מושב נוסע:** מתכוונן ידנית 4 כיוונים  
- **הגה:** עור, מתכוונן גובה ועומק
- **מחממי מושבים:** לנהג ונוסע קדמי
- **מזג אוויר:** אוטומטי דו-אזורי
- **חלונות:** חשמליים עם אוטו ברמת הנהג

### מערכת מולטימדיה
- **מסך מרכזי:** 12" SYNC 4 touchscreen
- **רדיו:** DAB, FM, AM
- **חיבורים:** Apple CarPlay, Android Auto
- **USB:** 4 יציאות (2 עם טעינה מהירה)  
- **Bluetooth:** hands-free + audio streaming
- **Wi-Fi Hotspot:** עד 10 מכשירים

### תאורה וחשמל
- **פנסי LED:** ראשיים ואחוריים
- **תאורת עבודה:** LED בתא המטען
- **שקע 12V:** במחיצה ובתא מטען
- **שקע 230V:** 150W באזור המטען
- **USB-C:** יציאות טעינה מהירה
- **מצבר:** 75Ah AGM עם ניתוק אוטומטי

## התאמות לשימוש מסחרי

### תא המטען
- **רצפה:** פלסטיק קשיח וחליק
- **דפנות:** מצופות פלסטיק נגד שריטות
- **נקודות עיגון:** 6 נקודות לקשירת מטען
- **מדף נשלף:** מעל פרטיצת הנהג
- **תאורה:** LED עם חיישן פתיחה
- **הגנה בפתיחה:** חיישני מכשול

### ציוד עבודה נוסף
- **גגון:** קשיח עם מנעול לניהול כלים
- **סולם:** נשלף מאחור לגישה לגג
- **מדפים:** מערכת מודולרית נשלפת
- **מחיצה:** רשת מגן בין תא נהג למטען
- **מחזיקים:** למדי לניהול כלי עבודה
- **רצועות:** מערכת קשירה לייצוב מטען

## מערכות טכנולוגיות מתקדמות

### Ford Telematics
- **GPS Tracking:** מעקב מיקום בזמן אמת
- **Fleet Management:** דוחות נסיעה ושימוש
- **Diagnostic Monitoring:** בדיקות מערכת מרחוק
- **Fuel Monitoring:** מעקב צריכת דלק
- **Driver Behavior:** ניטור התנהגות נהיגה
- **Maintenance Alerts:** התראות תחזוקה

### חיבוריות ונגישות
- **FordPass Connect:** שירותים חכמים בענן
- **Remote Start:** התנעה מרחוק דרך אפליקציה
- **Vehicle Health:** בדיקת מצב רכב מרחוק
- **Find My Vehicle:** איתור רכב בחניון
- **Security Alerts:** התראות פריצה או גניבה

## מפרט מנוע וביצועים

### יחידת הנעה
- **סוג מנוע:** EcoBoost 1.5L I4 Turbo
- **מערכת הזרקה:** Direct + Multi-Port
- **מערכת קירור:** נוזל + רדיאטור מורחב
- **מערכת פליטה:** SCR + DPF + GPF
- **הנעה:** קדמית (FWD)
- **דיפרנציאל:** אלקטרוני מוגבל החלקה

### תיבת הילוכים
- **סוג:** SelectShift 8-Speed Automatic
- **מצבי נהיגה:** Normal, Eco, Sport
- **paddle shifters:** באל הגה
- **Tow Mode:** מצב גרירה מותאם
- **שפיפת שוק:** מופחתת לגרירה
- **Oil Cooler:** קירור נוסף לשמן תיבה

### מתלים ובלמים
- **מתלה קדמי:** MacPherson עם מייצב
- **מתלה אחורי:** Torsion Beam מחוזק  
- **בלמים קדמיים:** דיסק מאוורר 278מ"מ
- **בלמים אחוריים:** דיסק 265מ"מ
- **חניית יד:** אלקטרונית עם Auto Hold
- **גלגלים:** 16" סגסוגת + צמיגי עבודה

## חבילות תוספות אופציונליות

### חבילת חורף מתקדמת
- מחממי מושבים קדמיים ואחוריים
- הגה מחומם עם בקרות משולבות
- מחממי מראות צד עם חיישני גשם
- מערכת חימום מוקדם לקבין
- צמיגי חורף Michelin עם חישוקים
- **מחיר תוספת:** ₪12,000

### חבילת טכנולוגיה Pro
- מערכת ניווט מתקדמת עם תנועה חיה
- מצלמות 360° וחיישני חניה מתקדמים
- מערכת audio מתקדמת B&O 10 רמקולים
- טעינה אלחוטית למכשירים ניידים
- מראה אחורית דיגיטלית עם מצלמה
- **מחיר תוספת:** ₪18,000

### חבילת עבודה מקצועית
- מדחס אוויר 12V למפעל לכלים
- מערכת תאורת עבודה LED הקפית
- כלוב הגנה מחוזק למטען רגיש
- מערכת ארגון כלים מודולרית מתקדמת
- חיבור חשמל 230V 500W מוגבר
- **מחיר תוספת:** ₪15,000

## תנאי רכישה ואחריות

### מחיר הרכב הבסיסי
- **מחיר ליחידה:** ₪185,000 (כולל מע"מ)
- **מחיר לכלל הצי (8 יחידות):** ₪1,480,000
- **הנחה לצי:** 8% על רכישת 8 יחידות
- **מחיר סופי לצי:** ₪1,361,600
- **חיסכון:** ₪118,400

### תנאי תשלום ומימון
- **מקדמה:** 30% במועד הזמנה (₪408,480)
- **יתרה:** 70% במועד אספקה (₪953,120)
- **מימון:** 0% ריבית לעסקים לעד 60 חודשים
- **ליסינג:** זמין דרך חברות ליסינג מורשות
- **Trade-in:** קבלת רכבים ישנים בקיזוז

### אחריות ותמיכה
- **אחריות מקיפה:** 3 שנים או 100,000 ק"מ
- **אחריות מנוע:** 5 שנים או 160,000 ק"מ
- **סיוע דרכים:** 24/7 למשך 3 שנים
- **אחריות צמיגים:** שנתיים כנגד בלאי
- **אחריות צבע:** 5 שנים מפני דהייה
- **הארכת אחריות:** זמינה עד 7 שנים

### שירותי תחזוקה
- **תחזוקה מונעת:** כל 15,000 ק"מ או שנה
- **שרות מהיר:** החלפת שמן תוך 30 דקות
- **שרות נייד:** תחזוקה באתר הלקוח (זמינות)
- **חלקי חילוף:** מלאי מובטח למשך 15 שנה
- **עדכוני תוכנה:** חינם למשך 5 שנים
- **שרות דחוף:** זמינות 24/7 לתקלות קריטיות
      `,
      "דרישות ביטוח ותחזוקה.pdf": `
# דרישות ביטוח ותחזוקה לצי רכבים מסחריים

## דרישות ביטוח מקיפות

### ביטוח חובה בסיסי
- **כיסוי נזקי גוף:** ללא הגבלת סכום
- **כיסוי נזקי רכוש:** עד ₪1,500,000 לתאונה
- **תקופת הביטוח:** שנתי עם אפשרות הארכה
- **חברת ביטוח:** מוכרת וויודעת בישראל
- **מקבל תביעות:** זמינות 24/7
- **היקף גיאוגרפי:** ישראל והרשות הפלסטינית

### ביטוח מקיף מורחב (קאסקו)
- **כיסוי נזקי רכוש לרכב:** לפי ערך הרכב
- **כיסוי גניבה:** מלא כולל רכיבים וציוד
- **כיסוי אסון טבע:** שיטפון, רעידת אדמה, ברד
- **כיסוי טרור ואלימות:** נזקים ממעשי איבה
- **כיסוי זכוכיות:** ללא השתתפות עצמית
- **כיסוי צמיגים:** כנגד פנצ'רים ובלאי מוקדם

### ביטוח ציוד ומטען
- **ציוד מותקן ברכב:** עד ₪50,000 לרכב
- **כלי עבודה במטען:** עד ₪25,000 לרכב
- **ציוד אלקטרוני:** GPS, מחשבים, תקשורת
- **מטען המועבר:** עד ₪100,000 לתאונה
- **ציוד לעבודה בגובה:** סולמות וציוד מיוחד
- **פיגור עבודה:** בגין השבתת רכב לתיקון

### השתתפויות עצמיות
- **נזק מתנגשות:** ₪1,500 לתביעה
- **גניבה מלאה:** ₪2,500 לתביעה
- **נזקי טבע:** ₪1,000 לתביעה
- **נזקי זדון:** ₪1,000 לתביעה
- **נזקי זכוכיות:** ללא השתתפות עצמית
- **שירותי דרך:** ללא השתתפות עצמית

### מבוטח נוסף ונהגים
- **נהגים מורשים:** כל בעלי רישיון בתוקף
- **גיל מינימלי:** 23 שנים עם ניסיון 3 שנים
- **הגבלות נהיגה:** איסור נהיגה במצב שכרות
- **רישיון מתאים:** רישיון רכב עד 3.5 טון
- **קורס נהיגה מתקדמת:** חובה לנהגי הצי
- **בדיקות רפואיות:** שנתיות לנהגים מעל 50

## תוכנית תחזוקה מקיפה

### תחזוקה מונעת שוטפת

#### ביקורת חודשית (כל 5,000 ק"מ)
- בדיקת רמות נוזלים (שמן, נוזל קירור, בלמים)
- בדיקת לחץ אוויר בצמיגים כולל רזרבי
- בדיקת תקינות מערכת תאורה ואיתות
- בדיקת תקינות חגורות בטיחות ומערכות בטיחות
- בדיקת תקינות מגבי שמשות ותאורת לוח מחוונים
- ניקוי כללי פנימי וחיצוני

#### ביקורת רבעונית (כל 15,000 ק"מ או 3 חודשים)
- החלפת שמן מנוע ומסנן שמן
- בדיקת מערכת בלמים וחלקי בלימה
- בדיקת תקינות מתלים ומערכת הגה
- בדיקת חגורות הנעה ורצועות
- ביקורת מערכת אפזור ומיזוג אוויר
- בדיקת מצבר ומערכת טעינה

#### ביקורת חצי שנתית (כל 30,000 ק"מ או 6 חודשים)
- החלפת מסנן אוויר ומסנן דלק
- בדיקת מערכת פליטה ובקרת זיהום
- ביקורת צמודה של מערכת התנעה
- בדיקת דיסקי בלמים ורפידות
- בדיקת תקינות מערכת קירור
- בדיקת ברגי גלגלים ומידה הכוונה

#### ביקורת שנתית מקיפה
- החלפת נוזל בלמים ואווירור מערכת
- החלפת נוזל קירור ושטיפת מערכת
- החלפת נזדיל הגה ובדיקת מערכת הגה
- בדיקת צמודה של מערכת הפליטה
- ביקורת מלאה של מערכת החשמל
- בדיקת זיהום וטסט מוהל שנתי

### תחזוקה מתקדמת מקצועית

#### כל 60,000 ק"מ או שנתיים
- החלפת רצועות הילוכים ומתחים
- החלפת מסנני אוויר של מזג האוויר
- ניקוי מערכת דלק ובדיקת זרבובי הזרקה
- החלפת נוזל תיבת הילוכים (אוטומטי)
- בדיקת עמודה מכינות ודיפרנציאל
- החלפת נוזל מערכת קירור

#### כל 120,000 ק"מ או 4 שנים  
- החלפת רצועת הזמנים ופולים
- החלפת משאבת המים ותרמוסטט
- החלפת מצמדים (תיבה ידנית)
- בדיקת מכלול המנוע ואטימות
- החלפת פסטונים וחזות אם נדרש
- ביקורת מלאה של תיבת הילוכים

### מערכת מעקב ובקרה

#### מערכת GPS וטלמטיקה
- **מעקב מיקום:** בזמן אמת 24/7
- **ניטור נהיגה:** מהירות, בלימות, תאוצות
- **דיווח תקלות:** קודי תקלה מהמנוע
- **מעקב תחזוקה:** תזכורות לביקורות
- **מעקב דלק:** מעסה וזיהוי בזבוזים
- **דוחות שימוש:** לכל רכב וכל נהג

#### מערכת התראות מתקדמת
- התראות תחזוקה מתוכננת
- התראות על סטייה מבחירה מתוכננת
- התראות מהירות ועבירות תנועה
- התראות תקלות ויבוא אוטומטי לרז "חרום"
- התראות לרמת דלק נמוכה
- התראות ללחץ צמיגים לא תקין

## עלויות תחזוקה ובביטוח

### עלויות ביטוח שנתיות

#### פרמיות ביטוח צופות לצי (8 רכבים)
- **ביטוח חובה:** ₪12,000 לשנה (₪1,500 לרכב)
- **ביטוח מקיף:** ₪32,000 לשנה (₪4,000 לרכב)
- **ביטוח מקום עבודה:** ₪8,000 לשנה (₪1,000 לרכב)
- **ביטוח נהגים:** ₪4,000 לשנה (₪500 לרכב)
- **ביטוח ציוד ומטען:** ₪6,000 לשנה (₪750 לרכב)
- **סך הכל ביטוח:** ₪62,000 לשנה (₪7,750 לרכב)

### עלויות תחזוקה שנתיות מוערכות

#### תחזוקה שוטפת לכל רכב
- **שירותים מתוכננים:** ₪4,500 לשנה
- **תחזוקה מתקדמת:** ₪2,000 לשנה
- **צמיגים ובלמים:** ₪2,500 לשנה
- **חלקי בלאי כלליים:** ₪1,500 לשנה
- **תיקונים בלתי צפויים:** ₪2,000 לשנה
- **סך הכל תחזוקה:** ₪12,500 לרכב לשנה

#### עלויות נוספות צוות
- **רישוי שנתי:** ₪2,000 לכל הצי
- **בדיקות מוסר שנתיות:** ₪3,200 (₪400 לרכב)
- **מערכת GPS וטלמטיקה:** ₪9,600 לשנה (₪1,200 לרכב)
- **הרחבת אחריות:** ₪8,000 לשנה (₪1,000 לרכב)
- **הכשרת נהגים:** ₪5,000 לשנה
- **ניהול צי:** ₪12,000 לשנה

### סיכום עלויות שנתיות לצי

#### עלויות קבועות שנתיות
- ביטוח מקיף לכל הצי: ₪62,000
- תחזוקה מתוכננת: ₪100,000 (₪12,500 × 8)
- רישוי ובדיקות: ₪5,200
- מערכות ניטור: ₪9,600
- הכשרות וניהול: ₪17,000
- **סך הכל:** ₪193,800 לשנה

#### עלות לרכב לחודש
- עלות שנתית לרכב: ₪24,225
- עלות חודשית לרכב: ₪2,019
- עלות לק"מ (15,000 ק"מ/שנה): ₪1.61 לק"מ

### מודל תמחיר ותשלומים

#### אפשרויות תשלום
1. **תשלום שנתי מראש:** 5% הנחה (₪184,110)
2. **תשלום חצי שנתי:** 2% הנחה (₪189,804)  
3. **תשלום רבעוני:** מחיר מלא (₪48,450 לרבעון)
4. **תשלום חודשי:** 3% תוספת (₪16,650 לחודש)

#### חבילת שירות מקיפה
- מעקב צמוד של ניצול רכבים
- דוחות ביצוע ויעילות חודשיים
- ייעוץ לאופטימיזציה של הצי
- תמיכה טכנית 24/7 לחירום
- ניהול קשרים עם חברות ביטוח
- תאימוי ביקורות תחזוקה מאדליות
      `,
      "כתב כמויות מפורט.pdf": `
# כתב כמויות מפורט - בניית מחסן תעשייתי

## פרטי הפרויקט הכלליים

### תאור הפרויקט
בניית מבנה מחסן תעשייתי עם שטח של 2,500 מ"ר עם לואדח עמידה של 40 שנה ותקן ירוק

### פרטים טכניים כלליים
- **שטח בנוי:** 2,500 מ"ר (50m × 50m)
- **גובה מבנה:** 12 מטר (גובה שמיש)
- **עומס עבודה:** 5 טון/מ"ר רצפה
- **תקן רעידות אדמה:** 0.5g לפי התקן הישראלי
- **תקן ירוק:** LEED Silver מינימום
- **זמן ביצוע:** 8 חודשים

## עבודות עפר ויסודות

### פינוי עפר וחפירה
- **חפירת יסודות ראשית:** 1,200 מ"ק
  - עומק ממוצע: 3.5 מטר
  - רוחב חפירה: 2 מטר
  - פינוי עפר לאתר מורשה
  - עלות: ₪75 למ"ק × 1,200 = ₪90,000

- **חפירת יסודות משנה:** 800 מ"ק
  - עומק ממוצע: 2.5 מטר
  - עבור עמודים וקירות
  - עלות: ₪70 למ"ק × 800 = ₪56,000

### יצוק בטון ליסודות
- **בטון B30 ליסודות ראשיים:** 600 מ"ק
  - כולל ערבוב, שאיבה ויציקה
  - זיון לפי תכנית (25 ק"ג/מ"ק)
  - עלות: ₪480 למ"ק × 600 = ₪288,000

- **בטון B25 ליסודות משנים:** 300 מ"ק
  - כולל ערבוב ויציקה
  - זיון לפי תכנית (20 ק"ג/מ"ק)
  - עלות: ₪450 למ"ק × 300 = ₪135,000

### איטום יסודות
- **בטון איטום אספלטי:** 2,800 מ"ר
  - שכבה כפולה למניעת שחיקות
  - כולל קידוח למריח
  - עלות: ₪45 למ"ר × 2,800 = ₪126,000

## מבנה גושף עיקרי

### מסגרת בטון מזוין

#### עמודים וקורות ראשיות
- **עמודי בטון B40:** 180 מ"ק
  - מידות: 60cm × 60cm × 12m גובה
  - 32 עמודים בסך הכל
  - זיון: 180 ק"ג/מ"ק
  - עלות: ₪650 למ"ק × 180 = ₪117,000

- **קורות אורך ראשיות:** 240 מ"ק
  - מידות: 50cm × 80cm
  - אורך כולל: 400 מטר רץ
  - זיון: 160 ק"ג/מ"ק
  - עלות: ₪620 למ"ק × 240 = ₪148,800

#### קירות היקף
- **קירות בטון B30:** 420 מ"ק
  - עובי: 25 ס"מ
  - גובה: 12 מטר
  - היקף: 200 מטר רץ
  - זיון: 120 ק"ג/מ"ק
  - עלות: ₪520 למ"ק × 420 = ₪218,400

### תקרה וגג

#### לוחות תקרה מבטון
- **לוחות תקרה B35:** 2,500 מ"ר
  - עובי: 35 ס"מ
  - זיון: 140 ק"ג/מ"ק
  - קשרונים למרכזי מתיחה
  - עלות: ₪380 למ"ר × 2,500 = ₪950,000

#### גג פלדה וחיפוי
- **מבנה פלדה לגג:** 45 טון
  - פלדה מגולוונת S355
  - כולל ריתוך והרכבה
  - עלות: ₪12,000 לטון × 45 = ₪540,000

- **חיפוי גג טרמי:** 2,600 מ"ר
  - פאניל סנדוויץ' 10 ס"מ
  - בידוד תרמי R6.5
  - עמיד UV ואש
  - עלות: ₪180 למ"ר × 2,600 = ₪468,000

## מערכות נוספות במבנה

### רצפה תעשייתית
- **רצפת בטון מוקשחת:** 2,500 מ"ר
  - עובי: 20 ס"מ עם זיון
  - הקשחה עליונה באבקת קוורץ
  - חריטים לפעילויות ופרקים
  - עלות: ₪220 למ"ר × 2,500 = ₪550,000

### דלתות וחלונות

#### שערים תעשייתיים
- **שער הרמה ראשי:** 2 יחידות
  - מידות: 5m × 4.5m
  - מנגנון חשמלי + ניתוב מרוחק
  - עמידות מעבר כבדות
  - עלות: ₪25,000 × 2 = ₪50,000

- **שער הרמה משני:** 1 יחידה  
  - מידות: 3m × 3.5m
  - מנגנון חשמלי
  - עלות: ₪18,000 × 1 = ₪18,000

#### חלונות תעשייתיים
- **חלונות אלומיניום:** 240 מ"ר
  - זיגוג כפול עם בידוד תרמי
  - מסגרת אלומיניום מגולוונת
  - פתיחה חלקית לוויכטוח
  - עלות: ₪320 למ"ר × 240 = ₪76,800

## מערכות אינסטלציה

### מערכת חשמל ותאורה

#### חיבור חשמל ראשי
- **לוח חשמל ראשי:** 1 יחידה
  - הספק: 400 אמפר, 3 פאזות
  - כולל מונה ויחצפים
  - עלות: ₪35,000

- **כבלי חשמל ראשיים:** 200 מטר
  - כבל נחושת 4×240 מ"מ²
  - הנחת כבלים בצירה מאובטחת
  - עלות: ₪180 למטר × 200 = ₪36,000

#### מערכת תאורה LED
- **גופי תאורה LED תעשייתיים:** 50 יחידות
  - הספק: 150W לגוף
  - זרם: 19,500 לומן
  - IP65 לסביבה תעשייתית
  - עלות: ₪1,200 × 50 = ₪60,000

- **בקרת תאורה חכמה:** 1 מערכת
  - חיישני תפוסה והארדת
  - בקרה אלחותית ואטון
  - חיסכון אנרגיה 40%
  - עלות: ₪25,000

### מערכת אלחוטית ובטיחות

#### מערכת שליכה אולטימטיבית
- **משפטי מים:** 60 יחידות
  - כיסוי מלא לכל המבנה
  - לחץ מים 7 בר
  - עלות: ₪800 × 60 = ₪48,000

- **מרכזיית שרפות:** 1 מערכת
  - גילוי עשן ואש מתקדם
  - חיבור למח"ק כיבוי  אש
  - גיבוי טלפוני ואיתחד SMS
  - עלות: ₪45,000

#### מערכת איולרה וגישה
- **מצלמות אבטחה:** 12 יחידות
  - רזולוציה 4K עם ראיית לילה
  - כיסוי מלא פנים וחוץ
  - אחסון 30 ימים
  - עלות: ₪3,500 × 12 = ₪42,000

- **בקרת גישה:** 1 מערכת
  - כרטיסים מגנטיים
  - דקרון כניסה/יציאה
  - רשימת פרח עובדים
  - עלות: ₪15,000

### מערכת אוורור וקירור
- **מאיבוחי אוורור:** 8 יחידות
  - קיבולת: 10,000 מ"ק/שעה
  - בקרת מהירותים בימציונית
  - עלות: ₪4,500 × 8 = ₪36,000

- **מפעלי קירור נוסף:** 4 יחידות
  - למעות עבודה עם טמפרטורה נמוכה
  - קירור אבורטיבי
  - עלות: ₪8,000 × 4 = ₪32,000

## עבודות פיתוח שטח

### רצפה וכבישים סביב המבנה
- **רצפת בטון חיצונית:** 800 מ"ר
  - עובי: 15 ס"מ
  - למשאיות ומבוטח עמידה
  - עלות: ₪180 למ"ר × 800 = ₪144,000

### מערכות תשתית חיצוניות
- **מערכת ניקוז:** 150 מטר
  - צינורות PVC קוטר 200 מ"מ
  - כולל בורות שיקוע
  - עלות: ₪250 למטר × 150 = ₪37,500

- **חניית רכטסיה:** 20 מקומות
  - כולל תמרור וגפתות
  - עלות: ₪1,200 × 20 = ₪24,000

## סיכום כתב הכמויות הכולל

### עלויות עבודות בעתיבירה
1. עבודות עפר ויסודות: ₪695,000
2. מבנה גושף עיקרי: ₪2,442,200
3. דלתות, חלונות ושערים: ₪144,800
4. מערכות חשמל ותאורה: ₪156,000
5. מערכות בטיחות ואבטחה: ₪150,000
6. מערכות אוורור וקירור: ₪68,000
7. פיתוח שטח חיצוני: ₪205,500

### עלויות נוספות
- **ביטוח עבודה:** 1.5% מהעלות = ₪59,317
- **עמלת קבלן ראשי:** 12% = ₪474,542
- **הכנה והשגחה:** 3% = ₪118,635
- **עודף לאי צפוי:** 5% = ₪197,725

### סיכום כספי סופי
- **עלות ביצוע נטו:** ₪3,861,500
- **עלויות נוספות:** ₪850,219
- **סך הכל לפני מע"מ:** ₪4,711,719
- **מע"מ (17%):** ₪800,992
- **סך הכל כולל מע"מ:** ₪5,512,711

### לוח זמנים לביצוע
- שלב 1 (עבודות עפר): חודשים 1-2
- שלב 2 (יסודות ומבנה): חודשים 2-5  
- שלב 3 (מערכות): חודשים 5-7
- שלב 4 (גימורים): חודשים 7-8
- **סך הכל**: 8 חודשים
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
          <Button 
            variant="outline" 
            className="border-secondary text-secondary hover:bg-secondary/10"
            onClick={() => {
              console.log('Market Research button clicked with ID:', id);
              // Store the request ID in localStorage for context
              localStorage.setItem('currentRequestId', id.toString());
              // Navigate directly with the ID in the URL
              window.location.href = `/market-research/${id}`;
            }}
          >
            <Bot className="w-4 h-4 ml-2" />
            מחקר שוק
          </Button>
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
              {documents && Array.isArray(documents) && documents.length > 0 && (
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
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          <AIAnalysis requestId={request.id} specifications={request.specifications} />
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
                  <span className="text-2xl font-bold text-info">
                    {request.emf ? `₪${parseFloat(request.emf).toLocaleString()}` : 'לא צוין'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Estimated Cost Card */}
            <Card className="bg-card border-success/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">אומדן עלות</h3>
                  <p className="text-muted-foreground text-sm mb-3">אומדן שנוצר במערכת</p>
                  {request.estimatedCost ? (
                    <span className="text-2xl font-bold text-success">
                      ₪{parseFloat(request.estimatedCost).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xl text-muted-foreground">טרם נוצר</span>
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
                
                {documents && Array.isArray(documents) && documents.length > 0 && (
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
