
export interface DocumentTemplate {
  id: string;
  requestNumber: string;
  title: string;
  category: string;
  description: string;
  estimatedCost: string;
  quantity: number;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  specifications: Record<string, any>;
  metadata: {
    accuracy: number;
    complexity: 'simple' | 'medium' | 'complex';
    estimationMethod: string;
    lastUpdated: string;
    usageCount: number;
    averageSavings: string;
  };
  tags: string[];
  attachments?: string[];
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "TEMP-001",
    requestNumber: "REQ-2024-001",
    title: "מחשבים ניידים Dell Latitude 5520",
    category: "חומרה - מחשבים",
    description: "מחשבים ניידים לעובדי המשרד - תבנית סטנדרטית לרכישת ציוד IT בסיסי",
    estimatedCost: "130000",
    quantity: 25,
    department: "IT",
    priority: "medium",
    specifications: {
      processor: "Intel Core i5-1135G7",
      memory: "16GB DDR4",
      storage: "512GB SSD NVMe",
      display: "15.6\" FHD (1920x1080)",
      graphics: "Intel Iris Xe Graphics",
      connectivity: "Wi-Fi 6, Bluetooth 5.1, USB-C, HDMI",
      battery: "4-cell 65Wh",
      weight: "1.8 ק\"ג",
      os: "Windows 11 Pro",
      warranty: "3 שנות אחריות יצרן"
    },
    metadata: {
      accuracy: 96,
      complexity: "simple",
      estimationMethod: "Market-Based + Historical Data",
      lastUpdated: "2024-01-15",
      usageCount: 15,
      averageSavings: "7.5%"
    },
    tags: ["IT", "חומרה", "מחשבים", "משרד", "סטנדרטי"],
    attachments: ["spec_sheet_dell_latitude.pdf", "comparison_table.xlsx"]
  },
  
  {
    id: "TEMP-002", 
    requestNumber: "REQ-2024-003",
    title: "שרתי Dell PowerEdge R750",
    category: "חומרה - שרתים",
    description: "שרתים עבור מרכז הנתונים - תבנית לתשתית אינטרפרייז מתקדמת",
    estimatedCost: "200000",
    quantity: 3,
    department: "IT",
    priority: "high",
    specifications: {
      processor: "2x Intel Xeon Silver 4314 (16 cores each)",
      memory: "128GB DDR4 ECC (8x16GB)",
      storage: "4x 1TB NVMe SSD + 2x 4TB SATA HDD",
      network: "4x 1GbE + 2x 10GbE SFP+",
      powerSupply: "2x 750W Redundant Hot-Plug",
      rackSize: "2U",
      management: "iDRAC9 Enterprise",
      virtualization: "VMware vSphere Ready",
      raid: "PERC H755 Hardware RAID",
      warranty: "5 שנות ProSupport Plus"
    },
    metadata: {
      accuracy: 92,
      complexity: "complex",
      estimationMethod: "Parametric + Expert Judgment",
      lastUpdated: "2024-01-20",
      usageCount: 8,
      averageSavings: "12.3%"
    },
    tags: ["IT", "שרתים", "מרכז נתונים", "אינטרפרייז", "קריטי"],
    attachments: ["server_spec_detailed.pdf", "rack_layout.dwg", "power_requirements.xlsx"]
  },

  {
    id: "TEMP-003",
    requestNumber: "REQ-2024-010", 
    title: "פיתוח מערכת ניהול משאבי אנוש",
    category: "תוכנה ופיתוח",
    description: "מערכת HR מותאמת אישית - תבנית לפרויקטי פיתוח תוכנה מורכבים",
    estimatedCost: "1000000",
    quantity: 1,
    department: "משאבי אנוש",
    priority: "high",
    specifications: {
      modules: [
        "ניהול עובדים ופרטים אישיים",
        "מערכת נוכחות ושעות עבודה", 
        "ניהול חופשות ומחלות",
        "מערכת משכורות ותגמולים",
        "הערכות ביצועים ומטרות",
        "גיוס וקליטת עובדים",
        "הדרכות וקורסים"
      ],
      technology: "React + Node.js + PostgreSQL",
      users: "עד 500 משתמשים בו-זמנית",
      integration: "Active Directory, מערכת שכר קיימת",
      mobile: "אפליקציה ניידת iOS/Android",
      security: "הצפנה, אימות דו-שלבי, GDPR",
      hosting: "Cloud Native - AWS/Azure",
      development_time: "8-12 חודשים",
      team_size: "6-8 מפתחים + PM + QA"
    },
    metadata: {
      accuracy: 78,
      complexity: "complex",
      estimationMethod: "Bottom-Up + Three-Point Estimation",
      lastUpdated: "2024-01-25",
      usageCount: 3,
      averageSavings: "15.2%"
    },
    tags: ["תוכנה", "פיתוח", "HR", "מערכת מידע", "מותאם אישית"],
    attachments: ["requirements_document.pdf", "technical_architecture.pdf", "timeline_gantt.xlsx"]
  },

  {
    id: "TEMP-004",
    requestNumber: "REQ-2024-011",
    title: "ייעוץ אסטרטגי ארגוני",
    category: "שירותים מקצועיים", 
    description: "ייעוץ אסטרטגי ותכנון ארגוני - תבנית לשירותי ייעוץ חיצוניים",
    estimatedCost: "650000",
    quantity: 1,
    department: "הנהלה",
    priority: "medium",
    specifications: {
      scope: [
        "ניתוח מצב ארגוני קיים",
        "הגדרת חזון ואסטרטגיה",
        "מיפוי תהליכים עסקיים", 
        "המלצות לשיפור ואופטימיזציה",
        "תכנית יישום מפורטת",
        "הדרכת צוותי הנהלה"
      ],
      duration: "6 חודשים",
      team: [
        "יועץ ראשי בכיר (20 שנות ניסיון)",
        "2 יועצים זוטרים",
        "אנליסט עסקי"
      ],
      deliverables: [
        "דוח ניתוח מקיף (100+ עמודים)",
        "מצגות הנהלה (5 מצגות)",
        "תכניות עבודה מפורטות",
        "מודל עסקי מעודכן"
      ],
      methodology: "McKinsey 7S Framework + Lean Six Sigma",
      meetings: "פגישות שבועיות + workshop חודשי"
    },
    metadata: {
      accuracy: 75,
      complexity: "complex",
      estimationMethod: "Expert Judgment + Analogous",
      lastUpdated: "2024-01-28",
      usageCount: 2,
      averageSavings: "8.7%"
    },
    tags: ["ייעוץ", "אסטרטגיה", "הנהלה", "שירותים מקצועיים", "חיצוני"],
    attachments: ["proposal_template.pdf", "consultant_cv.pdf", "reference_projects.xlsx"]
  },

  {
    id: "TEMP-005",
    requestNumber: "REQ-2024-012",
    title: "שירותי אבטחת מידע SOC-I", 
    category: "אבטחת מידע",
    description: "שירותי SOC ומוקד אבטחה - תבנית לשירותי אבטחת סייבר מתקדמים",
    estimatedCost: "2500000",
    quantity: 1,
    department: "IT",
    priority: "urgent",
    specifications: {
      service_level: "24/7/365 Monitoring",
      coverage: [
        "ניטור אבטחה בזמן אמת",
        "ניתוח איומים מתקדמים",
        "תגובה לאירועי אבטחה",
        "חקירות פורנזיות דיגיטליות",
        "דוחות ביטחון שבועיים/חודשיים"
      ],
      technology: [
        "SIEM - Splunk Enterprise Security",
        "EDR - CrowdStrike Falcon", 
        "Network Monitoring - FireEye",
        "Vulnerability Management - Rapid7",
        "Threat Intelligence - Recorded Future"
      ],
      team: [
        "מנהל SOC (Security Manager)",
        "4 אנליסטי אבטחה L1",
        "2 אנליסטי אבטחה L2", 
        "1 חוקר פורנזי בכיר",
        "יועץ CISO חיצוני"
      ],
      sla: [
        "זמן תגובה ראשוני: 15 דקות",
        "זמן פתרון P1: 4 שעות",
        "זמן פתרון P2: 24 שעות", 
        "זמינות שירות: 99.9%"
      ],
      compliance: "ISO 27001, SOC 2 Type II, PCI DSS"
    },
    metadata: {
      accuracy: 85,
      complexity: "complex",
      estimationMethod: "Market-Based + RFP Analysis",
      lastUpdated: "2024-02-01",
      usageCount: 1,
      averageSavings: "18.5%"
    },
    tags: ["אבטחה", "SOC", "ניטור", "סייבר", "24/7"],
    attachments: ["soc_service_agreement.pdf", "technology_stack.pdf", "compliance_checklist.xlsx"]
  },

  {
    id: "TEMP-006",
    requestNumber: "REQ-2024-013",
    title: "תחזוקה שנתית מערכות IT",
    category: "שירותי תחזוקה",
    description: "חוזה תחזוקה מקיף למערכות IT - תבנית לשירותי תחזוקה שוטפים",
    estimatedCost: "700000", 
    quantity: 1,
    department: "IT",
    priority: "medium",
    specifications: {
      scope: [
        "תחזוקה מונעת חודשית",
        "תמיכה טכנית 24/7",
        "עדכוני תוכנה ואבטחה",
        "גיבויים ושחזור נתונים",
        "ניטור פרואקטיבי",
        "החלפת חלקי חילוף"
      ],
      covered_systems: [
        "50 שרתים פיזיים ווירטואליים",
        "200 תחנות עבודה",
        "מערכות רשת ותקשורת", 
        "מערכות אחסון ונתונים",
        "מערכות אבטחה ובקרה"
      ],
      response_times: [
        "קריטי (P1): 2 שעות",
        "גבוה (P2): 4 שעות",
        "בינוני (P3): 8 שעות",
        "נמוך (P4): 24 שעות"
      ],
      included_services: [
        "חלקי חילוף ללא עלות נוספת",
        "עדכוני תוכנה מורשים",
        "דוחות ביצועים חודשיים",
        "תכנון קיבולת ושדרוגים"
      ],
      excluded: [
        "נזקי מים/אש/גניבה",
        "שדרוגי חומרה מהותיים",
        "פיתוח תוכנה מותאמת"
      ]
    },
    metadata: {
      accuracy: 89,
      complexity: "medium",
      estimationMethod: "Historical Data + Three-Point",
      lastUpdated: "2024-02-03",
      usageCount: 12,
      averageSavings: "11.2%"
    },
    tags: ["תחזוקה", "IT", "שירות", "תמיכה", "שנתי"],
    attachments: ["maintenance_agreement.pdf", "asset_inventory.xlsx", "sla_matrix.pdf"]
  },

  {
    id: "TEMP-007",
    requestNumber: "REQ-2024-014",
    title: "50 מחשבי עבודה משרדיים",
    category: "חומרה - מחשבים",
    description: "מחשבי עבודה סטנדרטיים למשרד - תבנית לרכישה בכמויות גדולות",
    estimatedCost: "250000",
    quantity: 50,
    department: "משאבי אנוש",
    priority: "medium",
    specifications: {
      cpu: "Intel Core i5-12400 6-Core",
      memory: "16GB DDR4-3200",
      storage: "512GB SSD NVMe",
      graphics: "Intel UHD Graphics 730",
      motherboard: "Business Grade with TPM 2.0",
      case: "Compact Desktop Form Factor",
      connectivity: [
        "Wi-Fi 6 802.11ax",
        "Bluetooth 5.2",
        "Gigabit Ethernet",
        "6x USB (4x USB-A, 2x USB-C)",
        "HDMI + DisplayPort"
      ],
      peripherals: [
        "מקלדת ועכבר אלחוטיים",
        "מסך 24\" FHD IPS",
        "רמקול משולב",
        "מצלמת HD לוועידות וידאו"
      ],
      software: [
        "Windows 11 Pro",
        "Microsoft Office 365",
        "אנטי-וירוס מתקדם",
        "כלי ניהול מרחוק"
      ],
      warranty: "3 שנות אחריות מלאה + תמיכה באתר"
    },
    metadata: {
      accuracy: 94,
      complexity: "simple",
      estimationMethod: "Market-Based + Volume Discount",
      lastUpdated: "2024-02-05",
      usageCount: 8,
      averageSavings: "9.8%"
    },
    tags: ["IT", "מחשבים", "משרד", "כמות גדולה", "סטנדרטי"],
    attachments: ["bulk_quote.pdf", "delivery_schedule.xlsx", "setup_guide.pdf"]
  }
];

// פונקציות עזר לעבודה עם תבניות
export const getTemplateById = (id: string): DocumentTemplate | undefined => {
  return documentTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): DocumentTemplate[] => {
  return documentTemplates.filter(template => template.category === category);
};

export const getTemplatesByDepartment = (department: string): DocumentTemplate[] => {
  return documentTemplates.filter(template => template.department === department);
};

export const getTemplatesByTag = (tag: string): DocumentTemplate[] => {
  return documentTemplates.filter(template => template.tags.includes(tag));
};

export const getPopularTemplates = (limit: number = 5): DocumentTemplate[] => {
  return documentTemplates
    .sort((a, b) => b.metadata.usageCount - a.metadata.usageCount)
    .slice(0, limit);
};

export const searchTemplates = (query: string): DocumentTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return documentTemplates.filter(template => 
    template.title.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// קטגוריות זמינות
export const categories = [
  "חומרה - מחשבים",
  "חומרה - שרתים", 
  "תוכנה ופיתוח",
  "שירותים מקצועיים",
  "אבטחת מידע",
  "שירותי תחזוקה"
];

// מחלקות זמינות
export const departments = [
  "IT",
  "משאבי אנוש",
  "הנהלה",
  "כספים",
  "תפעול"
];
