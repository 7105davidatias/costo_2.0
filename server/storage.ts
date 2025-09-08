import {
  users, suppliers, procurementRequests, costEstimations,
  supplierQuotes, documents, marketInsights,
  type User, type InsertUser, type ProcurementRequest, type InsertProcurementRequest,
  type Supplier, type InsertSupplier, type CostEstimation, type InsertCostEstimation,
  type SupplierQuote, type InsertSupplierQuote, type Document, type InsertDocument,
  type MarketInsight, type InsertMarketInsight
} from "@shared/schema";

// טיפוסי נתונים חדשים למערכת v2.0
export interface ProcurementCategory {
  id: string;
  name: string;
  pricingMultiplier: number;
  riskFactor: number;
  avgDeliveryTime: number;
  specifications: string[];
  marketVolatility: number;
}

export interface HistoricalProcurement {
  id: string;
  requestNumber: string;
  category: string;
  itemName: string;
  quantity: number;
  actualCost: number;
  estimatedCost: number;
  variance: number;
  supplierId: number;
  completedDate: Date;
  satisfaction: number;
  lessons: string[];
}

export interface SupplierPerformance {
  supplierId: number;
  supplierName: string;
  rating: number;
  avgDeliveryTime: number;
  reliabilityScore: number;
  costEfficiency: number;
  qualityScore: number;
  totalOrders: number;
  onTimeDelivery: number;
  defectRate: number;
  responseTime: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  specifications: any;
  template: any;
}

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
  getMarketInsightByCategory(category: string): Promise<MarketInsight | undefined>;
  createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight>;

  // Extracted Data Management
  saveExtractedData(requestId: number, data: any): Promise<void>;
  getExtractedData(requestId: number): Promise<{ data: any; extractionDate: Date; status: string } | null>;
  clearExtractedData(requestId: number): Promise<void>;

  // New v2.0 Methods - קטגוריות רכש
  getProcurementCategories(): Promise<ProcurementCategory[]>;
  getProcurementCategory(id: string): Promise<ProcurementCategory | undefined>;
  getProcurementCategoriesByName(name: string): Promise<ProcurementCategory[]>;

  // New v2.0 Methods - רכישות היסטוריות
  getHistoricalProcurements(): Promise<HistoricalProcurement[]>;
  getHistoricalProcurementsByCategory(category: string): Promise<HistoricalProcurement[]>;
  getHistoricalProcurementsBySupplierId(supplierId: number): Promise<HistoricalProcurement[]>;

  // New v2.0 Methods - ביצועי ספקים
  getSupplierPerformance(): Promise<SupplierPerformance[]>;
  getSupplierPerformanceById(supplierId: number): Promise<SupplierPerformance | undefined>;
  getBestPerformingSuppliers(limit: number): Promise<SupplierPerformance[]>;

  // New v2.0 Methods - תבניות מסמכים
  getDocumentTemplates(): Promise<DocumentTemplate[]>;
  getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined>;
  getDocumentTemplatesByCategory(category: string): Promise<DocumentTemplate[]>;

  // Admin functions for demo reset
  resetAllRequestsStatus(): Promise<{ totalRequests: number; updatedRequests: number }>;
  resetAllCostEstimations(): Promise<{ totalEstimations: number; clearedEstimations: number }>;
  resetAllAIData(): Promise<{
    clearedEstimations: number;
    clearedExtractedData: number;
    clearedDocumentAnalysis: number;
    updatedRequests: number;
  }>;

  // Method to execute raw SQL queries (for production database operations)
  executeSQL(query: string, params?: any[]): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private procurementRequests: Map<number, ProcurementRequest>;
  private suppliers: Map<number, Supplier>;
  private costEstimations: Map<number, CostEstimation>;
  private supplierQuotes: Map<number, SupplierQuote>;
  private documents: Map<number, Document>;
  private marketInsights: Map<number, MarketInsight>;
  private currentId: number;

  // New v2.0 Collections
  public procurementCategories: Map<string, ProcurementCategory>;
  public historicalProcurements: Map<string, HistoricalProcurement>;
  public supplierPerformance: Map<number, SupplierPerformance>;
  public documentTemplates: Map<string, DocumentTemplate>;

  constructor() {
    this.users = new Map();
    this.procurementRequests = new Map();
    this.suppliers = new Map();
    this.costEstimations = new Map();
    this.supplierQuotes = new Map();
    this.documents = new Map();
    this.marketInsights = new Map();
    this.currentId = 1;

    // Initialize new v2.0 collections
    this.procurementCategories = new Map();
    this.historicalProcurements = new Map();
    this.supplierPerformance = new Map();
    this.documentTemplates = new Map();

    this.seedData();
  }

  private seedData() {
    // Create default user
    const defaultUser: User = {
      id: this.currentId++,
      username: "admin",
      password: "password",
      displayName: "אהרון כהן",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

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
        category: "חומרה - מחשבים",
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
        category: "ריהוט משרדי",
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
        category: "חומרה - שרתים",
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
        category: "שירותים",
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
        category: "שירותים",
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
        category: "שירותים",
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
        category: "שירותים",
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
        category: "מוצרים",
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
        category: "מוצרים",
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
        category: "מוצרים",
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
        category: "מוצרים",
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
        procurementRequestId: 5, // REQ-2024-001 - מחשבים ניידים
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
        procurementRequestId: 5, // REQ-2024-001 - מחשבים ניידים
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
        procurementRequestId: 7, // שרתי Dell PowerEdge
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
      category: "חומרה - שרתים",
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

    // New v2.0 Data Seeding
    this.seedProcurementCategories();
    this.seedHistoricalProcurements();
    this.seedSupplierPerformance();
    this.seedDocumentTemplates();
  }

  private seedProcurementCategories() {
    const categories: ProcurementCategory[] = [
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

    categories.forEach(category => this.procurementCategories.set(category.id, category));
  }

  private seedHistoricalProcurements() {
    const historical: HistoricalProcurement[] = [
      {
        id: "HIST-001",
        requestNumber: "REQ-2023-050",
        category: "IT001",
        itemName: "מחשבים ניידים Dell Latitude 5530",
        quantity: 15,
        actualCost: 78000,
        estimatedCost: 75000,
        variance: 4.0,
        supplierId: 1,
        completedDate: new Date("2023-06-15"),
        satisfaction: 4.2,
        lessons: ["הוסף זמן להובלה", "בדוק זמינות מלאי מראש"]
      },
      {
        id: "HIST-002",
        requestNumber: "REQ-2023-051",
        category: "FURN01",
        itemName: "כסאות ארגונומיים למשרד",
        quantity: 40,
        actualCost: 62000,
        estimatedCost: 60000,
        variance: 3.3,
        supplierId: 3,
        completedDate: new Date("2023-07-20"),
        satisfaction: 4.0,
        lessons: ["בדוק איכות ריפוד", "השווה מחירים"]
      },
      {
        id: "HIST-003",
        requestNumber: "REQ-2023-052",
        category: "IT002",
        itemName: "שרתי Dell PowerEdge R450",
        quantity: 2,
        actualCost: 120000,
        estimatedCost: 115000,
        variance: 4.3,
        supplierId: 2,
        completedDate: new Date("2023-08-10"),
        satisfaction: 4.8,
        lessons: ["התקנה מורכבת יותר", "דרוש יותר זמן הכנה"]
      },
      {
        id: "HIST-004",
        requestNumber: "REQ-2023-053",
        category: "SERV01",
        itemName: "פיתוח מערכת CRM",
        quantity: 1,
        actualCost: 850000,
        estimatedCost: 800000,
        variance: 6.25,
        supplierId: 1,
        completedDate: new Date("2023-12-01"),
        satisfaction: 4.5,
        lessons: ["דרישות השתנו במהלך הפרויקט", "צרכים נוספים התגלו"]
      },
      {
        id: "HIST-005",
        requestNumber: "REQ-2023-054",
        category: "PROD01",
        itemName: "מחשבי עבודה HP EliteDesk",
        quantity: 30,
        actualCost: 180000,
        estimatedCost: 175000,
        variance: 2.9,
        supplierId: 1,
        completedDate: new Date("2023-09-15"),
        satisfaction: 4.3,
        lessons: ["מחיר יציב", "ספק אמין"]
      },
      // הוספת 15 רכישות היסטוריות נוספות
      {
        id: "HIST-006",
        requestNumber: "REQ-2023-055",
        category: "IT001",
        itemName: "מסכי Dell UltraSharp 27 אינץ'",
        quantity: 20,
        actualCost: 45000,
        estimatedCost: 42000,
        variance: 7.1,
        supplierId: 2,
        completedDate: new Date("2023-10-05"),
        satisfaction: 4.6,
        lessons: ["איכות מסך מעולה", "מחיר עלה בגלל ביקוש"]
      },
      {
        id: "HIST-007",
        requestNumber: "REQ-2023-056",
        category: "FURN01",
        itemName: "שולחנות עמידה חשמליים",
        quantity: 12,
        actualCost: 36000,
        estimatedCost: 38000,
        variance: -5.3,
        supplierId: 3,
        completedDate: new Date("2023-11-12"),
        satisfaction: 4.4,
        lessons: ["הנחה בלתי צפויה", "איכות טובה מהצפוי"]
      },
      {
        id: "HIST-008",
        requestNumber: "REQ-2023-057",
        category: "SERV01",
        itemName: "שירותי גיבוי ואבטחה",
        quantity: 1,
        actualCost: 420000,
        estimatedCost: 400000,
        variance: 5.0,
        supplierId: 1,
        completedDate: new Date("2023-12-20"),
        satisfaction: 4.7,
        lessons: ["שירות מעולה", "תוספות שלא חזינו"]
      },
      {
        id: "HIST-009",
        requestNumber: "REQ-2023-058",
        category: "IT002",
        itemName: "מערכת אחסון SAN",
        quantity: 1,
        actualCost: 320000,
        estimatedCost: 310000,
        variance: 3.2,
        supplierId: 2,
        completedDate: new Date("2024-01-08"),
        satisfaction: 4.5,
        lessons: ["התקנה מורכבת", "ביצועים מעולים"]
      },
      {
        id: "HIST-010",
        requestNumber: "REQ-2023-059",
        category: "PROD01",
        itemName: "מדפסות רשת HP LaserJet",
        quantity: 8,
        actualCost: 24000,
        estimatedCost: 25000,
        variance: -4.0,
        supplierId: 1,
        completedDate: new Date("2024-01-15"),
        satisfaction: 4.1,
        lessons: ["מחיר טוב", "התקנה פשוטה"]
      },
      {
        id: "HIST-011",
        requestNumber: "REQ-2022-080",
        category: "CONST01",
        itemName: "שיפוץ משרדים קומה 3",
        quantity: 1,
        actualCost: 280000,
        estimatedCost: 250000,
        variance: 12.0,
        supplierId: 3,
        completedDate: new Date("2022-11-30"),
        satisfaction: 3.8,
        lessons: ["עלויות נסתרות", "לוח זמנים התארך"]
      },
      {
        id: "HIST-012",
        requestNumber: "REQ-2022-081",
        category: "RAW01",
        itemName: "חומרי גלם לייצור Q4",
        quantity: 60,
        actualCost: 195000,
        estimatedCost: 200000,
        variance: -2.5,
        supplierId: 2,
        completedDate: new Date("2022-12-15"),
        satisfaction: 4.3,
        lessons: ["מחיר יציב", "איכות טובה"]
      },
      {
        id: "HIST-013",
        requestNumber: "REQ-2022-082",
        category: "FLEET01",
        itemName: "רכבי מסחרי צי החברה",
        quantity: 5,
        actualCost: 425000,
        estimatedCost: 450000,
        variance: -5.6,
        supplierId: 1,
        completedDate: new Date("2023-01-20"),
        satisfaction: 4.6,
        lessons: ["הנחת כמות", "שירות מעולה"]
      },
      {
        id: "HIST-014",
        requestNumber: "REQ-2022-083",
        category: "IT001",
        itemName: "טאבלטים לעובדי שטח",
        quantity: 25,
        actualCost: 87000,
        estimatedCost: 85000,
        variance: 2.4,
        supplierId: 2,
        completedDate: new Date("2023-02-10"),
        satisfaction: 4.2,
        lessons: ["מגן נוסף נדרש", "באטרי טוב"]
      },
      {
        id: "HIST-015",
        requestNumber: "REQ-2022-084",
        category: "SERV01",
        itemName: "ייעוץ ארגוני ושיפור תהליכים",
        quantity: 1,
        actualCost: 520000,
        estimatedCost: 500000,
        variance: 4.0,
        supplierId: 3,
        completedDate: new Date("2023-03-25"),
        satisfaction: 4.4,
        lessons: ["תוצאות מעולות", "כדאי להמשיך"]
      },
      {
        id: "HIST-016",
        requestNumber: "REQ-2022-085",
        category: "FURN01",
        itemName: "ארונות אחסון למשרד",
        quantity: 15,
        actualCost: 22500,
        estimatedCost: 24000,
        variance: -6.3,
        supplierId: 3,
        completedDate: new Date("2023-04-12"),
        satisfaction: 4.0,
        lessons: ["איכות סבירה", "מחיר זול"]
      },
      {
        id: "HIST-017",
        requestNumber: "REQ-2022-086",
        category: "IT002",
        itemName: "מערכת גיבוי מתקדמת",
        quantity: 1,
        actualCost: 185000,
        estimatedCost: 180000,
        variance: 2.8,
        supplierId: 1,
        completedDate: new Date("2023-05-08"),
        satisfaction: 4.8,
        lessons: ["מערכת מעולה", "תמיכה טובה"]
      },
      {
        id: "HIST-018",
        requestNumber: "REQ-2022-087",
        category: "PROD01",
        itemName: "מכשירי תקשורת אלחוטית",
        quantity: 50,
        actualCost: 95000,
        estimatedCost: 92000,
        variance: 3.3,
        supplierId: 2,
        completedDate: new Date("2023-05-20"),
        satisfaction: 4.3,
        lessons: ["טווח טוב", "קליטה יציבה"]
      },
      {
        id: "HIST-019",
        requestNumber: "REQ-2022-088",
        category: "CONST01",
        itemName: "בניית מחסן עזר",
        quantity: 1,
        actualCost: 650000,
        estimatedCost: 600000,
        variance: 8.3,
        supplierId: 3,
        completedDate: new Date("2023-07-30"),
        satisfaction: 3.9,
        lessons: ["עלויות נוספות", "תוצאה טובה"]
      },
      {
        id: "HIST-020",
        requestNumber: "REQ-2022-089",
        category: "RAW01",
        itemName: "פלסטיק מיוחד לייצור",
        quantity: 35,
        actualCost: 168000,
        estimatedCost: 170000,
        variance: -1.2,
        supplierId: 2,
        completedDate: new Date("2023-08-15"),
        satisfaction: 4.5,
        lessons: ["איכות מעולה", "מחיר יציב"]
      }
    ];

    historical.forEach(hist => this.historicalProcurements.set(hist.id, hist));
  }

  private seedSupplierPerformance() {
    const performance: SupplierPerformance[] = [
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
        rating: 4.5,
        avgDeliveryTime: 30,
        reliabilityScore: 92,
        costEfficiency: 4.2,
        qualityScore: 4.8,
        totalOrders: 28,
        onTimeDelivery: 89,
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
      // 7 ספקים נוספים
      {
        supplierId: 4,
        supplierName: "ריהוט ישראלי בע\"מ",
        rating: 4.2,
        avgDeliveryTime: 25,
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

    performance.forEach(perf => this.supplierPerformance.set(perf.supplierId, perf));
  }

  private seedDocumentTemplates() {
    const templates: DocumentTemplate[] = [
      {
        id: "REQ-2024-001",
        name: "מחשבים ניידים Dell Latitude 5520",
        category: "IT001",
        estimatedCost: 130000,
        specifications: {
          processor: "Intel Core i5",
          memory: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6 FHD",
          quantity: 25
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
        estimatedCost: 200000,
        specifications: {
          processor: "Intel Xeon Silver 4314 (16 cores)",
          memory: "64GB DDR4 ECC",
          storage: "2x 1TB NVMe SSD",
          network: "4x 1GbE + 2x 10GbE",
          quantity: 3
        },
        template: {
          title: "רכש שרתי דאטה סנטר",
          description: "רכש 3 שרתי Dell עבור מרכז הנתונים",
          category: "חומרה - שרתים",
          department: "IT"
        }
      },
      {
        id: "REQ-2024-010",
        name: "מערכת ניהול משאבי אנוש",
        category: "SERV01",
        estimatedCost: 1000000,
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
        estimatedCost: 650000,
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
        estimatedCost: 2500000,
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
        estimatedCost: 700000,
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
        estimatedCost: 250000,
        specifications: {
          processor: "Intel i7 או AMD Ryzen 7",
          ram: "16GB",
          storage: "512GB SSD",
          graphics: "מובנה",
          warranty: "3 שנים",
          quantity: 50
        },
        template: {
          title: "רכש מחשבי עבודה",
          description: "רכש 50 מחשבי עבודה למשרדי החברה החדשים",
          category: "מוצרים",
          department: "משאבי אנוש"
        }
      }
    ];

    templates.forEach(template => this.documentTemplates.set(template.id, template));
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

  async getMarketInsightByCategory(category: string): Promise<MarketInsight | undefined> {
    return Array.from(this.marketInsights.values()).find(
      insight => insight.category === category
    );
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
  async resetAllAIData() {
    console.log('Resetting all AI data and cost estimations...');

    try {
      // Clear all cost estimations
      const clearedEstimations = await this.resetAllCostEstimations();

      // Clear all extracted data from procurement requests
      const clearedExtractedData = await this.clearAllExtractedData();

      // Clear all document analysis
      const clearedDocumentAnalysis = await this.clearAllDocumentAnalysis();

      // Reset all request statuses to 'new'
      const updatedRequests = await this.resetAllRequestsStatus();

      return {
        clearedEstimations: clearedEstimations.clearedEstimations,
        clearedExtractedData,
        clearedDocumentAnalysis,
        updatedRequests: updatedRequests.updatedRequests
      };
    } catch (error) {
      console.error('Error resetting AI data:', error);
      throw error;
    }
  }

  async executeSQL(query: string, params: any[] = []) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // For safety, allow only SELECT, INSERT, UPDATE, DELETE
      const normalizedQuery = query.trim().toLowerCase();
      const allowedCommands = ['select', 'insert', 'update', 'delete'];
      const isAllowed = allowedCommands.some(cmd => normalizedQuery.startsWith(cmd));

      if (!isAllowed) {
        throw new Error('רק שאילתות SELECT, INSERT, UPDATE, DELETE מותרות');
      }

      const result = await this.db.execute(query);
      return result;
    } catch (error) {
      console.error('SQL execution error:', error);
      throw error;
    }
  }

  // New v2.0 Methods Implementation

  // Procurement Categories Methods
  async getProcurementCategories(): Promise<ProcurementCategory[]> {
    return Array.from(this.procurementCategories.values());
  }

  async getProcurementCategory(id: string): Promise<ProcurementCategory | undefined> {
    return this.procurementCategories.get(id);
  }

  async getProcurementCategoriesByName(name: string): Promise<ProcurementCategory[]> {
    return Array.from(this.procurementCategories.values()).filter(
      category => category.name.includes(name)
    );
  }

  // Historical Procurements Methods
  async getHistoricalProcurements(): Promise<HistoricalProcurement[]> {
    return Array.from(this.historicalProcurements.values());
  }

  async getHistoricalProcurementsByCategory(category: string): Promise<HistoricalProcurement[]> {
    return Array.from(this.historicalProcurements.values()).filter(
      procurement => procurement.category === category
    );
  }

  async getHistoricalProcurementsBySupplierId(supplierId: number): Promise<HistoricalProcurement[]> {
    return Array.from(this.historicalProcurements.values()).filter(
      procurement => procurement.supplierId === supplierId
    );
  }

  // Supplier Performance Methods
  async getSupplierPerformance(): Promise<SupplierPerformance[]> {
    return Array.from(this.supplierPerformance.values());
  }

  async getSupplierPerformanceById(supplierId: number): Promise<SupplierPerformance | undefined> {
    return this.supplierPerformance.get(supplierId);
  }

  async getBestPerformingSuppliers(limit: number): Promise<SupplierPerformance[]> {
    return Array.from(this.supplierPerformance.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Document Templates Methods
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return Array.from(this.documentTemplates.values());
  }

  async getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined> {
    return this.documentTemplates.get(id);
  }

  async getDocumentTemplatesByCategory(category: string): Promise<DocumentTemplate[]> {
    return Array.from(this.documentTemplates.values()).filter(
      template => template.category === category
    );
  }

  // Helper methods for resetAllAIData (assuming they exist and are implemented similarly to the others)
  private async clearAllExtractedData(): Promise<number> {
    let count = 0;
    for (const req of this.procurementRequests.values()) {
      if (req.extractedData) {
        req.extractedData = null;
        req.extractionDate = null;
        req.extractionStatus = 'not_extracted';
        count++;
      }
    }
    console.log(`Cleared extracted data from ${count} requests.`);
    return count;
  }

  private async clearAllDocumentAnalysis(): Promise<number> {
    let count = 0;
    for (const doc of this.documents.values()) {
      if (doc.isAnalyzed || doc.analysisResults || doc.extractedSpecs) {
        doc.isAnalyzed = false;
        doc.analysisResults = null;
        doc.extractedSpecs = null;
        count++;
      }
    }
    console.log(`Cleared document analysis from ${count} documents.`);
    return count;
  }
}

export const storage = new MemStorage();