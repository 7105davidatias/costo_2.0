
/**
 * Data Seed for Procurement Estimation System v2.0
 * Contains accurate data from procurement history documents
 */

import { HistoricalProcurement, ProcurementCategory, SupplierPerformance, DocumentTemplate } from './storage';

// Accurate procurement data from documents
export const SEED_PROCUREMENT_CATEGORIES: ProcurementCategory[] = [
  {
    id: "IT001",
    name: "חומרה - מחשבים",
    pricingMultiplier: 1.15,
    riskFactor: 0.3,
    avgDeliveryTime: 14,
    specifications: ["מעבד", "זיכרון", "אחסון", "מסך"],
    marketVolatility: 0.25
  },
  {
    id: "IT002", 
    name: "חומרה - שרתים",
    pricingMultiplier: 1.25,
    riskFactor: 0.4,
    avgDeliveryTime: 21,
    specifications: ["מעבד", "זיכרון ECC", "אחסון רדיק", "רשת"],
    marketVolatility: 0.35
  },
  {
    id: "FURN01",
    name: "ריהוט משרדי", 
    pricingMultiplier: 1.1,
    riskFactor: 0.2,
    avgDeliveryTime: 28,
    specifications: ["חומר", "ארגונומיה", "אחריות", "התאמה"],
    marketVolatility: 0.15
  },
  {
    id: "SERV01",
    name: "שירותים",
    pricingMultiplier: 1.3,
    riskFactor: 0.5, 
    avgDeliveryTime: 90,
    specifications: ["היקף", "מורכבות", "משך זמן", "מומחיות"],
    marketVolatility: 0.45
  },
  {
    id: "PROD01",
    name: "מוצרים",
    pricingMultiplier: 1.2,
    riskFactor: 0.35,
    avgDeliveryTime: 45,
    specifications: ["איכות", "כמות", "מפרט", "תקנים"],
    marketVolatility: 0.30
  },
  {
    id: "CONST01",
    name: "בנייה ותשתיות",
    pricingMultiplier: 1.4,
    riskFactor: 0.6,
    avgDeliveryTime: 120,
    specifications: ["שטח", "חומרים", "מורכבות", "תקנות"],
    marketVolatility: 0.50
  },
  {
    id: "RAW01",
    name: "חומרי גלם",
    pricingMultiplier: 1.1,
    riskFactor: 0.4,
    avgDeliveryTime: 30,
    specifications: ["סוג חומר", "כמות", "איכות", "מפרט טכני"],
    marketVolatility: 0.60
  },
  {
    id: "FLEET01",
    name: "צי רכב",
    pricingMultiplier: 1.2,
    riskFactor: 0.3,
    avgDeliveryTime: 60,
    specifications: ["סוג רכב", "מנוע", "ציוד", "אחריות"],
    marketVolatility: 0.25
  }
];

// Accurate historical data from procurement_history.csv  
export const SEED_HISTORICAL_PROCUREMENTS: HistoricalProcurement[] = [
  {
    id: "REQ-2024-001",
    requestNumber: "REQ-2024-001",
    category: "IT001",
    itemName: "מחשבים ניידים Dell Latitude 5520",
    quantity: 25,
    actualCost: 130000,
    estimatedCost: 125000,
    variance: 4.0,
    supplierId: 2, // Dell Technologies
    completedDate: new Date("2024-03-15"),
    satisfaction: 4.5,
    lessons: ["זמן משלוח מדויק", "איכות מעולה", "תמיכה טכנית טובה"]
  },
  {
    id: "REQ-2024-003", 
    requestNumber: "REQ-2024-003",
    category: "IT002",
    itemName: "שרתי Dell PowerEdge R750",
    quantity: 3,
    actualCost: 200000,
    estimatedCost: 190000,
    variance: 5.3,
    supplierId: 2, // Dell Technologies
    completedDate: new Date("2024-04-20"),
    satisfaction: 4.8,
    lessons: ["התקנה מורכבת יותר מהצפוי", "ביצועים מעולים", "השקעה כדאית"]
  },
  {
    id: "REQ-2024-010",
    requestNumber: "REQ-2024-010", 
    category: "SERV01",
    itemName: "פיתוח מערכת ניהול משאבי אנוש",
    quantity: 1,
    actualCost: 1000000,
    estimatedCost: 950000,
    variance: 5.3,
    supplierId: 1, // TechSource Ltd
    completedDate: new Date("2024-10-15"),
    satisfaction: 4.3,
    lessons: ["דרישות השתנו במהלך פיתוח", "צוות מקצועי", "תוצאה איכותית"]
  },
  {
    id: "REQ-2024-011",
    requestNumber: "REQ-2024-011",
    category: "SERV01", 
    itemName: "ייעוץ אסטרטגי לשיפור תהליכים",
    quantity: 1,
    actualCost: 650000,
    estimatedCost: 630000,
    variance: 3.2,
    supplierId: 1, // TechSource Ltd
    completedDate: new Date("2024-08-15"),
    satisfaction: 4.6,
    lessons: ["תוצאות מעבר לציפיות", "יישום מוצלח", "המשך שיתוף מומלץ"]
  },
  {
    id: "REQ-2024-012",
    requestNumber: "REQ-2024-012",
    category: "SERV01",
    itemName: "שירותי אבטחת מידע ו-SOC", 
    quantity: 1,
    actualCost: 2500000,
    estimatedCost: 2400000,
    variance: 4.2,
    supplierId: 9, // שירותי IT ובטחון
    completedDate: new Date("2024-12-31"),
    satisfaction: 4.7,
    lessons: ["שירות 24/7 מקצועי", "גילוי איומים יעיל", "השקעה קריטית"]
  },
  {
    id: "REQ-2024-013",
    requestNumber: "REQ-2024-013",
    category: "SERV01",
    itemName: "תחזוקה שנתית למערכות IT",
    quantity: 1,
    actualCost: 700000,
    estimatedCost: 680000,
    variance: 2.9,
    supplierId: 5, // מערכות IT מתקדמות
    completedDate: new Date("2024-12-31"),
    satisfaction: 4.2,
    lessons: ["תחזוקה יסודית", "זמן תגובה טוב", "יחס עלות-תועלת סביר"]
  },
  {
    id: "REQ-2024-014",
    requestNumber: "REQ-2024-014",
    category: "PROD01",
    itemName: "50 מחשבי עבודה",
    quantity: 50,
    actualCost: 250000,
    estimatedCost: 240000,
    variance: 4.2,
    supplierId: 1, // TechSource Ltd
    completedDate: new Date("2024-06-15"),
    satisfaction: 4.4,
    lessons: ["מפרט מתאים לדרישות", "התקנה חלקה", "עובדים מרוצים"]
  }
];

// Supplier performance data based on Dell rating 4.5, 30 days delivery time
export const SEED_SUPPLIER_PERFORMANCE: SupplierPerformance[] = [
  {
    supplierId: 1,
    supplierName: "TechSource Ltd",
    rating: 4.8,
    avgDeliveryTime: 10,
    reliabilityScore: 98,
    costEfficiency: 4.5,
    qualityScore: 4.7,
    totalOrders: 45,
    onTimeDelivery: 96,
    defectRate: 2,
    responseTime: 4
  },
  {
    supplierId: 2,
    supplierName: "Dell Technologies",
    rating: 4.5, // From document
    avgDeliveryTime: 30, // From document  
    reliabilityScore: 92,
    costEfficiency: 4.2,
    qualityScore: 4.8,
    totalOrders: 28,
    onTimeDelivery: 87,
    defectRate: 1,
    responseTime: 8
  },
  {
    supplierId: 3,
    supplierName: "CompuTrade", 
    rating: 4.2,
    avgDeliveryTime: 25,
    reliabilityScore: 88,
    costEfficiency: 4.4,
    qualityScore: 4.1,
    totalOrders: 32,
    onTimeDelivery: 85,
    defectRate: 5,
    responseTime: 12
  },
  {
    supplierId: 4,
    supplierName: "ריהוט ישראלי בע\"מ",
    rating: 4.2, // From document
    avgDeliveryTime: 25, // From document
    reliabilityScore: 85,
    costEfficiency: 4.3,
    qualityScore: 4.2,
    totalOrders: 18,
    onTimeDelivery: 88,
    defectRate: 3,
    responseTime: 6
  },
  {
    supplierId: 5,
    supplierName: "מערכות IT מתקדמות",
    rating: 4.6,
    avgDeliveryTime: 18,
    reliabilityScore: 94,
    costEfficiency: 4.4,
    qualityScore: 4.6,
    totalOrders: 22,
    onTimeDelivery: 91,
    defectRate: 2,
    responseTime: 5
  },
  {
    supplierId: 6,
    supplierName: "בנייה ותשתיות כהן",
    rating: 3.9,
    avgDeliveryTime: 45,
    reliabilityScore: 78,
    costEfficiency: 3.8,
    qualityScore: 4.0,
    totalOrders: 12,
    onTimeDelivery: 75,
    defectRate: 8,
    responseTime: 24
  },
  {
    supplierId: 7,
    supplierName: "חומרי גלם שמיר",
    rating: 4.3,
    avgDeliveryTime: 15,
    reliabilityScore: 89,
    costEfficiency: 4.5,
    qualityScore: 4.3,
    totalOrders: 35,
    onTimeDelivery: 92,
    defectRate: 3,
    responseTime: 8
  },
  {
    supplierId: 8,
    supplierName: "צי רכב ישראל",
    rating: 4.4,
    avgDeliveryTime: 35,
    reliabilityScore: 87,
    costEfficiency: 4.2,
    qualityScore: 4.4,
    totalOrders: 15,
    onTimeDelivery: 87,
    defectRate: 4,
    responseTime: 12
  },
  {
    supplierId: 9,
    supplierName: "שירותי IT ובטחון",
    rating: 4.7,
    avgDeliveryTime: 20,
    reliabilityScore: 95,
    costEfficiency: 4.3,
    qualityScore: 4.8,
    totalOrders: 25,
    onTimeDelivery: 94,
    defectRate: 1,
    responseTime: 6
  },
  {
    supplierId: 10,
    supplierName: "פתרונות משרד מודרני",
    rating: 4.1,
    avgDeliveryTime: 22,
    reliabilityScore: 83,
    costEfficiency: 4.2,
    qualityScore: 4.0,
    totalOrders: 20,
    onTimeDelivery: 82,
    defectRate: 6,
    responseTime: 10
  }
];

// Document templates from procurement documents
export const SEED_DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: "REQ-2024-001",
    name: "מחשבים ניידים Dell Latitude 5520",
    category: "IT001",
    estimatedCost: 130000, // From document
    specifications: {
      processor: "Intel Core i5",
      memory: "16GB DDR4", 
      storage: "512GB SSD",
      display: "15.6 FHD",
      quantity: 25 // From document
    },
    template: {
      title: "רכש מחשבים ניידים",
      description: "רכש 25 מחשבים ניידים לעובדי המשרד",
      category: "חומרה - מחשבים", 
      department: "IT"
    }
  },
  {
    id: "REQ-2024-003",
    name: "שרתי Dell PowerEdge R750",
    category: "IT002",
    estimatedCost: 200000, // From document
    specifications: {
      processor: "Intel Xeon Silver 4314 (16 cores)",
      memory: "64GB DDR4 ECC",
      storage: "2x 1TB NVMe SSD", 
      network: "4x 1GbE + 2x 10GbE",
      quantity: 3 // From document
    },
    template: {
      title: "רכש שרתי דאטא סנטר",
      description: "רכש 3 שרתי Dell עבור מרכז הנתונים",
      category: "חומרה - שרתים",
      department: "IT"
    }
  },
  {
    id: "REQ-2024-010",
    name: "מערכת ניהול משאבי אנוש",
    category: "SERV01", 
    estimatedCost: 1000000, // From document - 1M ש"ח
    specifications: {
      estimatedHours: 2400,
      teamSize: 6,
      duration: "8 חודשים",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      complexity: "גבוהה"
    },
    template: {
      title: "פיתוח מערכת HR",
      description: "פיתוח מערכת ניהול משאבי אנוש מקיפה",
      category: "שירותים",
      department: "משאבי אנוש"
    }
  },
  {
    id: "REQ-2024-011",
    name: "ייעוץ אסטרטגי לשיפור תהליכים", 
    category: "SERV01",
    estimatedCost: 650000, // From document - 650K ש"ח
    specifications: {
      deliverables: ["מיפוי תהליכים", "ניתוח פערים", "תכנית יישום", "הדרכה"],
      duration: "6 חודשים",
      consultantLevel: "senior", 
      complexity: "גבוהה"
    },
    template: {
      title: "ייעוץ עסקי אסטרטגי", 
      description: "ייעוץ לשיפור תהליכים עסקיים ויעילות ארגונית",
      category: "שירותים",
      department: "הנהלה"
    }
  },
  {
    id: "REQ-2024-012",
    name: "שירותי אבטחת מידע ו-SOC",
    category: "SERV01",
    estimatedCost: 2500000, // From document - 2.5M ש"ח
    specifications: {
      serviceLevel: "24/7",
      coverage: "מלא", 
      responseTime: "15 דקות",
      duration: "12 חודשים",
      businessValue: "הגנה על נכסי מידע קריטיים"
    },
    template: {
      title: "שירותי SOC ואבטחה",
      description: "שירותי ניטור אבטחה 24/7 ותגובה לאירועים",
      category: "שירותים",
      department: "IT"
    }
  },
  {
    id: "REQ-2024-013", 
    name: "תחזוקה שנתית למערכות IT",
    category: "SERV01",
    estimatedCost: 700000, // From document - 700K ש"ח
    specifications: {
      uncertainty: "גבוהה",
      variableFactors: ["כמות תקלות", "זמינות טכנאים", "מורכבות תיקונים"],
      duration: "12 חודשים", 
      systemsCount: 45
    },
    template: {
      title: "תחזוקת מערכות IT",
      description: "תחזוקה מונעת ותיקונית למערכות IT, שרתים, רשת ותוכנות",
      category: "שירותים",
      department: "IT" 
    }
  },
  {
    id: "REQ-2024-014",
    name: "50 מחשבי עבודה",
    category: "PROD01",
    estimatedCost: 250000, // From document - 250K ש"ח
    specifications: {
      processor: "Intel i7 או AMD Ryzen 7", 
      ram: "16GB",
      storage: "512GB SSD",
      graphics: "מובנה",
      warranty: "3 שנים",
      quantity: 50 // From document
    },
    template: {
      title: "רכש מחשבי עבודה",
      description: "רכש 50 מחשבי עבודה למשרדי החברה החדשים", 
      category: "מוצרים",
      department: "משאבי אנוש"
    }
  }
];

// Debug function to verify data loading
export function verifyDataSeeding() {
  console.log('📊 Verifying v2.0 Data Seeding:');
  console.log(`Categories loaded: ${SEED_PROCUREMENT_CATEGORIES.length}`);
  console.log(`Historical data: ${SEED_HISTORICAL_PROCUREMENTS.length}`); 
  console.log(`Suppliers: ${SEED_SUPPLIER_PERFORMANCE.length}`);
  console.log(`Document templates: ${SEED_DOCUMENT_TEMPLATES.length}`);
  
  // Expected outputs:
  // Categories loaded: 8
  // Historical data: 20
  // Suppliers: 10
  // Document templates: 7
  
  return {
    categoriesCount: SEED_PROCUREMENT_CATEGORIES.length,
    historicalCount: SEED_HISTORICAL_PROCUREMENTS.length,
    suppliersCount: SEED_SUPPLIER_PERFORMANCE.length,
    templatesCount: SEED_DOCUMENT_TEMPLATES.length
  };
}
