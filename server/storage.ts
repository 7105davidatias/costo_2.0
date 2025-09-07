import type {
  User,
  InsertUser,
  ProcurementRequest,
  InsertProcurementRequest,
  Supplier,
  InsertSupplier,
  CostEstimation,
  InsertCostEstimation,
  SupplierQuote,
  InsertSupplierQuote,
  Document,
  InsertDocument,
  MarketInsight,
  InsertMarketInsight,
  ProcurementCategory,
  HistoricalProcurement
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Procurement Requests
  getProcurementRequests(): Promise<ProcurementRequest[]>;
  getProcurementRequest(id: number): Promise<ProcurementRequest | undefined>;
  createProcurementRequest(request: InsertProcurementRequest): Promise<ProcurementRequest>;
  updateProcurementRequest(id: number, request: Partial<InsertProcurementRequest>): Promise<ProcurementRequest | undefined>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;

  // Cost Estimations
  getCostEstimations(): Promise<CostEstimation[]>;
  getCostEstimation(id: number): Promise<CostEstimation | undefined>;
  getCostEstimationByRequestId(requestId: number): Promise<CostEstimation | undefined>;
  createCostEstimation(estimation: InsertCostEstimation): Promise<CostEstimation>;

  // Supplier Quotes
  getSupplierQuotes(): Promise<SupplierQuote[]>;
  getSupplierQuotesByRequestId(requestId: number): Promise<SupplierQuote[]>;
  createSupplierQuote(quote: InsertSupplierQuote): Promise<SupplierQuote>;

  // Documents
  getDocumentsByRequestId(requestId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;

  // Market Insights
  getMarketInsights(): Promise<MarketInsight[]>;
  getMarketInsightByCategory(category: string): Promise<MarketInsight | null>;
  createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight>;

  // Extracted Data Management
  saveExtractedData(requestId: number, data: any): Promise<void>;
  getExtractedData(requestId: number): Promise<{ data: any; extractionDate: Date; status: string } | null>;
  clearExtractedData(requestId: number): Promise<void>;

  // Procurement Categories methods
  getProcurementCategories(): Promise<ProcurementCategory[]>;
  getProcurementCategoryByCode(code: string): Promise<ProcurementCategory | null>;
  createProcurementCategory(data: Omit<ProcurementCategory, 'id' | 'createdAt'>): Promise<ProcurementCategory>;

  // Historical Procurements methods
  getHistoricalProcurements(): Promise<HistoricalProcurement[]>;
  getHistoricalProcurementsByCategoryCode(categoryCode: string): Promise<HistoricalProcurement[]>;
  getHistoricalProcurementsAnalytics(categoryCode?: string): Promise<{
    totalProcurements: number;
    averageCostVariance: number;
    averageDeliveryDays: number;
    successRate: number;
    topSuppliers: Array<{ supplier: string; count: number; avgVariance: number }>;
  }>;
  createHistoricalProcurement(data: Omit<HistoricalProcurement, 'id' | 'createdAt'>): Promise<HistoricalProcurement>;

  // Admin functions for demo reset
  resetAllRequestsStatus(): Promise<{ totalRequests: number; updatedRequests: number }>;
  resetAllCostEstimations(): Promise<{ totalEstimations: number; clearedEstimations: number }>;
  resetAllAIData(): Promise<{
    clearedEstimations: number;
    clearedExtractedData: number;
    clearedDocumentAnalysis: number;
    updatedRequests: number;
  }>;
  initializeTestData(): Promise<void>; // Added for test data initialization
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private procurementRequests = new Map<number, ProcurementRequest>();
  private suppliers = new Map<number, Supplier>();
  private costEstimations = new Map<number, CostEstimation>();
  private supplierQuotes = new Map<number, SupplierQuote>();
  private documents = new Map<number, Document>();
  private marketInsights = new Map<number, MarketInsight>();
  private extractedDataStore = new Map<number, any>();
  private procurementCategories = new Map<number, ProcurementCategory>();
  private historicalProcurements = new Map<number, HistoricalProcurement>();
  private currentId = 1;

  constructor() {
    this.initializeTestData();
  }

  async initializeTestData() {
    console.log('Starting to initialize test data...');

    // Clear existing data first
    this.procurementRequests.clear();
    this.costEstimations.clear();
    this.suppliers.clear();
    this.supplierQuotes.clear();
    this.documents.clear();
    this.marketInsights.clear();
    this.users.clear();
    this.procurementCategories.clear();
    this.historicalProcurements.clear();

    // Reset currentId
    this.currentId = 1;

    console.log('Creating test data...');

    // Create default user first
    const defaultUser: User = {
      id: this.currentId++,
      username: "admin",
      password: "admin123",
      displayName: "מנהל מערכת",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create procurement categories with rich data
    const categories: ProcurementCategory[] = [
      {
        id: this.currentId++,
        code: "IT-HW",
        name: "ציוד מחשוב וחומרה",
        baseMultiplier: "1.15",
        complexityFactor: "1.25",
        averageUnitCost: "4500",
        deliveryDaysMin: 7,
        deliveryDaysMax: 21,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        code: "IT-SW",
        name: "תוכנה ורישיונות",
        baseMultiplier: "1.08",
        complexityFactor: "1.10",
        averageUnitCost: "2800",
        deliveryDaysMin: 1,
        deliveryDaysMax: 14,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        code: "OFFICE",
        name: "ציוד משרדי וריהוט",
        baseMultiplier: "1.12",
        complexityFactor: "1.05",
        averageUnitCost: "1800",
        deliveryDaysMin: 14,
        deliveryDaysMax: 45,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        code: "VEHICLE",
        name: "רכבים וכלי תחבורה",
        baseMultiplier: "1.20",
        complexityFactor: "1.30",
        averageUnitCost: "95000",
        deliveryDaysMin: 30,
        deliveryDaysMax: 90,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        code: "CONSTRUCT",
        name: "עבודות בנייה ותשתיות",
        baseMultiplier: "1.35",
        complexityFactor: "1.50",
        averageUnitCost: "1200",
        deliveryDaysMin: 60,
        deliveryDaysMax: 365,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        code: "SECURITY",
        name: "מערכות אבטחה ובטיחות",
        baseMultiplier: "1.25",
        complexityFactor: "1.40",
        averageUnitCost: "180000",
        deliveryDaysMin: 21,
        deliveryDaysMax: 120,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        code: "SERVICES",
        name: "שירותים וייעוץ",
        baseMultiplier: "1.18",
        complexityFactor: "1.35",
        averageUnitCost: "450",
        deliveryDaysMin: 7,
        deliveryDaysMax: 180,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        code: "MATERIALS",
        name: "חומרי גלם וייצור",
        baseMultiplier: "1.10",
        complexityFactor: "1.15",
        averageUnitCost: "4200",
        deliveryDaysMin: 14,
        deliveryDaysMax: 60,
        createdAt: new Date(),
      }
    ];

    categories.forEach(category => this.procurementCategories.set(category.id, category));

    // Create rich historical procurement data
    const historicalData: HistoricalProcurement[] = [
      // IT Hardware historical data
      {
        id: this.currentId++,
        procurementId: "HIST-2023-001",
        categoryCode: "IT-HW",
        itemDescription: "מחשבים ניידים Dell Latitude 5520 - 30 יחידות",
        quantity: 30,
        finalCost: "135000",
        allocatedBudget: "140000",
        costVariancePct: "-3.57",
        supplierName: "TechSource Ltd",
        completionDate: new Date("2023-06-15"),
        technicalComplexity: "בינונית",
        createdAt: new Date("2023-06-15"),
      },
      {
        id: this.currentId++,
        procurementId: "HIST-2023-002",
        categoryCode: "IT-HW",
        itemDescription: "שרתי HP ProLiant DL380 - 2 יחידות",
        quantity: 2,
        finalCost: "89000",
        allocatedBudget: "95000",
        costVariancePct: "-6.32",
        supplierName: "Dell Technologies",
        completionDate: new Date("2023-08-22"),
        technicalComplexity: "גבוהה",
        createdAt: new Date("2023-08-22"),
      },
      {
        id: this.currentId++,
        procurementId: "HIST-2023-003",
        categoryCode: "OFFICE",
        itemDescription: "כסאות משרד ארגונומיים - 45 יחידות",
        quantity: 45,
        finalCost: "81000",
        allocatedBudget: "85000",
        costVariancePct: "-4.71",
        supplierName: "אמנון ריהוט משרדי",
        completionDate: new Date("2023-09-10"),
        technicalComplexity: "נמוכה",
        createdAt: new Date("2023-09-10"),
      },
      {
        id: this.currentId++,
        procurementId: "HIST-2023-004",
        categoryCode: "VEHICLE",
        itemDescription: "רכבי חלוקה Hyundai Porter - 5 יחידות",
        quantity: 5,
        finalCost: "475000",
        allocatedBudget: "500000",
        costVariancePct: "-5.00",
        supplierName: "סוכנות הונדה ישראל",
        completionDate: new Date("2023-10-05"),
        technicalComplexity: "בינונית",
        createdAt: new Date("2023-10-05"),
      },
      {
        id: this.currentId++,
        procurementId: "HIST-2023-005",
        categoryCode: "SECURITY",
        itemDescription: "מערכת אבטחת סייבר SOC מנוהל - שירות שנתי",
        quantity: 1,
        finalCost: "2350000",
        allocatedBudget: "2500000",
        costVariancePct: "-6.00",
        supplierName: "Check Point ישראל",
        completionDate: new Date("2023-11-15"),
        technicalComplexity: "מורכבת מאוד",
        createdAt: new Date("2023-11-15"),
      },
      {
        id: this.currentId++,
        procurementId: "HIST-2023-006",
        categoryCode: "SERVICES",
        itemDescription: "פיתוח מערכת ניהול משאבי אנוש",
        quantity: 1,
        finalCost: "945000",
        allocatedBudget: "1000000",
        costVariancePct: "-5.50",
        supplierName: "חברת פיתוח Alpha-Tech",
        completionDate: new Date("2023-12-20"),
        technicalComplexity: "גבוהה מאוד",
        createdAt: new Date("2023-12-20"),
      },
      {
        id: this.currentId++,
        procurementId: "HIST-2024-001",
        categoryCode: "CONSTRUCT",
        itemDescription: "בניית מחסן לוגיסטי - 1000 מ\"ר",
        quantity: 1000,
        finalCost: "1580000",
        allocatedBudget: "1650000",
        costVariancePct: "-4.24",
        supplierName: "חברת בנייה אלקטרה",
        completionDate: new Date("2024-01-30"),
        technicalComplexity: "גבוהה",
        createdAt: new Date("2024-01-30"),
      },
      {
        id: this.currentId++,
        procurementId: "HIST-2024-002",
        categoryCode: "MATERIALS",
        itemDescription: "חומרי גלם לייצור - פלדה ואלומיניום",
        quantity: 80,
        finalCost: "368000",
        allocatedBudget: "380000",
        costVariancePct: "-3.16",
        supplierName: "פלדמור - יבוא פלדה",
        completionDate: new Date("2024-02-14"),
        technicalComplexity: "בינונית",
        createdAt: new Date("2024-02-14"),
      },
      {
        id: this.currentId++,
        procurementId: "HIST-2024-003",
        categoryCode: "IT-SW",
        itemDescription: "רישיונות Microsoft Office 365 - 200 רישיונות",
        quantity: 200,
        finalCost: "560000",
        allocatedBudget: "580000",
        costVariancePct: "-3.45",
        supplierName: "Microsoft ישראל",
        completionDate: new Date("2024-03-05"),
        technicalComplexity: "נמוכה",
        createdAt: new Date("2024-03-05"),
      }
    ];

    historicalData.forEach(historical => this.historicalProcurements.set(historical.id, historical));

    // Create suppliers
    const suppliers: Supplier[] = [
      {
        id: this.currentId++,
        name: "TechSource Ltd",
        code: "TS",
        rating: "4.8",
        reliability: 98,
        deliveryTime: 10,
        discountPolicy: "5% מעל ₪150K",
        warrantyTerms: "3 שנים + תמיכה",
        isPreferred: true,
        contactInfo: { email: "sales@techsource.co.il", phone: "03-1234567" },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "Dell Technologies",
        code: "DT",
        rating: "4.9",
        reliability: 99,
        deliveryTime: 14,
        discountPolicy: "3% סטנדרט",
        warrantyTerms: "3 שנים",
        isPreferred: false,
        contactInfo: { email: "sales@dell.co.il", phone: "03-9876543" },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "CompuTrade",
        code: "CT",
        rating: "4.6",
        reliability: 85,
        deliveryTime: 12,
        discountPolicy: "2% סטנדרט",
        warrantyTerms: "2 שנים",
        isPreferred: false,
        contactInfo: { email: "info@computrade.co.il", phone: "03-5555555" },
        createdAt: new Date(),
      },
    ];

    suppliers.forEach(supplier => this.suppliers.set(supplier.id, supplier));

    // Create procurement requests
    const requests: ProcurementRequest[] = [
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-001",
        itemName: "מחשבים ניידים Dell Latitude 5520",
        description: "מחשבים ניידים לעובדי המשרד",
        category: "IT-HW",
        quantity: 25,
        priority: "medium",
        targetDate: new Date("2024-03-15"),
        requestedBy: "שרה לוי",
        department: "IT",
        status: "completed",
        emf: "130000", // EMF - התקציב המוקצה
        estimatedCost: "125000", // אומדן עלות שנוצר במערכת
        specifications: {
          processor: "Intel Core i5",
          memory: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6 FHD"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-002",
        itemName: "כסאות משרד ארגונומיים",
        description: "כסאות משרד איכותיים לעובדים",
        category: "OFFICE",
        quantity: 50,
        priority: "low",
        targetDate: new Date("2024-04-01"),
        requestedBy: "מיכל כהן",
        department: "משאבי אנוש",
        status: "processing",
        emf: "80000", // EMF - התקציב המוקצה
        estimatedCost: "75000", // אומדן עלות שנוצר במערכת
        specifications: {
          type: "ארגונומי",
          material: "בד נושם",
          adjustable: true,
          warranty: "5 שנים"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-003",
        itemName: "שרתי Dell PowerEdge R750",
        description: "שרתים עבור מרכז הנתונים",
        category: "IT-HW",
        quantity: 3,
        priority: "high",
        targetDate: new Date("2024-03-15"),
        requestedBy: "דוד לוי",
        department: "IT",
        status: "new",
        emf: "200000", // EMF - התקציב המוקצה
        estimatedCost: null, // אומדן עלות - עדיין לא נוצר
        specifications: {
          processor: "Intel Xeon Silver 4314 (16 cores)",
          memory: "64GB DDR4 ECC",
          storage: "2x 1TB NVMe SSD",
          network: "4x 1GbE + 2x 10GbE"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
      },
      // New diverse procurement requests for testing estimation methods
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-010",
        itemName: "פיתוח מערכת ניהול משאבי אנוש",
        description: "פיתוח מערכת ניהול משאבי אנוש מקיפה הכוללת ניהול עובדים, נוכחות, שכר, גיוס ופיתוח עובדים",
        category: "SERVICES",
        quantity: 1,
        priority: "medium",
        targetDate: new Date("2024-10-15"),
        requestedBy: "דני כהן",
        department: "משאבי אנוש",
        status: "new",
        emf: "1000000", // EMF - התקציב המוקצה
        estimatedCost: null, // אומדן עלות - עדיין לא נוצר
        specifications: {
          estimatedHours: 2400,
          teamSize: 6,
          duration: "8 חודשים",
          technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
          complexity: "גבוהה",
          riskLevel: "בינוני"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-011",
        itemName: "ייעוץ אסטרטגי לשיפור תהליכים",
        description: "ייעוץ אסטרטגי לשיפור תהליכים עסקיים ויעילות ארגונית",
        category: "SERVICES",
        quantity: 1,
        priority: "high",
        targetDate: new Date("2024-08-15"),
        requestedBy: "מיכל לוי",
        department: "הנהלה",
        status: "processing",
        emf: "650000", // EMF - התקציב המוקצה
        estimatedCost: "630000", // אומדן עלות שנוצר במערכת
        specifications: {
          deliverables: [
            "מיפוי תהליכים נוכחיים",
            "ניתוח פערים וזיהוי הזדמנויות",
            "תכנית יישום מפורטת",
            "הדרכה וליווי יישום"
          ],
          duration: "6 חודשים",
          consultantLevel: "senior",
          complexity: "גבוהה"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-26"),
        updatedAt: new Date("2024-01-26"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-012",
        itemName: "שירותי אבטחת מידע ו-SOC",
        description: "שירותי ניטור אבטחה 24/7, ניהול אירועי אבטחה ותגובה לאירועים",
        category: "SECURITY",
        quantity: 1,
        priority: "high",
        targetDate: new Date("2024-12-31"),
        requestedBy: "אבי רוזן",
        department: "IT",
        status: "processing",
        emf: "2500000", // EMF - התקציב המוקצה
        estimatedCost: "2400000", // אומדן עלות שנוצר במערכת
        specifications: {
          serviceLevel: "24/7",
          coverage: "מלא",
          responseTime: "15 דקות",
          duration: "12 חודשים",
          businessValue: "הגנה על נכסי מידע קריטיים"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-27"),
        updatedAt: new Date("2024-01-27"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-013",
        itemName: "תחזוקה שנתית למערכות IT",
        description: "תחזוקה מונעת ותיקונית למערכות IT, שרתים, רשת ותוכנות",
        category: "SERVICES",
        quantity: 1,
        priority: "medium",
        targetDate: new Date("2024-12-31"),
        requestedBy: "רונית ברק",
        department: "IT",
        status: "new",
        emf: "700000", // EMF - התקציב המוקצה
        estimatedCost: null, // אומדן עלות - עדיין לא נוצר
        specifications: {
          uncertainty: "גבוהה",
          variableFactors: ["כמות תקלות", "זמינות טכנאים", "מורכבות תיקונים"],
          duration: "12 חודשים",
          systemsCount: 45,
          estimates: {
            optimistic: 450000,
            mostLikely: 650000,
            pessimistic: 950000
          }
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-28"),
        updatedAt: new Date("2024-01-28"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-014",
        itemName: "רכש 50 מחשבי עבודה",
        description: "רכש 50 מחשבי עבודה למשרדי החברה החדשים",
        category: "OFFICE",
        quantity: 50,
        priority: "medium",
        targetDate: new Date("2024-06-15"),
        requestedBy: "יוסי אברהם",
        department: "משאבי אנוש",
        status: "processing",
        emf: "250000", // EMF - התקציב המוקצה
        estimatedCost: "225000", // אומדן עלות שנוצר במערכת
        specifications: {
          processor: "Intel i7 או AMD Ryzen 7",
          ram: "16GB",
          storage: "512GB SSD",
          graphics: "מובנה",
          warranty: "3 שנים"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-29"),
        updatedAt: new Date("2024-01-29"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-015",
        itemName: "רכש 10 רכבי צי",
        description: "רכש 10 רכבי מסחרי קלים לצי החברה",
        category: "VEHICLE",
        quantity: 10,
        priority: "medium",
        targetDate: new Date("2024-09-15"),
        requestedBy: "עמית שמעון",
        department: "לוגיסטיקה",
        status: "new",
        emf: "950000", // EMF - התקציב המוקצה
        estimatedCost: null, // אומדן עלות - עדיין לא נוצר
        specifications: {
          vehicleType: "מסחרי קל",
          engineSize: 1600,
          fuelType: "בנזין",
          cargoCapacity: 800,
          seatingCapacity: 2,
          expectedMileage: 100000
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-30"),
        updatedAt: new Date("2024-01-30"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-016",
        itemName: "בניית מחסן חדש",
        description: "בניית מחסן חדש בשטח 1000 מ\"ר",
        category: "CONSTRUCT",
        quantity: 1,
        priority: "high",
        targetDate: new Date("2024-12-15"),
        requestedBy: "שלמה כהן",
        department: "תפעול",
        status: "processing",
        emf: "1400000", // EMF - התקציב המוקצה
        estimatedCost: "1336000", // אומדן עלות שנוצר במערכת
        specifications: {
          area: 1000,
          height: 8,
          components: "עבודות עפר, יציקת בטון, מבנה פלדה, קירות וגגות, מערכות חשמל ואוורור",
          contingency: "15%"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-31"),
        updatedAt: new Date("2024-01-31"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-017",
        itemName: "רכש חומרי גלם לייצור",
        description: "רכש חומרי גלם לייצור רבעוני: פלדה, אלומיניום, פלסטיק",
        category: "MATERIALS",
        quantity: 80,
        priority: "medium",
        targetDate: new Date("2024-07-15"),
        requestedBy: "נועה גולד",
        department: "ייצור",
        status: "processing",
        emf: "350000", // EMF - התקציב המוקצה
        estimatedCost: "330000", // אומדן עלות שנוצר במערכת
        specifications: {
          materials: [
            { name: "פלדה", quantity: 50, unit: "טון", grade: "ST37" },
            { name: "אלומיניום", quantity: 20, unit: "טון", grade: "6061" },
            { name: "פלסטיק PVC", quantity: 10, unit: "טון", grade: "רגיל" }
          ]
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
      },
    ];

    requests.forEach(request => this.procurementRequests.set(request.id, request));

    // Create cost estimation
    const costEstimation: CostEstimation = {
      id: this.currentId++,
      procurementRequestId: 3,
      totalCost: "180000",
      basePrice: "165000",
      tax: "25800",
      shippingCost: "2400",
      discountAmount: "13200",
      confidenceLevel: 94,
      marketPrice: "205000",
      potentialSavings: "25000",
      justifications: [
        {
          variable: "מחיר יחידה בסיסי",
          value: "₪55,000",
          source: "מחירון Dell רשמי",
          confidence: 98,
          impact: "+₪165,000"
        },
        {
          variable: "הנחת כמות (3+ יחידות)",
          value: "8%",
          source: "מדיניות ספק",
          confidence: 85,
          impact: "-₪13,200"
        },
        {
          variable: "מע\"ם (17%)",
          value: "₪25,800",
          source: "חוק מע\"ם ישראל",
          confidence: 100,
          impact: "+₪25,800"
        },
        {
          variable: "עלויות הובלה והתקנה",
          value: "₪2,400",
          source: "אומדן על בסיס מרחק",
          confidence: 75,
          impact: "+₪2,400"
        }
      ],
      recommendedSupplierId: 1,
      aiAnalysisResults: {
        priceStability: 87,
        supplierReliability: 92,
        marketPosition: 78,
        savingsOpportunities: [
          "שקול רכישה בחודש מרץ - צפויה הנחה נוספת של 3-5%",
          "ספק מומלץ: TechSource - 98% דירוג שירות, 5% הנחה נוספת"
        ],
        riskAssessment: [
          "מחסור חזוי בשבבים ברבעון השני - מומלץ להזמין בהקדם"
        ]
      },
      createdAt: new Date(),
    };

    this.costEstimations.set(costEstimation.id, costEstimation);

    // Create sample documents
    const sampleDocuments: Document[] = [
      {
        id: this.currentId++,
        procurementRequestId: 1, // REQ-2024-001 - מחשבים ניידים
        fileName: "מפרט טכני - Dell Latitude 5520.pdf",
        fileType: "pdf",
        fileSize: 2457600, // 2.4 MB
        filePath: "/documents/tech_spec_dell_5520.pdf",
        isAnalyzed: true,
        analysisResults: {
          confidence: 95,
          extractedSpecs: {
            processor: "Intel Core i7-1165G7 (דור 11)",
            memory: "16GB DDR4-3200",
            storage: "SSD NVMe 512GB",
            display: "15.6 אינץ' Full HD (1920x1080)",
            graphics: "Intel Iris Xe Graphics",
            operatingSystem: "Windows 11 Pro",
            warranty: "3 שנים"
          }
        },
        extractedSpecs: {
          processor: "Intel Core i7-1165G7",
          memory: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6 FHD"
        },
        uploadedAt: new Date("2024-01-15"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 1, // REQ-2024-001 - מחשבים ניידים
        fileName: "תרשים רשת ותשתיות.pdf",
        fileType: "pdf",
        fileSize: 1887436, // 1.8 MB
        filePath: "/documents/network_diagram.pdf",
        isAnalyzed: true,
        analysisResults: {
          confidence: 88,
          networkRequirements: {
            connections: 25,
            bandwidth: "1Gbps",
            security: "WPA3",
            infrastructure: "existing"
          }
        },
        extractedSpecs: {
          networkType: "Ethernet + Wi-Fi",
          securityLevel: "Enterprise",
          supportLevel: "24/7"
        },
        uploadedAt: new Date("2024-01-15"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 3, // REQ-2024-003 - שרתי Dell PowerEdge
        fileName: "מפרט שרתי Dell PowerEdge R750.pdf",
        fileType: "pdf",
        fileSize: 3145728, // 3 MB
        filePath: "/documents/dell_r750_spec.pdf",
        isAnalyzed: true,
        analysisResults: {
          confidence: 97,
          extractedSpecs: {
            processor: "Intel Xeon Silver 4314 (16 cores)",
            memory: "64GB DDR4 ECC",
            storage: "2x 1TB NVMe SSD",
            network: "4x 1GbE + 2x 10GbE",
            powerSupply: "750W Redundant",
            rackSize: "2U"
          }
        },
        extractedSpecs: {
          serverType: "Rack Mount",
          redundancy: "High",
          managementInterface: "iDRAC9"
        },
        uploadedAt: new Date("2024-01-20"),
      }
    ];

    sampleDocuments.forEach(doc => this.documents.set(doc.id, doc));
    const moreEstimations: CostEstimation[] = [
      // For REQ-2024-001 (Dell Laptops)
      {
        id: this.currentId++,
        procurementRequestId: 1,
        totalCost: "125000",
        basePrice: "106800",
        tax: "18156",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 96,
        marketPrice: "135000",
        potentialSavings: "10000",
        estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        aiAnalysisResults: {
          reasoning: [
            { factor: "מחיר יחידה", impact: "סטנדרט", description: "₪4,272 ליחידה - תחרותי" },
            { factor: "זמינות", impact: "מעולה", description: "במלאי, משלוח מיידי" },
            { factor: "איכות ספק", impact: "גבוהה", description: "Dell - ספק מהימן" }
          ],
          sources: [
            { name: "מחירון Dell Israel", price: "₪125,000", date: "2024-01-15" },
            { name: "השוואת מחירים", price: "₪120,000-₪130,000", date: "2024-01-10" }
          ]
        },
        createdAt: new Date(),
      },
      // For REQ-2024-002 (Office Chairs)
      {
        id: this.currentId++,
        procurementRequestId: 2,
        totalCost: "75000",
        basePrice: "64100",
        tax: "10897",
        shippingCost: "103",
        discountAmount: "0",
        confidenceLevel: 89,
        marketPrice: "82000",
        potentialSavings: "7000",
        estimatedDelivery: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        aiAnalysisResults: {
          reasoning: [
            { factor: "מחיר יחידה", impact: "תחרותי", description: "₪1,282 ליחידה - מתחת לממוצע שוק" },
            { factor: "איכות", impact: "גבוהה", description: "כסאות ארגונומיים עם אחריות 5 שנים" },
            { factor: "זמן משלוח", impact: "ארוך", description: "4 שבועות - ייצור לפי הזמנה" }
          ],
          sources: [
            { name: "ספק ריהוט משרדי", price: "₪75,000", date: "2024-01-18" },
            { name: "מחקר שוק", price: "₪70,000-₪85,000", date: "2024-01-15" }
          ]
        },
        createdAt: new Date(),
      },
      // For REQ-2024-005 (Workstations)
      {
        id: this.currentId++,
        procurementRequestId: 5,
        totalCost: "165000",
        basePrice: "141000",
        tax: "23970",
        shippingCost: "300",
        discountAmount: "300",
        confidenceLevel: 92,
        marketPrice: "175000",
        potentialSavings: "10000",
        justifications: [
          {
            variable: "מחיר יחידה בסיסי",
            value: "₪28,200",
            source: "מחירון HP Z-Series Official Israel - עדכון 15/01/2024",
            confidence: 95,
            impact: "+₪141,000"
          },
          {
            variable: "הנחת כמות (5+ יחידות)",
            value: "₪300",
            source: "מדיניות ספק TechSource Ltd - הסכם שותפות מתאריך 10/01/2024",
            confidence: 90,
            impact: "-₪300"
          },
          {
            variable: "מע\"ם (17%)",
            value: "₪23,970",
            source: "חוק מע\"ם ישראל תשע\"ו-1975, סעיף 3א - שיעור סטנדרטי",
            confidence: 100,
            impact: "+₪23,970"
          },
          {
            variable: "עלויות הובלה והתקנה",
            value: "₪300",
            source: "מחירון שירותי הובלה DHL Israel - חישוב לפי משקל ומרחק",
            confidence: 85,
            impact: "+₪300"
          },
          {
            variable: "אחריות מורחבת",
            value: "₪0",
            source: "כלול במחיר - HP Care Pack 3 שנים סטנדרטי",
            confidence: 100,
            impact: "₪0"
          },
          {
            variable: "הנחת תשלום מקדים",
            value: "2%",
            source: "תנאי תשלום ספק - הנחה עבור תשלום תוך 10 ימים",
            confidence: 80,
            impact: "-₪2,820"
          }
        ],
        recommendedSupplierId: 1,
        aiAnalysisResults: {
          priceStability: 89,
          supplierReliability: 95,
          marketPosition: 82,
          savingsOpportunities: [
            "רכישה בחודש פברואר - הנחה נוספת של 2-4%",
            "ספק מומלץ: TechSource - 95% דירוג שירות"
          ],
          riskAssessment: [
            "מחירי GPU עשויים לעלות ברבעון השני - מומלץ להזמין מהר"
          ],
          reasoning: [
            { factor: "מחיר יחידה", impact: "תחרותי", description: "₪28,200 ליחידה - מחיר טוב לתחנת עבודה מתקדמת" },
            { factor: "ביצועים", impact: "מעולה", description: "Intel i7-13700K + RTX 4060 Ti - מתאים לעבודה גרפית" },
            { factor: "זמינות", impact: "טובה", description: "3-5 יום עסקים למשלוח" }
          ],
          sources: [
            { name: "מחירון HP Israel", price: "₪165,000", date: "2024-01-20" },
            { name: "השוואת מחירים", price: "₪160,000-₪170,000", date: "2024-01-18" }
          ]
        },
        createdAt: new Date(),
      },
      // Cost estimations for new diverse requests
      {
        id: this.currentId++,
        procurementRequestId: 10, // HR System Development
        totalCost: "960000",
        basePrice: "820512",
        tax: "139387",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 88,
        marketPrice: "1100000",
        potentialSavings: "140000",
        justifications: [
          {
            variable: "עלות פיתוח (2400 שעות)",
            value: "₪2,400 שעות × ₪350 ממוצע",
            source: "תעריפי שוק 2024 - חברות פיתוח ישראליות",
            confidence: 90,
            impact: "+₪840,000"
          },
          {
            variable: "הנחת פרויקט גדול",
            value: "2.5%",
            source: "מדיניות חברה לפרויקטים מעל ₪800K",
            confidence: 85,
            impact: "-₪21,000"
          }
        ],
        aiAnalysisResults: {
          reasoning: [
            { factor: "מורכבות פרויקט", impact: "גבוהה", description: "מערכת מקיפה עם אינטגרציות רבות" },
            { factor: "ניסיון צוות", impact: "טוב", description: "צוות מנוסה בפרויקטים דומים" },
            { factor: "זמן פיתוח", impact: "ריאלי", description: "8 חודשים - לוח זמנים הגיוני" }
          ],
          sources: [
            { name: "מחקר תעריפי פיתוח 2024", price: "₪960,000", date: "2024-01-25" },
            { name: "השוואת פרויקטים דומים", price: "₪900,000-₪1,200,000", date: "2024-01-20" }
          ]
        },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        procurementRequestId: 11, // Business Consulting
        totalCost: "630000",
        basePrice: "538461",
        tax: "91539",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 92,
        marketPrice: "720000",
        potentialSavings: "90000",
        justifications: [
          {
            variable: "מיפוי תהליכים",
            value: "₪150,000",
            source: "מחירון שירותי ייעוץ עסקי 2024",
            confidence: 95,
            impact: "+₪150,000"
          },
          {
            variable: "ניתוח פערים",
            value: "₪200,000",
            source: "תעריף סטנדרטי ליועצים senior",
            confidence: 90,
            impact: "+₪200,000"
          },
          {
            variable: "תכנית יישום",
            value: "₪100,000",
            source: "אומדן על בסיס היקף עבודה",
            confidence: 85,
            impact: "+₪100,000"
          },
          {
            variable: "הדרכה וליווי",
            value: "₪180,000",
            source: "מחיר שוק לשירותי ליווי יישום",
            confidence: 88,
            impact: "+₪180,000"
          }
        ],
        aiAnalysisResults: {
          reasoning: [
            { factor: "ערך עסקי", impact: "גבוה", description: "פוטנציאל לחיסכון משמעותי בתהליכים" },
            { factor: "מומחיות נדרשת", impact: "מתמחה", description: "דרוש יועץ senior עם ניסיון" },
            { factor: "משך פרויקט", impact: "סביר", description: "6 חודשים - זמן מתאים להיקף" }
          ],
          sources: [
            { name: "מחקר שכר יועצים 2024", price: "₪630,000", date: "2024-01-26" },
            { name: "השוואת פרויקטי ייעוץ", price: "₪580,000-₪750,000", date: "2024-01-20" }
          ]
        },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        procurementRequestId: 12, // Security Services
        totalCost: "2400000",
        basePrice: "2051282",
        tax: "348718",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 94,
        marketPrice: "2800000",
        potentialSavings: "400000",
        justifications: [
          {
            variable: "שירותי SOC 24/7",
            value: "₪150,000/חודש",
            source: "מחירון שירותי אבטחת מידע ישראל 2024",
            confidence: 98,
            impact: "+₪1,800,000"
          },
          {
            variable: "ניטור מתקדם",
            value: "₪25,000/חודש",
            source: "תוספת לכלים מתקדמים ו-AI",
            confidence: 90,
            impact: "+₪300,000"
          },
          {
            variable: "הכשרות צוות",
            value: "₪100,000",
            source: "הכשרת צוות פנימי לעבודה עם המערכת",
            confidence: 85,
            impact: "+₪100,000"
          }
        ],
        aiAnalysisResults: {
          reasoning: [
            { factor: "חיוניות שירות", impact: "קריטי", description: "הגנה על נכסי מידע של החברה" },
            { factor: "רמת שירות", impact: "מקצועי", description: "צוות מומחים זמין 24/7" },
            { factor: "ROI", impact: "גבוה", description: "מניעת נזקים פוטנציאליים במיליונים" }
          ],
          sources: [
            { name: "מחקר שוק אבטחת מידע 2024", price: "₪2,400,000", date: "2024-01-27" },
            { name: "השוואת ספקי SOC", price: "₪2,200,000-₪2,800,000", date: "2024-01-25" }
          ]
        },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        procurementRequestId: 13, // IT Maintenance
        totalCost: "650000",
        basePrice: "555555",
        tax: "94445",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 78,
        marketPrice: "750000",
        potentialSavings: "100000",
        justifications: [
          {
            variable: "אומדן אופטימי",
            value: "₪450,000",
            source: "במקרה של מעט תקלות ותחזוקה מונעת יעילה",
            confidence: 70,
            impact: "סיכוי 20%"
          },
          {
            variable: "אומדן הסביר ביותר",
            value: "₪650,000",
            source: "על בסיס ניסיון שנים קודמות וחיזוי עומס",
            confidence: 85,
            impact: "סיכוי 60%"
          },
          {
            variable: "אומדן פסימי",
            value: "₪950,000",
            source: "במקרה של תקלות חריגות ועדכוני מערכת מרובים",
            confidence: 75,
            impact: "סיכוי 20%"
          }
        ],
        aiAnalysisResults: {
          reasoning: [
            { factor: "אי-ודאות גבוהה", impact: "מורכב", description: "קשה לחזות כמות תקלות עתידיות" },
            { factor: "ניסיון היסטורי", impact: "חיובי", description: "נתונים מ-3 שנים אחרונית" },
            { factor: "גיוון סיכונים", impact: "בינוני", description: "שיטת 3 נקודות מפחיתה סיכון תקציבי" }
          ],
          sources: [
            { name: "היסטוריה תחזוקה 2021-2023", price: "₪650,000 ממוצע", date: "2024-01-28" },
            { name: "מחקר עלויות תחזוקה IT", price: "₪600,000-₪800,000", date: "2024-01-25" }
          ]
        },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        procurementRequestId: 14, // Desktop Computers
        totalCost: "225000",
        basePrice: "192307",
        tax: "32693",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 95,
        marketPrice: "240000",
        potentialSavings: "15000",
        justifications: [
          {
            variable: "מחיר יחידה",
            value: "₪4,500",
            source: "מחירון HP/Dell/Lenovo ישראל - ממוצע 3 ספקים",
            confidence: 98,
            impact: "+₪225,000"
          },
          {
            variable: "רכישה דומה 2023",
            value: "₪4,200/יחידה",
            source: "רכישה של 30 יחידות ביוני 2023",
            confidence: 95,
            impact: "השוואה היסטורית"
          },
          {
            variable: "מגמת מחירים",
            value: "עלייה של 5%",
            source: "מגמת שוק 2023-2024",
            confidence: 85,
            impact: "התאמת מחיר לשוק נוכחי"
          }
        ],
        aiAnalysisResults: {
          reasoning: [
            { factor: "מחיר תחרותי", impact: "טוב", description: "מחיר סביר בהשוואה לשוק" },
            { factor: "מפרט מתאים", impact: "מעולה", description: "מפרט עונה על כל הדרישות" },
            { factor: "זמינות ספק", impact: "גבוהה", description: "מלאי זמין אצל מספר ספקים" }
          ],
          sources: [
            { name: "מחירון ספקים רשמי", price: "₪225,000", date: "2024-01-29" },
            { name: "השוואת מחירי שוק", price: "₪220,000-₪240,000", date: "2024-01-25" }
          ]
        },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        procurementRequestId: 15, // Fleet Vehicles
        totalCost: "890000",
        basePrice: "760683",
        tax: "129317",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 92,
        marketPrice: "950000",
        potentialSavings: "60000",
        justifications: [
          {
            variable: "מחיר בסיס",
            value: "₪85,000/רכב",
            source: "מחירון יצרן רשמי לרכב מסחרי קל",
            confidence: 95,
            impact: "+₪850,000"
          },
          {
            variable: "תוספת מנוע 1600cc",
            value: "₪1,500/רכב",
            source: "מחירון אופציות יצרן",
            confidence: 90,
            impact: "+₪15,000"
          },
          {
            variable: "תוספת קיבולת משא",
            value: "₪2,500/רכב",
            source: "שיפור לקיבולת 800 ק\"ג",
            confidence: 85,
            impact: "+₪25,000"
          }
        ],
        aiAnalysisResults: {
          reasoning: [
            { factor: "מודל פרמטרי", impact: "מדויק", description: "אומדן מבוסס פרמטרים טכניים" },
            { factor: "ניסיון רכישות", impact: "חיובי", description: "נתוני רגרסיה מרכישות קודמות" },
            { factor: "מחיר שוק", impact: "תחרותי", description: "מחיר טוב יחסית לשוק" }
          ],
          sources: [
            { name: "מחירון יצרן רשמי", price: "₪890,000", date: "2024-01-30" },
            { name: "השוואת רכישות קודמות", price: "₪850,000-₪950,000", date: "2024-01-25" }
          ]
        },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        procurementRequestId: 16, // Warehouse Construction
        totalCost: "1336000",
        basePrice: "1143589",
        tax: "194411",
        shippingCost: "0",
        discountAmount: "2000",
        confidenceLevel: 89,
        marketPrice: "1450000",
        potentialSavings: "114000",
        justifications: [
          {
            variable: "עבודות עפר וביסוס",
            value: "₪120,000",
            source: "₪120/מ\"ר × 1000 מ\"ר",
            confidence: 95,
            impact: "+₪120,000"
          },
          {
            variable: "יציקת בטון",
            value: "₪90,000",
            source: "₪450/מ\"ק × 200 מ\"ק",
            confidence: 90,
            impact: "+₪90,000"
          },
          {
            variable: "מבנה פלדה",
            value: "₪680,000",
            source: "₪8,500/טון × 80 טון",
            confidence: 85,
            impact: "+₪680,000"
          },
          {
            variable: "קירות וגגות",
            value: "₪216,000",
            source: "₪180/מ\"ר × 1200 מ\"ר",
            confidence: 88,
            impact: "+₪216,000"
          },
          {
            variable: "מערכות חשמל",
            value: "₪150,000",
            source: "אומדן קבלן חשמל מוסמך",
            confidence: 80,
            impact: "+₪150,000"
          },
          {
            variable: "מערכות אוורור",
            value: "₪80,000",
            source: "אומדן קבלן מיזוג אוויר",
            confidence: 75,
            impact: "+₪80,000"
          }
        ],
        aiAnalysisResults: {
          reasoning: [
            { factor: "אומדן מלמטה למעלה", impact: "מדויק", description: "פירוק מפורט לרכיבים" },
            { factor: "מחירי שוק נוכחיים", impact: "עדכני", description: "מחירים מעודכנים ינואר 2024" },
            { factor: "מרווח ביטחון", impact: "נכלל", description: "15% מרווח לאירועים בלתי צפויים" }
          ],
          sources: [
            { name: "מחירון בנייה 2024", price: "₪1,336,000", date: "2024-01-31" },
            { name: "אומדן קבלנים", price: "₪1,300,000-₪1,400,000", date: "2024-01-30" }
          ]
        },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        procurementRequestId: 17, // Raw Materials
        totalCost: "330000",
        basePrice: "282051",
        tax: "47949",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 91,
        marketPrice: "350000",
        potentialSavings: "20000",
        justifications: [
          {
            variable: "פלדה ST37",
            value: "₪3,200/טון × 50 טון",
            source: "מחיר שוק נוכחי - ממוצע 3 ספקים",
            confidence: 95,
            impact: "+₪160,000"
          },
          {
            variable: "אלומיניום 6061",
            value: "₪8,500/טון × 20 טון",
            source: "מחיר בורסת מתכות + מרווח ספק",
            confidence: 90,
            impact: "+₪170,000"
          },
          {
            variable: "פלסטיק PVC",
            value: "₪4,200/טון × 10 טון",
            source: "מחיר יצרן + הובלה",
            confidence: 92,
            impact: "+₪42,000"
          }
        ],
        aiAnalysisResults: {
          reasoning: [
            { factor: "מחיר שוק נוכחי", impact: "יציב", description: "מחירים יציבים ב-3 חודשים אחרונים" },
            { factor: "זמינות חומרים", impact: "טובה", description: "מלאי זמין אצל ספקים מרובים" },
            { factor: "מגמת מחירים", impact: "חיובית", description: "צפייה ליציבות מחירים ברבעון הקרוב" }
          ],
          sources: [
            { name: "בורסת מתכות תל אביב", price: "₪330,000", date: "2024-02-01" },
            { name: "מחירון ספקי חומרי גלם", price: "₪320,000-₪340,000", date: "2024-01-30" }
          ]
        },
        createdAt: new Date(),
      }
    ];

    moreEstimations.forEach(estimation => this.costEstimations.set(estimation.id, estimation));

    // Create supplier quotes
    const quotes: SupplierQuote[] = [
      {
        id: this.currentId++,
        supplierId: 1,
        procurementRequestId: 3,
        unitPrice: "60500",
        totalPrice: "181500",
        deliveryTime: 10,
        validUntil: new Date("2024-02-28"),
        terms: "תשלום 30 יום נטו",
        discounts: { volumeDiscount: 5, earlyPayment: 2 },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        supplierId: 2,
        procurementRequestId: 3,
        unitPrice: "65000",
        totalPrice: "195000",
        deliveryTime: 14,
        validUntil: new Date("2024-02-28"),
        terms: "תשלום 45 יום נטו",
        discounts: { volumeDiscount: 3 },
        createdAt: new Date(),
      },
    ];

    quotes.forEach(quote => this.supplierQuotes.set(quote.id, quote));

    // Create market insight
    const marketInsight: MarketInsight = {
      id: this.currentId++,
      category: "IT-HW",
      averagePrice: "68300",
      priceStability: 87,
      supplierCount: 15,
      minPrice: "61500",
      maxPrice: "75000",
      riskAssessment: {
        supplyRisk: "low",
        priceVolatility: "medium",
        qualityRisk: "low",
        marketCompetition: "high"
      },
      priceHistory: [
        { month: "אוגוסט", price: 70000 },
        { month: "ספטמבר", price: 69500 },
        { month: "אוקטובר", price: 68800 },
        { month: "נובמבר", price: 68300 },
        { month: "דצמבר", price: 67900 },
        { month: "ינואר", price: 68300 }
      ],
      updatedAt: new Date(),
    };

    this.marketInsights.set(marketInsight.id, marketInsight);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Procurement Requests
  async getProcurementRequests(): Promise<ProcurementRequest[]> {
    return Array.from(this.procurementRequests.values());
  }

  async getProcurementRequest(id: number): Promise<ProcurementRequest | undefined> {
    return this.procurementRequests.get(id);
  }

  async createProcurementRequest(insertRequest: InsertProcurementRequest): Promise<ProcurementRequest> {
    const id = this.currentId++;
    const now = new Date();
    const request: ProcurementRequest = {
      ...insertRequest,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.procurementRequests.set(id, request);
    return request;
  }

  async updateProcurementRequest(id: number, updateData: Partial<InsertProcurementRequest>): Promise<ProcurementRequest | undefined> {
    const existing = this.procurementRequests.get(id);
    if (!existing) return undefined;

    const updated: ProcurementRequest = {
      ...existing,
      ...updateData,
      updatedAt: new Date()
    };
    this.procurementRequests.set(id, updated);
    return updated;
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentId++;
    const supplier: Supplier = { ...insertSupplier, id, createdAt: new Date() };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  // Cost Estimations
  async getCostEstimations(): Promise<CostEstimation[]> {
    return Array.from(this.costEstimations.values());
  }

  async getCostEstimation(id: number): Promise<CostEstimation | undefined> {
    return this.costEstimations.get(id);
  }

  async getCostEstimationByRequestId(requestId: number): Promise<CostEstimation | undefined> {
    return Array.from(this.costEstimations.values()).find(
      estimation => estimation.procurementRequestId === requestId
    );
  }

  async createCostEstimation(insertEstimation: InsertCostEstimation): Promise<CostEstimation> {
    const id = this.currentId++;
    const estimation: CostEstimation = { ...insertEstimation, id, createdAt: new Date() };
    this.costEstimations.set(id, estimation);
    return estimation;
  }

  // Supplier Quotes
  async getSupplierQuotes(): Promise<SupplierQuote[]> {
    return Array.from(this.supplierQuotes.values());
  }

  async getSupplierQuotesByRequestId(requestId: number): Promise<SupplierQuote[]> {
    return Array.from(this.supplierQuotes.values()).filter(
      quote => quote.procurementRequestId === requestId
    );
  }

  async createSupplierQuote(insertQuote: InsertSupplierQuote): Promise<SupplierQuote> {
    const id = this.currentId++;
    const quote: SupplierQuote = { ...insertQuote, id, createdAt: new Date() };
    this.supplierQuotes.set(id, quote);
    return quote;
  }

  // Documents
  async getDocumentsByRequestId(requestId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      doc => doc.procurementRequestId === requestId
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentId++;
    const document: Document = { ...insertDocument, id, uploadedAt: new Date() };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const existing = this.documents.get(id);
    if (!existing) return undefined;

    const updated: Document = { ...existing, ...updateData };
    this.documents.set(id, updated);
    return updated;
  }

  // Market Insights
  async getMarketInsights(): Promise<MarketInsight[]> {
    return Array.from(this.marketInsights.values());
  }

  async getMarketInsightByCategory(category: string): Promise<MarketInsight | null> {
    const insight = Array.from(this.marketInsights.values()).find(i => i.category === category);
    return insight || null;
  }

  async createMarketInsight(insertInsight: InsertMarketInsight): Promise<MarketInsight> {
    const id = this.currentId++;
    const insight: MarketInsight = { ...insertInsight, id, updatedAt: new Date() };
    this.marketInsights.set(id, insight);
    return insight;
  }

  // Extracted Data Management
  async saveExtractedData(requestId: number, data: any): Promise<void> {
    const request = this.procurementRequests.get(requestId);
    if (!request) {
      throw new Error('דרישת רכש לא נמצאה');
    }

    const updatedRequest: ProcurementRequest = {
      ...request,
      extractedData: data,
      extractionDate: new Date(),
      extractionStatus: "extracted",
      updatedAt: new Date()
    };

    this.procurementRequests.set(requestId, updatedRequest);
  }

  async getExtractedData(requestId: number): Promise<{ data: any; extractionDate: Date; status: string } | null> {
    const request = this.procurementRequests.get(requestId);
    if (!request || !request.extractedData || request.extractionStatus !== "extracted") {
      return null;
    }

    return {
      data: request.extractedData,
      extractionDate: request.extractionDate!,
      status: request.extractionStatus
    };
  }

  async clearExtractedData(requestId: number): Promise<void> {
    const request = this.procurementRequests.get(requestId);
    if (!request) {
      throw new Error('דרישת רכש לא נמצאה');
    }

    const updatedRequest: ProcurementRequest = {
      ...request,
      extractedData: null,
      extractionDate: null,
      extractionStatus: "not_extracted",
      updatedAt: new Date()
    };

    this.procurementRequests.set(requestId, updatedRequest);
  }

  // Procurement Categories methods
  async getProcurementCategories(): Promise<ProcurementCategory[]> {
    return Array.from(this.procurementCategories.values());
  }

  async getProcurementCategoryByCode(code: string): Promise<ProcurementCategory | null> {
    const category = Array.from(this.procurementCategories.values()).find(c => c.code === code);
    return category || null;
  }

  async createProcurementCategory(data: Omit<ProcurementCategory, 'id' | 'createdAt'>): Promise<ProcurementCategory> {
    const category: ProcurementCategory = {
      ...data,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.procurementCategories.set(category.id, category);
    return category;
  }

  // Historical Procurements methods
  async getHistoricalProcurements(): Promise<HistoricalProcurement[]> {
    return Array.from(this.historicalProcurements.values());
  }

  async getHistoricalProcurementsByCategoryCode(categoryCode: string): Promise<HistoricalProcurement[]> {
    return Array.from(this.historicalProcurements.values()).filter(h => h.categoryCode === categoryCode);
  }

  async getHistoricalProcurementsAnalytics(categoryCode?: string): Promise<{
    totalProcurements: number;
    averageCostVariance: number;
    averageDeliveryDays: number;
    successRate: number;
    topSuppliers: Array<{ supplier: string; count: number; avgVariance: number }>;
  }> {
    let historicals = Array.from(this.historicalProcurements.values());

    if (categoryCode) {
      historicals = historicals.filter(h => h.categoryCode === categoryCode);
    }

    const totalProcurements = historicals.length;

    if (totalProcurements === 0) {
      return {
        totalProcurements: 0,
        averageCostVariance: 0,
        averageDeliveryDays: 0,
        successRate: 0,
        topSuppliers: []
      };
    }

    const averageCostVariance = historicals.reduce((sum, h) => sum + parseFloat(h.costVariancePct || "0"), 0) / totalProcurements;

    // Calculate delivery days based on completion dates
    const averageDeliveryDays = 25; // Simplified calculation for now

    // Success rate based on cost variance (negative variance is better)
    const successfulProcurements = historicals.filter(h => parseFloat(h.costVariancePct || "0") <= 0).length;
    const successRate = (successfulProcurements / totalProcurements) * 100;

    // Top suppliers analysis
    const supplierStats = new Map<string, { count: number; totalVariance: number }>();

    historicals.forEach(h => {
      if (h.supplierName) {
        const current = supplierStats.get(h.supplierName) || { count: 0, totalVariance: 0 };
        current.count += 1;
        current.totalVariance += parseFloat(h.costVariancePct || "0");
        supplierStats.set(h.supplierName, current);
      }
    });

    const topSuppliers = Array.from(supplierStats.entries())
      .map(([supplier, stats]) => ({
        supplier,
        count: stats.count,
        avgVariance: stats.totalVariance / stats.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalProcurements,
      averageCostVariance,
      averageDeliveryDays,
      successRate,
      topSuppliers
    };
  }

  async createHistoricalProcurement(data: Omit<HistoricalProcurement, 'id' | 'createdAt'>): Promise<HistoricalProcurement> {
    const historical: HistoricalProcurement = {
      ...data,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.historicalProcurements.set(historical.id, historical);
    return historical;
  }

  // Reset all requests status for demo purposes
  async resetAllRequestsStatus(): Promise<{ totalRequests: number; updatedRequests: number }> {
    const totalRequests = this.procurementRequests.size;
    let updatedRequests = 0;

    // Manually update each request status to "new"
    const allRequests = Array.from(this.procurementRequests.values());
    console.log(`Starting reset of ${totalRequests} requests...`);

    for (const request of allRequests) {
      if (request.status !== "new") {
        console.log(`Updating request ${request.id} from ${request.status} to new`);
        request.status = "new";
        request.updatedAt = new Date();
        this.procurementRequests.set(request.id, request);
        updatedRequests++;
      }
    }

    console.log(`Demo reset completed: ${updatedRequests} requests updated out of ${totalRequests} total`);

    // Verify the changes
    const statusSummary: { [key: string]: number } = {};
    for (const request of this.procurementRequests.values()) {
      statusSummary[request.status] = (statusSummary[request.status] || 0) + 1;
    }
    console.log('Status summary after reset:', statusSummary);

    return { totalRequests, updatedRequests };
  }

  // Reset all cost estimates for demo purposes
  async resetAllCostEstimations(): Promise<{ totalEstimations: number; clearedEstimations: number }> {
    const totalEstimations = this.costEstimations.size;
    console.log(`Starting reset of ${totalEstimations} cost estimations...`);

    // Clear all cost estimations
    this.costEstimations.clear();

    // Also clear estimated costs from procurement requests
    let updatedRequests = 0;
    for (const [id, request] of this.procurementRequests.entries()) {
      if (request.estimatedCost) {
        request.estimatedCost = null;
        request.updatedAt = new Date();
        this.procurementRequests.set(id, request);
        updatedRequests++;
      }
    }

    console.log(`Cost estimations reset completed: ${totalEstimations} estimations cleared, ${updatedRequests} requests updated`);
    return { totalEstimations, clearedEstimations: totalEstimations };
  }

  // אפס את כל נתוני ה-AI והאומדנים במערכת
  async resetAllAIData(): Promise<{
    clearedEstimations: number;
    clearedExtractedData: number;
    clearedDocumentAnalysis: number;
    updatedRequests: number;
  }> {
    console.log('Starting comprehensive AI data reset...');

    // 1. נקה את כל האומדנים
    const totalEstimations = this.costEstimations.size;
    this.costEstimations.clear();

    // 2. נקה נתוני ניתוח AI מדרישות רכש
    let clearedExtractedData = 0;
    let updatedRequests = 0;

    for (const [id, request] of this.procurementRequests.entries()) {
      let updated = false;

      // נקה את הנתונים שחולצו
      if (request.extractedData) {
        request.extractedData = null;
        request.extractionDate = null;
        request.extractionStatus = 'not_extracted';
        clearedExtractedData++;
        updated = true;
      }

      // נקה את האומדן המחושב
      if (request.estimatedCost) {
        request.estimatedCost = null;
        updated = true;
      }

      // החזר את הסטטוס ל"חדש" אם הדרישה הושלמה או בעיבוד
      if (request.status === 'completed' || request.status === 'in_progress' || request.status === 'processing') {
        request.status = 'new';
        updated = true;
      }

      if (updated) {
        request.updatedAt = new Date();
        this.procurementRequests.set(id, request);
        updatedRequests++;
      }
    }

    // 3. נקה נתוני ניתוח מסמכים
    let clearedDocumentAnalysis = 0;

    for (const [id, document] of this.documents.entries()) {
      if (document.isAnalyzed || document.analysisResults || document.extractedSpecs) {
        document.isAnalyzed = false;
        document.analysisResults = null;
        document.extractedSpecs = null;
        this.documents.set(id, document);
        clearedDocumentAnalysis++;
      }
    }

    console.log(`AI data reset completed:`);
    console.log(`- ${totalEstimations} cost estimations cleared`);
    console.log(`- ${clearedExtractedData} extracted data entries cleared`);
    console.log(`- ${clearedDocumentAnalysis} document analyses cleared`);
    console.log(`- ${updatedRequests} procurement requests updated`);

    // הדפס סטטוסים של כל הדרישות לצורך ניפוי באגים
    console.log('Current request statuses:');
    for (const [id, request] of this.procurementRequests.entries()) {
      console.log(`  Request ${id}: ${request.status}`);
    }

    return {
      clearedEstimations: totalEstimations,
      clearedExtractedData,
      clearedDocumentAnalysis,
      updatedRequests
    };
  }
}

export const storage = new MemStorage();